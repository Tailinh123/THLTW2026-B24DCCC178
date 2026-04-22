import { IPost, ITag, PostStatus } from '../types';

const POSTS_KEY = 'thuc_hanh_07_posts';
const TAGS_KEY = 'thuc_hanh_07_tags';

export const postService = {
  getAll(): IPost[] {
    const data = localStorage.getItem(POSTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  save(posts: IPost[]): void {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  },

  getBySlug(posts: IPost[], slug: string): IPost | undefined {
    return posts.find((p) => p.slug === slug);
  },

  getPublished(posts: IPost[]): IPost[] {
    return posts.filter((p) => p.status === PostStatus.PUBLISHED);
  },

  getRelatedPosts(posts: IPost[], currentPost: IPost, limit: number = 3): IPost[] {
    const otherPublished = posts.filter(
      (p) => p.id !== currentPost.id && p.status === PostStatus.PUBLISHED,
    );

    const withScore = otherPublished
      .map((p) => ({
        post: p,
        commonTags: p.tagIds.filter((tagId) => currentPost.tagIds.includes(tagId)).length,
      }))
      .filter((item) => item.commonTags > 0)
      .sort((a, b) => {
        if (b.commonTags !== a.commonTags) return b.commonTags - a.commonTags;
        const dateA = new Date(a.post.createdAt).getTime();
        const dateB = new Date(b.post.createdAt).getTime();
        if (dateB !== dateA) return dateB - dateA;
        return b.post.viewCount - a.post.viewCount;
      })
      .slice(0, limit)
      .map((item) => item.post);

    if (withScore.length < limit) {
      const existingIds = new Set([currentPost.id, ...withScore.map((p) => p.id)]);
      const fallback = otherPublished
        .filter((p) => !existingIds.has(p.id))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit - withScore.length);
      return [...withScore, ...fallback];
    }

    return withScore;
  },

  searchPosts(posts: IPost[], query: string): IPost[] {
    const lowerQuery = query.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.excerpt.toLowerCase().includes(lowerQuery),
    );
  },

  filterByTags(posts: IPost[], tagIds: string[]): IPost[] {
    if (tagIds.length === 0) return posts;
    return posts.filter((p) => tagIds.some((tagId) => p.tagIds.includes(tagId)));
  },

  filterByStatus(posts: IPost[], status: PostStatus | 'all'): IPost[] {
    if (status === 'all') return posts;
    return posts.filter((p) => p.status === status);
  },
};

export const tagService = {
  getAll(): ITag[] {
    const data = localStorage.getItem(TAGS_KEY);
    return data ? JSON.parse(data) : [];
  },

  save(tags: ITag[]): void {
    localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
  },

  getPostCount(tag: ITag, posts: IPost[]): number {
    return posts.filter((p) => p.tagIds.includes(tag.id)).length;
  },

  getTagsByIds(tags: ITag[], ids: string[]): ITag[] {
    return tags.filter((t) => ids.includes(t.id));
  },
};

export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};
