import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function SignUpPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isTA = language === 'ta';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = (): string | null => {
    if (!name.trim()) return isTA ? 'பெயர் தேவை' : 'Name is required';
    if (!email.trim()) return isTA ? 'மின்னஞ்சல் தேவை' : 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return isTA ? 'சரியான மின்னஞ்சல் உள்ளிடவும்' : 'Enter a valid email';
    if (password.length < 6)
      return isTA ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்' : 'Password must be at least 6 characters';
    if (password !== confirmPassword)
      return isTA ? 'கடவுச்சொற்கள் பொருந்தவில்லை' : 'Passwords do not match';
    return null;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast({ variant: 'destructive', title: err });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } },
    });

    if (error) {
      const isExisting = error.message?.includes('already registered');
      toast({
        variant: 'destructive',
        title: isExisting
          ? (isTA ? 'கணக்கு ஏற்கனவே உள்ளது' : 'Account already exists')
          : (isTA ? 'பதிவு தோல்வி' : 'Sign up failed'),
        description: isExisting
          ? (isTA ? 'இந்த மின்னஞ்சலில் ஏற்கனவே கணக்கு உள்ளது. உள்நுழையவும்.' : 'An account with this email already exists. Please login instead.')
          : error.message,
      });
    } else {
      toast({
        title: isTA ? 'கணக்கு உருவாக்கப்பட்டது!' : 'Account created!',
      });
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
            {isTA ? 'கணக்கை உருவாக்கு' : 'Create Account'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isTA ? 'விவசாய் உடன் இணையுங்கள்' : 'Join Vivasai today'}
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">
              {isTA ? 'பெயர்' : 'Name'}
            </label>
            <Input
              placeholder={isTA ? 'உங்கள் பெயர்' : 'Your name'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12"
              required
            />
          </div>

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
              placeholder={isTA ? 'கடவுச்சொல் உருவாக்கவும்' : 'Create a password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">
              {isTA ? 'கடவுச்சொல் உறுதிப்படுத்தவும்' : 'Confirm Password'}
            </label>
            <Input
              type="password"
              placeholder={isTA ? 'கடவுச்சொல் மீண்டும் உள்ளிடவும்' : 'Re-enter password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12"
              required
              minLength={6}
            />
          </div>

          <Button type="submit" disabled={loading} className="h-12 w-full text-base">
            {loading
              ? (isTA ? 'ஏற்றுகிறது...' : 'Loading...')
              : (isTA ? 'கணக்கை உருவாக்கு' : 'Sign Up')}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isTA ? 'ஏற்கனவே கணக்கு உள்ளதா?' : 'Already have an account?'}{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            {isTA ? 'உள்நுழைய' : 'Login'}
          </Link>
        </p>
      </div>
    </div>
  );
}
