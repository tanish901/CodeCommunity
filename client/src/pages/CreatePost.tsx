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
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Success",
        description: "Your post has been published!",
      });
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
      case 'heading':
        formattedText = `## ${selectedText}`;
        break;
      case 'quote':
        formattedText = `> ${selectedText}`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        break;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setLocation("/")}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Back to Home
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="hover:shadow-md transition-shadow">
                <Eye size={16} className="mr-2" />
                Preview
              </Button>
              <Button variant="outline" className="hover:shadow-md transition-shadow">
                <Settings size={16} className="mr-2" />
                Settings
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Main Editor */}
            <div className="col-span-12 lg:col-span-8">
              <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0">
                  {/* Cover Image Section */}
                  <div className="p-6 border-b">
                    <Button
                      variant="outline"
                      className="w-auto hover:shadow-md transition-all duration-200 hover:scale-105"
                      onClick={() => {
                        // In a real app, this would open a file picker
                        setCoverImage("https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800");
                      }}
                    >
                      <Upload size={16} className="mr-2" />
                      Add a cover image
                    </Button>
                    {coverImage && (
                      <div className="mt-4 relative">
                        <img
                          src={coverImage}
                          alt="Cover"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setCoverImage(null)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Title Section */}
                  <div className="p-6 border-b">
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-4xl font-bold border-0 p-0 focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/50"
                      placeholder="New post title here..."
                      onFocus={(e) => {
                        if (e.target.value === "New post title here...") {
                          setTitle("");
                        }
                      }}
                    />
                    
                    {/* Tags Section */}
                    <div className="mt-6">
                      <div className="flex items-center flex-wrap gap-2 mb-3">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="px-3 py-1 hover:shadow-md transition-shadow cursor-pointer"
                          >
                            #{tag}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 ml-2 hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => removeTag(tag)}
                            >
                              <X size={12} />
                            </Button>
                          </Badge>
                        ))}
                        {tags.length < 4 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => setShowTagInput(true)}
                          >
                            Add up to 4 tags...
                          </Button>
                        )}
                      </div>
                      {showTagInput && (
                        <div className="flex items-center space-x-2">
                          <Input
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Enter tag name"
                            className="max-w-xs"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                addTag();
                              }
                            }}
                          />
                          <Button size="sm" onClick={addTag}>Add</Button>
                          <Button size="sm" variant="ghost" onClick={() => setShowTagInput(false)}>Cancel</Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Toolbar */}
                  <div className="p-4 border-b bg-muted/20">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => formatText('bold')}
                        className="hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Bold size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => formatText('italic')}
                        className="hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Italic size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => formatText('link')}
                        className="hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Link size={16} />
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => formatText('heading')}
                        className="hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Heading size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => formatText('quote')}
                        className="hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Quote size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => formatText('code')}
                        className="hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Code size={16} />
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <List size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <ListOrdered size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <ImageIcon size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Zap size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <MoreHorizontal size={16} />
                      </Button>
                    </div>
                  </div>

                  {/* Content Editor */}
                  <div className="p-6">
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[400px] border-0 p-0 focus-visible:ring-0 bg-transparent resize-none text-lg leading-relaxed placeholder:text-muted-foreground/50"
                      placeholder="Write your post content here..."
                      onFocus={(e) => {
                        if (e.target.value === "Write your post content here...") {
                          setContent("");
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={handlePublish}
                    disabled={createPostMutation.isPending}
                    className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    {createPostMutation.isPending ? "Publishing..." : "Publish"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={createPostMutation.isPending}
                    className="hover:shadow-md transition-shadow"
                  >
                    Save draft
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Settings size={16} />
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-4">
              <div className="space-y-6 sticky top-24">
                {/* Writing Tips */}
                <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 text-primary">Writing Tips</h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>• Use clear, descriptive titles</p>
                      <p>• Add relevant tags to reach your audience</p>
                      <p>• Include code examples when applicable</p>
                      <p>• Break up long text with headings</p>
                      <p>• Proofread before publishing</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Preview Card */}
                <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 text-primary">Post Preview</h3>
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm line-clamp-2">{title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {content.substring(0, 100)}...
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}