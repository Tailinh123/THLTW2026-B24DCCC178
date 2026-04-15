


export const genId = (): string =>
  `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;


export const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};


export const formatShortDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};


const LS_PREFIX = 'TH01_';

export const lsGet = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(`${LS_PREFIX}${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const lsSet = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(`${LS_PREFIX}${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn('[TH01] localStorage set failed:', e);
  }
};

export const lsClear = (): void => {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith(LS_PREFIX));
  keys.forEach((k) => localStorage.removeItem(k));
};


export const lsExportAll = (): Record<string, unknown> => {
  const data: Record<string, unknown> = {};
  Object.keys(localStorage)
    .filter((k) => k.startsWith(LS_PREFIX))
    .forEach((k) => {
      try {
        data[k.replace(LS_PREFIX, '')] = JSON.parse(localStorage.getItem(k) || '');
      } catch {
        data[k.replace(LS_PREFIX, '')] = localStorage.getItem(k);
      }
    });
  return data;
};


export const lsImportAll = (data: Record<string, unknown>): void => {
  Object.entries(data).forEach(([key, val]) => {
    lsSet(key, val);
  });
};
