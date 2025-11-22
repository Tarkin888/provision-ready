import { useAssessmentStore } from "@/store/assessmentStore";
import { CheckCircle2, Circle, Cloud, CloudOff, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";

interface ProgressTrackerProps {
  sections: Array<{
    id: number;
    title: string;
  }>;
}

const ProgressTracker = ({ sections }: ProgressTrackerProps) => {
  const { currentStep, getSectionProgress, getOverallProgress, lastSaveTime, saveStatus } =
    useAssessmentStore();
  const overallProgress = getOverallProgress();
  const [displayStatus, setDisplayStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (saveStatus === 'saving') {
      setDisplayStatus('saving');
    } else if (saveStatus === 'saved') {
      setDisplayStatus('saved');
      // Fade to idle after 2 seconds
      const timer = setTimeout(() => setDisplayStatus('idle'), 2000);
      return () => clearTimeout(timer);
    } else if (saveStatus === 'error') {
      setDisplayStatus('error');
    }
  }, [saveStatus]);

  const getTimeAgo = () => {
    if (!lastSaveTime) return 'Never';
    return formatDistanceToNow(new Date(lastSaveTime), { addSuffix: true });
  };

  return (
    <div className="bg-white rounded-xl border border-border p-8 shadow-sm">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-medium text-secondary">
            Overall Progress
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-primary">
              {overallProgress}%
            </span>
            
            {/* Auto-save indicator */}
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 text-sm">
                    {displayStatus === 'saving' && (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-muted-foreground">Saving...</span>
                      </>
                    )}
                    {displayStatus === 'saved' && (
                      <>
                        <Cloud className="h-4 w-4 text-primary" />
                        <span className="text-primary font-medium">Saved ✓</span>
                      </>
                    )}
                    {displayStatus === 'idle' && lastSaveTime && (
                      <>
                        <Cloud className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Auto-saved</span>
                      </>
                    )}
                    {displayStatus === 'error' && (
                      <>
                        <CloudOff className="h-4 w-4 text-amber-600" />
                        <span className="text-amber-600 font-medium">Retrying...</span>
                      </>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Last saved: {getTimeAgo()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="h-3 bg-secondary/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {sections.map((section, index) => {
          const sectionProgress = getSectionProgress(section.id);
          const isActive = currentStep === index + 1;
          const isComplete = sectionProgress === 5;
          const isPast = currentStep > index + 1;

          return (
            <div
              key={section.id}
              className={`flex flex-col gap-3 p-5 rounded-lg border-2 transition-all w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] ${
                isActive
                  ? "bg-primary/10 border-primary shadow-md"
                  : "bg-white border-border hover:border-primary/30 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {isComplete || isPast ? (
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  ) : (
                    <Circle
                      className={`w-6 h-6 ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-base font-semibold leading-tight ${
                      isActive ? "text-secondary" : "text-foreground"
                    }`}
                  >
                    {section.title}
                  </h4>
                </div>
              </div>
              <p className="text-sm text-muted-foreground pl-9">
                {sectionProgress}/5 completed
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;
