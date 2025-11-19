import { useAssessmentStore } from "@/store/assessmentStore";
import { CheckCircle2, Circle } from "lucide-react";

interface ProgressTrackerProps {
  sections: Array<{
    id: number;
    title: string;
  }>;
}

const ProgressTracker = ({ sections }: ProgressTrackerProps) => {
  const { currentStep, getSectionProgress, getOverallProgress } =
    useAssessmentStore();
  const overallProgress = getOverallProgress();

  return (
    <div className="bg-white rounded-xl border border-border p-8 shadow-sm">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-medium text-secondary">
            Overall Progress
          </h3>
          <span className="text-lg font-bold text-primary">
            {overallProgress}%
          </span>
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
