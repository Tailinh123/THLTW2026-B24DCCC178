import React, { useState } from 'react';
import { Button, Popconfirm, Select, notification } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { deleteSession } from '../../store/studySlice';
import { getSubjectIcon } from '../constants';
import EmptyState from './EmptyState';
import styles from '../index.less';

interface Props {
  onEditSession: (id: string) => void;
  onAddSession: () => void;
  limit?: number;
}

const SessionList: React.FC<Props> = ({ onEditSession, onAddSession, limit }) => {
  const dispatch = useDispatch();
  const { sessions, categories } = useSelector((state: RootState) => state.study);
  const [filterCategoryId, setFilterCategoryId] = useState<string | undefined>(undefined);

  const handleDelete = (id: string) => {
    dispatch(deleteSession(id));
    notification.success({ message: 'Đã xóa phiên học' });
  };

  const getCategory = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  };

  let filteredSessions = filterCategoryId
    ? sessions.filter((s) => s.categoryId === filterCategoryId)
    : sessions;

  if (limit) {
    filteredSessions = filteredSessions.slice(0, limit);
  }

  if (sessions.length === 0) {
    return (
      <EmptyState
        icon="history"
        title="Chưa có phiên học nào"
        subtitle="Hãy thêm phiên học đầu tiên để bắt đầu theo dõi"
        actionLabel="Thêm Phiên Học"
        onAction={onAddSession}
      />
    );
  }

  return (
    <div>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>
          {limit ? 'Phiên học gần đây' : 'Lịch sử Học tập'}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {!limit && (
            <Select
              placeholder="Lọc theo môn"
              allowClear
              style={{ width: 160 }}
              value={filterCategoryId}
              onChange={setFilterCategoryId}
              dropdownStyle={{ background: '#1a1d2e' }}
            >
              {categories.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className={styles.addButton}
            onClick={onAddSession}
          >
            Thêm Phiên Học
          </Button>
        </div>
      </div>

      <div className={styles.sessionList}>
        {filteredSessions.map((session) => {
          const cat = getCategory(session.categoryId);
          return (
            <div key={session.id} className={styles.sessionNote}>
              <div
                className={styles.sessionNoteIcon}
                style={{
                  background: cat ? `${cat.color}18` : 'rgba(148,163,184,0.1)',
                  color: cat?.color || '#94a3b8',
                }}
              >
                {cat ? getSubjectIcon(cat.icon) : '📚'}
              </div>

              <div className={styles.sessionNoteBody}>
                <div className={styles.sessionNoteHeader}>
                  <span className={styles.sessionNoteSubject}>
                    {cat?.name || 'Môn đã xóa'}
                  </span>
                  <span className={styles.sessionNoteDate}>
                    {moment(session.date).format('DD/MM/YYYY')}
                  </span>
                  <span className={styles.sessionNoteDuration}>
                    {session.durationHours}h
                  </span>
                </div>
                <div className={styles.sessionNoteContent}>{session.content}</div>
                {session.notes && (
                  <div className={styles.sessionNoteNotes}>📝 {session.notes}</div>
                )}
              </div>

              <div className={styles.sessionNoteActions}>
                <Button
                  type="text"
                  size="small"
                  className={styles.sessionNoteActionBtn}
                  icon={<EditOutlined />}
                  onClick={() => onEditSession(session.id)}
                />
                <Popconfirm
                  title="Xóa phiên học này?"
                  onConfirm={() => handleDelete(session.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button
                    type="text"
                    size="small"
                    className={`${styles.sessionNoteActionBtn} ${styles.deleteBtn}`}
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SessionList;
