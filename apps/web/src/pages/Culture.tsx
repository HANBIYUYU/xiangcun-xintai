import { Tabs } from 'antd';
import PageLayout from '../components/PageLayout';

function TabPlaceholder({ text }: { text: string }) {
  return <div className="placeholder-note">{text}</div>;
}

export default function CulturePage() {
  const items = [
    {
      key: 'plays',
      label: '红色戏曲',
      children: <TabPlaceholder text="红色戏曲剧目与唱段内容，P2 实现" />,
    },
    {
      key: 'reading',
      label: '互动阅读',
      children: <TabPlaceholder text="红色互动阅读内容，P2 实现" />,
    },
    {
      key: 'activities',
      label: '活动预告',
      children: <TabPlaceholder text="活动预告列表，P2 实现" />,
    },
  ];

  return (
    <PageLayout title="红色湘昆文化馆" backTo="/" backLabel="返回首页">
      <div className="page-heading">
        <h1 className="text-h1">红色湘昆文化馆</h1>
        <p className="text-body">
          汇聚红色戏曲、互动阅读与活动预告，让湘昆非遗在红色文化语境中焕发新生。
        </p>
      </div>
      <Tabs items={items} />
    </PageLayout>
  );
}
