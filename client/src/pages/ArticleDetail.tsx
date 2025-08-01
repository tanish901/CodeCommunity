import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { useAppSelector, useAppDispatch } from "@/store";
import { fetchArticle, toggleLike, clearCurrentArticle } from "@/store/articlesSlice";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Comment, InsertComment } from "@shared/schema";
import { Heart, MessageCircle, Eye, Calendar, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAppSelector((state) => state.auth);
  const { currentArticle, loading } = useAppSelector((state) => state.articles);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [commentContent, setCommentContent] = useState("");

  // Fetch article
  useEffect(() => {
    if (id) {
      dispatch(fetchArticle(id));
    }
    return () => {
      dispatch(clearCurrentArticle());
    };
  }, [dispatch, id]);

  // Fetch comments
  const { data: comments = [], isLoading: commentsLoading } = useQuery<(Comment & { author: any })[]>({
    queryKey: ["/api/articles", id, "comments"],
    enabled: !!id,
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: async (commentData: InsertComment) => {
      const response = await fetch(`/api/articles/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData),
      });
      if (!response.ok) throw new Error('Failed to create comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles", id, "comments"] });
      setCommentContent("");
      toast({
        title: "Success",
        description: "Comment posted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLike = async () => {
    if (user && currentArticle) {
      dispatch(toggleLike({ articleId: currentArticle.id, userId: user.id }));
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentContent.trim()) return;

    createCommentMutation.mutate({
      content: commentContent,
      articleId: id!,
      authorId: user.id,
    });
  };

  const getTagClassName = (tag: string) => {
    const tagMap: Record<string, string> = {
      javascript: "tag-javascript",
      react: "tag-react",
      webdev: "tag-webdev",
      python: "tag-python",
      devops: "tag-devops",
      ai: "tag-ai",
      programming: "tag-programming",
      opensource: "tag-opensource",
    };
    return `tag ${tagMap[tag] || "bg-gray-100 text-gray-800"}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-24" />
          <Card>
            <CardContent className="p-8">
              <Skeleton className="h-12 w-full mb-6" />
              <div className="flex items-center space-x-3 mb-6">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-64 w-full mb-6" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!currentArticle) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-slate-600 text-lg">Article not found</p>
              <Link href="/">
                <Button className="mt-4">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Back to Articles
          </Button>
        </Link>

        {/* Article */}
        <Card>
          <CardContent className="p-8">
            {/* Cover Image */}
            {currentArticle.coverImage && (
              <div className="w-full h-64 mb-8 overflow-hidden rounded-lg">
                <img
                  src={currentArticle.coverImage}
                  alt={currentArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold text-slate-800 mb-6">
              {currentArticle.title}
            </h1>

            {/* Author and Meta */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
              <div className="flex items-center space-x-4">
                <Link href={`/author/${currentArticle.author.username}`}>
                  <Avatar className="w-12 h-12 cursor-pointer">
                    <AvatarImage src={currentArticle.author.avatar || ""} alt={currentArticle.author.username} />
                    <AvatarFallback>
                      {currentArticle.author.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link href={`/author/${currentArticle.author.username}`}>
                    <p className="font-semibold text-slate-800 hover:text-primary cursor-pointer">
                      {currentArticle.author.username}
                    </p>
                  </Link>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {formatDistanceToNow(new Date(currentArticle.createdAt!), { addSuffix: true })}
                    </span>
                    <span className="flex items-center">
                      <Eye size={14} className="mr-1" />
                      {currentArticle.views || 0} views
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={handleLike}
                  className={`flex items-center space-x-2 ${
                    currentArticle.isLiked ? "text-red-500" : "text-slate-600"
                  }`}
                >
                  <Heart size={20} className={currentArticle.isLiked ? "fill-red-500" : ""} />
                  <span>{currentArticle.likes || 0}</span>
                </Button>
                <Button variant="ghost" className="flex items-center space-x-2 text-slate-600">
                  <MessageCircle size={20} />
                  <span>{comments.length}</span>
                </Button>
              </div>
            </div>

            {/* Tags */}
            {currentArticle.tags && currentArticle.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {currentArticle.tags.map((tag) => (
                  <span key={tag} className={getTagClassName(tag)}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="article-content prose prose-slate max-w-none">
              {currentArticle.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-slate-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">
              Comments ({comments.length})
            </h3>

            {/* Add Comment Form */}
            {user && (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={user.avatar || ""} alt={user.username} />
                    <AvatarFallback>
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <Textarea
                      placeholder="Write a comment..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={!commentContent.trim() || createCommentMutation.isPending}
                      >
                        {createCommentMutation.isPending ? "Posting..." : "Post Comment"}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {commentsLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-4">
                    <Link href={`/author/${comment.author.username}`}>
                      <Avatar className="w-10 h-10 cursor-pointer">
                        <AvatarImage src={comment.author.avatar || ""} alt={comment.author.username} />
                        <AvatarFallback>
                          {comment.author.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Link href={`/author/${comment.author.username}`}>
                          <span className="font-medium text-slate-800 hover:text-primary cursor-pointer">
                            {comment.author.username}
                          </span>
                        </Link>
                        <span className="text-sm text-slate-500">
                          {formatDistanceToNow(new Date(comment.createdAt!), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-slate-700">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-600 text-center py-8">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
