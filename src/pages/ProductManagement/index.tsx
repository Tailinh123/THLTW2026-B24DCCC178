import { useState } from 'react';
import { Button, Input, message, Space } from 'antd';
import { initialProducts } from './data';
import { Product } from './types';
import ProductTable from './ProductTable';
import ProductFormModal from './ProductFormModal';

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleAdd = (product: Omit<Product, 'id'>) => {
    setProducts([
      ...products,
      { ...product, id: Date.now() },
    ]);
    message.success('Thêm sản phẩm thành công');
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
    message.success('Xóa sản phẩm thành công');
  };
  const handleAdd = (product: Omit<Product, 'id'>) => {
  setProducts((prev) => [
    ...prev,
    { ...product, id: Date.now() },
  ]);

  message.success('Thêm sản phẩm thành công');
  setOpen(false);
};


  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <h2>Quản lý sản phẩm</h2>

      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm theo tên"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button type="primary" onClick={() => setOpen(true)}>
          Thêm sản phẩm
        </Button>
      </Space>

      <ProductTable
        products={filteredProducts}
        onDelete={handleDelete}
      />

      <ProductFormModal
        open={open}
        onCancel={() => setOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
};

export default ProductManagement;
