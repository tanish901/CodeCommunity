import React from 'react';
import './TagBar.css';

function TagBar({ tags, selectedTag, onTagSelect }) {
  const defaultTags = ['For you', 'Following', 'Featured'];
  
  return (
    <div className="tag-bar">
      <div className="tag-scroll-container scrollbar-hide">
        {defaultTags.map((tag) => (
          <button
            key={tag}
            className={`tag-button ${!selectedTag && tag === 'For you' ? 'active' : ''}`}
            onClick={() => onTagSelect(tag === 'For you' ? null : tag)}
          >
            {tag}
          </button>
        ))}
        
        {tags.map((tag) => (
          <button
            key={tag}
            className={`tag-button ${selectedTag === tag ? 'active' : ''}`}
            onClick={() => onTagSelect(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TagBar;