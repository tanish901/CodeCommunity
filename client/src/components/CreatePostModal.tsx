import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { createArticle } from "@/store/articlesSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
  const { user } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.articles);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    coverImage: "",
    published: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const tagsArray = formData.tags
      .split(",")
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0);

    try {
      await dispatch(createArticle({
        title: formData.title,
        content: formData.content,
        excerpt: formData.content.substring(0, 200) + "...",
        tags: tagsArray,
        coverImage: formData.coverImage || undefined,
        authorId: user.id,
        published: formData.published,
      })).unwrap();

      toast({
        title: "Success",
        description: `Article ${formData.published ? "published" : "saved as draft"} successfully!`,
      });

      // Reset form and close modal
      setFormData({
        title: "",
        content: "",
        tags: "",
        coverImage: "",
        published: false,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create article. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveAsDraft = () => {
    setFormData(prev => ({ ...prev, published: false }));
    handleSubmit(new Event("submit") as any);
  };

  const handlePublish = () => {
    setFormData(prev => ({ ...prev, published: true }));
    handleSubmit(new Event("submit") as any);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter your article title..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="coverImage">Cover Image URL (optional)</Label>
            <Input
              id="coverImage"
              placeholder="https://example.com/image.jpg"
              value={formData.coverImage}
              onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="javascript, react, webdev (separated by commas)"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your article content..."
              rows={12}
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              required
              className="resize-none"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveAsDraft}
              disabled={loading || !formData.title || !formData.content}
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              onClick={handlePublish}
              disabled={loading || !formData.title || !formData.content}
            >
              Publish Post
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
