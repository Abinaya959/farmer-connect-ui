
CREATE TABLE public.districts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ta TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.crops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ta TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.district_crops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  district_id UUID NOT NULL REFERENCES public.districts(id) ON DELETE CASCADE,
  crop_id UUID NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(district_id, crop_id)
);

CREATE TABLE public.farmer_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.district_crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Districts are publicly readable" ON public.districts FOR SELECT USING (true);
CREATE POLICY "Crops are publicly readable" ON public.crops FOR SELECT USING (true);
CREATE POLICY "District crops are publicly readable" ON public.district_crops FOR SELECT USING (true);

CREATE POLICY "Users can view their own sessions" ON public.farmer_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own sessions" ON public.farmer_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sessions" ON public.farmer_sessions FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX idx_district_crops_district ON public.district_crops(district_id);
CREATE INDEX idx_district_crops_crop ON public.district_crops(crop_id);
CREATE INDEX idx_farmer_sessions_user ON public.farmer_sessions(user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_farmer_sessions_updated_at
  BEFORE UPDATE ON public.farmer_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
