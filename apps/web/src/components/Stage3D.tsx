import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

/**
 * 程序化古戏台三维模型（P6）：
 * 台基 + 台面 + 四根戏台红柱 + 后墙 + 四坡屋顶 + 宝顶 + 匾额
 * 720° 拖拽旋转 / 滚轮缩放（OrbitControls），无外部 glb 依赖
 */
export default function Stage3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xFAF7F2)
    scene.fog = new THREE.Fog(0xFAF7F2, 26, 40)

    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / Math.max(mount.clientHeight, 1), 0.1, 100)
    camera.position.set(9, 6.5, 11)
    camera.lookAt(0, 2, 0)

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
    controls.maxDistance = 32
    controls.maxPolarAngle = Math.PI / 2.05
    controls.target.set(0, 2, 0)

    // ---- 灯光 ----
    scene.add(new THREE.AmbientLight(0xfff8ee, 0.6))
    const sun = new THREE.DirectionalLight(0xfff2e0, 1.2)
    sun.position.set(7, 12, 6)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    scene.add(sun)
    const fill = new THREE.PointLight(0xd4a017, 0.55, 24)
    fill.position.set(-5, 6, -4)
    scene.add(fill)

    // ---- 地面 ----
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(28, 28),
      new THREE.MeshStandardMaterial({ color: 0xe9dcc4, roughness: 0.95 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    // ---- 戏台模型 ----
    const stage = new THREE.Group()

    // 台基
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(6.4, 1.1, 5.4),
      new THREE.MeshStandardMaterial({ color: 0x8a6f5a, roughness: 0.9 })
    )
    base.position.y = 0.55
    base.castShadow = true
    base.receiveShadow = true
    stage.add(base)

    // 台面（略外挑）
    const deck = new THREE.Mesh(
      new THREE.BoxGeometry(7, 0.16, 6),
      new THREE.MeshStandardMaterial({ color: 0x9c7c5b, roughness: 0.85 })
    )
    deck.position.y = 1.1
    deck.receiveShadow = true
    stage.add(deck)

    // 四根台柱（戏台红）
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xA3232B, roughness: 0.55 })
    const pillarGeo = new THREE.CylinderGeometry(0.17, 0.22, 3.4, 20)
    ;[
      [-2.8, 2.6], [2.8, 2.6], [-2.8, -1.6], [2.8, -1.6],
    ].forEach(([x, z]) => {
      const p = new THREE.Mesh(pillarGeo, pillarMat)
      p.position.set(x, 2.7, z)
      p.castShadow = true
      stage.add(p)
    })

    // 后墙（半开放台口）
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(7.2, 3.6, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x6b4a3a, roughness: 0.9 })
    )
    wall.position.set(0, 3.3, -3.05)
    wall.castShadow = true
    stage.add(wall)

    // 四坡屋顶（四棱锥近似）
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x4a3b33, roughness: 0.5 })
    const roof = new THREE.Mesh(new THREE.ConeGeometry(5.6, 1.9, 4), roofMat)
    roof.position.y = 5.35
    roof.rotation.y = Math.PI / 4
    roof.castShadow = true
    stage.add(roof)

    // 宝顶（湘昆金）
    const finial = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xD4A017, metalness: 0.7, roughness: 0.25 })
    )
    finial.position.y = 6.4
    stage.add(finial)

    // 匾额
    const plaque = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.55, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x2b1d1a, roughness: 0.7 })
    )
    plaque.position.set(0, 4.0, 2.98)
    stage.add(plaque)

    scene.add(stage)

    // ---- 动画循环 ----
    let raf = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // ---- 自适应 ----
    const onResize = () => {
      const w = mount.clientWidth
      const h = Math.max(mount.clientHeight, 1)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
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

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}
