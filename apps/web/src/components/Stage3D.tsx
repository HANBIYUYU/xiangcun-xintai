import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

/**
 * 三维古戏台模型（P6/P16）：
 * 优先加载真实 OBJ 低模（/assets/models/stage.obj），自动适配尺寸/居中/落位 + 默认木质观感，
 * 待 MTL/贴图接入后恢复真实材质；加载失败回退程序化戏台。
 * 720° 拖拽旋转 / 滚轮缩放（OrbitControls）。
 *
 * 说明：不用 three 的 OBJLoader——该文件会被其误解析成 LineSegments（0 实体面），
 * 故内置轻量解析器：仅支持 v / f（含 v/vt/vn 与负索引），n 边形按扇形三角化。
 */
const MODEL_URL = '/assets/models/stage.obj'

/** 轻量 OBJ 解析 → 非索引三角面 BufferGeometry（顶点位置 + 重算法线） */
function parseObjGeometry(text: string): THREE.BufferGeometry {
  const verts: number[] = []
  const faces: number[][] = []
  for (const raw of text.split(/\r?\n/)) {
    const t = raw.trim()
    if (!t) continue
    if (t.startsWith('v ')) {
      const p = t.split(/\s+/).slice(1, 4).map(Number)
      if (p.length === 3 && p.every(Number.isFinite)) verts.push(p[0], p[1], p[2])
    } else if (t.startsWith('f ')) {
      const tokens = t.split(/\s+/).slice(1)
      const n = verts.length / 3
      const idx: number[] = []
      for (const s of tokens) {
        const i = parseInt(s.split('/')[0], 10)
        if (Number.isNaN(i)) continue
        const resolved = i > 0 ? i - 1 : n + i // 支持负索引（相对当前末尾）
        if (resolved >= 0 && resolved < n) idx.push(resolved)
      }
      if (idx.length >= 3) faces.push(idx)
    }
  }

  const pos: number[] = []
  const add = (i: number) => {
    pos.push(verts[i * 3], verts[i * 3 + 1], verts[i * 3 + 2])
  }
  for (const f of faces) {
    for (let k = 1; k < f.length - 1; k++) {
      add(f[0]); add(f[k]); add(f[k + 1]) // n 边形扇形三角化（含四边形）
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.computeVertexNormals()
  geo.computeBoundingBox()
  return geo
}

/** 自动适配：等比缩放到目标尺寸、水平居中、底部贴地 */
function fitModel(group: THREE.Object3D, target = 7.6) {
  group.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(group)
  if (box.isEmpty()) return
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z) || 1
  group.scale.setScalar(target / maxDim)
  group.updateMatrixWorld(true)
  const b2 = new THREE.Box3().setFromObject(group)
  group.position.x -= (b2.min.x + b2.max.x) / 2
  group.position.z -= (b2.min.z + b2.max.z) / 2
  group.position.y -= b2.min.y - 0.12
}

/** 程序化古戏台（OBJ 缺失/加载失败时的兜底） */
function buildProceduralStage(): THREE.Group {
  const stage = new THREE.Group()
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(6.4, 1.1, 5.4),
    new THREE.MeshStandardMaterial({ color: 0x8a6f5a, roughness: 0.9 })
  )
  base.position.y = 0.55
  base.castShadow = base.receiveShadow = true
  stage.add(base)

  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(7, 0.16, 6),
    new THREE.MeshStandardMaterial({ color: 0x9c7c5b, roughness: 0.85 })
  )
  deck.position.y = 1.1
  deck.receiveShadow = true
  stage.add(deck)

  const pillarMat = new THREE.MeshStandardMaterial({ color: 0xA3232B, roughness: 0.55 })
  const pillarGeo = new THREE.CylinderGeometry(0.17, 0.22, 3.4, 20)
  ;[[-2.8, 2.6], [2.8, 2.6], [-2.8, -1.6], [2.8, -1.6]].forEach(([x, z]) => {
    const p = new THREE.Mesh(pillarGeo, pillarMat)
    p.position.set(x, 2.7, z)
    p.castShadow = true
    stage.add(p)
  })

  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(7.2, 3.6, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x6b4a3a, roughness: 0.9 })
  )
  wall.position.set(0, 3.3, -3.05)
  wall.castShadow = true
  stage.add(wall)

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(5.6, 1.9, 4),
    new THREE.MeshStandardMaterial({ color: 0x4a3b33, roughness: 0.5 })
  )
  roof.position.y = 5.35
  roof.rotation.y = Math.PI / 4
  roof.castShadow = true
  stage.add(roof)

  const finial = new THREE.Mesh(
    new THREE.SphereGeometry(0.26, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xD4A017, metalness: 0.7, roughness: 0.25 })
  )
  finial.position.y = 6.4
  stage.add(finial)

  const plaque = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.55, 0.12),
    new THREE.MeshStandardMaterial({ color: 0x2b1d1a, roughness: 0.7 })
  )
  plaque.position.set(0, 4.0, 2.98)
  stage.add(plaque)
  return stage
}

