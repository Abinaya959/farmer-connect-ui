import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Language, t } from '@/lib/i18n';
import LanguageToggle from './LanguageToggle';

interface LoginProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLoginSuccess: () => void;
}

const Login = ({ language, onLanguageChange }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError(null);

    if (isSignUp) {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (signUpError) {
        setError(signUpError.message);
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        setError(signInError.message);
      }
    }

    setLoading(false);
  };

  const labels = {
    en: {
      signIn: 'Sign In',
      signUp: 'Create Account',
      switchToSignUp: "Don't have an account? Sign up",
      switchToSignIn: 'Already have an account? Sign in',
      passwordPlaceholder: 'Enter your password',
      createPasswordPlaceholder: 'Create a password',
    },
    ta: {
      signIn: 'உள்நுழை',
      signUp: 'கணக்கை உருவாக்கு',
      switchToSignUp: 'கணக்கு இல்லையா? பதிவு செய்யுங்கள்',
      switchToSignIn: 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையுங்கள்',
      passwordPlaceholder: 'கடவுச்சொல்லை உள்ளிடவும்',
      createPasswordPlaceholder: 'கடவுச்சொல்லை உருவாக்கவும்',
    },
  };

  const l = labels[language];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-end">
          <LanguageToggle language={language} onLanguageChange={onLanguageChange} />
        </div>

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-3xl text-primary-foreground">
            🌾
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {t(language, 'appName')}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            {t(language, 'appTagline')}
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-card-foreground">
            {isSignUp ? l.signUp : l.signIn}
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            {t(language, 'loginSubtitle')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t(language, 'emailPlaceholder')}
              required
              className="flex h-14 w-full rounded-lg border-2 border-input bg-background px-4 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignUp ? l.createPasswordPlaceholder : l.passwordPlaceholder}
              required
              minLength={6}
              className="flex h-14 w-full rounded-lg border-2 border-input bg-background px-4 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
            />

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="flex h-14 w-full items-center justify-center rounded-lg bg-primary text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? t(language, 'loading') : isSignUp ? l.signUp : l.signIn}
            </button>
          </form>

          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
            className="mt-4 w-full text-center text-sm font-medium text-primary hover:underline"
          >
            {isSignUp ? l.switchToSignIn : l.switchToSignUp}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
