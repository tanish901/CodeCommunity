import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector, useAppDispatch } from "@/store";
import { fetchArticles } from "@/store/articlesSlice";
import { followUser, unfollowUser } from "@/store/authSlice";
import { updateProfile } from "@/store/usersSlice";
import { getUserByUsername, getUserById } from "@/lib/userService";
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

  // Fetch user profile data
  const { data: profileUser, isLoading: userLoading } = useQuery({
    queryKey: ["user-profile", id],
    enabled: !!id,
    queryFn: () => {
      // Try to get user by ID first, then by username
      const userById = getUserById(id || "");
      if (userById) return userById;
      
      const userByUsername = getUserByUsername(id || "");
      if (userByUsername) return userByUsername;
      
      // If not found by username, try to get current user's profile
      if (currentUser && currentUser.id === id) {
        return {
          id: currentUser.id,
          username: currentUser.username,
          name: currentUser.name || currentUser.username,
          email: currentUser.email,
          bio: currentUser.bio || "No bio available",
          avatar: currentUser.avatar,
          location: currentUser.location || "Location not set",
          website: currentUser.website || "",
          github: currentUser.github || "",
          twitter: currentUser.twitter || "",
          profession: currentUser.profession || "",
          company: currentUser.company || "",
          age: currentUser.age || 0,
          gender: currentUser.gender || "",
          joinedDate: currentUser.createdAt?.toISOString() || new Date().toISOString(),
          followers: 0,
          following: 0,
          totalViews: 0,
          totalLikes: 0,
          articlesCount: 0,
          achievements: [],
          skills: [],
          isVerified: false,
        };
      }
      
      // Return null if user not found
      return null;
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
    if (!profileUser || !currentUser) return;
    
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
                    
                    {isOwnProfile ? (
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
                            <div className="col-span-2 space-y-2">
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
                              Cancel
                            </Button>
                            <Button onClick={handleSaveProfile}>
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Button
                        onClick={handleFollow}
                        variant={isFollowing ? "outline" : "default"}
                        className="flex items-center space-x-2"
                      >
                        <UserPlus size={16} />
                        <span>{isFollowing ? "Following" : "Follow"}</span>
                      </Button>
                    )}
                  </div>

                  {profileUser.bio && (
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {profileUser.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {profileUser.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} />
                        <span>{profileUser.location}</span>
                      </div>
                    )}
                    {profileUser.website && (
                      <div className="flex items-center space-x-1">
                        <Globe size={14} />
                        <a href={profileUser.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                          {profileUser.website}
                        </a>
                      </div>
                    )}
                    {profileUser.joinedDate && (
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>Joined {formatDistanceToNow(new Date(profileUser.joinedDate), { addSuffix: true })}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats and Social Links */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen size={16} className="text-muted-foreground" />
                      <span className="text-sm">Articles</span>
                    </div>
                    <span className="font-semibold">{userArticles.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye size={16} className="text-muted-foreground" />
                      <span className="text-sm">Total Views</span>
                    </div>
                    <span className="font-semibold">{totalViews.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart size={16} className="text-muted-foreground" />
                      <span className="text-sm">Total Likes</span>
                    </div>
                    <span className="font-semibold">{totalLikes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users size={16} className="text-muted-foreground" />
                      <span className="text-sm">Followers</span>
                    </div>
                    <span className="font-semibold">{profileUser.followers?.toLocaleString() || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            {(profileUser.github || profileUser.twitter || profileUser.website) && (
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Social</h3>
                  <div className="space-y-3">
                    {profileUser.github && (
                      <a
                        href={`https://github.com/${profileUser.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm hover:text-primary transition-colors"
                      >
                        <Github size={16} />
                        <span>@{profileUser.github}</span>
                      </a>
                    )}
                    {profileUser.twitter && (
                      <a
                        href={`https://twitter.com/${profileUser.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm hover:text-primary transition-colors"
                      >
                        <Twitter size={16} />
                        <span>@{profileUser.twitter}</span>
                      </a>
                    )}
                    {profileUser.website && (
                      <a
                        href={profileUser.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm hover:text-primary transition-colors"
                      >
                        <Globe size={16} />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {profileUser.skills && profileUser.skills.length > 0 && (
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileUser.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Articles */}
          <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Articles</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex space-x-4">
                      <Skeleton className="w-24 h-24 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : userArticles.length > 0 ? (
                <div className="space-y-6">
                  {userArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
                  <p className="text-muted-foreground">
                    {isOwnProfile 
                      ? "Start writing your first article to share your knowledge with the community."
                      : "This user hasn't published any articles yet."
                    }
                  </p>
                  {isOwnProfile && (
                    <Button className="mt-4" onClick={() => window.location.href = '/create'}>
                      Write Your First Article
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
