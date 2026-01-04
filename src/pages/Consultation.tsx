import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2,
  Building2,
  Users,
  TreePine,
  FileCheck,
  Loader2
} from "lucide-react";
import { consultationSchema } from "@/lib/validation";

const services = [
  {
    icon: Building2,
    title: "Carbon Footprint Assessment",
    description: "Comprehensive GHG inventory for Scope 1, 2, and 3 emissions",
  },
  {
    icon: FileCheck,
    title: "BRSR Compliance",
    description: "End-to-end support for SEBI's sustainability reporting requirements",
  },
  {
    icon: TreePine,
    title: "Carbon Offset Strategy",
    description: "Build a defensible portfolio of verified carbon credits",
  },
  {
    icon: Users,
    title: "Net Zero Roadmap",
    description: "Science-based targets and reduction strategies",
  },
];

const Consultation = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate with schema
    const result = consultationSchema.safeParse({
      firstName,
      lastName,
      email,
      phone,
      company,
      companySize,
      service,
      message: message || undefined,
    });
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      toast({
        title: "Validation Error",
        description: "Please check the form for errors.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Consultation Request Sent!",
      description: "Our team will contact you within 24 hours.",
    });
    
    // Reset form
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setCompanySize("");
    setService("");
    setMessage("");
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold font-display mb-6">
              Get a Free Consultation
            </h1>
            <p className="text-lg text-muted-foreground">
              Ready to build your climate strategy? Our experts are here to help you navigate 
              carbon management, BRSR compliance, and your Net Zero journey.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Book Your Free Consultation</CardTitle>
                  <p className="text-muted-foreground">
                    Fill out the form below and our team will reach out within 24 hours.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input 
                          id="firstName" 
                          placeholder="Rahul" 
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          maxLength={100}
                        />
                        {errors.firstName && (
                          <p className="text-sm text-destructive">{errors.firstName}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input 
                          id="lastName" 
                          placeholder="Sharma" 
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          maxLength={100}
                        />
                        {errors.lastName && (
                          <p className="text-sm text-destructive">{errors.lastName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Work Email *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="rahul@company.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        maxLength={255}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="+91 98765 43210" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        maxLength={20}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name *</Label>
                      <Input 
                        id="company" 
                        placeholder="Your Company Pvt Ltd" 
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        maxLength={200}
                      />
                      {errors.company && (
                        <p className="text-sm text-destructive">{errors.company}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="size">Company Size *</Label>
                      <Select value={companySize} onValueChange={setCompanySize}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-1000">201-1000 employees</SelectItem>
                          <SelectItem value="1000+">1000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.companySize && (
                        <p className="text-sm text-destructive">{errors.companySize}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="service">What are you interested in? *</Label>
                      <Select value={service} onValueChange={setService}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="assessment">Carbon Footprint Assessment</SelectItem>
                          <SelectItem value="brsr">BRSR Compliance</SelectItem>
                          <SelectItem value="offset">Carbon Offset Strategy</SelectItem>
                          <SelectItem value="netzero">Net Zero Roadmap</SelectItem>
                          <SelectItem value="platform">Carbon Tracking Platform</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.service && (
                        <p className="text-sm text-destructive">{errors.service}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Details</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Tell us about your sustainability goals and any specific challenges you're facing..."
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        maxLength={5000}
                      />
                      {errors.message && (
                        <p className="text-sm text-destructive">{errors.message}</p>
                      )}
                    </div>
                    
                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        "Request Consultation"
                      )}
                    </Button>
                    
                    <p className="text-xs text-muted-foreground text-center">
                      By submitting this form, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold font-display mb-6">Our Services</h2>
                <div className="grid gap-4">
                  {services.map((service, index) => (
                    <Card key={index} className="transition-all hover:shadow-md">
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <service.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{service.title}</h3>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5" />
                      <span>+91 1800-XXX-XXXX (Toll Free)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5" />
                      <span>consulting@zerograph.in</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5" />
                      <span>Jamshedpur, Jharkhand, India</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5" />
                      <span>9:00 AM - 6:00 PM IST</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold mb-4">What to Expect</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Response within 24 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm">30-minute discovery call with a sustainability expert</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Customized recommendations for your business</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm">No obligation - consultation is completely free</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container text-center text-sm text-muted-foreground">
          © 2024 Zero Graph. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Consultation;
