import React, { useState } from 'react';
import { Tabs, Button, Typography, message } from 'antd';
import {
  DashboardOutlined,
  ProjectOutlined,
  UnorderedListOutlined,
  PlusOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { Task, Status } from './types';
import { loadTasks, saveTasks } from './types';
import DashboardTab from './components/DashboardTab';
import KanbanBoardTab from './components/KanbanBoardTab';
import TableViewTab from './components/TableViewTab';
import TaskFormModal from './components/TaskFormModal';
import './styles.less';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const THUC_HANH_09: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<Status>('TODO');
  const [activeTab, setActiveTab] = useState('dashboard');

  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const handleOpenAdd = (status?: Status) => {
    setEditingTask(null);
    setDefaultStatus(status || 'TODO');
    setModalVisible(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleSubmitTask = (task: Task) => {
    if (editingTask) {
      const updated = tasks.map((t) => (t.id === task.id ? task : t));
      updateTasks(updated);
      message.success('Cập nhật task thành công!');
    } else {
      updateTasks([...tasks, task]);
      message.success('Tạo task mới thành công!');
    }
    setModalVisible(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    updateTasks(updated);
    message.success('Xóa task thành công!');
  };

  const handleReorder = (reordered: Task[]) => {
    updateTasks(reordered);
    message.success('Di chuyển task thành công!');
  };

  return (
    <div className="kanban-root">
      <div className="kanban-page-header">
        <div className="kanban-header-left">
          <div>
            <Title level={3} className="kanban-page-title">
              Kanban Task Manager Pro
            </Title>
            <Text className="kanban-page-subtitle">
              Quản lý công việc thông minh & hiệu quả
            </Text>
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => handleOpenAdd()}
          className="kanban-add-task-btn"
        >
          Thêm Task
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="kanban-tabs"
        tabBarGutter={8}
      >
        <TabPane
          tab={
            <span className="kanban-tab-label">
              <DashboardOutlined /> Dashboard
            </span>
          }
          key="dashboard"
        >
          <DashboardTab tasks={tasks} />
        </TabPane>

        <TabPane
          tab={
            <span className="kanban-tab-label">
              <ProjectOutlined /> Kanban Board
            </span>
          }
          key="kanban"
        >
          <KanbanBoardTab
            tasks={tasks}
            onReorder={handleReorder}
            onEditTask={handleOpenEdit}
            onAddTask={handleOpenAdd}
          />
        </TabPane>

        <TabPane
          tab={
            <span className="kanban-tab-label">
              <UnorderedListOutlined /> Danh sách
            </span>
          }
          key="table"
        >
          <TableViewTab
            tasks={tasks}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteTask}
          />
        </TabPane>
      </Tabs>

      <TaskFormModal
        visible={modalVisible}
        editingTask={editingTask}
        defaultStatus={defaultStatus}
        onCancel={() => {
          setModalVisible(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmitTask}
      />
    </div>
  );
};

export default THUC_HANH_09;
