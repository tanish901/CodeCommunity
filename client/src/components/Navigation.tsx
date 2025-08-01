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
                  className="pl-12 h-11 bg-muted/50 border-0 rounded-full focus:bg-background focus:ring-2 focus:ring-primary/20"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-primary hover:bg-primary/90 shadow-lg rounded-full px-6"
                size="sm"
              >
                <Plus size={16} className="mr-2" />
                Create Post
              </Button>

              <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0">
                <Bell size={18} />
              </Button>

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
