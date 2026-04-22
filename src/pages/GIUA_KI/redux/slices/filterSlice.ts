import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RoomType, PaginationConfig } from '../../types/room';
import { ALL_COLUMN_KEYS, DEFAULT_PAGE_SIZE } from '../../constants';

export interface FilterState {
  search: string;
  typeFilter: RoomType | null;
  managerFilter: string | null;
  sortField: 'capacity' | null;
  sortOrder: 'ascend' | 'descend' | null;
  pagination: PaginationConfig;
  visibleColumns: string[];
}

const initialState: FilterState = {
  search: '',
  typeFilter: null,
  managerFilter: null,
  sortField: null,
  sortOrder: null,
  pagination: {
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  },
  visibleColumns: [...ALL_COLUMN_KEYS],
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.pagination.current = 1;
    },

    setTypeFilter(state, action: PayloadAction<RoomType | null>) {
      state.typeFilter = action.payload;
      state.pagination.current = 1;
    },

    setManagerFilter(state, action: PayloadAction<string | null>) {
      state.managerFilter = action.payload;
      state.pagination.current = 1;
    },

    setSort(state, action: PayloadAction<{ field: 'capacity' | null; order: 'ascend' | 'descend' | null }>) {
      state.sortField = action.payload.field;
      state.sortOrder = action.payload.order;
    },

    setPagination(state, action: PayloadAction<Partial<PaginationConfig>>) {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    setVisibleColumns(state, action: PayloadAction<string[]>) {
      state.visibleColumns = action.payload;
    },

    clearAllFilters(state) {
      state.search = '';
      state.typeFilter = null;
      state.managerFilter = null;
      state.sortField = null;
      state.sortOrder = null;
      state.pagination.current = 1;
    },
  },
});

export const {
  setSearch,
  setTypeFilter,
  setManagerFilter,
  setSort,
  setPagination,
  setVisibleColumns,
  clearAllFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
