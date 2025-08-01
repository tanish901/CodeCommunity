import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector, useAppDispatch } from "@/store";
import { fetchArticles } from "@/store/articlesSlice";
import { followUser, unfollowUser } from "@/store/authSlice";
import { updateProfile } from "@/store/usersSlice";
import Layout from "@/components/Layout";
import ArticleCard from "@/components/ArticleCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { User } from "@shared/schema";
import { 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  UserPlus, 
  Mail, 
  Briefcase, 
  User as UserIcon, 
  Heart,
  MessageCircle,
  BookOpen,
  Eye,
  Trophy,
  Star,
  Github,
  Twitter,
  Globe,
  CheckCircle,
  Users,
  Edit,
  Save,
  X
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, following } = useAppSelector((state) => state.auth);
  const { articles, loading } = useAppSelector((state) => state.articles);
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    bio: "",
    location: "",
    website: "",
    github: "",
    twitter: "",
    profession: "",
    company: "",
    age: "",
    gender: "",
  });



  // Fetch user profile from localStorage
  const { data: profileUser, isLoading: userLoading } = useQuery({
    queryKey: ["user", id],
    enabled: !!id,
    queryFn: async () => {
      const { storage } = await import("@/lib/localStorage");
      const user = await storage.getUser(id);
      if (!user) return null;
      
      // Enhance user data with additional profile details
      return {
        ...user,
        age: 28,
        gender: "Female",
        profession: "Senior Frontend Developer",
        company: "TechCorp",
        location: user.location || "San Francisco, CA",
        bio: user.bio || "Passionate developer with experience building scalable web applications.",
        avatar: user.avatar || "https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=150&h=150&fit=crop&crop=face",
        website: "https://example.dev",
        github: "username",
        twitter: "username_dev",
        joinedDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : "2022-03-15",
        followers: 1284,
        following: 456,
        skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Docker"],
        achievements: ["Top Contributor", "Featured Author", "Community Leader"],
      };
    },
  });

  // Fetch user's articles
  useEffect(() => {
    if (id) {
      dispatch(fetchArticles({ authorId: id, published: true }));
    }
  }, [dispatch, id]);

  // Initialize edit form when profile loads
  useEffect(() => {
    if (profileUser) {
      setEditForm({
        name: profileUser.name || "",
        bio: profileUser.bio || "",
        location: profileUser.location || "",
        website: profileUser.website || "",
        github: profileUser.github || "",
        twitter: profileUser.twitter || "",
        profession: profileUser.profession || "",
        company: profileUser.company || "",
        age: profileUser.age?.toString() || "",
        gender: profileUser.gender || "",
      });
    }
  }, [profileUser]);

  const userArticles = articles.filter(article => article.authorId === id);
  const totalViews = userArticles.reduce((sum, article) => sum + (article.views || 0), 0);
  const totalLikes = userArticles.reduce((sum, article) => sum + (article.likes || 0), 0);

  const handleFollow = () => {
    if (!profileUser) return;
    
    if (following.includes(profileUser.id)) {
      dispatch(unfollowUser(profileUser.id));
    } else {
      dispatch(followUser(profileUser.id));
    }
  };

  const handleSaveProfile = () => {
    if (!profileUser) return;

    dispatch(updateProfile({
      id: profileUser.id,
      updates: {
        name: editForm.name,
        bio: editForm.bio,
        location: editForm.location,
        website: editForm.website,
        github: editForm.github,
        twitter: editForm.twitter,
        profession: editForm.profession,
        company: editForm.company,
        age: editForm.age ? parseInt(editForm.age) : undefined,
        gender: editForm.gender,
      }
    }));

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    if (profileUser) {
      setEditForm({
        name: profileUser.name || "",
        bio: profileUser.bio || "",
        location: profileUser.location || "",
        website: profileUser.website || "",
        github: profileUser.github || "",
        twitter: profileUser.twitter || "",
        profession: profileUser.profession || "",
        company: profileUser.company || "",
        age: profileUser.age?.toString() || "",
        gender: profileUser.gender || "",
      });
    }
    setIsEditing(false);
  };

  if (userLoading) {
    return (
      <Layout>
        <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
                <Skeleton className="w-32 h-32 rounded-full" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-10 w-64" />
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full max-w-lg" />
                </div>
                <Skeleton className="h-12 w-32" />
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!profileUser) {
    return (
      <Layout>
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <UserIcon size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">User not found</h3>
              <p className="text-muted-foreground">The profile you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const isOwnProfile = currentUser?.id === profileUser.id;
  const isFollowing = following.includes(profileUser.id);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
          {/* Profile Header */}
          <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-primary/20 shadow-lg">
                    <AvatarImage src={profileUser.avatar} alt={profileUser.name} />
                    <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                      {profileUser.name?.charAt(0).toUpperCase() || profileUser.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {profileUser.achievements?.includes("Top Contributor") && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-2">
                      <Trophy size={16} className="text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h1 className="text-4xl font-bold">{profileUser.name}</h1>
                        {profileUser.achievements?.includes("Featured Author") && (
                          <CheckCircle size={24} className="text-blue-500" />
                        )}
                      </div>
                      <p className="text-xl text-muted-foreground">@{profileUser.username}</p>
                    </div>
                    
                    {isOwnProfile && (
                      <Dialog open={isEditing} onOpenChange={setIsEditing}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center space-x-2">
                            <Edit size={16} />
                            <span>Edit Profile</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                            <DialogDescription>
                              Update your profile information and preferences.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Name</Label>
                              <Input
                                id="name"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="profession">Profession</Label>
                              <Input
                                id="profession"
                                value={editForm.profession}
                                onChange={(e) => setEditForm({ ...editForm, profession: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="company">Company</Label>
                              <Input
                                id="company"
                                value={editForm.company}
                                onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="location">Location</Label>
                              <Input
                                id="location"
                                value={editForm.location}
                                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="age">Age</Label>
                              <Input
                                id="age"
                                type="number"
                                value={editForm.age}
                                onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="gender">Gender</Label>
                              <Input
                                id="gender"
                                value={editForm.gender}
                                onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label htmlFor="bio">Bio</Label>
                              <Textarea
                                id="bio"
                                value={editForm.bio}
                                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                rows={3}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="website">Website</Label>
                              <Input
                                id="website"
                                value={editForm.website}
                                onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="github">GitHub</Label>
                              <Input
                                id="github"
                                value={editForm.github}
                                onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="twitter">Twitter</Label>
                              <Input
                                id="twitter"
                                value={editForm.twitter}
                                onChange={(e) => setEditForm({ ...editForm, twitter: e.target.value })}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={handleCancelEdit}>
                              <X size={16} className="mr-2" />
                              Cancel
                            </Button>
                            <Button onClick={handleSaveProfile}>
                              <Save size={16} className="mr-2" />
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1">
                      <Users size={16} className="text-muted-foreground" />
                      <span className="font-semibold">{profileUser.followers}</span>
                      <span className="text-muted-foreground">followers</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold">{profileUser.following}</span>
                      <span className="text-muted-foreground">following</span>
                    </div>
                  </div>
                  
                  <p className="text-foreground leading-relaxed max-w-2xl">
                    {profileUser.bio}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Briefcase size={16} />
                      <span>{profileUser.profession} at {profileUser.company}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <MapPin size={16} />
                      <span>{profileUser.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar size={16} />
                      <span>Joined {formatDistanceToNow(new Date(profileUser.joinedDate), { addSuffix: true })}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {profileUser.website && (
                      <a
                        href={profileUser.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                      >
                        <Globe size={16} />
                        <span>Website</span>
                      </a>
                    )}
                    {profileUser.github && (
                      <a
                        href={`https://github.com/${profileUser.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github size={16} />
                        <span>GitHub</span>
                      </a>
                    )}
                    {profileUser.twitter && (
                      <a
                        href={`https://twitter.com/${profileUser.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Twitter size={16} />
                        <span>Twitter</span>
                      </a>
                    )}
                  </div>
                </div>
                
                {!isOwnProfile && (
                  <div className="flex flex-col space-y-3">
                    <Button
                      onClick={handleFollow}
                      className={`shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 ${
                        isFollowing 
                          ? "bg-muted text-foreground hover:bg-muted/80" 
                          : "bg-primary hover:bg-primary/90"
                      }`}
                    >
                      <UserPlus size={16} className="mr-2" />
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                    <Button variant="outline" className="hover:shadow-md transition-shadow">
                      <Mail size={16} className="mr-2" />
                      Message
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Details */}
            <div className="lg:col-span-1 space-y-6">
              {/* Personal Info */}
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserIcon size={20} />
                    <span>Personal Info</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Age</span>
                    <p className="font-medium">{profileUser.age} years old</p>
                  </div>
                  <Separator />
                  <div>
                    <span className="text-sm text-muted-foreground">Gender</span>
                    <p className="font-medium">{profileUser.gender}</p>
                  </div>
                  <Separator />
                  <div>
                    <span className="text-sm text-muted-foreground">Email</span>
                    <p className="font-medium">{isOwnProfile ? profileUser.email : "Private"}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star size={20} />
                    <span>Skills</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profileUser.skills?.map((skill) => (
                      <Badge key={skill} variant="secondary" className="hover:shadow-md transition-shadow">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy size={20} />
                    <span>Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profileUser.achievements?.map((achievement) => (
                      <div key={achievement} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                          <Trophy size={16} className="text-yellow-600" />
                        </div>
                        <span className="font-medium">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="articles" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm">
                  <TabsTrigger value="articles" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Articles ({userArticles.length})
                  </TabsTrigger>
                  <TabsTrigger value="stats" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Statistics
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Activity
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="articles" className="space-y-6">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <Card key={index} className="border-0 shadow-lg">
                        <CardContent className="p-6">
                          <Skeleton className="h-6 w-3/4 mb-4" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                      </Card>
                    ))
                  ) : userArticles.length > 0 ? (
                    userArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))
                  ) : (
                    <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-12 text-center">
                        <BookOpen size={64} className="mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No articles yet</h3>
                        <p className="text-muted-foreground">
                          {isOwnProfile ? "Start writing your first article!" : "This user hasn't published any articles yet."}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="stats">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-shadow">
                      <CardContent className="p-6 text-center">
                        <Eye size={32} className="mx-auto text-blue-500 mb-3" />
                        <p className="text-3xl font-bold mb-1">{totalViews.toLocaleString()}</p>
                        <p className="text-muted-foreground">Total Views</p>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-shadow">
                      <CardContent className="p-6 text-center">
                        <Heart size={32} className="mx-auto text-red-500 mb-3" />
                        <p className="text-3xl font-bold mb-1">{totalLikes.toLocaleString()}</p>
                        <p className="text-muted-foreground">Total Likes</p>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-shadow">
                      <CardContent className="p-6 text-center">
                        <BookOpen size={32} className="mx-auto text-green-500 mb-3" />
                        <p className="text-3xl font-bold mb-1">{userArticles.length}</p>
                        <p className="text-muted-foreground">Articles Published</p>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-shadow">
                      <CardContent className="p-6 text-center">
                        <MessageCircle size={32} className="mx-auto text-purple-500 mb-3" />
                        <p className="text-3xl font-bold mb-1">248</p>
                        <p className="text-muted-foreground">Comments Received</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="activity">
                  <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <Calendar size={64} className="mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Activity Timeline</h3>
                      <p className="text-muted-foreground">Recent activity and contributions will appear here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
