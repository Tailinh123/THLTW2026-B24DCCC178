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

  // =========================
  // ===== BUOI_2 =====
  // =========================
  {
    path: '/buoi-2',
    name: 'BUOI_2',
    icon: 'GoldOutlined',
    component: './BUOI_2',
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
        name: 'Bài 1 - Trò chơi đoán số',
        component: './THUC_HANH_01/Bai1_GuessGame',
      },
      {
        path: '/thuc-hanh-01/bai-2',
        name: 'Bài 2 - Quản lý học tập',
        component: './THUC_HANH_01/Bai2_StudyTracker',
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
    path: '/thuc-hanh-04',
    name: 'THUC_HANH_04',
    icon: 'SafetyCertificateOutlined',
    component: './THUC_HANH_04',
  },


  {
    path: '/thuc-hanh-05',
    name: 'THUC_HANH_05',
    icon: 'TeamOutlined',
    component: './THUC_HANH_05',
  },

  {
    path: '/thuc-hanh-06',
    name: 'THUC_HANH_06',
    icon: 'GlobalOutlined',
    component: './THUC_HANH_06',
  },

  // =========================
  // ===== THUC_HANH_07 =====
  // =========================
  {
    path: '/thuc-hanh-07',
    name: 'THUC_HANH_07',
    icon: 'EditOutlined',
    layout: false,
    component: './THUC_HANH_07',
  },

  // ===== GIUA_KI =====
  {
    path: '/giua-ki',
    name: 'Giữa kì',
    icon: 'BankOutlined',
    layout: false,
    component: './GIUA_KI',
  },

  // ===== 404 =====
  {
    component: './exception/404',
  },
];
