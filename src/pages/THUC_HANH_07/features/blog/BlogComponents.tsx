import React from 'react';
import { Input, Tag, Empty } from 'antd';
import { SearchOutlined, EyeOutlined, CalendarOutlined } from '@ant-design/icons';
import { IPost, ITag } from '../../types';
import { useAppSelector } from '../../store/hooks';
import { formatDate } from '../../store/services';
import { useHashRouter } from '../../store/hooks';

interface IPostCardProps {
  post: IPost;
  onNavigate: (slug: string) => void;
}

export const PostCard: React.FC<IPostCardProps> = ({ post, onNavigate }) => {
  const tags = useAppSelector((state) => state.tags.tags);
  const postTags = tags.filter((t) => post.tagIds.includes(t.id));

  return (
    <div className="th07-post-card" onClick={() => onNavigate(post.slug)}>
      <img
        className="th07-post-card__image"
        src={post.coverImage}
        alt={post.title}
        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80'; }}
      />
      <div className="th07-post-card__body">
        <div className="th07-post-card__tags">
          {postTags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="th07-post-card__tag"
              style={{ background: `${tag.color}18`, color: tag.color }}
            >
              {tag.name}
            </span>
          ))}
        </div>
        <h3 className="th07-post-card__title">{post.title}</h3>
        <p className="th07-post-card__excerpt">{post.excerpt}</p>
        <div className="th07-post-card__meta">
          <span><CalendarOutlined /> {formatDate(post.createdAt)}</span>
          <span><EyeOutlined /> {post.viewCount} views</span>
        </div>
      </div>
    </div>
  );
};

interface IPostGridProps {
  posts: IPost[];
}

export const PostGrid: React.FC<IPostGridProps> = ({ posts }) => {
  const [, navigate] = useHashRouter();

  if (posts.length === 0) {
    return (
      <div className="th07-empty">
        <Empty description="No posts found" />
      </div>
    );
  }

  return (
    <div className="th07-post-grid">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onNavigate={(slug) => navigate(`/post/${slug}`)} />
      ))}
    </div>
  );
};

interface ISearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<ISearchBarProps> = ({ value, onChange }) => (
  <Input
    prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
    placeholder="Search posts..."
    value={value}
    onChange={(e) => onChange(e.target.value)}
    allowClear
    size="large"
  />
);

interface ITagFilterProps {
  tags: ITag[];
  selectedTagIds: string[];
  onToggle: (tagId: string) => void;
}

export const TagFilter: React.FC<ITagFilterProps> = ({ tags, selectedTagIds, onToggle }) => (
  <div className="th07-tag-filter">
    {tags.map((tag) => (
      <span
        key={tag.id}
        className={`th07-tag-chip ${selectedTagIds.includes(tag.id) ? 'th07-tag-chip--active' : ''}`}
        onClick={() => onToggle(tag.id)}
        style={
          selectedTagIds.includes(tag.id)
            ? { background: tag.color, borderColor: tag.color }
            : {}
        }
      >
        {tag.name}
      </span>
    ))}
  </div>
);

export const HeroSection: React.FC = () => (
  <div className="th07-hero">
    <h1 className="th07-hero__title">Welcome to DevBlog</h1>
    <p className="th07-hero__subtitle">
      Exploring modern web development through in-depth articles about React, TypeScript, design patterns, and software engineering best practices.
    </p>
  </div>
);
