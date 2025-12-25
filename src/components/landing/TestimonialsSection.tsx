import { Card, CardContent } from "@/components/ui/card";
import { Quote, User } from "lucide-react";

// Placeholder testimonials - replace with authentic client testimonials
const testimonials = [
  {
    quote: "Your testimonial here...",
    company: "Company Name",
    role: "Job Title",
  },
  {
    quote: "Your testimonial here...",
    company: "Company Name",
    role: "Job Title",
  },
  {
    quote: "Your testimonial here...",
    company: "Company Name",
    role: "Job Title",
  },
  {
    quote: "Your testimonial here...",
    company: "Company Name",
    role: "Job Title",
  },
  {
    quote: "Your testimonial here...",
    company: "Company Name",
    role: "Job Title",
  },
  {
    quote: "Your testimonial here...",
    company: "Company Name",
    role: "Job Title",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold font-display mb-4">
            The Voice of Our Clients
          </h2>
          <p className="text-muted-foreground text-lg">
            Hear from businesses who have partnered with us on their sustainability journey.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <blockquote className="text-muted-foreground mb-6 italic min-h-[80px]">
                  "{testimonial.quote}"
                </blockquote>
                <div className="border-t pt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.company}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
