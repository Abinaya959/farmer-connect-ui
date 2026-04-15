import { Language } from '@/contexts/LanguageContext';

export interface CropData {
  id: string;
  name_en: string;
  name_ta: string;
  category: string;
  ideal_temp_min: number;
  ideal_temp_max: number;
  ideal_humidity_min: number;
  ideal_humidity_max: number;
  max_storage_days: number;
  seasons: string[];
  yield_per_acre_kg: number;
  risk_factors: string[];
}

export interface RiskResult {
  level: 'safe' | 'warning' | 'danger';
  score: number;
  spoilageHours: number;
  reasons: { en: string; ta: string }[];
  recommendations: { en: string; ta: string; priority: 'high' | 'medium' | 'low'; icon: string }[];
}

export interface CropRecommendation {
  crop: CropData;
  suitabilityScore: number;
  expectedYield: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskWarning?: { en: string; ta: string };
}

export function calculateSpoilageRisk(
  crop: CropData,
  temperature: number,
  humidity: number,
  storageDays: number
): RiskResult {
  const reasons: { en: string; ta: string }[] = [];
  const recommendations: { en: string; ta: string; priority: 'high' | 'medium' | 'low'; icon: string }[] = [];
  let riskScore = 0;

  const tempDiff = temperature > crop.ideal_temp_max
    ? temperature - crop.ideal_temp_max
    : temperature < crop.ideal_temp_min
    ? crop.ideal_temp_min - temperature
    : 0;

  if (tempDiff > 10) {
    riskScore += 40;
    reasons.push({ en: `Temperature ${temperature}°C is far outside safe range (${crop.ideal_temp_min}-${crop.ideal_temp_max}°C)`, ta: `வெப்பநிலை ${temperature}°C பாதுகாப்பான வரம்பிற்கு வெளியே (${crop.ideal_temp_min}-${crop.ideal_temp_max}°C)` });
    recommendations.push({ en: 'Immediately adjust cold storage temperature', ta: 'உடனடியாக குளிர்சாதன வெப்பநிலையை சரிசெய்யவும்', priority: 'high', icon: '❄️' });
  } else if (tempDiff > 5) {
    riskScore += 25;
    reasons.push({ en: `Temperature ${temperature}°C is above optimal range`, ta: `வெப்பநிலை ${temperature}°C உகந்த வரம்பிற்கு மேல்` });
    recommendations.push({ en: 'Lower the storage temperature', ta: 'சேமிப்பு வெப்பநிலையை குறைக்கவும்', priority: 'medium', icon: '❄️' });
  } else if (tempDiff > 0) {
    riskScore += 10;
  }

  const humidityDiff = humidity > crop.ideal_humidity_max
    ? humidity - crop.ideal_humidity_max
    : humidity < crop.ideal_humidity_min
    ? crop.ideal_humidity_min - humidity
    : 0;

  if (humidityDiff > 20) {
    riskScore += 35;
    reasons.push({ en: `Humidity ${humidity}% causes fungal/bacterial growth risk`, ta: `ஈரப்பதம் ${humidity}% பூஞ்சை/பாக்டீரியா வளர்ச்சி ஆபத்தை ஏற்படுத்துகிறது` });
    recommendations.push({ en: 'Improve ventilation immediately', ta: 'உடனடியாக காற்றோட்டத்தை மேம்படுத்தவும்', priority: 'high', icon: '💨' });
  } else if (humidityDiff > 10) {
    riskScore += 20;
    reasons.push({ en: `Humidity ${humidity}% is outside optimal range`, ta: `ஈரப்பதம் ${humidity}% உகந்த வரம்பிற்கு வெளியே` });
    recommendations.push({ en: 'Control humidity levels', ta: 'ஈரப்பதம் அளவை கட்டுப்படுத்தவும்', priority: 'medium', icon: '💧' });
  } else if (humidityDiff > 0) {
    riskScore += 5;
  }

  const durationRatio = storageDays / crop.max_storage_days;
  if (durationRatio > 0.9) {
    riskScore += 30;
    reasons.push({ en: `Storage duration (${storageDays} days) exceeds safe limit`, ta: `சேமிப்பு காலம் (${storageDays} நாட்கள்) பாதுகாப்பான வரம்பை மீறுகிறது` });
    recommendations.push({ en: 'Move to market immediately or process', ta: 'உடனடியாக சந்தைக்கு நகர்த்தவும் அல்லது பதப்படுத்தவும்', priority: 'high', icon: '🚚' });
  } else if (durationRatio > 0.7) {
    riskScore += 15;
    reasons.push({ en: 'Storage approaching maximum duration', ta: 'சேமிப்பு அதிகபட்ச காலத்தை நெருங்குகிறது' });
    recommendations.push({ en: 'Plan for sale or processing soon', ta: 'விரைவில் விற்பனை அல்லது பதப்படுத்தலுக்கு திட்டமிடுங்கள்', priority: 'medium', icon: '📅' });
  } else if (durationRatio > 0.5) {
    riskScore += 5;
  }

  if (temperature > crop.ideal_temp_max && humidity > crop.ideal_humidity_max) {
    riskScore += 15;
    reasons.push({ en: 'High temperature + high humidity = high fungal risk', ta: 'அதிக வெப்பம் + அதிக ஈரப்பதம் = அதிக பூஞ்சை ஆபத்து' });
  }

  if (riskScore > 50) {
    recommendations.push({ en: 'Consider converting to by-products', ta: 'துணை பொருட்களாக மாற்ற பரிசீலிக்கவும்', priority: 'medium', icon: '🏭' });
    recommendations.push({ en: 'Contact buyers via e-NAM', ta: 'e-NAM மூலம் வாங்குபவர்களை தொடர்பு கொள்ளுங்கள்', priority: 'medium', icon: '📞' });
  }

  let spoilageHours: number;
  if (riskScore >= 70) {
    spoilageHours = Math.max(6, Math.round((100 - riskScore) * 2));
  } else if (riskScore >= 50) {
    spoilageHours = Math.round((100 - riskScore) * 4);
  } else {
    spoilageHours = Math.round((crop.max_storage_days - storageDays) * 24 * (1 - riskScore / 100));
  }

  let level: 'safe' | 'warning' | 'danger';
  if (riskScore >= 60) level = 'danger';
  else if (riskScore >= 30) level = 'warning';
  else level = 'safe';

  if (level === 'safe' && reasons.length === 0) {
    reasons.push({ en: 'All storage conditions are within safe limits', ta: 'அனைத்து சேமிப்பு நிலைமைகளும் பாதுகாப்பான வரம்பிற்குள் உள்ளன' });
  }

  return {
    level,
    score: Math.min(100, riskScore),
    spoilageHours,
    reasons,
    recommendations: recommendations.sort((a, b) => a.priority === 'high' ? -1 : b.priority === 'high' ? 1 : 0),
  };
}

