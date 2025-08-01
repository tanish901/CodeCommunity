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

  // Mock comments data
  const mockComments: (Comment & { author: any })[] = [
    {
      id: "comment-1",
      content: "Great article! This really helped me understand the concepts better.",
      articleId: id || "",
      authorId: "user-2",
      author: {
        id: "user-2",
        username: "michaelr",
        name: "Michael Rodriguez",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "comment-2",
      content: "I've been looking for something like this. Thanks for sharing!",
      articleId: id || "",
      authorId: "user-3",
      author: {
        id: "user-3",
        username: "alexkim",
        name: "Alex Kim",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      },
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Fetch comments
  const { data: comments = mockComments, isLoading: commentsLoading } = useQuery<(Comment & { author: any })[]>({
    queryKey: ["/api/articles", id, "comments"],
    enabled: !!id,
    queryFn: () => {
      // In a real app, this would fetch from API
      // For now, return mock data
      return Promise.resolve(mockComments);
    },
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: async (commentData: InsertComment) => {
      // In a real app, this would be an API call
      // For now, simulate the API response
      const newComment: Comment & { author: any } = {
        id: `comment-${Date.now()}`,
        content: commentData.content,
        articleId: commentData.articleId,
        authorId: commentData.authorId,
        author: {
          id: user?.id || "user-1",
          username: user?.username || "sarahchen",
          name: user?.name || "Sarah Chen",
          avatar: user?.avatar || "https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=150&h=150&fit=crop&crop=face",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return Promise.resolve(newComment);
    },
    onSuccess: (newComment) => {
      // Update the comments list optimistically
      queryClient.setQueryData(["/api/articles", id, "comments"], (oldData: any) => {
        return oldData ? [newComment, ...oldData] : [newComment];
      });
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
    
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to comment",
        variant: "destructive",
      });
      return;
    }

    if (!commentContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    if (!id) {
      toast({
        title: "Error",
        description: "Article not found",
        variant: "destructive",
      });
      return;
    }

    createCommentMutation.mutate({
      content: commentContent.trim(),
      articleId: id,
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
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentArticle) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Article not found</h2>
              <p className="text-muted-foreground mb-6">
                The article you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/">
                <Button>
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
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="flex items-center space-x-2">
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>

        {/* Article Content */}
        <Card className="border-0 shadow-xl mb-8">
          <CardContent className="p-8">
            {/* Article Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
                {currentArticle.title}
              </h1>
              
              {/* Author Info */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={currentArticle.author?.avatar || ""} alt={currentArticle.author?.name} />
                    <AvatarFallback>
                      {currentArticle.author?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link href={`/profile/${currentArticle.authorId}`}>
                      <p className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">
                        {currentArticle.author?.name}
                      </p>
                    </Link>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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
                  {currentArticle.tags.map((tag: string) => (
                    <span key={tag} className={getTagClassName(tag)}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Cover Image */}
              {currentArticle.coverImage && (
                <div className="mb-8">
                  <img
                    src={currentArticle.coverImage}
                    alt="Cover"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Content */}
              <div className="article-content prose prose-slate max-w-none">
                {currentArticle.content.split('\n').map((paragraph: string, index: number) => (
                  <p key={index} className="mb-4 text-slate-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
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
            {user ? (
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
                      className="resize-none"
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
            ) : (
              <div className="mb-8 p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-muted-foreground">
                  Please <Link href="/login" className="text-primary hover:underline">log in</Link> to comment.
                </p>
              </div>
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
                    <Avatar>
                      <AvatarImage src={comment.author?.avatar || ""} alt={comment.author?.name} />
                      <AvatarFallback>
                        {comment.author?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Link href={`/profile/${comment.authorId}`}>
                          <span className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">
                            {comment.author?.name}
                          </span>
                        </Link>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt!), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageCircle size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No comments yet</h3>
                  <p className="text-muted-foreground">
                    Be the first to share your thoughts on this article!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
