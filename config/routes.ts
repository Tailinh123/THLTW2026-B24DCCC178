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
  // ===== BUOI_1 =====
  // =========================
  {
    path: '/buoi-1',
    name: 'BUOI_1',
    icon: 'ShoppingOutlined',
    component: './BUOI_1',
  },

  // ===== 404 =====
  {
    component: './exception/404',
  },
];