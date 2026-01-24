import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, BookOpen, FileQuestion, Lightbulb, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SmartSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  recentTopics?: string[];
  className?: string;
}

interface SuggestionCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  suggestions: string[];
}

const SUGGESTION_CATEGORIES: SuggestionCategory[] = [
  {
    id: "getting_started",
    name: "Getting Started",
    icon: BookOpen,
    color: "text-blue-500",
    suggestions: [
      "What are carbon credits and how do they work?",
      "Explain the difference between Scope 1, 2, and 3 emissions",
      "What is the carbon credit verification process?",
      "How do I calculate my company's carbon footprint?",
    ],
  },
  {
    id: "compliance",
    name: "Compliance",
    icon: FileQuestion,
    color: "text-purple-500",
    suggestions: [
      "What are the BRSR reporting requirements for Indian companies?",
      "Explain CBAM and its impact on Indian exporters",
      "What is TCFD and how should we disclose climate risks?",
      "How to achieve CDP A-list status?",
    ],
  },
  {
    id: "markets",
    name: "Carbon Markets",
    icon: TrendingUp,
    color: "text-green-500",
    suggestions: [
      "What is the difference between VCM and compliance markets?",
      "How are carbon credit prices determined?",
      "Which registries are most credible - Verra, Gold Standard, or ACR?",
      "What is the Indian Carbon Market and when will it launch?",
    ],
  },
  {
    id: "reduction",
    name: "Reduction Strategies",
    icon: Lightbulb,
    color: "text-amber-500",
    suggestions: [
      "What are science-based targets and how do I set them?",
      "Best practices for reducing Scope 3 supply chain emissions",
      "How to transition to renewable energy in India?",
      "What is internal carbon pricing and should we implement it?",
    ],
  },
];

export function SmartSuggestions({
  onSuggestionClick,
  recentTopics = [],
  className,
}: SmartSuggestionsProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [displayedSuggestions, setDisplayedSuggestions] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize with random suggestions from each category
  useEffect(() => {
    refreshSuggestions();
  }, []);

  const refreshSuggestions = () => {
    setIsRefreshing(true);
    const newSuggestions = SUGGESTION_CATEGORIES.flatMap((cat) =>
      cat.suggestions.slice(0, 1)
    );
    // Shuffle and take 4
    const shuffled = newSuggestions.sort(() => Math.random() - 0.5).slice(0, 4);
    setTimeout(() => {
      setDisplayedSuggestions(shuffled);
      setIsRefreshing(false);
    }, 300);
  };

  const getCategoryForSuggestion = (suggestion: string): SuggestionCategory | undefined => {
    return SUGGESTION_CATEGORIES.find((cat) =>
      cat.suggestions.includes(suggestion)
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Suggested Questions</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshSuggestions}
          disabled={isRefreshing}
          className="h-8 px-2"
        >
          <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
        </Button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {SUGGESTION_CATEGORIES.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs gap-1.5"
              onClick={() =>
                setActiveCategory(activeCategory === category.id ? null : category.id)
              }
            >
              <Icon className={cn("w-3 h-3", activeCategory !== category.id && category.color)} />
              {category.name}
            </Button>
          );
        })}
      </div>

      {/* Suggestions */}
      <AnimatePresence mode="wait">
        {activeCategory ? (
          // Show category-specific suggestions
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            {SUGGESTION_CATEGORIES.find((c) => c.id === activeCategory)?.suggestions.map(
              (suggestion, index) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm transition-colors"
                >
                  {suggestion}
                </motion.button>
              )
            )}
          </motion.div>
        ) : (
          // Show mixed suggestions
          <motion.div
            key="mixed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-2"
          >
            {displayedSuggestions.map((suggestion, index) => {
              const category = getCategoryForSuggestion(suggestion);
              const Icon = category?.icon || Sparkles;
              return (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="flex items-start gap-3 w-full text-left px-3 py-2.5 rounded-lg bg-muted/50 hover:bg-muted text-sm transition-colors group"
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 mt-0.5 flex-shrink-0 transition-colors",
                      category?.color || "text-muted-foreground",
                      "group-hover:text-primary"
                    )}
                  />
                  <span className="flex-1">{suggestion}</span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Topics */}
      {recentTopics.length > 0 && !activeCategory && (
        <div className="pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground">Recent topics:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {recentTopics.slice(0, 3).map((topic) => (
              <Badge
                key={topic}
                variant="outline"
                className="text-xs cursor-pointer hover:bg-muted"
                onClick={() => onSuggestionClick(`Tell me more about ${topic}`)}
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
