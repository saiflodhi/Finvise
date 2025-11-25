import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-invoicing.jpg";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-accent opacity-90" />
      <img 
        src={heroImage} 
        alt="InvoiceFlow Platform" 
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
      />
      
      <div className="container relative py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 backdrop-blur border border-white/20 text-white text-sm">
            <Shield className="h-4 w-4" />
            <span>FTA & PEPPOL Compliant</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            UAE E-Invoicing Made
            <span className="block bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
              Simple & Compliant
            </span>
          </h1>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Generate, validate, and submit e-invoices that meet FTA regulations. 
            Stay compliant with ZATCA Phase 2 requirements effortlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              asChild 
              className="bg-accent hover:bg-accent/90 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Link to="/dashboard">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20"
            >
              Watch Demo
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 pt-8 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              <span>Setup in 5 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
