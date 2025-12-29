import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Send, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const sampleQuestions = [
  "What are carbon credits?",
  "Explain BRSR compliance",
  "How to reduce Scope 3 emissions?",
  "What is a carbon footprint?",
];

export function KnowledgeAgentSection() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "assistant",
      content: "Hello! I'm your Carbon Knowledge Agent. Ask me anything about carbon markets, sustainability, BRSR compliance, or emission reduction strategies.",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSampleQuestion = (question: string) => {
    setInputValue(question);
  };

  const simulateResponse = (question: string) => {
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI typing
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Great question! For detailed information about "${question}", I recommend exploring our full Knowledge Agent. It has access to comprehensive carbon market data, BRSR guidelines, and sustainability best practices.`,
        },
      ]);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      simulateResponse(inputValue);
    }
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 dot-background opacity-20" />
      <motion.div
        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[150px]"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Info */}
          <ScrollReveal animation="fadeRight">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-primary">
                <Brain className="h-4 w-4" />
                <span>AI-POWERED KNOWLEDGE</span>
              </div>

              <h2 className="text-3xl lg:text-5xl font-bold font-display">
                <span className="text-foreground">Your Carbon </span>
                <span className="text-primary">Expert Assistant</span>
              </h2>

              <p className="text-lg text-muted-foreground">
                Get instant answers to your sustainability questions. Our AI agent is trained on 
                carbon market regulations, BRSR guidelines, and industry best practices.
              </p>

              <ul className="space-y-3">
                {[
                  "Real-time answers from verified sources",
                  "BRSR & compliance expertise",
                  "Carbon credit market insights",
                  "Emission reduction strategies",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow" />
                    <span className="text-muted-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>

              <Link to="/knowledge">
                <Button size="lg" className="gap-2 mt-4">
                  Open Full Agent
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          {/* Right side - Chat Preview */}
          <ScrollReveal animation="fadeLeft" delay={0.2}>
            <motion.div
              className="glass-strong rounded-2xl p-1 shadow-glow"
              whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
            >
              <div className="bg-card rounded-xl overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 border-b border-border/50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Carbon Knowledge Agent</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      Online
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="h-[280px] overflow-y-auto p-4 space-y-4">
                  {messages.map((message, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50"
                        }`}
                      >
                        {message.content}
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-1 text-muted-foreground"
                    >
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Sample Questions */}
                <div className="px-4 pb-2">
                  <div className="flex flex-wrap gap-2">
                    {sampleQuestions.map((question, i) => (
                      <button
                        key={i}
                        onClick={() => handleSampleQuestion(question)}
                        className="text-xs px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-border/50">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask about carbon markets..."
                      className="bg-muted/30"
                    />
                    <Button type="submit" size="icon" disabled={!inputValue.trim() || isTyping}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
