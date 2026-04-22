import React from 'react';
import { Button, Popconfirm, notification } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { deleteCategory } from '../../store/studySlice';
import { getSubjectIcon } from '../constants';
import { SubjectCategory } from '../../types';
import styles from '../index.less';

interface Props {
  category: SubjectCategory;
  totalHours: number;
  goalHours: number;
  onEdit: (id: string) => void;
}

const SubjectCard: React.FC<Props> = ({ category, totalHours, goalHours, onEdit }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteCategory(category.id));
    notification.success({ message: `Đã xóa môn ${category.name}` });
  };

  const progressPercent = goalHours > 0 ? Math.min(100, (totalHours / goalHours) * 100) : 0;

  return (
    <div className={styles.subjectCard}>
      <div className={styles.subjectColorStrip} style={{ background: category.color }} />

      <div className={styles.subjectCardHeader}>
        <div className={styles.subjectCardInfo}>
          <div
            className={styles.subjectCardIcon}
            style={{
              background: `${category.color}18`,
              color: category.color,
            }}
          >
            {getSubjectIcon(category.icon)}
          </div>
          <div>
            <div className={styles.subjectCardName}>{category.name}</div>
            <div className={styles.subjectCardHours}>
              {Math.round(totalHours * 10) / 10}h đã học
            </div>
          </div>
        </div>

        <div className={styles.subjectCardActions}>
          <Button
            type="text"
            size="small"
            className={styles.subjectCardActionBtn}
            icon={<EditOutlined />}
            onClick={() => onEdit(category.id)}
          />
          <Popconfirm
            title={`Xóa môn ${category.name}?`}
            description="Tất cả phiên học liên quan sẽ bị xóa."
            onConfirm={handleDelete}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="text"
              size="small"
              className={`${styles.subjectCardActionBtn} ${styles.deleteBtn}`}
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </div>
      </div>

      {goalHours > 0 && (
        <div className={styles.subjectCardProgress}>
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBarFill}
              style={{
                width: `${progressPercent}%`,
                background: progressPercent >= 100
                  ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                  : `linear-gradient(90deg, ${category.color}, ${category.color}cc)`,
              }}
            />
          </div>
          <div className={styles.progressBarLabel}>
            <span className={styles.progressBarLabelText}>
              {Math.round(totalHours * 10) / 10}h / {goalHours}h
            </span>
            <span className={styles.progressBarLabelText}>
              {Math.round(progressPercent)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectCard;
