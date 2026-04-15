



import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { toggleDarkMode as toggleDarkModeAction } from '../redux/slices/themeSlice';

export function useTheme() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const toggleDarkMode = useCallback(() => {
    dispatch(toggleDarkModeAction());
  }, [dispatch]);

  return {
    darkMode,
    toggleDarkMode,
    themeClass: darkMode ? 'giua-ki-dark' : 'giua-ki-light',
  };
}
