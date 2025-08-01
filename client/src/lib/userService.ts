import { UserProfile } from '@/store/usersSlice';

// Mock user data
const mockUsers: Record<string, UserProfile> = {
  "user-1": {
    id: "user-1",
    username: "sarahchen",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    bio: "Passionate frontend developer with 5+ years of experience building scalable web applications. I love React, TypeScript, and creating delightful user experiences. When I'm not coding, you can find me hiking or exploring new coffee shops.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=150&h=150&fit=crop&crop=face",
    location: "San Francisco, CA",
    website: "https://sarahchen.dev",
    github: "sarahchen",
    twitter: "sarahchen_dev",
    joinedDate: "2022-03-15",
    followers: 1284,
    following: 456,
    totalViews: 125483,
    totalLikes: 3921,
    articlesCount: 24,
    achievements: ["Top Contributor", "Featured Author", "Community Leader"],
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Docker"],
    isVerified: true,
    profession: "Senior Frontend Developer",
    company: "TechCorp",
    age: 28,
    gender: "Female",
  },
  "user-2": {
    id: "user-2",
    username: "michaelr",
    name: "Michael Rodriguez",
    email: "michael.rodriguez@example.com",
    bio: "Fullstack developer passionate about clean code and user experience. I specialize in React, Node.js, and cloud architecture.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    location: "New York, NY",
    website: "https://michaelr.dev",
    github: "michaelr",
    twitter: "michaelr_dev",
    joinedDate: "2021-08-15",
    followers: 2847,
    following: 329,
    totalViews: 125483,
    totalLikes: 3921,
    articlesCount: 18,
    achievements: ["Top Contributor", "Featured Author"],
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "Python", "AWS"],
    isVerified: true,
    profession: "Fullstack Developer",
    company: "DevCorp",
    age: 32,
    gender: "Male",
  },
  "user-3": {
    id: "user-3",
    username: "alexkim",
    name: "Alex Kim",
    email: "alex.kim@example.com",
    bio: "Frontend specialist focused on creating beautiful and accessible user interfaces. I love working with modern CSS and JavaScript frameworks.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    location: "Seattle, WA",
    website: "https://alexkim.dev",
    github: "alexkim",
    twitter: "alexkim_dev",
    joinedDate: "2023-01-10",
    followers: 892,
    following: 156,
    totalViews: 45678,
    totalLikes: 1234,
    articlesCount: 12,
    achievements: ["Featured Author"],
    skills: ["CSS", "JavaScript", "React", "Vue.js", "Sass", "Webpack"],
    isVerified: false,
    profession: "Frontend Developer",
    company: "WebCorp",
    age: 26,
    gender: "Male",
  },
  "user-4": {
    id: "user-4",
    username: "johndoe",
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Senior Software Engineer passionate about web technologies, open source, and building developer tools. I write about React, Node.js, and modern web development practices.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    location: "New York, NY",
    website: "https://johndoe.dev",
    github: "johndoe",
    twitter: "johndoe_dev",
    joinedDate: "2021-08-15",
    followers: 2847,
    following: 329,
    totalViews: 125483,
    totalLikes: 3921,
    articlesCount: 24,
    achievements: ["Top Contributor", "Featured Author"],
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "Python", "AWS"],
    isVerified: true,
    profession: "Senior Software Engineer",
    company: "TechCorp",
    age: 30,
    gender: "Male",
  },
  // Add username mappings for backward compatibility
  "sarahchen": {
    id: "user-1",
    username: "sarahchen",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    bio: "Passionate frontend developer with 5+ years of experience building scalable web applications. I love React, TypeScript, and creating delightful user experiences. When I'm not coding, you can find me hiking or exploring new coffee shops.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=150&h=150&fit=crop&crop=face",
    location: "San Francisco, CA",
    website: "https://sarahchen.dev",
    github: "sarahchen",
    twitter: "sarahchen_dev",
    joinedDate: "2022-03-15",
    followers: 1284,
    following: 456,
    totalViews: 125483,
    totalLikes: 3921,
    articlesCount: 24,
    achievements: ["Top Contributor", "Featured Author", "Community Leader"],
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Docker"],
    isVerified: true,
    profession: "Senior Frontend Developer",
    company: "TechCorp",
    age: 28,
    gender: "Female",
  },
  "michaelr": {
    id: "user-2",
    username: "michaelr",
    name: "Michael Rodriguez",
    email: "michael.rodriguez@example.com",
    bio: "Fullstack developer passionate about clean code and user experience. I specialize in React, Node.js, and cloud architecture.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    location: "New York, NY",
    website: "https://michaelr.dev",
    github: "michaelr",
    twitter: "michaelr_dev",
    joinedDate: "2021-08-15",
    followers: 2847,
    following: 329,
    totalViews: 125483,
    totalLikes: 3921,
    articlesCount: 18,
    achievements: ["Top Contributor", "Featured Author"],
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "Python", "AWS"],
    isVerified: true,
    profession: "Fullstack Developer",
    company: "DevCorp",
    age: 32,
    gender: "Male",
  },
  "alexkim": {
    id: "user-3",
    username: "alexkim",
    name: "Alex Kim",
    email: "alex.kim@example.com",
    bio: "Frontend specialist focused on creating beautiful and accessible user interfaces. I love working with modern CSS and JavaScript frameworks.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    location: "Seattle, WA",
    website: "https://alexkim.dev",
    github: "alexkim",
    twitter: "alexkim_dev",
    joinedDate: "2023-01-10",
    followers: 892,
    following: 156,
    totalViews: 45678,
    totalLikes: 1234,
    articlesCount: 12,
    achievements: ["Featured Author"],
    skills: ["CSS", "JavaScript", "React", "Vue.js", "Sass", "Webpack"],
    isVerified: false,
    profession: "Frontend Developer",
    company: "WebCorp",
    age: 26,
    gender: "Male",
  },
  "johndoe": {
    id: "user-4",
    username: "johndoe",
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Senior Software Engineer passionate about web technologies, open source, and building developer tools. I write about React, Node.js, and modern web development practices.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    location: "New York, NY",
    website: "https://johndoe.dev",
    github: "johndoe",
    twitter: "johndoe_dev",
    joinedDate: "2021-08-15",
    followers: 2847,
    following: 329,
    totalViews: 125483,
    totalLikes: 3921,
    articlesCount: 24,
    achievements: ["Top Contributor", "Featured Author"],
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "Python", "AWS"],
    isVerified: true,
    profession: "Senior Software Engineer",
    company: "TechCorp",
    age: 30,
    gender: "Male",
  },
};

export const getUserByUsername = (username: string): UserProfile | null => {
  return mockUsers[username] || null;
};

export const getUserById = (id: string): UserProfile | null => {
  return mockUsers[id] || null;
};

export const getAllUsers = (): UserProfile[] => {
  // Return unique users (avoid duplicates from username mappings)
  const uniqueUsers = new Map<string, UserProfile>();
  Object.values(mockUsers).forEach(user => {
    if (!uniqueUsers.has(user.id)) {
      uniqueUsers.set(user.id, user);
    }
  });
  return Array.from(uniqueUsers.values());
};

export const getRecommendedUsers = (): UserProfile[] => {
  return [mockUsers["user-1"], mockUsers["user-2"], mockUsers["user-3"]];
};

export const followUser = async (followerId: string, followingId: string): Promise<boolean> => {
  // In a real app, this would make an API call
  return true;
};

export const unfollowUser = async (followerId: string, followingId: string): Promise<boolean> => {
  // In a real app, this would make an API call
  return true;
};