import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function ResetPasswordPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isTA = language === 'ta';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setReady(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ variant: 'destructive', title: isTA ? 'குறைந்தது 6 எழுத்துகள்' : 'Minimum 6 characters' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ variant: 'destructive', title: isTA ? 'கடவுச்சொற்கள் பொருந்தவில்லை' : 'Passwords do not match' });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast({ variant: 'destructive', title: error.message });
    } else {
      toast({ title: isTA ? 'கடவுச்சொல் புதுப்பிக்கப்பட்டது!' : 'Password updated!' });
      navigate('/home');
    }
    setLoading(false);
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">{isTA ? 'ஏற்றுகிறது...' : 'Loading...'}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {isTA ? 'புதிய கடவுச்சொல்' : 'New Password'}
          </h1>
        </div>

        <form onSubmit={handleReset} className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">
              {isTA ? 'புதிய கடவுச்சொல்' : 'New Password'}
            </label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12" required minLength={6} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">
              {isTA ? 'கடவுச்சொல் உறுதிப்படுத்தவும்' : 'Confirm Password'}
            </label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-12" required minLength={6} />
          </div>
          <Button type="submit" disabled={loading} className="h-12 w-full text-base">
            {loading ? (isTA ? 'ஏற்றுகிறது...' : 'Updating...') : (isTA ? 'கடவுச்சொல் புதுப்பிக்கவும்' : 'Update Password')}
          </Button>
        </form>
      </div>
    </div>
  );
}
