import { type User, type InsertUser, type Article, type InsertArticle, type Comment, type InsertComment, type Like, type Follow, type Tag, type ArticleWithAuthor } from "@shared/schema";
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private articles: Map<string, Article>;
  private comments: Map<string, Comment>;
  private likes: Map<string, Like>;
  private follows: Map<string, Follow>;
  private tags: Map<string, Tag>;

  constructor() {
    this.users = new Map();
    this.articles = new Map();
    this.comments = new Map();
    this.likes = new Map();
    this.follows = new Map();
    this.tags = new Map();
    
    // Initialize with some popular tags and sample data
    this.initializeTags();
    this.initializeSampleData();
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

    defaultTags.forEach(tag => {
      const id = randomUUID();
      this.tags.set(id, { id, ...tag, description: "", articlesCount: 0 });
    });
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
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      bio: insertUser.bio || null,
      avatar: insertUser.avatar || null,
      location: insertUser.location || null,
      website: insertUser.website || null,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getArticle(id: string): Promise<ArticleWithAuthor | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    
    const author = this.users.get(article.authorId);
    if (!author) return undefined;

    const commentsCount = Array.from(this.comments.values()).filter(c => c.articleId === id).length;
    
    return { ...article, author, commentsCount };
  }

  async getArticles(filters?: { authorId?: string; tag?: string; search?: string; published?: boolean }): Promise<ArticleWithAuthor[]> {
    let articles = Array.from(this.articles.values());
    
    if (filters?.published !== undefined) {
      articles = articles.filter(a => a.published === filters.published);
    }
    
    if (filters?.authorId) {
      articles = articles.filter(a => a.authorId === filters.authorId);
    }
    
    if (filters?.tag) {
      articles = articles.filter(a => a.tags?.includes(filters.tag!));
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      articles = articles.filter(a => 
        a.title.toLowerCase().includes(search) || 
        a.content.toLowerCase().includes(search)
      );
    }

    const articlesWithAuthors: ArticleWithAuthor[] = [];
    
    for (const article of articles) {
      const author = this.users.get(article.authorId);
      if (author) {
        const commentsCount = Array.from(this.comments.values()).filter(c => c.articleId === article.id).length;
        articlesWithAuthors.push({ ...article, author, commentsCount });
      }
    }
    
    return articlesWithAuthors.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = randomUUID();
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
    this.articles.set(id, article);
    
    // Update tag counts
    if (article.tags) {
      for (const tagName of article.tags) {
        const tag = Array.from(this.tags.values()).find(t => t.name === tagName);
        if (tag) {
          tag.articlesCount = (tag.articlesCount || 0) + 1;
        }
      }
    }
    
    return article;
  }

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    
    const updatedArticle = { ...article, ...updates, updatedAt: new Date() };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }

  async deleteArticle(id: string): Promise<boolean> {
    return this.articles.delete(id);
  }

  async getCommentsByArticleId(articleId: string): Promise<(Comment & { author: User })[]> {
    const comments = Array.from(this.comments.values()).filter(c => c.articleId === articleId);
    const commentsWithAuthors = [];
    
    for (const comment of comments) {
      const author = this.users.get(comment.authorId);
      if (author) {
        commentsWithAuthors.push({ ...comment, author });
      }
    }
    
    return commentsWithAuthors.sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = { 
      ...insertComment, 
      id, 
      parentId: insertComment.parentId ?? null,
      createdAt: new Date() 
    };
    this.comments.set(id, comment);
    return comment;
  }

  async deleteComment(id: string): Promise<boolean> {
    return this.comments.delete(id);
  }

  async toggleLike(userId: string, articleId: string): Promise<{ liked: boolean; likesCount: number }> {
    const existingLike = Array.from(this.likes.values()).find(l => l.userId === userId && l.articleId === articleId);
    
    if (existingLike) {
      this.likes.delete(existingLike.id);
      const article = this.articles.get(articleId);
      if (article) {
        article.likes = Math.max(0, (article.likes || 0) - 1);
        this.articles.set(articleId, article);
      }
      return { liked: false, likesCount: article?.likes || 0 };
    } else {
      const id = randomUUID();
      const like: Like = { id, userId, articleId, createdAt: new Date() };
      this.likes.set(id, like);
      
      const article = this.articles.get(articleId);
      if (article) {
        article.likes = (article.likes || 0) + 1;
        this.articles.set(articleId, article);
      }
      return { liked: true, likesCount: article?.likes || 0 };
    }
  }

  async getUserLikes(userId: string): Promise<string[]> {
    return Array.from(this.likes.values())
      .filter(l => l.userId === userId)
      .map(l => l.articleId);
  }

  async toggleFollow(followerId: string, followingId: string): Promise<{ following: boolean }> {
    const existingFollow = Array.from(this.follows.values()).find(f => f.followerId === followerId && f.followingId === followingId);
    
    if (existingFollow) {
      this.follows.delete(existingFollow.id);
      return { following: false };
    } else {
      const id = randomUUID();
      const follow: Follow = { id, followerId, followingId, createdAt: new Date() };
      this.follows.set(id, follow);
      return { following: true };
    }
  }

  async getFollowers(userId: string): Promise<User[]> {
    const followerIds = Array.from(this.follows.values())
      .filter(f => f.followingId === userId)
      .map(f => f.followerId);
    
    return followerIds.map(id => this.users.get(id)).filter(Boolean) as User[];
  }

  async getFollowing(userId: string): Promise<User[]> {
    const followingIds = Array.from(this.follows.values())
      .filter(f => f.followerId === userId)
      .map(f => f.followingId);
    
    return followingIds.map(id => this.users.get(id)).filter(Boolean) as User[];
  }

  async getTags(): Promise<Tag[]> {
    return Array.from(this.tags.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getPopularTags(limit = 5): Promise<Tag[]> {
    return Array.from(this.tags.values())
      .sort((a, b) => (b.articlesCount || 0) - (a.articlesCount || 0))
      .slice(0, limit);
  }

  async createTag(name: string): Promise<Tag> {
    const existing = Array.from(this.tags.values()).find(t => t.name === name);
    if (existing) return existing;
    
    const id = randomUUID();
    const tag: Tag = { id, name, description: "", color: "#3b82f6", articlesCount: 0 };
    this.tags.set(id, tag);
    return tag;
  }
}

export const storage = new MemStorage();
