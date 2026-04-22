import React from 'react';
import {
  CalculatorOutlined, BookOutlined, GlobalOutlined, ExperimentOutlined,
  LaptopOutlined, BulbOutlined, FileTextOutlined, HighlightOutlined,
  SoundOutlined, ThunderboltOutlined, HeartOutlined, TrophyOutlined,
  RocketOutlined, DatabaseOutlined, CodeOutlined, PictureOutlined,
  StarOutlined, CrownOutlined, SafetyOutlined, ToolOutlined,
} from '@ant-design/icons';

export const ICON_MAP: Record<string, React.ReactNode> = {
  calculator: <CalculatorOutlined />,
  book: <BookOutlined />,
  global: <GlobalOutlined />,
  experiment: <ExperimentOutlined />,
  laptop: <LaptopOutlined />,
  bulb: <BulbOutlined />,
  fileText: <FileTextOutlined />,
  highlight: <HighlightOutlined />,
  sound: <SoundOutlined />,
  thunderbolt: <ThunderboltOutlined />,
  heart: <HeartOutlined />,
  trophy: <TrophyOutlined />,
  rocket: <RocketOutlined />,
  database: <DatabaseOutlined />,
  code: <CodeOutlined />,
  picture: <PictureOutlined />,
  star: <StarOutlined />,
  crown: <CrownOutlined />,
  safety: <SafetyOutlined />,
  tool: <ToolOutlined />,
};

export const ICON_OPTIONS = Object.keys(ICON_MAP);

export const getSubjectIcon = (key: string): React.ReactNode => {
  return ICON_MAP[key] || <BookOutlined />;
};

export const COLOR_SWATCHES = [
  '#6366f1', '#8b5cf6', '#a855f7', '#ec4899',
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
];

export const DEFAULT_SUBJECTS = [
  { name: 'Toán', icon: 'calculator', color: '#6366f1' },
  { name: 'Văn', icon: 'highlight', color: '#ec4899' },
  { name: 'Anh', icon: 'global', color: '#06b6d4' },
  { name: 'Khoa học', icon: 'experiment', color: '#22c55e' },
  { name: 'Công nghệ', icon: 'laptop', color: '#f59e0b' },
];
