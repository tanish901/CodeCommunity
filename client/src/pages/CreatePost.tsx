import { useState } from "react";
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
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CreatePost() {
  const [, setLocation] = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("New post title here...");
  const [content, setContent] = useState("Write your post content here...");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [showTagInput, setShowTagInput] = useState(false);

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
      title: title,
      content: content,
      tags: tags,
      coverImage: coverImage,
      published: true,
    });
  };

  const handleSaveDraft = () => {
    createPostMutation.mutate({
      title: title,
      content: content,
      tags: tags,
      coverImage: coverImage,
      published: false,
    });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 4) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
      setShowTagInput(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const formatText = (format: string) => {
    // Basic text formatting - in a real app you'd use a proper rich text editor
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = selectedText;
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        break;
      case 'quote':
        formattedText = `> ${selectedText}`;
        break;
      case 'list':
        formattedText = `- ${selectedText}`;
        break;
      case 'numbered':
        formattedText = `1. ${selectedText}`;
        break;
      case 'heading':
        formattedText = `# ${selectedText}`;
        break;
    }
    
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
  };

  const handleImageUpload = () => {
    // In a real app, this would handle file upload
    const mockImageUrl = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop";
    setCoverImage(mockImageUrl);
    toast({
      title: "Image uploaded",
      description: "Cover image has been set",
    });
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
                      className="hover:bg-muted"
                    >
                      <ImageIcon size={16} />
                    </Button>
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
                    {tags.length < 4 && (
                      <div>
                        {showTagInput ? (
                          <div className="flex space-x-2">
                            <Input
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && addTag()}
                              placeholder="Add tag..."
                              className="flex-1"
                            />
                            <Button size="sm" onClick={addTag}>
                              Add
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowTagInput(true)}
                            className="w-full"
                          >
                            + Add Tag
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
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Eye size={16} className="text-muted-foreground" />
                      <span className="text-muted-foreground">Word count: {content.split(' ').length}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Settings size={16} className="text-muted-foreground" />
                      <span className="text-muted-foreground">Reading time: ~{Math.ceil(content.split(' ').length / 200)} min</span>
                    </div>
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