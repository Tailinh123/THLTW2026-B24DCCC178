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

  // ===== THUC_HANH_01 =====
  {
    name: 'THUC_HANH_01',
    icon: 'BookOutlined',
    routes: [
      {
        path: '/thuc-hanh-01/bai-1',
        name: 'Bài 1',
        component: './THUC_HANH_01/Bai_1',
      },
      {
        path: '/thuc-hanh-01/bai-2',
        name: 'Bài 2',
        component: './THUC_HANH_01/Bai_2',
      },
    ],
  },

  {
    path: '/product-management',
    name: 'QuanLySanPham',
    icon: 'ShoppingOutlined',
    component: './ProductManagement',
  },

  {
    component: './exception/404',
  },
];