import React from 'react';
import './Layout.css';

function Layout({ children, user, onLogout }) {
  return (
    <div className="layout">
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <div className="logo">
              <span className="logo-icon">💻</span>
              <span className="logo-text">CodeCommunity</span>
            </div>
          </div>
          
          <div className="navbar-search">
            <input 
              type="text" 
              placeholder="Search articles, tags, users..." 
              className="search-input"
            />
          </div>
          
          <div className="navbar-actions">
            <button className="btn btn-primary">Create Post</button>
            <div className="user-menu">
              <div className="user-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <button className="btn btn-ghost" onClick={onLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;