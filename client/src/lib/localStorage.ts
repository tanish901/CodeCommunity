import { type User, type InsertUser, type Article, type InsertArticle, type Comment, type InsertComment, type Like, type Follow, type Tag, type ArticleWithAuthor } from "@shared/schema";

// Fallback for crypto.randomUUID in browser
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Articles
  getArticle(id: string): Promise<ArticleWithAuthor | undefined>;
  getArticles(filters?: { authorId?: string; tag?: string; search?: string; published?: boolean }): Promise<ArticleWithAuthor[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, updates: Partial<Article>): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;

  // Comments
  getCommentsByArticleId(articleId: string): Promise<(Comment & { author: User })[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: string): Promise<boolean>;

  // Likes
  toggleLike(userId: string, articleId: string): Promise<{ liked: boolean; likesCount: number }>;
  getUserLikes(userId: string): Promise<string[]>;

  // Follows
  toggleFollow(followerId: string, followingId: string): Promise<{ following: boolean }>;
  getFollowers(userId: string): Promise<User[]>;
  getFollowing(userId: string): Promise<User[]>;

  // Tags
  getTags(): Promise<Tag[]>;
  getPopularTags(limit?: number): Promise<Tag[]>;
  createTag(name: string): Promise<Tag>;
}

export class LocalStorage implements IStorage {
  private readonly STORAGE_KEYS = {
    USERS: 'blog_users',
    ARTICLES: 'blog_articles',
    COMMENTS: 'blog_comments',
    LIKES: 'blog_likes',
    FOLLOWS: 'blog_follows',
    TAGS: 'blog_tags',
    INITIALIZED: 'blog_initialized'
  };

  constructor() {
    this.initializeData();
  }

  private getFromStorage<T>(key: string): Map<string, T> {
    try {
      const data = localStorage.getItem(key);
      if (!data) return new Map();
      const parsed = JSON.parse(data);
      return new Map(Object.entries(parsed));
    } catch (error) {
      console.error(`Error reading from localStorage key ${key}:`, error);
      return new Map();
    }
  }

  private saveToStorage<T>(key: string, map: Map<string, T>): void {
    try {
      const obj = Object.fromEntries(map);
      localStorage.setItem(key, JSON.stringify(obj));
    } catch (error) {
      console.error(`Error saving to localStorage key ${key}:`, error);
    }
  }

  private initializeData() {
    const isInitialized = localStorage.getItem(this.STORAGE_KEYS.INITIALIZED);
    if (isInitialized) return;

    // Initialize with sample data
    this.initializeTags();
    this.initializeSampleData();
    localStorage.setItem(this.STORAGE_KEYS.INITIALIZED, 'true');
  }

  private initializeTags() {
    const defaultTags = [
      { name: "javascript", color: "#f7df1e" },
      { name: "react", color: "#61dafb" },
      { name: "webdev", color: "#3b82f6" },
      { name: "python", color: "#3776ab" },
      { name: "devops", color: "#326ce5" },
      { name: "ai", color: "#ff6b6b" },
      { name: "programming", color: "#8b5cf6" },
      { name: "opensource", color: "#22c55e" },
    ];

    const tags = new Map<string, Tag>();
    defaultTags.forEach(tag => {
      const id = generateId();
      tags.set(id, { id, ...tag, description: "", articlesCount: 0 });
    });
    
    this.saveToStorage(this.STORAGE_KEYS.TAGS, tags);
  }

