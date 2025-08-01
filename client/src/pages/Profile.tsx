import { useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector, useAppDispatch } from "@/store";
import { fetchArticles } from "@/store/articlesSlice";
import Layout from "@/components/Layout";
import ArticleCard from "@/components/ArticleCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@shared/schema";
import { MapPin, Link as LinkIcon, Calendar, UserPlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { articles, loading } = useAppSelector((state) => state.articles);
  const dispatch = useAppDispatch();

  // Fetch user profile
  const { data: profileUser, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/users", id],
    enabled: !!id,
  });

  // Fetch user's articles
  useEffect(() => {
    if (id) {
      dispatch(fetchArticles({ authorId: id, published: true }));
    }
  }, [dispatch, id]);

  const userArticles = articles.filter(article => article.authorId === id);
  const totalViews = userArticles.reduce((sum, article) => sum + (article.views || 0), 0);
  const totalLikes = userArticles.reduce((sum, article) => sum + (article.likes || 0), 0);

  if (userLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          {/* Profile Header Skeleton */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-96" />
                  <div className="flex space-x-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!profileUser) {
    return (
      <Layout>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-slate-600 text-lg">User not found</p>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  const isOwnProfile = currentUser?.id === profileUser.id;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profileUser.avatar || ""} alt={profileUser.username} />
                <AvatarFallback className="text-2xl">
                  {profileUser.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">
                  {profileUser.username}
                </h1>
                
                {profileUser.bio && (
                  <p className="text-slate-600 mb-4">{profileUser.bio}</p>
                )}
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  {profileUser.location && (
                    <span className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {profileUser.location}
                    </span>
                  )}
                  
                  {profileUser.website && (
                    <a
                      href={profileUser.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:underline"
                    >
                      <LinkIcon size={14} className="mr-1" />
                      Website
                    </a>
                  )}
                  
                  <span className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    Joined {formatDistanceToNow(new Date(profileUser.createdAt!), { addSuffix: true })}
                  </span>
                </div>
              </div>
              
              {!isOwnProfile && (
                <Button>
                  <UserPlus size={16} className="mr-2" />
                  Follow
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">{userArticles.length}</p>
                <p className="text-sm text-slate-600">Articles Published</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">{totalViews}</p>
                <p className="text-sm text-slate-600">Total Views</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">{totalLikes}</p>
                <p className="text-sm text-slate-600">Total Likes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Articles */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            {isOwnProfile ? "Your Articles" : `${profileUser.username}'s Articles`}
          </h2>
          
          <div className="space-y-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <div className="flex space-x-2 mb-4">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <div className="flex justify-between">
                      <div className="flex space-x-4">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : userArticles.length > 0 ? (
              userArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-slate-600 text-lg">
                    {isOwnProfile ? "You haven't published any articles yet" : "No articles published yet"}
                  </p>
                  {isOwnProfile && (
                    <p className="text-slate-500">Start writing your first article!</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
