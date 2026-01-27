/* ============================================================
 * THUC_HANH_02 — Bài 2: Entry Point
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
            Hệ thống quản lý câu hỏi tự luận, xây dựng ma trận và tạo đề thi tự động.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultActiveKey="danhmuc" className="exam-tabs" type="card">
        <TabPane
          tab={<span><AppstoreOutlined /> Danh mục</span>}
          key="danhmuc"
        >
          <div style={{ padding: '8px 0' }}>
            <DanhMucTab />
          </div>
        </TabPane>

        <TabPane
          tab={<span><QuestionCircleOutlined /> Câu hỏi</span>}
          key="cauhoi"
        >
          <div style={{ padding: '8px 0' }}>
            <CauHoiTab />
          </div>
        </TabPane>

        <TabPane
          tab={<span><FileTextOutlined /> Đề thi</span>}
          key="dethi"
        >
          <div style={{ padding: '8px 0' }}>
            <DeThiTab onPreview={handlePreview} />
          </div>
        </TabPane>

        <TabPane
          tab={<span><DatabaseOutlined /> Dữ liệu</span>}
          key="data"
        >
          <div style={{ padding: '8px 0' }}>
            <DataManager />
          </div>
        </TabPane>
      </Tabs>

      {/* Exam Preview Modal */}
      <ExamPreview
        exam={previewExam}
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
      />

    </div>
  );
};

const Bai2Page: React.FC = () => (
  <Provider store={store}>
    <Bai2Content />
  </Provider>
);

export default Bai2Page;