export default function Stage3D() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let disposed = false

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xFAF7F2)
    scene.fog = new THREE.Fog(0xFAF7F2, 30, 46)

    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / Math.max(mount.clientHeight, 1), 0.1, 200)
    camera.position.set(9.5, 6.5, 11.5)
    camera.lookAt(0, 2.2, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mount.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 4.5
    controls.maxDistance = 60
    controls.maxPolarAngle = Math.PI / 2.05
    controls.target.set(0, 2.2, 0)

    // ---- 灯光 ----
    scene.add(new THREE.AmbientLight(0xfff8ee, 0.7))
    const sun = new THREE.DirectionalLight(0xfff2e0, 1.4)
    sun.position.set(7, 14, 6)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    sun.shadow.camera.left = sun.shadow.camera.right = sun.shadow.camera.top = sun.shadow.camera.bottom = 12
    scene.add(sun)
    const fill = new THREE.PointLight(0xd4a017, 0.5, 30)
    fill.position.set(-6, 7, -5)
    scene.add(fill)
    const rim = new THREE.DirectionalLight(0xffffff, 0.35)
    rim.position.set(-6, 4, -8)
    scene.add(rim)

    // ---- 地面 ----
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.MeshStandardMaterial({ color: 0xe9dcc4, roughness: 0.95 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    // ---- 加载模型：自研 OBJ 解析优先，失败回退程序化 ----
    const addToScene = (root: THREE.Object3D, fromObj: boolean) => {
      if (disposed) return
      fitModel(root)
      scene.add(root)
      if (fromObj) {
        let meshes = 0
        let tris = 0
        root.traverse((m) => {
          if ((m as THREE.Mesh).isMesh) {
            meshes++
            const g = (m as THREE.Mesh).geometry as THREE.BufferGeometry
            tris += (g.attributes.position ? g.attributes.position.count : 0) / 3
          }
        })
        console.log(`[Stage3D] OBJ 解析成功：${meshes} 个 mesh / ${Math.round(tris)} 个三角面`)
      } else {
        console.warn('[Stage3D] OBJ 加载失败，回退程序化戏台')
      }
      setReady(true)
    }

    fetch(MODEL_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.text()
      })
      .then((txt) => {
        if (disposed) return
        const geo = parseObjGeometry(txt)
        const mesh = new THREE.Mesh(
          geo,
          new THREE.MeshStandardMaterial({
            color: 0x9c7c5b, roughness: 0.85, metalness: 0.05,
            side: THREE.DoubleSide,
          })
        )
        mesh.castShadow = true
        mesh.receiveShadow = true
        const group = new THREE.Group()
        group.name = 'stage-obj'
        group.add(mesh)
        addToScene(group, true)
      })
      .catch((err) => {
        console.warn('[Stage3D] OBJ 加载异常：', err)
        if (!disposed) addToScene(buildProceduralStage(), false)
      })

    // ---- 动画循环 ----
    let raf = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const w = mount.clientWidth
      const h = Math.max(mount.clientHeight, 1)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      controls.dispose()
      renderer.dispose()
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement)
      }
      scene.clear()
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      {!ready && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', gap: 10,
          alignItems: 'center', justifyContent: 'center', background: 'rgba(250,247,242,0.82)',
          color: '#7A5A52', fontSize: 15,
        }}>
          <span style={{ fontSize: 22 }}>⏳</span>
          正在加载三维模型…
        </div>
      )}
    </div>
  )
}
