import React from 'react';
import { Button } from 'antd';
import { PlusOutlined, ContainerOutlined, HistoryOutlined, AimOutlined } from '@ant-design/icons';
import styles from '../index.less';

interface Props {
  icon: 'book' | 'history' | 'goal';
  title: string;
  subtitle: string;
  actionLabel: string;
  onAction: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  book: <ContainerOutlined />,
  history: <HistoryOutlined />,
  goal: <AimOutlined />,
};

const EmptyState: React.FC<Props> = ({ icon, title, subtitle, actionLabel, onAction }) => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIllustration}>
        {iconMap[icon] || <ContainerOutlined />}
      </div>
      <div className={styles.emptyTitle}>{title}</div>
      <div className={styles.emptySubtitle}>{subtitle}</div>
      <Button
        type="primary"
        size="large"
        icon={<PlusOutlined />}
        className={styles.emptyActionBtn}
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    </div>
  );
};

export default EmptyState;
