import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Zero Graph has transformed our sustainability reporting. The BRSR compliance features saved us weeks of manual work and gave us audit-ready reports.",
    company: "Tata Steel",
    role: "Sustainability Director",
  },
  {
    quote: "As an MSME, we thought carbon tracking was only for large corporations. Zero Graph made it accessible and affordable for us to start our net zero journey.",
    company: "Infosys BPM",
    role: "Environmental Manager",
  },
  {
    quote: "The India-specific emission factors and state-wise grid data gave us the accuracy we needed for our CDP disclosure. Highly recommended.",
    company: "Mahindra & Mahindra",
    role: "Chief Sustainability Officer",
  },
  {
    quote: "Working with Zero Graph has been excellent. Their team understands Indian regulatory requirements and helped us navigate BRSR effectively.",
    company: "Hindustan Unilever",
    role: "ESG Lead",
  },
  {
    quote: "The carbon credit marketplace connected us with verified Indian projects. We offset our emissions while supporting local communities.",
    company: "Wipro",
    role: "Carbon Management Head",
  },
  {
    quote: "From our first carbon assessment, Zero Graph has been instrumental in shaping our sustainable business practices for the Indian market.",
    company: "Reliance Industries",
    role: "VP Sustainability",
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
            Don't just take our word for it. Here's what Indian businesses have to say about partnering with us.
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
                <blockquote className="text-muted-foreground mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="border-t pt-4">
                  <p className="font-semibold text-foreground">{testimonial.company}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
