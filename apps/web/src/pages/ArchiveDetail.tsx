import { useParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout';

export default function ArchiveDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <PageLayout title="戏台详情" backTo="/archive" backLabel="返回档案馆">
      <div className="page-heading">
        <h1 className="text-h1">戏台详情</h1>
        <p className="text-body">当前查看戏台 ID：<strong>{id}</strong></p>
      </div>
      <div className="placeholder-note">
        详情内容 P5 接入 API 后展示：包含历史沿革、建筑形制、红色故事、影像资料与三维模型入口。
      </div>
    </PageLayout>
  );
}
