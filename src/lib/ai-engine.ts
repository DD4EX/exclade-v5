import { Language } from './i18n';

type Scheme = {
  id: string;
  category: string;
  status: string;
  last_updated: string;
  official_source: string;
  popular: boolean;
  en: { name: string; description: string; eligibility: string[]; benefits: string; documents: string[]; steps: string[] };
  ta: { name: string; description: string; eligibility: string[]; benefits: string; documents: string[]; steps: string[] };
  tl: { name: string; description: string; eligibility: string[]; benefits: string; documents: string[]; steps: string[] };
};

// Fuzzy similarity score (0-1)
function similarity(a: string, b: string): number {
  a = a.toLowerCase(); b = b.toLowerCase();
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.8;
  
  // Bigram similarity
  const getBigrams = (s: string) => {
    const bigrams = new Set<string>();
    for (let i = 0; i < s.length - 1; i++) bigrams.add(s.substring(i, i + 2));
    return bigrams;
  };
  const aBi = getBigrams(a), bBi = getBigrams(b);
  let matches = 0;
  aBi.forEach(bi => { if (bBi.has(bi)) matches++; });
  const total = aBi.size + bBi.size;
  return total === 0 ? 0 : (2 * matches) / total;
}

// Extensive keyword mappings for Tamil/Tanglish/English
const categoryKeywords: Record<string, string[]> = {
  farmer: [
    'farmer', 'farm', 'agriculture', 'crop', 'vivasayi', 'vivasayam', 'payir', 'uzhavar',
    'விவசாயி', 'விவசாயம்', 'பயிர்', 'உழவர்', 'நிலம்', 'nilam', 'land', 'cultivation',
    'kaadhu', 'காடு', 'manure', 'uram', 'உரம்', 'tractor', 'irrigation', 'neer paasanam',
    'நீர்ப்பாசனம்', 'kisan', 'கிசான்', 'seed', 'vidhai', 'விதை', 'harvest', 'aruvaadai', 'அறுவடை',
    'cattle', 'maadu', 'மாடு', 'fertilizer', 'pesticide', 'poochi marundu', 'பூச்சி மருந்து',
    'insurance', 'kaapeedu', 'காப்பீடு', 'crop loss', 'payir setham', 'பயிர் சேதம்',
  ],
  student: [
    'student', 'study', 'school', 'college', 'university', 'education', 'scholarship',
    'maanavar', 'maanavi', 'palli', 'kalloori', 'kalvi', 'laptop',
    'மாணவர்', 'மாணவி', 'பள்ளி', 'கல்லூரி', 'கல்வி', 'லேப்டாப்', 'படிப்பு', 'padippu',
    'exam', 'thervu', 'தேர்வு', 'marksheet', 'degree', 'pattam', 'பட்டம்',
    'fee', 'fees', 'kathanam', 'கட்டணம்', 'hostel', 'book', 'pusthagam', 'புத்தகம்',
    '10th', '12th', 'plus two', 'engineering', 'medical', 'polytechnic',
  ],
  women: [
    'women', 'woman', 'girl', 'female', 'pengal', 'pen', 'magalir', 'maternity', 'widow',
    'பெண்', 'பெண்கள்', 'மகளிர்', 'கர்ப்பிணி', 'karppini', 'pregnancy', 'pregnant',
    'mangai', 'மங்கை', 'thaai', 'தாய்', 'mother', 'amma', 'அம்மா',
    'marriage', 'thirumnam', 'திருமணம்', 'delivery', 'pirasavam', 'பிரசவம்',
    'self help group', 'shg', 'suyaudavi kuzhu', 'சுயஉதவி குழு',
  ],
  health: [
    'health', 'hospital', 'medical', 'medicine', 'doctor', 'sugaathara', 'maruthuva',
    'சுகாதார', 'மருத்துவ', 'மருத்துவமனை', 'marundu', 'மருந்து', 'insurance',
    'kaapeedu', 'காப்பீடு', 'operation', 'surgery', 'aruvaichikichai', 'அறுவைசிகிச்சை',
    'disease', 'noi', 'நோய்', 'treatment', 'chikichai', 'சிகிச்சை',
    'ayushman', 'aarogyam', 'ஆரோக்கியம்', 'clinic', 'nurse', 'phc', 'primary health',
  ],
  housing: [
    'house', 'housing', 'home', 'veedu', 'awas', 'வீடு', 'kudisai', 'குடிசை',
    'building', 'kattida', 'கட்டிட', 'plot', 'land', 'nilam', 'நிலம்',
    'pmay', 'pucca', 'kutcha', 'cement', 'roof', 'kooburai', 'கூரை',
    'toilet', 'kazhivarai', 'கழிவறை', 'water', 'thanni', 'தண்ணீர்',
    'electricity', 'current', 'minsaaram', 'மின்சாரம்',
  ],
  pension: [
    'pension', 'oivuthiyam', 'ஓய்வூதியம்', 'senior', 'old age', 'muthiyor', 'முதியோர்',
    'elderly', 'retirement', 'aged', 'vayathaanavar', 'வயதானவர்', '60',
    'monthly payment', 'maadha thogai', 'மாத தொகை', 'widow pension',
    'kaipenn', 'கைப்பெண்', 'disability', 'maatruthiraanali', 'மாற்றுத்திறனாளி',
    'handicap', 'oodoonam', 'ஊனம்',
  ],
};

