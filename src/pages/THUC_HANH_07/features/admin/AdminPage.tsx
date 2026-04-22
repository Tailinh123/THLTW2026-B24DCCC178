import React, { useMemo, useCallback } from 'react';
import { message } from 'antd';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { blogActions, adminActions } from '../../store/slices';
import { PostStatus, IPostFormValues } from '../../types';
import { PostTable, PostFormDrawer } from './AdminComponents';

export const AdminPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.blog.posts);
  const { drawerVisible, drawerMode, editingPostId, statusFilter } = useAppSelector((state) => state.admin);

  const editingPost = useMemo(() => {
    if (!editingPostId) return null;
    return posts.find((p) => p.id === editingPostId) || null;
  }, [posts, editingPostId]);

  const stats = useMemo(() => ({
    total: posts.length,
    published: posts.filter((p) => p.status === PostStatus.PUBLISHED).length,
    draft: posts.filter((p) => p.status === PostStatus.DRAFT).length,
    totalViews: posts.reduce((sum, p) => sum + p.viewCount, 0),
  }), [posts]);

  const handleCreate = useCallback(() => {
    dispatch(adminActions.openDrawer({ mode: 'create' }));
  }, [dispatch]);

  const handleEdit = useCallback((postId: string) => {
    dispatch(adminActions.openDrawer({ mode: 'edit', postId }));
  }, [dispatch]);

  const handleClose = useCallback(() => {
    dispatch(adminActions.closeDrawer());
  }, [dispatch]);

  const handleDelete = useCallback((postId: string) => {
    dispatch(blogActions.deletePost(postId));
    message.success('Post deleted successfully');
  }, [dispatch]);

  const handleSubmit = useCallback((values: IPostFormValues) => {
    if (drawerMode === 'create') {
      dispatch(blogActions.addPost(values));
      message.success('Post created successfully');
    } else if (editingPostId) {
      dispatch(blogActions.updatePost({ id: editingPostId, values }));
      message.success('Post updated successfully');
    }
    dispatch(adminActions.closeDrawer());
  }, [dispatch, drawerMode, editingPostId]);

  const handleStatusFilter = useCallback((value: PostStatus | 'all') => {
    dispatch(adminActions.setStatusFilter(value));
  }, [dispatch]);

  return (
    <div className="th07-fade-in">
      <div className="th07-admin-header">
        <h1 className="th07-admin-header__title">Dashboard</h1>
        <p className="th07-admin-header__subtitle">Manage your blog posts and content</p>
      </div>
      <div className="th07-admin-stats">
        <div className="th07-stat-card">
          <div className="th07-stat-card__label">Total Posts</div>
          <div className="th07-stat-card__value">{stats.total}</div>
        </div>
        <div className="th07-stat-card">
          <div className="th07-stat-card__label">Published</div>
          <div className="th07-stat-card__value" style={{ color: '#10b981' }}>{stats.published}</div>
        </div>
        <div className="th07-stat-card">
          <div className="th07-stat-card__label">Drafts</div>
          <div className="th07-stat-card__value" style={{ color: '#f59e0b' }}>{stats.draft}</div>
        </div>
        <div className="th07-stat-card">
          <div className="th07-stat-card__label">Total Views</div>
          <div className="th07-stat-card__value" style={{ color: '#1677ff' }}>{stats.totalViews.toLocaleString()}</div>
        </div>
      </div>
      <PostTable
        posts={posts}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilter}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
      />
      <PostFormDrawer
        visible={drawerVisible}
        editingPost={editingPost}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
