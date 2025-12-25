import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { 
  BookOpen, 
  Calendar, 
  ChevronLeft, 
  Clock, 
  Tag, 
  User,
  Loader2,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Blog() {
  const { slug } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["blogPost", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const filteredPosts = posts?.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering
    return content
      .split("\n")
      .map((line, index) => {
        if (line.startsWith("# ")) {
          return (
            <h1 key={index} className="text-3xl font-bold mt-8 mb-4">
              {line.slice(2)}
            </h1>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={index} className="text-2xl font-semibold mt-6 mb-3">
              {line.slice(3)}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={index} className="text-xl font-medium mt-4 mb-2">
              {line.slice(4)}
            </h3>
          );
        }
        if (line.startsWith("- ")) {
          return (
            <li key={index} className="ml-4 mb-1">
              {line.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").split("<strong>").map((part, i) => {
                if (part.includes("</strong>")) {
                  const [bold, rest] = part.split("</strong>");
                  return (
                    <span key={i}>
                      <strong>{bold}</strong>{rest}
                    </span>
                  );
                }
                return part;
              })}
            </li>
          );
        }
        if (line.match(/^\d+\.\s/)) {
          const text = line.replace(/^\d+\.\s/, "");
          return (
            <li key={index} className="ml-4 mb-1 list-decimal">
              {text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").split("<strong>").map((part, i) => {
                if (part.includes("</strong>")) {
                  const [bold, rest] = part.split("</strong>");
                  return (
                    <span key={i}>
                      <strong>{bold}</strong>{rest}
                    </span>
                  );
                }
                return part;
              })}
            </li>
          );
        }
        if (line.trim() === "") {
          return <br key={index} />;
        }
        return (
          <p key={index} className="mb-4 leading-relaxed">
            {line}
          </p>
        );
      });
  };

  // Single post view
  if (slug) {
    if (postLoading) {
      return (
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      );
    }

    if (!post) {
      return (
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container py-12">
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Post not found</h3>
                <p className="text-muted-foreground mb-4">
                  The article you're looking for doesn't exist or has been removed.
                </p>
                <Button asChild>
                  <Link to="/blog">Back to Blog</Link>
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8 max-w-4xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/blog">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>

          <article>
            <header className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{post.category}</Badge>
                {post.tags?.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              {post.excerpt && (
                <p className="text-xl text-muted-foreground mb-4">{post.excerpt}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.author_name}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.published_at || post.created_at)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {getReadingTime(post.content)}
                </div>
              </div>
            </header>

            <Separator className="mb-8" />

            <div className="prose prose-lg max-w-none dark:prose-invert">
              {renderMarkdown(post.content)}
            </div>
          </article>

          <Separator className="my-12" />

          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Ready to take action?</h3>
            <p className="text-muted-foreground mb-4">
              Start tracking your carbon footprint and work toward sustainability.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/calculators">Try Calculators</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Blog listing view
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Climate Education</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn about carbon accounting, sustainability reporting, and climate action strategies
          </p>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {postsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredPosts?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try a different search term"
                  : "Check back soon for new content"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts?.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {post.cover_image_url && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-2">
                    <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.published_at || post.created_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getReadingTime(post.content)}
                    </div>
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {post.tags.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
