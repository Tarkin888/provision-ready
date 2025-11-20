import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Validation schema
const assessmentSchema = z.object({
  email: z.string().email().max(255),
  companyProfile: z.object({
    companyName: z.string().trim().min(1).max(200),
    industrySector: z.string().trim().min(1).max(100),
    companySize: z.string().trim().min(1).max(100),
    grcMaturity: z.string().trim().min(1).max(100),
    email: z.string().email().max(255),
    phone: z.string().trim().max(50),
  }),
  overallScore: z.number().int().min(0).max(100),
  sectionScores: z.record(z.number().int().min(0).max(20)),
});

type AssessmentReportRequest = z.infer<typeof assessmentSchema>;

// HTML escape function to prevent XSS
function escapeHtml(text: string | number): string {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate input data
    const requestData = await req.json();
    const validatedData = assessmentSchema.parse(requestData);
    
    const {
      email,
      companyProfile,
      overallScore,
      sectionScores,
    } = validatedData;

    console.log("Processing assessment report for:", email);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store the assessment in the database
    const { error: dbError } = await supabase
      .from("assessment_reports")
      .insert({
        email,
        company_name: companyProfile.companyName,
        overall_score: overallScore,
        section_scores: sectionScores,
        company_profile: companyProfile,
      });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to store assessment data");
    }

    // Calculate maturity level
    const percentage = overallScore;
    let maturityLevel = "";
    let maturityColor = "";
    
    if (percentage <= 20) {
      maturityLevel = "Initial - Immediate Action Required";
      maturityColor = "#ef4444";
    } else if (percentage <= 40) {
      maturityLevel = "Developing - Significant Gaps Exist";
      maturityColor = "#ef4444";
    } else if (percentage <= 60) {
      maturityLevel = "Defined - Good Progress, More Work Needed";
      maturityColor = "#f59e0b";
    } else if (percentage <= 80) {
      maturityLevel = "Managed - Strong Position, Minor Enhancements";
      maturityColor = "#009736";
    } else {
      maturityLevel = "Optimised - Provision 29 Ready";
      maturityColor = "#009736";
    }

    // Generate email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Provision 29 Readiness Report</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #009736 0%, #2F4F4F 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Your Provision 29 Readiness Report</h1>
      <p style="color: #F0F0F0; margin: 10px 0 0 0; font-size: 16px;">Powered by Impero - Compliance. Simplified.</p>
    </div>

    <!-- Company Info -->
    <div style="padding: 30px 20px; border-bottom: 1px solid #e5e7eb;">
      <h2 style="color: #1a3d3d; margin: 0 0 20px 0; font-size: 22px;">Assessment Overview</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Company:</td>
          <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${escapeHtml(companyProfile.companyName)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Industry:</td>
          <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${escapeHtml(companyProfile.industrySector)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Company Size:</td>
          <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${escapeHtml(companyProfile.companySize)}</td>
        </tr>
      </table>
    </div>

    <!-- Overall Score -->
    <div style="padding: 30px 20px; background-color: #f5f5f5; text-align: center;">
      <div style="font-size: 48px; font-weight: bold; color: #2F4F4F; margin: 0 0 10px 0;">${escapeHtml(percentage)}%</div>
      <div style="display: inline-block; padding: 8px 16px; background-color: ${maturityColor}; color: #ffffff; border-radius: 20px; font-size: 14px; font-weight: 600;">
        ${escapeHtml(maturityLevel)}
      </div>
    </div>

    <!-- Section Breakdown -->
    <div style="padding: 30px 20px;">
      <h2 style="color: #1a3d3d; margin: 0 0 20px 0; font-size: 22px;">Section Scores</h2>
      ${Object.entries(sectionScores).map(([sectionId, score]) => {
        const sectionNames = [
          "Risk Governance Framework",
          "Material Controls Identification",
          "Monitoring & Testing",
          "Board Oversight",
          "Audit Committee Engagement"
        ];
        const sectionName = sectionNames[parseInt(sectionId)];
        const sectionPercentage = (score / 20) * 100;
        
        return `
        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #2F4F4F; font-size: 14px; font-weight: 600;">${escapeHtml(sectionName)}</span>
            <span style="color: #009736; font-size: 14px; font-weight: 600;">${escapeHtml(sectionPercentage)}%</span>
          </div>
          <div style="background-color: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="background-color: #009736; height: 100%; width: ${escapeHtml(sectionPercentage)}%;"></div>
          </div>
        </div>
        `;
      }).join('')}
    </div>

    <!-- Deadline Reminder -->
    <div style="padding: 30px 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b;">
      <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 18px;">⏰ Compliance Deadline</h3>
      <p style="color: #78350f; margin: 0; font-size: 14px;">
        Provision 29 compliance is required by <strong>1 January 2026</strong>. 
        Don't leave it until the last minute!
      </p>
    </div>

    <!-- CTA -->
    <div style="padding: 40px 20px; text-align: center; background-color: #f5f5f5;">
      <h2 style="color: #2F4F4F; margin: 0 0 15px 0; font-size: 22px;">Ready to Close the Gaps?</h2>
      <p style="color: #64748b; margin: 0 0 25px 0; font-size: 14px;">
        Let Impero help you achieve full Provision 29 compliance with our COSO-based platform and expert guidance.
      </p>
      <a href="https://impero.com" style="display: inline-block; padding: 14px 32px; background-color: #009736; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
        Learn About Impero
      </a>
    </div>

    <!-- Footer -->
    <div style="padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #94a3b8; margin: 0; font-size: 12px;">
        © ${new Date().getFullYear()} Impero - Compliance. Simplified. All rights reserved.
      </p>
      <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 12px;">
        This assessment report is for informational purposes only and does not constitute professional advice.
      </p>
    </div>
  </div>
</body>
</html>
    `;

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "Impero Assessment <onboarding@resend.dev>",
      to: [email],
      subject: `Your Provision 29 Readiness Report - ${percentage}% Complete`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Report sent successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-assessment-report function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
