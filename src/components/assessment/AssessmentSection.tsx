import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAssessmentStore } from "@/store/assessmentStore";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { toast } from "sonner";

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

  useEffect(() => {
    const savedAnswers = sections[section.id] || [];
    const answersMap: { [key: number]: string } = {};
    savedAnswers.forEach((a) => {
      answersMap[a.questionId] = a.answer;
    });
    setAnswers(answersMap);
    setShowScore(savedAnswers.length === section.questions.length);
  }, [section.id, sections, section.questions.length]);

  const handleAnswerChange = (questionId: number, answer: string, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setSectionAnswer(section.id, questionId, answer, score);
  };

  const handlePrevious = () => {
    setCurrentStep(sectionNumber - 1);
  };

  const handleNext = () => {
    const answeredQuestions = Object.keys(answers).length;
    if (answeredQuestions < section.questions.length) {
      toast.error("Please answer all questions before proceeding");
      return;
    }
    setShowScore(true);
    setTimeout(() => {
      if (sectionNumber === totalSections) {
        window.location.href = "/results";
      } else {
        setCurrentStep(sectionNumber + 1);
      }
    }, 1500);
  };

  const handleSave = () => {
    toast.success("Progress saved successfully");
  };

  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === section.questions.length;
  const sectionScore = getSectionScore(section.id);
  const maxScore = 20;
  const scorePercentage = (sectionScore / maxScore) * 100;

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
      </div>

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
              {question.options.map((option, optIndex) => (
                <div
                  key={optIndex}
                  className="flex items-start space-x-3 py-1 px-4 rounded-lg hover:bg-accent/50 transition-all duration-200 border border-transparent hover:border-primary/20 focus-within:border-primary/30"
                >
                  <RadioGroupItem
                    value={option.label}
                    id={`q${question.id}-opt${optIndex}`}
                    className="mt-0.5"
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
                </div>
              ))}
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

        <Button
          onClick={handleNext}
          disabled={!isComplete}
          className="gap-2 bg-primary hover:bg-primary/90 text-white transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
          aria-label={sectionNumber === totalSections ? "View assessment results" : "Go to next section"}
        >
          {sectionNumber === totalSections ? "View Results" : "Next"}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AssessmentSection;