export function getCropRecommendations(
  crops: CropData[],
  season: string,
  districtClimate: string,
  landSize: number
): CropRecommendation[] {
  const recommendations: CropRecommendation[] = [];

  for (const crop of crops) {
    if (!crop.seasons.includes(season)) continue;

    let score = 50;
    if (districtClimate === 'Coastal' || districtClimate === 'Coastal Delta') {
      if (['Rice (Paddy)', 'Banana', 'Coconut'].includes(crop.name_en)) score += 20;
      if (['Wheat', 'Pearl Millet (Bajra)'].includes(crop.name_en)) score -= 10;
    } else if (districtClimate === 'Semi-Arid') {
      if (['Cotton', 'Groundnut (Peanut)', 'Sorghum (Jowar)'].includes(crop.name_en)) score += 15;
      if (['Rice (Paddy)'].includes(crop.name_en)) score -= 5;
    } else if (districtClimate === 'Hill') {
      if (['Potato', 'Tomato'].includes(crop.name_en)) score += 25;
      if (['Sugarcane', 'Banana'].includes(crop.name_en)) score -= 20;
    }

    const totalYield = crop.yield_per_acre_kg * landSize;
    if (totalYield > 10000) score += 10;
    if (totalYield > 50000) score += 10;

    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let riskWarning: { en: string; ta: string } | undefined;

    if (crop.max_storage_days < 14) {
      riskLevel = 'high';
      riskWarning = { en: 'Highly perishable - requires immediate market access', ta: 'மிகவும் அழிந்துபோகக்கூடியது - உடனடி சந்தை அணுகல் தேவை' };
      score -= 10;
    } else if (crop.max_storage_days < 60) {
      riskLevel = 'medium';
      riskWarning = { en: 'Moderate storage life - plan sales in advance', ta: 'மிதமான சேமிப்பு ஆயுள் - முன்கூட்டியே விற்பனையை திட்டமிடுங்கள்' };
    }

    if (['Tomato', 'Onion'].includes(crop.name_en)) {
      riskWarning = { en: 'Price volatility warning - market prices fluctuate significantly', ta: 'விலை நிலையற்ற எச்சரிக்கை - சந்தை விலைகள் கணிசமாக மாறுபடும்' };
    }

    recommendations.push({ crop, suitabilityScore: Math.max(0, Math.min(100, score)), expectedYield: totalYield, riskLevel, riskWarning });
  }

  return recommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore).slice(0, 5);
}

