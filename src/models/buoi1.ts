import { useState, useMemo, useCallback } from 'react';
import { message } from 'antd';
import { Product, ProductFormValues } from '@/pages/BUOI_1/types';
import { INITIAL_PRODUCTS } from '@/pages/BUOI_1/mockData';

export default () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!searchKeyword.trim()) return products;
    const keyword = searchKeyword.toLowerCase();
    return products.filter((p) =>
      p.name.toLowerCase().includes(keyword),
    );
  }, [products, searchKeyword]);

  const addProduct = useCallback(
    (values: ProductFormValues) => {
      const newProduct: Product = {
        id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
        ...values,
      };
      setProducts((prev) => [...prev, newProduct]);
      setIsModalVisible(false);
      message.success('Thêm sản phẩm thành công!');
    },
    [products],
  );

  const deleteProduct = useCallback((id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    message.success('Xóa sản phẩm thành công!');
  }, []);

  return {
    products,
    filteredProducts,
    searchKeyword,
    setSearchKeyword,
    isModalVisible,
    setIsModalVisible,
    addProduct,
    deleteProduct,
  };
};
