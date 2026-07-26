import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { postService } from '../../services/postService';
import type { Post, PostFormData } from '../../types';

interface PostsState {
  items: Post[];
  selectedPost: Post | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: PostsState = {
  items: [],
  selectedPost: null,
  loading: false,
  error: null,
  searchQuery: '',
};

export const fetchPosts = createAsyncThunk('posts/fetchAll', async () => {
  return postService.getAll();
});

export const fetchPostById = createAsyncThunk(
  'posts/fetchById',
  async (id: string) => postService.getById(id)
);

export const searchPosts = createAsyncThunk(
  'posts/search',
  async (query: string) => postService.search(query)
);

export const createPost = createAsyncThunk(
  'posts/create',
  async (payload: PostFormData) => postService.create(payload)
);

export const updatePost = createAsyncThunk(
  'posts/update',
  async ({ id, payload }: { id: string; payload: Partial<PostFormData> }) =>
    postService.update(id, payload)
);

export const deletePost = createAsyncThunk(
  'posts/delete',
  async (id: string) => {
    await postService.remove(id);
    return id;
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearSelectedPost(state) {
      state.selectedPost = null;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const setLoading = (state: PostsState) => {
      state.loading = true;
      state.error = null;
    };
    const setError = (state: PostsState, action: { error: { message?: string } }) => {
      state.loading = false;
      state.error = action.error.message ?? 'Erro desconhecido';
    };

    builder
      .addCase(fetchPosts.pending, setLoading)
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, setError)

      .addCase(fetchPostById.pending, setLoading)
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPost = action.payload;
      })
      .addCase(fetchPostById.rejected, setError)

      .addCase(searchPosts.pending, setLoading)
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(searchPosts.rejected, setError)

      .addCase(createPost.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      .addCase(updatePost.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
        state.selectedPost = action.payload;
      })

      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearSelectedPost, setSearchQuery, clearError } = postsSlice.actions;
export default postsSlice.reducer;
