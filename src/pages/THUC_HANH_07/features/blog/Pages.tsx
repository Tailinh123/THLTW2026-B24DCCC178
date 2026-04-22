import React, { useState, useMemo, useEffect } from 'react';
import { Pagination, Tag } from 'antd';
import { EyeOutlined, CalendarOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAppSelector, useAppDispatch, useDebounce, useHashRouter, useSessionViewTracker, useSimulateLoading } from '../../store/hooks';
import { blogActions } from '../../store/slices';
import { postService } from '../../store/services';
import { formatDate } from '../../store/services';
import { PostStatus } from '../../types';
import { HeroSection, SearchBar, TagFilter, PostGrid, PostCard } from './BlogComponents';
import { PostGridSkeleton, PostDetailSkeleton } from '../../components/Shared';

export const HomePage: React.FC = () => {
  const posts = useAppSelector((state) => state.blog.posts);
  const tags = useAppSelector((state) => state.tags.tags);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  const isLoading = useSimulateLoading(500);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredPosts = useMemo(() => {
    let result = postService.getPublished(posts);
    if (debouncedSearch) {
      result = postService.searchPosts(result, debouncedSearch);
    }
    if (selectedTagIds.length > 0) {
      result = postService.filterByTags(result, selectedTagIds);
    }
    return result;
  }, [posts, debouncedSearch, selectedTagIds]);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPosts.slice(start, start + pageSize);
  }, [filteredPosts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedTagIds]);

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
    );
  };

  return (
    <div className="th07-fade-in">
      <HeroSection />
      <div className="th07-filter-bar">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <TagFilter tags={tags} selectedTagIds={selectedTagIds} onToggle={handleTagToggle} />
      </div>
      {isLoading ? (
        <PostGridSkeleton />
      ) : (
        <>
          <PostGrid posts={paginatedPosts} />
          {filteredPosts.length > pageSize && (
            <div className="th07-pagination">
              <Pagination
                current={currentPage}
                total={filteredPosts.length}
                pageSize={pageSize}
                onChange={setCurrentPage}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

interface IPostDetailProps {
  slug: string;
}

export const PostDetailPage: React.FC<IPostDetailProps> = ({ slug }) => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.blog.posts);
  const tags = useAppSelector((state) => state.tags.tags);
  const [, navigate] = useHashRouter();
  const isLoading = useSimulateLoading(500);

  const post = useMemo(() => postService.getBySlug(posts, slug), [posts, slug]);
  const alreadyViewed = useSessionViewTracker(post?.id || '');

  useEffect(() => {
    if (post && !alreadyViewed) {
      dispatch(blogActions.incrementViewCount(post.id));
    }
  }, [post, alreadyViewed, dispatch]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return postService.getRelatedPosts(posts, post, 3);
  }, [posts, post]);

  const postTags = useMemo(() => {
    if (!post) return [];
    return tags.filter((t) => post.tagIds.includes(t.id));
  }, [tags, post]);

  if (!post) {
    return (
      <div className="th07-fade-in" style={{ textAlign: 'center', padding: '80px 0' }}>
        <h2>Post not found</h2>
        <button className="th07-back-btn" onClick={() => navigate('/')}>
          <ArrowLeftOutlined /> Back to Home
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <PostDetailSkeleton />;
  }

  return (
    <div className="th07-post-detail">
      <button className="th07-back-btn" onClick={() => navigate('/')}>
        <ArrowLeftOutlined /> Back to Home
      </button>
      <img
        className="th07-post-detail__cover"
        src={post.coverImage}
        alt={post.title}
        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80'; }}
      />
      <div className="th07-post-detail__header">
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          {postTags.map((tag) => (
            <Tag key={tag.id} color={tag.color}>{tag.name}</Tag>
          ))}
        </div>
        <h1 className="th07-post-detail__title">{post.title}</h1>
        <div className="th07-post-detail__meta">
          <span className="th07-post-detail__meta-item">
            <CalendarOutlined /> {formatDate(post.createdAt)}
          </span>
          <span className="th07-post-detail__meta-item">
            <EyeOutlined /> {post.viewCount} views
          </span>
        </div>
      </div>
      <div className="th07-markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
      {relatedPosts.length > 0 && (
        <div className="th07-related">
          <h2 className="th07-related__title">Related Posts</h2>
          <div className="th07-related__grid">
            {relatedPosts.map((rp) => (
              <PostCard key={rp.id} post={rp} onNavigate={(s) => navigate(`/post/${s}`)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

