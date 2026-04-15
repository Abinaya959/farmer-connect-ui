import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Language, t } from '@/lib/i18n';
import LanguageToggle from './LanguageToggle';

interface LoginProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLoginSuccess: () => void;
}

const Login = ({ language, onLanguageChange, onLoginSuccess }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (authError) {
      setError(authError.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

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
            {t(language, 'loginTitle')}
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            {t(language, 'loginSubtitle')}
          </p>

          {sent ? (
            <div className="rounded-lg bg-primary/10 p-4 text-center text-sm font-medium text-primary">
              {t(language, 'otpSent')}
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t(language, 'emailPlaceholder')}
                required
                className="flex h-14 w-full rounded-lg border-2 border-input bg-background px-4 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
              />

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="flex h-14 w-full items-center justify-center rounded-lg bg-primary text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? t(language, 'loading') : t(language, 'sendOtp')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
