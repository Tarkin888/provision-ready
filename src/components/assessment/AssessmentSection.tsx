import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAssessmentStore } from "@/store/assessmentStore";
import { ArrowLeft, ArrowRight, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface AssessmentSectionProps {
  section: {
    id: number;
    title: string;
    questions: Array<{
      id: number;
      text: string;
      options: Array<{
        label: string;
        score: number;
      }>;
    }>;
  };
  sectionNumber: number;
  totalSections: number;
}

const AssessmentSection = ({
  section,
  sectionNumber,
  totalSections,
}: AssessmentSectionProps) => {
  const { sections, setSectionAnswer, setCurrentStep, getSectionScore } = useAssessmentStore();
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showScore, setShowScore] = useState(false);
  const [savingStates, setSavingStates] = useState<{ [key: number]: SaveState }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasShownAutosaveToast, setHasShownAutosaveToast] = useState(false);
  const [nextButtonState, setNextButtonState] = useState<'idle' | 'saving' | 'verifying' | 'slow'>('idle');
  const [verificationStartTime, setVerificationStartTime] = useState<number | null>(null);

  useEffect(() => {
    const savedAnswers = sections[section.id] || [];
    const answersMap: { [key: number]: string } = {};
    savedAnswers.forEach((a) => {
      answersMap[a.questionId] = a.answer;
    });
    setAnswers(answersMap);
    setShowScore(savedAnswers.length === section.questions.length);
  }, [section.id, sections, section.questions.length]);

  const handleAnswerChange = useCallback(async (questionId: number, answer: string, score: number) => {
    try {
      // Show autosave notification on first answer
      if (!hasShownAutosaveToast) {
        toast.success("Your progress is automatically saved", {
          description: "You can safely close your browser and resume later"
        });
        setHasShownAutosaveToast(true);
      }
      
      // Set saving state immediately
      setSavingStates((prev) => ({ ...prev, [questionId]: 'saving' }));
      setIsSaving(true);
      
      // Update local state
      setAnswers((prev) => ({ ...prev, [questionId]: answer }));
      
      // Save to store (zustand persist middleware will handle localStorage)
      setSectionAnswer(section.id, questionId, answer, score);
      
      // Wait briefly to ensure persistence completes (reduced from 150ms to 50ms)
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Verify save completed by checking store
      const storedAnswer = useAssessmentStore.getState().sections[section.id]?.find(
        (a) => a.questionId === questionId
      );
      
      if (storedAnswer && storedAnswer.answer === answer && storedAnswer.score === score) {
        // Success - show saved state
        setSavingStates((prev) => ({ ...prev, [questionId]: 'saved' }));
        
        // Clear saved indicator after 1.5 seconds (reduced from 2s)
        setTimeout(() => {
          setSavingStates((prev) => ({ ...prev, [questionId]: 'idle' }));
        }, 1500);
      } else {
        throw new Error('Save verification failed');
      }
    } catch (error) {
      console.error('Failed to save answer:', error);
      setSavingStates((prev) => ({ ...prev, [questionId]: 'error' }));
      toast.error('Failed to save answer. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [section.id, setSectionAnswer, hasShownAutosaveToast]);

  const handlePrevious = () => {
    setCurrentStep(sectionNumber - 1);
  };

  const handleNext = async () => {
    try {
      setNextButtonState('saving');
      setVerificationStartTime(Date.now());
      
      // Set up slow warning timer
      const slowWarningTimer = setTimeout(() => {
        if (nextButtonState !== 'idle') {
          setNextButtonState('slow');
        }
      }, 3000);
      
      // Check if any saves are in progress
      const anySaving = Object.values(savingStates).some(state => state === 'saving');
      if (anySaving) {
        clearTimeout(slowWarningTimer);
        setNextButtonState('idle');
        toast.error("Please wait for all answers to finish saving");
        return;
      }
      
      // Check if any saves failed
      const anyErrors = Object.values(savingStates).some(state => state === 'error');
      if (anyErrors) {
        clearTimeout(slowWarningTimer);
        setNextButtonState('idle');
        toast.error("Some answers failed to save. Please retry failed answers.");
        return;
      }
      
      const answeredQuestions = Object.keys(answers).length;
      if (answeredQuestions < section.questions.length) {
        clearTimeout(slowWarningTimer);
        setNextButtonState('idle');
        toast.error("Please answer all questions before proceeding");
        return;
      }
      
      // Quick verification phase
      setNextButtonState('verifying');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Validate that all answers are actually saved in store
      const savedAnswers = sections[section.id] || [];
      if (savedAnswers.length !== section.questions.length) {
        clearTimeout(slowWarningTimer);
        setNextButtonState('idle');
        toast.error("Not all answers have been saved. Please review your answers.");
        return;
      }
      
      clearTimeout(slowWarningTimer);
      setShowScore(true);
      setNextButtonState('idle');
      toast.success("Section complete! All answers saved.");
      
      // Reduced navigation delay from 1500ms to 800ms
      setTimeout(() => {
        if (sectionNumber === totalSections) {
          window.location.href = "/results";
        } else {
          setCurrentStep(sectionNumber + 1);
        }
      }, 800);
    } catch (error) {
      setNextButtonState('idle');
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleSave = () => {
    const savedCount = Object.keys(answers).length;
    const totalQuestions = section.questions.length;
    toast.success(`Progress saved: ${savedCount}/${totalQuestions} questions completed`, {
      description: "You can resume your assessment anytime by logging back in"
    });
  };

  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === section.questions.length;
  const sectionScore = getSectionScore(section.id);
  const maxScore = 20;
  const scorePercentage = (sectionScore / maxScore) * 100;
  
  // Check if any saves are in progress or failed
  const anySaving = Object.values(savingStates).some(state => state === 'saving');
  const anyErrors = Object.values(savingStates).some(state => state === 'error');
  const canNavigate = isComplete && !anySaving && !anyErrors;

  return (
    <div className="bg-white rounded-xl border border-border p-8 shadow-sm">
      <div className="mb-8">
        <div className="text-sm text-primary font-medium mb-2">
          Section {sectionNumber} of {totalSections}
        </div>
        <h2 className="text-2xl font-bold text-secondary mb-2">
          {section.title}
        </h2>
        <p className="text-muted-foreground">
          {answeredCount}/{section.questions.length} questions completed
        </p>
        {isSaving && (
          <div className="flex items-center gap-2 text-sm text-primary mt-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Saving your answer...</span>
          </div>
        )}
      </div>
      
      {!isComplete && anySaving && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <Loader2 className="h-5 w-5 text-blue-600 flex-shrink-0 animate-spin" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Saving your answers...
              </p>
              <p className="text-sm text-blue-700">
                Please wait for all answers to finish saving before continuing.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {!isComplete && anyErrors && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-900">
                Some answers failed to save
              </p>
              <p className="text-sm text-red-700">
                Please try selecting those answers again.
              </p>
            </div>
          </div>
        </div>
      )}

      {showScore && isComplete && (
        <div className="mb-8 p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-secondary mb-1">
                Section Score
              </h3>
              <p className="text-sm text-muted-foreground">
                Your readiness for this area
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary mb-1">
                {sectionScore}/{maxScore}
              </div>
              <div className="text-sm font-medium text-secondary">
                {scorePercentage.toFixed(0)}%
              </div>
            </div>
          </div>
          <div className="mt-4 h-3 bg-secondary/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-1000 ease-out"
              style={{ width: `${scorePercentage}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-8 mb-8">
        {section.questions.map((question) => (
          <div
            key={question.id}
            className="pb-6 border-b border-border last:border-0"
          >
            <Label className="text-base font-medium text-foreground mb-4 block">
              {question.id + 1}. {question.text}
            </Label>
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => {
                const selectedOption = question.options.find(opt => opt.label === value);
                if (selectedOption) {
                  handleAnswerChange(question.id, value, selectedOption.score);
                }
              }}
              className="gap-1"
              aria-label={`Question ${question.id + 1}: ${question.text}`}
            >
              {question.options.map((option, optIndex) => {
                const isSelected = answers[question.id] === option.label;
                const saveState = savingStates[question.id];
                
                return (
                  <div
                    key={optIndex}
                    className="flex items-start space-x-3 py-1 px-4 rounded-lg hover:bg-accent/50 transition-all duration-200 border border-transparent hover:border-primary/20 focus-within:border-primary/30"
                  >
                    <RadioGroupItem
                      value={option.label}
                      id={`q${question.id}-opt${optIndex}`}
                      className="mt-0.5"
                      disabled={saveState === 'saving'}
                    />
                    <Label
                      htmlFor={`q${question.id}-opt${optIndex}`}
                      className="flex-1 cursor-pointer leading-relaxed"
                    >
                      {option.label}
                      <span className="ml-2 text-xs font-medium text-primary">
                        ({option.score} {option.score === 1 ? 'point' : 'points'})
                      </span>
                    </Label>
                    
                    {/* Save status indicator - only show for selected option */}
                    {isSelected && (
                      <div className="ml-auto flex-shrink-0 flex items-center">
                        {saveState === 'saving' && (
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        )}
                        {saveState === 'saved' && (
                          <CheckCircle2 className="h-4 w-4 text-primary animate-in fade-in duration-200" />
                        )}
                        {saveState === 'idle' && isSelected && (
                          <div className="h-4 w-4" />
                        )}
                        {saveState === 'error' && (
                          <button
                            onClick={() => handleAnswerChange(question.id, option.label, option.score)}
                            className="flex items-center gap-1 text-destructive hover:text-destructive/80 transition-colors"
                            title="Click to retry"
                          >
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-xs">Retry</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={handlePrevious}
          className="gap-2 transition-all duration-200 hover:scale-105"
          aria-label="Go to previous section"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>

        <Button
          variant="ghost"
          onClick={handleSave}
          className="gap-2 text-muted-foreground transition-all duration-200 hover:scale-105"
          aria-label="Save progress and resume later"
        >
          <Save className="w-4 h-4" />
          Save & Resume Later
        </Button>

        <div className="flex flex-col items-end gap-2">
          <Button
            onClick={handleNext}
            disabled={!canNavigate || nextButtonState !== 'idle'}
            className="gap-2 bg-primary hover:bg-primary/90 text-white transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
            aria-label={sectionNumber === totalSections ? "View assessment results" : "Go to next section"}
          >
            {nextButtonState === 'saving' || nextButtonState === 'verifying' || nextButtonState === 'slow' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {sectionNumber === totalSections ? "Processing" : "Next"}
              </>
            ) : anySaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {sectionNumber === totalSections ? "View Results" : "Next"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
          
          {nextButtonState === 'saving' && (
            <p className="text-sm text-muted-foreground animate-fade-in">
              Saving your answers...
            </p>
          )}
          {nextButtonState === 'verifying' && (
            <p className="text-sm text-muted-foreground animate-fade-in">
              Verifying all answers are saved...
            </p>
          )}
          {nextButtonState === 'slow' && (
            <p className="text-sm text-amber-600 animate-fade-in">
              This is taking longer than expected...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentSection;
