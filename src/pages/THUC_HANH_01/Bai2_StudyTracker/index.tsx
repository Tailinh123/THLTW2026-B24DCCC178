import React, { useState, useEffect } from 'react';
import { Skeleton } from 'antd';
import { useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import moment from 'moment';
import { store, persistor, RootState } from '../store';

import TrackerSidebar from './components/TrackerSidebar';
import TrackerStats from './components/TrackerStats';
import WeeklyChart from './components/WeeklyChart';
import SubjectGrid from './components/SubjectGrid';
import SessionList from './components/SessionList';
import MonthlyGoal from './components/MonthlyGoal';
import CategoryDrawer from './components/Drawers/CategoryDrawer';
import SessionDrawer from './components/Drawers/SessionDrawer';
import styles from './index.less';

type TabKey = 'overview' | 'subjects' | 'sessions' | 'goals';

const pageConfig: Record<TabKey, { title: string; subtitle: string }> = {
  overview: { title: 'Tổng quan', subtitle: 'Theo dõi tiến độ học tập của bạn' },
  subjects: { title: 'Môn học', subtitle: 'Quản lý danh mục các môn học' },
  sessions: { title: 'Lịch sử', subtitle: 'Xem và quản lý các phiên học tập' },
  goals: { title: 'Mục tiêu', subtitle: 'Thiết lập và theo dõi mục tiêu hàng tháng' },
};

const StudyTrackerContent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const [categoryDrawerVisible, setCategoryDrawerVisible] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const [sessionDrawerVisible, setSessionDrawerVisible] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);

  const { sessions } = useSelector((state: RootState) => state.study);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const id = 'google-fonts-dash';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
  }, []);


  const currentMonthSessions = sessions.filter((s) => moment(s.date).isSame(moment(), 'month'));
  const actualHoursThisMonth = currentMonthSessions.reduce((sum, s) => sum + s.durationHours, 0);

  const openAddCategory = () => {
    setEditingCategoryId(null);
    setCategoryDrawerVisible(true);
  };

  const openEditCategory = (id: string) => {
    setEditingCategoryId(id);
    setCategoryDrawerVisible(true);
  };

  const openAddSession = () => {
    setEditingSessionId(null);
    setSessionDrawerVisible(true);
  };

  const openEditSession = (id: string) => {
    setEditingSessionId(id);
    setSessionDrawerVisible(true);
  };

  const currentPage = pageConfig[activeTab];

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ padding: 40 }}>
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <>
            <TrackerStats actualHoursThisMonth={actualHoursThisMonth} />
            <WeeklyChart />
            <SessionList
              onEditSession={openEditSession}
              onAddSession={openAddSession}
              limit={5}
            />
          </>
        );
      case 'subjects':
        return (
          <SubjectGrid
            onEditCategory={openEditCategory}
            onAddCategory={openAddCategory}
          />
        );
      case 'sessions':
        return (
          <SessionList
            onEditSession={openEditSession}
            onAddSession={openAddSession}
          />
        );
      case 'goals':
        return (
          <MonthlyGoal
            onEditCategory={openEditCategory}
            onAddCategory={openAddCategory}
            actualHoursThisMonth={actualHoursThisMonth}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.dashboardLayout}>
        <TrackerSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenSettings={openAddCategory}
        />

        <div className={styles.mainContent}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{currentPage.title}</h1>
            <p className={styles.pageSubtitle}>{currentPage.subtitle}</p>
          </div>

          {renderContent()}
        </div>
      </div>

      <CategoryDrawer
        visible={categoryDrawerVisible}
        onClose={() => setCategoryDrawerVisible(false)}
        editingCategoryId={editingCategoryId}
      />

      <SessionDrawer
        visible={sessionDrawerVisible}
        onClose={() => setSessionDrawerVisible(false)}
        editingSessionId={editingSessionId}
      />
    </div>
  );
};

const Bai2Wrapper: React.FC = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <StudyTrackerContent />
    </PersistGate>
  </Provider>
);

export default Bai2Wrapper;
