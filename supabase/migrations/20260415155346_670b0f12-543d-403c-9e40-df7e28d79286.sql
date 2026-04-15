
-- Add new columns to crops table
ALTER TABLE public.crops
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'vegetable',
  ADD COLUMN IF NOT EXISTS ideal_temp_min numeric NOT NULL DEFAULT 2,
  ADD COLUMN IF NOT EXISTS ideal_temp_max numeric NOT NULL DEFAULT 8,
  ADD COLUMN IF NOT EXISTS ideal_humidity_min numeric NOT NULL DEFAULT 80,
  ADD COLUMN IF NOT EXISTS ideal_humidity_max numeric NOT NULL DEFAULT 95,
  ADD COLUMN IF NOT EXISTS max_storage_days integer NOT NULL DEFAULT 30,
  ADD COLUMN IF NOT EXISTS seasons text[] NOT NULL DEFAULT '{kharif,rabi}',
  ADD COLUMN IF NOT EXISTS yield_per_acre_kg numeric NOT NULL DEFAULT 5000,
  ADD COLUMN IF NOT EXISTS risk_factors text[] NOT NULL DEFAULT '{}';

-- Add climate_zone to districts
ALTER TABLE public.districts
  ADD COLUMN IF NOT EXISTS climate_zone text NOT NULL DEFAULT 'Semi-Arid';

-- Add last_active_at to farmer_sessions
ALTER TABLE public.farmer_sessions
  ADD COLUMN IF NOT EXISTS last_active_at timestamp with time zone NOT NULL DEFAULT now();

-- Make farmer_sessions.user_id nullable (already nullable) and session_token have default
ALTER TABLE public.farmer_sessions
  ALTER COLUMN session_token SET DEFAULT gen_random_uuid()::text;

-- Drop the existing INSERT RLS policy that requires auth.uid() and recreate for anonymous access
DROP POLICY IF EXISTS "Users can create their own sessions" ON public.farmer_sessions;
CREATE POLICY "Anyone can create sessions"
  ON public.farmer_sessions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create analysis_sessions table
CREATE TABLE IF NOT EXISTS public.analysis_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_session_id uuid NOT NULL,
  session_type text NOT NULL DEFAULT 'new_planning',
  district_id uuid,
  crop_id uuid,
  season text,
  land_size_acres numeric,
  temperature numeric,
  humidity numeric,
  storage_days integer,
  risk_level text,
  risk_score numeric,
  spoilage_hours numeric,
  risk_reasons text[],
  recommendations text[],
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.analysis_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Analysis sessions are publicly readable"
  ON public.analysis_sessions FOR SELECT TO public
  USING (true);

CREATE POLICY "Anyone can create analysis sessions"
  ON public.analysis_sessions FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update analysis sessions"
  ON public.analysis_sessions FOR UPDATE TO public
  USING (true);

-- Create schemes table
CREATE TABLE IF NOT EXISTS public.schemes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en text NOT NULL,
  name_ta text NOT NULL,
  scheme_type text NOT NULL DEFAULT 'subsidy',
  description_en text NOT NULL DEFAULT '',
  description_ta text NOT NULL DEFAULT '',
  benefits_en text NOT NULL DEFAULT '',
  benefits_ta text NOT NULL DEFAULT '',
  eligibility_en text NOT NULL DEFAULT '',
  eligibility_ta text NOT NULL DEFAULT '',
  cold_storage_support boolean NOT NULL DEFAULT false,
  apply_link text,
  contact_info text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Schemes are publicly readable"
  ON public.schemes FOR SELECT TO public
  USING (true);

