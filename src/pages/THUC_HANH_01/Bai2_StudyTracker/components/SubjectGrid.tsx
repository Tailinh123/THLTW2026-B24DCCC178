import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import SubjectCard from './SubjectCard';
import EmptyState from './EmptyState';
import moment from 'moment';
import styles from '../index.less';

interface Props {
  onEditCategory: (id: string) => void;
  onAddCategory: () => void;
}

const SubjectGrid: React.FC<Props> = ({ onEditCategory, onAddCategory }) => {
  const { categories, sessions } = useSelector((state: RootState) => state.study);

  const getSubjectHours = (categoryId: string) => {
    return sessions
      .filter((s) => s.categoryId === categoryId && moment(s.date).isSame(moment(), 'month'))
      .reduce((sum, s) => sum + s.durationHours, 0);
  };

  if (categories.length === 0) {
    return (
      <EmptyState
        icon="book"
        title="Chưa có môn học nào"
        subtitle="Bắt đầu bằng việc thêm môn học đầu tiên của bạn"
        actionLabel="Thêm Môn Học"
        onAction={onAddCategory}
      />
    );
  }

  return (
    <div>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Danh mục Môn học</span>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className={styles.addButton}
          onClick={onAddCategory}
        >
          Thêm Môn
        </Button>
      </div>
      <div className={styles.subjectGrid}>
        {categories.map((cat) => (
          <SubjectCard
            key={cat.id}
            category={cat}
            totalHours={getSubjectHours(cat.id)}
            goalHours={cat.goalHours || 0}
            onEdit={onEditCategory}
          />
        ))}
      </div>
    </div>
  );
};

export default SubjectGrid;
