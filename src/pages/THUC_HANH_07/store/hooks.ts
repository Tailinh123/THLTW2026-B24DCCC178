import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T => useSelector(selector);

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useSimulateLoading(delay: number = 500): boolean {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }, delay);
    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
    };
  }, [delay]);

  return isLoading;
}

export function useHashRouter(): [string, (hash: string) => void] {
  const getHash = useCallback(() => {
    const hash = window.location.hash.replace('#', '') || '/';
    return hash;
  }, []);

  const [currentHash, setCurrentHash] = useState<string>(getHash);

  useEffect(() => {
    const syncHash = () => {
      setCurrentHash(getHash());
    };

    syncHash();

    window.addEventListener('hashchange', syncHash);
    window.addEventListener('popstate', syncHash);
    return () => {
      window.removeEventListener('hashchange', syncHash);
      window.removeEventListener('popstate', syncHash);
    };
  }, [getHash]);

  const navigate = useCallback((hash: string) => {
    window.location.hash = hash;
  }, []);

  return [currentHash, navigate];
}

export function useSessionViewTracker(postId: string): boolean {
  const [alreadyViewed, setAlreadyViewed] = useState<boolean>(false);

  useEffect(() => {
    const viewedKey = 'blog_viewed_posts';
    const viewed: string[] = JSON.parse(sessionStorage.getItem(viewedKey) || '[]');
    if (viewed.includes(postId)) {
      setAlreadyViewed(true);
    } else {
      viewed.push(postId);
      sessionStorage.setItem(viewedKey, JSON.stringify(viewed));
      setAlreadyViewed(false);
    }
  }, [postId]);

  return alreadyViewed;
}
