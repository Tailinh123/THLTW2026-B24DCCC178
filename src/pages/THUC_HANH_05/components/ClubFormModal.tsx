import React, { useState, useRef } from 'react';
import {
  Button, Form, Input, Modal, Switch, DatePicker, Upload, message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import moment from 'moment';
import type { CauLacBo } from '../types';

interface Props {
  open: boolean;
  editRecord: CauLacBo | null;
  onCancel: () => void;
  onSubmit: (data: Omit<CauLacBo, 'id'>) => void;
}

const ClubFormModal: React.FC<Props> = ({ open, editRecord, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [htmlContent, setHtmlContent] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const editorRef = useRef<any>(null);

  React.useEffect(() => {
    if (open) {
      if (editRecord) {
        form.setFieldsValue({
          tenCLB: editRecord.tenCLB,
          ngayThanhLap: moment(editRecord.ngayThanhLap),
          chuNhiem: editRecord.chuNhiem,
          hoatDong: editRecord.hoatDong,
        });
        setHtmlContent(editRecord.moTa);
        setAvatarUrl(editRecord.anhDaiDien);
      } else {
        form.resetFields();
        setHtmlContent('');
        setAvatarUrl('');
      }
    }
  }, [open, editRecord]);

  const handleBeforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ được upload file ảnh!');
      return Upload.LIST_IGNORE;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit({
        tenCLB: values.tenCLB,
        ngayThanhLap: values.ngayThanhLap
          ? values.ngayThanhLap.format('YYYY-MM-DD')
          : '',
        moTa: editorRef.current ? editorRef.current.getContent() : htmlContent,
        chuNhiem: values.chuNhiem,
        hoatDong: values.hoatDong ?? true,
        anhDaiDien: avatarUrl || `https://placehold.co/80x80/1677ff/fff?text=${encodeURIComponent(values.tenCLB?.slice(0, 2) || 'CLB')}`,
      });
    });
  };

  return (
    <Modal
      visible={open}
      title={editRecord ? 'Chỉnh sửa Câu lạc bộ' : 'Thêm Câu lạc bộ mới'}
      onCancel={onCancel}
      onOk={handleOk}
      okText={editRecord ? 'Cập nhật' : 'Thêm mới'}
      cancelText="Hủy"
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
        <Form.Item label="Ảnh đại diện">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt="avatar"
                style={{ width: 72, height: 72, borderRadius: 8, objectFit: 'cover', border: '1px solid #d9d9d9' }}
              />
            )}
            <Upload beforeUpload={handleBeforeUpload} showUploadList={false} accept="image/*">
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </div>
        </Form.Item>

        <Form.Item name="tenCLB" label="Tên câu lạc bộ" rules={[{ required: true, message: 'Vui lòng nhập tên CLB' }]}>
          <Input placeholder="Nhập tên CLB" />
        </Form.Item>

        <Form.Item name="ngayThanhLap" label="Ngày thành lập" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày" />
        </Form.Item>

        <Form.Item name="chuNhiem" label="Chủ nhiệm CLB" rules={[{ required: true, message: 'Vui lòng nhập tên chủ nhiệm' }]}>
          <Input placeholder="Nhập tên chủ nhiệm" />
        </Form.Item>

        <Form.Item label="Mô tả (HTML)">
          <div style={{ border: '1px solid #d9d9d9', borderRadius: 6, overflow: 'hidden' }}>
            <Editor
              onInit={(_evt, editor) => { editorRef.current = editor; }}
              initialValue={htmlContent}
              init={{
                height: 220,
                menubar: false,
                plugins: ['lists', 'link', 'image', 'code'],
                toolbar: 'undo redo | bold italic underline | bullist numlist | link | code',
                content_style: 'body { font-family: -apple-system, sans-serif; font-size: 14px }',
                branding: false,
                statusbar: false,
              }}
            />
          </div>
        </Form.Item>

        <Form.Item name="hoatDong" label="Đang hoạt động" valuePropName="checked" initialValue={true}>
          <Switch checkedChildren="Có" unCheckedChildren="Không" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ClubFormModal;
