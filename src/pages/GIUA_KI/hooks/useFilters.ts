import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  setSearch as setSearchAction,
  setTypeFilter as setTypeFilterAction,
  setManagerFilter as setManagerFilterAction,
  setSort as setSortAction,
  setPagination as setPaginationAction,
  setVisibleColumns as setVisibleColumnsAction,
  clearAllFilters as clearAllFiltersAction,
} from '../redux/slices/filterSlice';
import { Room, RoomType, PaginationConfig } from '../types/room';
import { useDebounce } from './useDebounce';

export function useFilters(rooms: Room[]) {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filters);
  const debouncedSearch = useDebounce(filters.search, 300);

  const filteredRooms = useMemo(() => {
    let result = [...rooms];

    if (debouncedSearch) {
      const keyword = debouncedSearch.toLowerCase();
      result = result.filter(
        (room) =>
          room.id.toLowerCase().includes(keyword) ||
          room.name.toLowerCase().includes(keyword) ||
          room.manager.toLowerCase().includes(keyword),
      );
    }

    if (filters.typeFilter) {
      result = result.filter((room) => room.type === filters.typeFilter);
    }

    if (filters.managerFilter) {
      result = result.filter((room) => room.manager === filters.managerFilter);
    }

    if (filters.sortField === 'capacity' && filters.sortOrder) {
      result.sort((a, b) =>
        filters.sortOrder === 'ascend'
          ? a.capacity - b.capacity
          : b.capacity - a.capacity,
      );
    }

    return result;
  }, [rooms, debouncedSearch, filters.typeFilter, filters.managerFilter, filters.sortField, filters.sortOrder]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count += 1;
    if (filters.typeFilter) count += 1;
    if (filters.managerFilter) count += 1;
    return count;
  }, [filters.search, filters.typeFilter, filters.managerFilter]);

  const hasActiveFilters = activeFilterCount > 0;

  const setSearch = useCallback(
    (value: string) => dispatch(setSearchAction(value)),
    [dispatch],
  );

  const setTypeFilter = useCallback(
    (value: RoomType | null) => dispatch(setTypeFilterAction(value)),
    [dispatch],
  );

  const setManagerFilter = useCallback(
    (value: string | null) => dispatch(setManagerFilterAction(value)),
    [dispatch],
  );

  const setSort = useCallback(
    (field: 'capacity' | null, order: 'ascend' | 'descend' | null) =>
      dispatch(setSortAction({ field, order })),
    [dispatch],
  );

  const setPagination = useCallback(
    (config: Partial<PaginationConfig>) => dispatch(setPaginationAction(config)),
    [dispatch],
  );

  const setVisibleColumns = useCallback(
    (columns: string[]) => dispatch(setVisibleColumnsAction(columns)),
    [dispatch],
  );

  const clearAllFilters = useCallback(
    () => dispatch(clearAllFiltersAction()),
    [dispatch],
  );

  return {
    search: filters.search,
    debouncedSearch,
    typeFilter: filters.typeFilter,
    managerFilter: filters.managerFilter,
    sortField: filters.sortField,
    sortOrder: filters.sortOrder,
    pagination: filters.pagination,
    visibleColumns: filters.visibleColumns,

    filteredRooms,
    activeFilterCount,
    hasActiveFilters,

    setSearch,
    setTypeFilter,
    setManagerFilter,
    setSort,
    setPagination,
    setVisibleColumns,
    clearAllFilters,
  };
}
