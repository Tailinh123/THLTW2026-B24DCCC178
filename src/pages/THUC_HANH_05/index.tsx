import React, { useState } from 'react';
import { Layout, Menu, Typography, notification } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { PageKey, CauLacBo, DonDangKy, LichSuThaoTac } from './types';
import {
  loadClubs, saveClubs,
  loadMemberships, saveMemberships,
  loadHistory, saveHistory,
  genId,
} from './types';
import DashboardPage from './components/DashboardPage';
import ClubListPage from './components/ClubListPage';
import MembershipPage from './components/MembershipPage';
import MembersPage from './components/MembersPage';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const PAGE_TITLE: Record<PageKey, string> = {
  dashboard: 'Báo cáo & Thống kê',
  clubs: 'Danh sách Câu lạc bộ',
  memberships: 'Quản lý Đơn đăng ký',
  members: 'Quản lý Thành viên',
};

const THUC_HANH_05: React.FC = () => {
  const [page, setPage] = useState<PageKey>('dashboard');
  const [clubs, setClubs] = useState<CauLacBo[]>(loadClubs);
  const [memberships, setMemberships] = useState<DonDangKy[]>(loadMemberships);
  const [history, setHistory] = useState<LichSuThaoTac[]>(loadHistory);
  const [notif, ctx] = notification.useNotification();

  const addHistory = (thaoTac: string, doiTuong: string, ghiChu = '') => {
    const item: LichSuThaoTac = {
      id: genId(),
      thoiGian: new Date().toLocaleString('vi-VN'),
      thaoTac,
      doiTuong,
      ghiChu,
    };
    const next = [item, ...history];
    setHistory(next);
    saveHistory(next);
  };

  const handleAddClub = (data: Omit<CauLacBo, 'id'>) => {
    const next = [...clubs, { ...data, id: genId() }];
    setClubs(next);
    saveClubs(next);
    addHistory('Thêm CLB', data.tenCLB);
    notif.success({ message: 'Thêm câu lạc bộ thành công!' });
  };

  const handleEditClub = (id: string, data: Partial<CauLacBo>) => {
    const next = clubs.map((c) => (c.id === id ? { ...c, ...data } : c));
    setClubs(next);
    saveClubs(next);
    addHistory('Sửa CLB', data.tenCLB || id);
    notif.success({ message: 'Cập nhật câu lạc bộ thành công!' });
  };

  const handleDeleteClub = (id: string) => {
    const club = clubs.find((c) => c.id === id);
    const next = clubs.filter((c) => c.id !== id);
    setClubs(next);
    saveClubs(next);
    addHistory('Xóa CLB', club?.tenCLB || id);
    notif.success({ message: 'Xóa câu lạc bộ thành công!' });
  };

  const handleAddMembership = (data: Omit<DonDangKy, 'id'>) => {
    const next = [...memberships, { ...data, id: genId() }];
    setMemberships(next);
    saveMemberships(next);
    addHistory('Thêm đơn', data.hoTen);
    notif.success({ message: 'Thêm đơn đăng ký thành công!' });
  };

  const handleEditMembership = (id: string, data: Partial<DonDangKy>) => {
    const next = memberships.map((m) => (m.id === id ? { ...m, ...data } : m));
    setMemberships(next);
    saveMemberships(next);
    addHistory('Sửa đơn', data.hoTen || id);
    notif.success({ message: 'Cập nhật đơn đăng ký thành công!' });
  };

  const handleDeleteMembership = (id: string) => {
    const m = memberships.find((x) => x.id === id);
    const next = memberships.filter((x) => x.id !== id);
    setMemberships(next);
    saveMemberships(next);
    addHistory('Xóa đơn', m?.hoTen || id);
    notif.success({ message: 'Xóa đơn đăng ký thành công!' });
  };

  const handleApprove = (ids: string[]) => {
    const next = memberships.map((m) =>
      ids.includes(m.id) ? { ...m, trangThai: 'Approved' as const } : m,
    );
    setMemberships(next);
    saveMemberships(next);
    const names = memberships.filter((m) => ids.includes(m.id)).map((m) => m.hoTen).join(', ');
    addHistory('Duyệt đơn', names);
    notif.success({ message: `Duyệt thành công ${ids.length} đơn!` });
  };

  const handleReject = (ids: string[], lyDo: string) => {
    const next = memberships.map((m) =>
      ids.includes(m.id)
        ? { ...m, trangThai: 'Rejected' as const, lyDoTuChoi: lyDo }
        : m,
    );
    setMemberships(next);
    saveMemberships(next);
    const names = memberships.filter((m) => ids.includes(m.id)).map((m) => m.hoTen).join(', ');
    addHistory('Từ chối đơn', names, lyDo);
    notif.success({ message: `Từ chối thành công ${ids.length} đơn!` });
  };

  const handleTransferClub = (ids: string[], newClubId: string) => {
    const next = memberships.map((m) =>
      ids.includes(m.id) ? { ...m, clubId: newClubId } : m,
    );
    setMemberships(next);
    saveMemberships(next);
    const newClub = clubs.find((c) => c.id === newClubId);
    const names = memberships.filter((m) => ids.includes(m.id)).map((m) => m.hoTen).join(', ');
    addHistory('Đổi CLB', names, `Chuyển sang ${newClub?.tenCLB}`);
    notif.success({ message: 'Đổi CLB cho thành viên thành công!' });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {ctx}
      <Sider
        width={240}
        style={{
          background: '#001529',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            padding: '20px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #1677ff, #69b1ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            🏫
          </div>
          <Text style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Quản lý CLB</Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[page]}
          style={{ background: 'transparent', border: 'none', marginTop: 8 }}
          onClick={({ key }) => setPage(key as PageKey)}
          items={[
            { key: 'dashboard', icon: <DashboardOutlined />, label: 'Thống kê' },
            { key: 'clubs', icon: <TeamOutlined />, label: 'Câu lạc bộ' },
            { key: 'memberships', icon: <FileTextOutlined />, label: 'Đơn đăng ký' },
            { key: 'members', icon: <UserOutlined />, label: 'Thành viên' },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 28px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            height: 56,
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <Text style={{ fontWeight: 700, fontSize: 18, color: '#1677ff' }}>
            {PAGE_TITLE[page]}
          </Text>
        </Header>
        <Content style={{ margin: 24, minHeight: 360 }}>
          {page === 'dashboard' && (
            <DashboardPage clubs={clubs} memberships={memberships} />
          )}
          {page === 'clubs' && (
            <ClubListPage
              clubs={clubs}
              memberships={memberships}
              onAdd={handleAddClub}
              onEdit={handleEditClub}
              onDelete={handleDeleteClub}
            />
          )}
          {page === 'memberships' && (
            <MembershipPage
              memberships={memberships}
              clubs={clubs}
              history={history}
              onAdd={handleAddMembership}
              onEdit={handleEditMembership}
              onDelete={handleDeleteMembership}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}
          {page === 'members' && (
            <MembersPage
              memberships={memberships}
              clubs={clubs}
              onTransfer={handleTransferClub}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default THUC_HANH_05;
