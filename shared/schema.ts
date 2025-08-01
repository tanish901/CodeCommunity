import { z } from "zod";

// User types
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  bio: string | null;
  avatar: string | null;
  location: string | null;
  website: string | null;
  createdAt: Date;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  authorId: string;
  tags: string[] | null;
  likes: number;
  views: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  articleId: string;
  authorId: string;
  parentId: string | null;
  createdAt: Date;
}

export interface Like {
  id: string;
  userId: string;
  articleId: string;
  createdAt: Date;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  description: string;
  color: string;
  articlesCount: number;
}

// Zod schemas for validation
export const insertUserSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
});

export const insertArticleSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  authorId: z.string(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

export const insertCommentSchema = z.object({
  content: z.string().min(1),
  articleId: z.string(),
  authorId: z.string(),
  parentId: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Inferred types from schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type LoginData = z.infer<typeof loginSchema>;

// Extended types
export type ArticleWithAuthor = Article & {
  author: User;
  isLiked?: boolean;
  commentsCount?: number;
};
