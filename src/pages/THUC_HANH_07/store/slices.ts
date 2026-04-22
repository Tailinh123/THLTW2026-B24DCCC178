import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBlogState, ITagState, IAdminState, IPost, ITag, IPostFormValues, ITagFormValues, PostStatus, DrawerMode } from '../types';
import { seedPosts, seedTags } from '../data';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function generateSlug(title: string, existingSlugs: string[]): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  if (!existingSlugs.includes(base)) return base;
  let counter = 1;
  while (existingSlugs.includes(`${base}-${counter}`)) {
    counter += 1;
  }
  return `${base}-${counter}`;
}

const blogInitialState: IBlogState = {
  posts: [],
  isInitialized: false,
};

export const blogSlice = createSlice({
  name: 'blog',
  initialState: blogInitialState,
  reducers: {
    initializePosts(state) {
      if (!state.isInitialized) {
        state.posts = seedPosts;
        state.isInitialized = true;
      }
    },
    addPost(state, action: PayloadAction<IPostFormValues>) {
      const existingSlugs = state.posts.map((p) => p.slug);
      const slug = generateSlug(action.payload.title, existingSlugs);
      const now = new Date().toISOString();
      const newPost: IPost = {
        id: generateId(),
        slug,
        viewCount: 0,
        createdAt: now,
        updatedAt: now,
        ...action.payload,
      };
      state.posts.unshift(newPost);
    },
    updatePost(state, action: PayloadAction<{ id: string; values: IPostFormValues }>) {
      const index = state.posts.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        const current = state.posts[index];
        const otherSlugs = state.posts.filter((p) => p.id !== action.payload.id).map((p) => p.slug);
        const slug = generateSlug(action.payload.values.title, otherSlugs);
        state.posts[index] = {
          ...current,
          ...action.payload.values,
          slug,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deletePost(state, action: PayloadAction<string>) {
      state.posts = state.posts.filter((p) => p.id !== action.payload);
    },
    incrementViewCount(state, action: PayloadAction<string>) {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        post.viewCount += 1;
      }
    },
  },
});

const tagInitialState: ITagState = {
  tags: [],
  isInitialized: false,
};

export const tagSlice = createSlice({
  name: 'tags',
  initialState: tagInitialState,
  reducers: {
    initializeTags(state) {
      if (!state.isInitialized) {
        state.tags = seedTags;
        state.isInitialized = true;
      }
    },
    addTag(state, action: PayloadAction<ITagFormValues>) {
      const newTag: ITag = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        ...action.payload,
      };
      state.tags.push(newTag);
    },
    updateTag(state, action: PayloadAction<{ id: string; values: ITagFormValues }>) {
      const index = state.tags.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tags[index] = { ...state.tags[index], ...action.payload.values };
      }
    },
    deleteTag(state, action: PayloadAction<string>) {
      state.tags = state.tags.filter((t) => t.id !== action.payload);
    },
  },
});

const adminInitialState: IAdminState = {
  drawerVisible: false,
  drawerMode: 'create',
  editingPostId: null,
  statusFilter: 'all',
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState: adminInitialState,
  reducers: {
    openDrawer(state, action: PayloadAction<{ mode: DrawerMode; postId?: string }>) {
      state.drawerVisible = true;
      state.drawerMode = action.payload.mode;
      state.editingPostId = action.payload.postId || null;
    },
    closeDrawer(state) {
      state.drawerVisible = false;
      state.editingPostId = null;
    },
    setStatusFilter(state, action: PayloadAction<PostStatus | 'all'>) {
      state.statusFilter = action.payload;
    },
  },
});

export const blogActions = blogSlice.actions;
export const tagActions = tagSlice.actions;
export const adminActions = adminSlice.actions;
