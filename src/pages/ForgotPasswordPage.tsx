import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPasswordPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const isTA = language === 'ta';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast({ variant: 'destructive', title: error.message });
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {isTA ? 'கடவுச்சொல் மீட்டமை' : 'Reset Password'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isTA ? 'உங்கள் மின்னஞ்சலுக்கு மீட்டமைப்பு இணைப்பை அனுப்புவோம்' : "We'll send a reset link to your email"}
          </p>
        </div>

        {sent ? (
          <div className="rounded-2xl border bg-card p-6 text-center shadow-sm">
            <p className="text-lg font-medium text-card-foreground">
              ✉️ {isTA ? 'மின்னஞ்சல் அனுப்பப்பட்டது!' : 'Email sent!'}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {isTA ? 'உங்கள் inbox சரிபார்க்கவும்' : 'Check your inbox for the reset link'}
            </p>
            <Link to="/login">
              <Button variant="outline" className="mt-4">
                {isTA ? 'உள்நுழைவுக்கு திரும்பு' : 'Back to Login'}
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">
                {isTA ? 'மின்னஞ்சல்' : 'Email'}
              </label>
              <Input
                type="email"
                placeholder={isTA ? 'மின்னஞ்சல் உள்ளிடவும்' : 'Enter your email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="h-12 w-full text-base">
              {loading ? (isTA ? 'ஏற்றுகிறது...' : 'Sending...') : (isTA ? 'மீட்டமைப்பு இணைப்பை அனுப்பு' : 'Send Reset Link')}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-muted-foreground">
          <Link to="/login" className="font-medium text-primary hover:underline">
            {isTA ? '← உள்நுழைவுக்கு திரும்பு' : '← Back to Login'}
          </Link>
        </p>
      </div>
    </div>
  );
}
