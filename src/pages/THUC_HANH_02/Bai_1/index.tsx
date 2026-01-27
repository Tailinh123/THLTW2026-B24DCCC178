
import React from 'react';
import { Provider } from 'react-redux';
import store from '../store';
import { ModeSelector, ScoreBoard, GameBoard, GameStatsPanel, GameHistory } from './components';
import './styles.less';

const Bai1Content: React.FC = () => {
  return (
    <div className="game-root">
      <div className="game-layout">
        {}
        <div className="game-main-col">
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 40%', minWidth: 250 }}>
              <ModeSelector />
            </div>
            <div style={{ flex: '1 1 50%', minWidth: 300 }}>
              <ScoreBoard />
            </div>
          </div>
          <GameBoard />
        </div>

        {}
        <div className="game-side-col">
          <GameStatsPanel />
          <GameHistory />
        </div>
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
