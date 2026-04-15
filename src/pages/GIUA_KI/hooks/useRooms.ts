// ============================================================
// GIUA_KI — useRooms Hook
// ============================================================

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  addRoom as addRoomAction,
  updateRoom as updateRoomAction,
  deleteRoom as deleteRoomAction,
  resetToDefaults as resetToDefaultsAction,
  clearHighlight as clearHighlightAction,
} from '../redux/slices/roomSlice';
import { Room } from '../types/room';
import { CAPACITY_DELETE_THRESHOLD } from '../constants';

export function useRooms() {
  const dispatch = useDispatch();
  const { items: rooms, loading, highlightedId } = useSelector(
    (state: RootState) => state.rooms,
  );

  const addRoom = useCallback(
    (room: Room) => {
      dispatch(addRoomAction(room));
    },
    [dispatch],
  );

  const updateRoom = useCallback(
    (room: Room) => {
      dispatch(updateRoomAction(room));
    },
    [dispatch],
  );

  const deleteRoom = useCallback(
    (id: string) => {
      dispatch(deleteRoomAction(id));
    },
    [dispatch],
  );

  const resetToDefaults = useCallback(() => {
    dispatch(resetToDefaultsAction());
  }, [dispatch]);

  const clearHighlight = useCallback(() => {
    dispatch(clearHighlightAction());
  }, [dispatch]);

  /** Check if an ID is unique (optionally exclude a specific room by id) */
  const isIdUnique = useCallback(
    (id: string, excludeId?: string): boolean => {
      return !rooms.some(
        (room) =>
          room.id.toUpperCase() === id.toUpperCase() && room.id !== excludeId,
      );
    },
    [rooms],
  );

  /** Check if a name is unique (case-insensitive, optionally exclude by id) */
  const isNameUnique = useCallback(
    (name: string, excludeId?: string): boolean => {
      const trimmed = name.trim().toLowerCase();
      return !rooms.some(
        (room) =>
          room.name.trim().toLowerCase() === trimmed && room.id !== excludeId,
      );
    },
    [rooms],
  );

  /** Check if a room can be deleted */
  const canDelete = useCallback((room: Room): boolean => {
    return room.capacity < CAPACITY_DELETE_THRESHOLD;
  }, []);

  /** Find a room by ID */
  const getRoomById = useCallback(
    (id: string): Room | undefined => {
      return rooms.find((room) => room.id === id);
    },
    [rooms],
  );

  return {
    rooms,
    loading,
    highlightedId,
    addRoom,
    updateRoom,
    deleteRoom,
    resetToDefaults,
    clearHighlight,
    isIdUnique,
    isNameUnique,
    canDelete,
    getRoomById,
  };
}