// Intent detection
type Intent = 'find_scheme' | 'how_to_apply' | 'documents' | 'eligibility' | 'benefits' | 'greeting' | 'general';

function detectIntent(q: string): Intent {
  const applyWords = ['apply', 'how', 'eppadi', 'எப்படி', 'vinappu', 'விண்ணப்', 'panrathu', 'pannuvathu', 'seiyya', 'செய்ய', 'register', 'enroll', 'pathivu', 'பதிவு', 'step', 'process'];
  const docWords = ['document', 'aavanangal', 'ஆவணங்', 'paper', 'certificate', 'saanrithazh', 'சான்றிதழ்', 'aadhaar', 'ration', 'card', 'proof', 'என்ன வேண்டும்', 'enna vendum', 'thevai', 'தேவை'];
  const eligWords = ['eligible', 'eligibility', 'thaguthi', 'தகுதி', 'qualify', 'yarukku', 'யாருக்கு', 'who can', 'am i eligible', 'naan thaguthiya', 'நான் தகுதியா'];
  const benefitWords = ['benefit', 'nanmai', 'நன்மை', 'evvalavu', 'எவ்வளவு', 'how much', 'amount', 'thogai', 'தொகை', 'money', 'panam', 'பணம்', 'rupees', 'salary'];
  const greetWords = ['hello', 'hi', 'vanakkam', 'வணக்கம்', 'hey', 'good morning', 'good evening', 'nandri', 'நன்றி', 'thanks', 'thank'];

  if (greetWords.some(w => q.includes(w))) return 'greeting';
  if (applyWords.some(w => q.includes(w))) return 'how_to_apply';
  if (docWords.some(w => q.includes(w))) return 'documents';
  if (eligWords.some(w => q.includes(w))) return 'eligibility';
  if (benefitWords.some(w => q.includes(w))) return 'benefits';
  return 'find_scheme';
}