export interface ChatResponse {
  patterns: string[];
  response: { en: string; ta: string };
}

export const chatResponses: ChatResponse[] = [
  { patterns: ['hello', 'hi', 'vanakkam', 'வணக்கம்', 'hai'], response: { en: 'Hello! 🙏 I\'m your VIVASAI AI assistant. How can I help you with your farming today?', ta: 'வணக்கம்! 🙏 நான் உங்கள் விவசாய் AI உதவியாளர். இன்று உங்கள் விவசாயத்தில் நான் எவ்வாறு உதவ முடியும்?' } },
  { patterns: ['risk', 'danger', 'spoil', 'ஆபத்து', 'கெட்டுப்போ', 'அழி'], response: { en: 'Based on your storage conditions, I can analyze the spoilage risk. Go to the Risk Prediction screen for detailed analysis.', ta: 'உங்கள் சேமிப்பு நிலைமைகளின் அடிப்படையில், நான் அழிவு ஆபத்தை பகுப்பாய்வு செய்ய முடியும். விரிவான பகுப்பாய்விற்கு ஆபத்து கணிப்பு திரைக்கு செல்லவும்.' } },
  { patterns: ['time', 'how long', 'hours', 'days', 'நேரம்', 'எவ்வளவு', 'மணி', 'நாள்'], response: { en: 'The safe storage time depends on your crop type, temperature, and humidity. Check the Risk Prediction for your specific crop.', ta: 'பாதுகாப்பான சேமிப்பு நேரம் உங்கள் பயிர் வகை, வெப்பநிலை மற்றும் ஈரப்பதத்தை பொறுத்தது.' } },
  { patterns: ['temperature', 'temp', 'cold', 'hot', 'வெப்பநிலை', 'குளிர்', 'சூடு'], response: { en: 'Temperature control is crucial! Most crops need 2-8°C for optimal storage.', ta: 'வெப்பநிலை கட்டுப்பாடு மிக முக்கியம்! பெரும்பாலான பயிர்களுக்கு உகந்த சேமிப்புக்கு 2-8°C தேவை.' } },
  { patterns: ['humidity', 'moisture', 'wet', 'ஈரப்பதம்', 'ஈரம்'], response: { en: 'High humidity can cause fungal growth and rotting. Ensure proper ventilation in your storage.', ta: 'அதிக ஈரப்பதம் பூஞ்சை வளர்ச்சி மற்றும் அழுகலை ஏற்படுத்தும். உங்கள் சேமிப்பில் சரியான காற்றோட்டத்தை உறுதி செய்யுங்கள்.' } },
  { patterns: ['scheme', 'subsidy', 'government', 'help', 'திட்டம்', 'மானியம்', 'அரசு', 'உதவி'], response: { en: 'Several government schemes support farmers! Visit the Government Schemes section for more details.', ta: 'பல அரசு திட்டங்கள் விவசாயிகளை ஆதரிக்கின்றன! மேலும் விவரங்களுக்கு அரசு திட்டங்கள் பகுதிக்கு செல்லவும்.' } },
  { patterns: ['sell', 'market', 'price', 'விற்', 'சந்தை', 'விலை'], response: { en: 'For better prices, register on e-NAM. Check local APMC markets for current rates.', ta: 'சிறந்த விலைக்கு, e-NAM இல் பதிவு செய்யுங்கள். தற்போதைய விகிதங்களுக்கு உள்ளூர் APMC சந்தைகளையும் பாருங்கள்.' } },
  { patterns: ['thank', 'thanks', 'நன்றி'], response: { en: 'You\'re welcome! 🙏 Happy farming!', ta: 'நல்வரவு! 🙏 மகிழ்ச்சியான விவசாயம்!' } },
];

