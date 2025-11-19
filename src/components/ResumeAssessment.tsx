import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAssessmentStore } from "@/store/assessmentStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const ResumeAssessment = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { companyProfile, getOverallProgress, resetAssessment } =
    useAssessmentStore();
  const progress = getOverallProgress();

  useEffect(() => {
    // Show modal if there's partial assessment data
    if (companyProfile && progress > 0 && progress < 100) {
      setIsOpen(true);
    }
  }, [companyProfile, progress]);

  const handleContinue = () => {
    setIsOpen(false);
    navigate("/assessment");
  };

  const handleStartFresh = () => {
    resetAssessment();
    setIsOpen(false);
    navigate("/assessment");
  };

  if (!companyProfile || progress === 0 || progress === 100) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome back!</DialogTitle>
          <DialogDescription>
            You're {progress}% through your assessment. Would you like to
            continue where you left off?
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-secondary">
                Progress
              </span>
              <span className="text-sm font-bold text-primary">
                {progress}%
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
          <p className="text-sm text-muted-foreground">
            Company: <span className="font-medium">{companyProfile.companyName}</span>
          </p>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleStartFresh}
            className="w-full sm:w-auto"
          >
            Start Fresh
          </Button>
          <Button onClick={handleContinue} className="w-full sm:w-auto">
            Continue Assessment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeAssessment;