function matchSchemes(query: string, schemes: Scheme[], lang: Language): Scheme[] {
  const q = query.toLowerCase();
  const scored: { scheme: Scheme; score: number }[] = [];

  for (const scheme of schemes) {
    let score = 0;
    const d = scheme[lang];
    const allLangs = [scheme.en, scheme.ta, scheme.tl];

    // Direct name match (highest priority)
    for (const ld of allLangs) {
      const nameSim = similarity(q, ld.name.toLowerCase());
      if (nameSim > 0.3) score += nameSim * 10;
    }

    // Description match
    for (const ld of allLangs) {
      if (ld.description.toLowerCase().includes(q)) score += 5;
      // Word-level matching
      const qWords = q.split(/\s+/).filter(w => w.length > 2);
      for (const word of qWords) {
        if (ld.name.toLowerCase().includes(word)) score += 3;
        if (ld.description.toLowerCase().includes(word)) score += 2;
        const descWords = ld.description.toLowerCase().split(/\s+/);
        for (const dw of descWords) {
          if (similarity(word, dw) > 0.6) score += 1;
        }
      }
    }

    // Category keyword matching
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(kw => q.includes(kw) || similarity(q, kw) > 0.7)) {
        if (scheme.category === cat) score += 4;
      }
    }

    // Eligibility/benefits text match
    for (const ld of allLangs) {
      for (const el of ld.eligibility) {
        if (el.toLowerCase().includes(q)) score += 2;
        const qWords = q.split(/\s+/).filter(w => w.length > 2);
        for (const word of qWords) {
          if (el.toLowerCase().includes(word)) score += 1;
        }
      }
    }

    if (score > 0) scored.push({ scheme, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.map(s => s.scheme);
}

function formatGreeting(lang: Language): string {
  if (lang === 'ta') return '🙏 வணக்கம்! நான் உங்கள் அரசு திட்ட உதவியாளர். அரசு திட்டங்கள் பற்றி கேளுங்கள்!\n\nஎடுத்துக்காட்டு:\n• "விவசாயி திட்டம்"\n• "மாணவர் லேப்டாப்"\n• "முதியோர் ஓய்வூதியம்"\n• "வீடு திட்டம்"';
  if (lang === 'tl') return '🙏 Vanakkam! Naan ungal arasu thittam uthaviyalar. Arasu thittangal patri kelungal!\n\nEduththukkaattu:\n• "Vivasayi thittam"\n• "Maanavar laptop"\n• "Muthiyor oivuthiyam"\n• "Veedu thittam"';
  return '🙏 Hello! I am your Government Scheme Assistant. Ask me about any government scheme!\n\nExamples:\n• "Farmer schemes"\n• "Student laptop"\n• "Old age pension"\n• "Housing scheme"';
}

function formatSchemeResponse(scheme: Scheme, lang: Language, intent: Intent): string {
  const d = scheme[lang];
  
  switch (intent) {
    case 'how_to_apply':
      return `📋 **${d.name}**\n\n${lang === 'ta' ? '📝 விண்ணப்பிப்பது எப்படி:' : lang === 'tl' ? '📝 Vinapippadu eppadi:' : '📝 How to Apply:'}\n${d.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n🔗 ${scheme.official_source}`;
    case 'documents':
      return `📄 **${d.name}**\n\n${lang === 'ta' ? '📎 தேவையான ஆவணங்கள்:' : lang === 'tl' ? '📎 Thevaiyana aavaningal:' : '📎 Required Documents:'}\n${d.documents.map(doc => `• ${doc}`).join('\n')}`;
    case 'eligibility':
      return `✅ **${d.name}**\n\n${lang === 'ta' ? '👤 தகுதி:' : lang === 'tl' ? '👤 Thaguthi:' : '👤 Eligibility:'}\n${d.eligibility.map(e => `• ${e}`).join('\n')}`;
    case 'benefits':
      return `💰 **${d.name}**\n\n${lang === 'ta' ? '🎁 நன்மைகள்:' : lang === 'tl' ? '🎁 Nanmaigal:' : '🎁 Benefits:'}\n${d.benefits}`;
    default:
      return `📌 **${d.name}**\n${d.description}\n\n💰 ${d.benefits}\n✅ ${lang === 'ta' ? 'நிலை' : lang === 'tl' ? 'Nilai' : 'Status'}: ${scheme.status}\n📅 ${scheme.last_updated}`;
  }
}

export function getSmartAnswer(query: string, schemes: Scheme[], lang: Language): string {
  const q = query.toLowerCase().trim();
  if (!q) return '';

  const intent = detectIntent(q);

  // Handle greetings
  if (intent === 'greeting') return formatGreeting(lang);

  // Find matching schemes
  const matches = matchSchemes(query, schemes, lang);

  if (matches.length === 0) {
    // Try fuzzy matching on individual words
    const words = q.split(/\s+/).filter(w => w.length > 2);
    let fuzzyMatches: Scheme[] = [];
    for (const word of words) {
      const wordMatches = matchSchemes(word, schemes, lang);
      fuzzyMatches = [...fuzzyMatches, ...wordMatches];
    }
    // Deduplicate
    const seen = new Set<string>();
    fuzzyMatches = fuzzyMatches.filter(s => { if (seen.has(s.id)) return false; seen.add(s.id); return true; });

    if (fuzzyMatches.length > 0) {
      const top = fuzzyMatches.slice(0, 3);
      const header = lang === 'ta' ? '🔍 தொடர்புடைய திட்டங்கள்:' : lang === 'tl' ? '🔍 Thodarbuadiya thittangal:' : '🔍 Related schemes found:';
      return `${header}\n\n${top.map(s => formatSchemeResponse(s, lang, intent)).join('\n\n---\n\n')}`;
    }

    // No matches at all - show categories
    if (lang === 'ta') return '❓ உங்கள் கேள்விக்கு திட்டம் கிடைக்கவில்லை.\n\nஇவற்றை முயற்சிக்கவும்:\n🌾 விவசாயி\n🎓 மாணவர்\n👩 பெண்கள்\n🏥 சுகாதாரம்\n🏠 வீடு\n👴 ஓய்வூதியம்';
    if (lang === 'tl') return '❓ Ungal kelvikku thittam kidaikkavaillai.\n\nIvattrai muyarchikkavum:\n🌾 Vivasayi\n🎓 Maanavar\n👩 Pengal\n🏥 Sugaatharam\n🏠 Veedu\n👴 Oivuthiyam';
    return '❓ No matching scheme found.\n\nTry asking about:\n🌾 Farmer schemes\n🎓 Student schemes\n👩 Women welfare\n🏥 Health schemes\n🏠 Housing schemes\n👴 Pension schemes';
  }

  // Show top matches (max 3)
  const top = matches.slice(0, 3);
  const count = matches.length;
  
  let header = '';
  if (count > 3) {
    header = lang === 'ta' ? `📊 ${count} திட்டங்கள் கிடைத்தன. முதல் 3:\n\n` 
      : lang === 'tl' ? `📊 ${count} thittangal kidaiththana. Mudhal 3:\n\n`
      : `📊 ${count} schemes found. Top 3:\n\n`;
  }

  return `${header}${top.map(s => formatSchemeResponse(s, lang, intent)).join('\n\n---\n\n')}`;
}
