import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { fetchArticles, setFilter, setSelectedTag } from "@/store/articlesSlice";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import ArticleCard from "@/components/ArticleCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Home as HomeIcon, Info, Mail, BarChart3, User, MessageSquare } from "lucide-react";
import { Tag } from "@shared/schema";

export default function Home() {
  const { articles, loading, filter, searchQuery, selectedTag } = useAppSelector((state) => state.articles);
  const dispatch = useAppDispatch();

  // Fetch popular tags
  const { data: popularTags } = useQuery<Tag[]>({
    queryKey: ["/api/tags/popular"],
  });

  // Fetch articles with filters
  useEffect(() => {
    dispatch(fetchArticles({
      search: searchQuery || undefined,
      tag: selectedTag || undefined,
      published: true,
    }));
  }, [dispatch, searchQuery, selectedTag]);

  const handleFilterChange = (newFilter: 'relevant' | 'latest' | 'top') => {
    dispatch(setFilter(newFilter));
  };

  const handleTagSelect = (tag: string) => {
    dispatch(setSelectedTag(selectedTag === tag ? null : tag));
  };

  const sortedArticles = [...articles].sort((a, b) => {
    switch (filter) {
      case 'latest':
        return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
      case 'top':
        return (b.likes || 0) - (a.likes || 0);
      default: // relevant
        return (b.views || 0) - (a.views || 0);
    }
  });

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
                      className={`w-full justify-between p-3 h-auto text-left rounded-lg ${
                        selectedTag === tag.name ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                      }`}
                      onClick={() => handleTagSelect(tag.name)}
                    >
                      <span className="font-medium">#{tag.name}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {tag.articlesCount || 0}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>



        {/* Main Content */}
        <div className="col-span-12 lg:col-span-6">
          <div className="space-y-8">
            {/* Filter Tabs */}
            <Card className="border-0 shadow-lg bg-card">
              <CardContent className="p-2">
                <div className="flex space-x-2">
                  {(['relevant', 'latest', 'top'] as const).map((filterOption) => (
                    <Button
                      key={filterOption}
                      variant={filter === filterOption ? "default" : "ghost"}
                      className={`flex-1 capitalize rounded-lg ${
                        filter === filterOption 
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : "hover:bg-muted"
                      }`}
                      onClick={() => handleFilterChange(filterOption)}
                    >
                      {filterOption}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Featured Challenge Banner */}
            <Card className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-3">Code Challenges</h2>
                    <p className="text-primary-foreground/90 mb-6 text-lg">Take your skills to the next level</p>
                    <div className="flex items-center space-x-6 text-sm">
                      <span className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span>Build amazing projects</span>
                      </span>
                      <span className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span>Learn new technologies</span>
                      </span>
                    </div>
                  </div>
                  <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <BarChart3 size={40} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Articles Feed */}
            <div className="space-y-8">
              {loading ? (
                // Loading skeletons
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="border-0 shadow-lg bg-card">
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-4 mb-6">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <Skeleton className="h-8 w-full mb-3" />
                      <Skeleton className="h-8 w-3/4 mb-6" />
                      <div className="flex space-x-3 mb-6">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </div>
                      <div className="flex justify-between">
                        <div className="flex space-x-6">
                          <Skeleton className="h-10 w-20" />
                          <Skeleton className="h-10 w-20" />
                          <Skeleton className="h-10 w-24" />
                        </div>
                        <Skeleton className="h-10 w-10" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : sortedArticles.length > 0 ? (
                sortedArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))
              ) : (
                <Card className="border-0 shadow-lg bg-card">
                  <CardContent className="p-12 text-center">
                    <p className="text-foreground text-xl mb-2">No articles found</p>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-12 lg:col-span-3">
          <div className="space-y-8 sticky top-24">
            {/* Forums Section */}
            <Card className="border-0 shadow-lg bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-foreground">Forums</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                  <h4 className="font-semibold text-foreground mb-2">What was your win this week?</h4>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <MessageSquare size={14} className="mr-2" />
                    12 comments
                  </p>
                </div>
                <div className="p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                  <h4 className="font-semibold text-foreground mb-2">Best practices for code reviews?</h4>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <MessageSquare size={14} className="mr-2" />
                    8 comments
                  </p>
                </div>
                <div className="p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
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
                {[
                  { name: "Sarah Chen", title: "DevOps enthusiast", avatar: "" },
                  { name: "Michael Rodriguez", title: "Fullstack developer", avatar: "" },
                  { name: "Alex Kim", title: "Frontend specialist", avatar: "" },
                ].map((author, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User size={18} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{author.name}</p>
                      <p className="text-sm text-muted-foreground">{author.title}</p>
                    </div>
                    <Button size="sm" variant="outline" className="rounded-full">
                      Follow
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
      </div>
    </Layout>
  );
}
