import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, FileText, Target, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>

          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
              About This Assessment
            </h1>
            
            <div className="prose prose-lg max-w-none space-y-6">
              <Card className="p-8 mb-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-secondary mb-4">
                      Assessment Methodology
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Our Provision 29 Readiness Assessment is a comprehensive
                      evaluation tool designed specifically for UK premium-listed
                      companies preparing for the January 2026 compliance deadline.
                      The assessment covers five critical domains: Risk Governance
                      Framework, Material Controls Identification, Monitoring &
                      Testing, Board Oversight, and Audit Committee Engagement.
                      Each domain contains five carefully crafted questions that
                      evaluate your organisation's current maturity level against
                      Financial Reporting Council (FRC) guidance and industry best
                      practices.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 mb-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-secondary mb-4">
                      Scoring Approach
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      The assessment uses a 0-4 point scale for each question,
                      reflecting five maturity levels from "not implemented" to
                      "fully optimised and continuously monitored." Your total score
                      (out of 100 points) is mapped to one of five readiness levels:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">0-20%:</span>
                        <span>Initial - Immediate action required to establish foundational controls</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold">21-40%:</span>
                        <span>Developing - Significant gaps exist requiring structured remediation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-600 font-bold">41-60%:</span>
                        <span>Defined - Good progress made, more work needed for full compliance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 font-bold">61-80%:</span>
                        <span>Managed - Strong position with minor enhancements required</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">81-100%:</span>
                        <span>Optimised - Provision 29 ready with continuous improvement processes</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-secondary mb-4">
                      Provision 29 Context
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      The UK Corporate Governance Code's Provision 29 requires
                      boards of premium-listed companies to describe in their annual
                      report how they have monitored and reviewed the effectiveness
                      of the company's risk management and internal control systems,
                      including material controls. Effective January 2026, boards
                      must make a declaration about the effectiveness of their
                      material controls, representing a significant shift from
                      voluntary to mandatory disclosure.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      This assessment helps organisations identify their current
                      readiness level, understand gaps, and develop a targeted
                      implementation roadmap. Our methodology is informed by
                      guidance from the Financial Reporting Council (FRC), input
                      from leading audit committees, and practical experience from
                      over 100 FTSE implementations. The results provide a
                      data-driven foundation for board discussions and strategic
                      planning around Provision 29 compliance.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Button
                size="lg"
                onClick={() => navigate("/assessment")}
                className="gap-2"
              >
                Start Your Assessment
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
