export type Lang = 'en' | 'hi' | 'pa'

export interface Mela {
  id: string; name: string; nameLoc: string; pilgrims: string; ghats: string
  river: string; window: string; langs: string; accent: string; accent2: string
  zones: string[]; ghat: string
}

export const MELAS: Mela[] = [
  { id: 'haridwar', name: 'Haridwar · Ardh Kumbh 2027', nameLoc: 'हरिद्वार अर्ध कुंभ', pilgrims: '~5 cr expected', ghats: '36 ghats · 14 zones', river: 'Ganga', window: '14 Jan – 20 Apr 2027', langs: 'English, हिन्दी, ਪੰਜਾਬੀ', accent: '#ff8a3d', accent2: '#ff4f6d', zones: ['Har Ki Pauri Zone', 'Mansa Devi Zone', 'Bairagi Camp Zone'], ghat: 'Har Ki Pauri (Brahmakund)' },
  { id: 'prayagraj', name: 'Prayagraj · Maha Kumbh', nameLoc: 'प्रयागराज महाकुंभ', pilgrims: '~40 cr expected', ghats: '44 ghats · 25 sectors', river: 'Triveni Sangam', window: 'Jan – Feb', langs: 'English, हिन्दी', accent: '#ff5ea8', accent2: '#a78bfa', zones: ['Sangam Zone', 'Arail Zone', 'Jhunsi Zone'], ghat: 'Sangam Nose' },
  { id: 'ujjain', name: 'Ujjain · Simhastha', nameLoc: 'उज्जैन सिंहस्थ', pilgrims: '~5 cr expected', ghats: '20 ghats · 10 sectors', river: 'Shipra', window: 'Apr – May', langs: 'English, हिन्दी, मराठी', accent: '#2dd4bf', accent2: '#38bdf8', zones: ['Ram Ghat Zone', 'Mahakal Zone', 'Datt Akhara Zone'], ghat: 'Ram Ghat' },
  { id: 'nashik', name: 'Nashik · Simhastha', nameLoc: 'नाशिक सिंहस्थ', pilgrims: '~3 cr expected', ghats: '16 ghats · 8 sectors', river: 'Godavari', window: 'Jul – Sep', langs: 'English, हिन्दी, मराठी', accent: '#a78bfa', accent2: '#60a5fa', zones: ['Ramkund Zone', 'Tapovan Zone', 'Panchavati Zone'], ghat: 'Ramkund' },
]

