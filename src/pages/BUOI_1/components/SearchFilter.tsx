import React, { useCallback } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchFilterProps {
  onSearch: (keyword: string) => void;
}

let debounceTimer: ReturnType<typeof setTimeout>;

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        onSearch(value);
      }, 300);
    },
    [onSearch],
  );

  return (
    <Input
      placeholder="Tìm kiếm sản phẩm theo tên..."
      allowClear
      prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
      onChange={handleChange}
      size="large"
      className="search-filter"
    />
  );
};

export default SearchFilter;
