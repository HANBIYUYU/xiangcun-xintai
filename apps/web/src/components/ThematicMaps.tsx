import { useEffect, useRef, useState } from 'react'

type ThematicMapItem = {
  id: number
  title: string
  description: string
  image: string
}

const thematicMaps: ThematicMapItem[] = [
  {
    id: 1,
    title: '古戏台乡镇分布图',
    description:
      '展示桂阳县古戏台在不同乡镇中的空间分布特征，直观反映古戏台资源的地域差异与集中区域。',
    image:
      '/api/files/maps/01_古戏台乡镇分布图.png',
  },
  {
    id: 2,
    title: '古戏台年代分布图',
    description:
      '依据古戏台建筑时代进行分类展示，呈现不同历史时期古戏台遗存的空间分布及历史延续特征。',
    image:
      '/api/files/maps/02_古戏台年代分布图.png',
  },
  {
    id: 3,
    title: '古戏台文保等级分布图',
    description:
      '按照国家级、省级、市级、县级及暂无文保等级进行分类，呈现古戏台文化遗产保护层级的空间格局。',
    image:
      '/api/files/maps/03_古戏台文保等级分布图.png',
  },
  {
    id: 4,
    title: '古戏台空间集聚分析图',
    description:
      '基于空间分析识别古戏台资源的集聚区域与相对稀疏区域，展示古戏台空间分布的集聚特征。',
    image:
      '/api/files/maps/04_古戏台空间集聚分析图.png',
  },
  {
    id: 5,
    title: '古戏台保存状态专题图',
    description:
      '结合实地调查记录展示古戏台保存状况，为保护、修缮与活化利用提供空间参考。',
    image:
      '/api/files/maps/05_古戏台保存状态专题图.png',
  },
  {
    id: 6,
    title: '古戏台研学文旅推荐线路图',
    description:
      '综合古戏台资源价值、空间位置与文旅条件构建研学推荐线路，为传统文化体验与乡村文旅开发提供参考。',
    image:
      '/api/files/maps/06_古戏台研学文旅推荐线路图.png',
  },
]

const MIN_SCALE = 1
const MAX_SCALE = 4
const SCALE_STEP = 0.25

