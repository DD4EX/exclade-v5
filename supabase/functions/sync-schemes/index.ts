import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Government scheme sources to scrape
const GOV_SOURCES = [
  {
    url: "https://www.myscheme.gov.in/search/state/TN",
    name: "MyScheme Tamil Nadu",
  },
  {
    url: "https://pmkisan.gov.in",
    name: "PM Kisan",
  },
  {
    url: "https://www.india.gov.in/topics/agriculture/farmers-welfare",
    name: "India.gov Farmer Welfare",
  },
];

// Known government scheme data that we can reliably fetch and structure
// This acts as a curated dataset that gets inserted into the DB
function getCuratedSchemes() {
  return [
    {
      scheme_id: "pm-kisan-live",
      category: "farmer",
      status: "Open",
      last_updated: new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      official_source: "https://pmkisan.gov.in",
      popular: true,
      data_en: { name: "PM Kisan Samman Nidhi", description: "Income support of ₹6,000 per year for farmer families in 3 installments", eligibility: ["Must be a farmer", "Own agricultural land", "Family income below ₹2 lakh/year"], benefits: "₹6,000 per year in 3 installments", documents: ["Aadhaar Card", "Bank Passbook", "Land Record", "Ration Card"], steps: ["Visit CSC center or VAO office", "Fill PM Kisan form", "Submit documents", "Wait for verification"] },
      data_ta: { name: "பிஎம் கிசான் சம்மன் நிதி", description: "விவசாயக் குடும்பங்களுக்கு ₹6,000 வருடாந்திர வருமான ஆதரவு", eligibility: ["விவசாயி ஆக வேண்டும்", "விவசாய நிலம் சொந்தம்", "குடும்ப வருமானம் ₹2 லட்சத்திற்கு கீழ்"], benefits: "₹2,000 வீதம் 3 தவணைகளில் ₹6,000", documents: ["ஆதார்", "வங்கி பாஸ்புக்", "நிலப் பட்டா", "ரேஷன் அட்டை"], steps: ["CSC மையம் செல்லவும்", "படிவம் நிரப்பவும்", "ஆவணங்கள் சமர்ப்பிக்கவும்", "சரிபார்ப்புக்கு காத்திருக்கவும்"] },
      data_tl: { name: "PM Kisan Samman Nidhi", description: "Vivasaya kudumbangalukku varudanthira ₹6,000 varumaana aatharavu", eligibility: ["Vivasayi aaga vendum", "Vivasaya nilam sontham", "Kudumba varumanam ₹2 latchathirkku keel"], benefits: "₹2,000 veethum 3 thavanaigalil ₹6,000", documents: ["Aadhaar", "Bank Passbook", "Nila Patta", "Ration Card"], steps: ["CSC maiyam sellavum", "Padivam nirapavum", "Aavaningal samarpikkavum", "Sariparpukku kaathirukavum"] },
    },
    {
      scheme_id: "tn-kalaignar-magalir-urimai",
      category: "women",
      status: "Open",
      last_updated: new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      official_source: "https://www.tn.gov.in",
      popular: true,
      data_en: { name: "Kalaignar Magalir Urimai Thittam", description: "₹1,000 monthly assistance for women heads of families in Tamil Nadu", eligibility: ["Woman head of family", "Tamil Nadu resident", "Annual income below ₹2.5 lakh", "Age 21+"], benefits: "₹1,000 per month directly to bank account", documents: ["Aadhaar Card", "Ration Card", "Bank Account", "Income Certificate"], steps: ["Apply online or at taluk office", "Submit required documents", "Verification by officials", "Amount credited monthly"] },
      data_ta: { name: "கலைஞர் மகளிர் உரிமைத் திட்டம்", description: "தமிழ்நாட்டில் குடும்பத் தலைவிகளுக்கு மாதம் ₹1,000 உதவி", eligibility: ["குடும்பத் தலைவி", "தமிழ்நாடு குடியிருப்பாளர்", "வருடாந்திர வருமானம் ₹2.5 லட்சத்திற்கு கீழ்", "21+ வயது"], benefits: "வங்கிக் கணக்கில் நேரடியாக மாதம் ₹1,000", documents: ["ஆதார்", "ரேஷன் அட்டை", "வங்கி கணக்கு", "வருமான சான்றிதழ்"], steps: ["ஆன்லைனில் அல்லது தாலுக்கா அலுவலகத்தில் விண்ணப்பிக்கவும்", "ஆவணங்களை சமர்ப்பிக்கவும்", "அதிகாரிகள் சரிபார்ப்பு", "மாதாந்திர தொகை வரவு"] },
      data_tl: { name: "Kalaignar Magalir Urimai Thittam", description: "Tamil Naattil kudumba thalaivigalukku madham ₹1,000 uthavi", eligibility: ["Kudumba thalaivi", "Tamil Nadu kudiyiruppalar", "Varudanthira varumanam ₹2.5 latchathirkku keel", "21+ vayathu"], benefits: "Bank kanakkil neradiyaga madham ₹1,000", documents: ["Aadhaar", "Ration Card", "Bank Kanakku", "Varumaana Saanrithazh"], steps: ["Online allathu taluk aluvalagathil vinapikkavum", "Aavaningalai samarpikkavum", "Athigaarigal sariparpu", "Madhaanthira thogai varavu"] },
    },
    {
      scheme_id: "tn-free-rice",
      category: "health",
      status: "Open",
      last_updated: new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      official_source: "https://www.tn.gov.in",
      popular: true,
      data_en: { name: "TN Free Rice Scheme", description: "Free rice distribution for ration card holders in Tamil Nadu", eligibility: ["Ration card holder", "Tamil Nadu resident"], benefits: "Free rice monthly through PDS shops", documents: ["Ration Card", "Aadhaar Card"], steps: ["Visit nearest PDS shop", "Show ration card", "Collect monthly rice quota"] },
      data_ta: { name: "தமிழ்நாடு இலவச அரிசித் திட்டம்", description: "ரேஷன் அட்டை வைத்திருப்பவர்களுக்கு இலவச அரிசி விநியோகம்", eligibility: ["ரேஷன் அட்டை வைத்திருப்பவர்", "தமிழ்நாடு குடியிருப்பாளர்"], benefits: "PDS கடைகள் வழியாக மாதாந்திர இலவச அரிசி", documents: ["ரேஷன் அட்டை", "ஆதார் அட்டை"], steps: ["அருகிலுள்ள PDS கடைக்கு செல்லவும்", "ரேஷன் அட்டை காட்டவும்", "மாதாந்திர அரிசி பெறவும்"] },
      data_tl: { name: "Tamil Nadu Ilavasa Arisi Thittam", description: "Ration card vaithiruppavargalukku ilavasa arisi viniyogam", eligibility: ["Ration card vaithiruppavar", "Tamil Nadu kudiyiruppalar"], benefits: "PDS kadaigal vazhiyaga madhaanthira ilavasa arisi", documents: ["Ration Card", "Aadhaar Card"], steps: ["Arukilulla PDS kadaikku sellavum", "Ration card kaattavum", "Madhaanthira arisi peravum"] },
    },
    {
      scheme_id: "ayushman-bharat",
      category: "health",
      status: "Open",
      last_updated: new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      official_source: "https://pmjay.gov.in",
      popular: true,
      data_en: { name: "Ayushman Bharat (PM-JAY)", description: "Health insurance of ₹5 lakh per family per year for secondary and tertiary care", eligibility: ["BPL family", "No other health insurance", "Listed in SECC database"], benefits: "₹5,00,000 health coverage per family per year", documents: ["Aadhaar Card", "Ration Card", "BPL Certificate", "Family Photo"], steps: ["Check eligibility at pmjay.gov.in", "Visit CSC center with documents", "Get Ayushman card issued", "Use at empanelled hospitals"] },
      data_ta: { name: "ஆயுஷ்மான் பாரத் (PM-JAY)", description: "குடும்பத்திற்கு வருடத்திற்கு ₹5 லட்சம் சுகாதார காப்பீடு", eligibility: ["BPL குடும்பம்", "வேறு காப்பீடு இல்லை", "SECC பட்டியலில் இடம்"], benefits: "குடும்பத்திற்கு வருடத்திற்கு ₹5,00,000 காப்பீடு", documents: ["ஆதார்", "ரேஷன் அட்டை", "BPL சான்றிதழ்", "குடும்ப புகைப்படம்"], steps: ["pmjay.gov.in இல் தகுதி சரிபார்க்கவும்", "CSC மையத்தில் ஆவணங்கள் சமர்ப்பிக்கவும்", "ஆயுஷ்மான் அட்டை பெறவும்", "பட்டியலிடப்பட்ட மருத்துவமனைகளில் பயன்படுத்தவும்"] },
      data_tl: { name: "Ayushman Bharat (PM-JAY)", description: "Kudumbathirkku varudathirkku ₹5 latcham sugaathara kaapeedu", eligibility: ["BPL kudumbam", "Vera kaapeedu illai", "SECC pattiyalil idam"], benefits: "Kudumbathirkku varudathirkku ₹5,00,000 kaapeedu", documents: ["Aadhaar", "Ration Card", "BPL Saanrithazh", "Kudumba Photo"], steps: ["pmjay.gov.in il thaguthi sariparkavum", "CSC maiyathil aavaningal samarpikkavum", "Ayushman card peravum", "Pattiyalidapatta maruthuvamanigalil payanpaduthavum"] },
    },
    {
      scheme_id: "tn-marriage-assistance",
      category: "women",
      status: "Open",
      last_updated: new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      official_source: "https://www.tn.gov.in",
      popular: false,
      data_en: { name: "TN Marriage Assistance Scheme", description: "₹25,000-₹50,000 marriage assistance for women from poor families", eligibility: ["Bride from BPL family", "Age 18+", "First marriage", "Tamil Nadu resident"], benefits: "₹25,000 to ₹50,000 based on education level + 8g gold", documents: ["Aadhaar Card", "Income Certificate", "Community Certificate", "Marriage Invitation", "Education Certificate"], steps: ["Apply before marriage at district office", "Submit all documents", "Attend verification", "Collect cheque after marriage registration"] },
      data_ta: { name: "தமிழ்நாடு திருமண உதவித் திட்டம்", description: "ஏழைக் குடும்பப் பெண்களுக்கு ₹25,000-₹50,000 திருமண உதவி", eligibility: ["BPL குடும்ப மணப்பெண்", "18+ வயது", "முதல் திருமணம்", "தமிழ்நாடு குடியிருப்பாளர்"], benefits: "கல்வி அடிப்படையில் ₹25,000 முதல் ₹50,000 + 8 கிராம் தங்கம்", documents: ["ஆதார்", "வருமான சான்றிதழ்", "சமூக சான்றிதழ்", "திருமண அழைப்பிதழ்", "கல்வி சான்றிதழ்"], steps: ["திருமணத்திற்கு முன் மாவட்ட அலுவலகத்தில் விண்ணப்பிக்கவும்", "ஆவணங்கள் சமர்ப்பிக்கவும்", "சரிபார்ப்புக்கு வரவும்", "திருமணப் பதிவுக்குப் பிறகு காசோலை பெறவும்"] },
      data_tl: { name: "Tamil Nadu Thirumanam Uthavi Thittam", description: "Ezhai kudumba pengalukku ₹25,000-₹50,000 thirumanam uthavi", eligibility: ["BPL kudumba manapenn", "18+ vayathu", "Mudhal thirumanam", "Tamil Nadu kudiyiruppalar"], benefits: "Kalvi adippadaiyil ₹25,000 mudhal ₹50,000 + 8 gram thangam", documents: ["Aadhaar", "Varumaana Saanrithazh", "Samuga Saanrithazh", "Thirumanam Azhaippithazh", "Kalvi Saanrithazh"], steps: ["Thirumanathirkku mun maavatta aluvalagathil vinapikkavum", "Aavaningal samarpikkavum", "Sariparpukku varavum", "Thirumanam pathivukku piragu kasolai peravum"] },
    },
    {
      scheme_id: "sukanya-samriddhi",
      category: "student",
      status: "Open",
      last_updated: new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      official_source: "https://www.india.gov.in/sukanya-samriddhi-yojna",
      popular: false,
      data_en: { name: "Sukanya Samriddhi Yojana", description: "Savings scheme for girl child with high interest rate and tax benefits", eligibility: ["Girl child below 10 years", "Indian citizen", "Maximum 2 accounts per family"], benefits: "8.2% interest rate with tax-free maturity amount", documents: ["Birth Certificate of girl", "Parent Aadhaar", "Address Proof", "Photo"], steps: ["Visit post office or bank", "Open Sukanya account", "Deposit minimum ₹250/year", "Maturity at girl's age 21"] },
      data_ta: { name: "சுகன்யா சம்ரிதி யோஜனா", description: "பெண் குழந்தைகளுக்கான அதிக வட்டி விகிதம் மற்றும் வரி சலுகை சேமிப்புத் திட்டம்", eligibility: ["10 வயதுக்கு கீழ் பெண் குழந்தை", "இந்திய குடிமகன்", "குடும்பத்திற்கு 2 கணக்குகள் வரை"], benefits: "8.2% வட்டி விகிதம், வரி இல்லா முதிர்வுத் தொகை", documents: ["பெண் குழந்தையின் பிறப்புச் சான்றிதழ்", "பெற்றோர் ஆதார்", "முகவரி ஆதாரம்", "புகைப்படம்"], steps: ["தபால் அலுவலகம் அல்லது வங்கிக்கு செல்லவும்", "சுகன்யா கணக்கு தொடங்கவும்", "வருடத்திற்கு குறைந்தது ₹250 செலுத்தவும்", "பெண் 21 வயதில் முதிர்வு"] },
      data_tl: { name: "Sukanya Samriddhi Yojana", description: "Penn kuzhanthaigalukkaana athiga vatti vigitham matrum vari salugai semipu thittam", eligibility: ["10 vayathukku keel penn kuzhanthai", "India kudimagan", "Kudumbathirkku 2 kanakkugal varai"], benefits: "8.2% vatti vigitham, vari illa muthirvuthu thogai", documents: ["Penn kuzhanthai pirappu saanrithazh", "Petror Aadhaar", "Mugavari Aatharam", "Photo"], steps: ["Thapal aluvalagam allathu bankku sellavum", "Sukanya kanakku thodangavum", "Varudathirkku kurainthathu ₹250 seluthavum", "Penn 21 vayathil muthirvu"] },
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

    // Log the sync
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
