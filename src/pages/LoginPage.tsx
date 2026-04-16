import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isTA = language === 'ta';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      toast({
        variant: 'destructive',
        title: isTA ? 'உள்நுழைவு தோல்வி' : 'Login failed',
        description: error.message,
      });
    } else {
      navigate('/home');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-3xl text-primary-foreground">
            🌾
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {isTA ? 'உள்நுழைய' : 'Login'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isTA ? 'உங்கள் கணக்கில் உள்நுழையுங்கள்' : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">
              {isTA ? 'கடவுச்சொல்' : 'Password'}
            </label>
            <Input
              type="password"
              placeholder={isTA ? 'கடவுச்சொல் உள்ளிடவும்' : 'Enter your password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12"
              required
              minLength={6}
            />
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
              {isTA ? 'கடவுச்சொல் மறந்துவிட்டதா?' : 'Forgot Password?'}
            </Link>
          </div>

          <Button type="submit" disabled={loading} className="h-12 w-full text-base">
            {loading
              ? (isTA ? 'ஏற்றுகிறது...' : 'Loading...')
              : (isTA ? 'உள்நுழைய' : 'Login')}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isTA ? 'கணக்கு இல்லையா?' : "Don't have an account?"}{' '}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            {isTA ? 'கணக்கை உருவாக்கு' : 'Sign Up'}
          </Link>
        </p>
      </div>
    </div>
  );
}
