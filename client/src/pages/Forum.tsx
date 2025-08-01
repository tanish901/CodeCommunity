import { useState } from "react";
import { useParams } from "wouter";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Reply, 
  Share, 
  Flag,
  User,
  Calendar,
  Eye,
  ArrowLeft
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
  views: number;
  likes: number;
  dislikes: number;
  comments: Comment[];
}

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
  likes: number;
  dislikes: number;
  replies: Comment[];
}

const mockForumPosts: Record<string, ForumPost> = {
  "best-practices-code-reviews": {
    id: "best-practices-code-reviews",
    title: "Best practices for code reviews?",
    content: "I'm looking to improve our code review process at my company. What are some best practices you've found effective? I'm particularly interested in:\n\n- How to structure feedback\n- What to look for during reviews\n- Tools that help streamline the process\n- How to handle disagreements\n\nAny tips or resources would be greatly appreciated!",
    author: {
      id: "user-1",
      name: "Sarah Chen",
      username: "sarahchen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=150&h=150&fit=crop&crop=face",
    },
    createdAt: "2024-01-15T10:30:00Z",
    views: 1247,
    likes: 23,
    dislikes: 2,
    comments: [
      {
        id: "comment-1",
        content: "Great question! I've found that having a checklist helps a lot. We use a template that covers:\n\n- Code quality and standards\n- Security considerations\n- Performance implications\n- Documentation updates\n\nThis ensures nothing gets missed.",
        author: {
          id: "user-2",
          name: "Michael Rodriguez",
          username: "michaelr",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        },
        createdAt: "2024-01-15T11:15:00Z",
        likes: 8,
        dislikes: 0,
        replies: [],
      },
      {
        id: "comment-2",
        content: "I recommend using tools like GitHub's review features or GitLab's merge request system. They make it easy to leave inline comments and track changes.",
        author: {
          id: "user-3",
          name: "Alex Kim",
          username: "alexkim",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        },
        createdAt: "2024-01-15T12:00:00Z",
        likes: 5,
        dislikes: 1,
        replies: [],
      },
    ],
  },
  "favorite-development-tools-2024": {
    id: "favorite-development-tools-2024",
    title: "Favorite development tools in 2024",
    content: "What are your go-to development tools this year? I'm always looking to discover new tools that can improve my workflow. Currently using:\n\n- VS Code with various extensions\n- Docker for containerization\n- Postman for API testing\n- Git for version control\n\nWhat tools have you found most valuable?",
    author: {
      id: "user-2",
      name: "Michael Rodriguez",
      username: "michaelr",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    createdAt: "2024-01-10T14:20:00Z",
    views: 2156,
    likes: 34,
    dislikes: 3,
    comments: [
      {
        id: "comment-3",
        content: "I've been loving Cursor AI for code completion and GitHub Copilot for pair programming. They've significantly improved my productivity.",
        author: {
          id: "user-1",
          name: "Sarah Chen",
          username: "sarahchen",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=150&h=150&fit=crop&crop=face",
        },
        createdAt: "2024-01-10T15:30:00Z",
        likes: 12,
        dislikes: 0,
        replies: [],
      },
      {
        id: "comment-4",
        content: "For debugging, I've found Chrome DevTools and React Developer Tools to be indispensable. Also, Figma for design collaboration has been great.",
        author: {
          id: "user-3",
          name: "Alex Kim",
          username: "alexkim",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        },
        createdAt: "2024-01-10T16:45:00Z",
        likes: 7,
        dislikes: 0,
        replies: [],
      },
    ],
  },
};

export default function Forum() {
  const { slug } = useParams<{ slug: string }>();
  const [newComment, setNewComment] = useState("");
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);

  const forumPost = mockForumPosts[slug || ""];

  if (!forumPost) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <MessageSquare size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Forum post not found</h3>
              <p className="text-muted-foreground">The forum post you're looking for doesn't exist.</p>
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

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    // In a real app, this would add the comment to the database
    console.log("Adding comment:", newComment);
    setNewComment("");
  };

  const handleReply = (commentId: string) => {
    setShowReplyForm(showReplyForm === commentId ? null : commentId);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Button>
          </Link>

          {/* Forum Post */}
          <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={forumPost.author.avatar} alt={forumPost.author.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {forumPost.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{forumPost.title}</h1>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                      <span>by {forumPost.author.name}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(forumPost.createdAt), { addSuffix: true })}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Eye size={14} />
                        <span>{forumPost.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Flag size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none mb-6">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{forumPost.content}</p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-4 pt-4 border-t">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ThumbsUp size={16} />
                  <span>{forumPost.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ThumbsDown size={16} />
                  <span>{forumPost.dislikes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Reply size={16} />
                  <span>Reply</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Share size={16} />
                  <span>Share</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Comments ({forumPost.comments.length})</h2>
            </div>

            {/* Add Comment */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=150&h=150&fit=crop&crop=face" />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      S
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                    <div className="flex justify-end mt-3">
                      <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments List */}
            <div className="space-y-6">
              {forumPost.comments.map((comment) => (
                <Card key={comment.id} className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {comment.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-foreground">{comment.author.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <div className="prose prose-sm max-w-none mb-4">
                          <p className="text-foreground leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                        </div>
                        
                        {/* Comment Actions */}
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                            <ThumbsUp size={14} />
                            <span>{comment.likes}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                            <ThumbsDown size={14} />
                            <span>{comment.dislikes}</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center space-x-2"
                            onClick={() => handleReply(comment.id)}
                          >
                            <Reply size={14} />
                            <span>Reply</span>
                          </Button>
                        </div>

                        {/* Reply Form */}
                        {showReplyForm === comment.id && (
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex items-start space-x-4">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=150&h=150&fit=crop&crop=face" />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  S
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <Textarea
                                  placeholder="Write a reply..."
                                  className="min-h-[80px] resize-none"
                                />
                                <div className="flex justify-end mt-2 space-x-2">
                                  <Button variant="ghost" size="sm" onClick={() => setShowReplyForm(null)}>
                                    Cancel
                                  </Button>
                                  <Button size="sm">
                                    Reply
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}