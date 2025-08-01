import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertArticleSchema, insertCommentSchema, loginSchema } from "@shared/schema";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid data", error });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid data", error });
    }
  });

  // Articles routes
  app.get("/api/articles", async (req, res) => {
    try {
      const { authorId, tag, search, published } = req.query;
      
      const articles = await storage.getArticles({
        authorId: authorId as string,
        tag: tag as string,
        search: search as string,
        published: published ? published === 'true' : undefined,
      });
      
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles", error });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const article = await storage.getArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      // Increment view count
      await storage.updateArticle(req.params.id, { 
        views: (article.views || 0) + 1 
      });
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article", error });
    }
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const articleData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(articleData);
      res.json(article);
    } catch (error) {
      res.status(400).json({ message: "Invalid article data", error });
    }
  });

  app.put("/api/articles/:id", async (req, res) => {
    try {
      const updates = req.body;
      const article = await storage.updateArticle(req.params.id, updates);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to update article", error });
    }
  });

  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const success = await storage.deleteArticle(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete article", error });
    }
  });

  // Comments routes
  app.get("/api/articles/:id/comments", async (req, res) => {
    try {
      const comments = await storage.getCommentsByArticleId(req.params.id);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments", error });
    }
  });

  app.post("/api/articles/:id/comments", async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse({
        ...req.body,
        articleId: req.params.id,
      });
      const comment = await storage.createComment(commentData);
      res.json(comment);
    } catch (error) {
      res.status(400).json({ message: "Invalid comment data", error });
    }
  });

  // Likes routes
  app.post("/api/articles/:id/like", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }
      
      const result = await storage.toggleLike(userId, req.params.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle like", error });
    }
  });

  app.get("/api/users/:id/likes", async (req, res) => {
    try {
      const likes = await storage.getUserLikes(req.params.id);
      res.json(likes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch likes", error });
    }
  });

  // Users routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user", error });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user", error });
    }
  });

  // Follow routes
  app.post("/api/users/:id/follow", async (req, res) => {
    try {
      const { followerId } = req.body;
      if (!followerId) {
        return res.status(400).json({ message: "Follower ID required" });
      }
      
      const result = await storage.toggleFollow(followerId, req.params.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle follow", error });
    }
  });

  // Tags routes
  app.get("/api/tags", async (req, res) => {
    try {
      const tags = await storage.getTags();
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tags", error });
    }
  });

  app.get("/api/tags/popular", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const tags = await storage.getPopularTags(limit);
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch popular tags", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
