
import React, { useState } from 'react';
import {
  Layout, Menu, Typography, Space, Badge,
  Button, Modal, notification,
} from 'antd';
import {
  DashboardOutlined, CalendarOutlined,
  TeamOutlined, AppstoreOutlined, PlusOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

import { MOCK_APPOINTMENTS, MOCK_REVIEWS, MOCK_EMPLOYEES as INITIAL_EMPLOYEES } from './types';
import type { Appointment, AppointmentStatus, Employee, Review } from './types';

import DashboardPage from './pages/DashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import EmployeesPage from './pages/EmployeesPage';
import ServicesPage from './pages/ServicesPage';
import AppointmentForm from './components/AppointmentForm';
import EmployeeDrawer from './components/EmployeeDrawer';
import EmployeeFormModal from './components/EmployeeFormModal';

import './styles.less';

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
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [page, setPage] = useState<PageKey>('dashboard');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [drawerEmp, setDrawerEmp] = useState<Employee | null>(null);
  const [empModalOpen, setEmpModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
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

  
  const handleAddEmployee = (data: Omit<Employee, 'id'>) => {
    setEmployees(p => [...p, { ...data, id: `e_${uid()}` }]);
    setEmpModalOpen(false);
    notif.success({ message: 'Đã thêm nhân viên mới!' });
  };

  const handleEditEmployee = (data: Omit<Employee, 'id'>) => {
    if (!editingEmp) return;
    setEmployees(p => p.map(e => e.id === editingEmp.id ? { ...e, ...data } : e));
    setEmpModalOpen(false);
    setEditingEmp(null);
    notif.success({ message: 'Đã cập nhật nhân viên!' });
  };

  const handleDeleteEmployee = (id: string) => {
    const used = appointments.some(a => a.employeeId === id && a.status !== 'cancelled');
    if (used) {
      notif.error({ message: 'Không thể xóa!', description: 'Nhân viên đang có lịch hẹn.' });
      return;
    }
    setEmployees(p => p.filter(e => e.id !== id));
    notif.success({ message: 'Đã xóa nhân viên' });
  };

  const pendingCount = appointments.filter(a => a.status === 'pending').length;

  
  return (
    <Layout className="bb-layout">
      {ctx}

      {}
      <Sider width={240} className="bb-sider">
        <div className="bb-logo">
          <div className="bb-logo-icon">💇</div>
          <Text className="bb-logo-text">Beauty<span style={{ color: '#6366f1' }}>Book</span></Text>
        </div>

        <Menu
          mode="inline" selectedKeys={[page]}
          className="bb-menu"
          onClick={({ key }) => setPage(key as PageKey)}
          items={[
            { key: 'dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
            {
              key: 'appointments', icon: <CalendarOutlined />,
              label: (
                <Space>
                  Lịch hẹn
                  {pendingCount > 0 && <Badge count={pendingCount} style={{ background: '#f59e0b', boxShadow: 'none' }} />}
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
        <Header className="bb-header">
          <Text className="bb-header-title">
            {PAGE_TITLE[page]}
          </Text>
          <div>
            {page === 'appointments' && (
              <Button
                type="primary" icon={<PlusOutlined />}
                className="bb-header-btn"
                onClick={() => { setEditingAppt(null); setModalOpen(true); }}
              >
                Đặt lịch mới
              </Button>
            )}
            {page === 'employees' && (
              <Button
                type="primary" icon={<UserAddOutlined />}
                className="bb-header-btn"
                onClick={() => { setEditingEmp(null); setEmpModalOpen(true); }}
              >
                Thêm nhân viên
              </Button>
            )}
          </div>
        </Header>

        {}
        <Content className="bb-content">
          {page === 'dashboard' && (
            <DashboardPage
              appointments={appointments}
              employees={employees}
              onEmployeeClick={setDrawerEmp}
            />
          )}
          {page === 'appointments' && (
            <AppointmentsPage
              appointments={appointments}
              employees={employees}
              onStatusChange={handleStatusChange}
              onEdit={a => { setEditingAppt(a); setModalOpen(true); }}
              onDelete={handleDelete}
            />
          )}
          {page === 'employees' && (
            <EmployeesPage
              appointments={appointments}
              reviews={reviews}
              employees={employees}
              onEmployeeClick={setDrawerEmp}
              onEdit={emp => { setEditingEmp(emp); setEmpModalOpen(true); }}
              onDelete={handleDeleteEmployee}
            />
          )}
          {page === 'services' && (
            <ServicesPage appointments={appointments} />
          )}
        </Content>
      </Layout>

      {}
      <Modal
        title={editingAppt ? 'Chỉnh sửa lịch hẹn' : 'Đặt lịch hẹn mới'}
        visible={modalOpen}
        onCancel={() => { setModalOpen(false); setEditingAppt(null); }}
        footer={null} width={540} destroyOnClose centered
        wrapClassName="bb-modal"
      >
        <AppointmentForm
          appointments={appointments}
          employees={employees}
          onSuccess={editingAppt ? handleEditSubmit : handleCreate}
          initialValues={editingAppt ?? undefined}
          submitLabel={editingAppt ? 'Cập nhật' : 'Đặt lịch'}
        />
      </Modal>

      {}
      <EmployeeFormModal
        open={empModalOpen}
        editing={editingEmp}
        onCancel={() => { setEmpModalOpen(false); setEditingEmp(null); }}
        onSave={editingEmp ? handleEditEmployee : handleAddEmployee}
      />

      {}
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