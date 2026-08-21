import { useEffect, useMemo, useState } from 'react';
import {
  Card, Tag, Button, InputNumber, Drawer, Form, Input, Radio, Space, Spin, Empty, message, Badge, Divider,
} from 'antd';
import { ShoppingCartOutlined, DeleteOutlined } from '@ant-design/icons';
import PageLayout from '../components/PageLayout';
import { productsAPI, ordersAPI, couponsAPI } from '../api';

interface Product { id: number; title: string; category: string; price: number; stock: number; cover_url: string; description: string; revenue_note: string }

const CAT_TABS = [
  { label: '全部', value: '' },
  { label: '文创', value: '文创' },
  { label: '农特产', value: '农特产' },
];

/** 乡韵文创助农商城（P10）：商品列表 + 购物车 + 下单（优惠券抵扣 / 自提配送） */
export default function MallPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    productsAPI.list(category ? { category } : {})
      .then((res: any) => setProducts(res.list || []))
      .catch(() => message.error('商品加载失败'))
      .finally(() => setLoading(false));
  }, [category]);

  const cartItems = useMemo(() =>
    products.filter((p) => cart[p.id])
      .map((p) => ({ ...p, qty: cart[p.id] })),
  [products, cart]);

  const cartTotal = cartItems.reduce((s, it) => s + it.price * it.qty, 0);
  const cartCount = cartItems.reduce((s, it) => s + it.qty, 0);

  const setQty = (id: number, qty: number) => {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  };

  return (
    <PageLayout title="乡韵文创助农商城" backTo="/" backLabel="返回首页">
      <div className="page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-h1">乡韵文创助农商城</h1>
          <p className="text-body">
            古戏台文创 + 桂阳本地农特产，农户代销，收益反哺戏台修缮。
          </p>
        </div>
        <Badge count={cartCount} size="small">
          <Button icon={<ShoppingCartOutlined />} onClick={() => setCartOpen(true)}>购物车</Button>
        </Badge>
      </div>

      {/* 分类切换 */}
      <Space style={{ marginBottom: 16 }}>
        {CAT_TABS.map((t) => (
          <Button key={t.value} size="small" type={category === t.value ? 'primary' : 'default'} onClick={() => setCategory(t.value)}>
            {t.label}
          </Button>
        ))}
      </Space>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
      ) : products.length === 0 ? (
        <Empty description="暂无商品" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {products.map((p) => (
            <Card
              key={p.id}
              size="small"
              cover={
                <div style={{ height: 150, background: 'linear-gradient(135deg,#A3232B,#C0392B)', overflow: 'hidden' }}>
                  {p.cover_url
                    ? <img src={p.cover_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : null}
                </div>
              }
              actions={[
                <Button key="add" type="link" size="small" onClick={() => setQty(p.id, (cart[p.id] || 0) + 1)}>
                  加入购物车
                </Button>,
              ]}
            >
              <Card.Meta
                title={<span>{p.title} <Tag color={p.category === '文创' ? 'volcano' : 'green'}>{p.category}</Tag></span>}
                description={
                  <>
                    <div style={{ color: '#A3232B', fontSize: 16, fontWeight: 600, margin: '4px 0' }}>¥{p.price}</div>
                    <div style={{ color: '#999', fontSize: 12 }}>{p.revenue_note}</div>
                  </>
                }
              />
            </Card>
          ))}
        </div>
      )}

      {/* 购物车抽屉 */}
      <Drawer title={`购物车（${cartCount} 件）`} open={cartOpen} onClose={() => setCartOpen(false)} width={380}>
        {cartItems.length === 0 ? (
          <Empty description="购物车是空的" />
        ) : (
          <>
            {cartItems.map((it) => (
              <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{it.title}</div>
                  <div style={{ color: '#A3232B' }}>¥{it.price} × {it.qty} = ¥{(it.price * it.qty).toFixed(2)}</div>
                </div>
                <Space>
                  <InputNumber size="small" min={0} max={it.stock} value={it.qty} onChange={(v) => setQty(it.id, v || 0)} />
                  <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => setQty(it.id, 0)} />
                </Space>
              </div>
            ))}
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16 }}>
              <b>合计</b>
              <b style={{ color: '#A3232B' }}>¥{cartTotal.toFixed(2)}</b>
            </div>
            <Button type="primary" block style={{ marginTop: 16 }} disabled={cartItems.length === 0} onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>
              去结算
            </Button>
          </>
        )}
      </Drawer>

      {/* 结算抽屉 */}
      <CheckoutDrawer
        open={checkoutOpen}
        items={cartItems}
        total={cartTotal}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={() => { setCart({}); setCheckoutOpen(false); }}
      />
    </PageLayout>
  );
}

