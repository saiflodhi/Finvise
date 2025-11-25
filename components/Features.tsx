import { Card, CardContent } from "@/components/ui/card";
import { FileCheck, Shield, Zap, BarChart3, Lock, Cloud } from "lucide-react";

const features = [
  {
    icon: FileCheck,
    title: "Automated E-Invoice Generation",
    description: "Create compliant invoices in seconds with smart templates that adapt to FTA requirements."
  },
  {
    icon: Shield,
    title: "FTA & PEPPOL Compliance",
    description: "Stay ahead of regulations with automatic validation against ZATCA Phase 2 standards."
  },
  {
    icon: Zap,
    title: "Real-Time Validation",
    description: "Instant feedback on invoice compliance before submission to prevent rejections."
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track invoice status, compliance metrics, and payment trends with intuitive dashboards."
  },
  {
    icon: Lock,
    title: "Secure & Encrypted",
    description: "Bank-level encryption and secure storage for all your sensitive invoice data."
  },
  {
    icon: Cloud,
    title: "Cloud-Based Platform",
    description: "Access your invoices anywhere, anytime with our reliable cloud infrastructure."
  }
];

export const Features = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need for UAE E-Invoicing
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to simplify compliance and streamline your invoicing process
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card"
            >
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
