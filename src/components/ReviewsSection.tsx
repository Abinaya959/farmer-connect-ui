import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Star, Loader2, MessageSquarePlus, X } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  message: string;
  created_at: string;
}

export default function ReviewsSection() {
  const { language } = useLanguage();
  const isTA = language === 'ta';

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');

  const loadReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select('id, name, location, rating, message, created_at')
      .order('created_at', { ascending: false })
      .limit(12);
    if (!error && data) setReviews(data as Review[]);
    setLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const resetForm = () => {
    setName('');
    setLocation('');
    setRating(5);
    setMessage('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedLocation = location.trim();
    const trimmedMessage = message.trim();

    if (trimmedName.length < 1 || trimmedName.length > 80) {
      toast({ title: isTA ? 'பெயர் தேவை' : 'Name required', variant: 'destructive' });
      return;
    }
    if (trimmedLocation.length < 1 || trimmedLocation.length > 80) {
      toast({ title: isTA ? 'இடம் தேவை' : 'Location required', variant: 'destructive' });
      return;
    }
    if (trimmedMessage.length < 5 || trimmedMessage.length > 600) {
      toast({
        title: isTA ? 'மதிப்புரை மிகவும் சிறியது' : 'Review too short',
        description: isTA ? 'குறைந்தது 5 எழுத்துகள்' : 'Minimum 5 characters',
        variant: 'destructive',
      });
      return;
    }
    if (rating < 1 || rating > 5) return;

    setSubmitting(true);
    const { error } = await supabase.from('reviews').insert({
      name: trimmedName,
      location: trimmedLocation,
      rating,
      message: trimmedMessage,
      language,
    });
    setSubmitting(false);

    if (error) {
      toast({
        title: isTA ? 'சமர்ப்பிக்க முடியவில்லை' : 'Could not submit',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: isTA ? 'நன்றி! 🙏' : 'Thank you! 🙏',
      description: isTA ? 'உங்கள் மதிப்புரை வெளியிடப்பட்டது' : 'Your review has been published',
    });
    resetForm();
    setShowForm(false);
    loadReviews();
  };

  return (
    <section id="testimonials" className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
            {isTA ? 'விவசாயிகள் சொல்வது' : 'Trusted by Farmers'}
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {isTA ? 'எங்கள் விவசாயிகள் என்ன சொல்கிறார்கள்' : 'What Our Farmers Say'}
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            {isTA
              ? 'உங்கள் அனுபவத்தை பகிர்ந்து மற்ற விவசாயிகளுக்கு உதவுங்கள்.'
              : 'Share your experience and help fellow farmers.'}
          </p>

          <div className="mt-6">
            <Button
              onClick={() => setShowForm((v) => !v)}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {showForm ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  {isTA ? 'மூடு' : 'Close'}
                </>
              ) : (
                <>
                  <MessageSquarePlus className="mr-2 h-4 w-4" />
                  {isTA ? 'மதிப்புரையை எழுது' : 'Write a Review'}
                </>
              )}
            </Button>
          </div>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 max-w-2xl rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-white p-6 shadow-md"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-foreground">
                  {isTA ? 'உங்கள் பெயர்' : 'Your Name'}
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  placeholder={isTA ? 'எ.கா. முருகன்' : 'e.g. Murugan'}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground">
                  {isTA ? 'இடம் / மாவட்டம்' : 'Location / District'}
                </label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  maxLength={80}
                  placeholder={isTA ? 'எ.கா. கோயம்புத்தூர்' : 'e.g. Coimbatore'}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-semibold text-foreground">
                {isTA ? 'மதிப்பீடு' : 'Rating'}
              </label>
              <div className="mt-1 flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    className="p-1 transition-transform hover:scale-110"
                    aria-label={`${n} stars`}
                  >
                    <Star
                      className={`h-7 w-7 ${
                        n <= rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-semibold text-foreground">
                {isTA ? 'உங்கள் மதிப்புரை' : 'Your Review'}
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={600}
                rows={4}
                placeholder={
                  isTA
                    ? 'விவசாய் உங்களுக்கு எப்படி உதவியது?'
                    : 'How did VIVASAI help you?'
                }
                className="mt-1"
                required
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {message.length}/600
              </p>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                {isTA ? 'ரத்து செய்' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isTA ? 'சமர்ப்பிக்கவும்' : 'Submit Review'}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-12">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="mx-auto max-w-md rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 p-10 text-center">
              <MessageSquarePlus className="mx-auto h-10 w-10 text-emerald-500" />
              <h3 className="mt-3 text-lg font-bold text-foreground">
                {isTA ? 'இன்னும் மதிப்புரைகள் இல்லை' : 'No reviews yet'}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {isTA
                  ? 'முதலில் உங்கள் மதிப்புரையை எழுதுங்கள்!'
                  : 'Be the first to share your experience!'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white p-6 shadow-sm transition-all hover:shadow-lg"
                >
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className={`h-4 w-4 ${
                          j < r.rating ? 'fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-foreground line-clamp-6">
                    "{r.message}"
                  </p>
                  <div className="mt-5 flex items-center gap-3 border-t border-emerald-100 pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-200 text-sm font-bold text-emerald-800">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-foreground">{r.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        📍 {r.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}