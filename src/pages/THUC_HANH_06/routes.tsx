import React from 'react';
import {
  HomeOutlined,
  ScheduleOutlined,
  DollarOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { HomePage, ItineraryPage, BudgetPage, AdminPage } from './pages';
import type { PageKey } from './types';

export interface RouteConfig {
  key: PageKey;
  label: string;
  icon: React.ReactNode;
  component: React.FC;
}

export const ROUTES: RouteConfig[] = [
  { key: 'home', label: 'Trang chủ', icon: <HomeOutlined />, component: HomePage },
  { key: 'itinerary', label: 'Lịch trình', icon: <ScheduleOutlined />, component: ItineraryPage },
  { key: 'budget', label: 'Ngân sách', icon: <DollarOutlined />, component: BudgetPage },
  { key: 'admin', label: 'Quản trị', icon: <SettingOutlined />, component: AdminPage },
];

export const PAGE_TITLES: Record<PageKey, string> = {
  home: 'Khám phá Điểm đến',
  itinerary: 'Lập Lịch trình',
  budget: 'Quản lý Ngân sách',
  admin: 'Trang Quản trị',
};
