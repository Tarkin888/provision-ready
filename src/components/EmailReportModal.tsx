import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Loader2 } from "lucide-react";
import { useAssessmentStore } from "@/store/assessmentStore";

const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface EmailReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  score: number;
}

const EmailReportModal = ({
  isOpen,
  onClose,
  companyName,
  score,
}: EmailReportModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: EmailFormData) => {
    setIsSubmitting(true);

    try {
      // Get full assessment data from store
      const { companyProfile, sections, getTotalScore } = useAssessmentStore.getState();
      
      if (!companyProfile) {
        toast.error("Company profile not found. Please complete the assessment first.");
        return;
      }

      // Calculate section scores
      const sectionScores: { [key: number]: number } = {};
      Object.keys(sections).forEach((sectionId) => {
        const sectionAnswers = sections[parseInt(sectionId)];
        sectionScores[parseInt(sectionId)] = sectionAnswers.reduce(
          (sum, answer) => sum + answer.score,
          0
        );
      });

      const overallScore = getTotalScore();

      // Call the edge function
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: responseData, error } = await supabase.functions.invoke(
        "send-assessment-report",
        {
          body: {
            email: data.email,
            companyProfile,
            overallScore,
            sectionScores,
          },
        }
      );

      if (error) {
        console.error("Error sending report:", error);
        throw error;
      }

      toast.success(
        "Your Provision 29 Readiness Report is on its way! Check your inbox in 2 minutes.",
        { duration: 5000 }
      );

      reset();
      onClose();
    } catch (error) {
      console.error("Failed to send report:", error);
      toast.error("Failed to send report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Get Your Full Report
          </DialogTitle>
          <DialogDescription>
            Enter your email to receive a detailed 15-page assessment report with
            implementation roadmap instantly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@company.com"
              aria-label="Email address for report delivery"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={errors.email ? "border-red-500" : ""}
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-red-500 mt-1" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-secondary mb-2">Your Report Includes:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Complete assessment breakdown for {companyName}</li>
              <li>• Section-by-section analysis and scores</li>
              <li>• Personalized recommendations and roadmap</li>
              <li>• Industry benchmarking insights</li>
              <li>• Implementation timeline guidance</li>
            </ul>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Send Report
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailReportModal;
