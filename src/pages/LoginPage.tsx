import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from '@/contexts/SessionContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Phone, Mail, UserCircle } from 'lucide-react';

type LoginMode = 'select' | 'phone' | 'email';

export default function LoginPage() {
  const { language } = useLanguage();
  const { setLoginMode } = useSession();
  const navigate = useNavigate();

  const [mode, setMode] = useState<LoginMode>('select');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const handlePhoneLogin = () => {
    if (phoneNumber.length >= 10) {
      setLoginMode('phone');
      navigate('/home');
    }
  };

  const handleEmailLogin = () => {
    if (email.includes('@')) {
      setLoginMode('email');
      navigate('/home');
    }
  };

  const handleGuestContinue = () => {
    setLoginMode('guest');
    navigate('/home');
  };

  const title = language === 'ta'
    ? 'தொடருவதற்கு ஒரு முறையை தேர்ந்தெடுக்கவும்'
    : 'Choose a method to continue';

  if (mode === 'phone') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
        <Card className="w-full max-w-sm space-y-6 p-6 text-center">
          <div className="text-4xl">📱</div>
          <h1 className="text-2xl font-bold text-foreground">
            {language === 'ta' ? 'மொபைல் எண்' : 'Mobile Number'}
          </h1>
          <Input
            type="tel"
            placeholder={language === 'ta' ? 'மொபைல் எண் உள்ளிடவும்' : 'Enter mobile number'}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="h-14 text-center text-lg"
            maxLength={10}
          />
          <p className="text-sm text-muted-foreground">
            {language === 'ta' ? '📌 OTP உருவகப்படுத்தப்பட்டது - முன்மாதிரி பயன்முறை' : '📌 OTP simulated - Demo mode'}
          </p>
          <Button onClick={handlePhoneLogin} disabled={phoneNumber.length < 10} className="h-14 w-full text-lg">
            {language === 'ta' ? 'தொடரவும்' : 'Continue'}
          </Button>
          <Button variant="ghost" onClick={() => setMode('select')} className="text-muted-foreground">
            {language === 'ta' ? '← பின்' : '← Back'}
          </Button>
        </Card>
      </div>
    );
  }

  if (mode === 'email') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
        <Card className="w-full max-w-sm space-y-6 p-6 text-center">
          <div className="text-4xl">✉️</div>
          <h1 className="text-2xl font-bold text-foreground">
            {language === 'ta' ? 'மின்னஞ்சல்' : 'Email'}
          </h1>
          <Input
            type="email"
            placeholder={language === 'ta' ? 'மின்னஞ்சல் உள்ளிடவும்' : 'Enter email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 text-center text-lg"
          />
          <p className="text-sm text-muted-foreground">
            {language === 'ta' ? '📌 கடவுச்சொல் தேவையில்லை - முன்மாதிரி பயன்முறை' : '📌 No password required - Demo mode'}
          </p>
          <Button onClick={handleEmailLogin} disabled={!email.includes('@')} className="h-14 w-full text-lg">
            {language === 'ta' ? 'தொடரவும்' : 'Continue'}
          </Button>
          <Button variant="ghost" onClick={() => setMode('select')} className="text-muted-foreground">
            {language === 'ta' ? '← பின்' : '← Back'}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-3 text-5xl">🌾</div>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
        </div>

        <div className="space-y-3">
          <Card className="cursor-pointer p-5 transition-all hover:border-primary" onClick={() => setMode('phone')}>
            <div className="flex items-center gap-4">
              <Phone className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">
                  {language === 'ta' ? 'மொபைல் எண் மூலம் உள்நுழைய' : 'Login with Mobile Number'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'ta' ? 'OTP மூலம் சரிபார்க்கவும்' : 'Verify via OTP'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="cursor-pointer p-5 transition-all hover:border-primary" onClick={() => setMode('email')}>
            <div className="flex items-center gap-4">
              <Mail className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">
                  {language === 'ta' ? 'மின்னஞ்சல் மூலம் உள்நுழைய' : 'Login with Email'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'ta' ? 'மின்னஞ்சல் ஐடி பயன்படுத்தவும்' : 'Use your email ID'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="cursor-pointer p-5 transition-all hover:border-primary" onClick={handleGuestContinue}>
            <div className="flex items-center gap-4">
              <UserCircle className="h-6 w-6 text-muted-foreground" />
              <div>
                <h3 className="font-semibold text-foreground">
                  {language === 'ta' ? 'விருந்தினராக தொடரவும்' : 'Continue as Guest'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'ta' ? 'பதிவு தேவையில்லை' : 'No registration needed'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          🔒 {language === 'ta' ? 'உங்கள் தரவு பாதுகாப்பாக சேமிக்கப்படும்' : 'Your data is stored securely'}
        </p>
      </div>
    </div>
  );
}
