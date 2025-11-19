import { useEffect, useState } from "react";
import { useAssessmentStore } from "@/store/assessmentStore";
import CompanyProfileForm from "@/components/assessment/CompanyProfileForm";
import AssessmentSection from "@/components/assessment/AssessmentSection";
import ProgressTracker from "@/components/assessment/ProgressTracker";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SECTIONS = [
  {
    id: 1,
    title: "Risk Governance Framework",
    questions: [
      {
        id: 0,
        text: "Does your organisation have a documented enterprise risk management framework?",
        options: [
          { label: "No framework exists", score: 0 },
          { label: "Framework in development", score: 1 },
          { label: "Framework documented but not fully embedded", score: 2 },
          { label: "Framework embedded with annual review", score: 3 },
          { label: "Mature framework with continuous monitoring", score: 4 },
        ],
      },
      {
        id: 1,
        text: "How does your organisation identify and assess material risks?",
        options: [
          { label: "Ad-hoc identification only", score: 0 },
          { label: "Annual workshop-based assessment", score: 1 },
          { label: "Quarterly risk reviews with register", score: 2 },
          { label: "Continuous monitoring with escalation protocols", score: 3 },
          { label: "Real-time monitoring integrated with business processes", score: 4 },
        ],
      },
      {
        id: 2,
        text: "Who owns the enterprise risk management framework?",
        options: [
          { label: "No clear ownership", score: 0 },
          { label: "Finance or Internal Audit owns it", score: 1 },
          { label: "Risk function exists but limited authority", score: 2 },
          { label: "Chief Risk Officer with board reporting line", score: 3 },
          { label: "CRO with board committee and executive sponsorship", score: 4 },
        ],
      },
      {
        id: 3,
        text: "How frequently does your board review material risks?",
        options: [
          { label: "Annually or less", score: 0 },
          { label: "Twice per year", score: 1 },
          { label: "Quarterly", score: 2 },
          { label: "Quarterly with ad-hoc deep dives", score: 3 },
          { label: "Continuous monitoring with real-time alerts", score: 4 },
        ],
      },
      {
        id: 4,
        text: "Does your risk framework align to an established standard?",
        options: [
          { label: "No alignment to standards", score: 0 },
          { label: "Partially aligned to COSO or ISO 31000", score: 1 },
          { label: "Aligned to COSO or ISO 31000", score: 2 },
          { label: "Aligned with external validation/audit", score: 3 },
          { label: "Fully integrated with Provision 29 requirements", score: 4 },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Material Controls Identification",
    questions: [
      {
        id: 0,
        text: "Has your organisation defined what constitutes a 'material control'?",
        options: [
          { label: "No definition exists", score: 0 },
          { label: "Working definition in draft", score: 1 },
          { label: "Definition documented but not approved", score: 2 },
          { label: "Board-approved definition", score: 3 },
          { label: "Approved definition with clear identification criteria", score: 4 },
        ],
      },
      {
        id: 1,
        text: "How many material controls have you identified across financial, operational, reporting, and compliance domains?",
        options: [
          { label: "Haven't started identification", score: 0 },
          { label: "Less than 10 controls identified", score: 1 },
          { label: "10-25 controls identified", score: 2 },
          { label: "25-50 controls identified", score: 3 },
          { label: "50+ controls with comprehensive mapping", score: 4 },
        ],
      },
      {
        id: 2,
        text: "How do you link material controls to material risks?",
        options: [
          { label: "No linkage exists", score: 0 },
          { label: "Manual linkage in spreadsheets", score: 1 },
          { label: "Documented linkage in risk register", score: 2 },
          { label: "System-enabled linkage with workflow", score: 3 },
          { label: "Automated linkage with impact analysis", score: 4 },
        ],
      },
      {
        id: 3,
        text: "Who validates that controls are correctly classified as 'material'?",
        options: [
          { label: "No validation process", score: 0 },
          { label: "Management self-assessment only", score: 1 },
          { label: "Internal Audit validation", score: 2 },
          { label: "External audit or consultant validation", score: 3 },
          { label: "Multi-layer validation including board review", score: 4 },
        ],
      },
      {
        id: 4,
        text: "Are your material controls documented in a centralised repository?",
        options: [
          { label: "No centralised documentation", score: 0 },
          { label: "Spreadsheet-based repository", score: 1 },
          { label: "Shared drive with templates", score: 2 },
          { label: "Basic GRC system", score: 3 },
          { label: "Advanced GRC platform with workflow automation", score: 4 },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Monitoring & Testing",
    questions: [
      {
        id: 0,
        text: "How frequently do you test material controls effectiveness?",
        options: [
          { label: "No formal testing", score: 0 },
          { label: "Annual testing only", score: 1 },
          { label: "Semi-annual testing", score: 2 },
          { label: "Quarterly testing", score: 3 },
          { label: "Continuous automated testing", score: 4 },
        ],
      },
      {
        id: 1,
        text: "Who performs material controls testing?",
        options: [
          { label: "No one currently", score: 0 },
          { label: "Control owners self-test", score: 1 },
          { label: "Internal Audit leads testing", score: 2 },
          { label: "Dedicated controls testing team", score: 3 },
          { label: "Automated testing with independent validation", score: 4 },
        ],
      },
      {
        id: 2,
        text: "How do you document control testing evidence?",
        options: [
          { label: "No documentation", score: 0 },
          { label: "Email-based evidence collection", score: 1 },
          { label: "Shared folders or SharePoint", score: 2 },
          { label: "GRC system with evidence repository", score: 3 },
          { label: "Automated evidence capture with audit trail", score: 4 },
        ],
      },
      {
        id: 3,
        text: "What happens when a material control fails testing?",
        options: [
          { label: "No formal process", score: 0 },
          { label: "Ad-hoc remediation", score: 1 },
          { label: "Documented remediation plans", score: 2 },
          { label: "Remediation with escalation to management", score: 3 },
          { label: "Automated remediation workflow with board visibility", score: 4 },
        ],
      },
      {
        id: 4,
        text: "Can you produce control testing reports for audit committee within 24 hours?",
        options: [
          { label: "No, would take weeks", score: 0 },
          { label: "Within 2 weeks with manual compilation", score: 1 },
          { label: "Within 1 week", score: 2 },
          { label: "Within 48 hours", score: 3 },
          { label: "Real-time dashboards available instantly", score: 4 },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Board Oversight",
    questions: [
      {
        id: 0,
        text: "Does your board receive regular reports on material controls effectiveness?",
        options: [
          { label: "No board reporting", score: 0 },
          { label: "Annual reporting only", score: 1 },
          { label: "Semi-annual reporting", score: 2 },
          { label: "Quarterly reporting", score: 3 },
          { label: "Continuous monitoring dashboard for board", score: 4 },
        ],
      },
      {
        id: 1,
        text: "Has your board approved the organisation's material controls framework?",
        options: [
          { label: "No board involvement", score: 0 },
          { label: "Framework presented for information only", score: 1 },
          { label: "Framework discussed but not formally approved", score: 2 },
          { label: "Framework approved by board", score: 3 },
          { label: "Approved with annual effectiveness review", score: 4 },
        ],
      },
      {
        id: 2,
        text: "Does your board understand its Provision 29 declaration obligations?",
        options: [
          { label: "Not aware of requirements", score: 0 },
          { label: "Aware but not actively planning", score: 1 },
          { label: "Planning in early stages", score: 2 },
          { label: "Clear understanding with preparation underway", score: 3 },
          { label: "Fully prepared with rehearsal declarations completed", score: 4 },
        ],
      },
      {
        id: 3,
        text: "Who presents material controls updates to the board?",
        options: [
          { label: "No presentations", score: 0 },
          { label: "CFO presents ad-hoc", score: 1 },
          { label: "CFO presents quarterly", score: 2 },
          { label: "CRO or Chief Audit Executive presents quarterly", score: 3 },
          { label: "Dedicated governance team with executive sponsorship", score: 4 },
        ],
      },
      {
        id: 4,
        text: "Can your board access control status information between meetings?",
        options: [
          { label: "No access to control information", score: 0 },
          { label: "Must request reports from management", score: 1 },
          { label: "Monthly email updates", score: 2 },
          { label: "Quarterly board pack with detailed reports", score: 3 },
          { label: "Real-time board portal with dashboard access", score: 4 },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Audit Committee Engagement",
    questions: [
      {
        id: 0,
        text: "Does your Audit Committee have material controls oversight in its terms of reference?",
        options: [
          { label: "Not in terms of reference", score: 0 },
          { label: "General risk oversight only", score: 1 },
          { label: "Material controls mentioned but not detailed", score: 2 },
          { label: "Explicit material controls oversight", score: 3 },
          { label: "Detailed Provision 29 responsibilities documented", score: 4 },
        ],
      },
      {
        id: 1,
        text: "How often does Audit Committee review material controls effectiveness?",
        options: [
          { label: "Never or annually", score: 0 },
          { label: "Semi-annually", score: 1 },
          { label: "Quarterly", score: 2 },
          { label: "Quarterly with deep dives on specific controls", score: 3 },
          { label: "Quarterly plus continuous monitoring dashboard", score: 4 },
        ],
      },
      {
        id: 2,
        text: "Has your Audit Committee received training on Provision 29 requirements?",
        options: [
          { label: "No training provided", score: 0 },
          { label: "General governance training only", score: 1 },
          { label: "Basic Provision 29 awareness session", score: 2 },
          { label: "Detailed Provision 29 training from external experts", score: 3 },
          { label: "Ongoing training with peer benchmarking and FRC updates", score: 4 },
        ],
      },
      {
        id: 3,
        text: "Does your Audit Committee review control deficiencies and remediation plans?",
        options: [
          { label: "No review of deficiencies", score: 0 },
          { label: "Annual summary review", score: 1 },
          { label: "Quarterly deficiency reporting", score: 2 },
          { label: "Detailed remediation tracking with accountability", score: 3 },
          { label: "Real-time deficiency monitoring with escalation protocols", score: 4 },
        ],
      },
      {
        id: 4,
        text: "Is your Audit Committee prepared to support the board's 2026 Provision 29 declaration?",
        options: [
          { label: "Not prepared", score: 0 },
          { label: "Early planning stages", score: 1 },
          { label: "Preparation underway with gaps identified", score: 2 },
          { label: "Well advanced with dress rehearsal planned", score: 3 },
          { label: "Fully prepared with dry run completed", score: 4 },
        ],
      },
    ],
  },
];

const Assessment = () => {
  const { currentStep, setCurrentStep, companyProfile, getTotalScore } = useAssessmentStore();
  const navigate = useNavigate();
  const totalScore = getTotalScore();
  const [showExitDialog, setShowExitDialog] = useState(false);

  const handleExitClick = () => {
    setShowExitDialog(true);
  };

  const handleConfirmExit = () => {
    navigate("/");
  };

  useEffect(() => {
    // Scroll to top immediately when step changes
    window.scrollTo({ top: 0, behavior: "instant" });
    // Then smooth scroll for better UX
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-2.5 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleExitClick}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Exit Assessment
            </Button>
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-secondary">
                Provision 29 Readiness Assessment
              </h1>
              {totalScore > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
                  <span className="text-sm font-medium text-muted-foreground">
                    Total Score:
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {totalScore}
                  </span>
                </div>
              )}
            </div>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-2.5 py-8 max-w-4xl">
        {companyProfile && <ProgressTracker sections={SECTIONS} />}

        <div className="mt-8 animate-fade-in">
          {currentStep === 0 ? (
            <CompanyProfileForm />
          ) : (
            <AssessmentSection
              section={SECTIONS[currentStep - 1]}
              sectionNumber={currentStep}
              totalSections={SECTIONS.length}
            />
          )}
        </div>
      </div>

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Assessment?</AlertDialogTitle>
            <AlertDialogDescription>
              Your current progress is automatically saved. You can resume your assessment later by logging in with your email address.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Assessment</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmExit}>
              Exit to Home
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Assessment;
