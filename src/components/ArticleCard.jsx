import React, { useState } from 'react';
import './ArticleCard.css';

function ArticleCard({ article }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(article.likes);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <article className="article-card">
      <div className="article-header">
        <div className="author-info">
          <div className="author-avatar">
            {article.author.username.charAt(0).toUpperCase()}
          </div>
          <div className="author-details">
            <h4 className="author-name">{article.author.username}</h4>
            <span className="article-date">{formatDate(article.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="article-content">
        <h2 className="article-title">{article.title}</h2>
        <p className="article-excerpt">{article.excerpt}</p>
        
        <div className="article-tags">
          {article.tags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="article-footer">
        <div className="article-stats">
          <button 
            className={`stat-button ${liked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            <span className="stat-icon">❤️</span>
            <span className="stat-count">{likeCount}</span>
          </button>
          
          <button className="stat-button">
            <span className="stat-icon">💬</span>
            <span className="stat-count">{article.comments}</span>
          </button>
          
          <span className="read-time">
            <span className="stat-icon">🕒</span>
            <span>{article.readTime} read</span>
          </span>
        </div>
        
        <button 
          className={`bookmark-button ${bookmarked ? 'bookmarked' : ''}`}
          onClick={handleBookmark}
        >
          <span className="bookmark-icon">🔖</span>
        </button>
      </div>
    </article>
  );
}

export default ArticleCard;