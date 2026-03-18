// @ts-nocheck

export default [

  // ===== LOGIN =====
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        name: 'login',
        component: './user/Login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
    ],
  },

  // ===== DASHBOARD =====
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'HomeOutlined',
    component: './TrangChu',
  },

  // ===== TODO LIST =====
  {
    path: '/todo-list',
    name: 'Todo List',
    icon: 'OrderedListOutlined',
    component: './TodoList',
  },

  // =========================
  // ===== THUC_HANH_01 =====
  // =========================
  {
    path: '/thuc-hanh-01',
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
    path: '/thuc-hanh-02',
    name: 'THUC_HANH_02',
    icon: 'ExperimentOutlined',
    routes: [
      {
        path: '/thuc-hanh-02/bai-1',
        name: 'Bài 1 - Oẳn Tù Tì',
        component: './THUC_HANH_02/Bai_1',
      },
      {
        path: '/thuc-hanh-02/bai-2',
        name: 'Bài 2 - Ngân hàng câu hỏi',
        component: './THUC_HANH_02/Bai_2',
      },
    ],
  },


  {
    path: '/thuc-hanh-03',
    name: 'THUC_HANH_03',
    icon: 'FileOutlined',
    routes: [
      {
        path: '/thuc-hanh-03/bai-1',
        name: 'Bài 1',
        component: './THUC_HANH_03/Bai_1',
      },
    ],
  },


  {
    path: '/product-management',
    name: 'Quản lý Sản phẩm & Đơn hàng',
    icon: 'ShoppingOutlined',
    component: './ProductManagement',
  },

  // ===== 404 =====
  {
    component: './exception/404',
  },
];