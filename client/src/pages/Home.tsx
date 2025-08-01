import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { fetchArticles, setFilter, setSelectedTag } from "@/store/articlesSlice";
import { followUser, unfollowUser } from "@/store/authSlice";
import { setProfiles } from "@/store/usersSlice";
import { useQuery } from "@tanstack/react-query";
import { getRecommendedUsers } from "@/lib/userService";
import Layout from "@/components/Layout";
import ArticleCard from "@/components/ArticleCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useLocation } from "wouter";
import { Home as HomeIcon, Info, Mail, User, MessageSquare, BarChart3 } from "lucide-react";
import { Tag } from "@shared/schema";

export default function Home() {
  const { articles, loading, filter, searchQuery, selectedTag } = useAppSelector((state) => state.articles);
  const { user: currentUser, following } = useAppSelector((state) => state.auth);
  const { profiles } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();
  const [, setLocation] = useLocation();

  // Fetch popular tags
  const { data: popularTags } = useQuery<Tag[]>({
    queryKey: ["/api/tags/popular"],
  });

  // Load recommended users into store
  useEffect(() => {
    const recommendedUsers = getRecommendedUsers();
    dispatch(setProfiles(recommendedUsers));
  }, [dispatch]);

  // Fetch articles with filters
  useEffect(() => {
    dispatch(fetchArticles({
      search: searchQuery || undefined,
      tag: selectedTag || undefined,
      published: true,
    }));
  }, [dispatch, searchQuery, selectedTag]);

  const handleFilterChange = (newFilter: 'relevant' | 'latest' | 'top' | 'following') => {
    dispatch(setFilter(newFilter));
  };

  const handleTagSelect = (tag: string | null) => {
    dispatch(setSelectedTag(tag));
    dispatch(fetchArticles({ tag: tag || undefined }));
  };

  const handleFollow = (userId: string) => {
    if (!currentUser) return;

    if (following.includes(userId)) {
      dispatch(unfollowUser(userId));
    } else {
      dispatch(followUser(userId));
    }
  };

  const sortedArticles = [...articles].sort((a, b) => {
    switch (filter) {
      case 'latest':
        return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
      case 'top':
        return (b.likes || 0) - (a.likes || 0);
      case 'following':
        // Filter articles from followed users
        return following.includes(a.authorId || "") ? -1 : 1;
      default: // relevant
        return (b.views || 0) - (a.views || 0);
    }
  });

  // Filter articles based on current filter
  const filteredArticles = filter === 'following' 
    ? sortedArticles.filter(article => following.includes(article.authorId || ""))
    : sortedArticles;

  const recommendedUsers = getRecommendedUsers();

  return (
    <Layout>
      <div className="grid grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <div className="col-span-12 lg:col-span-3">
          <div className="space-y-6 sticky top-24">
            {/* Navigation Card */}
            <Card className="border-0 shadow-lg bg-card">
              <CardContent className="p-6">
                <nav className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-6">
                    Navigation
                  </h3>
                  <Link href="/">
                    <Button variant="ghost" className="w-full justify-start bg-primary/10 text-primary hover:bg-primary/20 rounded-lg">
                      <HomeIcon size={18} className="mr-3" />
                      Home
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-muted rounded-lg">
                    <Info size={18} className="mr-3" />
                    About
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-muted rounded-lg">
                    <Mail size={18} className="mr-3" />
                    Contact
                  </Button>
                  <Link href="/dashboard">
                    <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-muted rounded-lg">
                      <BarChart3 size={18} className="mr-3" />
                      Dashboard
                    </Button>
                  </Link>
                </nav>
              </CardContent>
            </Card>

            {/* Tags Card */}
            <Card className="border-0 shadow-lg bg-card">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-6">
                  Recommended Tags
                </h3>
                <div className="space-y-3">
                  {popularTags?.map((tag) => (
                    <Button
                      key={tag.id}
                      variant="ghost"
                      className="w-full justify-start text-foreground hover:bg-muted rounded-lg"
                      onClick={() => handleTagSelect(tag.name)}
                    >
                      #{tag.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Forums Card */}
            <Card className="border-0 shadow-lg bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-foreground">Forums</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className="p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setLocation('/forums/best-practices-code-reviews')}
                >
                  <h4 className="font-semibold text-foreground mb-2">Best practices for code reviews?</h4>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <MessageSquare size={14} className="mr-2" />
                    8 comments
                  </p>
                </div>
                <div 
                  className="p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setLocation('/forums/favorite-development-tools-2024')}
                >
                  <h4 className="font-semibold text-foreground mb-2">Favorite development tools in 2024</h4>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <MessageSquare size={14} className="mr-2" />
                    15 comments
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Authors */}
            <Card className="border-0 shadow-lg bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-foreground">Recommended Authors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {recommendedUsers.map((author) => (
                  <div key={author.id} className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={() => setLocation(`/author/${author.username}`)}
                    >
                      {author.avatar ? (
                        <img 
                          src={author.avatar} 
                          alt={author.name} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User size={18} className="text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p 
                        className="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                        onClick={() => setLocation(`/author/${author.username}`)}
                      >
                        {author.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{author.profession}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant={following.includes(author.id) ? "default" : "outline"}
                      className={`rounded-full transition-colors ${
                        following.includes(author.id) 
                          ? "bg-muted text-foreground hover:bg-muted/80" 
                          : "hover:bg-primary hover:text-primary-foreground"
                      }`}
                      onClick={() => handleFollow(author.id)}
                    >
                      {following.includes(author.id) ? "Following" : "Follow"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trending Now */}
            <Card className="border-0 shadow-lg bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-foreground">Trending Now</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <a href="#" className="text-foreground hover:text-primary transition-colors font-semibold text-sm block">
                    Getting started with Rust for JavaScript developers
                  </a>
                  <p className="text-muted-foreground text-xs">2.1k views</p>
                </div>
                <div className="space-y-2">
                  <a href="#" className="text-foreground hover:text-primary transition-colors font-semibold text-sm block">
                    The future of AI in web development
                  </a>
                  <p className="text-muted-foreground text-xs">1.8k views</p>
                </div>
                <div className="space-y-2">
                  <a href="#" className="text-foreground hover:text-primary transition-colors font-semibold text-sm block">
                    Building scalable microservices with Node.js
                  </a>
                  <p className="text-muted-foreground text-xs">1.5k views</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-9">
          {/* Filter Tabs */}
          <div className="flex space-x-1 mb-8 bg-muted/50 rounded-lg p-1">
            <Button
              variant={filter === 'relevant' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleFilterChange('relevant')}
              className="flex-1"
            >
              Relevant
            </Button>
            <Button
              variant={filter === 'latest' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleFilterChange('latest')}
              className="flex-1"
            >
              Latest
            </Button>
            <Button
              variant={filter === 'top' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleFilterChange('top')}
              className="flex-1"
            >
              Top
            </Button>
            <Button
              variant={filter === 'following' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleFilterChange('following')}
              className="flex-1"
            >
              Following
            </Button>
          </div>

          {/* Articles */}
          <div className="space-y-6">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            ) : (
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <HomeIcon size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {filter === 'following' ? 'No articles from followed authors' : 'No articles found'}
                  </h3>
                  <p className="text-muted-foreground">
                    {filter === 'following' 
                      ? 'Follow some authors to see their articles here.' 
                      : 'Try adjusting your search or filter criteria.'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
