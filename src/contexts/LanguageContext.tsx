import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ta' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLanguageSelected: boolean;
  setIsLanguageSelected: (selected: boolean) => void;
}

const translations: Record<string, Record<Language, string>> = {
  'app.title': { ta: '🌾 விவசாய்', en: '🌾 VIVASAI' },
  'app.tagline': { ta: 'புத்திசாலி விவசாயத்திற்கான தமிழ் AI உதவியாளர்', en: 'Tamil-first AI Assistant for Smart Farming' },
  'app.selectLanguage': { ta: 'மொழியைத் தேர்ந்தெடுக்கவும்', en: 'Select Language' },
  'language.tamil': { ta: 'தமிழ்', en: 'தமிழ்' },
  'language.english': { ta: 'English', en: 'English' },
  'home.welcome': { ta: 'வணக்கம்! 🙏', en: 'Welcome! 🙏' },
  'home.question': { ta: 'இந்த செயலியில் நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?', en: 'What would you like to do?' },
  'home.startFresh': { ta: 'புதிதாக தொடங்கு', en: 'Start From Scratch' },
  'home.startFreshDesc': { ta: 'புதிய அல்லது திட்டமிடும் விவசாயிகளுக்கு', en: 'For new or planning farmers' },
  'home.existingCrop': { ta: 'தற்போதைய பயிர் / அறுவடைக்குப் பின்', en: 'Existing Crop / After Harvest' },
  'home.existingCropDesc': { ta: 'ஏற்கனவே விதைத்த அல்லது அறுவடை செய்த விவசாயிகளுக்கு', en: 'For farmers who already planted or harvested' },
  'home.schemes': { ta: 'அரசு திட்டங்கள்', en: 'Government Schemes' },
  'scratch.title': { ta: 'புதிய பயிர் திட்டமிடல்', en: 'New Crop Planning' },
  'scratch.district': { ta: 'மாவட்டம்', en: 'District' },
  'scratch.selectDistrict': { ta: 'மாவட்டத்தைத் தேர்ந்தெடுக்கவும்', en: 'Select District' },
  'scratch.season': { ta: 'பருவம்', en: 'Season' },
  'scratch.selectSeason': { ta: 'பருவத்தைத் தேர்ந்தெடுக்கவும்', en: 'Select Season' },
  'scratch.landSize': { ta: 'நில அளவு (ஏக்கர்)', en: 'Land Size (Acres)' },
  'scratch.getRecommendation': { ta: 'AI பரிந்துரை பெறு', en: 'Get AI Recommendation' },
  'scratch.recommendedCrops': { ta: 'பரிந்துரைக்கப்பட்ட பயிர்கள்', en: 'Recommended Crops' },
  'scratch.expectedYield': { ta: 'எதிர்பார்க்கப்படும் விளைச்சல்', en: 'Expected Yield' },
  'scratch.riskLevel': { ta: 'ஆபத்து நிலை', en: 'Risk Level' },
  'scratch.viewSummary': { ta: 'சுருக்கம் & செயல் திட்டம் பார்க்க', en: 'View Summary & Action Plan' },
  'season.kharif': { ta: 'கரிப் (ஜூன்-செப்)', en: 'Kharif (Jun-Sep)' },
  'season.rabi': { ta: 'ரபி (அக்-மார்)', en: 'Rabi (Oct-Mar)' },
  'season.summer': { ta: 'கோடை (மார்-ஜூன்)', en: 'Summer (Mar-Jun)' },
  'season.zaid': { ta: 'சையத் (மார்-ஜூன்)', en: 'Zaid (Mar-Jun)' },
  'existing.title': { ta: 'தற்போதைய நிலை', en: 'Current Status' },
  'existing.cropInField': { ta: 'வயலில் பயிர்', en: 'Crop in Field' },
  'existing.cropInFieldDesc': { ta: 'வளரும் பயிர்களை கண்காணிக்க', en: 'Monitor growing crops' },
  'existing.harvested': { ta: 'அறுவடை செய்யப்பட்ட பயிர்', en: 'Harvested Crop' },
  'existing.harvestedDesc': { ta: 'குளிர்சாதன சேமிப்பு மேலாண்மை', en: 'Cold storage management' },
  'existing.proceed': { ta: 'தொடரவும்', en: 'Proceed' },
  'storage.title': { ta: 'சேமிப்பு நிலை பரிசோதனை', en: 'Storage Condition Check' },
  'storage.selectCrop': { ta: 'பயிரைத் தேர்ந்தெடுக்கவும்', en: 'Select Crop' },
  'storage.temperature': { ta: 'வெப்பநிலை (°C)', en: 'Temperature (°C)' },
  'storage.humidity': { ta: 'ஈரப்பதம் (%)', en: 'Humidity (%)' },
  'storage.storageDays': { ta: 'சேமிப்பு நாட்கள்', en: 'Storage Days' },
  'storage.simulateData': { ta: '📊 தானியங்கி தரவு', en: '📊 Simulate Live Data' },
  'storage.simulated': { ta: 'உருவகப்படுத்தப்பட்டது', en: 'Simulated' },
  'storage.sensorNote': { ta: 'உண்மையான வாழ்க்கையில், இந்த தரவு சென்சார்களிலிருந்து வருகிறது. முன்மாதிரிக்கு, நாங்கள் மதிப்புகளை உருவகப்படுத்துகிறோம்.', en: 'In real life, this data comes from sensors. For prototype, we simulate values.' },
  'storage.analyzeRisk': { ta: '🔍 ஆபத்தை பகுப்பாய்வு செய்', en: '🔍 Analyze Risk' },
  'risk.title': { ta: 'AI ஆபத்து கணிப்பு', en: 'AI Risk Prediction' },
  'risk.safe': { ta: '✅ பாதுகாப்பானது', en: '✅ Safe' },
  'risk.warning': { ta: '⚠️ எச்சரிக்கை', en: '⚠️ Warning' },
  'risk.danger': { ta: '🚨 அதிக அழிவு ஆபத்து', en: '🚨 High Spoilage Risk' },
  'risk.timeRemaining': { ta: 'கெட்டுப்போவதற்கு முன் நேரம்', en: 'Time Before Spoilage' },
  'risk.hours': { ta: 'மணி நேரம்', en: 'hours' },
  'risk.days': { ta: 'நாட்கள்', en: 'days' },
  'risk.whyResult': { ta: '❓ ஏன் இந்த முடிவு?', en: '❓ Why This Result?' },
  'risk.recommendations': { ta: '💡 பரிந்துரைக்கப்பட்ட செயல்கள்', en: '💡 Recommended Actions' },
  'actions.title': { ta: 'புத்திசாலி செயல் பரிந்துரைகள்', en: 'Smart Action Recommendations' },
  'actions.doFirst': { ta: 'முதலில் செய்யுங்கள்', en: 'Do First' },
  'actions.canWait': { ta: 'காத்திருக்கலாம்', en: 'Can Wait' },
  'actions.viewSummary': { ta: 'இறுதி சுருக்கம் பார்க்க', en: 'View Final Summary' },
  'chat.title': { ta: 'AI உதவியாளர்', en: 'AI Assistant' },
  'chat.placeholder': { ta: 'உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யவும்...', en: 'Type your question here...' },
  'chat.send': { ta: 'அனுப்பு', en: 'Send' },
  'schemes.title': { ta: 'அரசு திட்டங்கள் & ஆதரவு', en: 'Government Schemes & Support' },
  'schemes.search': { ta: 'திட்டங்களை தேடு...', en: 'Search schemes...' },
  'schemes.all': { ta: 'அனைத்தும்', en: 'All' },
  'schemes.subsidy': { ta: 'மானியம்', en: 'Subsidy' },
  'schemes.loan': { ta: 'கடன்', en: 'Loan' },
  'schemes.insurance': { ta: 'காப்பீடு', en: 'Insurance' },
  'schemes.support': { ta: 'ஆதரவு', en: 'Support' },
  'schemes.benefits': { ta: 'பலன்கள்', en: 'Benefits' },
  'schemes.eligibility': { ta: 'தகுதி', en: 'Eligibility' },
  'schemes.coldStorageSupport': { ta: '❄️ குளிர்சாதன ஆதரவு', en: '❄️ Cold Storage Support' },
  'schemes.apply': { ta: 'விண்ணப்பிக்க', en: 'Apply' },
  'explain.title': { ta: 'ஏன் இந்த முடிவு?', en: 'Why This Result?' },
  'explain.tempStatus': { ta: 'வெப்பநிலை நிலை', en: 'Temperature Status' },
  'explain.humidityStatus': { ta: 'ஈரப்பதம் நிலை', en: 'Humidity Status' },
  'explain.durationStatus': { ta: 'சேமிப்பு காலம் நிலை', en: 'Storage Duration Status' },
  'explain.safe': { ta: 'பாதுகாப்பான வரம்பில்', en: 'Within safe range' },
  'explain.exceeded': { ta: 'வரம்பை மீறியது', en: 'Exceeded limit' },
  'explain.backToRisk': { ta: 'ஆபத்து திரைக்கு திரும்பு', en: 'Back to Risk Screen' },
  'summary.title': { ta: 'சுருக்கம் & செயல் திட்டம்', en: 'Summary & Action Plan' },
  'summary.crop': { ta: 'பயிர்', en: 'Crop' },
  'summary.status': { ta: 'நிலை', en: 'Status' },
  'summary.action': { ta: 'பரிந்துரைக்கப்பட்ட செயல்', en: 'Recommended Action' },
  'summary.timeWindow': { ta: 'செயல்பட நேர சாளரம்', en: 'Time Window for Action' },
  'summary.share': { ta: '📤 பகிர்', en: '📤 Share' },
  'summary.newAnalysis': { ta: '🔄 புதிய பகுப்பாய்வு', en: '🔄 New Analysis' },
  'summary.home': { ta: '🏠 முகப்புக்கு', en: '🏠 Return Home' },
  'home.cropPrediction': { ta: 'பயிர் கணிப்பு', en: 'Crop Prediction' },
  'home.cropPredictionDesc': { ta: 'AI மூலம் உங்கள் நிலத்திற்கு சிறந்த பயிரை கண்டறியுங்கள்', en: 'Find the best crop for your land using AI' },
  'home.govSchemes': { ta: 'அரசு திட்டங்கள்', en: 'Govt Schemes' },
  'home.govSchemesDesc': { ta: 'தமிழ்நாடு விவசாயிகளுக்கான திட்டங்கள் & மானியங்கள்', en: 'Schemes & subsidies for TN farmers' },
  'home.quickActions': { ta: 'விரைவு செயல்கள்', en: 'Quick Actions' },
  'home.viewAll': { ta: 'அனைத்தும் பார்க்க', en: 'View All' },
  'home.topSchemes': { ta: 'முக்கிய அரசு திட்டங்கள்', en: 'Top Government Schemes' },
  'home.riskCheck': { ta: 'ஆபத்து சோதனை', en: 'Risk Check' },
  'home.riskCheckDesc': { ta: 'சேமிப்பு நிலையை சரிபார்க்கவும்', en: 'Check storage conditions' },
  'home.marketPrices': { ta: 'சந்தை விலை', en: 'Market Prices' },
  'home.marketPricesDesc': { ta: 'இன்றைய மண்டி விலைகள்', en: "Today's mandi prices" },
  'common.back': { ta: '← பின்', en: '← Back' },
  'common.next': { ta: 'அடுத்து →', en: 'Next →' },
  'common.loading': { ta: 'ஏற்றுகிறது...', en: 'Loading...' },
  'common.error': { ta: 'பிழை ஏற்பட்டது', en: 'An error occurred' },
  'common.perAcre': { ta: 'ஏக்கருக்கு', en: 'per acre' },
  'common.kg': { ta: 'கிலோ', en: 'kg' },
  'riskLevel.low': { ta: '🟢 குறைந்த ஆபத்து', en: '🟢 Low Risk' },
  'riskLevel.medium': { ta: '🟡 நடுத்தர ஆபத்து', en: '🟡 Medium Risk' },
  'riskLevel.high': { ta: '🔴 அதிக ஆபத்து', en: '🔴 High Risk' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ta');
  const [isLanguageSelected, setIsLanguageSelected] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('vivasai_language') as Language;
    const languageSelected = localStorage.getItem('vivasai_language_selected');

    if (savedLanguage && (savedLanguage === 'ta' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }

    if (languageSelected === 'true') {
      setIsLanguageSelected(true);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('vivasai_language', lang);
    localStorage.setItem('vivasai_language_selected', 'true');
    setIsLanguageSelected(true);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    return translation[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLanguageSelected, setIsLanguageSelected }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
