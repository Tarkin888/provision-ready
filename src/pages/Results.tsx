import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAssessmentStore } from "@/store/assessmentStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import EmailReportModal from "@/components/EmailReportModal";
import ConsultationBookingModal from "@/components/ConsultationBookingModal";
import ScheduleConsultationButton from "@/components/ScheduleConsultationButton";
import {
  ArrowLeft,
  Download,
  Calendar,
  Share2,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface SectionScore {
  id: number;
  title: string;
  score: number;
  maxScore: number;
  percentage: number;
}

interface Recommendation {
  priority: number;
  title: string;
  description: string;
  solution: string;
  timeline: string;
}

const Results = () => {
  const navigate = useNavigate();
  const { getTotalScore, getSectionScore, companyProfile } = useAssessmentStore();
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  const totalScore = getTotalScore();
  const maxTotalScore = 100;
  const percentage = Math.round((totalScore / maxTotalScore) * 100);

  const sections: SectionScore[] = [
    {
      id: 1,
      title: "Risk Governance Framework",
      score: getSectionScore(1),
      maxScore: 20,
      percentage: Math.round((getSectionScore(1) / 20) * 100),
    },
    {
      id: 2,
      title: "Material Controls Identification",
      score: getSectionScore(2),
      maxScore: 20,
      percentage: Math.round((getSectionScore(2) / 20) * 100),
    },
    {
      id: 3,
      title: "Monitoring & Testing",
      score: getSectionScore(3),
      maxScore: 20,
      percentage: Math.round((getSectionScore(3) / 20) * 100),
    },
    {
      id: 4,
      title: "Board Oversight",
      score: getSectionScore(4),
      maxScore: 20,
      percentage: Math.round((getSectionScore(4) / 20) * 100),
    },
    {
      id: 5,
      title: "Audit Committee Engagement",
      score: getSectionScore(5),
      maxScore: 20,
      percentage: Math.round((getSectionScore(5) / 20) * 100),
    },
  ];

  const getMaturityLevel = () => {
    if (percentage <= 20)
      return {
        label: "Initial - Immediate Action Required",
        color: "bg-red-500",
        textColor: "text-red-700",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    if (percentage <= 40)
      return {
        label: "Developing - Significant Gaps Exist",
        color: "bg-orange-500",
        textColor: "text-orange-700",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
      };
    if (percentage <= 60)
      return {
        label: "Defined - Good Progress, More Work Needed",
        color: "bg-yellow-500",
        textColor: "text-yellow-700",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      };
    if (percentage <= 80)
      return {
        label: "Managed - Strong Position, Minor Enhancements",
        color: "bg-blue-500",
        textColor: "text-blue-700",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      };
    return {
      label: "Optimised - Provision 29 Ready",
      color: "bg-green-500",
      textColor: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    };
  };

  const maturityLevel = getMaturityLevel();

  const getRecommendations = (): Recommendation[] => {
    const weakestSections = [...sections].sort((a, b) => a.percentage - b.percentage).slice(0, 3);
    const recommendations: Recommendation[] = [];

    const recommendationMap: { [key: string]: Recommendation } = {
      "Risk Governance Framework": {
        priority: 1,
        title: "Strengthen Risk Governance Framework",
        description:
          "Implement enterprise risk management framework aligned to COSO/ISO 31000",
        solution:
          "Impero Solution: Enterprise Risk Management module with automated risk registers",
        timeline: "8-12 weeks",
      },
      "Material Controls Identification": {
        priority: 2,
        title: "Define and Document Material Controls",
        description:
          "Conduct material controls identification workshop with audit committee",
        solution:
          "Impero Solution: Internal Controls Monitoring module with materiality assessment tools",
        timeline: "6-10 weeks",
      },
      "Monitoring & Testing": {
        priority: 3,
        title: "Establish Testing Protocols",
        description:
          "Design control testing schedule with automated evidence capture",
        solution:
          "Impero Solution: Audit Management module with continuous control monitoring",
        timeline: "8-12 weeks",
      },
      "Board Oversight": {
        priority: 4,
        title: "Enhance Board Reporting",
        description: "Create board-level control effectiveness dashboard",
        solution:
          "Impero Solution: Corporate Governance module with real-time board portals",
        timeline: "4-6 weeks",
      },
      "Audit Committee Engagement": {
        priority: 5,
        title: "Strengthen Audit Committee Engagement",
        description:
          "Update Audit Committee terms of reference and provide Provision 29 training",
        solution:
          "Impero Solution: Governance module with audit committee workflow and training resources",
        timeline: "6-8 weeks",
      },
    };

    weakestSections.forEach((section) => {
      if (recommendationMap[section.title]) {
        recommendations.push(recommendationMap[section.title]);
      }
    });

    return recommendations;
  };

  const recommendations = getRecommendations();

  const getTimelineRecommendation = () => {
    if (percentage < 40)
      return "Critical: Minimum 9-12 months implementation needed";
    if (percentage < 61) return "Important: 6-9 months to bridge gaps";
    if (percentage < 81) return "Manageable: 3-6 months for fine-tuning";
    return "Well positioned: 1-3 months for final validation";
  };

  const daysUntil2026 = Math.ceil(
    (new Date("2026-01-01").getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  useEffect(() => {
    if (!companyProfile) {
      navigate("/assessment");
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Show loading state
    setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    // Animate score counter after loading
    setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = percentage / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= percentage) {
          setAnimatedScore(percentage);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.round(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, 2500);
  }, [percentage, companyProfile, navigate]);

  if (!companyProfile) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-secondary mb-2">
            Analysing your responses...
          </h2>
          <p className="text-muted-foreground">
            Calculating your Provision 29 readiness score
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <h1 className="text-xl font-bold text-secondary">
              Provision 29 Assessment Results
            </h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Score Section */}
        <Card className="p-8 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-64 h-64 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="112"
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="none"
                  className="text-secondary/10"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="112"
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 112}`}
                  strokeDashoffset={`${2 * Math.PI * 112 * (1 - animatedScore / 100)}`}
                  className={`${maturityLevel.color.replace("bg-", "text-")} transition-all duration-2000 ease-out`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-6xl font-bold text-secondary">
                  {animatedScore}%
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {totalScore}/{maxTotalScore} points
                </div>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-secondary mb-4">
                {companyProfile.companyName}
              </h2>
              <Badge
                className={`${maturityLevel.color} text-white text-lg px-6 py-3 mb-6`}
              >
                {maturityLevel.label}
              </Badge>
              <p className="text-base text-muted-foreground leading-relaxed">
                Your organisation has completed the Provision 29 readiness
                assessment. Based on your responses across 25 questions covering
                risk governance, material controls, monitoring, board oversight,
                and audit committee engagement, we have identified your current
                maturity level and specific areas for improvement.
              </p>
            </div>
          </div>
        </Card>

        {/* Section Breakdown */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-secondary mb-6 animate-fade-in">
            Section Performance Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section, index) => (
              <Card
                key={section.id}
                className="p-6 hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-semibold text-secondary leading-tight flex-1">
                    {section.title}
                  </h4>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-primary">
                      {section.score}
                      <span className="text-base text-muted-foreground">
                        /{section.maxScore}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-secondary">
                      {section.percentage}%
                    </span>
                  </div>
                  <Progress value={section.percentage} className="h-3" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Gap Analysis */}
        <Card className="p-8 mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold text-secondary">
              Priority Gap Analysis
            </h3>
          </div>
          <p className="text-muted-foreground mb-6">
            Based on your assessment, here are the top areas requiring immediate
            attention to achieve Provision 29 compliance:
          </p>
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <div
                key={rec.priority}
                className="border-l-4 border-primary pl-6 py-4 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start gap-3 mb-2">
                  <Badge variant="outline" className="mt-1">
                    Priority {rec.priority}
                  </Badge>
                  <h4 className="text-lg font-semibold text-secondary">
                    {rec.title}
                  </h4>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-foreground">
                    <strong>Recommendation:</strong> {rec.description}
                  </p>
                  <p className="text-primary">
                    <strong>Impero Solution:</strong> {rec.solution}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Implementation Timeline:</strong> {rec.timeline}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Compliance Countdown & Benchmark */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold text-secondary">
                2026 Compliance Countdown
              </h3>
            </div>
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-primary mb-2">
                {daysUntil2026}
              </div>
              <div className="text-muted-foreground">
                days until 1 January 2026
              </div>
            </div>
            <div
              className={`${maturityLevel.bgColor} ${maturityLevel.borderColor} border-2 rounded-lg p-4 text-center`}
            >
              <p className={`font-medium ${maturityLevel.textColor}`}>
                {getTimelineRecommendation()}
              </p>
            </div>
          </Card>

          <Card className="p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold text-secondary">
                Risk Assessment
              </h3>
            </div>
            
            {/* User Score Display */}
            <div className="text-center mb-6 pb-6 border-b border-border">
              <p className="text-muted-foreground mb-2">Your Score</p>
              <p className="text-4xl font-bold text-primary">{percentage}%</p>
            </div>

            {/* Risk Level Bands */}
            <div className="space-y-4">
              {/* HIGH RISK */}
              <div
                className={`rounded-lg p-5 border-2 transition-all ${
                  percentage <= 40
                    ? "bg-red-50 border-red-500 shadow-md"
                    : "bg-card border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔴</span>
                    <h4
                      className={`font-bold ${
                        percentage <= 40 ? "text-lg" : "text-base"
                      }`}
                    >
                      HIGH RISK (0-40%)
                    </h4>
                  </div>
                  {percentage <= 40 && (
                    <Badge className="bg-red-500 text-white hover:bg-red-600">
                      ← YOU ARE HERE
                    </Badge>
                  )}
                </div>
                <p className={`text-sm ${percentage <= 40 ? "font-medium" : ""}`}>
                  Significant compliance gaps. Immediate action required to avoid
                  regulatory censure and investor confidence damage.
                </p>
              </div>

              {/* MEDIUM RISK */}
              <div
                className={`rounded-lg p-5 border-2 transition-all ${
                  percentage > 40 && percentage <= 65
                    ? "bg-amber-50 border-amber-500 shadow-md"
                    : "bg-card border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🟡</span>
                    <h4
                      className={`font-bold ${
                        percentage > 40 && percentage <= 65 ? "text-lg" : "text-base"
                      }`}
                    >
                      MEDIUM RISK (41-65%)
                    </h4>
                  </div>
                  {percentage > 40 && percentage <= 65 && (
                    <Badge className="bg-amber-500 text-white hover:bg-amber-600">
                      ← YOU ARE HERE
                    </Badge>
                  )}
                </div>
                <p
                  className={`text-sm ${
                    percentage > 40 && percentage <= 65 ? "font-medium" : ""
                  }`}
                >
                  Developing capability with material gaps remaining. Structured
                  roadmap needed to achieve compliance by deadline.
                </p>
              </div>

              {/* LOW RISK */}
              <div
                className={`rounded-lg p-5 border-2 transition-all ${
                  percentage > 65
                    ? "bg-primary/10 border-primary shadow-md"
                    : "bg-card border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🟢</span>
                    <h4
                      className={`font-bold ${
                        percentage > 65 ? "text-lg" : "text-base"
                      }`}
                    >
                      LOW RISK (66-100%)
                    </h4>
                  </div>
                  {percentage > 65 && (
                    <Badge className="bg-primary text-white hover:bg-primary/90">
                      ← YOU ARE HERE
                    </Badge>
                  )}
                </div>
                <p className={`text-sm ${percentage > 65 ? "font-medium" : ""}`}>
                  Strong controls foundation in place. Focus on minor enhancements
                  and ongoing assurance activities.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="p-8 animate-fade-in">
          <h3 className="text-2xl font-bold text-secondary mb-6 text-center">
            Next Steps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button
              size="lg"
              className="gap-2 bg-primary hover:bg-primary/90 text-white"
              onClick={() => setIsEmailModalOpen(true)}
            >
              <Download className="w-5 h-5" />
              Download Full Report
            </Button>
            <ScheduleConsultationButton
              onClick={() => setIsConsultationModalOpen(true)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share with Audit Committee
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate("/assessment")}
            >
              <RefreshCw className="w-4 h-4" />
              Retake Assessment
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => window.open('https://impero.com', '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              Learn About Impero
            </Button>
          </div>
        </Card>

        <EmailReportModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          companyName={companyProfile.companyName}
          score={percentage}
        />
        
        <ConsultationBookingModal
          isOpen={isConsultationModalOpen}
          onClose={() => setIsConsultationModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Results;