export default function ThematicMaps() {
  const [selectedMap, setSelectedMap] =
    useState<ThematicMapItem | null>(null)

  const [scale, setScale] = useState(1)

  const [offset, setOffset] = useState({
    x: 0,
    y: 0,
  })

  const [isDragging, setIsDragging] =
    useState(false)

  const dragStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    offsetX: 0,
    offsetY: 0,
  })

  const resetView = () => {
    setScale(1)

    setOffset({
      x: 0,
      y: 0,
    })

    setIsDragging(false)
  }

  const openMap = (map: ThematicMapItem) => {
    resetView()
    setSelectedMap(map)
  }

  const closeMap = () => {
    setSelectedMap(null)
    resetView()
  }

  const zoomIn = () => {
    setScale((current) =>
      Math.min(
        MAX_SCALE,
        Number(
          (
            current + SCALE_STEP
          ).toFixed(2)
        )
      )
    )
  }

  const zoomOut = () => {
    setScale((current) => {
      const next = Math.max(
        MIN_SCALE,
        Number(
          (
            current - SCALE_STEP
          ).toFixed(2)
        )
      )

      if (next === 1) {
        setOffset({
          x: 0,
          y: 0,
        })
      }

      return next
    })
  }

  const handleWheel = (
    event: React.WheelEvent<HTMLDivElement>
  ) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.deltaY < 0) {
      setScale((current) =>
        Math.min(
          MAX_SCALE,
          Number(
            (
              current + SCALE_STEP
            ).toFixed(2)
          )
        )
      )
    } else {
      setScale((current) => {
        const next = Math.max(
          MIN_SCALE,
          Number(
            (
              current - SCALE_STEP
            ).toFixed(2)
          )
        )

        if (next === 1) {
          setOffset({
            x: 0,
            y: 0,
          })
        }

        return next
      })
    }
  }

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (scale <= 1) {
      return
    }

    event.preventDefault()

    event.currentTarget.setPointerCapture(
      event.pointerId
    )

    dragStartRef.current = {
      mouseX: event.clientX,
      mouseY: event.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
    }

    setIsDragging(true)
  }

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!isDragging || scale <= 1) {
      return
    }

    const deltaX =
      event.clientX -
      dragStartRef.current.mouseX

    const deltaY =
      event.clientY -
      dragStartRef.current.mouseY

    setOffset({
      x:
        dragStartRef.current.offsetX +
        deltaX,
      y:
        dragStartRef.current.offsetY +
        deltaY,
    })
  }

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      )
    }

    setIsDragging(false)
  }

  useEffect(() => {
    if (!selectedMap) {
      document.body.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === 'Escape') {
        closeMap()
      }

      if (
        event.key === '+' ||
        event.key === '='
      ) {
        zoomIn()
      }

      if (event.key === '-') {
        zoomOut()
      }

      if (event.key === '0') {
        resetView()
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown
    )

    return () => {
      document.body.style.overflow = ''

      window.removeEventListener(
        'keydown',
        handleKeyDown
      )
    }
  }, [selectedMap])

  return (
    <>
      <style>
        {`
          .thematic-grid {
            display: grid;
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
            gap: 26px;
          }

          .thematic-card {
            overflow: hidden;
            border:
              1px solid rgba(100, 72, 58, 0.12);
            border-radius: 16px;
            background: #fffcf8;
            box-shadow:
              0 8px 26px rgba(70, 48, 38, 0.07);
            cursor: pointer;
            transition:
              transform 0.22s ease,
              box-shadow 0.22s ease;
          }

          .thematic-card:hover {
            transform: translateY(-4px);
            box-shadow:
              0 14px 36px rgba(70, 48, 38, 0.13);
          }

          .thematic-image-wrap {
            position: relative;
            height: 380px;
            overflow: hidden;
            background: #eee8df;
          }

          .thematic-image {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain;
            transition: transform 0.25s ease;
          }

          .thematic-card:hover
          .thematic-image {
            transform: scale(1.015);
          }

          .thematic-card-content {
            padding: 19px 21px 22px;
          }

          .thematic-tool-button {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 36px;
            min-width: 40px;
            padding: 0 12px;
            border:
              1px solid rgba(80, 58, 48, 0.16);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.94);
            color: #49372f;
            font-family:
              'Microsoft YaHei',
              'PingFang SC',
              sans-serif;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition:
              background 0.15s ease,
              transform 0.15s ease;
          }

          .thematic-tool-button:hover {
            background: #ffffff;
            transform: translateY(-1px);
          }

          @media (max-width: 900px) {
            .thematic-grid {
              grid-template-columns: 1fr;
            }

            .thematic-image-wrap {
              height: 330px;
            }
          }

          @media (max-width: 600px) {
            .thematic-image-wrap {
              height: 270px;
            }

            .thematic-card-content {
              padding: 16px;
            }
          }
        `}
      </style>

      <section
        style={{
          paddingTop: 50,
          paddingBottom: 50,
        }}
      >
        <div
          style={{
            marginBottom: 30,
          }}
        >
          {/* 与全站大标题统一：衬线字体（Hero / 子页 text-h1 同款） */}
          <h2
            style={{
              margin: '0 0 12px',
              fontFamily: 'var(--font-serif)',
              color: '#3E2D27',
              fontSize: 28,
              lineHeight: 1.3,
              fontWeight: 600,
              letterSpacing: '0.04em',
            }}
          >
            专题地图成果
          </h2>

          <p
            style={{
              maxWidth: 850,
              margin: 0,
              color: '#725E53',
              fontSize: 14,
              lineHeight: 1.9,
            }}
          >
            基于古戏台实地调查数据与 ArcGIS
            空间分析成果，从乡镇分布、历史年代、文保等级、空间集聚、
            保存状况及研学文旅线路等维度，对桂阳古戏台文化资源进行专题化表达。
          </p>
        </div>

        <div className="thematic-grid">
          {thematicMaps.map((map) => (
            <article
              key={map.id}
              className="thematic-card"
              onClick={() => openMap(map)}
            >
              <div className="thematic-image-wrap">
                <img
                  className="thematic-image"
                  src={map.image}
                  alt={map.title}
                />

                <div
                  style={{
                    position: 'absolute',
                    right: 14,
                    bottom: 14,
                    padding: '7px 12px',
                    border:
                      '1px solid rgba(255,255,255,0.45)',
                    borderRadius: 20,
                    background:
                      'rgba(55,40,33,0.72)',
                    color: '#FFFFFF',
                    backdropFilter: 'blur(6px)',
                    fontSize: 12,
                  }}
                >
                  点击查看大图
                </div>
              </div>

              <div className="thematic-card-content">
                <div
                  style={{
                    marginBottom: 7,
                    color: '#9B1F1A',
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                  }}
                >
                  MAP{' '}
                  {String(map.id).padStart(
                    2,
                    '0'
                  )}
                </div>

                <h3
                  style={{
                    margin: '0 0 9px',
                    color: '#46342D',
                    fontSize: 20,
                    lineHeight: 1.45,
                    fontWeight: 700,
                  }}
                >
                  {map.title}
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: '#75645A',
                    fontSize: 13,
                    lineHeight: 1.8,
                  }}
                >
                  {map.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {selectedMap && (
        <div
          onClick={closeMap}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            background:
              'rgba(25,18,15,0.90)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              maxWidth: 1500,
              height: '94vh',
              overflow: 'hidden',
              borderRadius: 16,
              background: '#F8F4EE',
              boxShadow:
                '0 24px 70px rgba(0,0,0,0.35)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'space-between',
                gap: 20,
                flexShrink: 0,
                padding:
                  '12px 16px 12px 22px',
                borderBottom:
                  '1px solid rgba(80,55,45,0.10)',
                background: '#F8F4EE',
              }}
            >
              <div>
                <div
                  style={{
                    marginBottom: 3,
                    color: '#9B1F1A',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                  }}
                >
                  THEMATIC MAP{' '}
                  {String(
                    selectedMap.id
                  ).padStart(2, '0')}
                </div>

                <div
                  style={{
                    color: '#41312B',
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  {selectedMap.title}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <button
                  type="button"
                  className="thematic-tool-button"
                  onClick={zoomOut}
                  title="缩小"
                >
                  −
                </button>

                <button
                  type="button"
                  className="thematic-tool-button"
                  onClick={resetView}
                  title="恢复原始比例"
                >
                  {Math.round(scale * 100)}%
                </button>

                <button
                  type="button"
                  className="thematic-tool-button"
                  onClick={zoomIn}
                  title="放大"
                >
                  +
                </button>

                <button
                  type="button"
                  aria-label="关闭"
                  onClick={closeMap}
                  title="关闭"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 38,
                    height: 38,
                    marginLeft: 4,
                    flexShrink: 0,
                    border:
                      '1px solid rgba(90,65,53,0.15)',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    color: '#4C3A32',
                    fontSize: 24,
                    lineHeight: 1,
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            <div
              onWheel={handleWheel}
              onPointerDown={
                handlePointerDown
              }
              onPointerMove={
                handlePointerMove
              }
              onPointerUp={
                handlePointerUp
              }
              onPointerCancel={
                handlePointerUp
              }
              onDoubleClick={resetView}
              style={{
                position: 'relative',
                flex: 1,
                minHeight: 0,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#EAE4DB',
                cursor:
                  scale > 1
                    ? isDragging
                      ? 'grabbing'
                      : 'grab'
                    : 'default',
                touchAction: 'none',
                userSelect: 'none',
              }}
            >
              <img
                src={selectedMap.image}
                alt={selectedMap.title}
                draggable={false}
                style={{
                  display: 'block',
                  maxWidth: '94%',
                  maxHeight: '94%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  transform: `
                    translate(
                      ${offset.x}px,
                      ${offset.y}px
                    )
                    scale(${scale})
                  `,
                  transformOrigin: 'center center',
                  transition: isDragging
                    ? 'none'
                    : 'transform 0.15s ease',
                  pointerEvents: 'none',
                  boxShadow:
                    '0 6px 24px rgba(45,32,26,0.12)',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  left: 16,
                  bottom: 14,
                  padding: '7px 11px',
                  borderRadius: 8,
                  color:
                    'rgba(255,255,255,0.92)',
                  background:
                    'rgba(43,31,26,0.68)',
                  fontSize: 11,
                  lineHeight: 1.5,
                  pointerEvents: 'none',
                }}
              >
                滚轮缩放 · 放大后拖动 ·
                双击恢复
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}