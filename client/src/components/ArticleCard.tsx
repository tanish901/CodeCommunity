import { useState } from "react";
import { Link } from "wouter";
import { useAppSelector, useAppDispatch } from "@/store";
import { toggleLike } from "@/store/articlesSlice";
import { ArticleWithAuthor } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Clock, Bookmark } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ArticleCardProps {
  article: ArticleWithAuthor;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      dispatch(toggleLike({ articleId: article.id, userId: user.id }));
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsBookmarked(!isBookmarked);
    // TODO: Implement bookmark functionality
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

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card fade-in">
      {article.coverImage && (
        <div className="w-full h-52 overflow-hidden rounded-t-xl">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardContent className="p-8">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="w-12 h-12">
            <AvatarImage src={article.author.avatar || ""} alt={article.author.username} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {article.author.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{article.author.username}</p>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(article.createdAt!), { addSuffix: true })}
            </p>
          </div>
        </div>

        <Link href={`/article/${article.id}`}>
          <h2 className="text-2xl font-bold mb-4 text-foreground hover:text-primary cursor-pointer line-clamp-2 transition-colors">
            {article.title}
          </h2>
        </Link>

        {article.excerpt && (
          <p className="text-muted-foreground mb-6 line-clamp-2 text-lg leading-relaxed">{article.excerpt}</p>
        )}

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {article.tags.slice(0, 3).map((tag: string) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="px-3 py-1 rounded-full text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-2 hover:text-red-500 transition-colors rounded-full ${
                article.isLiked ? "text-red-500" : ""
              }`}
            >
              <Heart size={18} className={article.isLiked ? "fill-red-500" : ""} />
              <span className="font-medium">{article.likes || 0}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 hover:text-blue-500 transition-colors rounded-full"
            >
              <MessageCircle size={18} />
              <span className="font-medium">{article.commentsCount || 0}</span>
            </Button>
            
            <span className="flex items-center space-x-2">
              <Clock size={18} />
              <span className="font-medium">{Math.ceil((article.content?.length || 0) / 200)} min read</span>
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={`text-muted-foreground hover:text-foreground transition-colors rounded-full ${
              isBookmarked ? "text-primary" : ""
            }`}
          >
            <Bookmark size={18} className={isBookmarked ? "fill-current" : ""} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
