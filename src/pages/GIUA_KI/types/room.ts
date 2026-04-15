export enum RoomType {
  THEORY = 'THEORY',
  PRACTICE = 'PRACTICE',
  HALL = 'HALL',
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: RoomType;
  manager: string;
}

export interface RoomFormValues {
  id: string;
  name: string;
  capacity: number;
  type: RoomType;
  manager: string;
}

export type DrawerMode = 'add' | 'edit';

export interface SortConfig {
  field: 'capacity' | null;
  order: 'ascend' | 'descend' | null;
}

export interface PaginationConfig {
  current: number;
  pageSize: number;
}

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  [RoomType.THEORY]: 'Lý thuyết',
  [RoomType.PRACTICE]: 'Thực hành',
  [RoomType.HALL]: 'Hội trường',
};

export const ROOM_TYPE_TAG_COLORS: Record<RoomType, string> = {
  [RoomType.THEORY]: 'blue',
  [RoomType.PRACTICE]: 'green',
  [RoomType.HALL]: 'gold',
};
