import React, { useEffect } from 'react';
import { Drawer, Form, Input, Button, Select, DatePicker, InputNumber, Space, notification } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { addSession, updateSession } from '../../../store/studySlice';
import { getSubjectIcon } from '../../constants';
import styles from '../../index.less';

interface Props {
  visible: boolean;
  onClose: () => void;
  editingSessionId: string | null;
}

const SessionDrawer: React.FC<Props> = ({ visible, onClose, editingSessionId }) => {
  const dispatch = useDispatch();
  const { categories, sessions } = useSelector((state: RootState) => state.study);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (editingSessionId) {
        const session = sessions.find((s) => s.id === editingSessionId);
        if (session) {
          form.setFieldsValue({
            categoryId: session.categoryId,
            date: moment(session.date),
            durationHours: session.durationHours,
            content: session.content,
            notes: session.notes || '',
          });
        }
      } else {
        form.resetFields();
        form.setFieldsValue({ date: moment(), durationHours: 1 });
      }
    }
  }, [visible, editingSessionId, sessions, form]);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = {
          id: editingSessionId || Date.now().toString(),
          categoryId: values.categoryId,
          date: values.date.format('YYYY-MM-DD'),
          durationHours: values.durationHours,
          content: values.content,
          notes: values.notes || '',
        };
        if (editingSessionId) {
          dispatch(updateSession(payload));
          notification.success({ message: 'Đã cập nhật phiên học' });
        } else {
          dispatch(addSession(payload));
          notification.success({ message: 'Đã thêm phiên học mới' });
        }
        onClose();
      })
      .catch(() => {});
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      title={editingSessionId ? 'Sửa Phiên Học' : 'Thêm Phiên Học Mới'}
      placement="right"
      width={420}
      onClose={handleCancel}
      visible={visible}
      className={styles.drawerDark}
      footer={
        <div className={styles.drawerFooter}>
          <Space>
            <Button onClick={handleCancel} icon={<CloseOutlined />} className={styles.drawerCancelBtn}>
              Hủy
            </Button>
            <Button
              type="primary"
              onClick={handleSave}
              icon={<SaveOutlined />}
              className={styles.drawerSaveBtn}
            >
              {editingSessionId ? 'Cập nhật' : 'Lưu Phiên Học'}
            </Button>
          </Space>
        </div>
      }
      footerStyle={{
        background: '#161923',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '12px 24px',
      }}
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          name="categoryId"
          label="Môn học"
          rules={[{ required: true, message: 'Chọn môn học' }]}
        >
          <Select
            placeholder="Chọn môn học..."
            dropdownStyle={{ background: '#1a1d2e' }}
          >
            {categories.map((c) => (
              <Select.Option key={c.id} value={c.id}>
                <span style={{ color: c.color, marginRight: 8 }}>
                  {getSubjectIcon(c.icon)}
                </span>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="date"
          label="Ngày học"
          rules={[{ required: true, message: 'Chọn ngày học' }]}
        >
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item
          name="durationHours"
          label="Thời lượng (giờ)"
          rules={[
            { required: true, message: 'Nhập thời lượng' },
            { type: 'number', min: 0.1, message: 'Tối thiểu 0.1 giờ' },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            step={0.5}
            min={0.1}
            max={24}
            placeholder="VD: 1.5"
          />
        </Form.Item>

        <Form.Item
          name="content"
          label="Nội dung học"
          rules={[{ required: true, message: 'Nhập nội dung' }]}
        >
          <Input placeholder="VD: Giải tích vi phân chương 3" />
        </Form.Item>

        <Form.Item name="notes" label="Ghi chú">
          <Input.TextArea
            rows={3}
            placeholder="Ghi chú thêm về buổi học..."
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default SessionDrawer;