  private async initializeSampleData() {
    // Create sample users
    const sampleUsers = [
      {
        username: "sarah_dev",
        email: "sarah@example.com",
        password: "hashedpassword",
        bio: "Full-stack developer passionate about React and Node.js",
        avatar: "",
        location: "San Francisco, CA",
        website: "https://sarahdev.com"
      },
      {
        username: "mike_codes",
        email: "mike@example.com", 
        password: "hashedpassword",
        bio: "Backend engineer specializing in microservices and DevOps",
        avatar: "",
        location: "New York, NY",
        website: ""
      },
      {
        username: "alex_frontend",
        email: "alex@example.com",
        password: "hashedpassword", 
        bio: "Frontend specialist with expertise in modern JavaScript frameworks",
        avatar: "",
        location: "Seattle, WA",
        website: "https://alexfrontend.dev"
      }
    ];

    const userIds: string[] = [];
    for (const userData of sampleUsers) {
      const user = await this.createUser(userData);
      userIds.push(user.id);
    }

    // Create sample articles
    const sampleArticles = [
      {
        title: "Getting Started with React 18: A Complete Guide",
        content: `React 18 introduces several exciting features that enhance the developer experience and application performance. In this comprehensive guide, we'll explore the key features including automatic batching, transitions, and Suspense improvements.

## Automatic Batching

One of the most significant improvements in React 18 is automatic batching. This feature allows React to batch multiple state updates into a single re-render for better performance.

\`\`\`javascript
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    setCount(c => c + 1); // Does not re-render yet
    setFlag(f => !f); // Does not re-render yet
    // React will only re-render once at the end (that's batching!)
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{color: flag ? "blue" : "black"}}>{count}</h1>
    </div>
  );
}
\`\`\`

This batching now works for all updates, including those in promises, timeouts, and native event handlers.

## Concurrent Features

React 18 also introduces concurrent features that allow React to interrupt rendering work to handle high-priority updates. This makes your app more responsive to user interactions.

The new features include:
- Transitions for non-urgent updates
- Suspense improvements for better loading states
- New hooks like useDeferredValue and useTransition

These features work together to create a smoother user experience, especially in complex applications with heavy rendering work.`,
        excerpt: "Explore the exciting new features in React 18 including automatic batching, concurrent features, and improved Suspense.",
        tags: ["react", "javascript", "webdev"],
        authorId: userIds[0],
        published: true,
        coverImage: ""
      },
      {
        title: "Building Scalable Microservices with Node.js",
        content: `Microservices architecture has become increasingly popular for building scalable applications. In this article, we'll explore how to design and implement microservices using Node.js.

## What are Microservices?

Microservices are a software architecture pattern where applications are built as a collection of loosely coupled, independently deployable services. Each service is responsible for a specific business function.

## Key Benefits

1. **Scalability**: Scale individual services based on demand
2. **Technology Diversity**: Use different technologies for different services
3. **Fault Isolation**: Failure in one service doesn't bring down the entire system
4. **Team Independence**: Different teams can work on different services

## Implementation with Node.js

Node.js is an excellent choice for microservices due to its:
- Lightweight runtime
- Excellent I/O performance
- Rich ecosystem of libraries
- JSON-first approach

\`\`\`javascript
const express = require('express');
const app = express();

// User service endpoint
app.get('/users/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('User service running on port 3000');
});
\`\`\`

## Best Practices

- Use API gateways for external communication
- Implement proper logging and monitoring
- Use containerization (Docker) for deployment
- Implement circuit breakers for fault tolerance
- Use message queues for async communication`,
        excerpt: "Learn how to build scalable microservices architecture using Node.js with best practices and real-world examples.",
        tags: ["nodejs", "microservices", "devops", "programming"],
        authorId: userIds[1],
        published: true,
        coverImage: ""
      },
      {
        title: "Modern CSS Techniques for Better Web Design",
        content: `CSS has evolved significantly in recent years. Modern CSS techniques allow us to create beautiful, responsive designs with less code and better maintainability.

## CSS Grid vs Flexbox

Understanding when to use CSS Grid vs Flexbox is crucial for modern web development.

**Use Flexbox for:**
- One-dimensional layouts (row or column)
- Component-level design
- Distributing space between items

**Use Grid for:**
- Two-dimensional layouts
- Page-level layouts  
- Complex positioning requirements

\`\`\`css
/* Flexbox example */
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Grid example */
.grid-container {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-gap: 20px;
}
\`\`\`

## CSS Custom Properties

Custom properties (CSS variables) make your stylesheets more maintainable and dynamic.

\`\`\`css
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --font-size-base: 16px;
}

.button {
  background-color: var(--primary-color);
  font-size: var(--font-size-base);
}
\`\`\`

## Container Queries

The new container queries allow you to style elements based on their container's size rather than the viewport.

\`\`\`css
@container (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}
\`\`\`

These modern techniques help create more responsive and maintainable designs.`,
        excerpt: "Discover modern CSS techniques including Grid, Flexbox, custom properties, and container queries for better web design.",
        tags: ["css", "webdev", "frontend"],
        authorId: userIds[2],
        published: true,
        coverImage: ""
      }
    ];

    for (const articleData of sampleArticles) {
      await this.createArticle(articleData);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    const users = this.getFromStorage<User>(this.STORAGE_KEYS.USERS);
    return users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const users = this.getFromStorage<User>(this.STORAGE_KEYS.USERS);
    return Array.from(users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = this.getFromStorage<User>(this.STORAGE_KEYS.USERS);
    return Array.from(users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const users = this.getFromStorage<User>(this.STORAGE_KEYS.USERS);
    const id = generateId();
    const user: User = { 
      ...insertUser, 
      id, 
      bio: insertUser.bio || null,
      avatar: insertUser.avatar || null,
      location: insertUser.location || null,
      website: insertUser.website || null,
      createdAt: new Date() 
    };
    users.set(id, user);
    this.saveToStorage(this.STORAGE_KEYS.USERS, users);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const users = this.getFromStorage<User>(this.STORAGE_KEYS.USERS);
    const user = users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    users.set(id, updatedUser);
    this.saveToStorage(this.STORAGE_KEYS.USERS, users);
    return updatedUser;
  }

  async getArticle(id: string): Promise<ArticleWithAuthor | undefined> {
    const articles = this.getFromStorage<Article>(this.STORAGE_KEYS.ARTICLES);
    const article = articles.get(id);
    if (!article) return undefined;
    
    const users = this.getFromStorage<User>(this.STORAGE_KEYS.USERS);
    const author = users.get(article.authorId);
    if (!author) return undefined;

    const comments = this.getFromStorage<Comment>(this.STORAGE_KEYS.COMMENTS);
    const commentsCount = Array.from(comments.values()).filter(c => c.articleId === id).length;
    
    return { ...article, author, commentsCount };
  }

  async getArticles(filters?: { authorId?: string; tag?: string; search?: string; published?: boolean }): Promise<ArticleWithAuthor[]> {
    const articles = this.getFromStorage<Article>(this.STORAGE_KEYS.ARTICLES);
    const users = this.getFromStorage<User>(this.STORAGE_KEYS.USERS);
    const comments = this.getFromStorage<Comment>(this.STORAGE_KEYS.COMMENTS);
    
    let articleList = Array.from(articles.values());
    
    if (filters?.published !== undefined) {
      articleList = articleList.filter(a => a.published === filters.published);
    }
    
    if (filters?.authorId) {
      articleList = articleList.filter(a => a.authorId === filters.authorId);
    }
    
    if (filters?.tag) {
      articleList = articleList.filter(a => a.tags?.includes(filters.tag!));
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      articleList = articleList.filter(a => 
        a.title.toLowerCase().includes(search) || 
        a.content.toLowerCase().includes(search)
      );
    }

    const articlesWithAuthors: ArticleWithAuthor[] = [];
    
    for (const article of articleList) {
      const author = users.get(article.authorId);
      if (author) {
        const commentsCount = Array.from(comments.values()).filter(c => c.articleId === article.id).length;
        articlesWithAuthors.push({ ...article, author, commentsCount });
      }
    }
    
    return articlesWithAuthors.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const articles = this.getFromStorage<Article>(this.STORAGE_KEYS.ARTICLES);
    const tags = this.getFromStorage<Tag>(this.STORAGE_KEYS.TAGS);
    
    const id = generateId();
    const article: Article = { 
      ...insertArticle, 
      id, 
      likes: 0,
      views: 0,
      published: insertArticle.published ?? false,
      excerpt: insertArticle.excerpt ?? null,
      coverImage: insertArticle.coverImage ?? null,
      tags: insertArticle.tags ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    articles.set(id, article);
    this.saveToStorage(this.STORAGE_KEYS.ARTICLES, articles);
    
    // Update tag counts
    if (article.tags) {
      for (const tagName of article.tags) {
        const tag = Array.from(tags.values()).find(t => t.name === tagName);
        if (tag) {
          tag.articlesCount = (tag.articlesCount || 0) + 1;
        }
      }
      this.saveToStorage(this.STORAGE_KEYS.TAGS, tags);
    }
    
    return article;
  }

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article | undefined> {
    const articles = this.getFromStorage<Article>(this.STORAGE_KEYS.ARTICLES);
    const article = articles.get(id);
    if (!article) return undefined;
    
    const updatedArticle = { ...article, ...updates, updatedAt: new Date() };
    articles.set(id, updatedArticle);
    this.saveToStorage(this.STORAGE_KEYS.ARTICLES, articles);
    return updatedArticle;
  }

  async deleteArticle(id: string): Promise<boolean> {
    const articles = this.getFromStorage<Article>(this.STORAGE_KEYS.ARTICLES);
    const deleted = articles.delete(id);
    if (deleted) {
      this.saveToStorage(this.STORAGE_KEYS.ARTICLES, articles);
    }
    return deleted;
  }

  async getCommentsByArticleId(articleId: string): Promise<(Comment & { author: User })[]> {
    const comments = this.getFromStorage<Comment>(this.STORAGE_KEYS.COMMENTS);
    const users = this.getFromStorage<User>(this.STORAGE_KEYS.USERS);
    
    const articleComments = Array.from(comments.values()).filter(c => c.articleId === articleId);
    const commentsWithAuthors = [];
    
    for (const comment of articleComments) {
      const author = users.get(comment.authorId);
      if (author) {
        commentsWithAuthors.push({ ...comment, author });
      }
    }
    
    return commentsWithAuthors.sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const comments = this.getFromStorage<Comment>(this.STORAGE_KEYS.COMMENTS);
    const id = generateId();
    const comment: Comment = { 
      ...insertComment, 
      id, 
      parentId: insertComment.parentId ?? null,
      createdAt: new Date() 
    };
    comments.set(id, comment);
    this.saveToStorage(this.STORAGE_KEYS.COMMENTS, comments);
    return comment;
  }

  async deleteComment(id: string): Promise<boolean> {
    const comments = this.getFromStorage<Comment>(this.STORAGE_KEYS.COMMENTS);
    const deleted = comments.delete(id);
    if (deleted) {
      this.saveToStorage(this.STORAGE_KEYS.COMMENTS, comments);
    }
    return deleted;
  }

  async toggleLike(userId: string, articleId: string): Promise<{ liked: boolean; likesCount: number }> {
    const likes = this.getFromStorage<Like>(this.STORAGE_KEYS.LIKES);
    const articles = this.getFromStorage<Article>(this.STORAGE_KEYS.ARTICLES);
    
    const existingLike = Array.from(likes.values()).find(l => l.userId === userId && l.articleId === articleId);
    
    if (existingLike) {
      likes.delete(existingLike.id);
      const article = articles.get(articleId);
      if (article) {
        article.likes = Math.max(0, (article.likes || 0) - 1);
        articles.set(articleId, article);
        this.saveToStorage(this.STORAGE_KEYS.ARTICLES, articles);
      }
      this.saveToStorage(this.STORAGE_KEYS.LIKES, likes);
      return { liked: false, likesCount: article?.likes || 0 };
    } else {
      const id = generateId();
      const like: Like = { id, userId, articleId, createdAt: new Date() };
      likes.set(id, like);
      
      const article = articles.get(articleId);
      if (article) {
        article.likes = (article.likes || 0) + 1;
        articles.set(articleId, article);
        this.saveToStorage(this.STORAGE_KEYS.ARTICLES, articles);
      }
      this.saveToStorage(this.STORAGE_KEYS.LIKES, likes);
      return { liked: true, likesCount: article?.likes || 0 };
    }
  }

  async getUserLikes(userId: string): Promise<string[]> {
    const likes = this.getFromStorage<Like>(this.STORAGE_KEYS.LIKES);
    return Array.from(likes.values())
      .filter(l => l.userId === userId)
      .map(l => l.articleId);
  }

  async toggleFollow(followerId: string, followingId: string): Promise<{ following: boolean }> {
    const follows = this.getFromStorage<Follow>(this.STORAGE_KEYS.FOLLOWS);
    const existingFollow = Array.from(follows.values()).find(f => f.followerId === followerId && f.followingId === followingId);
    
    if (existingFollow) {
      follows.delete(existingFollow.id);
      this.saveToStorage(this.STORAGE_KEYS.FOLLOWS, follows);
      return { following: false };
    } else {
      const id = generateId();
      const follow: Follow = { id, followerId, followingId, createdAt: new Date() };
      follows.set(id, follow);
      this.saveToStorage(this.STORAGE_KEYS.FOLLOWS, follows);
      return { following: true };
    }
  }

  async getFollowers(userId: string): Promise<User[]> {
    const follows = this.getFromStorage<Follow>(this.STORAGE_KEYS.FOLLOWS);
    const users = this.getFromStorage<User>(this.STORAGE_KEYS.USERS);
    
    const followerIds = Array.from(follows.values())
      .filter(f => f.followingId === userId)
      .map(f => f.followerId);
    
    return followerIds.map(id => users.get(id)).filter(Boolean) as User[];
  }

  async getFollowing(userId: string): Promise<User[]> {
    const follows = this.getFromStorage<Follow>(this.STORAGE_KEYS.FOLLOWS);
    const users = this.getFromStorage<User>(this.STORAGE_KEYS.USERS);
    
    const followingIds = Array.from(follows.values())
      .filter(f => f.followerId === userId)
      .map(f => f.followingId);
    
    return followingIds.map(id => users.get(id)).filter(Boolean) as User[];
  }

  async getTags(): Promise<Tag[]> {
    const tags = this.getFromStorage<Tag>(this.STORAGE_KEYS.TAGS);
    return Array.from(tags.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getPopularTags(limit = 5): Promise<Tag[]> {
    const tags = this.getFromStorage<Tag>(this.STORAGE_KEYS.TAGS);
    return Array.from(tags.values())
      .sort((a, b) => (b.articlesCount || 0) - (a.articlesCount || 0))
      .slice(0, limit);
  }

  async createTag(name: string): Promise<Tag> {
    const tags = this.getFromStorage<Tag>(this.STORAGE_KEYS.TAGS);
    const existing = Array.from(tags.values()).find(t => t.name === name);
    if (existing) return existing;
    
    const id = generateId();
    const tag: Tag = { id, name, description: "", color: "#3b82f6", articlesCount: 0 };
    tags.set(id, tag);
    this.saveToStorage(this.STORAGE_KEYS.TAGS, tags);
    return tag;
  }
}

export const storage = new LocalStorage();