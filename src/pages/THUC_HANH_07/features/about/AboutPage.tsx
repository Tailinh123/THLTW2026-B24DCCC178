import React from 'react';
import { Tag, Button, Divider } from 'antd';
import { GithubOutlined, LinkedinOutlined, TwitterOutlined, MailOutlined } from '@ant-design/icons';
import { seedUser } from '../../data';
import { useHashRouter } from '../../store/hooks';

const iconMap: Record<string, React.ReactNode> = {
  github: <GithubOutlined />,
  linkedin: <LinkedinOutlined />,
  twitter: <TwitterOutlined />,
  mail: <MailOutlined />,
};

export const AboutPage: React.FC = () => {
  const [, navigate] = useHashRouter();
  const user = seedUser;

  return (
    <div className="th07-about th07-fade-in">
      <div className="th07-about__card">
        <img className="th07-about__avatar" src={user.avatar} alt={user.name} />
        <h1 className="th07-about__name">{user.name}</h1>
        <p className="th07-about__title">{user.title}</p>
        <p className="th07-about__bio">{user.bio}</p>
        <div className="th07-about__social">
          {user.socialLinks.map((link) => (
            <Button
              key={link.platform}
              type="default"
              shape="round"
              icon={iconMap[link.icon] || <GithubOutlined />}
              href={link.url}
              target="_blank"
              size="large"
            >
              {link.platform}
            </Button>
          ))}
        </div>
      </div>
      <div className="th07-about__section">
        <h2 className="th07-about__section-title">Skills & Technologies</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {user.skills.map((skill) => (
            <Tag key={skill} color="blue" style={{ fontSize: 14, padding: '4px 14px', borderRadius: 20 }}>
              {skill}
            </Tag>
          ))}
        </div>
      </div>
      <div className="th07-about__section">
        <h2 className="th07-about__section-title">What I Write About</h2>
        <p style={{ color: '#64748b', lineHeight: 1.8, margin: 0 }}>
          I write about modern frontend development with a focus on React ecosystem, TypeScript best practices,
          and building scalable web applications. My articles cover everything from fundamental concepts to
          advanced architectural patterns, aimed at helping developers level up their skills.
        </p>
        <Divider />
        <Button type="primary" size="large" onClick={() => navigate('/')} style={{ borderRadius: 8 }}>
          Read My Blog Posts
        </Button>
      </div>
    </div>
  );
};
