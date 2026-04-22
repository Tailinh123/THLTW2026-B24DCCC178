import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Spin } from 'antd';
import { store, persistor } from './store';
import { useAppDispatch } from './store/hooks';
import { blogActions, tagActions } from './store/slices';
import { AppRouter } from './components/Shared';
import './styles.less';

const FONT_URL = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';

function useFontLoader() {
  useEffect(() => {
    if (!document.querySelector(`link[href="${FONT_URL}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = FONT_URL;
      document.head.appendChild(link);
    }
  }, []);
}

const LoadingFallback: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f5f7fa' }}>
    <Spin size="large" tip="Loading Blog..." />
  </div>
);

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(blogActions.initializePosts());
    dispatch(tagActions.initializeTags());
  }, [dispatch]);

  return <>{children}</>;
};

export default function ThucHanh07App() {
  useFontLoader();

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingFallback />} persistor={persistor}>
        <AppInitializer>
          <div className="th07-root">
            <AppRouter />
          </div>
        </AppInitializer>
      </PersistGate>
    </Provider>
  );
}
