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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calendar, Loader2 } from "lucide-react";

const consultationSchema = z.object({
  name: z.string().min(2, { message: "Please enter your full name" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .max(255),
  company: z.string().min(2, { message: "Please enter your company name" }),
  phone: z.string().optional(),
  message: z.string().optional(),
  webhookUrl: z.string().url().optional(),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

interface ConsultationBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConsultationBookingModal = ({
  isOpen,
  onClose,
}: ConsultationBookingModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
  });

  const onSubmit = async (data: ConsultationFormData) => {
    setIsSubmitting(true);

    try {
      const webhookUrl = data.webhookUrl || "";
      
      if (webhookUrl) {
        // Send to user's custom webhook (Make.com/Zapier)
        console.log("Sending consultation request to webhook:", webhookUrl);
        
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "no-cors",
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            company: data.company,
            phone: data.phone || "",
            message: data.message || "",
            timestamp: new Date().toISOString(),
            source: "Impero Assessment Tool",
          }),
        });
      }

      // Also save to database via edge function
      const { supabase } = await import("@/integrations/supabase/client");
      const { error: dbError } = await supabase
        .from("consultation_requests")
        .insert({
          name: data.name,
          email: data.email,
          company: data.company,
          phone: data.phone || null,
          message: data.message || null,
        });

      if (dbError) {
        console.error("Database error:", dbError);
      }

      toast.success(
        "Consultation request submitted! Our team will contact you within 24 hours.",
        { duration: 5000 }
      );

      reset();
      onClose();
    } catch (error) {
      console.error("Failed to submit consultation request:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Schedule Expert Consultation
          </DialogTitle>
          <DialogDescription>
            Book a free consultation with our Provision 29 compliance experts.
            We'll help you develop a tailored roadmap to achieve compliance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Smith"
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name")}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive mt-1" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.smith@company.com"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive mt-1" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="company">Company Name *</Label>
            <Input
              id="company"
              type="text"
              placeholder="Your Company Ltd"
              aria-required="true"
              aria-invalid={!!errors.company}
              aria-describedby={errors.company ? "company-error" : undefined}
              {...register("company")}
            />
            {errors.company && (
              <p id="company-error" className="text-sm text-destructive mt-1" role="alert">
                {errors.company.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+44 20 1234 5678"
              {...register("phone")}
            />
          </div>

          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Tell us about your compliance challenges..."
              rows={3}
              {...register("message")}
            />
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <Label htmlFor="webhookUrl" className="text-xs">
              Webhook URL (Optional - for Make.com/Zapier integration)
            </Label>
            <Input
              id="webhookUrl"
              type="url"
              placeholder="https://hooks.zapier.com/..."
              className="mt-2 text-xs"
              {...register("webhookUrl")}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Add your Make.com or Zapier webhook URL to receive submissions in your workflow
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Consultation
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationBookingModal;
