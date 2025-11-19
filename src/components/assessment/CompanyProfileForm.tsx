import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssessmentStore, CompanyProfile } from "@/store/assessmentStore";
import { Building2, ArrowRight } from "lucide-react";

const companyProfileSchema = z.object({
  companyName: z.string().trim().min(2, "Company name is required"),
  industrySector: z.string().min(1, "Please select an industry sector"),
  companySize: z.string().min(1, "Please select company size"),
  grcMaturity: z.string().min(1, "Please select GRC maturity level"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().trim().optional().or(z.literal("")),
});

type CompanyProfileFormValues = z.infer<typeof companyProfileSchema>;

const CompanyProfileForm = () => {
  const { setCompanyProfile, setCurrentStep, companyProfile } = useAssessmentStore();

  const form = useForm<CompanyProfileFormValues>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      companyName: companyProfile?.companyName || "",
      industrySector: companyProfile?.industrySector || "",
      companySize: companyProfile?.companySize || "",
      grcMaturity: companyProfile?.grcMaturity || "",
      email: companyProfile?.email || "",
      phone: companyProfile?.phone || "",
    },
  });

  const onSubmit = (data: CompanyProfileFormValues) => {
    setCompanyProfile(data as CompanyProfile);
    setCurrentStep(1);
  };

  return (
    <div className="bg-white rounded-xl border border-border p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-secondary">Company Profile</h2>
          <p className="text-muted-foreground">
            Help us understand your organisation before we begin
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your company name" 
                    aria-required="true"
                    aria-label="Company name"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="industrySector"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry Sector *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="financial-services">Financial Services</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="energy-utilities">Energy & Utilities</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companySize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Size (Employees) *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="250-999">250-999</SelectItem>
                    <SelectItem value="1000-4999">1,000-4,999</SelectItem>
                    <SelectItem value="5000-9999">5,000-9,999</SelectItem>
                    <SelectItem value="10000+">10,000+</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="grcMaturity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current GRC Maturity *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select maturity level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="just-starting">Just starting</SelectItem>
                    <SelectItem value="basic-controls">Basic controls in place</SelectItem>
                    <SelectItem value="structured-framework">Structured framework</SelectItem>
                    <SelectItem value="mature-optimised">Mature & optimised</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your.email@company.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+44 20 1234 5678"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full gap-2 bg-primary hover:bg-primary/90 text-white transition-all duration-200 hover:scale-105"
            size="lg"
            aria-label="Continue to assessment questions"
          >
            Begin Assessment
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CompanyProfileForm;
