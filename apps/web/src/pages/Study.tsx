import { Button } from 'antd';
import PageLayout from '../components/PageLayout';

export default function StudyPage() {
  return (
    <PageLayout title="研学预约服务中心" backTo="/" backLabel="返回首页">
      <div className="page-heading">
        <h1 className="text-h1">研学预约服务中心</h1>
        <p className="text-body">
          面向学校、党团组织与亲子家庭，提供以古戏台为课堂的红色研学与非遗体验课程预约。
        </p>
      </div>
      <div className="placeholder-note" style={{ marginBottom: 24 }}>
        预约表单与档期查询 P8 实现。
      </div>
      <Button type="primary" size="large" disabled>
        预约功能 P8 上线
      </Button>
    </PageLayout>
  );
}
