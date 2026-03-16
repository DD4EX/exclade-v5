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

// Normalize text: remove punctuation, extra spaces, lowercase
function normalize(s: string): string {
  return s.toLowerCase().replace(/[.,!?;:'"()\[\]{}]/g, '').replace(/\s+/g, ' ').trim();
}

// Bigram similarity (0-1)
function similarity(a: string, b: string): number {
  a = normalize(a); b = normalize(b);
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.8;
  const getBigrams = (s: string) => {
    const bi = new Set<string>();
    for (let i = 0; i < s.length - 1; i++) bi.add(s.substring(i, i + 2));
    return bi;
  };
  const aBi = getBigrams(a), bBi = getBigrams(b);
  let matches = 0;
  aBi.forEach(bi => { if (bBi.has(bi)) matches++; });
  const total = aBi.size + bBi.size;
  return total === 0 ? 0 : (2 * matches) / total;
}

// Phonetic simplification for Tanglish (handles common spelling variations)
function phoneticKey(word: string): string {
  return word.toLowerCase()
    .replace(/th/g, 't')
    .replace(/sh/g, 's')
    .replace(/ch/g, 'c')
    .replace(/ph/g, 'f')
    .replace(/aa/g, 'a')
    .replace(/ee/g, 'i')
    .replace(/oo/g, 'u')
    .replace(/ai/g, 'e')
    .replace(/ou/g, 'o')
    .replace(/[aeiou]+/g, m => m[0]) // collapse repeated vowels
    .replace(/(.)\1+/g, '$1'); // collapse repeated consonants
}

// Extensive keyword mappings for Tamil/Tanglish/English - expanded for uneducated users
const categoryKeywords: Record<string, string[]> = {
  farmer: [
    'farmer', 'farm', 'agriculture', 'crop', 'vivasayi', 'vivasayam', 'payir', 'uzhavar',
    'விவசாயி', 'விவசாயம்', 'பயிர்', 'உழவர்', 'நிலம்', 'nilam', 'land', 'cultivation',
    'manure', 'uram', 'உரம்', 'tractor', 'irrigation', 'neer paasanam', 'நீர்ப்பாசனம்',
    'kisan', 'கிசான்', 'seed', 'vidhai', 'விதை', 'harvest', 'aruvaadai', 'அறுவடை',
    'cattle', 'maadu', 'மாடு', 'fertilizer', 'pesticide', 'poochi', 'பூச்சி',
    'insurance', 'kaapeedu', 'காப்பீடு', 'crop loss', 'payir setham', 'பயிர் சேதம்',
    'goat', 'aadu', 'ஆடு', 'sheep', 'semmari', 'செம்மறி', 'sandhai', 'சந்தை', 'market',
    'velai', 'வேலை', 'work', 'nrega', 'naal velai', '100 days', '100 நாள்',
    'pannai', 'பண்ணை', 'kozhi', 'கோழி', 'chicken', 'pasu', 'பசு', 'cow',
    'thozhil', 'தொழில்', 'pump', 'pampu', 'பம்பு', 'bore', 'well', 'kinaru', 'கிணறு',
  ],
  student: [
    'student', 'study', 'school', 'college', 'university', 'education', 'scholarship',
    'maanavar', 'maanavi', 'palli', 'kalloori', 'kalvi', 'laptop',
    'மாணவர்', 'மாணவி', 'பள்ளி', 'கல்லூரி', 'கல்வி', 'லேப்டாப்', 'படிப்பு', 'padippu',
    'exam', 'thervu', 'தேர்வு', 'degree', 'pattam', 'பட்டம்',
    'fee', 'fees', 'kathanam', 'கட்டணம்', 'hostel', 'book', 'pusthagam', 'புத்தகம்',
    '10th', '12th', 'plus two', 'engineering', 'medical', 'polytechnic',
    'bus pass', 'cycle', 'bicycle', 'mithivandi', 'மிதிவண்டி', 'uniform', 'seerudai', 'சீருடை',
    'noon meal', 'madhiya unavu', 'மதிய உணவு', 'mid day', 'lunch',
    'naan mudhalvan', 'நான் முதல்வன்', 'skill', 'thiran', 'திறன்', 'training', 'payirchi', 'பயிற்சி',
    'padi', 'படி', 'read', 'learn', 'bag', 'notebook',
    'sukanya', 'சுகன்யா', 'girl child', 'penn kuzhanthai', 'பெண் குழந்தை',
  ],
  women: [
    'women', 'woman', 'girl', 'female', 'pengal', 'pen', 'magalir', 'maternity', 'widow',
    'பெண்', 'பெண்கள்', 'மகளிர்', 'கர்ப்பிணி', 'karppini', 'pregnancy', 'pregnant',
    'mangai', 'மங்கை', 'thaai', 'தாய்', 'mother', 'amma', 'அம்மா',
    'marriage', 'thirumnam', 'திருமணம்', 'delivery', 'pirasavam', 'பிரசவம்',
    'self help group', 'shg', 'suyaudavi kuzhu', 'சுயஉதவி குழு',
    'sewing', 'thaiyal', 'தையல்', 'machine', 'iyanthiram', 'இயந்திரம்',
    'mixie', 'mixer', 'மிக்ஸி', 'grinder', 'gas', 'lpg', 'ujjwala',
    'baby', 'kuzhanthai', 'குழந்தை', 'mudra', 'loan', 'kadan', 'கடன்',
    'ponnu', 'பொண்ணு', 'wife', 'manaivi', 'மனைவி', 'urimai', 'உரிமை',
    'kalyanam', 'கல்யாணம்', 'thangam', 'தங்கம்', 'gold',
  ],
  health: [
    'health', 'hospital', 'medical', 'medicine', 'doctor', 'sugaathara', 'maruthuva',
    'சுகாதார', 'மருத்துவ', 'மருத்துவமனை', 'marundu', 'மருந்து', 'insurance',
    'kaapeedu', 'காப்பீடு', 'operation', 'surgery', 'aruvaichikichai', 'அறுவைசிகிச்சை',
    'disease', 'noi', 'நோய்', 'treatment', 'chikichai', 'சிகிச்சை',
    'ayushman', 'aarogyam', 'ஆரோக்கியம்', 'clinic', 'phc', 'primary health',
    'amma unavagam', 'canteen', 'food', 'unavu', 'உணவு', 'rice', 'arisi', 'அரிசி',
    'ration', 'ரேஷன்', 'pds', 'bank account', 'jan dhan', 'ஜன் தன்',
    'accident', 'vipathu', 'விபத்து', 'life', 'jeevan', 'ஜீவன்', 'death', 'irappu', 'இறப்பு',
    'udambu', 'உடம்பு', 'body', 'sick', 'noyaali', 'நோயாளி', 'patient',
    'saapadu', 'சாப்பாடு', 'sapadu', 'idli', 'இட்லி', 'saadham', 'சாதம்',
  ],
  housing: [
    'house', 'housing', 'home', 'veedu', 'awas', 'வீடு', 'kudisai', 'குடிசை',
    'building', 'kattida', 'கட்டிட', 'plot', 'land', 'nilam', 'நிலம்',
    'pmay', 'pucca', 'kutcha', 'cement', 'roof', 'kooburai', 'கூரை',
    'toilet', 'kazhivarai', 'கழிவறை', 'bathroom', 'latrine',
    'water', 'thanni', 'தண்ணீர்', 'kudineer', 'குடிநீர்',
    'electricity', 'current', 'minsaaram', 'மின்சாரம்', 'eb', 'unit',
    'swachh', 'சுவச்', 'clean', 'suthham', 'சுத்தம்',
    'free electricity', 'ilavasa minsaaram', 'இலவச மின்சாரம்',
  ],
  pension: [
    'pension', 'oivuthiyam', 'ஓய்வூதியம்', 'senior', 'old age', 'muthiyor', 'முதியோர்',
    'elderly', 'retirement', 'aged', 'vayathaanavar', 'வயதானவர்', '60',
    'monthly payment', 'maadha thogai', 'மாத தொகை', 'widow pension',
    'kaipenn', 'கைப்பெண்', 'disability', 'maatruthiraanali', 'மாற்றுத்திறனாளி',
    'handicap', 'oodoonam', 'ஊனம்', 'blind', 'deaf', 'paarvai', 'பார்வை',
    'atal', 'அடல்', 'destitute', 'aatharavu', 'ஆதரவு', 'helpless',
    'thatha', 'தாத்தா', 'paatti', 'பாட்டி', 'grandpa', 'grandma',
    'vidavai', 'விதவை', 'vitavai',
  ],
  rural: [
    'rural', 'village', 'gramam', 'கிராமம்', 'panchayat', 'பஞ்சாயத்து',
    'road', 'saalai', 'சாலை', 'drainage', 'vadigaal', 'வடிகால்',
    'street light', 'theru vilakku', 'தெரு விளக்கு', 'nrega', 'mgnrega',
    '100 days', '100 naal', '100 நாள்', 'employment', 'velai', 'வேலை',
  ],
  employment: [
    'employment', 'job', 'velai', 'வேலை', 'skill', 'thiran', 'திறன்',
    'training', 'payirchi', 'பயிற்சி', 'loan', 'kadan', 'கடன்',
    'mudra', 'startup', 'business', 'thozhil', 'தொழில்', 'unemployed',
    'velaiyinmai', 'வேலையின்மை', 'self employed', 'suyathozhil', 'சுயதொழில்',
  ],
  children: [
    'children', 'child', 'kuzhanthai', 'குழந்தை', 'baby', 'infant',
    'orphan', 'anaadhai', 'அநாதை', 'anganwadi', 'அங்கன்வாடி',
    'icds', 'nutrition', 'oottachchathu', 'ஊட்டச்சத்து',
  ],
  food: [
    'food', 'unavu', 'உணவு', 'rice', 'arisi', 'அரிசி', 'ration', 'ரேஷன்',
    'pds', 'pongal', 'பொங்கல்', 'gas', 'lpg', 'ujjwala', 'electricity',
    'minsaaram', 'மின்சாரம்', 'free rice', 'ilavasa arisi', 'இலவச அரிசி',
    'saapadu', 'சாப்பாடு', 'saadham', 'சாதம்',
  ],
  special: [
    'gig', 'worker', 'jan dhan', 'bank account', 'toilet', 'kazhivarai', 'கழிவறை',
    'swachh', 'sports', 'vilaiyaattu', 'விளையாட்டு',
  ],
};

// Common colloquial/broken phrases to intent mapping
const colloquialPatterns: { pattern: RegExp; intent: Intent; category?: string }[] = [
  // Tamil colloquial
  { pattern: /எனக்கு\s*(என்ன|enna)\s*(திட்ட|thitt)/i, intent: 'find_scheme' },
  { pattern: /எனக்கு\s*(கிடை|kidai)/i, intent: 'find_scheme' },
  { pattern: /என்ன\s*(திட்ட|scheme)/i, intent: 'find_scheme' },
  { pattern: /(panam|பணம்|money|kaasu|காசு|rupees|ruba)/i, intent: 'benefits' },
  { pattern: /(eppadi|எப்படி|how|evvalam|எவ்வளவு)/i, intent: 'how_to_apply' },
  { pattern: /(enna vendum|என்ன வேண்டும்|what need)/i, intent: 'documents' },
  // Simple questions uneducated people might ask
  { pattern: /(veedu vendum|வீடு வேண்டும்|need house|veedu kodu)/i, intent: 'find_scheme', category: 'housing' },
  { pattern: /(panam vendum|பணம் வேண்டும்|need money)/i, intent: 'find_scheme' },
  { pattern: /(velai vendum|வேலை வேண்டும்|need work|job)/i, intent: 'find_scheme', category: 'farmer' },
  { pattern: /(hospital|doctor|sick|udambu sari illai|உடம்பு சரி இல்லை)/i, intent: 'find_scheme', category: 'health' },
  { pattern: /(padikka|படிக்க|study|school fee)/i, intent: 'find_scheme', category: 'student' },
  { pattern: /(kalyanam|கல்யாணம்|marriage|thirumnam)/i, intent: 'find_scheme', category: 'women' },
];

type Intent = 'find_scheme' | 'how_to_apply' | 'documents' | 'eligibility' | 'benefits' | 'greeting' | 'general';

function detectIntent(q: string): { intent: Intent; forcedCategory?: string } {
  const qn = normalize(q);

  const greetWords = ['hello', 'hi', 'vanakkam', 'வணக்கம்', 'hey', 'good morning', 'good evening', 'nandri', 'நன்றி', 'thanks', 'thank', 'helo', 'hai', 'da', 'bro', 'anna', 'அண்ணா', 'akka', 'அக்கா'];
  if (greetWords.some(w => qn.includes(w)) && qn.split(/\s+/).length <= 3) return { intent: 'greeting' };

  // Check colloquial patterns first
  for (const cp of colloquialPatterns) {
    if (cp.pattern.test(q)) return { intent: cp.intent, forcedCategory: cp.category };
  }

  const applyWords = ['apply', 'how', 'eppadi', 'எப்படி', 'vinappu', 'விண்ணப்', 'panrathu', 'pannuvathu', 'seiyya', 'செய்ய', 'register', 'enroll', 'pathivu', 'பதிவு', 'step', 'process', 'vazhimurai', 'வழிமுறை'];
  const docWords = ['document', 'aavanangal', 'ஆவணங்', 'paper', 'certificate', 'saanrithazh', 'சான்றிதழ்', 'aadhaar', 'ration', 'card', 'proof', 'என்ன வேண்டும்', 'enna vendum', 'thevai', 'தேவை'];
  const eligWords = ['eligible', 'eligibility', 'thaguthi', 'தகுதி', 'qualify', 'yarukku', 'யாருக்கு', 'who can', 'am i eligible', 'naan thaguthiya', 'நான் தகுதியா', 'yaaru', 'யாரு'];
  const benefitWords = ['benefit', 'nanmai', 'நன்மை', 'evvalavu', 'எவ்வளவு', 'how much', 'amount', 'thogai', 'தொகை', 'money', 'panam', 'பணம்', 'rupees', 'salary', 'ethana', 'எத்தன'];

  if (applyWords.some(w => qn.includes(w))) return { intent: 'how_to_apply' };
  if (docWords.some(w => qn.includes(w))) return { intent: 'documents' };
  if (eligWords.some(w => qn.includes(w))) return { intent: 'eligibility' };
  if (benefitWords.some(w => qn.includes(w))) return { intent: 'benefits' };
  return { intent: 'find_scheme' };
}

function matchSchemes(query: string, schemes: Scheme[], lang: Language, forcedCategory?: string): Scheme[] {
  const q = normalize(query);
  const qPhonetic = phoneticKey(q);
  const scored: { scheme: Scheme; score: number }[] = [];

  for (const scheme of schemes) {
    let score = 0;
    const allLangs = [scheme.en, scheme.ta, scheme.tl];

    // Forced category boost
    if (forcedCategory && scheme.category === forcedCategory) score += 5;

    // Direct name match (highest priority)
    for (const ld of allLangs) {
      const nameSim = similarity(q, ld.name);
      if (nameSim > 0.3) score += nameSim * 10;
      // Phonetic name match
      if (phoneticKey(ld.name).includes(qPhonetic) && qPhonetic.length > 3) score += 6;
    }

    // Description match
    const qWords = q.split(/\s+/).filter(w => w.length > 2);
    for (const ld of allLangs) {
      if (normalize(ld.description).includes(q)) score += 5;
      for (const word of qWords) {
        const wordPhonetic = phoneticKey(word);
        if (normalize(ld.name).includes(word)) score += 3;
        if (normalize(ld.description).includes(word)) score += 2;
        // Phonetic matching for Tanglish variations
        if (wordPhonetic.length > 3) {
          if (phoneticKey(ld.name).includes(wordPhonetic)) score += 2;
          if (phoneticKey(ld.description).includes(wordPhonetic)) score += 1;
        }
      }
    }

    // Category keyword matching
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(kw => q.includes(kw) || similarity(q, kw) > 0.7 || (kw.length > 4 && phoneticKey(q).includes(phoneticKey(kw))))) {
        if (scheme.category === cat) score += 4;
      }
    }

    // Eligibility/benefits text match
    for (const ld of allLangs) {
      for (const el of ld.eligibility) {
        const elN = normalize(el);
        if (elN.includes(q)) score += 2;
        for (const word of qWords) {
          if (elN.includes(word)) score += 1;
        }
      }
      if (normalize(ld.benefits).includes(q)) score += 2;
    }

    if (score > 0) scored.push({ scheme, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.map(s => s.scheme);
}

function formatGreeting(lang: Language): string {
  if (lang === 'ta') return '🙏 வணக்கம்! நான் உங்கள் அரசு திட்ட உதவியாளர்.\n\nகீழே உள்ள பொத்தான்களை அழுத்தவும் அல்லது உங்கள் கேள்வியை பேசுங்கள்/தட்டச்சு செய்யுங்கள்!\n\n🔥 பிரபலமான கேள்விகள்:\n• "விவசாயி திட்டம்"\n• "பெண்கள் திட்டம்"\n• "ஓய்வூதியம்"\n• "வீடு திட்டம்"\n• "இலவச அரிசி"\n• "மாணவர் லேப்டாப்"';
  if (lang === 'tl') return '🙏 Vanakkam! Naan ungal arasu thittam uthaviyalar.\n\nKeele ulla buttons ai press pannungal allathu ungal kelviyai pesungal/type pannungal!\n\n🔥 Pirbalamana kelvigal:\n• "Vivasayi thittam"\n• "Pengal thittam"\n• "Oivuthiyam"\n• "Veedu thittam"\n• "Ilavasa arisi"\n• "Maanavar laptop"';
  return '🙏 Hello! I am your Government Scheme Assistant.\n\nPress the buttons below or speak/type your question!\n\n🔥 Popular questions:\n• "Farmer schemes"\n• "Women schemes"\n• "Pension"\n• "Housing scheme"\n• "Free rice"\n• "Student laptop"';
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
  const q = normalize(query);
  if (!q) return '';

  const { intent, forcedCategory } = detectIntent(q);

  if (intent === 'greeting') return formatGreeting(lang);

  const matches = matchSchemes(query, schemes, lang, forcedCategory);

  if (matches.length === 0) {
    // Fuzzy word-level matching
    const words = q.split(/\s+/).filter(w => w.length > 2);
    let fuzzyMatches: Scheme[] = [];
    for (const word of words) {
      fuzzyMatches = [...fuzzyMatches, ...matchSchemes(word, schemes, lang, forcedCategory)];
    }
    const seen = new Set<string>();
    fuzzyMatches = fuzzyMatches.filter(s => { if (seen.has(s.id)) return false; seen.add(s.id); return true; });

    if (fuzzyMatches.length > 0) {
      const top = fuzzyMatches.slice(0, 3);
      const header = lang === 'ta' ? '🔍 தொடர்புடைய திட்டங்கள்:' : lang === 'tl' ? '🔍 Thodarbuadiya thittangal:' : '🔍 Related schemes found:';
      return `${header}\n\n${top.map(s => formatSchemeResponse(s, lang, intent)).join('\n\n---\n\n')}`;
    }

    if (lang === 'ta') return '❓ உங்கள் கேள்விக்கு திட்டம் கிடைக்கவில்லை.\n\nஇவற்றை முயற்சிக்கவும்:\n🌾 விவசாயி\n🎓 மாணவர்\n👩 பெண்கள்\n🏥 சுகாதாரம்\n🏠 வீடு\n👴 ஓய்வூதியம்';
    if (lang === 'tl') return '❓ Ungal kelvikku thittam kidaikkavaillai.\n\nIvattrai muyarchikkavum:\n🌾 Vivasayi\n🎓 Maanavar\n👩 Pengal\n🏥 Sugaatharam\n🏠 Veedu\n👴 Oivuthiyam';
    return '❓ No matching scheme found.\n\nTry asking about:\n🌾 Farmer schemes\n🎓 Student schemes\n👩 Women welfare\n🏥 Health schemes\n🏠 Housing schemes\n👴 Pension schemes';
  }

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

// Quick reply suggestions
export function getQuickReplies(lang: Language): string[] {
  if (lang === 'ta') return ['🌾 விவசாயி திட்டம்', '👩 பெண்கள் திட்டம்', '🎓 மாணவர் திட்டம்', '🏥 இலவச அரிசி', '🏠 வீடு திட்டம்', '👴 ஓய்வூதியம்'];
  if (lang === 'tl') return ['🌾 Vivasayi thittam', '👩 Pengal thittam', '🎓 Maanavar thittam', '🏥 Ilavasa arisi', '🏠 Veedu thittam', '👴 Oivuthiyam'];
  return ['🌾 Farmer schemes', '👩 Women schemes', '🎓 Student schemes', '🏥 Free rice & health', '🏠 Housing', '👴 Pension'];
}