export function getChatbotResponse(message: string, language: Language): string {
  const lowerMessage = message.toLowerCase();
  for (const chatResponse of chatResponses) {
    for (const pattern of chatResponse.patterns) {
      if (lowerMessage.includes(pattern.toLowerCase())) {
        return chatResponse.response[language];
      }
    }
  }
  return language === 'ta'
    ? 'உங்கள் கேள்வியை புரிந்துகொள்ள முடியவில்லை. ஆபத்து பகுப்பாய்வு, அரசு திட்டங்கள், சேமிப்பு ஆலோசனை பற்றி கேளுங்கள்.'
    : 'I didn\'t understand your question. Please ask about risk analysis, government schemes, or storage advice.';
}

export interface MarketPriceData {
  cropNameEn: string;
  cropNameTa: string;
  currentPrice: number;
  pricesLast7Days: number[];
  unit: string;
  location: string;
}

export interface SellRecommendation {
  decision: 'sell_now' | 'wait' | 'sell_immediately';
  trend: 'increasing' | 'falling' | 'stable';
  reason: { en: string; ta: string };
}

function calculatePriceTrend(prices: number[]): 'increasing' | 'falling' | 'stable' {
  if (prices.length < 2) return 'stable';
  const firstHalf = prices.slice(0, Math.floor(prices.length / 2));
  const secondHalf = prices.slice(Math.floor(prices.length / 2));
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100;
  if (changePercent > 3) return 'increasing';
  if (changePercent < -3) return 'falling';
  return 'stable';
}

export function getMarketRecommendation(
  priceData: MarketPriceData,
  spoilageRiskLevel: 'safe' | 'warning' | 'danger'
): SellRecommendation {
  const trend = calculatePriceTrend(priceData.pricesLast7Days);

  if (trend === 'falling' || spoilageRiskLevel === 'danger') {
    return {
      decision: 'sell_immediately', trend,
      reason: { en: spoilageRiskLevel === 'danger' ? 'High spoilage risk detected. Selling now prevents crop loss.' : 'Market prices are falling. Selling now secures current value.', ta: spoilageRiskLevel === 'danger' ? 'அதிக கெட்டுப்போகும் ஆபத்து. இப்போது விற்பது பயிர் இழப்பைத் தடுக்கும்.' : 'சந்தை விலைகள் குறைகின்றன. இப்போது விற்பது தற்போதைய மதிப்பைப் பாதுகாக்கும்.' }
    };
  }

  if (trend === 'increasing' && spoilageRiskLevel === 'safe') {
    return {
      decision: 'wait', trend,
      reason: { en: 'Prices are rising and your crop is safely stored. Waiting 2-3 days may increase profit.', ta: 'விலைகள் உயர்கின்றன, உங்கள் பயிர் பாதுகாப்பாக உள்ளது. 2-3 நாள் காத்திருப்பது லாபத்தை அதிகரிக்கலாம்.' }
    };
  }

  return {
    decision: 'sell_now', trend,
    reason: { en: 'Current conditions favor selling now.', ta: 'தற்போதைய நிலைமைகள் இப்போது விற்பதை ஆதரிக்கின்றன.' }
  };
}

export function simulateSensorData(): { temperature: number; humidity: number; storageDays: number } {
  return {
    temperature: Math.round((Math.random() * 25 + 5) * 10) / 10,
    humidity: Math.round(Math.random() * 40 + 50),
    storageDays: Math.round(Math.random() * 20 + 1),
  };
}
