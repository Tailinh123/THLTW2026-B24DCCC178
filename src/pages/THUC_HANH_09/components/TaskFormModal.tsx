import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Tag } from 'antd';
import moment from 'moment';
import type { Task, Status, Priority } from '../types';
import { STATUS_CONFIG, PRIORITY_CONFIG, genId } from '../types';

const { TextArea } = Input;
const { Option } = Select;

const TAG_OPTIONS = [
  'Frontend', 'Backend', 'UI/UX', 'DevOps', 'Testing',
  'Security', 'Performance', 'Mobile', 'CI/CD', 'Quality',
  'Database', 'API', 'Documentation',
];

interface TaskFormModalProps {
  visible: boolean;
  editingTask: Task | null;
  defaultStatus?: Status;
  onCancel: () => void;
  onSubmit: (task: Task) => void;
}

interface FormValues {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  tags: string[];
  deadline: moment.Moment;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  visible,
  editingTask,
  defaultStatus,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (visible) {
      if (editingTask) {
        form.setFieldsValue({
          title: editingTask.title,
          description: editingTask.description,
          status: editingTask.status,
          priority: editingTask.priority,
          tags: editingTask.tags,
          deadline: moment(editingTask.deadline),
        });
      } else {
        form.resetFields();
        if (defaultStatus) {
          form.setFieldsValue({ status: defaultStatus });
        }
      }
    }
  }, [visible, editingTask, defaultStatus, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const task: Task = {
        id: editingTask?.id || genId(),
        title: values.title.trim(),
        description: values.description?.trim() || '',
        status: values.status,
        priority: values.priority,
        tags: values.tags || [],
        deadline: values.deadline.toISOString(),
      };
      onSubmit(task);
      form.resetFields();
    });
  };

  const disabledDate = (current: moment.Moment): boolean => {
    return current && current < moment().startOf('day');
  };

  return (
    <Modal
      title={editingTask ? 'Chỉnh sửa Task' : 'Thêm Task mới'}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText={editingTask ? 'Cập nhật' : 'Tạo mới'}
      cancelText="Hủy"
      destroyOnClose
      width={560}
      className="kanban-modal"
      okButtonProps={{ className: 'kanban-modal-ok-btn' }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: defaultStatus || 'TODO',
          priority: 'MEDIUM',
          tags: [],
        }}
        className="kanban-form"
      >
        <Form.Item
          name="title"
          label="Tên Task"
          rules={[
            { required: true, message: 'Vui lòng nhập tên task!' },
            { whitespace: true, message: 'Tên task không được để trống!' },
          ]}
        >
          <Input placeholder="Nhập tên task..." maxLength={100} />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <TextArea rows={3} placeholder="Mô tả chi tiết task..." maxLength={500} showCount />
        </Form.Item>

        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item name="status" label="Trạng thái" style={{ flex: 1 }}>
            <Select>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <Option key={key} value={key}>
                  {cfg.icon} {cfg.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="priority" label="Ưu tiên" style={{ flex: 1 }}>
            <Select>
              {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                <Option key={key} value={key}>
                  <Tag color={cfg.color} style={{ borderRadius: 4 }}>{cfg.label}</Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item name="tags" label="Tags">
          <Select mode="multiple" placeholder="Chọn tags..." maxTagCount={5}>
            {TAG_OPTIONS.map((tag) => (
              <Option key={tag} value={tag}>{tag}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="deadline"
          label="Deadline"
          rules={[{ required: true, message: 'Vui lòng chọn deadline!' }]}
        >
          <DatePicker
            format="DD/MM/YYYY"
            style={{ width: '100%' }}
            placeholder="Chọn ngày deadline"
            disabledDate={editingTask ? undefined : disabledDate}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskFormModal;
