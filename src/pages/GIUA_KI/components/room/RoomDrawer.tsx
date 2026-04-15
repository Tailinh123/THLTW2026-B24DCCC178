

import React, { useEffect, useCallback, useState } from 'react';
import { Drawer, Form, Input, Select, Slider, InputNumber, Button, Space } from 'antd';
import { RoomType, Room, RoomFormValues, ROOM_TYPE_LABELS, DrawerMode } from '../../types/room';
import { LECTURERS, CAPACITY_MIN, CAPACITY_MAX } from '../../constants';
import { useRooms } from '../../hooks/useRooms';

const { Option } = Select;

interface RoomDrawerProps {
  visible: boolean;
  mode: DrawerMode;
  editingRoom: Room | null;
  onClose: () => void;
  onSubmit: (room: Room) => void;
}

const SLIDER_MARKS: Record<number, string> = {
  10: '10',
  30: '30',
  100: '100',
  150: '150',
  200: '200',
};

const RoomDrawer: React.FC<RoomDrawerProps> = ({
  visible,
  mode,
  editingRoom,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm<RoomFormValues>();
  const { isIdUnique, isNameUnique } = useRooms();
  const isEdit = mode === 'edit';

  
  const [capacityValue, setCapacityValue] = useState<number>(30);

  
  useEffect(() => {
    if (visible) {
      if (isEdit && editingRoom) {
        form.setFieldsValue({
          id: editingRoom.id,
          name: editingRoom.name,
          capacity: editingRoom.capacity,
          type: editingRoom.type,
          manager: editingRoom.manager,
        });
        setCapacityValue(editingRoom.capacity);
      } else {
        form.resetFields();
        form.setFieldsValue({ capacity: 30 });
        setCapacityValue(30);
      }
    }
  }, [visible, isEdit, editingRoom, form]);

  const handleFinish = useCallback(
    (values: RoomFormValues) => {
      const room: Room = {
        id: values.id.trim(),
        name: values.name.trim(),
        capacity: capacityValue,
        type: values.type,
        manager: values.manager,
      };
      onSubmit(room);
      form.resetFields();
    },
    [onSubmit, form, capacityValue],
  );

  
  const handleCapacityChange = useCallback(
    (value: number | null | undefined) => {
      const numVal = typeof value === 'number' ? value : CAPACITY_MIN;
      const clamped = Math.max(CAPACITY_MIN, Math.min(CAPACITY_MAX, numVal));
      setCapacityValue(clamped);
      form.setFieldsValue({ capacity: clamped });
    },
    [form],
  );

  return (
    <Drawer
      className="gk-drawer"
      title={isEdit ? `Chỉnh sửa: ${editingRoom?.name || ''}` : 'Thêm phòng mới'}
      placement="right"
      width={520}
      visible={visible}
      onClose={onClose}
      destroyOnClose
      footer={
        <Space>
          <Button onClick={onClose}>Hủy</Button>
          <Button
            type="primary"
            className="gk-btn-primary"
            onClick={() => form.submit()}
          >
            {isEdit ? 'Cập nhật' : 'Thêm phòng'}
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        className="gk-form"
        onFinish={handleFinish}
        autoComplete="off"
      >
        {}
        <div className="gk-form-section">
          <div className="gk-form-section__title">Thông tin cơ bản</div>

          {}
          <Form.Item
            name="id"
            label="Mã phòng"
            rules={[
              { required: true, message: 'Vui lòng nhập mã phòng' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const trimmed = value.trim();
                  if (/\s/.test(trimmed)) {
                    return Promise.reject('Mã phòng không được chứa khoảng trắng');
                  }
                  if (trimmed.length > 10) {
                    return Promise.reject('Mã phòng tối đa 10 ký tự');
                  }
                  if (!isIdUnique(trimmed, isEdit ? editingRoom?.id : undefined)) {
                    return Promise.reject('Mã phòng đã tồn tại');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              placeholder="Ví dụ: A1-101"
              disabled={isEdit}
              maxLength={10}
              aria-label="Mã phòng"
            />
          </Form.Item>

          {}
          <Form.Item
            name="name"
            label="Tên phòng"
            rules={[
              { required: true, message: 'Vui lòng nhập tên phòng' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const trimmed = value.trim();
                  if (trimmed.length > 50) {
                    return Promise.reject('Tên phòng tối đa 50 ký tự');
                  }
                  if (!isNameUnique(trimmed, isEdit ? editingRoom?.id : undefined)) {
                    return Promise.reject('Tên phòng đã tồn tại');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              placeholder="Ví dụ: Phòng Lý thuyết CNTT 1"
              maxLength={50}
              aria-label="Tên phòng"
            />
          </Form.Item>
        </div>

        {}
        <div className="gk-form-section">
          <div className="gk-form-section__title">Phân loại</div>

          {}
          <Form.Item
            name="type"
            label="Loại phòng"
            rules={[{ required: true, message: 'Vui lòng chọn loại phòng' }]}
          >
            <Select placeholder="Chọn loại phòng" aria-label="Loại phòng">
              {Object.values(RoomType).map((type) => (
                <Option key={type} value={type}>
                  {ROOM_TYPE_LABELS[type]}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {}
          <Form.Item
            name="manager"
            label="Người quản lý"
            rules={[{ required: true, message: 'Vui lòng chọn người quản lý' }]}
          >
            <Select
              placeholder="Chọn giảng viên"
              showSearch
              optionFilterProp="children"
              aria-label="Người quản lý"
            >
              {LECTURERS.map((lecturer) => (
                <Option key={lecturer} value={lecturer}>
                  {lecturer}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {}
        <div className="gk-form-section">
          <div className="gk-form-section__title">Sức chứa</div>

          {}
          <Form.Item
            name="capacity"
            label="Số chỗ ngồi"
            rules={[
              { required: true, message: 'Vui lòng nhập sức chứa' },
              {
                type: 'number',
                min: CAPACITY_MIN,
                max: CAPACITY_MAX,
                message: `Sức chứa phải từ ${CAPACITY_MIN} đến ${CAPACITY_MAX}`,
              },
            ]}
          >
            {}
            <InputNumber style={{ display: 'none' }} />
          </Form.Item>

          {}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginTop: -8,
            marginBottom: 8,
          }}>
            <InputNumber
              min={CAPACITY_MIN}
              max={CAPACITY_MAX}
              value={capacityValue}
              onChange={handleCapacityChange}
              style={{ width: 100, flexShrink: 0 }}
              aria-label="Nhập sức chứa"
            />
            <Slider
              min={CAPACITY_MIN}
              max={CAPACITY_MAX}
              marks={SLIDER_MARKS}
              value={capacityValue}
              onChange={handleCapacityChange}
              style={{ flex: 1 }}
              className="gk-capacity-control__slider"
            />
          </div>

          {}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            color: '#94A3B8',
            marginBottom: 4,
          }}>
            <span>Nhỏ nhất: {CAPACITY_MIN}</span>
            <span>Lớn nhất: {CAPACITY_MAX}</span>
          </div>
        </div>
      </Form>
    </Drawer>
  );
};

export default React.memo(RoomDrawer);
