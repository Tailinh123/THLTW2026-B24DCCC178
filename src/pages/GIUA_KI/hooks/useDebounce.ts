<<<<<<< HEAD




import { useState, useEffect } from 'react';


=======
import { useState, useEffect } from 'react';

>>>>>>> c7699e0 (THUC_HANH_07)
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
