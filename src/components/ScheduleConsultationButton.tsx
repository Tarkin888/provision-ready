import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduleConsultationButtonProps {
  onClick: () => void;
  className?: string;
}

const ScheduleConsultationButton = ({
  onClick,
  className,
}: ScheduleConsultationButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group inline-flex items-center justify-center gap-2 px-8 py-3 font-semibold text-base border-2 border-secondary bg-transparent text-secondary rounded-lg transition-all duration-200 ease-in-out hover:bg-secondary hover:text-white hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 w-full sm:w-auto",
        className
      )}
      aria-label="Schedule an expert consultation to discuss your Provision 29 compliance needs"
    >
      <Calendar 
        className="h-5 w-5 transition-colors duration-200" 
        strokeWidth={2}
        aria-hidden="true"
      />
      <span>Schedule Expert Consultation</span>
    </button>
  );
};

export default ScheduleConsultationButton;
