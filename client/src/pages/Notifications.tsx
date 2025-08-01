import { useState } from "react";
import { useAppSelector } from "@/store";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, UserPlus, Eye, MoreHorizontal } from "lucide-react";

// Sample notification data - in a real app this would come from an API
const sampleNotifications = [
  {
    id: "1",
    type: "like",
    title: "Your article was liked",
    message: "Alex Kim liked your article",
    articleTitle: "Getting Started with React 18: A Complete Guide",
    articleId: "54c22c14-d797-4417-a4e6-c4e68398b20b",
    timestamp: "2 hours ago",
    read: false,
    avatar: "",
    username: "alexkim"
  },
  {
    id: "2",
    type: "comment",
    title: "New comment on your article",
    message: "Sarah Chen commented on your article",
    articleTitle: "CSS Grid vs Flexbox: When to Use Which",
    articleId: "54c22c14-d797-4417-a4e6-c4e68398b20b",
    timestamp: "5 hours ago",
    read: false,
    avatar: "",
    username: "sarahchen"
  },
  {
    id: "3",
    type: "follow",
    title: "New follower",
    message: "Mike Johnson started following you",
    timestamp: "1 day ago",
    read: true,
    avatar: "",
    username: "mikejohnson"
  },
  {
    id: "4",
    type: "like",
    title: "Your article was liked",
    message: "Emma Davis liked your article",
    articleTitle: "Advanced TypeScript Patterns",
    articleId: "54c22c14-d797-4417-a4e6-c4e68398b20b",
    timestamp: "2 days ago",
    read: true,
    avatar: "",
    username: "emmadavis"
  },
  {
    id: "5",
    type: "comment",
    title: "New comment on your article",
    message: "John Smith replied to your comment",
    articleTitle: "Building Scalable React Applications",
    articleId: "54c22c14-d797-4417-a4e6-c4e68398b20b",
    timestamp: "3 days ago",
    read: true,
    avatar: "",
    username: "johnsmith"
  }
];

export default function Notifications() {
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={16} className="text-red-500" />;
      case 'comment':
        return <MessageCircle size={16} className="text-blue-500" />;
      case 'follow':
        return <UserPlus size={16} className="text-green-500" />;
      default:
        return <Eye size={16} className="text-gray-500" />;
    }
  };

  const handleNotificationClick = (notification: typeof sampleNotifications[0]) => {
    if (notification.articleId) {
      setLocation(`/article/${notification.articleId}`);
    } else if (notification.type === 'follow') {
                                setLocation(`/author/${notification.username}`);
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? sampleNotifications.filter(n => !n.read)
    : sampleNotifications;

  const unreadCount = sampleNotifications.filter(n => !n.read).length;

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Notifications</CardTitle>
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {unreadCount} unread
                </Badge>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={filter === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('all')}
                    className="rounded-full"
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === 'unread' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('unread')}
                    className="rounded-full"
                  >
                    Unread
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Eye size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-muted-foreground">
                  {filter === 'unread' ? "You're all caught up!" : "No notifications yet."}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-6 hover:bg-muted/30 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={notification.avatar} alt={notification.username} />
                        <AvatarFallback className="bg-muted">
                          {notification.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2 mb-1">
                            {getNotificationIcon(notification.type)}
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {notification.timestamp}
                          </span>
                        </div>
                        
                        <p className="text-sm text-foreground mb-2">
                          {notification.message}
                        </p>
                        
                        {notification.articleTitle && (
                          <div className="bg-muted/50 rounded-lg p-3 mt-2">
                            <p className="text-sm font-medium text-foreground">
                              "{notification.articleTitle}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}