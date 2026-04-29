import React, { useState } from 'react';
import { Layout, Menu, Typography, Button, notification } from 'antd';
import {
  DashboardOutlined,
  ScheduleOutlined,
  HeartOutlined,
  AimOutlined,
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { PageKey, WorkoutEntry, HealthRecord, Goal, Exercise } from './types';
import {
  loadWorkouts, saveWorkouts,
  loadHealth, saveHealth,
  loadGoals, saveGoals,
  loadExercises, saveExercises,
  genId,
} from './mockData';
import Dashboard from './pages/Dashboard';
import WorkoutLog from './pages/WorkoutLog';
import HealthMetrics from './pages/HealthMetrics';
import Goals from './pages/Goals';
import ExerciseLibrary from './pages/ExerciseLibrary';
import './index.less';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const PAGE_TITLE: Record<PageKey, string> = {
  dashboard: 'Trang chủ',
  'workout-log': 'Nhật ký tập luyện',
  'health-metrics': 'Nhật ký chỉ số sức khỏe',
  goals: 'Quản lý mục tiêu',
  'exercise-library': 'Thư viện bài tập',
};

const MENU_ITEMS = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: 'Trang chủ' },
  { key: 'workout-log', icon: <ScheduleOutlined />, label: 'Nhật ký tập luyện' },
  { key: 'health-metrics', icon: <HeartOutlined />, label: 'Chỉ số sức khỏe' },
  { key: 'goals', icon: <AimOutlined />, label: 'Mục tiêu' },
  { key: 'exercise-library', icon: <AppstoreOutlined />, label: 'Thư viện bài tập' },
];

const THUC_HANH_08: React.FC = () => {
  const [page, setPage] = useState<PageKey>('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [notif, ctx] = notification.useNotification();

  // ===== State =====
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>(loadWorkouts);
  const [health, setHealth] = useState<HealthRecord[]>(loadHealth);
  const [goals, setGoals] = useState<Goal[]>(loadGoals);
  const [exercises, setExercises] = useState<Exercise[]>(loadExercises);

  // ===== Workout CRUD =====
  const handleAddWorkout = (entry: WorkoutEntry) => {
    const next = [entry, ...workouts];
    setWorkouts(next);
    saveWorkouts(next);
    notif.success({ message: 'Thêm buổi tập thành công!' });
  };

  const handleEditWorkout = (id: string, data: Partial<WorkoutEntry>) => {
    const next = workouts.map((w) => (w.id === id ? { ...w, ...data } : w));
    setWorkouts(next);
    saveWorkouts(next);
    notif.success({ message: 'Cập nhật buổi tập thành công!' });
  };

  const handleDeleteWorkout = (id: string) => {
    const next = workouts.filter((w) => w.id !== id);
    setWorkouts(next);
    saveWorkouts(next);
    notif.success({ message: 'Xóa buổi tập thành công!' });
  };

  // ===== Health CRUD =====
  const handleAddHealth = (record: HealthRecord) => {
    const next = [record, ...health];
    setHealth(next);
    saveHealth(next);
    notif.success({ message: 'Thêm chỉ số sức khỏe thành công!' });
  };

  const handleEditHealth = (id: string, data: Partial<HealthRecord>) => {
    const next = health.map((h) => (h.id === id ? { ...h, ...data } : h));
    setHealth(next);
    saveHealth(next);
    notif.success({ message: 'Cập nhật chỉ số thành công!' });
  };

  const handleDeleteHealth = (id: string) => {
    const next = health.filter((h) => h.id !== id);
    setHealth(next);
    saveHealth(next);
    notif.success({ message: 'Xóa bản ghi thành công!' });
  };

  // ===== Goals CRUD =====
  const handleAddGoal = (goal: Goal) => {
    const next = [goal, ...goals];
    setGoals(next);
    saveGoals(next);
    notif.success({ message: 'Thêm mục tiêu thành công!' });
  };

  const handleEditGoal = (id: string, data: Partial<Goal>) => {
    const next = goals.map((g) => (g.id === id ? { ...g, ...data } : g));
    setGoals(next);
    saveGoals(next);
    notif.success({ message: 'Cập nhật mục tiêu thành công!' });
  };

  const handleDeleteGoal = (id: string) => {
    const next = goals.filter((g) => g.id !== id);
    setGoals(next);
    saveGoals(next);
    notif.success({ message: 'Xóa mục tiêu thành công!' });
  };

  // ===== Exercise CRUD =====
  const handleAddExercise = (exercise: Exercise) => {
    const next = [exercise, ...exercises];
    setExercises(next);
    saveExercises(next);
    notif.success({ message: 'Thêm bài tập thành công!' });
  };

  const handleEditExercise = (id: string, data: Partial<Exercise>) => {
    const next = exercises.map((e) => (e.id === id ? { ...e, ...data } : e));
    setExercises(next);
    saveExercises(next);
    notif.success({ message: 'Cập nhật bài tập thành công!' });
  };

  const handleDeleteExercise = (id: string) => {
    const next = exercises.filter((e) => e.id !== id);
    setExercises(next);
    saveExercises(next);
    notif.success({ message: 'Xóa bài tập thành công!' });
  };

  // ===== Render active page =====
  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return (
          <Dashboard
            workouts={workouts}
            health={health}
            goals={goals}
            onAddWorkout={handleAddWorkout}
            onAddHealth={handleAddHealth}
          />
        );
      case 'workout-log':
        return (
          <WorkoutLog
            workouts={workouts}
            onAdd={handleAddWorkout}
            onEdit={handleEditWorkout}
            onDelete={handleDeleteWorkout}
          />
        );
      case 'health-metrics':
        return (
          <HealthMetrics
            health={health}
            onAdd={handleAddHealth}
            onEdit={handleEditHealth}
            onDelete={handleDeleteHealth}
          />
        );
      case 'goals':
        return (
          <Goals
            goals={goals}
            onAdd={handleAddGoal}
            onEdit={handleEditGoal}
            onDelete={handleDeleteGoal}
          />
        );
      case 'exercise-library':
        return (
          <ExerciseLibrary
            exercises={exercises}
            onAdd={handleAddExercise}
            onEdit={handleEditExercise}
            onDelete={handleDeleteExercise}
          />
        );
      default:
        return <Dashboard workouts={workouts} health={health} goals={goals} />;
    }
  };

  return (
    <Layout className="th08-layout">
      {ctx}
      <Sider
        className="th08-sider"
        width={260}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        collapsedWidth={0}
      >
        {/* Logo */}
        <div className="th08-logo">
          <div className="th08-logo-icon">
            <ThunderboltOutlined style={{ fontSize: 18, color: '#fff' }} />
          </div>
          {!collapsed && <span className="th08-logo-text">FitTracker</span>}
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[page]}
          onClick={({ key }) => setPage(key as PageKey)}
          items={MENU_ITEMS}
        />

        {/* Bottom Decoration */}
        {!collapsed && (
          <div className="th08-sider-bottom">
            <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, lineHeight: 1.6 }}>
              🏃‍♂️ Theo dõi sức khỏe mỗi ngày để đạt mục tiêu của bạn!
            </Text>
          </div>
        )}
      </Sider>

      <Layout>
        <Header className="th08-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16, width: 40, height: 40 }}
            />
            <span className="th08-header-title">{PAGE_TITLE[page]}</span>
          </div>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Fitness & Health Tracker
          </Text>
        </Header>
        <Content className="th08-content">{renderPage()}</Content>
      </Layout>
    </Layout>
  );
};

export default THUC_HANH_08;
