import { Target, Building2, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

const SocialProof = () => {
  const indicators = [
    {
      icon: Target,
      title: "10 Min Average",
      description: "Completion Time",
    },
    {
      icon: Building2,
      title: "Based on 100+",
      description: "FTSE Implementations",
    },
    {
      icon: ShieldCheck,
      title: "FRC Guidance",
      description: "Aligned",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-secondary mb-4">
            Trusted by FTSE Companies and Mid-Market Leaders
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our assessment methodology is battle-tested across the UK's leading
            organisations and aligned with FRC guidance.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pb-2">
          {indicators.map((indicator, index) => {
            const Icon = indicator.icon;
            return (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-lg transition-all animate-fade-in hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-secondary mb-1">
                  {indicator.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {indicator.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
