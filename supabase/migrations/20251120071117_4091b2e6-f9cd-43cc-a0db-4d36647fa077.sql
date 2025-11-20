-- Add user_id to assessment_reports and consultation_requests
ALTER TABLE public.assessment_reports 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.consultation_requests 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop old admin-only policies
DROP POLICY IF EXISTS "Only admins can view assessment reports" ON public.assessment_reports;
DROP POLICY IF EXISTS "Only admins can update assessment reports" ON public.assessment_reports;
DROP POLICY IF EXISTS "Only admins can delete assessment reports" ON public.assessment_reports;
DROP POLICY IF EXISTS "Anyone can submit assessment reports" ON public.assessment_reports;

DROP POLICY IF EXISTS "Only admins can view consultation requests" ON public.consultation_requests;
DROP POLICY IF EXISTS "Only admins can update consultation requests" ON public.consultation_requests;
DROP POLICY IF EXISTS "Only admins can delete consultation requests" ON public.consultation_requests;
DROP POLICY IF EXISTS "Anyone can submit consultation requests" ON public.consultation_requests;

-- Create user-based policies for assessment_reports
CREATE POLICY "Users can insert their own assessment reports"
ON public.assessment_reports
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own assessment reports"
ON public.assessment_reports
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all assessment reports"
ON public.assessment_reports
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all assessment reports"
ON public.assessment_reports
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete all assessment reports"
ON public.assessment_reports
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create user-based policies for consultation_requests
CREATE POLICY "Users can insert their own consultation requests"
ON public.consultation_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own consultation requests"
ON public.consultation_requests
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all consultation requests"
ON public.consultation_requests
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all consultation requests"
ON public.consultation_requests
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete all consultation requests"
ON public.consultation_requests
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));