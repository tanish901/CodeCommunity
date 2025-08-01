import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { fetchArticles } from "@/store/articlesSlice";
import Layout from "@/components/Layout";
import ArticleCard from "@/components/ArticleCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PenTool, Eye, Heart, MessageCircle } from "lucide-react";

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const { articles, loading } = useAppSelector((state) => state.articles);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      dispatch(fetchArticles({ authorId: user.id }));
    }
  }, [dispatch, user]);

  const userArticles = articles.filter(article => article.authorId === user?.id);
  const publishedArticles = userArticles.filter(article => article.published);
  const draftArticles = userArticles.filter(article => !article.published);

  const totalViews = userArticles.reduce((sum, article) => sum + (article.views || 0), 0);
  const totalLikes = userArticles.reduce((sum, article) => sum + (article.likes || 0), 0);
  const totalComments = userArticles.reduce((sum, article) => sum + (article.commentsCount || 0), 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <PenTool className="text-primary" size={20} />
                <div>
                  <p className="text-2xl font-bold">{publishedArticles.length}</p>
                  <p className="text-sm text-slate-600">Published Articles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Eye className="text-green-600" size={20} />
                <div>
                  <p className="text-2xl font-bold">{totalViews}</p>
                  <p className="text-sm text-slate-600">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Heart className="text-red-500" size={20} />
                <div>
                  <p className="text-2xl font-bold">{totalLikes}</p>
                  <p className="text-sm text-slate-600">Total Likes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageCircle className="text-blue-500" size={20} />
                <div>
                  <p className="text-2xl font-bold">{totalComments}</p>
                  <p className="text-sm text-slate-600">Total Comments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Articles Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Published Articles */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Published Articles ({publishedArticles.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))
                ) : publishedArticles.length > 0 ? (
                  publishedArticles.slice(0, 5).map((article) => (
                    <div key={article.id} className="border-b border-slate-200 last:border-b-0 pb-3 last:pb-0">
                      <h4 className="font-medium text-slate-800 hover:text-primary cursor-pointer">
                        {article.title}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                        <span className="flex items-center">
                          <Eye size={14} className="mr-1" />
                          {article.views || 0}
                        </span>
                        <span className="flex items-center">
                          <Heart size={14} className="mr-1" />
                          {article.likes || 0}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle size={14} className="mr-1" />
                          {article.commentsCount || 0}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-600 text-center py-4">No published articles yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Draft Articles */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Draft Articles ({draftArticles.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))
                ) : draftArticles.length > 0 ? (
                  draftArticles.slice(0, 5).map((article) => (
                    <div key={article.id} className="border-b border-slate-200 last:border-b-0 pb-3 last:pb-0">
                      <h4 className="font-medium text-slate-800 hover:text-primary cursor-pointer">
                        {article.title}
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">
                        Last updated: {new Date(article.updatedAt!).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-600 text-center py-4">No drafts yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Articles */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Recent Articles</h2>
          <div className="space-y-6">
            {loading ? (
              Array.from({ length: 2 }).map((_, index) => (
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
              userArticles.slice(0, 3).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-slate-600 text-lg">No articles yet</p>
                  <p className="text-slate-500">Start writing your first article!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