/* ---------------- 结算 ---------------- */
function CheckoutDrawer({ open, items, total, onClose, onSuccess }: {
  open: boolean; items: { id: number; title: string; price: number; qty: number }[]
  total: number; onClose: () => void; onSuccess: () => void
}) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [couponPreview, setCouponPreview] = useState<{ type: string; value: number } | null>(null);

  const couponCode = Form.useWatch('coupon_code', form);

  const checkCoupon = async () => {
    if (!couponCode) { setCouponPreview(null); return; }
    try {
      const res: any = await couponsAPI.verify(couponCode);
      if (res.valid) setCouponPreview(res.coupon);
    } catch {
      setCouponPreview(null);
      message.warning('优惠券无效或已使用');
    }
  };

  const finalTotal = useMemo(() => {
    if (!couponPreview) return total;
    if (couponPreview.type === '立减') return Math.max(0, total - couponPreview.value);
    return Math.round(total * couponPreview.value * 100) / 100;
  }, [total, couponPreview]);

  const onFinish = async (v: any) => {
    setSubmitting(true);
    try {
      const payload = {
        items: items.map((it) => ({ title: it.title, qty: it.qty, price: it.price })),
        coupon_code: v.coupon_code || '',
        pickup_type: v.pickup_type,
        contact: v.contact,
      };
      const res: any = await ordersAPI.create(payload);
      message.success(`下单成功！订单号 ${res.order_no}，实付 ¥${res.total.toFixed(2)}`);
      form.resetFields();
      setCouponPreview(null);
      onSuccess();
    } catch (e: any) {
      message.error(e?.error || '下单失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer title="确认订单" open={open} onClose={onClose} width={420}>
      {items.length === 0 ? (
        <Empty description="请先选择商品" />
      ) : (
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ pickup_type: '自提' }}>
          {items.map((it) => (
            <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span>{it.title} × {it.qty}</span>
              <span>¥{(it.price * it.qty).toFixed(2)}</span>
            </div>
          ))}
          <Divider style={{ margin: '8px 0' }} />
          <Form.Item name="contact" label="联系人及电话" rules={[{ required: true, message: '请填写联系人' }]}>
            <Input placeholder="姓名 + 手机号" />
          </Form.Item>
          <Form.Item name="pickup_type" label="提货方式">
            <Radio.Group>
              <Radio.Button value="自提">线下自提</Radio.Button>
              <Radio.Button value="配送">同城配送</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="coupon_code" label="优惠券码（选填）">
            <Space.Compact style={{ width: '100%' }}>
              <Input placeholder="如：XC2026A001" onBlur={checkCoupon} />
              <Button onClick={checkCoupon}>验证</Button>
            </Space.Compact>
          </Form.Item>
          {couponPreview && (
            <div style={{ color: '#52c41a', marginBottom: 8 }}>
              已抵扣：{couponPreview.type === '立减' ? `立减 ¥${couponPreview.value}` : `${couponPreview.value * 10} 折`}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, margin: '8px 0 16px' }}>
            <b>应付金额</b>
            <b style={{ color: '#A3232B' }}>¥{finalTotal.toFixed(2)}</b>
          </div>
          <Button type="primary" htmlType="submit" loading={submitting} block>提交订单</Button>
          <div style={{ color: '#999', fontSize: 12, marginTop: 12 }}>
            订单 = 预约单 + 线下自提/同城配送，暂不支持线上支付；农特产收益按商品标注比例反哺戏台修缮。
          </div>
        </Form>
      )}
    </Drawer>
  );
}
