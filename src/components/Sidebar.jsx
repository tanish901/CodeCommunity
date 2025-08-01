import React from 'react';
import './Sidebar.css';

function Sidebar() {
  const navigationItems = [
    { icon: '🏠', label: 'Home', active: true },
    { icon: '📚', label: 'Reading List' },
    { icon: '🏷️', label: 'Tags' },
    { icon: '🔥', label: 'Trending' },
    { icon: '👥', label: 'Community' },
    { icon: '💼', label: 'Jobs' },
    { icon: '📧', label: 'Contact' },
  ];

  const popularTags = [
    { name: 'javascript', count: 245 },
    { name: 'react', count: 189 },
    { name: 'webdev', count: 156 },
    { name: 'python', count: 134 },
    { name: 'css', count: 98 },
    { name: 'nodejs', count: 87 },
  ];

  return (
    <div className="sidebar">
      {/* Navigation */}
      <div className="sidebar-section">
        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`nav-item ${item.active ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Popular Tags */}
      <div className="sidebar-section">
        <h3 className="section-title">Popular Tags</h3>
        <div className="tags-list">
          {popularTags.map((tag) => (
            <a key={tag.name} href="#" className="tag-item">
              <span className="tag-name">#{tag.name}</span>
              <span className="tag-count">{tag.count}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="sidebar-section">
        <h3 className="section-title">Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">❤️</span>
            <span className="activity-text">You liked "React Hooks Guide"</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">💬</span>
            <span className="activity-text">New comment on your post</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">👥</span>
            <span className="activity-text">Sarah started following you</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;