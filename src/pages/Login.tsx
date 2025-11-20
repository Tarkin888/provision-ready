import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAssessmentStore } from "@/store/assessmentStore";
import { ArrowLeft, ShieldCheck } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { companyProfile } = useAssessmentStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if the email matches the saved session
    if (companyProfile && companyProfile.email.toLowerCase() === email.toLowerCase()) {
      toast({
        title: "Session Retrieved",
        description: "Welcome back! Continuing your assessment.",
      });
      navigate("/assessment");
    } else {
      toast({
        title: "Email Not Recognised",
        description: "No saved assessment found for this email. Please try again or start a new assessment.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-secondary">Impero</span>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-sm font-medium text-secondary hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-secondary mb-2">
                Retrieve Your Session
              </h1>
              <p className="text-muted-foreground">
                Enter your email to continue your assessment
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Checking..." : "Retrieve Session"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Don't have a saved assessment?
              </p>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full"
              >
                Start New Assessment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
