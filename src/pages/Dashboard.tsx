import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAssessmentStore } from "@/store/assessmentStore";
import { ShieldCheck, LogOut, Loader2, PlayCircle, FileText, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { companyProfile, getOverallProgress, resetAssessment } = useAssessmentStore();
  const progress = getOverallProgress();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/login");
        return;
      }

      setUser(user);
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-secondary">Impero Dashboard</span>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-sm font-medium text-secondary hover:text-primary"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-secondary mb-4">
            Your Assessment Dashboard
          </h1>
          <p className="text-muted-foreground mb-8">
            Logged in as: <span className="font-semibold">{user?.email}</span>
          </p>

          {/* No Assessment Started */}
          {!companyProfile && progress === 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-primary" />
                  Start Your Assessment
                </CardTitle>
                <CardDescription>
                  Begin your Provision 29 compliance assessment to evaluate your organization's readiness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate("/assessment")}
                  className="w-full sm:w-auto"
                >
                  Begin Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Assessment In Progress */}
          {companyProfile && progress > 0 && progress < 100 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Assessment In Progress
                </CardTitle>
                <CardDescription>
                  Company: <span className="font-semibold">{companyProfile.companyName}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-bold text-primary">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => navigate("/assessment")}
                    className="w-full sm:w-auto"
                  >
                    Continue Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      resetAssessment();
                      navigate("/assessment");
                    }}
                    className="w-full sm:w-auto"
                  >
                    Start Fresh
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assessment Completed */}
          {companyProfile && progress === 100 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Assessment Completed
                </CardTitle>
                <CardDescription>
                  Company: <span className="font-semibold">{companyProfile.companyName}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Status</span>
                  <span className="text-sm font-bold text-primary">Complete</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => navigate("/results")}
                    className="w-full sm:w-auto"
                  >
                    View Results
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      resetAssessment();
                      navigate("/assessment");
                    }}
                    className="w-full sm:w-auto"
                  >
                    Start New Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
