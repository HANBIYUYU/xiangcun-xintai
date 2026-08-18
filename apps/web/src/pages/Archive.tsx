import PageLayout from '../components/PageLayout';

export default function ArchivePage() {
  return (
    <PageLayout title="戏台数字档案馆" backTo="/" backLabel="返回首页">
      <div className="page-heading">
        <h1 className="text-h1">戏台数字档案馆</h1>
        <p className="text-body">
          收录桂阳古戏台的历史沿革、建筑形制、红色故事与影像资料，构建可检索、可溯源、可共享的数字档案体系。
        </p>
      </div>
      <div className="placeholder-note">
        档案筛选列表 P5 实现：将支持按年代、地域、红色属性、建筑形制等条件筛选，并可进入单座戏台的详情页。
      </div>
    </PageLayout>
  );
}
