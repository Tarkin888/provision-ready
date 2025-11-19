--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



SET default_table_access_method = heap;

--
-- Name: assessment_reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assessment_reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    company_name text NOT NULL,
    overall_score integer NOT NULL,
    section_scores jsonb NOT NULL,
    company_profile jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: consultation_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.consultation_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    company text NOT NULL,
    phone text,
    message text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: assessment_reports assessment_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_reports
    ADD CONSTRAINT assessment_reports_pkey PRIMARY KEY (id);


--
-- Name: consultation_requests consultation_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consultation_requests
    ADD CONSTRAINT consultation_requests_pkey PRIMARY KEY (id);


--
-- Name: idx_assessment_reports_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_assessment_reports_created_at ON public.assessment_reports USING btree (created_at DESC);


--
-- Name: idx_assessment_reports_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_assessment_reports_email ON public.assessment_reports USING btree (email);


--
-- Name: idx_consultation_requests_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_consultation_requests_created_at ON public.consultation_requests USING btree (created_at DESC);


--
-- Name: idx_consultation_requests_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_consultation_requests_email ON public.consultation_requests USING btree (email);


--
-- Name: assessment_reports Anyone can submit assessment reports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit assessment reports" ON public.assessment_reports FOR INSERT WITH CHECK (true);


--
-- Name: consultation_requests Anyone can submit consultation requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit consultation requests" ON public.consultation_requests FOR INSERT WITH CHECK (true);


--
-- Name: assessment_reports; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.assessment_reports ENABLE ROW LEVEL SECURITY;

--
-- Name: consultation_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


