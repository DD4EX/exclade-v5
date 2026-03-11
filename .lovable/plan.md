# A. Chithur Village Government Scheme Assistant

A mobile-first PWA helping villagers discover government welfare schemes, check eligibility, and learn how to apply — fully usable offline.

## Pages & Features

### 1. Welcome/Language Selection Page

- App title and village location display
- Three large language buttons: தமிழ் / Tanglish / English
- Language choice saved locally, affects all text throughout the app

### 2. Home Dashboard

- Search bar for schemes
- 6 category buttons with icons (Farmer, Student, Women, Health, Housing, Pension)
- "Popular Schemes in A. Chithur" section with scheme cards (name, description, status, last updated)
- Floating "Ask AI Assistant" button

### 3. Scheme Category Page

- Filtered list of scheme cards for selected category
- Each card: name, description, eligibility summary, status, "View Details" button

### 4. Scheme Details Page

- Full scheme info: description, eligibility, benefits, documents, step-by-step application, official source link
- "Check Eligibility" and "Ask AI" buttons

### 5. Eligibility Checker

- Simple questionnaire (farmer?, land owner?, student?, senior?, income level?)
- Shows matching schemes based on answers

### 6. AI Assistant (powered by Lovable AI)

- Chat interface understanding Tamil, Tanglish, and English
- Helps find schemes, explain eligibility, documents, and application steps
- Uses local scheme data as context sent to AI

### 7. Voice Search

- Microphone button using Web Speech API
- Converts speech to text and searches schemes

### 8. Help Centers Page

- Lists nearby offices (VAO, Taluk Office, CSC) with address and Google Maps link

### 9. About Page

- Platform purpose and developer details (Durai B, A. Chithur)

### 10. Navigation & Footer

- Bottom navigation menu: Home, Categories, Eligibility, Help Centers, AI Assistant, About
- Footer with creator info and disclaimer

## PWA & Offline Support

- PWA manifest with app name, icons, and install prompt
- Service Worker for caching all assets and data
- All scheme data stored in local JSON files (`/data/schemes.json`, `categories.json`, `helpcenters.json`)
- LocalStorage for language preference and cached data
- "Update Scheme Data" button when online

## Design

- Mobile-first, large buttons and text, minimal scrolling
- Color palette: greens, white, light brown (village-inspired)
- Icons for every category
- Rural-friendly, fast-loading UI

## Data

- ~15-20 real government schemes across 6 categories, with Tamil/Tanglish/English translations
- All data bundled as local JSON files
- and also connect with real official goverment website's  to find the schemes and offer's
- and also search among google and other website's find that scheme.

## Backend

- use free unlimited Cloud edge function for AI Assistant (search the free ai cloud to add on that). or use lovable when the data's are added more remove first uploaeded data use stack method(FIFO). to use lovable freely and unlimitedly
- AI works when online; offline shows cached responses or a friendly offline message