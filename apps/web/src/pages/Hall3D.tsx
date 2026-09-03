import { useState } from 'react';
import { Button, Drawer, Descriptions, Spin, message } from 'antd';
import { InfoCircleOutlined, FullscreenOutlined } from '@ant-design/icons';
import PageLayout from '../components/PageLayout';
import Stage3D from '../components/Stage3D';
import { stagesAPI } from '../api';

/** 三维古戏台数字展厅（P6）：程序化模型 + 720° 操控 + 介绍弹层 */
export default function Hall3DPage() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const openInfo = async () => {
    setOpen(true);
    if (stage) return;
    setLoading(true);
    stagesAPI.detail(1)
      .then((res: any) => setStage(res))
      .catch((e) => {
        if (e?.error === '戏台不存在') message.info('档案库暂无戏台数据');
        else message.error('戏台档案加载失败');
      })
      .finally(() => setLoading(false));
  };

  const toggleFullscreen = () => {
    const el = document.getElementById('hall-canvas');
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
    } else {
      el.requestFullscreen().catch(() => message.warning('浏览器未允许全屏'));
    }
  };

  return (
    <PageLayout title="三维古戏台展厅" backTo="/" backLabel="返回首页">
      <div className="page-heading">
        <h1 className="text-h1">三维古戏台展厅</h1>
        <p className="text-body">
          真实戏台 OBJ 低模（自动适配视角），支持 720° 自由旋转缩放；当前为默认木质观感，待补 MTL 贴图后恢复真实材质。
        </p>
      </div>

      <div
        id="hall-canvas"
        style={{
          position: 'relative',
          height: 560,
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          background: '#FAF7F2',
        }}
      >
        <Stage3D />
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 8 }}>
          <Button icon={<InfoCircleOutlined />} type="primary" onClick={openInfo}>查看戏台介绍</Button>
          <Button icon={<FullscreenOutlined />} onClick={toggleFullscreen}>全屏</Button>
        </div>
        <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(59,42,38,0.72)', color: '#fff', padding: '6px 16px', borderRadius: 999, fontSize: 13 }}>
          拖拽旋转 · 滚轮缩放 · 右键平移
        </div>
      </div>

      <Drawer
        title={stage ? stage.name : '戏台档案'}
        width={420}
        open={open}
        onClose={() => setOpen(false)}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
        ) : stage ? (
          <>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="所属乡镇">{stage.town || '—'}</Descriptions.Item>
              <Descriptions.Item label="文保等级">{stage.heritage_level || '—'}</Descriptions.Item>
              <Descriptions.Item label="破损程度">{stage.damage || '—'}</Descriptions.Item>
              <Descriptions.Item label="始建年代">{stage.built_year || '—'}</Descriptions.Item>
              <Descriptions.Item label="建筑形制">{stage.style || '—'}</Descriptions.Item>
              <Descriptions.Item label="红色旧址">{stage.is_red_site ? '是' : '否'}</Descriptions.Item>
            </Descriptions>
            {stage.history_text && (
              <div style={{ marginTop: 16 }}>
                <h4 style={{ color: '#A3232B' }}>建筑史料</h4>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{stage.history_text}</p>
              </div>
            )}
            {stage.red_story && (
              <div style={{ marginTop: 16 }}>
                <h4 style={{ color: '#A3232B' }}>红色革命事迹</h4>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{stage.red_story}</p>
              </div>
            )}
          </>
        ) : (
          <p>档案加载失败，可返回档案馆查看戏台详情。</p>
        )}
      </Drawer>
    </PageLayout>
  );
}
