import { CAPACITY_MIN, CAPACITY_MAX } from '../constants';

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export function validateRoomId(
  value: string,
  existingIds: string[],
  excludeId?: string,
): ValidationResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { valid: false, message: 'Vui lòng nhập mã phòng' };
  }

  if (/\s/.test(trimmed)) {
    return { valid: false, message: 'Mã phòng không được chứa khoảng trắng' };
  }

  if (trimmed.length > 10) {
    return { valid: false, message: 'Mã phòng tối đa 10 ký tự' };
  }

  const isDuplicate = existingIds.some(
    (id) => id.toUpperCase() === trimmed.toUpperCase() && id !== excludeId,
  );

  if (isDuplicate) {
    return { valid: false, message: 'Mã phòng đã tồn tại' };
  }

  return { valid: true };
}

export function validateRoomName(
  value: string,
  existingNames: string[],
  excludeId?: string,
  allRooms?: Array<{ id: string; name: string }>,
): ValidationResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { valid: false, message: 'Vui lòng nhập tên phòng' };
  }

  if (trimmed.length > 50) {
    return { valid: false, message: 'Tên phòng tối đa 50 ký tự' };
  }

  const isDuplicate = allRooms
    ? allRooms.some(
        (room) =>
          room.name.trim().toLowerCase() === trimmed.toLowerCase() &&
          room.id !== excludeId,
      )
    : existingNames.some(
        (name) => name.trim().toLowerCase() === trimmed.toLowerCase(),
      );

  if (isDuplicate) {
    return { valid: false, message: 'Tên phòng đã tồn tại' };
  }

  return { valid: true };
}

export function validateCapacity(value: number | undefined | null): ValidationResult {
  if (value === undefined || value === null) {
    return { valid: false, message: 'Vui lòng nhập sức chứa' };
  }

  if (!Number.isInteger(value)) {
    return { valid: false, message: 'Sức chứa phải là số nguyên' };
  }

  if (value < CAPACITY_MIN || value > CAPACITY_MAX) {
    return {
      valid: false,
      message: `Sức chứa phải từ ${CAPACITY_MIN} đến ${CAPACITY_MAX}`,
    };
  }

  return { valid: true };
}
