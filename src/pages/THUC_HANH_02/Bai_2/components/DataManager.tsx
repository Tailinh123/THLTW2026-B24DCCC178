/* ============================================================
 * THUC_HANH_01 — Bài 2: Data Manager
 * Export/Import toàn bộ database ra file JSON
 * ============================================================ */
import React, { useRef } from 'react';
import {
  Card,
  Button,
  Space,
  Typography,
  Alert,
  Popconfirm,
  Descriptions,
  message,
  Upload,
  Divider,
} from 'antd';
import {
  DownloadOutlined,
  UploadOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { dmActions, chActions, dtActions } from '../slices';
import { downloadJSON, readJSONFile } from '../utils';
import { lsClear } from '../../common';

const { Text, Title } = Typography;

const DataManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const danhMuc = useAppSelector((s) => s.danhMuc);
  const cauHoi = useAppSelector((s) => s.cauHoi);
  const deThi = useAppSelector((s) => s.deThi);
  const game = useAppSelector((s) => s.game);

  const handleExport = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      danhMuc,
      cauHoi,
      deThi,
      game,
    };
    downloadJSON(data, `TH01_backup_${new Date().toISOString().split('T')[0]}.json`);
    message.success('Đã xuất file JSON thành công!');
  };

  const handleImport = async (file: File) => {
    try {
      const data = (await readJSONFile(file)) as any;
      if (!data || typeof data !== 'object') {
        message.error('File JSON không hợp lệ');
        return false;
      }

      if (data.danhMuc) dispatch(dmActions.hydrateDanhMuc(data.danhMuc));
      if (data.cauHoi) dispatch(chActions.hydrateCauHoi(data.cauHoi));
      if (data.deThi) dispatch(dtActions.hydrateDeThi(data.deThi));

      message.success('Đã nhập dữ liệu thành công!');
    } catch (e: any) {
      message.error(e.message || 'Lỗi khi nhập dữ liệu');
    }
    return false;
  };

  const handleClearAll = () => {
    dispatch(dmActions.hydrateDanhMuc({ khoiKienThucs: [], monHocs: [] }));
    dispatch(chActions.hydrateCauHoi({ items: [], filter: {} }));
    dispatch(dtActions.hydrateDeThi({ cauTrucs: [], deThis: [] }));
    lsClear();
    message.success('Đã xóa toàn bộ dữ liệu!');
  };

  return (
    <Card title={<><DatabaseOutlined /> Quản lý dữ liệu</>} size="small">
      <Alert
        message="Thông tin hệ thống"
        description={
          <Descriptions column={{ xs: 1, sm: 2, md: 4 }} size="small">
            <Descriptions.Item label="Khối kiến thức">
              <Text strong>{danhMuc.khoiKienThucs.length}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Môn học">
              <Text strong>{danhMuc.monHocs.length}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Câu hỏi">
              <Text strong>{cauHoi.items.length}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Đề thi">
              <Text strong>{deThi.deThis.length}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Template">
              <Text strong>{deThi.cauTrucs.length}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Phiên game">
              <Text strong>{game.history.length}</Text>
            </Descriptions.Item>
          </Descriptions>
        }
        type="info"
        showIcon
        style={{ marginBottom: 20 }}
      />

      <Space size="middle" wrap>
        <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport} size="large">
          Xuất Database (JSON)
        </Button>

        <Upload
          accept=".json"
          showUploadList={false}
          beforeUpload={handleImport}
        >
          <Button icon={<UploadOutlined />} size="large">
            Nhập Database (JSON)
          </Button>
        </Upload>

        <Popconfirm
          title="⚠️ Xóa TOÀN BỘ dữ liệu?"
          description="Thao tác này không thể hoàn tác! Hãy export backup trước."
          onConfirm={handleClearAll}
          okText="Xóa tất cả"
          okButtonProps={{ danger: true }}
          cancelText="Hủy"
        >
          <Button icon={<DeleteOutlined />} danger size="large">
            Xóa toàn bộ
          </Button>
        </Popconfirm>
      </Space>

      <Divider />
      <Alert
        message="Lưu ý"
        description="Dữ liệu được tự động lưu vào LocalStorage mỗi khi có thay đổi. Sử dụng Export để tạo bản backup và Import để khôi phục."
        type="warning"
        showIcon
      />
    </Card>
  );
};

export default DataManager;
