/* ============================================================
 * THUC_HANH_01 — Bài 1: Entry Point
 * Game Oẳn Tù Tì page with Redux Provider
 * ============================================================ */
import React from 'react';
import { Provider } from 'react-redux';
import { Row, Col, Typography } from 'antd';
import store from '../store';
import { ModeSelector, ScoreBoard, GameBoard, GameStatsPanel, GameHistory } from './components';
import './styles.less';

const { Text } = Typography;

const Bai1Content: React.FC = () => {
  return (
    <div className="game-root">
      <Row gutter={[20, 20]}>
        {/* Cột trái: Game chính */}
        <Col xs={24} lg={16}>
          <ModeSelector />
          <ScoreBoard />
          <GameBoard />
        </Col>

        {/* Cột phải: Stats + History */}
        <Col xs={24} lg={8}>
          <GameStatsPanel />
          <div style={{ marginTop: 16 }}>
            <GameHistory />
          </div>
        </Col>
      </Row>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>
          THUC_HANH_01 • Bài 1 — Game Oẳn Tù Tì
        </Text>
      </div>
    </div>
  );
};

const Bai1Page: React.FC = () => (
  <Provider store={store}>
    <Bai1Content />
  </Provider>
);

export default Bai1Page;
