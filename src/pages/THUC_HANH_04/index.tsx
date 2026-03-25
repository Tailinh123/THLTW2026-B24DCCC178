import React, { useState } from 'react';
import { Layout, Menu, Typography, notification } from 'antd';
import {
  BookOutlined, FileProtectOutlined, SettingOutlined,
  SafetyCertificateOutlined, SearchOutlined,
} from '@ant-design/icons';
import type { PageKey, SoVanBang, QuyetDinhTotNghiep, CauHinhTruong, VanBang } from './types';
import {
  MOCK_SO_VAN_BANG, MOCK_QUYET_DINH, MOCK_CAU_HINH, MOCK_VAN_BANG, genId,
} from './types';
import SoVanBangPage from './components/SoVanBangPage';
import QuyetDinhPage from './components/QuyetDinhPage';
import CauHinhBieuMauPage from './components/CauHinhBieuMauPage';
import VanBangPage from './components/VanBangPage';
import TraCuuPage from './components/TraCuuPage';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const PAGE_TITLE: Record<PageKey, string> = {
  'so-van-bang': 'Quản lý Sổ văn bằng',
  'quyet-dinh': 'Quyết định tốt nghiệp',
  'cau-hinh': 'Cấu hình biểu mẫu',
  'van-bang': 'Quản lý Văn bằng',
  'tra-cuu': 'Tra cứu văn bằng',
};

