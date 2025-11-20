-- Add UPDATE policies for admin-only modification of assessment reports
CREATE POLICY "Only admins can update assessment reports"
ON public.assessment_reports FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policies for admin-only deletion of assessment reports
CREATE POLICY "Only admins can delete assessment reports"
ON public.assessment_reports FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add UPDATE policies for admin-only modification of consultation requests
CREATE POLICY "Only admins can update consultation requests"
ON public.consultation_requests FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policies for admin-only deletion of consultation requests
CREATE POLICY "Only admins can delete consultation requests"
ON public.consultation_requests FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));