export const T: Record<string, Record<Lang, string>> = {
  namaste: { en: 'Namaste', hi: 'नमस्ते', pa: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ' },
  help: { en: 'How can we help your yatra?', hi: 'आपकी यात्रा में हम कैसे सहायता करें?', pa: 'ਅਸੀਂ ਤੁਹਾਡੀ ਯਾਤਰਾ ਵਿੱਚ ਕਿਵੇਂ ਮਦਦ ਕਰੀਏ?' },
  choose: { en: 'Choose how to enter', hi: 'प्रवेश का तरीका चुनें', pa: 'ਦਾਖਲੇ ਦਾ ਤਰੀਕਾ ਚੁਣੋ' },
  yourGhat: { en: 'Your ghat right now', hi: 'आपका घाट अभी', pa: 'ਤੁਹਾਡਾ ਘਾਟ ਹੁਣ' },
  sos: { en: 'SOS', hi: 'एसओएस', pa: 'ਐਸਓਐਸ' },
  sahayak: { en: 'Talk to Sahayak', hi: 'सहायक से बात करें', pa: 'ਸਹਾਇਕ ਨਾਲ ਗੱਲ ਕਰੋ' },
  plan: { en: 'Plan my visit', hi: 'यात्रा की योजना', pa: 'ਮੇਰੀ ਫੇਰੀ ਦੀ ਯੋਜਨਾ' },
  route: { en: 'My ghat & route', hi: 'मेरा घाट और मार्ग', pa: 'ਮੇਰਾ ਘਾਟ ਤੇ ਰਸਤਾ' },
  crowd: { en: 'Crowd & safe bathing', hi: 'भीड़ और सुरक्षित स्नान', pa: 'ਭੀੜ ਤੇ ਸੁਰੱਖਿਅਤ ਇਸ਼ਨਾਨ' },
  stay: { en: 'Where to stay', hi: 'कहाँ ठहरें', pa: 'ਕਿੱਥੇ ਠਹਿਰਨਾ' },
  food: { en: 'Free food & bhandara', hi: 'निःशुल्क भोजन व भंडारा', pa: 'ਮੁਫ਼ਤ ਭੋਜਨ ਤੇ ਭੰਡਾਰਾ' },
  water: { en: 'Water & toilets', hi: 'पानी और शौचालय', pa: 'ਪਾਣੀ ਤੇ ਪਖਾਨੇ' },
  park: { en: 'Park & Ride · traffic', hi: 'पार्क एंड राइड · ट्रैफिक', pa: 'ਪਾਰਕ ਐਂਡ ਰਾਈਡ · ਟ੍ਰੈਫਿਕ' },
  around: { en: 'Getting around', hi: 'आवागमन', pa: 'ਆਵਾਜਾਈ' },
  services: { en: 'Nearest services', hi: 'निकटतम सेवाएँ', pa: 'ਨੇੜਲੀਆਂ ਸੇਵਾਵਾਂ' },
  snan: { en: 'Shahi Snan dates', hi: 'शाही स्नान तिथियाँ', pa: 'ਸ਼ਾਹੀ ਇਸ਼ਨਾਨ ਮਿਤੀਆਂ' },
  group: { en: 'My group', hi: 'मेरा समूह', pa: 'ਮੇਰਾ ਗਰੁੱਪ' },
  offline: { en: 'Offline & install', hi: 'ऑफ़लाइन व इंस्टॉल', pa: 'ਆਫ਼ਲਾਈਨ ਤੇ ਇੰਸਟਾਲ' },
  lost: { en: 'Lost & found', hi: 'खोया-पाया', pa: 'ਗੁੰਮ ਤੇ ਲੱਭਿਆ' },
  health: { en: 'Health & medical', hi: 'स्वास्थ्य व चिकित्सा', pa: 'ਸਿਹਤ ਤੇ ਡਾਕਟਰੀ' },
  access: { en: 'Accessibility help', hi: 'सुगम्यता सहायता', pa: 'ਪਹੁੰਚਯੋਗਤਾ ਮਦਦ' },
  donate: { en: 'Donate & seva', hi: 'दान व सेवा', pa: 'ਦਾਨ ਤੇ ਸੇਵਾ' },
  community: { en: 'Community reports', hi: 'सामुदायिक रिपोर्ट', pa: 'ਭਾਈਚਾਰਕ ਰਿਪੋਰਟਾਂ' },
  report: { en: 'Report / SOS', hi: 'रिपोर्ट / एसओएस', pa: 'ਰਿਪੋਰਟ / ਐਸਓਐਸ' },
  track: { en: 'Track a report', hi: 'रिपोर्ट ट्रैक करें', pa: 'ਰਿਪੋਰਟ ਟਰੈਕ ਕਰੋ' },
}

export const SNAN = [
  { d: '14 Jan', n: 'Makar Sankranti', amrit: false },
  { d: '29 Jan', n: 'Mauni Amavasya', amrit: false },
  { d: '3 Feb', n: 'Basant Panchami', amrit: false },
  { d: '12 Feb', n: 'Maghi Purnima', amrit: false },
  { d: '26 Feb', n: 'Mahashivratri', amrit: true },
  { d: '14 Mar', n: 'Phalguna Amavasya', amrit: true },
  { d: '29 Mar', n: 'Holi Purnima', amrit: false },
  { d: '9 Apr', n: 'Chaitra Amavasya', amrit: false },
  { d: '14 Apr', n: 'Mesha Sankranti', amrit: true },
  { d: '20 Apr', n: 'Chaitra Purnima', amrit: false },
]

export const STAYS = [
  { id: 's1', name: 'Rain Basera night shelter', kind: 'free', free: 70, total: 200, dist: '450 m', walk: '6 min', by: 'Sevak D. Lal', ago: 10 },
  { id: 's2', name: 'Bharat Dharamshala', kind: 'free', free: 30, total: 150, dist: '800 m', walk: '11 min', by: 'Sevak R. Devi', ago: 22 },
  { id: 's3', name: 'Akhara pilgrim camp', kind: 'free', free: 120, total: 400, dist: '1.2 km', walk: '16 min', by: 'Sevak M. Gupta', ago: 5 },
  { id: 's4', name: 'Govt Tent City — Sector 4', kind: 'paid', free: 119, total: 800, dist: '1.6 km', walk: '21 min', by: 'Sevak A. Rawat', ago: 8, price: 'from ₹1,500' },
  { id: 's5', name: 'Guesthouses, Jwalapur', kind: 'paid', free: 22, total: 60, dist: '3.4 km', walk: '8 min by e-rickshaw', by: 'Sevak K. Negi', ago: 31, price: '₹600–2,200' },
]

export const FOOD = [
  { id: 'f1', name: 'ISKCON Annakshetra', open: 'open', wait: '10 min', served: 8420, menu: ['Khichdi', 'Sabzi', 'Halwa'] },
  { id: 'f2', name: 'Akshaya Patra Mahaprasad', open: 'open', wait: '15 min', served: 12100, menu: ['Dal', 'Rice', 'Roti'] },
  { id: 'f3', name: 'Niranjani Akhara Bhandara', open: 'soon', wait: 'opens 12:30', served: 0, menu: ['Puri', 'Aloo', 'Kheer'] },
  { id: 'f4', name: 'Annapurna Food Court', open: 'open', wait: '25 min', served: 5310, menu: ['Thali', 'Chaas'] },
]

export const LOTS = [
  { id: 'l1', name: 'Bahadrabad Park & Ride', free: 1425, total: 4200, km: 9, shuttle: '5 min' },
  { id: 'l2', name: 'Chandi Dweep Lot', free: 310, total: 1800, km: 5, shuttle: '8 min' },
  { id: 'l3', name: 'Raiwala / Shyampur', free: 2100, total: 3500, km: 14, shuttle: '12 min' },
  { id: 'l4', name: 'Gaurishankar Lot', free: 85, total: 900, km: 3, shuttle: '4 min' },
]

export const ROADS = [
  { n: 'NH-334', s: 'Heavy' }, { n: 'NH-7', s: 'Clear' }, { n: 'NH-74', s: 'Heavy' }, { n: 'Mela corridor', s: 'Moderate' },
]

export const SERVICES = [
  ['Drinking water', '90 m'], ['Toilets', '120 m'], ['First-aid', '250 m'], ['Help desk & police booth', '300 m'],
  ['Mobile charging', '340 m'], ['Cloak room', '410 m'], ['ATM', '520 m'], ['Lost-child point', '180 m'],
]

export const UC = [
  'Ghat finder & routes', 'Crowd advisories', 'Shahi Snan calendar', 'Lost & found', 'SOS & incidents', 'Health & 108',
  'Stay & tent-city', 'Free food map', 'Park & Ride', 'Sanitation reports', 'Command analytics', 'Sahayak helpline', 'Sevak field ops',
]

export const INTEGRATIONS: [string, 'CONNECTED' | 'CONFIG' | 'SANDBOX'][] = [
  ['CCTV crowd analytics', 'CONNECTED'], ['Lost & Found (face-match)', 'CONNECTED'], ['Sevak field app', 'CONNECTED'],
  ['Accommodation & tent-city', 'CONNECTED'], ['IVR / Helpline 1902', 'CONNECTED'], ['Health / 108', 'CONNECTED'],
  ['WhatsApp / SMS', 'CONNECTED'], ['IRCTC eCatering / food', 'CONFIG'], ['PA & digital signage', 'CONFIG'], ['Police / Dial-112', 'SANDBOX'],
]

export const CHAT_QA: Record<string, string> = {
  'Where is my ghat?': 'You are at Har Ki Pauri (Brahmakund), Control Post 1. Crowd is very high right now — Subhash Ghat is calmer (72%). Want a walking route?',
  'When is the next Shahi Snan?': 'The next Shahi Snan is Mahashivratri on 26 Feb — an Amrit Snan day. Expect very high crowds; arrive before 4 AM or pick a non-Amrit day.',
  'My relative is lost': 'I am sorry — stay calm. Go to the nearest Lost-child point (180 m) and I will open a report now. Please share their name, age and where you last saw them.',
  'Nearest toilet / water?': 'Water ATM is 90 m ahead on your left. The nearest toilet block is 120 m — a sevak is cleaning it, expect a short wait.',
}

export const SEED_REPORTS = [
  { id: 'PR-4485', text: 'Surge near Gate 2 steps, please slow the inflow', ago: '4 min', verified: false },
  { id: 'PR-4481', text: 'Water ATM at Chandi lot working again', ago: '12 min', verified: true },
  { id: 'PR-4476', text: 'Toilet block 3 needs cleaning', ago: '21 min', verified: false },
]
