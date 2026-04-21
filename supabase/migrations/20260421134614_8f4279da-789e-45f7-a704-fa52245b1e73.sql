
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  message TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are publicly readable"
ON public.reviews
FOR SELECT
USING (true);

CREATE POLICY "Anyone can submit a review"
ON public.reviews
FOR INSERT
WITH CHECK (
  rating BETWEEN 1 AND 5
  AND char_length(name) BETWEEN 1 AND 80
  AND char_length(location) BETWEEN 1 AND 80
  AND char_length(message) BETWEEN 5 AND 600
);

CREATE INDEX idx_reviews_created_at ON public.reviews (created_at DESC);
