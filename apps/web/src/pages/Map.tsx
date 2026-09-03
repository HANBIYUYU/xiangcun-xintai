import { useEffect, useState } from 'react'
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet'
import type { FeatureCollection, Feature } from 'geojson'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import PageLayout from '../components/PageLayout'
import ThematicMaps from '../components/ThematicMaps'

type StageProperties = {
  OBJECTID?: number
  文保标题?: string
  文保英文标题?: string
  批次?: string | null
  公布时间?: string | null
  文保类型?: string | null
  时代?: string | null
  省?: string | null
  市?: string | null
  详细地址?: string | null
  经度?: string | null
  纬度?: string | null
  是否推荐?: string | null
  图片?: string | null
  Longitude_DD?: number
  Latitude_DD?: number
  Heritage_Level?: string | null
  简介?: string | null
  乡镇?: string | null
}

const heritageStyles: Record<
  string,
  {
    color: string
    radius: number
    label: string
  }
> = {
  国家级: {
    color: '#8E1B16',
    radius: 6.5,
    label: '国家级',
  },
  省级: {
    color: '#B84A3A',
    radius: 6.3,
    label: '省级',
  },
  市级: {
    color: '#D47A3A',
    radius: 5.7,
    label: '市级',
  },
  县级: {
    color: '#C9A14A',
    radius: 5.2,
    label: '县级',
  },
  暂无文保等级: {
    color: '#888888',
    radius: 4,
    label: '暂无文保等级',
  },
}

function safeText(value: unknown, fallback = '暂无') {
  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ''
  ) {
    return fallback
  }

  return String(value)
}

