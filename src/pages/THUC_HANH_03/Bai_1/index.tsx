import React, { useState } from 'react';
import {
  Layout, Menu, Typography, Space, Badge,
  Button, Modal, notification,
} from 'antd';
import {
  DashboardOutlined, CalendarOutlined,
  TeamOutlined, AppstoreOutlined, PlusOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

import { MOCK_APPOINTMENTS, MOCK_REVIEWS } from './types';
import type { Appointment, AppointmentStatus, Employee, Review } from './types';


import DashboardPage from './pages/DashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import EmployeesPage from './pages/EmployeesPage';
import ServicesPage from './pages/ServicesPage';
import AppointmentForm from './components/AppointmentForm';
import EmployeeDrawer from './components/EmployeeDrawer';

dayjs.locale('vi');

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

type PageKey = 'dashboard' | 'appointments' | 'employees' | 'services';

const PAGE_TITLE: Record<PageKey, string> = {
  dashboard: 'Tổng quan',
  appointments: 'Lịch hẹn',
  employees: 'Nhân viên',
  services: 'Dịch vụ',
};

const uid = () => Math.random().toString(36).slice(2, 9);

const THUC_HANH_03_Bai1: React.FC = () => {
  
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [page, setPage] = useState<PageKey>('dashboard');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [drawerEmp, setDrawerEmp] = useState<Employee | null>(null);
  const [notif, ctx] = notification.useNotification();

 
  const handleCreate = (data: Omit<Appointment, 'id' | 'createdAt'>) => {
    setAppointments(p => [{ ...data, id: `a_${uid()}`, createdAt: new Date().toISOString() }, ...p]);
    setModalOpen(false);
    notif.success({ message: 'Đặt lịch thành công!', description: `Lịch cho ${data.customerName} đã tạo.` });
  };

  const handleEditSubmit = (data: Omit<Appointment, 'id' | 'createdAt'>) => {
    if (!editingAppt) return;
    setAppointments(p => p.map(a => a.id === editingAppt.id ? { ...a, ...data } : a));
    setModalOpen(false);
    setEditingAppt(null);
    notif.success({ message: 'Cập nhật thành công!' });
  };

  const handleStatusChange = (id: string, status: AppointmentStatus) => {
    setAppointments(p => p.map(a => a.id === id ? { ...a, status } : a));
    notif.success({ message: `Đã cập nhật trạng thái` });
  };

  const handleDelete = (id: string) => {
    setAppointments(p => p.filter(a => a.id !== id));
    notif.success({ message: 'Đã xóa lịch hẹn' });
  };

  const handleReply = (rid: string, content: string) => {
    setReviews(p => p.map(r =>
      r.id === rid ? { ...r, reply: { content, createdAt: new Date().toISOString() } } : r
    ));
    notif.success({ message: 'Đã gửi phản hồi!' });
  };

  const pendingCount = appointments.filter(a => a.status === 'pending').length;

 
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {ctx}

     
      <Sider
        width={220}
        style={{ background: '#1a1a2e', position: 'sticky', top: 0, height: '100vh', overflow: 'auto' }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d2d4e', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#6c63ff,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>
            ✂
          </div>
          <Text style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>BeautyBook</Text>
        </div>

        <Menu
          theme="dark" mode="inline" selectedKeys={[page]}
          style={{ background: 'transparent', border: 'none', marginTop: 8 }}
          onClick={({ key }) => setPage(key as PageKey)}
          items={[
            { key: 'dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
            {
              key: 'appointments', icon: <CalendarOutlined />,
              label: (
                <Space>
                  Lịch hẹn
                  <Badge count={pendingCount} style={{ background: '#f59e0b' }} />
                </Space>
              ),
            },
            { key: 'employees', icon: <TeamOutlined />, label: 'Nhân viên' },
            { key: 'services', icon: <AppstoreOutlined />, label: 'Dịch vụ' },
          ]}
        />
      </Sider>

      <Layout>
        {}
        <Header style={{
          background: '#fff', padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)', height: 56,
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <Text style={{ fontWeight: 700, fontSize: 18, color: '#6c63ff' }}>
            {PAGE_TITLE[page]}
          </Text>
          {page === 'appointments' && (
            <Button
              type="primary" icon={<PlusOutlined />}
              onClick={() => { setEditingAppt(null); setModalOpen(true); }}
            >
              Đặt lịch mới
            </Button>
          )}
        </Header>

        
        <Content style={{ margin: 24 }}>
          {page === 'dashboard' && (
            <DashboardPage
              appointments={appointments}
              onEmployeeClick={setDrawerEmp}
            />
          )}
          {page === 'appointments' && (
            <AppointmentsPage
              appointments={appointments}
              onStatusChange={handleStatusChange}
              onEdit={a => { setEditingAppt(a); setModalOpen(true); }}
              onDelete={handleDelete}
            />
          )}
          {page === 'employees' && (
            <EmployeesPage
              appointments={appointments}
              reviews={reviews}
              onEmployeeClick={setDrawerEmp}
            />
          )}
          {page === 'services' && (
            <ServicesPage appointments={appointments} />
          )}
        </Content>
      </Layout>

      
      <Modal
        title={editingAppt ? 'Chỉnh sửa lịch hẹn' : 'Đặt lịch hẹn mới'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditingAppt(null); }}
        footer={null} width={540} destroyOnClose
      >
        <div style={{ marginTop: 16 }}>
          <AppointmentForm
            appointments={appointments}
            onSuccess={editingAppt ? handleEditSubmit : handleCreate}
            initialValues={editingAppt ?? undefined}
            submitLabel={editingAppt ? 'Cập nhật' : 'Đặt lịch'}
          />
        </div>
      </Modal>

      
      <EmployeeDrawer
        employee={drawerEmp}
        appointments={appointments}
        reviews={reviews}
        onClose={() => setDrawerEmp(null)}
        onReply={handleReply}
      />
    </Layout>
  );
};

export default THUC_HANH_03_Bai1;