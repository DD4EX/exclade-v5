import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function getCuratedSchemes() {
  const ts = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  return [
    {
      scheme_id: "pm-kisan",
      category: "farmer",
      status: "Open",
      last_updated: ts,
      official_source: "https://pmkisan.gov.in",
      popular: true,
      data_en: { name: "PM Kisan Samman Nidhi", description: "Income support scheme providing ₹6,000 per year to farmer families in 3 installments of ₹2,000 each", eligibility: ["Must be a farmer", "Own agricultural land", "Family income below ₹2 lakh/year"], benefits: "₹6,000 per year in 3 installments of ₹2,000 each", documents: ["Aadhaar Card", "Bank Passbook", "Land Record (Patta)", "Ration Card"], steps: ["Visit nearest CSC center or VAO office", "Fill PM Kisan application form", "Submit Aadhaar, land record and bank details", "Wait for verification by Block/District officials"] },
      data_ta: { name: "பிஎம் கிசான் சம்மன் நிதி", description: "விவசாயக் குடும்பங்களுக்கு ஆண்டுக்கு ₹6,000 வருமான உதவித் திட்டம்", eligibility: ["விவசாயி ஆக இருக்க வேண்டும்", "விவசாய நிலம் சொந்தமாக இருக்க வேண்டும்", "குடும்ப வருமானம் ₹2 லட்சத்திற்கு கீழ்"], benefits: "₹2,000 வீதம் 3 தவணைகளில் ஆண்டுக்கு ₹6,000", documents: ["ஆதார் அட்டை", "வங்கி பாஸ் புத்தகம்", "நிலப் பட்டா", "ரேஷன் அட்டை"], steps: ["அருகிலுள்ள CSC மையம் அல்லது VAO அலுவலகத்திற்கு செல்லவும்", "PM கிசான் விண்ணப்பப் படிவத்தை நிரப்பவும்", "ஆதார், நிலப் பதிவு மற்றும் வங்கி விவரங்களை சமர்ப்பிக்கவும்", "தொகுதி/மாவட்ட அதிகாரிகள் சரிபார்ப்புக்கு காத்திருக்கவும்"] },
      data_tl: { name: "PM Kisan Samman Nidhi", description: "Vivasayi kudumbangalukku varuda ₹6,000 varumaana uthavi thittam", eligibility: ["Vivasayi aaga irukka vendum", "Vivasaya nilam sonthamaga irukka vendum", "Kudumba varumanam ₹2 latchathirkku keel"], benefits: "₹2,000 veethum 3 thavanaigalil varudathirku ₹6,000", documents: ["Aadhaar Card", "Bank Pass Book", "Nila Patta", "Ration Card"], steps: ["Arukilulla CSC maiyam allathu VAO aluvalagathirku sellavum", "PM Kisan vinapathil nirapavum", "Aadhaar, nila pathivu matrum bank vivarangalai samarpikkavum", "Block/District athigaarigal saribarpukku kaathirukavum"] },
    },
    {
      scheme_id: "old-age-pension",
      category: "pension",
      status: "Open",
      last_updated: ts,
      official_source: "https://nsap.nic.in",
      popular: true,
      data_en: { name: "Old Age Pension (IGNOAPS)", description: "Monthly pension for senior citizens aged 60 and above from BPL families", eligibility: ["Age 60 years or above", "Below Poverty Line (BPL)", "Not receiving any other pension"], benefits: "₹1,000 per month (₹200 Central + ₹800 State)", documents: ["Aadhaar Card", "Age Proof Certificate", "BPL Card", "Bank Passbook"], steps: ["Visit VAO office", "Fill Old Age Pension application form", "Submit age proof and BPL certificate", "VAO will verify and forward to Taluk office"] },
      data_ta: { name: "முதியோர் ஓய்வூதியம் (IGNOAPS)", description: "60 வயதுக்கு மேற்பட்ட BPL குடும்பத்தைச் சேர்ந்த முதியோருக்கு மாதாந்திர ஓய்வூதியம்", eligibility: ["60 வயது அல்லது அதற்கு மேல்", "வறுமைக் கோட்டிற்கு கீழ் (BPL)", "வேறு ஓய்வூதியம் பெறாதவர்"], benefits: "மாதம் ₹1,000 (₹200 மத்திய + ₹800 மாநில அரசு)", documents: ["ஆதார் அட்டை", "வயது சான்றிதழ்", "BPL அட்டை", "வங்கி பாஸ் புத்தகம்"], steps: ["VAO அலுவலகத்திற்கு செல்லவும்", "முதியோர் ஓய்வூதிய விண்ணப்பப் படிவத்தை நிரப்பவும்", "வயது சான்றிதழ் மற்றும் BPL சான்றிதழை சமர்ப்பிக்கவும்", "VAO சரிபார்த்து தாலுக்கா அலுவலகத்திற்கு அனுப்புவார்"] },
      data_tl: { name: "Muthiyor Oivuthiyam (IGNOAPS)", description: "60 vayathukku melpatta BPL kudumbathil irunthu muthiyorukku madhaanthira oivuthiyam", eligibility: ["60 vayathu allathu atharkku mel", "Varumai Koatitrku Keel (BPL)", "Vera oivuthiyam peraathavar"], benefits: "Madham ₹1,000 (₹200 Madhiya + ₹800 Maanila Arasu)", documents: ["Aadhaar Card", "Vayathu Saanrithazh", "BPL Card", "Bank Pass Book"], steps: ["VAO aluvalagathirku sellavum", "Muthiyor oivuthiya vinapam nirapavum", "Vayathu saanrithazh matrum BPL saanrithazhai samarpikkavum", "VAO saripaartthu Taluk aluvalagathirku anuppuvar"] },
    },
    {
      scheme_id: "pmay",
      category: "housing",
      status: "Open",
      last_updated: ts,
      official_source: "https://pmaymis.gov.in",
      popular: true,
      data_en: { name: "PM Awas Yojana (PMAY-G)", description: "Free housing scheme for rural homeless and kutcha house dwellers", eligibility: ["No pucca house", "BPL family", "Not received housing benefit before"], benefits: "₹1,20,000 for plain areas to build a house", documents: ["Aadhaar Card", "BPL Card", "Land Document", "Bank Passbook", "Photo"], steps: ["Apply through Gram Panchayat or VAO office", "Verification by Block Development Officer", "Approval and fund release in installments", "Build house as per guidelines"] },
      data_ta: { name: "பிஎம் ஆவாஸ் யோஜனா (PMAY-G)", description: "கிராமப்புற வீடற்றவர்கள் மற்றும் குச்சா வீட்டில் வசிப்பவர்களுக்கான இலவச வீட்டுத் திட்டம்", eligibility: ["பக்கா வீடு இல்லாதவர்", "BPL குடும்பம்", "முன்பு வீட்டு உதவி பெறாதவர்"], benefits: "வீடு கட்ட சமவெளி பகுதிக்கு ₹1,20,000", documents: ["ஆதார் அட்டை", "BPL அட்டை", "நில ஆவணம்", "வங்கி பாஸ் புத்தகம்", "புகைப்படம்"], steps: ["கிராம பஞ்சாயத்து அல்லது VAO அலுவலகம் வழியாக விண்ணப்பிக்கவும்", "தொகுதி வளர்ச்சி அதிகாரியால் சரிபார்ப்பு", "ஒப்புதல் மற்றும் தவணைகளில் நிதி வெளியீடு", "வழிகாட்டுதல்களின்படி வீடு கட்டவும்"] },
      data_tl: { name: "PM Awas Yojana (PMAY-G)", description: "Gramapura veedarravargal matrum kutcha veettil vasippavargalukkana ilavasa veettu thittam", eligibility: ["Pucca veedu illaathavar", "BPL kudumbam", "Munbu veettu uthavi peraathavar"], benefits: "Veedu katta samaveli paguthikku ₹1,20,000", documents: ["Aadhaar Card", "BPL Card", "Nila Aavanam", "Bank Pass Book", "Photo"], steps: ["Grama Panchayathu allathu VAO aluvalagam vazhiyaga vinapikkavum", "Block Development Officer sariparpu", "Oppudhal matrum thavanaigalil nidhi veliyeedu", "Vazhikattuthalgalin padi veedu kattavum"] },
    },
    {
      scheme_id: "tn-uzhavar-pattakaappu",
      category: "farmer",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.tn.gov.in",
      popular: false,
      data_en: { name: "TN Crop Insurance Scheme", description: "State crop insurance for farmers against natural calamities and crop failure", eligibility: ["Registered farmer in Tamil Nadu", "Crop cultivated in notified area", "Premium paid before deadline"], benefits: "Compensation based on crop loss assessment", documents: ["Aadhaar Card", "Land Record", "Bank Account", "Crop Sowing Certificate"], steps: ["Visit Agriculture Department office", "Register for crop insurance before sowing", "Pay premium amount", "Claim compensation if crop loss occurs"] },
      data_ta: { name: "தமிழ்நாடு பயிர் காப்பீட்டுத் திட்டம்", description: "இயற்கை பேரிடர்கள் மற்றும் பயிர் சேதத்திற்கு எதிராக விவசாயிகளுக்கான மாநில பயிர் காப்பீடு", eligibility: ["தமிழ்நாட்டில் பதிவு செய்யப்பட்ட விவசாயி", "அறிவிக்கப்பட்ட பகுதியில் பயிர் செய்யப்பட்டது", "காலக்கெடுவிற்கு முன் பிரீமியம் செலுத்தப்பட்டது"], benefits: "பயிர் இழப்பு மதிப்பீட்டின் அடிப்படையில் இழப்பீடு", documents: ["ஆதார் அட்டை", "நில பதிவு", "வங்கி கணக்கு", "பயிர் விதைப்பு சான்றிதழ்"], steps: ["வேளாண்மை துறை அலுவலகத்திற்கு செல்லவும்", "விதைப்புக்கு முன் பயிர் காப்பீட்டில் பதிவு செய்யவும்", "பிரீமியம் தொகை செலுத்தவும்", "பயிர் இழப்பு ஏற்பட்டால் இழப்பீடு கோரவும்"] },
      data_tl: { name: "Tamil Nadu Payir Kaapeettu Thittam", description: "Iyarkai peridarkal matrum payir sethaththirku ethiraga vivasayigalukkana maanila payir kaapeedu", eligibility: ["Tamil Naattil pathivu seyyapatta vivasayi", "Arivikkapatta paguthiyil payir seyyappattathu", "Kaalakeduvirku mun premium seluthappattathu"], benefits: "Payir izappu mathippeettin adippadaiyil izappeedu", documents: ["Aadhaar Card", "Nila Pathivu", "Bank Kanakku", "Payir Vidhaippu Saanrithazh"], steps: ["Velaanmai Thurai aluvalagathirku sellavum", "Vidhaippukku mun payir kaapeettil pathivu seyyavum", "Premium thogai seluthavum", "Payir izappu erpattal izappeedu koravum"] },
    },
    {
      scheme_id: "free-laptop",
      category: "student",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.tn.gov.in",
      popular: false,
      data_en: { name: "TN Free Laptop Scheme", description: "Free laptops for government school students who pass 12th standard", eligibility: ["Student of Tamil Nadu government school", "Passed 12th standard", "Family income below limit"], benefits: "Free laptop with educational software", documents: ["12th Marksheet", "School Certificate", "Aadhaar Card", "Community Certificate"], steps: ["Pass 12th standard in government school", "School will submit eligible student list", "Laptops distributed through school", "Collect laptop with ID proof"] },
      data_ta: { name: "தமிழ்நாடு இலவச லேப்டாப் திட்டம்", description: "12ஆம் வகுப்பு தேர்ச்சி பெற்ற அரசு பள்ளி மாணவர்களுக்கு இலவச லேப்டாப்", eligibility: ["தமிழ்நாடு அரசு பள்ளி மாணவர்", "12ஆம் வகுப்பு தேர்ச்சி", "குடும்ப வருமான வரம்புக்கு கீழ்"], benefits: "கல்வி மென்பொருளுடன் இலவச லேப்டாப்", documents: ["12ஆம் வகுப்பு மதிப்பெண் பட்டியல்", "பள்ளி சான்றிதழ்", "ஆதார் அட்டை", "சமூக சான்றிதழ்"], steps: ["அரசு பள்ளியில் 12ஆம் வகுப்பு தேர்ச்சி பெறவும்", "பள்ளி தகுதியான மாணவர் பட்டியலை சமர்ப்பிக்கும்", "பள்ளி வழியாக லேப்டாப் விநியோகம்", "அடையாள ஆவணத்துடன் லேப்டாப் பெறவும்"] },
      data_tl: { name: "Tamil Nadu Ilavasa Laptop Thittam", description: "12am vaguppu therchi petra arasu palli maanavargalukku ilavasa laptop", eligibility: ["Tamil Nadu arasu palli maanavar", "12am vaguppu therchi", "Kudumba varumaana varambukku keel"], benefits: "Kalvi menporulutan ilavasa laptop", documents: ["12am vaguppu mathipenu pattiyal", "Palli saanrithazh", "Aadhaar Card", "Samuga saanrithazh"], steps: ["Arasu palliyil 12am vaguppu therchi peravum", "Palli thaguthiyana maanavar pattiyalai samarpikkum", "Palli vazhiyaga laptop viniyogam", "Adaiyaala aavanathudan laptop peravum"] },
    },
    {
      scheme_id: "moovalur-ramamirtham",
      category: "student",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.tn.gov.in",
      popular: false,
      data_en: { name: "Moovalur Ramamirtham Ammaiyar Higher Education Scheme", description: "₹1,000/month for girl students pursuing higher education from poor families", eligibility: ["Girl student", "Studying in college/university", "Family income below ₹2.5 lakh"], benefits: "₹1,000 per month till completion of degree", documents: ["Aadhaar Card", "College ID", "Income Certificate", "Community Certificate", "Bank Account"], steps: ["Apply through college/institution", "Submit required documents", "Verification by college and government", "Amount credited to bank account monthly"] },
      data_ta: { name: "மூவலூர் ராமமிர்தம் அம்மையார் உயர்கல்வி திட்டம்", description: "ஏழை குடும்பங்களின் உயர்கல்வி பயிலும் மாணவிகளுக்கு மாதம் ₹1,000", eligibility: ["மாணவி", "கல்லூரி/பல்கலைக்கழகத்தில் படிக்கும்", "குடும்ப வருமானம் ₹2.5 லட்சத்திற்கு கீழ்"], benefits: "பட்டப்படிப்பு முடியும் வரை மாதம் ₹1,000", documents: ["ஆதார் அட்டை", "கல்லூரி அடையாள அட்டை", "வருமான சான்றிதழ்", "சமூக சான்றிதழ்", "வங்கி கணக்கு"], steps: ["கல்லூரி/நிறுவனம் வழியாக விண்ணப்பிக்கவும்", "தேவையான ஆவணங்களை சமர்ப்பிக்கவும்", "கல்லூரி மற்றும் அரசு சரிபார்ப்பு", "வங்கி கணக்கில் மாதாந்திர தொகை வரவு"] },
      data_tl: { name: "Moovalur Ramamirtham Ammaiyar Uyarkalvi Thittam", description: "Ezhai kudumbangalin uyarkalvi payilum maanavikaLukku madham ₹1,000", eligibility: ["Maanavi", "Kalloori/Palkalaikalagathil padikkum", "Kudumba varumanam ₹2.5 latchathirku keel"], benefits: "Pattapadippu mudiyum varai madham ₹1,000", documents: ["Aadhaar Card", "Kalloori ID", "Varumaana Saanrithazh", "Samuga Saanrithazh", "Bank Kanakku"], steps: ["Kalloori vazhiyaga vinapikkavum", "Thevaiyana aavangalai samarpikkavum", "Kalloori matrum arasu sariparpu", "Bank kanakkil madhaanthira thogai varavu"] },
    },
    {
      scheme_id: "muthulakshmi-reddy",
      category: "women",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.tn.gov.in",
      popular: false,
      data_en: { name: "Dr. Muthulakshmi Reddy Maternity Benefit Scheme", description: "₹18,000 maternity assistance for poor pregnant women", eligibility: ["Pregnant woman", "BPL family", "First two deliveries only", "Age 19+"], benefits: "₹18,000 in installments during pregnancy and after delivery", documents: ["Aadhaar Card", "Pregnancy Certificate", "BPL Card", "Bank Passbook", "Family Card"], steps: ["Register at Primary Health Centre", "Submit pregnancy certificate", "Receive installments at different pregnancy stages", "Final installment after delivery and vaccination"] },
      data_ta: { name: "டாக்டர் முத்துலட்சுமி ரெட்டி மகப்பேறு நல திட்டம்", description: "ஏழை கர்ப்பிணிப் பெண்களுக்கு ₹18,000 மகப்பேறு உதவி", eligibility: ["கர்ப்பிணிப் பெண்", "BPL குடும்பம்", "முதல் இரண்டு பிரசவங்கள் மட்டும்", "19+ வயது"], benefits: "கர்ப்ப காலத்தில் மற்றும் பிரசவத்திற்குப் பின் தவணைகளில் ₹18,000", documents: ["ஆதார் அட்டை", "கர்ப்ப சான்றிதழ்", "BPL அட்டை", "வங்கி பாஸ் புத்தகம்", "குடும்ப அட்டை"], steps: ["ஆரம்ப சுகாதார நிலையத்தில் பதிவு செய்யவும்", "கர்ப்ப சான்றிதழ் சமர்ப்பிக்கவும்", "கர்ப்ப நிலைகளில் தவணைகள் பெறவும்", "பிரசவம் மற்றும் தடுப்பூசிக்குப் பின் இறுதி தவணை"] },
      data_tl: { name: "Dr. Muthulakshmi Reddy Makaperu Nala Thittam", description: "Ezhai karppini pengalukku ₹18,000 makaperu uthavi", eligibility: ["Karppini penn", "BPL kudumbam", "Mudhal irandu pirasavangal mattum", "19+ vayathu"], benefits: "Karppa kaalathil matrum pirasavathirkku pin thavanaigalil ₹18,000", documents: ["Aadhaar Card", "Karppa Saanrithazh", "BPL Card", "Bank Pass Book", "Kudumba Card"], steps: ["Aaramba sugaathara nilaiyathil pathivu seyyavum", "Karppa saanrithazh samarpikkavum", "Karppa nilaigalil thavanaigal peravum", "Pirasavam matrum thaduppusikku pin irudhi thavani"] },
    },
    {
      scheme_id: "widow-pension",
      category: "pension",
      status: "Open",
      last_updated: ts,
      official_source: "https://nsap.nic.in",
      popular: false,
      data_en: { name: "Widow Pension Scheme", description: "Monthly pension for widows from poor families under IGNWPS", eligibility: ["Widow", "Age 40-79", "BPL family"], benefits: "₹1,000 per month", documents: ["Aadhaar Card", "Death Certificate of husband", "BPL Card", "Bank Passbook"], steps: ["Visit VAO office", "Fill widow pension form", "Submit husband's death certificate", "Wait for verification"] },
      data_ta: { name: "விதவை ஓய்வூதியம்", description: "IGNWPS திட்டத்தின் கீழ் ஏழை குடும்பங்களின் விதவைகளுக்கு மாதாந்திர ஓய்வூதியம்", eligibility: ["விதவை", "வயது 40-79", "BPL குடும்பம்"], benefits: "மாதம் ₹1,000", documents: ["ஆதார் அட்டை", "கணவரின் இறப்பு சான்றிதழ்", "BPL அட்டை", "வங்கி பாஸ் புத்தகம்"], steps: ["VAO அலுவலகம் செல்லவும்", "விதவை ஓய்வூதிய படிவம் நிரப்பவும்", "கணவரின் இறப்பு சான்றிதழ் சமர்ப்பிக்கவும்", "சரிபார்ப்புக்கு காத்திருக்கவும்"] },
      data_tl: { name: "Vidavai Oivuthiyam", description: "IGNWPS thittathil keel ezhai kudumbangalin vidavaigalukku madhaanthira oivuthiyam", eligibility: ["Vidavai", "Vayathu 40-79", "BPL kudumbam"], benefits: "Madham ₹1,000", documents: ["Aadhaar Card", "Kanavarin irappu saanrithazh", "BPL Card", "Bank Pass Book"], steps: ["VAO aluvalagam sellavum", "Vidavai oivuthiya padivam nirapavum", "Kanavarin irappu saanrithazh samarpikkavum", "Sariparpukku kaathirukavum"] },
    },
    {
      scheme_id: "cmchis",
      category: "health",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.cmchistn.com",
      popular: true,
      data_en: { name: "CM's Comprehensive Health Insurance Scheme", description: "Free health insurance up to ₹5 lakh for families with income below ₹72,000/year", eligibility: ["Tamil Nadu resident", "Annual family income below ₹72,000", "Ration card holder"], benefits: "₹5,00,000 health coverage for surgeries and treatments", documents: ["Aadhaar Card", "Ration Card", "Income Certificate", "Hospital Referral"], steps: ["Visit government hospital", "Show ration card for eligibility", "Get treatment at empanelled hospital", "No cash payment needed"] },
      data_ta: { name: "முதலமைச்சரின் விரிவான சுகாதாரக் காப்பீட்டுத் திட்டம்", description: "ஆண்டு வருமானம் ₹72,000க்கு கீழ் உள்ள குடும்பங்களுக்கு ₹5 லட்சம் வரை இலவச காப்பீடு", eligibility: ["தமிழ்நாடு குடியிருப்பாளர்", "ஆண்டு குடும்ப வருமானம் ₹72,000க்கு கீழ்", "ரேஷன் அட்டை வைத்திருப்பவர்"], benefits: "அறுவை சிகிச்சை மற்றும் சிகிச்சைகளுக்கு ₹5,00,000 காப்பீடு", documents: ["ஆதார் அட்டை", "ரேஷன் அட்டை", "வருமான சான்றிதழ்", "மருத்துவமனை பரிந்துரை"], steps: ["அரசு மருத்துவமனைக்கு செல்லவும்", "ரேஷன் அட்டை காட்டவும்", "பட்டியலிடப்பட்ட மருத்துவமனையில் சிகிச்சை", "பணம் செலுத்த வேண்டாம்"] },
      data_tl: { name: "Mudhalamaichcharin Virivana Sugaathara Kaapeettu Thittam", description: "Varudam ₹72,000kku keel ulla kudumbangalukku ₹5 latcham varai ilavasa kaapeedu", eligibility: ["Tamil Nadu kudiyiruppalar", "Varudam kudumba varumanam ₹72,000kku keel", "Ration card vaithiruppavar"], benefits: "Aruvai sikichai matrum sikichaigalukku ₹5,00,000 kaapeedu", documents: ["Aadhaar Card", "Ration Card", "Varumaana Saanrithazh", "Maruthuvamanai Parinthurai"], steps: ["Arasu maruthuvamanaikku sellavum", "Ration card kaattavum", "Pattiyalidapatta maruthuvamanayil sikichai", "Panam selutha vendaam"] },
    },
    {
      scheme_id: "ayushman-bharat",
      category: "health",
      status: "Open",
      last_updated: ts,
      official_source: "https://pmjay.gov.in",
      popular: true,
      data_en: { name: "Ayushman Bharat (PM-JAY)", description: "Health insurance of ₹5 lakh per family per year for secondary and tertiary care", eligibility: ["BPL family", "No other health insurance", "Listed in SECC database"], benefits: "₹5,00,000 health coverage per family per year", documents: ["Aadhaar Card", "Ration Card", "BPL Certificate", "Family Photo"], steps: ["Check eligibility at pmjay.gov.in", "Visit CSC center with documents", "Get Ayushman card issued", "Use at empanelled hospitals"] },
      data_ta: { name: "ஆயுஷ்மான் பாரத் (PM-JAY)", description: "குடும்பத்திற்கு வருடத்திற்கு ₹5 லட்சம் சுகாதார காப்பீடு", eligibility: ["BPL குடும்பம்", "வேறு காப்பீடு இல்லை", "SECC பட்டியலில் இடம்"], benefits: "குடும்பத்திற்கு வருடத்திற்கு ₹5,00,000 காப்பீடு", documents: ["ஆதார்", "ரேஷன் அட்டை", "BPL சான்றிதழ்", "குடும்ப புகைப்படம்"], steps: ["pmjay.gov.in இல் தகுதி சரிபார்க்கவும்", "CSC மையத்தில் ஆவணங்கள் சமர்ப்பிக்கவும்", "ஆயுஷ்மான் அட்டை பெறவும்", "பட்டியலிடப்பட்ட மருத்துவமனைகளில் பயன்படுத்தவும்"] },
      data_tl: { name: "Ayushman Bharat (PM-JAY)", description: "Kudumbathirkku varudathirkku ₹5 latcham sugaathara kaapeedu", eligibility: ["BPL kudumbam", "Vera kaapeedu illai", "SECC pattiyalil idam"], benefits: "Kudumbathirkku varudathirkku ₹5,00,000 kaapeedu", documents: ["Aadhaar", "Ration Card", "BPL Saanrithazh", "Kudumba Photo"], steps: ["pmjay.gov.in il thaguthi sariparkavum", "CSC maiyathil aavaningal samarpikkavum", "Ayushman card peravum", "Pattiyalidapatta maruthuvamanigalil payanpaduthavum"] },
    },
    {
      scheme_id: "differently-abled-pension",
      category: "pension",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.tn.gov.in",
      popular: false,
      data_en: { name: "Differently Abled Pension", description: "Monthly pension for persons with 40% or more disability", eligibility: ["40% or more disability", "Tamil Nadu resident", "BPL family preferred"], benefits: "₹1,500 per month", documents: ["Aadhaar Card", "Disability Certificate", "BPL Card", "Bank Passbook"], steps: ["Get disability certificate from government hospital", "Visit VAO office", "Submit application with documents", "Pension credited monthly"] },
      data_ta: { name: "மாற்றுத்திறனாளி ஓய்வூதியம்", description: "40% அல்லது அதற்கு மேல் ஊனமுள்ளவர்களுக்கு மாதாந்திர ஓய்வூதியம்", eligibility: ["40% அல்லது அதற்கு மேல் ஊனம்", "தமிழ்நாடு குடியிருப்பாளர்", "BPL குடும்பம் முன்னுரிமை"], benefits: "மாதம் ₹1,500", documents: ["ஆதார் அட்டை", "ஊனமுள்ளோர் சான்றிதழ்", "BPL அட்டை", "வங்கி பாஸ் புத்தகம்"], steps: ["அரசு மருத்துவமனையில் ஊனமுள்ளோர் சான்றிதழ் பெறவும்", "VAO அலுவலகம் செல்லவும்", "ஆவணங்களுடன் விண்ணப்பம் சமர்ப்பிக்கவும்", "ஓய்வூதியம் மாதாந்திரம் வரவு"] },
      data_tl: { name: "Maatruthiranaali Oivuthiyam", description: "40% allathu atharkku mel oonamullvargalukku madhaanthira oivuthiyam", eligibility: ["40% allathu atharkku mel oonam", "Tamil Nadu kudiyiruppalar", "BPL kudumbam munnurimai"], benefits: "Madham ₹1,500", documents: ["Aadhaar Card", "Oonamullor Saanrithazh", "BPL Card", "Bank Pass Book"], steps: ["Arasu maruthuvamanayil oonamullor saanrithazh peravum", "VAO aluvalagam sellavum", "Aavaningaludan vinapam samarpikkavum", "Oivuthiyam madhaanthiram varavu"] },
    },
    {
      scheme_id: "free-sewing-machine",
      category: "women",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.tn.gov.in",
      popular: false,
      data_en: { name: "Free Sewing Machine Scheme", description: "Free sewing machines for women from poor families for self-employment", eligibility: ["Woman from BPL family", "Age 20-40", "Not employed"], benefits: "Free sewing machine for self-employment", documents: ["Aadhaar Card", "BPL Card", "Photo", "Bank Account"], steps: ["Apply at District Industries Centre", "Submit documents", "Attend skill training", "Receive sewing machine"] },
      data_ta: { name: "இலவச தையல் இயந்திரத் திட்டம்", description: "ஏழை குடும்பங்களின் பெண்களுக்கு சுயதொழில் செய்ய இலவச தையல் இயந்திரம்", eligibility: ["BPL குடும்ப பெண்", "வயது 20-40", "வேலை இல்லாதவர்"], benefits: "சுயதொழிலுக்கு இலவச தையல் இயந்திரம்", documents: ["ஆதார் அட்டை", "BPL அட்டை", "புகைப்படம்", "வங்கி கணக்கு"], steps: ["மாவட்ட தொழில் மையத்தில் விண்ணப்பிக்கவும்", "ஆவணங்கள் சமர்ப்பிக்கவும்", "திறன் பயிற்சியில் கலந்துகொள்ளவும்", "தையல் இயந்திரம் பெறவும்"] },
      data_tl: { name: "Ilavasa Thaiyal Iyanthira Thittam", description: "Ezhai kudumbangalin pengalukku suyathozil seyya ilavasa thaiyal iyanthiram", eligibility: ["BPL kudumba penn", "Vayathu 20-40", "Velai illaathavar"], benefits: "Suyathozilukku ilavasa thaiyal iyanthiram", documents: ["Aadhaar Card", "BPL Card", "Photo", "Bank Kanakku"], steps: ["Maavatta thozhil maiyathil vinapikkavum", "Aavaningal samarpikkavum", "Thiran payirchiyil kalanthu kollavum", "Thaiyal iyanthiram peravum"] },
    },
    {
      scheme_id: "amma-unavagam",
      category: "health",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.tn.gov.in",
      popular: true,
      data_en: { name: "Amma Unavagam (Amma Canteen)", description: "Subsidized meals at very low prices - Idli ₹1, Rice ₹5, Sambar Rice ₹5", eligibility: ["Open to all - no documents needed"], benefits: "Breakfast from ₹1, Lunch/Dinner from ₹5", documents: ["No documents required"], steps: ["Visit nearest Amma Unavagam", "Order food at counter", "Pay nominal amount", "Eat fresh healthy food"] },
      data_ta: { name: "அம்மா உணவகம்", description: "மிகக் குறைந்த விலையில் மானிய உணவு - இட்லி ₹1, சாதம் ₹5, சாம்பார் சாதம் ₹5", eligibility: ["அனைவருக்கும் - ஆவணங்கள் தேவையில்லை"], benefits: "காலை உணவு ₹1 முதல், மதிய/இரவு உணவு ₹5 முதல்", documents: ["ஆவணங்கள் தேவையில்லை"], steps: ["அருகிலுள்ள அம்மா உணவகம் செல்லவும்", "கவுண்டரில் உணவு ஆர்டர் செய்யவும்", "குறைந்த தொகை செலுத்தவும்", "புதிய ஆரோக்கியமான உணவு சாப்பிடவும்"] },
      data_tl: { name: "Amma Unavagam", description: "Migak kuraintha vilaiyil maaniya unavu - Idli ₹1, Saadham ₹5, Sambar Saadham ₹5", eligibility: ["Anaivarukkum - aavaningal thevai illai"], benefits: "Kaalai unavu ₹1 mudhal, Madhiya/Iravu unavu ₹5 mudhal", documents: ["Aavaningal thevai illai"], steps: ["Arukilulla Amma Unavagam sellavum", "Counteril unavu order seyyavum", "Kuraintha thogai seluthavum", "Pudhiya aarokkiyamaana unavu saappidavum"] },
    },
    {
      scheme_id: "kalaignar-magalir-urimai",
      category: "women",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.tn.gov.in",
      popular: true,
      data_en: { name: "Kalaignar Magalir Urimai Thittam", description: "₹1,000 monthly cash transfer for women heads of families in Tamil Nadu", eligibility: ["Woman head of family", "Tamil Nadu resident", "Annual income below ₹2.5 lakh", "Age 21+"], benefits: "₹1,000 per month directly to bank account", documents: ["Aadhaar Card", "Ration Card", "Bank Account", "Income Certificate"], steps: ["Apply online or at taluk office", "Submit required documents", "Verification by officials", "Amount credited monthly"] },
      data_ta: { name: "கலைஞர் மகளிர் உரிமைத் திட்டம்", description: "தமிழ்நாட்டில் குடும்பத் தலைவிகளுக்கு மாதம் ₹1,000 பண மாற்றம்", eligibility: ["குடும்பத் தலைவி", "தமிழ்நாடு குடியிருப்பாளர்", "வருடாந்திர வருமானம் ₹2.5 லட்சத்திற்கு கீழ்", "21+ வயது"], benefits: "வங்கிக் கணக்கில் நேரடியாக மாதம் ₹1,000", documents: ["ஆதார் அட்டை", "ரேஷன் அட்டை", "வங்கி கணக்கு", "வருமான சான்றிதழ்"], steps: ["ஆன்லைனில் அல்லது தாலுக்கா அலுவலகத்தில் விண்ணப்பிக்கவும்", "ஆவணங்களை சமர்ப்பிக்கவும்", "அதிகாரிகள் சரிபார்ப்பு", "மாதாந்திர தொகை வரவு"] },
      data_tl: { name: "Kalaignar Magalir Urimai Thittam", description: "Tamil Naattil kudumba thalaivigalukku madham ₹1,000 pana maatram", eligibility: ["Kudumba thalaivi", "Tamil Nadu kudiyiruppalar", "Varudanthira varumanam ₹2.5 latchathirkku keel", "21+ vayathu"], benefits: "Bank kanakkil neradiyaga madham ₹1,000", documents: ["Aadhaar Card", "Ration Card", "Bank Kanakku", "Varumaana Saanrithazh"], steps: ["Online allathu taluk aluvalagathil vinapikkavum", "Aavaningalai samarpikkavum", "Athigaarigal sariparpu", "Madhaanthira thogai varavu"] },
    },
    {
      scheme_id: "tn-housing-board",
      category: "housing",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.tnhb.tn.gov.in",
      popular: false,
      data_en: { name: "TN Housing Board Affordable Housing", description: "Affordable houses through TNHB for EWS/LIG sections", eligibility: ["EWS/LIG category", "No other house owned", "Tamil Nadu resident"], benefits: "Affordable house at subsidized rate", documents: ["Aadhaar Card", "Income Certificate", "Address Proof", "Bank Account"], steps: ["Apply when TNHB announces new schemes", "Submit application with documents", "Lottery/allotment process", "Pay EMI and get house"] },
      data_ta: { name: "தமிழ்நாடு வீட்டு வசதி வாரியம்", description: "TNHB வழியாக EWS/LIG பிரிவினருக்கு மலிவான வீடுகள்", eligibility: ["EWS/LIG பிரிவு", "வேறு வீடு இல்லாதவர்", "தமிழ்நாடு குடியிருப்பாளர்"], benefits: "மானிய விலையில் மலிவான வீடு", documents: ["ஆதார் அட்டை", "வருமான சான்றிதழ்", "முகவரி ஆதாரம்", "வங்கி கணக்கு"], steps: ["TNHB புதிய திட்டங்கள் அறிவிக்கும்போது விண்ணப்பிக்கவும்", "ஆவணங்களுடன் விண்ணப்பம் சமர்ப்பிக்கவும்", "லாட்டரி/ஒதுக்கீடு செயல்முறை", "EMI செலுத்தி வீடு பெறவும்"] },
      data_tl: { name: "Tamil Nadu Veettu Vasathi Vaariyam", description: "TNHB vazhiyaga EWS/LIG pirivinarukku malivaana veedugal", eligibility: ["EWS/LIG pirivu", "Vera veedu illaathavar", "Tamil Nadu kudiyiruppalar"], benefits: "Maaniya vilaiyil malivaana veedu", documents: ["Aadhaar Card", "Varumaana Saanrithazh", "Mugavari Aatharam", "Bank Kanakku"], steps: ["TNHB pudhiya thittangal arivikkumpodhu vinapikkavum", "Aavaningaludan vinapam samarpikkavum", "Lottery/othukeedu seyalmurai", "EMI seluthi veedu peravum"] },
    },
    {
      scheme_id: "tn-free-rice",
      category: "health",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.tn.gov.in",
      popular: true,
      data_en: { name: "TN Free Rice Scheme (PDS)", description: "Free rice distribution through Public Distribution System for ration card holders", eligibility: ["Ration card holder", "Tamil Nadu resident"], benefits: "Free rice monthly - 20kg per family through PDS shops", documents: ["Ration Card", "Aadhaar Card"], steps: ["Visit nearest PDS/ration shop", "Show ration card", "Collect monthly rice quota", "Thumb impression for biometric verification"] },
      data_ta: { name: "தமிழ்நாடு இலவச அரிசித் திட்டம் (PDS)", description: "ரேஷன் அட்டை வைத்திருப்பவர்களுக்கு பொது விநியோக அமைப்பு வழியாக இலவச அரிசி", eligibility: ["ரேஷன் அட்டை வைத்திருப்பவர்", "தமிழ்நாடு குடியிருப்பாளர்"], benefits: "PDS கடைகள் வழியாக குடும்பத்திற்கு 20 கிலோ இலவச அரிசி", documents: ["ரேஷன் அட்டை", "ஆதார் அட்டை"], steps: ["அருகிலுள்ள PDS/ரேஷன் கடைக்கு செல்லவும்", "ரேஷன் அட்டை காட்டவும்", "மாதாந்திர அரிசி பெறவும்", "பயோமெட்ரிக் சரிபார்ப்புக்கு கைரேகை"] },
      data_tl: { name: "Tamil Nadu Ilavasa Arisi Thittam (PDS)", description: "Ration card vaithiruppavargalukku PDS vazhiyaga ilavasa arisi", eligibility: ["Ration card vaithiruppavar", "Tamil Nadu kudiyiruppalar"], benefits: "PDS kadaigal vazhiyaga kudumbathirkku 20 kilo ilavasa arisi", documents: ["Ration Card", "Aadhaar Card"], steps: ["Arukilulla PDS/ration kadaikku sellavum", "Ration card kaattavum", "Madhaanthira arisi peravum", "Biometric sariparpukku kairekai"] },
    },
    {
      scheme_id: "tn-marriage-assistance",
      category: "women",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.tn.gov.in",
      popular: false,
      data_en: { name: "TN Marriage Assistance Scheme", description: "₹25,000-₹50,000 + 8g gold for marriage of women from poor families", eligibility: ["Bride from BPL family", "Age 18+", "First marriage", "Tamil Nadu resident"], benefits: "₹25,000 to ₹50,000 based on education + 8g gold coin", documents: ["Aadhaar Card", "Income Certificate", "Community Certificate", "Marriage Invitation", "Education Certificate"], steps: ["Apply before marriage at district office", "Submit all documents", "Attend verification", "Collect cheque after marriage registration"] },
      data_ta: { name: "தமிழ்நாடு திருமண உதவித் திட்டம்", description: "ஏழைக் குடும்பப் பெண்களுக்கு ₹25,000-₹50,000 + 8 கிராம் தங்கம் திருமண உதவி", eligibility: ["BPL குடும்ப மணப்பெண்", "18+ வயது", "முதல் திருமணம்", "தமிழ்நாடு குடியிருப்பாளர்"], benefits: "கல்வி அடிப்படையில் ₹25,000 முதல் ₹50,000 + 8 கிராம் தங்க நாணயம்", documents: ["ஆதார்", "வருமான சான்றிதழ்", "சமூக சான்றிதழ்", "திருமண அழைப்பிதழ்", "கல்வி சான்றிதழ்"], steps: ["திருமணத்திற்கு முன் மாவட்ட அலுவலகத்தில் விண்ணப்பிக்கவும்", "ஆவணங்கள் சமர்ப்பிக்கவும்", "சரிபார்ப்புக்கு வரவும்", "திருமணப் பதிவுக்குப் பிறகு காசோலை பெறவும்"] },
      data_tl: { name: "Tamil Nadu Thirumanam Uthavi Thittam", description: "Ezhai kudumba pengalukku ₹25,000-₹50,000 + 8 gram thangam thirumanam uthavi", eligibility: ["BPL kudumba manapenn", "18+ vayathu", "Mudhal thirumanam", "Tamil Nadu kudiyiruppalar"], benefits: "Kalvi adippadaiyil ₹25,000 mudhal ₹50,000 + 8 gram thanga naanayam", documents: ["Aadhaar", "Varumaana Saanrithazh", "Samuga Saanrithazh", "Thirumanam Azhaippithazh", "Kalvi Saanrithazh"], steps: ["Thirumanathirkku mun maavatta aluvalagathil vinapikkavum", "Aavaningal samarpikkavum", "Sariparpukku varavum", "Thirumanam pathivukku piragu kasolai peravum"] },
    },
    {
      scheme_id: "sukanya-samriddhi",
      category: "student",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.india.gov.in/sukanya-samriddhi-yojna",
      popular: false,
      data_en: { name: "Sukanya Samriddhi Yojana", description: "High-interest savings scheme for girl child with tax benefits, maturity at age 21", eligibility: ["Girl child below 10 years", "Indian citizen", "Maximum 2 accounts per family"], benefits: "8.2% interest rate with tax-free maturity amount", documents: ["Birth Certificate of girl", "Parent Aadhaar", "Address Proof", "Photo"], steps: ["Visit post office or bank", "Open Sukanya account", "Deposit minimum ₹250/year", "Maturity at girl's age 21"] },
      data_ta: { name: "சுகன்யா சம்ரிதி யோஜனா", description: "பெண் குழந்தைகளுக்கான அதிக வட்டி சேமிப்புத் திட்டம், 21 வயதில் முதிர்வு", eligibility: ["10 வயதுக்கு கீழ் பெண் குழந்தை", "இந்திய குடிமகன்", "குடும்பத்திற்கு 2 கணக்குகள் வரை"], benefits: "8.2% வட்டி விகிதம், வரி இல்லா முதிர்வுத் தொகை", documents: ["பெண் குழந்தையின் பிறப்புச் சான்றிதழ்", "பெற்றோர் ஆதார்", "முகவரி ஆதாரம்", "புகைப்படம்"], steps: ["தபால் அலுவலகம் அல்லது வங்கிக்கு செல்லவும்", "சுகன்யா கணக்கு தொடங்கவும்", "வருடத்திற்கு குறைந்தது ₹250 செலுத்தவும்", "பெண் 21 வயதில் முதிர்வு"] },
      data_tl: { name: "Sukanya Samriddhi Yojana", description: "Penn kuzhanthaigalukkana athiga vatti semipu thittam, 21 vayathil muthirvu", eligibility: ["10 vayathukku keel penn kuzhanthai", "India kudimagan", "Kudumbathirkku 2 kanakkugal varai"], benefits: "8.2% vatti vigitham, vari illa muthirvuthu thogai", documents: ["Penn kuzhanthai pirappu saanrithazh", "Petror Aadhaar", "Mugavari Aatharam", "Photo"], steps: ["Thapal aluvalagam allathu bankku sellavum", "Sukanya kanakku thodangavum", "Varudathirkku kurainthathu ₹250 seluthavum", "Penn 21 vayathil muthirvu"] },
    },
    {
      scheme_id: "pm-ujjwala",
      category: "women",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.pmuy.gov.in",
      popular: false,
      data_en: { name: "PM Ujjwala Yojana", description: "Free LPG gas connection for women from BPL families", eligibility: ["Woman from BPL family", "No existing LPG connection", "Age 18+"], benefits: "Free LPG connection + first refill free + stove subsidy", documents: ["Aadhaar Card", "BPL Card", "Ration Card", "Bank Account", "Photo"], steps: ["Visit nearest LPG distributor", "Submit BPL certificate and Aadhaar", "Get free connection installed", "Book refills at subsidized rate"] },
      data_ta: { name: "பிஎம் உஜ்வாலா யோஜனா", description: "BPL குடும்ப பெண்களுக்கு இலவச எல்பிஜி கேஸ் இணைப்பு", eligibility: ["BPL குடும்ப பெண்", "ஏற்கனவே எல்பிஜி இணைப்பு இல்லாதவர்", "18+ வயது"], benefits: "இலவச எல்பிஜி இணைப்பு + முதல் ரீஃபில் இலவசம் + அடுப்பு மானியம்", documents: ["ஆதார் அட்டை", "BPL அட்டை", "ரேஷன் அட்டை", "வங்கி கணக்கு", "புகைப்படம்"], steps: ["அருகிலுள்ள எல்பிஜி விநியோகஸ்தரை அணுகவும்", "BPL சான்றிதழ் மற்றும் ஆதார் சமர்ப்பிக்கவும்", "இலவச இணைப்பு நிறுவப்படும்", "மானிய விலையில் ரீஃபில் முன்பதிவு"] },
      data_tl: { name: "PM Ujjwala Yojana", description: "BPL kudumba pengalukku ilavasa LPG gas inaippu", eligibility: ["BPL kudumba penn", "Erkanave LPG inaippu illaathavar", "18+ vayathu"], benefits: "Ilavasa LPG inaippu + mudhal refill ilavasam + aduppu maaniyam", documents: ["Aadhaar Card", "BPL Card", "Ration Card", "Bank Kanakku", "Photo"], steps: ["Arukilulla LPG viniyogastharai anugavum", "BPL saanrithazh matrum Aadhaar samarpikkavum", "Ilavasa inaippu niruvappadum", "Maaniya vilaiyil refill munpathivu"] },
    },
    {
      scheme_id: "nrega",
      category: "farmer",
      status: "Open",
      last_updated: ts,
      official_source: "https://nrega.nic.in",
      popular: true,
      data_en: { name: "MGNREGA (100 Days Work Scheme)", description: "Guaranteed 100 days of wage employment per year for rural households", eligibility: ["Rural household", "Willing to do unskilled manual work", "Age 18+"], benefits: "100 days work guarantee at ₹294/day (TN rate). Unemployment allowance if work not given within 15 days", documents: ["Aadhaar Card", "Job Card (NREGA)", "Bank Account", "Photo"], steps: ["Get Job Card from Panchayat office", "Apply for work in writing", "Work must be given within 15 days", "Wages paid within 15 days to bank account"] },
      data_ta: { name: "மகாத்மா காந்தி நரேகா (100 நாள் வேலை திட்டம்)", description: "கிராமப்புற குடும்பங்களுக்கு வருடத்திற்கு 100 நாள் வேலை உத்தரவாதம்", eligibility: ["கிராமப்புற குடும்பம்", "கைவினை வேலை செய்ய விரும்புபவர்", "18+ வயது"], benefits: "நாளுக்கு ₹294 (தமிழ்நாடு விகிதம்) வீதம் 100 நாள் வேலை", documents: ["ஆதார் அட்டை", "வேலை அட்டை (NREGA)", "வங்கி கணக்கு", "புகைப்படம்"], steps: ["பஞ்சாயத்து அலுவலகத்தில் வேலை அட்டை பெறவும்", "எழுத்துப்பூர்வமாக வேலைக்கு விண்ணப்பிக்கவும்", "15 நாளில் வேலை கொடுக்கப்பட வேண்டும்", "15 நாளில் கூலி வங்கி கணக்கில் செலுத்தப்படும்"] },
      data_tl: { name: "Mahatma Gandhi NREGA (100 Naal Velai Thittam)", description: "Gramapura kudumbangalukku varudathirkku 100 naal velai uththaravaadham", eligibility: ["Gramapura kudumbam", "Kaivinai velai seyya virumbubavar", "18+ vayathu"], benefits: "Naalukku ₹294 veethum 100 naal velai", documents: ["Aadhaar Card", "Velai Card (NREGA)", "Bank Kanakku", "Photo"], steps: ["Panchayathu aluvalagathil velai card peravum", "Ezhuthupurvamaga velaiku vinapikkavum", "15 naalil velai kodukkapada vendum", "15 naalil kooli bank kanakkil seluthappadum"] },
    },
    {
      scheme_id: "pm-jan-dhan",
      category: "health",
      status: "Open",
      last_updated: ts,
      official_source: "https://pmjdy.gov.in",
      popular: false,
      data_en: { name: "PM Jan Dhan Yojana", description: "Zero balance bank account with free insurance and overdraft facility", eligibility: ["Indian citizen", "Age 10+", "No existing bank account"], benefits: "Zero balance account + ₹2 lakh accident insurance + ₹30,000 life cover + ₹10,000 overdraft", documents: ["Aadhaar Card", "Photo", "Any address proof"], steps: ["Visit any bank branch", "Fill Jan Dhan account form", "Submit Aadhaar and photo", "Get RuPay debit card free"] },
      data_ta: { name: "பிஎம் ஜன் தன் யோஜனா", description: "இலவச காப்பீடு மற்றும் ஓவர்டிராஃப்ட் வசதியுடன் பூஜ்ய இருப்பு வங்கி கணக்கு", eligibility: ["இந்திய குடிமகன்", "10+ வயது", "ஏற்கனவே வங்கி கணக்கு இல்லாதவர்"], benefits: "பூஜ்ய இருப்பு கணக்கு + ₹2 லட்சம் விபத்து காப்பீடு + ₹30,000 ஆயுள் காப்பீடு + ₹10,000 ஓவர்டிராஃப்ட்", documents: ["ஆதார் அட்டை", "புகைப்படம்", "முகவரி ஆதாரம்"], steps: ["எந்த வங்கி கிளைக்கும் செல்லவும்", "ஜன் தன் கணக்கு படிவம் நிரப்பவும்", "ஆதார் மற்றும் புகைப்படம் சமர்ப்பிக்கவும்", "இலவச ரூபே டெபிட் கார்டு பெறவும்"] },
      data_tl: { name: "PM Jan Dhan Yojana", description: "Ilavasa kaapeedu matrum overdraft vasathiyudan poojya iruppu bank kanakku", eligibility: ["India kudimagan", "10+ vayathu", "Erkanave bank kanakku illaathavar"], benefits: "Poojya iruppu kanakku + ₹2 latcham vipathu kaapeedu + ₹30,000 aayul kaapeedu + ₹10,000 overdraft", documents: ["Aadhaar Card", "Photo", "Mugavari Aatharam"], steps: ["Entha bank kilaikum sellavum", "Jan Dhan kanakku padivam nirapavum", "Aadhaar matrum photo samarpikkavum", "Ilavasa RuPay debit card peravum"] },
    },
    {
      scheme_id: "tn-free-bus-pass",
      category: "student",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.tn.gov.in",
      popular: false,
      data_en: { name: "TN Free Bus Pass for Students", description: "Free bus pass for school and college students in Tamil Nadu government buses", eligibility: ["Student studying in recognized school/college", "Tamil Nadu resident"], benefits: "Free travel in TNSTC buses with student bus pass", documents: ["School/College ID", "Aadhaar Card", "Photo", "Bonafide Certificate"], steps: ["Get bonafide certificate from institution", "Apply at bus depot or online", "Submit photo and ID", "Collect bus pass from depot"] },
      data_ta: { name: "தமிழ்நாடு இலவச பேருந்து பாஸ்", description: "தமிழ்நாடு அரசு பேருந்துகளில் பள்ளி மற்றும் கல்லூரி மாணவர்களுக்கு இலவச பேருந்து பாஸ்", eligibility: ["அங்கீகரிக்கப்பட்ட பள்ளி/கல்லூரியில் படிக்கும் மாணவர்", "தமிழ்நாடு குடியிருப்பாளர்"], benefits: "TNSTC பேருந்துகளில் இலவச பயணம்", documents: ["பள்ளி/கல்லூரி அடையாள அட்டை", "ஆதார் அட்டை", "புகைப்படம்", "போனாஃபைட் சான்றிதழ்"], steps: ["நிறுவனத்திடமிருந்து போனாஃபைட் சான்றிதழ் பெறவும்", "பேருந்து நிலையத்தில் அல்லது ஆன்லைனில் விண்ணப்பிக்கவும்", "புகைப்படம் மற்றும் அடையாள அட்டை சமர்ப்பிக்கவும்", "நிலையத்தில் பேருந்து பாஸ் பெறவும்"] },
      data_tl: { name: "Tamil Nadu Ilavasa Bus Pass", description: "Tamil Nadu arasu perundugalil palli matrum kalloori maanavargalukku ilavasa bus pass", eligibility: ["Angeekarikkapatta palli/kallooriyil padikkum maanavar", "Tamil Nadu kudiyiruppalar"], benefits: "TNSTC perundugalil ilavasa payanam", documents: ["Palli/Kalloori ID", "Aadhaar Card", "Photo", "Bonafide Saanrithazh"], steps: ["Niruvanaathidamirunthu bonafide saanrithazh peravum", "Bus nilaiyathil allathu online vinapikkavum", "Photo matrum ID samarpikkavum", "Nilaiyathil bus pass peravum"] },
    },
    {
      scheme_id: "mudra-loan",
      category: "women",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.mudra.org.in",
      popular: false,
      data_en: { name: "PM Mudra Yojana (Micro Loans)", description: "Collateral-free loans up to ₹10 lakh for small businesses - Shishu (₹50k), Kishore (₹5L), Tarun (₹10L)", eligibility: ["Indian citizen", "Small business owner or aspiring entrepreneur", "Age 18+"], benefits: "Collateral-free loan: Shishu ₹50,000, Kishore ₹5 lakh, Tarun ₹10 lakh", documents: ["Aadhaar Card", "Business Plan", "Bank Account", "Photo", "Address Proof"], steps: ["Visit any bank/NBFC branch", "Choose loan category", "Submit business plan and documents", "Loan sanctioned in 7-10 days"] },
      data_ta: { name: "பிஎம் முத்ரா யோஜனா", description: "சிறு வணிகங்களுக்கு ₹10 லட்சம் வரை ஈட்டு இல்லா கடன்", eligibility: ["இந்திய குடிமகன்", "சிறு வணிக உரிமையாளர்", "18+ வயது"], benefits: "ஈட்டு இல்லா கடன்: சிசு ₹50,000, கிஷோர் ₹5 லட்சம், தருண் ₹10 லட்சம்", documents: ["ஆதார் அட்டை", "வணிக திட்டம்", "வங்கி கணக்கு", "புகைப்படம்", "முகவரி ஆதாரம்"], steps: ["எந்த வங்கி/NBFC கிளைக்கும் செல்லவும்", "கடன் வகையை தேர்வு செய்யவும்", "வணிக திட்டம் மற்றும் ஆவணங்கள் சமர்ப்பிக்கவும்", "7-10 நாளில் கடன் வழங்கப்படும்"] },
      data_tl: { name: "PM Mudra Yojana", description: "Siru vanigangalukku ₹10 latcham varai eettu illa kadan", eligibility: ["India kudimagan", "Siru vaniga urimayalar", "18+ vayathu"], benefits: "Eettu illa kadan: Shishu ₹50,000, Kishore ₹5 latcham, Tarun ₹10 latcham", documents: ["Aadhaar Card", "Vaniga Thittam", "Bank Kanakku", "Photo", "Mugavari Aatharam"], steps: ["Entha bank/NBFC kilaikum sellavum", "Kadan vagayai thervu seyyavum", "Vaniga thittam matrum aavaningal samarpikkavum", "7-10 naalil kadan vazhangappadum"] },
    },
    {
      scheme_id: "pm-fasal-bima",
      category: "farmer",
      status: "Open",
      last_updated: ts,
      official_source: "https://pmfby.gov.in",
      popular: false,
      data_en: { name: "PM Fasal Bima Yojana (Crop Insurance)", description: "National crop insurance with very low premium - 2% for Kharif, 1.5% for Rabi crops", eligibility: ["All farmers including sharecroppers", "Notified crops in notified areas", "Bank loan farmers auto-enrolled"], benefits: "Full crop loss coverage. Premium: 2% Kharif, 1.5% Rabi, 5% commercial", documents: ["Aadhaar Card", "Land Record/Lease", "Bank Account", "Sowing Certificate"], steps: ["Visit bank or CSC center before deadline", "Pay nominal premium", "Report crop loss to agriculture dept", "Claim settlement within 2 months"] },
      data_ta: { name: "பிஎம் பசல் பீமா யோஜனா", description: "மிகக் குறைந்த பிரீமியத்தில் தேசிய பயிர் காப்பீடு", eligibility: ["அனைத்து விவசாயிகள்", "அறிவிக்கப்பட்ட பயிர்கள்", "வங்கி கடன் விவசாயிகள் தானாக சேர்க்கப்படுவர்"], benefits: "முழு பயிர் இழப்பு காப்பீடு. பிரீமியம்: கரிப் 2%, ரபி 1.5%", documents: ["ஆதார் அட்டை", "நிலப் பட்டா", "வங்கி கணக்கு", "விதைப்பு சான்றிதழ்"], steps: ["வங்கி அல்லது CSC செல்லவும்", "குறைந்த பிரீமியம் செலுத்தவும்", "பயிர் இழப்பை தெரிவிக்கவும்", "2 மாதத்தில் இழப்பீடு"] },
      data_tl: { name: "PM Fasal Bima Yojana", description: "Migak kuraintha premium il thesiya payir kaapeedu", eligibility: ["Anaithu vivasayigal", "Arivikkapatta payirgal", "Bank kadan vivasayigal thaanaga serkkappduvar"], benefits: "Muzhu payir izappu kaapeedu. Premium: Kharif 2%, Rabi 1.5%", documents: ["Aadhaar Card", "Nila Patta", "Bank Kanakku", "Vidhaippu Saanrithazh"], steps: ["Bank allathu CSC sellavum", "Kuraintha premium seluthavum", "Payir izappai therivikkavum", "2 maadathil izappeedu"] },
    },
    {
      scheme_id: "tn-uzhavar-sandhai",
      category: "farmer",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.tn.gov.in",
      popular: false,
      data_en: { name: "Uzhavar Sandhai (Farmers Market)", description: "Direct selling market for farmers to sell produce without middlemen at fair prices", eligibility: ["Registered farmer", "Own agricultural produce"], benefits: "Direct selling without middlemen, better price, free stall space", documents: ["Farmer ID", "Aadhaar Card"], steps: ["Register at nearest Uzhavar Sandhai", "Bring produce to market", "Sell directly to consumers", "Get full price without commission"] },
      data_ta: { name: "உழவர் சந்தை", description: "விவசாயிகள் தரகர்கள் இல்லாமல் நேரடியாக விற்பனை செய்ய சந்தை", eligibility: ["பதிவு செய்யப்பட்ட விவசாயி", "சொந்த விளைபொருள்"], benefits: "தரகர்கள் இல்லாமல் நேரடி விற்பனை, சிறந்த விலை", documents: ["விவசாயி அடையாள அட்டை", "ஆதார் அட்டை"], steps: ["அருகிலுள்ள உழவர் சந்தையில் பதிவு செய்யவும்", "சந்தைக்கு விளைபொருள் கொண்டு வரவும்", "நுகர்வோருக்கு நேரடியாக விற்கவும்", "கமிஷன் இல்லாமல் முழு விலை பெறவும்"] },
      data_tl: { name: "Uzhavar Sandhai", description: "Vivasayigal tharagargal illamal neradiyaga virpanai seyya sandhai", eligibility: ["Pathivu seyyapatta vivasayi", "Sontha vilaiporuL"], benefits: "Tharagargal illamal neradi virpanai, sirantha vilai", documents: ["Vivasayi Card", "Aadhaar Card"], steps: ["Arukilulla Uzhavar Sandhaiyil pathivu seyyavum", "Sandhaikku vilaiporuL kondu varavum", "Nugarvorkku neradiyaga virkavum", "Commission illamal muzhu vilai peravum"] },
    },
    {
      scheme_id: "tn-free-bicycle",
      category: "student",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.tn.gov.in",
      popular: false,
      data_en: { name: "TN Free Bicycle Scheme", description: "Free bicycles for government school students in 11th standard", eligibility: ["Student in 11th standard", "Government or aided school", "Tamil Nadu resident"], benefits: "Free bicycle for school commute", documents: ["School ID", "Aadhaar Card", "Photo"], steps: ["School identifies eligible students", "List submitted to government", "Bicycles distributed at school", "Collect with ID proof"] },
      data_ta: { name: "தமிழ்நாடு இலவச மிதிவண்டித் திட்டம்", description: "11ஆம் வகுப்பு அரசு பள்ளி மாணவர்களுக்கு இலவச மிதிவண்டி", eligibility: ["11ஆம் வகுப்பு மாணவர்", "அரசு அல்லது உதவி பெறும் பள்ளி"], benefits: "பள்ளி பயணத்திற்கு இலவச மிதிவண்டி", documents: ["பள்ளி அடையாள அட்டை", "ஆதார் அட்டை", "புகைப்படம்"], steps: ["பள்ளி தகுதியான மாணவர்களை அடையாளம் காணும்", "பட்டியல் அரசுக்கு சமர்ப்பிக்கப்படும்", "பள்ளியில் மிதிவண்டிகள் விநியோகம்", "அடையாள ஆவணத்துடன் பெறவும்"] },
      data_tl: { name: "Tamil Nadu Ilavasa Mithivandi Thittam", description: "11am vaguppu arasu palli maanavargalukku ilavasa mithivandi", eligibility: ["11am vaguppu maanavar", "Arasu allathu uthavi perum palli"], benefits: "Palli payanathirkku ilavasa mithivandi", documents: ["Palli ID", "Aadhaar Card", "Photo"], steps: ["Palli thaguthiyana maanavargalai adaiyaalam kaanum", "Pattiyal arasukku samarpikkappadum", "Palliyil mithivandigal viniyogam", "Adaiyaala aavanathudan peravum"] },
    },
    {
      scheme_id: "tn-free-school-uniform",
      category: "student",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.tn.gov.in",
      popular: false,
      data_en: { name: "TN Free School Uniform & Books", description: "Free school uniforms, textbooks, notebooks and bags for all government school students", eligibility: ["Government school student", "Class 1-12"], benefits: "Free uniforms (4 sets), textbooks, notebooks, school bag, geometry box", documents: ["No documents needed"], steps: ["Enroll in government school", "Materials distributed at start of academic year", "No application needed"] },
      data_ta: { name: "தமிழ்நாடு இலவச சீருடை மற்றும் புத்தகங்கள்", description: "அனைத்து அரசு பள்ளி மாணவர்களுக்கும் இலவச சீருடை, புத்தகங்கள், பைகள்", eligibility: ["அரசு பள்ளி மாணவர்", "1 முதல் 12 வகுப்பு"], benefits: "இலவச சீருடைகள் (4 செட்), பாடப்புத்தகங்கள், பள்ளி பை", documents: ["ஆவணங்கள் தேவையில்லை"], steps: ["அரசு பள்ளியில் சேரவும்", "கல்வி ஆண்டின் தொடக்கத்தில் விநியோகம்", "விண்ணப்பம் தேவையில்லை"] },
      data_tl: { name: "Tamil Nadu Ilavasa Seerudai matrum Pusthagangal", description: "Anaithu arasu palli maanavargalukum ilavasa seerudai, pusthagangal, baigal", eligibility: ["Arasu palli maanavar", "1 mudhal 12 vaguppu"], benefits: "Ilavasa seerudaigal (4 set), padapusthagangal, palli bai", documents: ["Aavaningal thevai illai"], steps: ["Arasu palliyil seravum", "Kalvi aandin thodakkathil viniyogam", "Vinapam thevai illai"] },
    },
    {
      scheme_id: "pm-suraksha-bima",
      category: "health",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.jansuraksha.gov.in",
      popular: false,
      data_en: { name: "PM Suraksha Bima Yojana (Accident Insurance)", description: "₹2 lakh accident insurance for just ₹20/year premium", eligibility: ["Age 18-70", "Have a bank account", "Aadhaar linked to bank"], benefits: "₹2 lakh for accidental death, ₹1 lakh for partial disability", documents: ["Aadhaar Card", "Bank Account"], steps: ["Visit your bank branch", "Fill PMSBY enrollment form", "₹20 auto-debited yearly", "Claim through bank if accident occurs"] },
      data_ta: { name: "பிஎம் சுரக்ஷா பீமா யோஜனா", description: "வெறும் ₹20/வருடம் பிரீமியத்தில் ₹2 லட்சம் விபத்து காப்பீடு", eligibility: ["வயது 18-70", "வங்கி கணக்கு இருக்க வேண்டும்"], benefits: "விபத்து மரணத்திற்கு ₹2 லட்சம்", documents: ["ஆதார் அட்டை", "வங்கி கணக்கு"], steps: ["உங்கள் வங்கி கிளைக்கு செல்லவும்", "PMSBY படிவம் நிரப்பவும்", "வருடம் ₹20 தானாக எடுக்கப்படும்", "விபத்து நிகழ்ந்தால் வங்கி வழியாக கோரவும்"] },
      data_tl: { name: "PM Suraksha Bima Yojana", description: "Verum ₹20/varudam premium il ₹2 latcham vipathu kaapeedu", eligibility: ["Vayathu 18-70", "Bank kanakku irukka vendum"], benefits: "Vipathu maranathirkku ₹2 latcham", documents: ["Aadhaar Card", "Bank Kanakku"], steps: ["Ungal bank kilaikku sellavum", "PMSBY padivam nirapavum", "Varudam ₹20 thaanaga edukkappadum", "Vipathu nigazhnthal bank vazhiyaga koravum"] },
    },
    {
      scheme_id: "pm-jeevan-jyoti",
      category: "health",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.jansuraksha.gov.in",
      popular: false,
      data_en: { name: "PM Jeevan Jyoti Bima Yojana (Life Insurance)", description: "₹2 lakh life insurance for just ₹436/year premium", eligibility: ["Age 18-55", "Have a bank account"], benefits: "₹2 lakh to nominee on death due to any reason", documents: ["Aadhaar Card", "Bank Account", "Nominee details"], steps: ["Visit your bank branch", "Fill PMJJBY enrollment form", "₹436 auto-debited yearly", "Nominee claims through bank"] },
      data_ta: { name: "பிஎம் ஜீவன் ஜோதி பீமா யோஜனா", description: "வெறும் ₹436/வருடம் பிரீமியத்தில் ₹2 லட்சம் ஆயுள் காப்பீடு", eligibility: ["வயது 18-55", "வங்கி கணக்கு இருக்க வேண்டும்"], benefits: "எந்த காரணத்திலும் இறப்பின் போது வாரிசுக்கு ₹2 லட்சம்", documents: ["ஆதார் அட்டை", "வங்கி கணக்கு", "வாரிசு விவரங்கள்"], steps: ["உங்கள் வங்கி கிளைக்கு செல்லவும்", "PMJJBY படிவம் நிரப்பவும்", "வருடம் ₹436 தானாக எடுக்கப்படும்", "இறப்பின் போது வாரிசு கோரவும்"] },
      data_tl: { name: "PM Jeevan Jyoti Bima Yojana", description: "Verum ₹436/varudam premium il ₹2 latcham aayul kaapeedu", eligibility: ["Vayathu 18-55", "Bank kanakku irukka vendum"], benefits: "Entha kaaranathilum irappil varisukku ₹2 latcham", documents: ["Aadhaar Card", "Bank Kanakku", "Varisu vivarangal"], steps: ["Ungal bank kilaikku sellavum", "PMJJBY padivam nirapavum", "Varudam ₹436 thaanaga edukkappadum", "Irappil varisu koravum"] },
    },
    {
      scheme_id: "tn-ilaignargal-thittam",
      category: "student",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.tn.gov.in",
      popular: false,
      data_en: { name: "Naan Mudhalvan (Skill Development)", description: "Free skill development and placement assistance for Tamil Nadu youth", eligibility: ["Tamil Nadu resident", "Age 18-30", "Graduate or diploma holder"], benefits: "Free training in IT, soft skills + placement support", documents: ["Aadhaar Card", "Education Certificate", "Photo"], steps: ["Register at naanmudhalvan.tn.gov.in", "Choose skill course", "Complete training", "Get placement assistance"] },
      data_ta: { name: "நான் முதல்வன் (திறன் மேம்பாடு)", description: "தமிழ்நாடு இளைஞர்களுக்கு இலவச திறன் மேம்பாடு மற்றும் வேலைவாய்ப்பு உதவி", eligibility: ["தமிழ்நாடு குடியிருப்பாளர்", "வயது 18-30", "பட்டம் அல்லது டிப்ளோமா"], benefits: "IT, மென்திறன் இலவச பயிற்சி + வேலைவாய்ப்பு ஆதரவு", documents: ["ஆதார் அட்டை", "கல்வி சான்றிதழ்", "புகைப்படம்"], steps: ["naanmudhalvan.tn.gov.in இல் பதிவு செய்யவும்", "திறன் பாடநெறி தேர்வு செய்யவும்", "பயிற்சி முடிக்கவும்", "வேலைவாய்ப்பு உதவி பெறவும்"] },
      data_tl: { name: "Naan Mudhalvan (Thiran Mempaadu)", description: "Tamil Nadu ilaignargalukku ilavasa thiran mempaadu matrum velaivaaippu uthavi", eligibility: ["Tamil Nadu kudiyiruppalar", "Vayathu 18-30", "Pattam allathu diploma"], benefits: "IT, menthiran ilavasa payirchi + velaivaaippu aatharavu", documents: ["Aadhaar Card", "Kalvi Saanrithazh", "Photo"], steps: ["naanmudhalvan.tn.gov.in il pathivu seyyavum", "Thiran paadaneri thervu seyyavum", "Payirchi mudikkavum", "Velaivaaippu uthavi peravum"] },
    },
    {
      scheme_id: "tn-free-goat",
      category: "farmer",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.tn.gov.in",
      popular: false,
      data_en: { name: "TN Free Goat/Sheep Distribution Scheme", description: "Free goats or sheep for BPL families for livelihood support", eligibility: ["BPL family", "Rural area", "No previous animal husbandry benefit"], benefits: "Free 4 goats/sheep + insurance + feed for 3 months", documents: ["Aadhaar Card", "BPL Card", "Bank Account", "Photo"], steps: ["Apply at Block Veterinary office", "Submit documents", "Selection by officials", "Receive animals with insurance"] },
      data_ta: { name: "தமிழ்நாடு இலவச ஆடு/செம்மறி விநியோகத் திட்டம்", description: "BPL குடும்பங்களுக்கு இலவச ஆடுகள்/செம்மறிகள்", eligibility: ["BPL குடும்பம்", "கிராமப்புறம்"], benefits: "இலவச 4 ஆடுகள் + காப்பீடு + 3 மாத தீவனம்", documents: ["ஆதார் அட்டை", "BPL அட்டை", "வங்கி கணக்கு", "புகைப்படம்"], steps: ["தொகுதி கால்நடை அலுவலகத்தில் விண்ணப்பிக்கவும்", "ஆவணங்கள் சமர்ப்பிக்கவும்", "அதிகாரிகளால் தேர்வு", "காப்பீட்டுடன் விலங்குகள் பெறவும்"] },
      data_tl: { name: "Tamil Nadu Ilavasa Aadu Thittam", description: "BPL kudumbangalukku ilavasa aadugal/semmarigal", eligibility: ["BPL kudumbam", "Gramapuram"], benefits: "Ilavasa 4 aadugal + kaapeedu + 3 maadha theevanam", documents: ["Aadhaar Card", "BPL Card", "Bank Kanakku", "Photo"], steps: ["Thoguthi kaalnadai aluvalagathil vinapikkavum", "Aavaningal samarpikkavum", "Athigaarigalaal thervu", "Kaapeedudun vilangugal peravum"] },
    },
    {
      scheme_id: "tn-amma-baby-care-kit",
      category: "women",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.tn.gov.in",
      popular: false,
      data_en: { name: "Amma Baby Care Kit", description: "Free baby care kit with 16 essential items for newborns in government hospitals", eligibility: ["Delivery in government hospital", "Tamil Nadu resident"], benefits: "Free kit with baby clothes, diapers, mosquito net, towel, oil, soap, blanket", documents: ["Hospital admission record", "Aadhaar Card"], steps: ["Deliver baby in government hospital", "Kit provided automatically", "No separate application needed"] },
      data_ta: { name: "அம்மா குழந்தை பராமரிப்பு கிட்", description: "அரசு மருத்துவமனைகளில் பிறக்கும் குழந்தைகளுக்கு 16 பொருட்களுடன் இலவச கிட்", eligibility: ["அரசு மருத்துவமனையில் பிரசவம்"], benefits: "குழந்தை உடை, நேப்கின், கொசுவலை, போர்வை போன்ற இலவச கிட்", documents: ["மருத்துவமனை பதிவு", "ஆதார் அட்டை"], steps: ["அரசு மருத்துவமனையில் பிரசவம்", "தானாக கிட் வழங்கப்படும்", "தனி விண்ணப்பம் தேவையில்லை"] },
      data_tl: { name: "Amma Kuzhanthai Kit", description: "Arasu maruthuvamanigalil pirakkum kuzhanthaigalukku 16 porudkaludan ilavasa kit", eligibility: ["Arasu maruthuvamanayil pirasavam"], benefits: "Kuzhanthai udai, napkin, kosuvalai, porvai ponra ilavasa kit", documents: ["Maruthuvamanai pathivu", "Aadhaar Card"], steps: ["Arasu maruthuvamanayil pirasavam", "Thaanaga kit vazhangappadum", "Thani vinapam thevai illai"] },
    },
    {
      scheme_id: "tn-social-security-pension",
      category: "pension",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.tn.gov.in",
      popular: false,
      data_en: { name: "TN Destitute Pension Scheme", description: "Monthly pension for destitute persons with no family support or income", eligibility: ["No family support", "No regular income", "Tamil Nadu resident", "Age 18+"], benefits: "₹1,000 per month", documents: ["Aadhaar Card", "Income Certificate", "Destitute Certificate from VAO", "Bank Account"], steps: ["Get destitute certificate from VAO", "Apply at taluk office", "Submit documents", "Pension credited monthly"] },
      data_ta: { name: "தமிழ்நாடு ஆதரவற்றோர் ஓய்வூதியம்", description: "ஆதரவற்றவர்களுக்கு மாதாந்திர ஓய்வூதியம்", eligibility: ["குடும்ப ஆதரவு இல்லாதவர்", "வருமானம் இல்லாதவர்", "தமிழ்நாடு குடியிருப்பாளர்"], benefits: "மாதம் ₹1,000", documents: ["ஆதார் அட்டை", "வருமான சான்றிதழ்", "VAO ஆதரவற்றோர் சான்றிதழ்", "வங்கி கணக்கு"], steps: ["VAO இடமிருந்து சான்றிதழ் பெறவும்", "தாலுக்கா அலுவலகத்தில் விண்ணப்பிக்கவும்", "ஆவணங்கள் சமர்ப்பிக்கவும்", "ஓய்வூதியம் மாதாந்திரம் வரவு"] },
      data_tl: { name: "Tamil Nadu Aatharavatrror Oivuthiyam", description: "Aatharavattravargalukku madhaanthira oivuthiyam", eligibility: ["Kudumba aatharavu illaathavar", "Varumanam illaathavar", "Tamil Nadu kudiyiruppalar"], benefits: "Madham ₹1,000", documents: ["Aadhaar Card", "Varumaana Saanrithazh", "VAO Saanrithazh", "Bank Kanakku"], steps: ["VAO idamirunthu saanrithazh peravum", "Taluk aluvalagathil vinapikkavum", "Aavaningal samarpikkavum", "Oivuthiyam madhaanthiram varavu"] },
    },
    {
      scheme_id: "tn-pudhu-vaazhvu",
      category: "women",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.tn.gov.in",
      popular: false,
      data_en: { name: "TN SHG (Self Help Group) Scheme", description: "Revolving fund and bank linkage for women's Self Help Groups", eligibility: ["Women's SHG with 12+ members", "Active for 6+ months", "Regular savings"], benefits: "₹15,000 revolving fund + bank loan up to ₹5 lakh + training", documents: ["SHG Registration", "Meeting Minutes", "Savings Passbook", "Member Aadhaar"], steps: ["Form SHG with 12-20 women", "Register with block office", "Save regularly for 6 months", "Apply for revolving fund"] },
      data_ta: { name: "தமிழ்நாடு சுயஉதவி குழு திட்டம்", description: "பெண்கள் சுயஉதவி குழுக்களுக்கு சுழல் நிதி மற்றும் வங்கி இணைப்பு", eligibility: ["12+ உறுப்பினர்கள் கொண்ட பெண்கள் குழு", "6+ மாதங்கள் செயலில்"], benefits: "₹15,000 சுழல் நிதி + ₹5 லட்சம் வங்கி கடன் + பயிற்சி", documents: ["குழு பதிவு", "கூட்ட குறிப்புகள்", "சேமிப்பு பாஸ்புக்", "உறுப்பினர் ஆதார்"], steps: ["12-20 பெண்களுடன் குழு அமைக்கவும்", "தொகுதியில் பதிவு செய்யவும்", "6 மாதம் சேமிக்கவும்", "சுழல் நிதிக்கு விண்ணப்பிக்கவும்"] },
      data_tl: { name: "Tamil Nadu SHG Thittam", description: "Pengal suyaudavi kuzhukalukku suzhal nidhi matrum bank inaippu", eligibility: ["12+ uruppinargal konda pengal kuzhu", "6+ maadangal seyalil"], benefits: "₹15,000 suzhal nidhi + ₹5 latcham bank kadan + payirchi", documents: ["Kuzhu Pathivu", "Kootta Kurippugal", "Semippu Passbook", "Uruppinar Aadhaar"], steps: ["12-20 pengaludan kuzhu amaikkavum", "Thoguthiyil pathivu seyyavum", "6 maadham semikkavum", "Suzhal nidhikku vinapikkavum"] },
    },
    {
      scheme_id: "tn-free-mixer-grinder",
      category: "women",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.tn.gov.in",
      popular: false,
      data_en: { name: "TN Free Mixer Grinder Scheme", description: "Free mixer grinder for families with electricity connection and ration card", eligibility: ["Ration card holder", "Electricity connection", "Tamil Nadu resident"], benefits: "Free mixer grinder", documents: ["Ration Card", "EB Bill", "Aadhaar Card"], steps: ["Apply when scheme announced", "Submit ration card and EB bill", "Verification by officials", "Collect mixer grinder"] },
      data_ta: { name: "தமிழ்நாடு இலவச மிக்ஸி திட்டம்", description: "மின் இணைப்பு மற்றும் ரேஷன் அட்டை உள்ள குடும்பங்களுக்கு இலவச மிக்ஸி", eligibility: ["ரேஷன் அட்டை வைத்திருப்பவர்", "மின் இணைப்பு"], benefits: "இலவச மிக்ஸி கிரைண்டர்", documents: ["ரேஷன் அட்டை", "EB பில்", "ஆதார் அட்டை"], steps: ["திட்டம் அறிவிக்கப்படும்போது விண்ணப்பிக்கவும்", "ரேஷன் அட்டை மற்றும் EB பில் சமர்ப்பிக்கவும்", "சரிபார்ப்பு", "மிக்ஸி பெறவும்"] },
      data_tl: { name: "Tamil Nadu Ilavasa Mixie Thittam", description: "Min inaippu matrum ration card ulla kudumbangalukku ilavasa mixie", eligibility: ["Ration card vaithiruppavar", "Min inaippu"], benefits: "Ilavasa mixie grinder", documents: ["Ration Card", "EB Bill", "Aadhaar Card"], steps: ["Thittam arivikkappadumpodhu vinapikkavum", "Ration card matrum EB bill samarpikkavum", "Sariparpu", "Mixie peravum"] },
    },
    {
      scheme_id: "atal-pension",
      category: "pension",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.npscra.nsdl.co.in",
      popular: false,
      data_en: { name: "Atal Pension Yojana", description: "Guaranteed pension of ₹1,000-₹5,000/month after age 60 for unorganized sector workers", eligibility: ["Age 18-40", "Have a bank account", "Not a taxpayer"], benefits: "₹1,000 to ₹5,000 monthly pension after 60", documents: ["Aadhaar Card", "Bank Account", "Mobile Number"], steps: ["Visit your bank branch", "Choose pension amount", "Monthly contribution auto-debited", "Pension starts at age 60"] },
      data_ta: { name: "அடல் ஓய்வூதிய யோஜனா", description: "60 வயதிற்குப் பிறகு ₹1,000-₹5,000/மாதம் உத்தரவாத ஓய்வூதியம்", eligibility: ["வயது 18-40", "வங்கி கணக்கு இருக்க வேண்டும்"], benefits: "60 வயதிற்குப் பிறகு மாதம் ₹1,000 முதல் ₹5,000 ஓய்வூதியம்", documents: ["ஆதார் அட்டை", "வங்கி கணக்கு", "மொபைல் எண்"], steps: ["உங்கள் வங்கி கிளைக்கு செல்லவும்", "ஓய்வூதிய தொகை தேர்வு செய்யவும்", "மாதாந்திர பங்களிப்பு தானாக எடுக்கப்படும்", "60 வயதில் ஓய்வூதியம் தொடங்கும்"] },
      data_tl: { name: "Atal Oivuthiya Yojana", description: "60 vayathirkku piragu ₹1,000-₹5,000/madham oivuthiyam", eligibility: ["Vayathu 18-40", "Bank kanakku irukka vendum"], benefits: "60 vayathirkku piragu madham ₹1,000 mudhal ₹5,000 oivuthiyam", documents: ["Aadhaar Card", "Bank Kanakku", "Mobile Number"], steps: ["Ungal bank kilaikku sellavum", "Oivuthiya thogai thervu seyyavum", "Madhaanthira pangalippu thaanaga edukkappadum", "60 vayathil oivuthiyam thodangum"] },
    },
    {
      scheme_id: "tn-free-electricity",
      category: "housing",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.tn.gov.in",
      popular: false,
      data_en: { name: "TN Free Electricity (100 Units)", description: "Free electricity up to 100 units per month for domestic consumers", eligibility: ["Domestic electricity connection", "Usage below 100 units/month"], benefits: "Completely free electricity if usage below 100 units", documents: ["EB Connection", "Aadhaar Card"], steps: ["Already automatic for eligible connections", "Keep monthly usage below 100 units", "No bill generated", "Check EB website for status"] },
      data_ta: { name: "தமிழ்நாடு இலவச மின்சாரம் (100 யூனிட்)", description: "மாதம் 100 யூனிட் வரை இலவச மின்சாரம்", eligibility: ["வீட்டு மின் இணைப்பு", "100 யூனிட்டுக்கு கீழ் பயன்பாடு"], benefits: "100 யூனிட்டுக்கு கீழ் இருந்தால் முற்றிலும் இலவசம்", documents: ["EB இணைப்பு", "ஆதார் அட்டை"], steps: ["தகுதியான இணைப்புகளுக்கு தானாக", "100 யூனிட்டுக்கு கீழ் வைக்கவும்", "பில் உருவாக்கப்படாது", "EB இணையதளத்தில் சரிபார்க்கவும்"] },
      data_tl: { name: "Tamil Nadu Ilavasa Minsaaram (100 Unit)", description: "Madham 100 unit varai ilavasa minsaaram", eligibility: ["Veettu min inaippu", "100 unit ku keel payanpaadu"], benefits: "100 unit ku keel irunthal mutrrilum ilavasam", documents: ["EB Inaippu", "Aadhaar Card"], steps: ["Thaguthiyana inaippugalukku thaanaga", "100 unit ku keel vaikkavum", "Bill uruvakkappadadhu", "EB inaiyathalathil sariparkavum"] },
    },
    {
      scheme_id: "tn-free-toilet",
      category: "housing",
      status: "Open",
      last_updated: ts,
      official_source: "https://www.tn.gov.in",
      popular: false,
      data_en: { name: "Swachh Bharat - Free Toilet Scheme", description: "Free individual household toilet construction for BPL families", eligibility: ["No toilet at home", "BPL family", "Rural area"], benefits: "₹12,000 for toilet construction", documents: ["Aadhaar Card", "BPL Card", "Bank Account"], steps: ["Apply at Gram Panchayat", "Verification by officials", "Construct toilet", "Get reimbursement after completion"] },
      data_ta: { name: "சுவச் பாரத் - இலவச கழிவறை திட்டம்", description: "BPL குடும்பங்களுக்கு இலவச கழிவறை கட்டுமானம்", eligibility: ["வீட்டில் கழிவறை இல்லாதவர்", "BPL குடும்பம்", "கிராமப்புறம்"], benefits: "கழிவறை கட்டுமானத்திற்கு ₹12,000", documents: ["ஆதார் அட்டை", "BPL அட்டை", "வங்கி கணக்கு"], steps: ["கிராம பஞ்சாயத்தில் விண்ணப்பிக்கவும்", "அதிகாரிகள் சரிபார்ப்பு", "கழிவறை கட்டவும்", "முடிந்ததும் பணம் திருப்பி பெறவும்"] },
      data_tl: { name: "Swachh Bharat - Ilavasa Kazhivarai Thittam", description: "BPL kudumbangalukku ilavasa kazhivarai kattumaanam", eligibility: ["Veettil kazhivarai illaathavar", "BPL kudumbam", "Gramapuram"], benefits: "Kazhivarai kattumaanatirkku ₹12,000", documents: ["Aadhaar Card", "BPL Card", "Bank Kanakku"], steps: ["Grama Panchayathil vinapikkavum", "Athigaarigal sariparpu", "Kazhivarai kattavum", "Mudinthathum panam thiruppi peravum"] },
    },
  ];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    console.log("Starting scheme sync...");

    const schemes = getCuratedSchemes();
    let insertedCount = 0;

    for (const scheme of schemes) {
      const { error } = await supabase.from("live_schemes").upsert(
        {
          scheme_id: scheme.scheme_id,
          category: scheme.category,
          status: scheme.status,
          last_updated: scheme.last_updated,
          official_source: scheme.official_source,
          popular: scheme.popular,
          data_en: scheme.data_en,
          data_ta: scheme.data_ta,
          data_tl: scheme.data_tl,
          fetched_at: new Date().toISOString(),
        },
        { onConflict: "scheme_id" }
      );

      if (error) {
        console.error(`Error upserting ${scheme.scheme_id}:`, error);
      } else {
        insertedCount++;
      }
    }

    await supabase.from("sync_log").insert({
      sync_type: "daily_cron",
      status: "success",
      schemes_count: insertedCount,
    });

    console.log(`Sync complete: ${insertedCount} schemes updated`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Synced ${insertedCount} schemes`,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Sync error:", error);

    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, serviceKey);
      await supabase.from("sync_log").insert({
        sync_type: "daily_cron",
        status: "error",
        error_message: error instanceof Error ? error.message : "Unknown error",
      });
    } catch (_) {
      // ignore logging errors
    }

    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Sync failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
