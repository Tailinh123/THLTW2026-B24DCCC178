// @ts-nocheck

export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        layout: false,
        name: 'login',
        component: './user/Login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
    ],
  },

  {
    path: '/dashboard',
    name: 'Dashboard',
    component: './TrangChu',
    icon: 'HomeOutlined',
  },

  {
    path: '/todo-list',
    name: 'TodoList',
    icon: 'OrderedListOutlined',
    component: './TodoList',
  },

  // ===== QUẢN LÝ SẢN PHẨM =====
  {
  path: '/product-management',
  name: 'QuanLySanPham',
  icon: 'ShoppingOutlined',
  component: './ProductManagement',
  layout: false,
},

  {
    component: './exception/404',
  },
];