-- Create mandi_prices table
CREATE TABLE IF NOT EXISTS public.mandi_prices (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_name_en text NOT NULL,
  crop_name_ta text NOT NULL,
  current_price_per_kg numeric NOT NULL DEFAULT 0,
  prices_last_7_days jsonb NOT NULL DEFAULT '[]',
  unit text NOT NULL DEFAULT 'kg',
  location text NOT NULL DEFAULT 'Tamil Nadu',
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.mandi_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mandi prices are publicly readable"
  ON public.mandi_prices FOR SELECT TO public
  USING (true);

-- Add trigger for analysis_sessions updated_at
CREATE TRIGGER update_analysis_sessions_updated_at
  BEFORE UPDATE ON public.analysis_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed schemes data
INSERT INTO public.schemes (name_en, name_ta, scheme_type, description_en, description_ta, benefits_en, benefits_ta, eligibility_en, eligibility_ta, cold_storage_support, apply_link, contact_info) VALUES
('PM-KISAN', 'பிஎம்-கிசான்', 'subsidy', 'Direct income support of ₹6000/year to farmer families', 'விவசாய குடும்பங்களுக்கு ₹6000/ஆண்டு நேரடி வருமான ஆதரவு', '₹6000 per year in 3 installments', '3 தவணைகளில் ₹6000 ஆண்டு', 'All farmer families with cultivable land', 'விவசாய நிலம் கொண்ட அனைத்து விவசாய குடும்பங்கள்', false, 'https://pmkisan.gov.in', '155261'),
('PMFBY', 'பிஎம்எஃப்பிஒய்', 'insurance', 'Crop insurance scheme covering natural calamities', 'இயற்கை பேரழிவுகளை உள்ளடக்கிய பயிர் காப்பீட்டு திட்டம்', 'Premium: 2% for Kharif, 1.5% for Rabi crops', 'பிரீமியம்: காரிப் 2%, ரபி 1.5%', 'All farmers growing notified crops', 'அறிவிக்கப்பட்ட பயிர்களை வளர்க்கும் அனைத்து விவசாயிகள்', false, 'https://pmfby.gov.in', '1800-180-1551'),
('Cold Storage Subsidy', 'குளிர்சாதன மானியம்', 'subsidy', 'Subsidy for building cold storage facilities', 'குளிர்சாதன வசதிகளை கட்டுவதற்கான மானியம்', 'Up to 35% capital subsidy for cold storage construction', 'குளிர்சாதன கட்டுமானத்திற்கு 35% மூலதன மானியம்', 'Farmers, FPOs, cooperatives', 'விவசாயிகள், FPO-க்கள், கூட்டுறவு சங்கங்கள்', true, 'https://midh.gov.in', '011-23382543'),
('KCC - Kisan Credit Card', 'கிசான் கிரெடிட் கார்டு', 'loan', 'Easy credit for crop production and post-harvest needs', 'பயிர் உற்பத்தி மற்றும் அறுவடைக்குப் பின் தேவைகளுக்கான எளிய கடன்', 'Up to ₹3 lakh at 4% interest rate', '₹3 லட்சம் வரை 4% வட்டி விகிதத்தில்', 'All farmers, sharecroppers, tenant farmers', 'அனைத்து விவசாயிகள், பங்கு விவசாயிகள், குத்தகை விவசாயிகள்', false, NULL, '1800-180-1111'),
('e-NAM', 'இ-நாம்', 'support', 'National Agriculture Market - online trading platform', 'தேசிய வேளாண் சந்தை - ஆன்லைன் வர்த்தக தளம்', 'Direct market access, better price discovery, transparent bidding', 'நேரடி சந்தை அணுகல், சிறந்த விலை கண்டுபிடிப்பு, வெளிப்படையான ஏலம்', 'All farmers with Aadhaar and bank account', 'ஆதார் மற்றும் வங்கிக் கணக்கு உள்ள அனைத்து விவசாயிகள்', false, 'https://enam.gov.in', '1800-270-0224'),
('TN Cold Chain Mission', 'தமிழ்நாடு குளிர்சங்கிலி இயக்கம்', 'subsidy', 'Tamil Nadu specific cold chain infrastructure scheme', 'தமிழ்நாடு குறிப்பிட்ட குளிர்சங்கிலி உள்கட்டமைப்பு திட்டம்', '50% subsidy for integrated cold chain projects', 'ஒருங்கிணைந்த குளிர்சங்கிலி திட்டங்களுக்கு 50% மானியம்', 'Farmers and FPOs in Tamil Nadu', 'தமிழ்நாட்டில் விவசாயிகள் மற்றும் FPO-க்கள்', true, NULL, '044-25670000');

-- Seed mandi_prices data
INSERT INTO public.mandi_prices (crop_name_en, crop_name_ta, current_price_per_kg, prices_last_7_days, unit, location) VALUES
('Onion', 'வெங்காயம்', 25, '[22, 23, 24, 24, 25, 25, 25]', 'kg', 'Tamil Nadu'),
('Tomato', 'தக்காளி', 30, '[35, 33, 32, 31, 30, 30, 30]', 'kg', 'Tamil Nadu'),
('Potato', 'உருளைக்கிழங்கு', 20, '[18, 19, 19, 20, 20, 20, 20]', 'kg', 'Tamil Nadu'),
('Rice (Paddy)', 'நெல்', 22, '[21, 21, 22, 22, 22, 22, 22]', 'kg', 'Tamil Nadu'),
('Banana', 'வாழை', 35, '[30, 31, 32, 33, 34, 34, 35]', 'kg', 'Tamil Nadu'),
('Sugarcane', 'கரும்பு', 3.5, '[3.2, 3.3, 3.3, 3.4, 3.4, 3.5, 3.5]', 'kg', 'Tamil Nadu'),
('Cotton', 'பருத்தி', 65, '[62, 63, 64, 64, 65, 65, 65]', 'kg', 'Tamil Nadu'),
('Groundnut (Peanut)', 'நிலக்கடலை', 55, '[52, 53, 54, 54, 55, 55, 55]', 'kg', 'Tamil Nadu'),
('Coconut', 'தேங்காய்', 15, '[14, 14, 15, 15, 15, 15, 15]', 'piece', 'Tamil Nadu'),
('Mango', 'மாம்பழம்', 60, '[55, 56, 57, 58, 59, 60, 60]', 'kg', 'Tamil Nadu');

-- Update existing crops with proper data
UPDATE public.crops SET
  category = 'grain', ideal_temp_min = 10, ideal_temp_max = 25, ideal_humidity_min = 60, ideal_humidity_max = 70,
  max_storage_days = 180, seasons = '{kharif,rabi}', yield_per_acre_kg = 2500, risk_factors = '{moisture,insects}'
WHERE name_en = 'Rice (Paddy)';

UPDATE public.crops SET
  category = 'vegetable', ideal_temp_min = 0, ideal_temp_max = 4, ideal_humidity_min = 95, ideal_humidity_max = 100,
  max_storage_days = 14, seasons = '{kharif,rabi,summer}', yield_per_acre_kg = 10000, risk_factors = '{temperature,bruising}'
WHERE name_en = 'Tomato';

UPDATE public.crops SET
  category = 'vegetable', ideal_temp_min = 0, ideal_temp_max = 5, ideal_humidity_min = 65, ideal_humidity_max = 70,
  max_storage_days = 30, seasons = '{kharif,rabi}', yield_per_acre_kg = 8000, risk_factors = '{sprouting,moisture}'
WHERE name_en = 'Onion';

UPDATE public.crops SET
  category = 'vegetable', ideal_temp_min = 4, ideal_temp_max = 8, ideal_humidity_min = 90, ideal_humidity_max = 95,
  max_storage_days = 120, seasons = '{rabi}', yield_per_acre_kg = 8000, risk_factors = '{sprouting,greening}'
WHERE name_en = 'Potato';

UPDATE public.crops SET
  category = 'fruit', ideal_temp_min = 13, ideal_temp_max = 15, ideal_humidity_min = 85, ideal_humidity_max = 95,
  max_storage_days = 21, seasons = '{kharif,summer}', yield_per_acre_kg = 30000, risk_factors = '{ethylene,bruising}'
WHERE name_en = 'Banana';

UPDATE public.crops SET
  category = 'cash_crop', ideal_temp_min = 20, ideal_temp_max = 30, ideal_humidity_min = 60, ideal_humidity_max = 70,
  max_storage_days = 365, seasons = '{kharif,summer}', yield_per_acre_kg = 35000, risk_factors = '{moisture}'
WHERE name_en = 'Sugarcane';

UPDATE public.crops SET
  category = 'cash_crop', ideal_temp_min = 1, ideal_temp_max = 10, ideal_humidity_min = 45, ideal_humidity_max = 65,
  max_storage_days = 180, seasons = '{kharif}', yield_per_acre_kg = 800, risk_factors = '{moisture,insects}'
WHERE name_en = 'Cotton';

UPDATE public.crops SET
  category = 'oilseed', ideal_temp_min = 5, ideal_temp_max = 10, ideal_humidity_min = 50, ideal_humidity_max = 70,
  max_storage_days = 120, seasons = '{kharif,rabi}', yield_per_acre_kg = 1200, risk_factors = '{aflatoxin,moisture}'
WHERE name_en = 'Groundnut (Peanut)';

UPDATE public.crops SET
  category = 'fruit', ideal_temp_min = 0, ideal_temp_max = 5, ideal_humidity_min = 80, ideal_humidity_max = 90,
  max_storage_days = 90, seasons = '{kharif,rabi,summer,zaid}', yield_per_acre_kg = 12000, risk_factors = '{moisture}'
WHERE name_en = 'Coconut';

UPDATE public.crops SET
  category = 'fruit', ideal_temp_min = 10, ideal_temp_max = 13, ideal_humidity_min = 85, ideal_humidity_max = 90,
  max_storage_days = 25, seasons = '{summer}', yield_per_acre_kg = 4000, risk_factors = '{ethylene,anthracnose}'
WHERE name_en = 'Mango';

UPDATE public.crops SET
  category = 'grain', ideal_temp_min = 10, ideal_temp_max = 25, ideal_humidity_min = 50, ideal_humidity_max = 65,
  max_storage_days = 180, seasons = '{rabi}', yield_per_acre_kg = 2000, risk_factors = '{moisture,rust}'
WHERE name_en = 'Wheat';

UPDATE public.crops SET
  category = 'grain', ideal_temp_min = 10, ideal_temp_max = 25, ideal_humidity_min = 50, ideal_humidity_max = 65,
  max_storage_days = 150, seasons = '{kharif}', yield_per_acre_kg = 1500, risk_factors = '{moisture,grain_mold}'
WHERE name_en = 'Sorghum (Jowar)';

-- Update districts with climate zones
UPDATE public.districts SET climate_zone = 'Coastal Delta' WHERE name_en IN ('Chennai', 'Thanjavur', 'Nagapattinam', 'Cuddalore', 'Ramanathapuram');
UPDATE public.districts SET climate_zone = 'Semi-Arid' WHERE name_en IN ('Madurai', 'Salem', 'Coimbatore', 'Tiruchirappalli', 'Erode', 'Dindigul', 'Tirunelveli', 'Vellore', 'Villupuram', 'Sivaganga');
UPDATE public.districts SET climate_zone = 'Hill' WHERE name_en IN ('Nilgiris', 'Kodaikanal');
