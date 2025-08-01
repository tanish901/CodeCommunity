import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { logout } from "@/store/authSlice";
import { setSearchQuery } from "@/store/articlesSlice";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, Bell, Code, ChevronDown } from "lucide-react";
import CreatePostModal from "./CreatePostModal";

export default function Navigation() {
  const { user } = useAppSelector((state) => state.auth);
  const { searchQuery } = useAppSelector((state) => state.articles);
  const dispatch = useAppDispatch();
  const [, setLocation] = useLocation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setLocation("/login");
  };

  const handleSearch = (value: string) => {
    dispatch(setSearchQuery(value));
  };

  return (
    <>
      <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                  <Code className="text-primary-foreground" size={20} />
                </div>
                <span className="text-xl font-bold text-foreground tracking-tight">CodeCommunity</span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="text"
                  placeholder="Search articles, tags, users..."
                  className={`pl-12 h-11 bg-muted/50 border-0 rounded-full transition-all duration-300 ${
                    isSearchFocused 
                      ? "bg-background shadow-xl ring-2 ring-primary/20 scale-105" 
                      : "hover:bg-muted/70"
                  }`}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
            </div>

            {/* Blur Overlay for Search Focus */}
            {isSearchFocused && (
              <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 pointer-events-none"
                style={{ zIndex: 10 }}
              />
            )}

            {/* Right Navigation */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setLocation('/create')}
                className="bg-primary hover:bg-primary/90 shadow-lg rounded-full px-6 hover:shadow-xl transition-all duration-200 hover:scale-105"
                size="sm"
              >
                <Plus size={16} className="mr-2" />
                Create Post
              </Button>

              <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 relative">
                    <Bell size={18} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-3">Notifications</h3>
                    <div className="space-y-3">
                      <div 
                        className="text-sm p-3 bg-muted/50 rounded-lg hover:bg-muted/70 cursor-pointer transition-colors"
                        onClick={() => {
                          setLocation('/article/54c22c14-d797-4417-a4e6-c4e68398b20b');
                          setShowNotifications(false);
                        }}
                      >
                        <p className="font-medium">New comment on your article</p>
                        <p className="text-muted-foreground text-xs mt-1">Someone commented on "Getting Started with React 18"</p>
                        <p className="text-muted-foreground text-xs mt-1">2 hours ago</p>
                      </div>
                      <div 
                        className="text-sm p-3 bg-muted/50 rounded-lg hover:bg-muted/70 cursor-pointer transition-colors"
                        onClick={() => {
                          setLocation('/article/54c22c14-d797-4417-a4e6-c4e68398b20b');
                          setShowNotifications(false);
                        }}
                      >
                        <p className="font-medium">Your article was liked</p>
                        <p className="text-muted-foreground text-xs mt-1">Alex Kim liked your article about CSS techniques</p>
                        <p className="text-muted-foreground text-xs mt-1">5 hours ago</p>
                      </div>
                      <div 
                        className="text-sm p-3 bg-muted/50 rounded-lg hover:bg-muted/70 cursor-pointer transition-colors"
                        onClick={() => {
                          setLocation('/profile/sarahchen');
                          setShowNotifications(false);
                        }}
                      >
                        <p className="font-medium">New follower</p>
                        <p className="text-muted-foreground text-xs mt-1">Sarah Chen started following you</p>
                        <p className="text-muted-foreground text-xs mt-1">1 day ago</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-2 border-t">
                      <Button 
                        variant="ghost" 
                        className="w-full text-xs"
                        onClick={() => {
                          setLocation('/notifications');
                          setShowNotifications(false);
                        }}
                      >
                        View all notifications
                      </Button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 rounded-full pr-2">
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={user?.avatar || ""} alt={user?.username} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown size={14} className="text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${user?.id}`}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <CreatePostModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </>
  );
}
