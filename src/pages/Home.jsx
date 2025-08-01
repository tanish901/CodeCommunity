import React, { useState, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard.jsx';
import Sidebar from '../components/Sidebar.jsx';
import TagBar from '../components/TagBar.jsx';
import './Home.css';

function Home({ user }) {
  const [articles, setArticles] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [loading, setLoading] = useState(true);

  const tags = [
    'JavaScript', 'React', 'Node.js', 'Python', 'CSS', 
    'WebDev', 'DevOps', 'AI', 'Programming', 'OpenSource'
  ];

  // Sample articles data
  const sampleArticles = [
    {
      id: 1,
      title: "Getting Started with React 18: A Complete Guide",
      excerpt: "Explore the exciting new features in React 18 including automatic batching, concurrent features, and improved Suspense.",
      content: "React 18 introduces several exciting features...",
      author: {
        username: "sarah_dev",
        avatar: ""
      },
      tags: ["react", "javascript", "webdev"],
      likes: 42,
      comments: 8,
      createdAt: new Date().toISOString(),
      readTime: "5 min"
    },
    {
      id: 2,
      title: "Building Scalable Microservices with Node.js",
      excerpt: "Learn how to build scalable microservices architecture using Node.js with best practices and real-world examples.",
      content: "Microservices architecture has become increasingly popular...",
      author: {
        username: "mike_codes",
        avatar: ""
      },
      tags: ["nodejs", "microservices", "devops"],
      likes: 28,
      comments: 12,
      createdAt: new Date().toISOString(),
      readTime: "8 min"
    },
    {
      id: 3,
      title: "Modern CSS Techniques for Better Web Design",
      excerpt: "Discover modern CSS techniques including Grid, Flexbox, custom properties, and container queries for better web design.",
      content: "CSS has evolved significantly in recent years...",
      author: {
        username: "alex_frontend",
        avatar: ""
      },
      tags: ["css", "webdev", "frontend"],
      likes: 35,
      comments: 6,
      createdAt: new Date().toISOString(),
      readTime: "6 min"
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setArticles(sampleArticles);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTagSelect = (tag) => {
    setSelectedTag(tag === selectedTag ? null : tag);
  };

  const filteredArticles = selectedTag 
    ? articles.filter(article => 
        article.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      )
    : articles;

  return (
    <div className="home">
      <div className="grid grid-3">
        {/* Left Sidebar */}
        <div className="sidebar-left">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="main-feed">
          <TagBar 
            tags={tags} 
            selectedTag={selectedTag} 
            onTagSelect={handleTagSelect} 
          />
          
          <div className="articles-feed">
            {loading ? (
              <div className="loading-articles">
                {[1, 2, 3].map(i => (
                  <div key={i} className="article-skeleton">
                    <div className="skeleton-header"></div>
                    <div className="skeleton-title"></div>
                    <div className="skeleton-excerpt"></div>
                    <div className="skeleton-tags"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="articles-list">
                {filteredArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="sidebar-right">
          <div className="trending-section">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Trending Now</h3>
              </div>
              <div className="card-body">
                <div className="trending-item">
                  <a href="#" className="trending-link">
                    Getting started with Rust for JavaScript developers
                  </a>
                  <span className="trending-views">2.1k views</span>
                </div>
                <div className="trending-item">
                  <a href="#" className="trending-link">
                    The future of AI in web development
                  </a>
                  <span className="trending-views">1.8k views</span>
                </div>
                <div className="trending-item">
                  <a href="#" className="trending-link">
                    Building scalable microservices with Node.js
                  </a>
                  <span className="trending-views">1.5k views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;