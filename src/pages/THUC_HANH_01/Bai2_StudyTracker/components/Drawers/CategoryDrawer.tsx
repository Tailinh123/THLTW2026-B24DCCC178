import React, { useEffect } from 'react';
import { Drawer, Form, Input, InputNumber, Button, Space, notification } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { addCategory, updateCategory } from '../../../store/studySlice';
import { COLOR_SWATCHES } from '../../constants';
import styles from '../../index.less';

interface Props {
  visible: boolean;
  onClose: () => void;
  editingCategoryId: string | null;
}

const CategoryDrawer: React.FC<Props> = ({ visible, onClose, editingCategoryId }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state: RootState) => state.study);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (editingCategoryId) {
        const category = categories.find((c) => c.id === editingCategoryId);
        if (category) {
          form.setFieldsValue({
            name: category.name,
            goalHours: category.goalHours || 0,
          });
        }
      } else {
        form.resetFields();
      }
    }
  }, [visible, editingCategoryId, categories, form]);

  const getAutoColor = (): string => {
    const usedColors = categories.map((c) => c.color);
    const available = COLOR_SWATCHES.filter((c) => !usedColors.includes(c));
    if (available.length > 0) return available[0];
    return COLOR_SWATCHES[categories.length % COLOR_SWATCHES.length];
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const existingCat = editingCategoryId
          ? categories.find((c) => c.id === editingCategoryId)
          : null;

        const payload = {
          id: editingCategoryId || Date.now().toString(),
          name: values.name,
          icon: existingCat?.icon || 'book',
          color: existingCat?.color || getAutoColor(),
          goalHours: values.goalHours || 0,
        };

        if (editingCategoryId) {
          dispatch(updateCategory(payload));
          notification.success({ message: 'Đã cập nhật môn học' });
        } else {
          dispatch(addCategory(payload));
          notification.success({ message: 'Đã thêm môn học mới' });
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
      title={editingCategoryId ? 'Sửa Môn Học' : 'Tạo Môn Học Mới'}
      placement="right"
      width={400}
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
              {editingCategoryId ? 'Cập nhật' : 'Lưu Môn Học'}
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
          name="name"
          label="Tên môn học"
          rules={[{ required: true, message: 'Vui lòng nhập tên môn học' }]}
        >
          <Input placeholder="VD: Toán Cao Cấp" autoFocus />
        </Form.Item>

        <Form.Item
          name="goalHours"
          label="Mục tiêu tháng (giờ)"
          rules={[{ type: 'number', min: 0, message: 'Không được âm' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            max={200}
            step={1}
            placeholder="VD: 20"
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CategoryDrawer;