function escapeHtml(value: unknown, fallback = '暂无') {
  return safeText(value, fallback)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function getHeritageStyle(level: unknown) {
  const key = safeText(level, '暂无文保等级')

  return (
    heritageStyles[key] ??
    heritageStyles['暂无文保等级']
  )
}

export default function MapPage() {
  const [stages, setStages] =
    useState<FeatureCollection | null>(null)

  const [county, setCounty] =
    useState<FeatureCollection | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/assets/map/ancient_stages.geojson').then((res) => {
        if (!res.ok) {
          throw new Error(
            `ancient_stages.geojson 加载失败：${res.status}`
          )
        }

        return res.json()
      }),

      fetch('/assets/map/guiyang_county.geojson').then((res) => {
        if (!res.ok) {
          throw new Error(
            `guiyang_county.geojson 加载失败：${res.status}`
          )
        }

        return res.json()
      }),
    ])
      .then(([stageData, countyData]) => {
        setStages(stageData)
        setCounty(countyData)
      })
      .catch((error) => {
        console.error('地图数据加载失败：', error)
      })
  }, [])

  const bindStagePopup = (
    feature: Feature,
    layer: L.Layer
  ) => {
    const props =
      (feature.properties ?? {}) as StageProperties

    const name = escapeHtml(
      props.文保标题,
      '未命名古戏台'
    )

    const englishName = escapeHtml(
      props.文保英文标题,
      ''
    )

    const heritage = escapeHtml(
      props.Heritage_Level,
      '暂无文保等级'
    )

    const batch = escapeHtml(props.批次)
    const publishDate = escapeHtml(props.公布时间)
    const type = escapeHtml(props.文保类型)
    const era = escapeHtml(props.时代)
    const address = escapeHtml(props.详细地址)
    const township = escapeHtml(props.乡镇)
    const intro = escapeHtml(props.简介)

    const imageName = safeText(props.图片, '')

    const imageUrl = imageName
      ? `/api/files/xitai_photos/thumb-${encodeURIComponent(
          imageName
        )}`
      : ''

    const englishNameHtml = englishName
      ? `
        <div
          style="
            margin-top:3px;
            font-size:11px;
            line-height:1.4;
            color:#8A7B73;
          "
        >
          ${englishName}
        </div>
      `
      : ''

    const photoHtml = imageUrl
      ? `
        <div
          style="
            width:100%;
            height:145px;
            overflow:hidden;
            background:#F0EBE4;
          "
        >
          <img
            src="${imageUrl}"
            alt="${name}"
            loading="lazy"
            style="
              display:block;
              width:100%;
              height:100%;
              object-fit:cover;
            "
            onerror="
              this.parentElement.style.display='none'
            "
          />
        </div>
      `
      : ''

    const popupHtml = `
      <div
        style="
          width:min(300px, 70vw);
          font-family:
            'Microsoft YaHei',
            'PingFang SC',
            'Noto Sans SC',
            sans-serif;
          color:#463832;
          background:#FFFCF8;
        "
      >
        ${photoHtml}

        <div
          style="
            padding:14px 16px 15px;
          "
        >
          <div
            style="
              margin-bottom:10px;
              padding-bottom:9px;
              border-bottom:1px solid #E7DACE;
            "
          >
            <div
              style="
                padding-right:15px;
                font-size:18px;
                line-height:1.35;
                font-weight:700;
                color:#751C1A;
              "
            >
              ${name}
            </div>

            ${englishNameHtml}
          </div>

          <div
            style="
              margin-bottom:7px;
              font-size:14px;
              font-weight:700;
              color:#751C1A;
            "
          >
            基本档案
          </div>

          <div
            style="
              display:grid;
              grid-template-columns:68px minmax(0,1fr);
              row-gap:4px;
              column-gap:7px;
              margin-bottom:11px;
              font-size:12px;
              line-height:1.55;
            "
          >
            <div style="font-weight:700;color:#69554A;">
              文保等级
            </div>
            <div>${heritage}</div>

            <div style="font-weight:700;color:#69554A;">
              文保批次
            </div>
            <div>${batch}</div>

            <div style="font-weight:700;color:#69554A;">
              公布时间
            </div>
            <div>${publishDate}</div>

            <div style="font-weight:700;color:#69554A;">
              建筑时代
            </div>
            <div>${era}</div>

            <div style="font-weight:700;color:#69554A;">
              文保类型
            </div>
            <div>${type}</div>

            <div style="font-weight:700;color:#69554A;">
              所属乡镇
            </div>
            <div>${township}</div>

            <div style="font-weight:700;color:#69554A;">
              详细地址
            </div>
            <div>${address}</div>
          </div>

          <div
            style="
              padding-top:10px;
              border-top:1px solid #E7DACE;
            "
          >
            <div
              style="
                margin-bottom:6px;
                font-size:14px;
                font-weight:700;
                color:#751C1A;
              "
            >
              古戏台简介
            </div>

            <div
              style="
                max-height:92px;
                overflow-y:auto;
                padding-right:5px;
                font-size:12px;
                line-height:1.7;
                color:#5E5049;
                text-align:justify;
                text-indent:2em;
              "
            >
              ${intro}
            </div>
          </div>
        </div>
      </div>
    `

    layer.bindPopup(popupHtml, {
      maxWidth: 320,
      minWidth: 270,
      maxHeight: 430,
      autoPan: true,
      keepInView: true,
      autoPanPadding: [55, 55],
      className: 'stage-popup',
    })

    layer.bindTooltip(name, {
      direction: 'top',
      offset: [0, -7],
      opacity: 0.95,
      className: 'stage-tooltip',
    })

    if (layer instanceof L.CircleMarker) {
      const symbol = getHeritageStyle(
        props.Heritage_Level
      )

      layer.on('mouseover', () => {
        layer.setStyle({
          radius: symbol.radius + 2,
          weight: 2,
          color: '#FFFFFF',
          fillColor: symbol.color,
          fillOpacity: 1,
        })

        layer.bringToFront()
      })

      layer.on('mouseout', () => {
        layer.setStyle({
          radius: symbol.radius,
          weight: 1.4,
          color: '#FFFFFF',
          fillColor: symbol.color,
          fillOpacity: 1,
        })
      })
    }
  }

  return (
    <PageLayout background="#F6F1E8">
      {/* 页头：统一大标题（与 Hero 同款衬线字体） */}
      <div className="page-heading">
        <h1 className="text-h1">桂阳古戏台空间图谱</h1>
        <p className="text-body">
          基于实地调查与 ArcGIS 空间数据构建的桂阳县古戏台数字地图
        </p>
      </div>

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '72vh',
          minHeight: 580,
          overflow: 'hidden',
          border: '1px solid rgba(116,80,62,0.10)',
          borderRadius: 20,
          background: '#EDE6DC',
          boxShadow:
            '0 14px 42px rgba(76,52,41,0.10)',
        }}
      >
          <MapContainer
            center={[25.78, 112.76]}
            zoom={10}
            scrollWheelZoom
            style={{
              width: '100%',
              height: '100%',
              zIndex: 1,
            }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {county && (
              <GeoJSON
                data={county}
                style={{
                  color: '#9F211F',
                  weight: 2.2,
                  opacity: 0.9,
                  fillColor: '#A74B42',
                  fillOpacity: 0.045,
                }}
              />
            )}

            {stages && (
              <GeoJSON
                data={stages}
                pointToLayer={(feature, latlng) => {
                  const props =
                    (feature.properties ??
                      {}) as StageProperties

                  const symbol =
                    getHeritageStyle(
                      props.Heritage_Level
                    )

                  return L.circleMarker(latlng, {
                    radius: symbol.radius,
                    color: '#FFFFFF',
                    weight: 1.4,
                    opacity: 1,
                    fillColor: symbol.color,
                    fillOpacity: 1,
                  })
                }}
                onEachFeature={bindStagePopup}
              />
            )}
          </MapContainer>

          <div
            style={{
              position: 'absolute',
              right: 18,
              bottom: 32,
              zIndex: 1000,
              minWidth: 156,
              padding: '13px 15px',
              border: '1px solid rgba(80,56,45,0.13)',
              borderRadius: 10,
              background: 'rgba(255,252,247,0.95)',
              boxShadow:
                '0 6px 20px rgba(60,42,34,0.12)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <div
              style={{
                marginBottom: 9,
                color: '#4B3830',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              文保等级
            </div>

            {Object.values(heritageStyles).map(
              (item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                    minHeight: 25,
                    color: '#665249',
                    fontSize: 12,
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: item.radius * 2,
                      height: item.radius * 2,
                      flexShrink: 0,
                      border: '1px solid #FFFFFF',
                      borderRadius: '50%',
                      background: item.color,
                      boxShadow:
                        '0 0 0 1px rgba(80,60,50,0.12)',
                    }}
                  />

                  <span>{item.label}</span>
                </div>
              )
            )}
          </div>
        </div>
        <div style={{ marginTop: 60 }}>
          <ThematicMaps />
        </div>
    </PageLayout>
  )
}