const THUC_HANH_04: React.FC = () => {
  const [page, setPage] = useState<PageKey>('so-van-bang');
  const [soVanBangs, setSoVanBangs] = useState<SoVanBang[]>(MOCK_SO_VAN_BANG);
  const [quyetDinhs, setQuyetDinhs] = useState<QuyetDinhTotNghiep[]>(MOCK_QUYET_DINH);
  const [cauHinhs, setCauHinhs] = useState<CauHinhTruong[]>(MOCK_CAU_HINH);
  const [vanBangs, setVanBangs] = useState<VanBang[]>(MOCK_VAN_BANG);
  const [notif, ctx] = notification.useNotification();

  const handleAddSoVanBang = (data: Omit<SoVanBang, 'id'>) => {
    setSoVanBangs(prev => [...prev, { ...data, id: genId() }]);
    notif.success({ message: 'Thêm sổ văn bằng thành công!' });
  };
  const handleEditSoVanBang = (id: string, data: Partial<SoVanBang>) => {
    setSoVanBangs(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    notif.success({ message: 'Cập nhật sổ văn bằng thành công!' });
  };
  const handleDeleteSoVanBang = (id: string) => {
    setSoVanBangs(prev => prev.filter(s => s.id !== id));
    notif.success({ message: 'Xóa sổ văn bằng thành công!' });
  };

  const handleAddQuyetDinh = (data: Omit<QuyetDinhTotNghiep, 'id' | 'luotTraCuu'>) => {
    setQuyetDinhs(prev => [...prev, { ...data, id: genId(), luotTraCuu: 0 }]);
    notif.success({ message: 'Thêm quyết định thành công!' });
  };
  const handleEditQuyetDinh = (id: string, data: Partial<QuyetDinhTotNghiep>) => {
    setQuyetDinhs(prev => prev.map(q => q.id === id ? { ...q, ...data } : q));
    notif.success({ message: 'Cập nhật quyết định thành công!' });
  };
  const handleDeleteQuyetDinh = (id: string) => {
    setQuyetDinhs(prev => prev.filter(q => q.id !== id));
    notif.success({ message: 'Xóa quyết định thành công!' });
  };

  const handleAddCauHinh = (data: Omit<CauHinhTruong, 'id'>) => {
    setCauHinhs(prev => [...prev, { ...data, id: genId() }]);
    notif.success({ message: 'Thêm trường thông tin thành công!' });
  };
  const handleEditCauHinh = (id: string, data: Partial<CauHinhTruong>) => {
    setCauHinhs(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    notif.success({ message: 'Cập nhật trường thông tin thành công!' });
  };
  const handleDeleteCauHinh = (id: string) => {
    setCauHinhs(prev => prev.filter(c => c.id !== id));
    notif.success({ message: 'Xóa trường thông tin thành công!' });
  };

  const handleAddVanBang = (data: Omit<VanBang, 'id' | 'soVaoSo'>) => {
    const so = soVanBangs.find(s => s.id === data.soVanBangId);
    const nextSo = so ? so.soHienTai + 1 : 1;
    setSoVanBangs(prev => prev.map(s => s.id === data.soVanBangId ? { ...s, soHienTai: nextSo } : s));
    setVanBangs(prev => [...prev, { ...data, id: genId(), soVaoSo: nextSo }]);
    notif.success({ message: 'Thêm văn bằng thành công!' });
  };
  const handleEditVanBang = (id: string, data: Partial<VanBang>) => {
    setVanBangs(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
    notif.success({ message: 'Cập nhật văn bằng thành công!' });
  };
  const handleDeleteVanBang = (id: string) => {
    setVanBangs(prev => prev.filter(v => v.id !== id));
    notif.success({ message: 'Xóa văn bằng thành công!' });
  };

  const handleTraCuu = (quyetDinhIds: string[]) => {
    setQuyetDinhs(prev => prev.map(q =>
      quyetDinhIds.includes(q.id) ? { ...q, luotTraCuu: q.luotTraCuu + 1 } : q
    ));
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {ctx}
      <Sider
        width={240}
        style={{ background: '#1a0a12', position: 'sticky', top: 0, height: '100vh', overflow: 'auto' }}
      >
        <div style={{
          padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #9B1B30, #D4456A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, color: '#fff',
          }}>
            🎓
          </div>
          <Text style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Văn bằng TN</Text>
        </div>
        <Menu
          theme="dark" mode="inline" selectedKeys={[page]}
          style={{ background: 'transparent', border: 'none', marginTop: 8 }}
          onClick={({ key }) => setPage(key as PageKey)}
          items={[
            { key: 'so-van-bang', icon: <BookOutlined />, label: 'Sổ văn bằng' },
            { key: 'quyet-dinh', icon: <FileProtectOutlined />, label: 'Quyết định TN' },
            { key: 'cau-hinh', icon: <SettingOutlined />, label: 'Cấu hình biểu mẫu' },
            { key: 'van-bang', icon: <SafetyCertificateOutlined />, label: 'Văn bằng' },
            { key: 'tra-cuu', icon: <SearchOutlined />, label: 'Tra cứu' },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{
          background: '#fff', padding: '0 28px',
          display: 'flex', alignItems: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)', height: 56,
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <Text style={{ fontWeight: 700, fontSize: 18, color: '#9B1B30' }}>
            {PAGE_TITLE[page]}
          </Text>
        </Header>
        <Content style={{ margin: 24, minHeight: 360 }}>
          {page === 'so-van-bang' && <SoVanBangPage data={soVanBangs} onAdd={handleAddSoVanBang} onEdit={handleEditSoVanBang} onDelete={handleDeleteSoVanBang} />}
          {page === 'quyet-dinh' && <QuyetDinhPage data={quyetDinhs} onAdd={handleAddQuyetDinh} onEdit={handleEditQuyetDinh} onDelete={handleDeleteQuyetDinh} />}
          {page === 'cau-hinh' && <CauHinhBieuMauPage data={cauHinhs} onAdd={handleAddCauHinh} onEdit={handleEditCauHinh} onDelete={handleDeleteCauHinh} />}
          {page === 'van-bang' && <VanBangPage data={vanBangs} soVanBangs={soVanBangs} quyetDinhs={quyetDinhs} cauHinhs={cauHinhs} onAdd={handleAddVanBang} onEdit={handleEditVanBang} onDelete={handleDeleteVanBang} />}
          {page === 'tra-cuu' && <TraCuuPage vanBangs={vanBangs} soVanBangs={soVanBangs} quyetDinhs={quyetDinhs} cauHinhs={cauHinhs} onTraCuu={handleTraCuu} />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default THUC_HANH_04;
