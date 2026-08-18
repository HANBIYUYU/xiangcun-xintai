import PageLayout from '../components/PageLayout';

export default function Hall3DPage() {
  return (
    <PageLayout title="三维古戏台展厅" backTo="/" backLabel="返回首页">
      <div className="page-heading">
        <h1 className="text-h1">三维古戏台展厅</h1>
        <p className="text-body">
          以三维重建与 WebGL 技术还原桂阳古戏台全貌，支持自由视角漫游、构件拆解与红色场景导览。
        </p>
      </div>
      <div className="canvas-placeholder">
        三维展厅画布占位（P6 接入 Three.js）
      </div>
    </PageLayout>
  );
}
