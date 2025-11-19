import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSearch, TrendingUp, Calendar, ShieldCheck, Boxes } from "lucide-react";

const features = [
  {
    icon: Boxes,
    title: "Internal Controls System (ICS) Management",
    description: "Centralise internal controls into a consistent, audit-ready framework. Standardise definition, execution, and review of controls across multiple entities.",
    color: "text-primary",
  },
  {
    icon: FileSearch,
    title: "Control Effectiveness Testing",
    description: "Run single or bulk tests with complete audit trails. Capture all results with immutable documentation for board attestation and compliance.",
    color: "text-primary",
  },
  {
    icon: ShieldCheck,
    title: "COSO Framework Alignment",
    description: "Built on the globally recognised COSO standard. Provides rigorous, defensible foundation for all compliance work with assertion-based control linking.",
    color: "text-primary",
  },
  {
    icon: TrendingUp,
    title: "Reporting & Audit Documentation",
    description: "Auto-generate audit-ready logs, detailed workload reports, and performance tracking. Evidence required for Provision 29 declaration automatically captured.",
    color: "text-primary",
  },
  {
    icon: Calendar,
    title: "Flexible Compliance Framework",
    description: "Setup controls for SOX, ESG, IT, and general compliance. Highly customisable to group-level frameworks while managing local entity differences.",
    color: "text-primary",
  },
];

const Features = () => {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-secondary lg:text-4xl mb-4">
            Built on Impero's COSO-Based Platform
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive capabilities designed for finance, tax, and compliance teams in large enterprises
          </p>
        </div>
        
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="border-border bg-card hover:shadow-[0_4px_20px_rgba(0,147,54,0.15)] transition-all duration-300 group"
              >
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl text-secondary group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
