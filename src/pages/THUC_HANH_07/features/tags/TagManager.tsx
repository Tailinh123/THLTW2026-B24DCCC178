import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Table, Button, Tag, Popconfirm, Modal, Form, Input, Select, message, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { tagActions } from '../../store/slices';
import { ITag, ITagFormValues } from '../../types';
import { tagService, formatDate } from '../../store/services';

const { Option } = Select;

const TAG_COLORS = [
  '#1677ff', '#61dafb', '#3178c6', '#e44d26', '#68a063',
  '#f59e0b', '#8b5cf6', '#ef4444', '#10b981', '#ec4899',
  '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#14b8a6',
];

export const TagManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const tags = useAppSelector((state) => state.tags.tags);
  const posts = useAppSelector((state) => state.blog.posts);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<ITag | null>(null);
  const [form] = Form.useForm<ITagFormValues>();

  const tagsWithCount = useMemo(() =>
    tags.map((tag) => ({
      ...tag,
      postCount: tagService.getPostCount(tag, posts),
    })),
  [tags, posts]);

  const handleOpenCreate = useCallback(() => {
    setEditingTag(null);
    form.resetFields();
    form.setFieldsValue({ color: TAG_COLORS[0] });
    setModalVisible(true);
  }, [form]);

  const handleOpenEdit = useCallback((tag: ITag) => {
    setEditingTag(tag);
    form.setFieldsValue({ name: tag.name, color: tag.color, description: tag.description });
    setModalVisible(true);
  }, [form]);

  const handleClose = useCallback(() => {
    setModalVisible(false);
    setEditingTag(null);
  }, []);

  const handleSubmit = useCallback(() => {
    form.validateFields().then((values) => {
      if (editingTag) {
        dispatch(tagActions.updateTag({ id: editingTag.id, values }));
        message.success('Tag updated successfully');
      } else {
        dispatch(tagActions.addTag(values));
        message.success('Tag created successfully');
      }
      handleClose();
    });
  }, [form, editingTag, dispatch, handleClose]);

  const handleDelete = useCallback((tagId: string) => {
    dispatch(tagActions.deleteTag(tagId));
    message.success('Tag deleted successfully');
  }, [dispatch]);

  const columns = [
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      width: '8%',
      render: (color: string) => <span className="th07-color-dot" style={{ background: color }} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: (name: string, record: ITag) => <Tag color={record.color}>{name}</Tag>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
      render: (desc: string) => <span style={{ color: '#64748b' }}>{desc}</span>,
    },
    {
      title: 'Posts',
      key: 'postCount',
      width: '12%',
      render: (_: unknown, record: ITag & { postCount: number }) => (
        <span style={{ fontWeight: 600 }}>{record.postCount}</span>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '15%',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '15%',
      render: (_: unknown, record: ITag) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenEdit(record)} size="small">
            Edit
          </Button>
          <Popconfirm title="Delete this tag?" onConfirm={() => handleDelete(record.id)} okText="Yes" cancelText="No">
            <Button type="link" danger icon={<DeleteOutlined />} size="small">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="th07-fade-in">
      <div className="th07-admin-header">
        <h1 className="th07-admin-header__title">Tag Management</h1>
        <p className="th07-admin-header__subtitle">Organize your content with tags</p>
      </div>
      <div className="th07-tag-table-card">
        <div className="th07-admin-table-toolbar">
          <span style={{ fontWeight: 600 }}>{tags.length} Tags</span>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>
            New Tag
          </Button>
        </div>
        <Table dataSource={tagsWithCount} columns={columns} rowKey="id" pagination={false} size="middle" />
      </div>
      <Modal
        title={editingTag ? 'Edit Tag' : 'Create New Tag'}
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={handleClose}
        okText={editingTag ? 'Update' : 'Create'}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tag Name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input placeholder="e.g. React, TypeScript" />
          </Form.Item>
          <Form.Item name="color" label="Color" rules={[{ required: true }]}>
            <Select>
              {TAG_COLORS.map((color) => (
                <Option key={color} value={color}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 14, height: 14, borderRadius: '50%', background: color, display: 'inline-block' }} />
                    {color}
                  </span>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} placeholder="Brief description of this tag" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
