import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sun, TreePine, Wind, Flame } from "lucide-react";

const projectTypes = [
  {
    icon: Sun,
    title: "Solar Energy Projects",
    description: "Support solar farms across Rajasthan, Gujarat, and Tamil Nadu powering India's clean energy transition.",
    location: "Pan India",
    credits: "50,000+ Credits Available",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
  },
  {
    icon: TreePine,
    title: "Afforestation & Reforestation",
    description: "Tree planting initiatives in the Western Ghats, Himalayan foothills, and degraded forest lands.",
    location: "Karnataka, Uttarakhand, Odisha",
    credits: "25,000+ Credits Available",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop",
  },
  {
    icon: Flame,
    title: "Clean Cookstove Programs",
    description: "Distribute efficient cookstoves to rural households, reducing indoor air pollution and deforestation.",
    location: "Bihar, Jharkhand, MP",
    credits: "30,000+ Credits Available",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop",
  },
  {
    icon: Wind,
    title: "Wind Energy Projects",
    description: "Wind farms in Tamil Nadu and Gujarat coastal regions generating clean electricity for the grid.",
    location: "Tamil Nadu, Gujarat",
    credits: "40,000+ Credits Available",
    image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=400&h=300&fit=crop",
  },
];

export function ImpactProjects() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold font-display mb-4">
            The Impact We Deliver
          </h2>
          <p className="text-muted-foreground text-lg">
            We help Indian businesses make a real, tangible impact on the climate crisis. Explore some of the high-impact project types we support across India.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {projectTypes.map((project, index) => (
            <Card
              key={index}
              className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="rounded-lg bg-primary p-2">
                    <project.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-muted-foreground">{project.location}</span>
                  <span className="text-primary font-medium">{project.credits}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/marketplace">
            <Button size="lg" className="gap-2">
              Explore All Projects
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
