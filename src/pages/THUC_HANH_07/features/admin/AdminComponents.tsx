import React, { useMemo, useState, useEffect } from 'react';
import { Table, Button, Tag, Popconfirm, Drawer, Form, Input, Select, Upload, message, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { IPost, ITag, PostStatus, IPostFormValues } from '../../types';
import { useAppSelector } from '../../store/hooks';
import { formatDate } from '../../store/services';

const { Option } = Select;
const { TextArea } = Input;

interface IPostTableProps {
  posts: IPost[];
  statusFilter: PostStatus | 'all';
  onStatusFilterChange: (value: PostStatus | 'all') => void;
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => void;
  onCreate: () => void;
}

export const PostTable: React.FC<IPostTableProps> = ({
  posts,
  statusFilter,
  onStatusFilterChange,
  onEdit,
  onDelete,
  onCreate,
}) => {
  const tags = useAppSelector((state) => state.tags.tags);

  const filteredPosts = useMemo(() => {
    if (statusFilter === 'all') return posts;
    return posts.filter((p) => p.status === statusFilter);
  }, [posts, statusFilter]);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
      render: (title: string, record: IPost) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>{title}</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>/{record.slug}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '12%',
      render: (status: PostStatus) => (
        <Tag color={status === PostStatus.PUBLISHED ? 'green' : 'orange'}>
          {status === PostStatus.PUBLISHED ? 'Published' : 'Draft'}
        </Tag>
      ),
    },
    {
      title: 'Tags',
      dataIndex: 'tagIds',
      key: 'tags',
      width: '20%',
      render: (tagIds: string[]) => (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {tagIds.slice(0, 3).map((tagId) => {
            const tag = tags.find((t) => t.id === tagId);
            return tag ? <Tag key={tag.id} color={tag.color} style={{ fontSize: 11 }}>{tag.name}</Tag> : null;
          })}
        </div>
      ),
    },
    {
      title: 'Views',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: '10%',
      sorter: (a: IPost, b: IPost) => a.viewCount - b.viewCount,
      render: (count: number) => (
        <span><EyeOutlined style={{ marginRight: 4 }} />{count}</span>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '15%',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '13%',
      render: (_: unknown, record: IPost) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record.id)} size="small">
            Edit
          </Button>
          <Popconfirm title="Delete this post?" onConfirm={() => onDelete(record.id)} okText="Yes" cancelText="No">
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="th07-admin-table-card">
      <div className="th07-admin-table-toolbar">
        <Space>
          <span style={{ fontWeight: 600 }}>Posts</span>
          <Select value={statusFilter} onChange={onStatusFilterChange} style={{ width: 140 }} size="middle">
            <Option value="all">All Status</Option>
            <Option value={PostStatus.PUBLISHED}>Published</Option>
            <Option value={PostStatus.DRAFT}>Draft</Option>
          </Select>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          New Post
        </Button>
      </div>
      <Table
        dataSource={filteredPosts}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 8, showSizeChanger: false }}
        size="middle"
      />
    </div>
  );
};

interface IMarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const MarkdownEditor: React.FC<IMarkdownEditorProps> = ({ value = '', onChange }) => (
  <div className="th07-md-editor">
    <textarea
      className="th07-md-editor__input"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder="Write your markdown content here..."
    />
    <div className="th07-md-editor__preview th07-markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{value || '*Preview will appear here...*'}</ReactMarkdown>
    </div>
  </div>
);

interface IPostFormDrawerProps {
  visible: boolean;
  editingPost: IPost | null;
  onClose: () => void;
  onSubmit: (values: IPostFormValues) => void;
}

export const PostFormDrawer: React.FC<IPostFormDrawerProps> = ({ visible, editingPost, onClose, onSubmit }) => {
  const [form] = Form.useForm<IPostFormValues>();
  const tags = useAppSelector((state) => state.tags.tags);
  const [markdownContent, setMarkdownContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (visible && editingPost) {
      form.setFieldsValue({
        title: editingPost.title,
        excerpt: editingPost.excerpt,
        content: editingPost.content,
        coverImage: editingPost.coverImage,
        tagIds: editingPost.tagIds,
        status: editingPost.status,
      });
      setMarkdownContent(editingPost.content);
      setImagePreview(editingPost.coverImage);
    } else if (visible) {
      form.resetFields();
      form.setFieldsValue({ status: PostStatus.DRAFT, tagIds: [] });
      setMarkdownContent('');
      setImagePreview('');
    }
  }, [visible, editingPost, form]);

  const handleFinish = (values: IPostFormValues) => {
    onSubmit({ ...values, content: markdownContent });
    onClose();
  };

  const handleUploadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setImagePreview(base64);
      form.setFieldsValue({ coverImage: base64 });
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImagePreview(url);
  };

  const title = form.getFieldValue('title') || '';
  const autoSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  return (
    <Drawer
      title={editingPost ? 'Edit Post' : 'Create New Post'}
      width={860}
      visible={visible}
      onClose={onClose}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>Cancel</Button>
          <Button type="primary" onClick={() => form.submit()}>
            {editingPost ? 'Update' : 'Create'}
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
          <Input placeholder="Post title" size="large" />
        </Form.Item>
        <div style={{ marginBottom: 16, padding: '8px 12px', background: '#f8fafc', borderRadius: 8, fontSize: 13, color: '#64748b' }}>
          Slug preview: <strong>/{autoSlug || '...'}</strong>
        </div>
        <Form.Item name="excerpt" label="Excerpt" rules={[{ required: true, message: 'Excerpt is required' }]}>
          <TextArea rows={2} placeholder="Brief description of the post" />
        </Form.Item>
        <Form.Item label="Cover Image">
          <Space direction="vertical" style={{ width: '100%' }} size={12}>
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={handleUploadFile as any}
            >
              <Button icon={<UploadOutlined />}>Upload from device (Base64)</Button>
            </Upload>
            <Form.Item name="coverImage" noStyle>
              <Input placeholder="https://images.unsplash.com/..." onChange={handleUrlChange} />
            </Form.Item>
            {imagePreview && (
              <div style={{ marginTop: 4 }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: 160, borderRadius: 8, objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}
          </Space>
        </Form.Item>
        <Form.Item label="Content (Markdown)">
          <MarkdownEditor value={markdownContent} onChange={setMarkdownContent} />
        </Form.Item>
        <Form.Item name="tagIds" label="Tags">
          <Select mode="multiple" placeholder="Select tags" allowClear>
            {tags.map((tag) => (
              <Option key={tag.id} value={tag.id}>
                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: tag.color, marginRight: 8 }} />
                {tag.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select>
            <Option value={PostStatus.DRAFT}>Draft</Option>
            <Option value={PostStatus.PUBLISHED}>Published</Option>
          </Select>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
