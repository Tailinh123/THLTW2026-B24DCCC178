/* ============================================================
 * THUC_HANH_01 — Bài 2: Entry Point
 * Exam Management page with Redux Provider and Tabs navigation
 * ============================================================ */
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { Tabs, Typography } from 'antd';
import {
  AppstoreOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import store from '../store';
import { DanhMucTab, CauHoiTab, DeThiTab, ExamPreview, DataManager } from './components';
import type { DeThi } from './types';
import './styles.less';

const { TabPane } = Tabs;
const { Text } = Typography;

const Bai2Content: React.FC = () => {
  const [previewExam, setPreviewExam] = useState<DeThi | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  const handlePreview = (exam: DeThi) => {
    setPreviewExam(exam);
    setPreviewVisible(true);
  };

  return (
    <div className="exam-root">
      {/* Header */}
      <div className="exam-header-bar">
        <div>
          <h2 className="exam-header-title">📝 Quản lý Ngân hàng Câu hỏi & Đề thi</h2>
          <p className="exam-header-subtitle">
            Hệ thống quản lý câu hỏi tự luận và tạo đề thi tự động
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultActiveKey="danhmuc" className="exam-tabs" type="card">
        <TabPane
          tab={<span><AppstoreOutlined /> Danh mục</span>}
          key="danhmuc"
        >
          <DanhMucTab />
        </TabPane>

        <TabPane
          tab={<span><QuestionCircleOutlined /> Câu hỏi</span>}
          key="cauhoi"
        >
          <CauHoiTab />
        </TabPane>

        <TabPane
          tab={<span><FileTextOutlined /> Đề thi</span>}
          key="dethi"
        >
          <DeThiTab onPreview={handlePreview} />
        </TabPane>

        <TabPane
          tab={<span><DatabaseOutlined /> Dữ liệu</span>}
          key="data"
        >
          <DataManager />
        </TabPane>
      </Tabs>

      {/* Exam Preview Modal */}
      <ExamPreview
        exam={previewExam}
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
      />

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Text type="secondary" style={{ fontSize: 11 }}>
          THUC_HANH_01 • Bài 2 — Quản lý Ngân hàng Câu hỏi & Đề thi
        </Text>
      </div>
    </div>
  );
};

const Bai2Page: React.FC = () => (
  <Provider store={store}>
    <Bai2Content />
  </Provider>
);

export default Bai2Page;