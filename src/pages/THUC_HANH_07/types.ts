export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export interface ITag {
  id: string;
  name: string;
  color: string;
  description: string;
  createdAt: string;
}

export interface ITagFormValues {
  name: string;
  color: string;
  description: string;
}

export interface IPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tagIds: string[];
  status: PostStatus;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IPostFormValues {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tagIds: string[];
  status: PostStatus;
}

export interface ISocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface IUser {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  skills: string[];
  socialLinks: ISocialLink[];
}

export interface IBlogState {
  posts: IPost[];
  isInitialized: boolean;
}

export interface ITagState {
  tags: ITag[];
  isInitialized: boolean;
}

export type DrawerMode = 'create' | 'edit';

export interface IAdminState {
  drawerVisible: boolean;
  drawerMode: DrawerMode;
  editingPostId: string | null;
  statusFilter: PostStatus | 'all';
}

export interface IPaginationConfig {
  current: number;
  pageSize: number;
}
