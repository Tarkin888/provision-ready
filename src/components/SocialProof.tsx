import { Card, CardContent } from "@/components/ui/card";
import { Target, Building2, Zap } from "lucide-react";

const indicators = [
  {
    icon: Target,
    title: "25% Efficiency Gain",
    description: "Proven improvement through streamlined processes and timely control execution",
  },
  {
    icon: Building2,
    title: "Fortune 2000 Trusted",
    description: "Serving large enterprises with multi-entity complexity including BAUHAUS and Sigma Financial",
  },
  {
    icon: Zap,
    title: "3+ Week Implementation",
    description: "Fast deployment enabling rapid centralization of control frameworks",
  },
];

const SocialProof = () => {
  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-secondary lg:text-3xl mb-3">
            Trust & Transparency Through Impero
          </h2>
          <p className="text-muted-foreground">
            Making compliance manageable with immutable audit trails and standardised processes
          </p>
        </div>
        
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {indicators.map((indicator, index) => {
            const Icon = indicator.icon;
            return (
              <Card key={index} className="border-border bg-card hover:border-primary/50 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-secondary mb-2">
                      {indicator.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {indicator.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
