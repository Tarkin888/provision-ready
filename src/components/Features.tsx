import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSearch, TrendingUp, Calendar } from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Material Controls Gap Analysis",
    description: "Identify which controls qualify as material under FRC guidance",
    color: "text-primary",
  },
  {
    icon: TrendingUp,
    title: "Governance Maturity Score",
    description: "Assess your readiness using FTSE 100-proven assessment methodology",
    color: "text-secondary",
  },
  {
    icon: Calendar,
    title: "2026 Compliance Roadmap",
    description: "Get personalised timeline to meet January 2026 deadline",
    color: "text-accent",
  },
];

const Features = () => {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Section header */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              Comprehensive Compliance Assessment
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to prepare for Provision 29
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="group border-border bg-card rounded-xl transition-all duration-300 hover:border-primary/50 hover:shadow-[0_8px_30px_rgba(0,203,169,0.15)] hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                      <Icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-secondary group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
