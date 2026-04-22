import React, { useMemo, useState, useEffect } from 'react';
import { Drawer } from 'antd';
import {
  EditOutlined,
  HomeOutlined,
  UserOutlined,
  TagsOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
  MenuOutlined,
  EyeOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useHashRouter } from '../store/hooks';
import { HomePage } from '../features/blog/Pages';
import { PostDetailPage } from '../features/blog/Pages';
import { AdminPage } from '../features/admin/AdminPage';
import { TagManagementPage } from '../features/tags/TagManager';
import { AboutPage } from '../features/about/AboutPage';

export const Navbar: React.FC = () => {
  const [currentHash, navigate] = useHashRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeKey = useMemo(() => {
    if (currentHash === '/' || currentHash.startsWith('/home')) return 'home';
    if (currentHash.startsWith('/about')) return 'about';
    if (currentHash.startsWith('/admin')) return 'admin';
    return '';
  }, [currentHash]);

  const navItems = [
    { key: 'home', label: 'Home', path: '/' },
    { key: 'about', label: 'About', path: '/about' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <nav className="th07-navbar">
      <div className="th07-navbar__inner">
        <div className="th07-navbar__logo" onClick={() => handleNav('/')}>
          <EditOutlined /> DevBlog
        </div>
        <ul className="th07-navbar__links">
          {navItems.map((item) => (
            <li key={item.key}>
              <button
                className={`th07-navbar__link ${activeKey === item.key ? 'th07-navbar__link--active' : ''}`}
                onClick={() => handleNav(item.path)}
              >
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <button
              className="th07-navbar__link th07-navbar__link--cta"
              onClick={() => handleNav('/admin')}
            >
              Dashboard
            </button>
          </li>
        </ul>
        <button className="th07-navbar__mobile-btn" onClick={() => setMobileOpen(true)}>
          <MenuOutlined />
        </button>
      </div>
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileOpen(false)}
        visible={mobileOpen}
        bodyStyle={{ padding: 0 }}
        width={280}
      >
        <ul style={{ listStyle: 'none', padding: '12px', margin: 0 }}>
          {navItems.map((item) => (
            <li key={item.key} style={{ marginBottom: 4 }}>
              <button
                className={`th07-sidebar__item ${activeKey === item.key ? 'th07-sidebar__item--active' : ''}`}
                onClick={() => handleNav(item.path)}
                style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
              >
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <button
              className="th07-sidebar__item"
              onClick={() => handleNav('/admin')}
              style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
            >
              Dashboard
            </button>
          </li>
        </ul>
      </Drawer>
    </nav>
  );
};

export const Footer: React.FC = () => {
  const [, navigate] = useHashRouter();

  return (
    <footer className="th07-footer">
      <div className="th07-footer__inner">
        <div>
          <div className="th07-footer__title">DevBlog</div>
          <p className="th07-footer__text">
            A personal blog about modern web development, design patterns, and software engineering best practices.
          </p>
        </div>
        <div>
          <div className="th07-footer__title">Quick Links</div>
          <ul className="th07-footer__link-list">
            <li className="th07-footer__link-item" onClick={() => navigate('/')}>Home</li>
            <li className="th07-footer__link-item" onClick={() => navigate('/about')}>About</li>
            <li className="th07-footer__link-item" onClick={() => navigate('/admin')}>Dashboard</li>
          </ul>
        </div>
        <div>
          <div className="th07-footer__title">Connect</div>
          <ul className="th07-footer__link-list">
            <li className="th07-footer__link-item">GitHub</li>
            <li className="th07-footer__link-item">LinkedIn</li>
            <li className="th07-footer__link-item">Twitter</li>
          </ul>
        </div>
      </div>
      <div className="th07-footer__bottom">
        &copy; {new Date().getFullYear()} DevBlog. Built with React &amp; Ant Design.
      </div>
    </footer>
  );
};

export const AdminSidebar: React.FC = () => {
  const [currentHash, navigate] = useHashRouter();

  const activeKey = useMemo(() => {
    if (currentHash === '/admin/tags') return 'tags';
    return 'posts';
  }, [currentHash]);

  const menuItems = [
    { key: 'posts', label: 'Posts', icon: <FileTextOutlined />, path: '/admin' },
    { key: 'tags', label: 'Tags', icon: <TagsOutlined />, path: '/admin/tags' },
  ];

  return (
    <aside className="th07-sidebar">
      <div className="th07-sidebar__logo" onClick={() => navigate('/')}>
        <EditOutlined /> DevBlog
      </div>
      <ul className="th07-sidebar__menu">
        {menuItems.map((item) => (
          <li
            key={item.key}
            className={`th07-sidebar__item ${activeKey === item.key ? 'th07-sidebar__item--active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            {item.label}
          </li>
        ))}
      </ul>
      <div className="th07-sidebar__back" onClick={() => navigate('/')}>
        <ArrowLeftOutlined /> Back to Blog
      </div>
    </aside>
  );
};

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Navbar />
    <main className="th07-public-content">{children}</main>
    <Footer />
  </>
);

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="th07-admin-layout">
    <AdminSidebar />
    <main className="th07-admin-content">{children}</main>
  </div>
);

export const PostCardSkeleton: React.FC = () => (
  <div className="th07-skeleton th07-skeleton--card" />
);

export const PostGridSkeleton: React.FC = () => (
  <div className="th07-post-grid">
    {Array.from({ length: 6 }).map((_, i) => (
      <PostCardSkeleton key={i} />
    ))}
  </div>
);

export const PostDetailSkeleton: React.FC = () => (
  <div className="th07-post-detail th07-fade-in">
    <div className="th07-skeleton th07-skeleton--detail-cover" />
    <div style={{ marginTop: 32 }}>
      <div className="th07-skeleton th07-skeleton--title" />
      <div className="th07-skeleton th07-skeleton--text" style={{ width: '40%' }} />
      <div style={{ marginTop: 32 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="th07-skeleton th07-skeleton--text" style={{ width: `${75 + Math.random() * 25}%` }} />
        ))}
      </div>
    </div>
  </div>
);

export { HomeOutlined, UserOutlined, EyeOutlined, CalendarOutlined, TagsOutlined, ArrowLeftOutlined, EditOutlined };

export const AppRouter: React.FC = () => {
  const [currentHash, navigate] = useHashRouter();

  useEffect(() => {
    const actualHash = window.location.hash.replace('#', '') || '/';
    if (currentHash !== actualHash) {
      navigate(actualHash);
    }
  }, []);

  const routeContent = useMemo(() => {
    if (currentHash === '/' || currentHash.startsWith('/home')) {
      return <PublicLayout><HomePage /></PublicLayout>;
    }
    if (currentHash.startsWith('/post/')) {
      const slug = currentHash.replace('/post/', '');
      return <PublicLayout><PostDetailPage slug={slug} /></PublicLayout>;
    }
    if (currentHash === '/about') {
      return <PublicLayout><AboutPage /></PublicLayout>;
    }
    if (currentHash === '/admin/tags') {
      return <AdminLayout><TagManagementPage /></AdminLayout>;
    }
    if (currentHash === '/admin') {
      return <AdminLayout><AdminPage /></AdminLayout>;
    }
    return <PublicLayout><HomePage /></PublicLayout>;
  }, [currentHash]);

  return <>{routeContent}</>;
};
