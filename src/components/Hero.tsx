import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Sparkles, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAssessmentStore } from "@/store/assessmentStore";
import ConsultationBookingModal from "@/components/ConsultationBookingModal";
import ScheduleConsultationButton from "@/components/ScheduleConsultationButton";

const Hero = () => {
  const navigate = useNavigate();
  const { resetAssessment } = useAssessmentStore();
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  const handleStartAssessment = () => {
    resetAssessment();
    navigate('/assessment');
  };

  return (
    <section className="relative overflow-hidden py-12 lg:py-16">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10 bg-[length:200%_200%] animate-gradient-shift" />
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badges */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3 animate-fade-in">
            <Badge variant="outline" className="border-primary/50 text-primary bg-primary/5 hover:bg-primary/10 transition-colors">
              <Sparkles className="mr-1 h-3 w-3" />
              AI-Powered Assessment
            </Badge>
            <Badge variant="outline" className="border-primary/50 text-primary bg-primary/5 hover:bg-primary/10 transition-colors">
              Co-developed with ReadiNow
            </Badge>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-secondary lg:text-6xl animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Is Your Organisation Ready for{" "}
            <span className="text-primary">Provision 29?</span>
          </h1>

          {/* Subheadline */}
          <p className="mb-6 text-lg text-foreground lg:text-xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Assess your material controls framework in 10 minutes. Get instant
            readiness score and gap analysis.
          </p>

          {/* Urgency text */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-accent hover:bg-accent/20 transition-colors animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-semibold">January 2026 Deadline Approaching</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleStartAssessment}
              className="group w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_30px_rgba(0,203,169,0.4)] transition-all duration-300 text-lg h-14 px-10"
            >
              Start Free Assessment
            </Button>
            <ScheduleConsultationButton
              onClick={() => setIsConsultationModalOpen(true)}
            />
          </div>

          {/* FRC Compliance Badge */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card px-4 py-2 shadow-[0_1px_4px_rgba(0,0,0,0.08)] animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Aligned with FRC Guidance 2024</span>
          </div>

          {/* Trust indicator */}
          <p className="mt-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.6s" }}>
            Trusted by FTSE Companies
          </p>
        </div>
        
        <ConsultationBookingModal
          isOpen={isConsultationModalOpen}
          onClose={() => setIsConsultationModalOpen(false)}
        />
      </div>
    </section>
  );
};

export default Hero;
