import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector, useAppDispatch } from "@/store";
import { fetchArticles } from "@/store/articlesSlice";
import { setProfile } from "@/store/usersSlice";
import { followUser, unfollowUser } from "@/store/authSlice";
import { getUserByUsername } from "@/lib/userService";
import Layout from "@/components/Layout";
import ArticleCard from "@/components/ArticleCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  UserPlus, 
  Mail, 
  Users,
  BookOpen,
  Heart,
  Eye,
  MessageCircle,
  Globe,
  Github,
  Twitter,
  CheckCircle,
  Trophy
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AuthorProfile() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, following } = useAppSelector((state) => state.auth);
  const { articles, loading } = useAppSelector((state) => state.articles);
  const { profiles } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  // Get author data from store or fetch if not available
  const authorData = profiles[username || ""] || getUserByUsername(username || "");

  // Check if current user is following this author
  const isFollowing = currentUser && authorData ? following.includes(authorData.id) : false;

  // Fetch author's articles
  useEffect(() => {
    if (username && authorData) {
      dispatch(fetchArticles({ authorId: authorData.id, published: true }));
    }
  }, [dispatch, username, authorData]);

  // Load author profile into store if not already there
  useEffect(() => {
    if (username && authorData && !profiles[username]) {
      dispatch(setProfile(authorData));
    }
  }, [username, authorData, profiles, dispatch]);

  const authorArticles = articles.filter(article => 
    article.author?.username?.toLowerCase() === username?.toLowerCase()
  );

  const handleFollow = () => {
    if (!currentUser || !authorData) return;

    if (isFollowing) {
      dispatch(unfollowUser(authorData.id));
    } else {
      dispatch(followUser(authorData.id));
    }
  };

  if (!authorData) {
    return (
      <Layout>
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <Users size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Author not found</h3>
              <p className="text-muted-foreground">The author you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            {/* Author Profile Card */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <Avatar className="w-24 h-24 mx-auto border-4 border-primary/20 shadow-lg">
                        <AvatarImage src={authorData.avatar} alt={authorData.name} />
                        <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                          {authorData.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {authorData.isVerified && (
                        <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1">
                          <CheckCircle size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center justify-center space-x-2 mb-1">
                        <h1 className="text-xl font-bold">{authorData.name}</h1>
                        {authorData.achievements.includes("Top Contributor") && (
                          <Trophy size={16} className="text-yellow-500" />
                        )}
                      </div>
                      <p className="text-muted-foreground">@{authorData.username}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <p className="text-sm text-center leading-relaxed">{authorData.bio}</p>
                    
                    <div className="flex justify-center space-x-6 text-sm">
                      <div className="text-center">
                        <p className="font-semibold">{authorData.followers.toLocaleString()}</p>
                        <p className="text-muted-foreground">Followers</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">{authorData.following.toLocaleString()}</p>
                        <p className="text-muted-foreground">Following</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {authorData.location && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin size={14} />
                        <span>{authorData.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar size={14} />
                      <span>Joined {formatDistanceToNow(new Date(authorData.joinedDate), { addSuffix: true })}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {authorData.website && (
                      <a
                        href={authorData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        <Globe size={14} />
                        <span>Website</span>
                      </a>
                    )}
                    
                    {authorData.github && (
                      <a
                        href={`https://github.com/${authorData.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github size={14} />
                        <span>GitHub</span>
                      </a>
                    )}
                    
                    {authorData.twitter && (
                      <a
                        href={`https://twitter.com/${authorData.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Twitter size={14} />
                        <span>Twitter</span>
                      </a>
                    )}
                  </div>

                  {currentUser?.username !== authorData.username && (
                    <div className="space-y-2">
                      <Button
                        onClick={handleFollow}
                        className={`w-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 ${
                          isFollowing 
                            ? "bg-muted text-foreground hover:bg-muted/80" 
                            : "bg-primary hover:bg-primary/90"
                        }`}
                      >
                        <UserPlus size={16} className="mr-2" />
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                      <Button variant="outline" className="w-full hover:shadow-md transition-shadow">
                        <Mail size={16} className="mr-2" />
                        Message
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardContent className="p-4 text-center">
                    <BookOpen size={24} className="mx-auto text-blue-500 mb-2" />
                    <p className="text-2xl font-bold">{authorData.articlesCount}</p>
                    <p className="text-xs text-muted-foreground">Articles</p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Eye size={24} className="mx-auto text-green-500 mb-2" />
                    <p className="text-2xl font-bold">{authorData.totalViews.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Views</p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Heart size={24} className="mx-auto text-red-500 mb-2" />
                    <p className="text-2xl font-bold">{authorData.totalLikes.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Likes</p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Users size={24} className="mx-auto text-purple-500 mb-2" />
                    <p className="text-2xl font-bold">{authorData.followers.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </CardContent>
                </Card>
              </div>

              {/* Skills Section */}
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy size={20} />
                    <span>Skills & Technologies</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {authorData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="hover:shadow-md transition-shadow">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Articles Section */}
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen size={20} />
                    <span>Recent Articles ({authorArticles.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-6 p-6">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                          <div className="h-6 bg-muted rounded mb-3"></div>
                          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                        </div>
                      ))
                    ) : authorArticles.length > 0 ? (
                      authorArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <BookOpen size={64} className="mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No articles yet</h3>
                        <p className="text-muted-foreground">
                          This author hasn't published any articles yet.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}