const STORAGE_KEY = "study_app_state_v2";

export const localStorageMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);
  try {
    const state = store.getState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) { /* ignore */ }
  return result;
};

export const loadPersistedState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw);
  } catch { return undefined; }
};
