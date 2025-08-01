import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useAppSelector } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Bold, 
  Italic, 
  Link, 
  List, 
  ListOrdered, 
  Heading, 
  Quote, 
  Code, 
  Image as ImageIcon, 
  Zap, 
  MoreHorizontal,
  Upload,
  X,
  Eye,
  Settings,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CreatePost() {
  const [, setLocation] = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("New post title here...");
  const [content, setContent] = useState("Write your post content here...");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [showTagInput, setShowTagInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const createPostMutation = useMutation({
    mutationFn: async (data: any) => {
      // Create a mock article with a unique ID
      const mockArticle = {
        id: `article-${Date.now()}`,
        title: data.title,
        content: data.content,
        tags: data.tags,
        coverImage: data.coverImage,
        published: data.published,
        authorId: user?.id || "user-1",
        author: {
          id: user?.id || "user-1",
          username: user?.username || "sarahchen",
          name: user?.name || "Sarah Chen",
          avatar: user?.avatar || "https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=150&h=150&fit=crop&crop=face",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        comments: [],
      };

      // In a real app, this would be an API call
      // For now, we'll simulate the API response
      return Promise.resolve(mockArticle);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Success",
        description: "Your post has been published!",
      });
      // Redirect to the created article
      setLocation(`/article/${data.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    },
  });

  const handlePublish = () => {
    if (!title.trim() || title === "New post title here...") {
      toast({
        title: "Error",
        description: "Please add a title for your post",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim() || content === "Write your post content here...") {
      toast({
        title: "Error",
        description: "Please add content to your post",
        variant: "destructive",
      });
      return;
    }

    createPostMutation.mutate({
      title: title.trim(),
      content: content.trim(),
      tags,
      coverImage,
      published: true,
    });
  };

  const handleSaveDraft = () => {
    createPostMutation.mutate({
      title: title.trim(),
      content: content.trim(),
      tags,
      coverImage,
      published: false,
    });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
      setShowTagInput(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const formatText = (format: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let formattedText = "";
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'heading':
        formattedText = `# ${selectedText}`;
        break;
      case 'quote':
        formattedText = `> ${selectedText}`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
      case 'list':
        formattedText = `- ${selectedText}`;
        break;
      case 'numbered':
        formattedText = `1. ${selectedText}`;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        break;
      default:
        formattedText = selectedText;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image file size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // Simulate file upload
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCoverImage(result);
      setIsUploading(false);
      toast({
        title: "Success",
        description: "Cover image uploaded successfully!",
      });
    };
    reader.onerror = () => {
      setIsUploading(false);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Create Post</h1>
              <p className="text-muted-foreground mt-2">Share your knowledge with the community</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={createPostMutation.isPending}
                className="hover:shadow-md transition-shadow"
              >
                Save Draft
              </Button>
              <Button
                onClick={handlePublish}
                disabled={createPostMutation.isPending}
                className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                {createPostMutation.isPending ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Editor */}
            <div className="lg:col-span-3 space-y-6">
              {/* Title Input */}
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <Input
                    type="text"
                    placeholder="Enter your post title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-2xl font-bold border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  {/* Toolbar */}
                  <div className="flex items-center space-x-2 mb-4 p-2 bg-muted/50 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('bold')}
                      className="hover:bg-muted"
                    >
                      <Bold size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('italic')}
                      className="hover:bg-muted"
                    >
                      <Italic size={16} />
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('heading')}
                      className="hover:bg-muted"
                    >
                      <Heading size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('quote')}
                      className="hover:bg-muted"
                    >
                      <Quote size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('code')}
                      className="hover:bg-muted"
                    >
                      <Code size={16} />
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('list')}
                      className="hover:bg-muted"
                    >
                      <List size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('numbered')}
                      className="hover:bg-muted"
                    >
                      <ListOrdered size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('link')}
                      className="hover:bg-muted"
                    >
                      <Link size={16} />
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleImageUpload}
                      disabled={isUploading}
                      className="hover:bg-muted"
                    >
                      {isUploading ? (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <ImageIcon size={16} />
                      )}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Content Textarea */}
                  <Textarea
                    placeholder="Write your post content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[400px] border-0 bg-transparent p-0 text-lg leading-relaxed resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </CardContent>
              </Card>

              {/* Cover Image */}
              {coverImage && (
                <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="relative">
                      <img
                        src={coverImage}
                        alt="Cover"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCoverImage(null)}
                        className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Tags */}
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Tags</h3>
                  <div className="space-y-3">
                    {tags.map((tag) => (
                      <div key={tag} className="flex items-center justify-between">
                        <Badge variant="secondary">{tag}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTag(tag)}
                          className="h-6 w-6 p-0"
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    ))}
                    {tags.length < 5 && (
                      <div>
                        {showTagInput ? (
                          <div className="flex space-x-2">
                            <Input
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              placeholder="Add tag..."
                              className="flex-1"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addTag();
                                }
                              }}
                            />
                            <Button size="sm" onClick={addTag}>
                              Add
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setShowTagInput(false);
                                setNewTag("");
                              }}
                            >
                              <X size={12} />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowTagInput(true)}
                            className="w-full"
                          >
                            <Plus size={16} className="mr-2" />
                            Add Tag
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Preview</h3>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      <p><strong>Title:</strong> {title}</p>
                      <p><strong>Content:</strong> {content.length} characters</p>
                      <p><strong>Tags:</strong> {tags.length} tags</p>
                      {coverImage && <p><strong>Cover Image:</strong> ✓</p>}
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye size={16} className="mr-2" />
                      Preview Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}