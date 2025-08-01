import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    // Simple validation for registration
    if (!isLogin && !email.trim()) {
      alert('Please enter an email');
      return;
    }

    // Create user object
    const userData = {
      id: Date.now(),
      username: username.trim(),
      email: email.trim() || `${username}@example.com`,
      avatar: '',
      bio: `${isLogin ? 'Returning' : 'New'} developer`,
      joinDate: new Date().toISOString()
    };

    onLogin(userData);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo">
              <span className="logo-icon">💻</span>
              <h1 className="logo-text">CodeCommunity</h1>
            </div>
            <h2>{isLogin ? 'Welcome Back' : 'Join CodeCommunity'}</h2>
            <p>
              {isLogin 
                ? 'Sign in to continue to your developer community' 
                : 'Create an account to start sharing and learning'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                placeholder="Enter your username"
                required
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button"
                className="link-button"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;