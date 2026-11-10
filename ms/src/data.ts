export type Lang = 'en' | 'hi' | 'pa' | 'mr'
export type L5 = Partial<Record<Lang, string>>

export interface Voter { epic: string; nm: string; nmLoc: string; age: number; g: 'M' | 'F'; part: string; serial: string; bid: string }
export interface Booth { id: string; nm: string; addr: string; evms: number; q: number; turn: number; grv: number; blo: string; ph: string; fac: string[] }
export interface Case { s: string; st: string }
export interface Cand { nm: string; nmLoc: string; party: string; sym: string; col: string; age: number; prof: string; edu: string; mov: number; immov: number; liab: number; cases: Case[] }
export interface AC { name: string; nameLoc: string; no: string; district: string; pollDate: string; ro: string; totalVoters: number; totalBooths: number; voters: Voter[]; booths: Booth[]; cands: Cand[] }
export interface StateCfg {
  name: string; nameLoc: string; ceo: string; helpline: string; accent: string; accentSoft: string; langs: Lang[]; electors: string; booths: string
  turnout: number[]; wait: number[]; scans: [string, number][]; lang: [string, number][]; acs: Record<string, AC>
}

const mkBooth = (id: string, nm: string, addr: string, evms: number, q: number, turn: number, grv: number, blo: string, ph: string): Booth =>
  ({ id, nm, addr, evms, q, turn, grv, blo, ph, fac: ['Ramp', 'Wheelchair', 'Drinking water', 'Help desk', 'Shade'] })
const mkCand = (nm: string, nmLoc: string, party: string, sym: string, col: string, age: number, prof: string, edu: string, mov: number, immov: number, liab: number, cases: Case[]): Cand =>
  ({ nm, nmLoc, party, sym, col, age, prof, edu, mov, immov, liab, cases })
const V = (epic: string, nm: string, nmLoc: string, age: number, g: 'M' | 'F', part: string, serial: string, bid: string): Voter => ({ epic, nm, nmLoc, age, g, part, serial, bid })

export const CONFIG: Record<string, StateCfg> = {
  up: {
    name: 'Uttar Pradesh', nameLoc: 'उत्तर प्रदेश', ceo: 'CEO, Uttar Pradesh', helpline: '1950', accent: '#ff8a3d', accentSoft: '#fdecdf', langs: ['en', 'hi'], electors: '15.3 cr', booths: '1,62,000',
    turnout: [2, 10, 21, 33, 46, 54, 60, 66, 73, 81, 89, 95], wait: [4, 9, 16, 24, 30, 20, 15, 17, 22, 18, 12, 6],
    scans: [['Booth finder', 88], ['Queue', 64], ['Enrol/EPIC', 41], ['Candidate', 33], ['Access', 18], ['cVIGIL', 12], ['Helpline', 27]],
    lang: [['Hindi', 75], ['English', 16], ['Other', 9]],
    acs: {
      lucknow: { name: 'Lucknow', nameLoc: 'लखनऊ', no: '173', district: 'Lucknow', pollDate: 'Phase 4 · 7 May', ro: 'Smt. R. Agarwal (RO)', totalVoters: 384210, totalBooths: 318,
        voters: [V('UPX1234567', 'Kavita Verma', 'कविता वर्मा', 41, 'F', '112', '418', 'PS-02'), V('UPX2233445', 'Imran Ali', 'इमरान अली', 33, 'M', '112', '77', 'PS-02'), V('UPX7788990', 'Rohit Srivastava', 'रोहित श्रीवास्तव', 28, 'M', '087', '204', 'PS-07'), V('UPX5566778', 'Sunita Yadav', 'सुनीता यादव', 57, 'F', '045', '511', 'PS-01')],
        booths: [mkBooth('PS-01', 'Govt. Girls Inter College, Aminabad', 'Aminabad Rd, Lucknow', 3, 34, 38, 4, 'Ram Prakash', '98xxxx2201'), mkBooth('PS-02', 'Govt. Jubilee Inter College', 'Hazratganj, Lucknow', 4, 12, 61, 1, 'S. Qureshi', '98xxxx2202'), mkBooth('PS-07', 'City Montessori School', 'Alambagh, Lucknow', 3, 29, 44, 2, 'Anju Rani', '98xxxx2207'), mkBooth('PS-03', 'Kendriya Vidyalaya', 'Gomtinagar, Lucknow', 4, 6, 66, 0, 'D. K. Singh', '98xxxx2203')],
        cands: [mkCand('Anil Shukla', 'अनिल शुक्ला', 'Party A', '●', '#e8601c', 54, 'Social worker', 'Graduate (LLB)', 2.1, 4.0, 0.6, [{ s: 'IPC 171E (bribery)', st: 'Pending trial' }]), mkCand('Rekha Yadav', 'रेखा यादव', 'Party B', '▲', '#1f8a4c', 47, 'Businessperson', 'Post-graduate (MBA)', 1.3, 2.1, 0.3, []), mkCand('Salim Khan', 'सलीम ख़ान', 'Party C', '■', '#1c4e9d', 39, 'Advocate', '12th pass', 0.4, 0.44, 0.9, [{ s: 'IPC 147 (rioting)', st: 'Acquitted' }, { s: 'IPC 353', st: 'Pending' }])] },
      varanasi: { name: 'Varanasi', nameLoc: 'वाराणसी', no: '387', district: 'Varanasi', pollDate: 'Phase 7 · 1 Jun', ro: 'Sri M. Pandey (RO)', totalVoters: 356900, totalBooths: 291,
        voters: [V('UPV7654321', 'Mohan Tripathi', 'मोहन त्रिपाठी', 60, 'M', '088', '207', 'PS-04'), V('UPV3344556', 'Fatima Begum', 'फ़ातिमा बेगम', 36, 'F', '088', '130', 'PS-04'), V('UPV9900112', 'Alok Gupta', 'आलोक गुप्ता', 44, 'M', '061', '318', 'PS-09')],
        booths: [mkBooth('PS-04', 'Sampurnanand Sanskrit Vidyalaya', 'Bhelupur, Varanasi', 4, 22, 52, 2, 'K. N. Rai', '98xxxx3804'), mkBooth('PS-09', 'Udai Pratap College', 'Bhojubeer, Varanasi', 3, 31, 47, 3, 'Shabnam J.', '98xxxx3809'), mkBooth('PS-02', 'Central Hindu School', 'Kamachha, Varanasi', 4, 9, 58, 0, 'R. Verma', '98xxxx3802')],
        cands: [mkCand('Dinesh Mishra', 'दिनेश मिश्रा', 'Party A', '●', '#e8601c', 58, 'Teacher', 'Doctorate (PhD)', 3.0, 6.1, 0.4, []), mkCand('Pooja Singh', 'पूजा सिंह', 'Party B', '▲', '#1f8a4c', 49, 'Businessperson', 'Graduate', 1.1, 1.5, 0.7, [{ s: 'IPC 188', st: 'Pending' }])] },
    },
  },
  uk: {
    name: 'Uttarakhand', nameLoc: 'उत्तराखंड', ceo: 'CEO, Uttarakhand', helpline: '1950', accent: '#34d399', accentSoft: '#e3f3e9', langs: ['en', 'hi'], electors: '83.4 L', booths: '11,729',
    turnout: [3, 12, 24, 37, 49, 57, 63, 69, 75, 82, 88, 93], wait: [3, 7, 13, 19, 24, 16, 12, 14, 18, 15, 10, 5],
    scans: [['Booth finder', 62], ['Queue', 38], ['Enrol/EPIC', 29], ['Candidate', 21], ['Access', 24], ['cVIGIL', 7], ['Helpline', 19]],
    lang: [['Hindi', 84], ['English', 12], ['Other', 4]],
    acs: {
      dehradun: { name: 'Dehradun Cantt', nameLoc: 'देहरादून कैंट', no: '22', district: 'Dehradun', pollDate: 'Single phase · 19 Apr', ro: 'Sri A. Rawat (RO)', totalVoters: 168400, totalBooths: 188,
        voters: [V('UKD2468101', 'Anita Rawat', 'अनीता रावत', 45, 'F', '054', '132', 'PS-01'), V('UKD1122334', 'Vikram Thapa', 'विक्रम थापा', 31, 'M', '054', '88', 'PS-01'), V('UKD5577991', 'Deepa Negi', 'दीपा नेगी', 52, 'F', '032', '245', 'PS-05')],
        booths: [mkBooth('PS-01', 'DAV Inter College', 'Karanpur, Dehradun', 3, 13, 57, 1, 'S. Bhatt', '98xxxx1101'), mkBooth('PS-05', 'Doon Public School', 'Clement Town, Dehradun', 3, 27, 49, 2, 'M. Rana', '98xxxx1105'), mkBooth('PS-03', 'St. Joseph Academy', 'Rajpur Rd, Dehradun', 4, 8, 61, 0, 'P. Negi', '98xxxx1103')],
        cands: [mkCand('Vijay Negi', 'विजय नेगी', 'Party A', '●', '#1f7a4d', 50, 'Ex-serviceman', 'Graduate', 1.8, 2.8, 0.4, []), mkCand('Harish Bisht', 'हरीश बिष्ट', 'Party B', '▲', '#e8601c', 43, 'Businessperson', 'Post-graduate', 0.9, 1.5, 0.6, [{ s: 'IPC 279', st: 'Pending' }])] },
      haridwar: { name: 'Haridwar', nameLoc: 'हरिद्वार', no: '26', district: 'Haridwar', pollDate: 'Single phase · 19 Apr', ro: 'Smt. P. Joshi (RO)', totalVoters: 191200, totalBooths: 214,
        voters: [V('UKH1357924', 'Suresh Kumar', 'सुरेश कुमार', 48, 'M', '071', '309', 'PS-02'), V('UKH6677889', 'Geeta Sharma', 'गीता शर्मा', 39, 'F', '071', '140', 'PS-02')],
        booths: [mkBooth('PS-02', 'Rishikul Campus', 'Jwalapur, Haridwar', 3, 30, 46, 3, 'H. Lal', '98xxxx2602'), mkBooth('PS-06', 'Gurukul Kangri', 'Kankhal, Haridwar', 4, 11, 55, 0, 'S. Devi', '98xxxx2606')],
        cands: [mkCand('Mahesh Sharma', 'महेश शर्मा', 'Party A', '●', '#1f7a4d', 55, 'Farmer', 'Graduate', 2.2, 3.3, 0.3, []), mkCand('Kiran Chauhan', 'किरण चौहान', 'Party B', '▲', '#e8601c', 41, 'Social worker', '12th pass', 0.5, 0.97, 0.5, [])] },
    },
  },
  pb: {
    name: 'Punjab', nameLoc: 'ਪੰਜਾਬ', ceo: 'CEO, Punjab', helpline: '1950', accent: '#60a5fa', accentSoft: '#e4eefb', langs: ['en', 'pa', 'hi'], electors: '2.14 cr', booths: '24,451',
    turnout: [2, 9, 19, 30, 43, 52, 59, 65, 72, 80, 87, 94], wait: [3, 8, 14, 21, 27, 18, 13, 15, 20, 16, 11, 6],
    scans: [['Booth finder', 74], ['Queue', 52], ['Enrol/EPIC', 36], ['Candidate', 28], ['Access', 15], ['cVIGIL', 10], ['Helpline', 23]],
    lang: [['Punjabi', 68], ['Hindi', 19], ['English', 11], ['Other', 2]],
    acs: {
      ludhiana: { name: 'Ludhiana East', nameLoc: 'ਲੁਧਿਆਣਾ ਪੂਰਬੀ', no: '62', district: 'Ludhiana', pollDate: 'Single phase · 1 Jun', ro: 'Sri G. Singh (RO)', totalVoters: 214700, totalBooths: 233,
        voters: [V('PBL9080706', 'Gurpreet Kaur', 'ਗੁਰਪ੍ਰੀਤ ਕੌਰ', 38, 'F', '047', '221', 'PS-03'), V('PBL4433221', 'Harjit Singh', 'ਹਰਜੀਤ ਸਿੰਘ', 46, 'M', '047', '90', 'PS-03'), V('PBL7766554', 'Simran Jeet', 'ਸਿਮਰਨ ਜੀਤ', 29, 'M', '022', '412', 'PS-08')],
        booths: [mkBooth('PS-03', 'Govt. Senior Sec. School', 'Civil Lines, Ludhiana', 4, 33, 51, 3, 'B. Singh', '98xxxx6203'), mkBooth('PS-06', 'Khalsa College', 'Model Town, Ludhiana', 3, 18, 56, 1, 'J. Kaur', '98xxxx6206'), mkBooth('PS-08', 'DAV Public School', 'Dugri, Ludhiana', 4, 7, 60, 0, 'R. Sharma', '98xxxx6208')],
        cands: [mkCand('Jaspal Singh', 'ਜਸਪਾਲ ਸਿੰਘ', 'Party A', '●', '#1c5fa8', 52, 'Agriculturist', 'Graduate', 3.1, 5.2, 0.5, []), mkCand('Baljeet Kaur', 'ਬਲਜੀਤ ਕੌਰ', 'Party B', '▲', '#e8601c', 44, 'Businessperson', 'Post-graduate', 1.8, 2.9, 0.7, [{ s: 'IPC 171F', st: 'Pending' }]), mkCand('Ramesh Sharma', 'ਰਮੇਸ਼ ਸ਼ਰਮਾ', 'Party C', '■', '#1f8a4c', 48, 'Advocate', 'Graduate (LLB)', 0.7, 1.1, 0.4, [])] },
      amritsar: { name: 'Amritsar North', nameLoc: 'ਅੰਮ੍ਰਿਤਸਰ ਉੱਤਰੀ', no: '18', district: 'Amritsar', pollDate: 'Single phase · 1 Jun', ro: 'Smt. N. Kaur (RO)', totalVoters: 198300, totalBooths: 219,
        voters: [V('PBA5647382', 'Harman Deep', 'ਹਰਮਨ ਦੀਪ', 34, 'M', '033', '158', 'PS-01'), V('PBA8899001', 'Manjit Kaur', 'ਮਨਜੀਤ ਕੌਰ', 50, 'F', '033', '77', 'PS-01')],
        booths: [mkBooth('PS-01', 'Khalsa College Annexe', 'Lawrence Rd, Amritsar', 4, 26, 53, 2, 'T. Singh', '98xxxx1801'), mkBooth('PS-05', 'Govt. College for Women', 'Majitha Rd, Amritsar', 3, 12, 57, 0, 'A. Kaur', '98xxxx1805')],
        cands: [mkCand('Tejinder Gill', 'ਤੇਜਿੰਦਰ ਗਿੱਲ', 'Party A', '●', '#1c5fa8', 49, 'Businessperson', 'Graduate', 2.5, 4.0, 0.5, []), mkCand('Neha Arora', 'ਨੇਹਾ ਅਰੋੜਾ', 'Party B', '▲', '#e8601c', 41, 'Doctor', 'MBBS', 1.2, 2.1, 0.8, [{ s: 'IPC 188', st: 'Acquitted' }, { s: 'IPC 171E', st: 'Pending' }])] },
    },
  },
  mh: {
    name: 'Maharashtra', nameLoc: 'महाराष्ट्र', ceo: 'CEO, Maharashtra', helpline: '1950', accent: '#a78bfa', accentSoft: '#efe6f7', langs: ['en', 'mr', 'hi'], electors: '9.2 cr', booths: '98,114',
    turnout: [3, 11, 22, 34, 47, 55, 61, 67, 74, 82, 89, 96], wait: [4, 9, 15, 22, 28, 19, 14, 16, 21, 17, 11, 6],
    scans: [['Booth finder', 81], ['Queue', 59], ['Enrol/EPIC', 38], ['Candidate', 31], ['Access', 16], ['cVIGIL', 14], ['Helpline', 25]],
    lang: [['Marathi', 66], ['Hindi', 20], ['English', 12], ['Other', 2]],
    acs: {
      nagpur: { name: 'Nagpur South West', nameLoc: 'नागपूर दक्षिण पश्चिम', no: '52', district: 'Nagpur', pollDate: 'Phase 1 · 20 Nov', ro: 'Sri P. Deshmukh (RO)', totalVoters: 402100, totalBooths: 356,
        voters: [V('MHN1029384', 'Snehal Kulkarni', 'स्नेहल कुलकर्णी', 40, 'F', '058', '276', 'PS-04'), V('MHN5647382', 'Rahul Deshpande', 'राहुल देशपांडे', 35, 'M', '058', '112', 'PS-04'), V('MHN9182736', 'Arjun Pawar', 'अर्जुन पवार', 27, 'M', '031', '498', 'PS-10')],
        booths: [mkBooth('PS-04', 'Dharampeth M.P. Deo College', 'Dharampeth, Nagpur', 4, 28, 54, 3, 'V. Joshi', '98xxxx5204'), mkBooth('PS-10', 'Somalwar High School', 'Khamla, Nagpur', 4, 35, 47, 4, 'S. More', '98xxxx5210'), mkBooth('PS-02', 'Hislop College', 'Civil Lines, Nagpur', 3, 10, 60, 0, 'K. Patil', '98xxxx5202')],
        cands: [mkCand('Prakash Deshmukh', 'प्रकाश देशमुख', 'Party A', '●', '#7a3fae', 56, 'Social worker', 'Graduate', 2.8, 5.5, 0.6, []), mkCand('Sunita More', 'सुनीता मोरे', 'Party B', '▲', '#e8601c', 48, 'Businessperson', 'Post-graduate', 1.6, 2.4, 0.4, [{ s: 'IPC 143', st: 'Pending' }]), mkCand('Imtiaz Shaikh', 'इम्तियाझ शेख', 'Party C', '■', '#1f8a4c', 43, 'Advocate', 'Graduate (LLB)', 0.9, 1.1, 0.9, [])] },
      kolhapur: { name: 'Kolhapur North', nameLoc: 'कोल्हापूर उत्तर', no: '277', district: 'Kolhapur', pollDate: 'Phase 1 · 20 Nov', ro: 'Smt. S. Patil (RO)', totalVoters: 298600, totalBooths: 271,
        voters: [V('MHK1827364', 'Vaibhav Patil', 'वैभव पाटील', 37, 'M', '042', '199', 'PS-03'), V('MHK9988776', 'Asmita Jadhav', 'अस्मिता जाधव', 44, 'F', '042', '83', 'PS-03')],
        booths: [mkBooth('PS-03', 'Rajaram College', 'Vikramnagar, Kolhapur', 4, 24, 55, 2, 'D. Sawant', '98xxxx7703'), mkBooth('PS-07', 'New College', 'Shahupuri, Kolhapur', 3, 13, 58, 0, 'M. Kamble', '98xxxx7707')],
        cands: [mkCand('Vikas Jadhav', 'विकास जाधव', 'Party A', '●', '#7a3fae', 51, 'Agriculturist', 'Graduate', 2.3, 3.6, 0.5, []), mkCand('Pooja Sawant', 'पूजा सावंत', 'Party B', '▲', '#e8601c', 39, 'Teacher', 'Post-graduate', 1.0, 1.4, 0.3, [])] },
    },
  },
}

export const LANG_LABEL: Record<Lang, string> = { en: 'EN', hi: 'हिं', pa: 'ਪੰਜਾਬੀ', mr: 'मराठी' }

export const CAL: [string, string, boolean][] = [
  ['Notification issued', 'Nomination window opens', true], ['Last date of nomination', '+7 days', true], ['Scrutiny of nominations', '+8 days', true],
  ['Withdrawal of candidature', '+10 days', true], ['Poll day — your constituency', 'Vote 7:00 AM – 6:00 PM', false], ['Counting & results', '+3 days after poll', false],
]
export const DOCS = ['Voter photo slip', 'Aadhaar card', 'Passport', 'Driving licence', 'PAN card', 'MGNREGA job card', 'Bank/PO passbook with photo', 'Service ID (govt/PSU)', 'Pension document with photo']
export const FIRST: [string, string][] = [['Check you are enrolled', 'Search your name / EPIC under “Check enrolment”.'], ['Find your booth', 'Note the booth, address and timing.'], ['Carry a valid photo ID', 'Voter slip + any one from the accepted list.'], ['Vote & verify VVPAT', 'Press the button; check the paper slip shows your choice.']]
export const DONTS = ['Do carry a valid photo ID', 'Do reach early to avoid the queue', 'Don’t take a phone or camera inside the booth', 'Don’t photograph your vote', 'Voting is free — never pay anyone']
export const GCATS: [string, string][] = [['Cash / gift', '💵'], ['Posters', '📋'], ['Transport', '🚐'], ['Intimidation', '⚠️'], ['Other', '❓']]
export const GSTAT: [string, string][] = [['Reported', 'var(--info)'], ['Verified', 'var(--ok)'], ['Action taken', 'var(--accent)'], ['Closed', 'var(--ink-faint)']]
export const UC: [string, string][] = [['Booth finder', 'Slip QR → exact station, part, timing, BLO, map.'], ['Know Your Candidate', 'Affidavit summaries — assets, cases, education.'], ['Enrolment & e-EPIC', 'Check the roll, apply (Forms 6/7/8), track, download.'], ['Queue & token', 'Live wait, queue token, EVM/VVPAT guide.'], ['Accessibility', 'Saksham requests, Braille/AVIS, home-voting (12D).'], ['cVIGIL reporting', 'Geo-tagged complaint, tracking ID, 100-min clock.'], ['Grievance tracking', 'Live status timeline from report to closure.'], ['Results & turnout', 'Provisional round-wise turnout; counting-day view.'], ['Mitra voice help', 'IVR for feature phones; regional languages.'], ['Multilingual', 'Hindi, Punjabi, Marathi, English & more.']]
export const INTEG: [string, string, string][] = [['ECINET', 'Roll, e-EPIC, candidate affidavits', 'Config'], ['Booth App', 'Gate-side QR verification', 'Connected'], ['cVIGIL', 'Grievance routing & SLA', 'Connected'], ['Saksham', 'Accessibility requests', 'Connected'], ['Voter Helpline 1950', 'IVR fallback', 'Sandbox'], ['SMS / WhatsApp', 'Reminders & notifications', 'Connected']]

/* ---- i18n: tile labels and shell strings (5 languages) ---- */
export const TILES: { id: string; en: string; hi: string; pa: string; mr: string }[] = [
  { id: 'booth', en: 'Find my booth', hi: 'मेरा बूथ', pa: 'ਮੇਰਾ ਬੂਥ', mr: 'माझा बूथ' },
  { id: 'queue', en: 'Queue & how to vote', hi: 'कतार व प्रक्रिया', pa: 'ਕਤਾਰ ਤੇ ਤਰੀਕਾ', mr: 'रांग व प्रक्रिया' },
  { id: 'enroll', en: 'Check enrolment', hi: 'नामांकन जाँचें', pa: 'ਨਾਮਾਂਕਣ ਵੇਖੋ', mr: 'नोंदणी तपासा' },
  { id: 'candidate', en: 'Know your candidate', hi: 'अपना उम्मीदवार', pa: 'ਆਪਣਾ ਉਮੀਦਵਾਰ', mr: 'तुमचा उमेदवार' },
  { id: 'prep', en: 'Before you vote', hi: 'मतदान से पहले', pa: 'ਵੋਟ ਤੋਂ ਪਹਿਲਾਂ', mr: 'मतदानापूर्वी' },
  { id: 'calendar', en: 'Key dates', hi: 'प्रमुख तिथियाँ', pa: 'ਮੁੱਖ ਤਾਰੀਖਾਂ', mr: 'महत्त्वाच्या तारखा' },
  { id: 'access', en: 'Accessibility help', hi: 'सुगम्यता मदद', pa: 'ਪਹੁੰਚ ਮਦਦ', mr: 'सुलभता मदत' },
  { id: 'report', en: 'Report a violation', hi: 'उल्लंघन रिपोर्ट', pa: 'ਉਲੰਘਣਾ ਰਿਪੋਰਟ', mr: 'तक्रार नोंदवा' },
  { id: 'track', en: 'Track a complaint', hi: 'शिकायत ट्रैक', pa: 'ਸ਼ਿਕਾਇਤ ਟਰੈਕ', mr: 'तक्रार ट्रॅक' },
  { id: 'helpline', en: 'Helpline & services', hi: 'हेल्पलाइन व सेवाएँ', pa: 'ਹੈਲਪਲਾਈਨ ਤੇ ਸੇਵਾਵਾਂ', mr: 'हेल्पलाइन व सेवा' },
  { id: 'results', en: 'Results & turnout', hi: 'परिणाम व मतदान', pa: 'ਨਤੀਜੇ ਤੇ ਮਤਦਾਨ', mr: 'निकाल व मतदान' },
  { id: 'register', en: 'Register / correct', hi: 'पंजीकरण / सुधार', pa: 'ਰਜਿਸਟਰ / ਸੋਧ', mr: 'नोंदणी / दुरुस्ती' },
  { id: 'help', en: 'Talk to Mitra', hi: 'मित्र से बात करें', pa: 'ਮਿੱਤਰ ਨਾਲ ਗੱਲ ਕਰੋ', mr: 'मित्रशी बोला' },
]
export const UI: Record<string, Record<Lang, string>> = {
  sub: { en: 'Voter Companion', hi: 'मतदाता साथी', pa: 'ਵੋਟਰ ਸਾਥੀ', mr: 'मतदार सहायक' },
  ask: { en: 'How can we help you vote?', hi: 'मतदान में कैसे मदद करें?', pa: 'ਵੋਟਿੰਗ ਵਿੱਚ ਕਿਵੇਂ ਮਦਦ ਕਰੀਏ?', mr: 'मतदानात कशी मदत करू?' },
  hello: { en: 'Namaste', hi: 'नमस्ते', pa: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', mr: 'नमस्कार' },
  live: { en: 'Live queue', hi: 'लाइव कतार', pa: 'ਲਾਈਵ ਕਤਾਰ', mr: 'थेट रांग' },
  tok: { en: 'Get a queue token', hi: 'कतार टोकन लें', pa: 'ਟੋਕਨ ਲਵੋ', mr: 'रांग टोकन घ्या' },
  tokd: { en: 'Token issued', hi: 'टोकन जारी', pa: 'ਟੋਕਨ ਜਾਰੀ', mr: 'टोकन दिले' },
  how: { en: 'How voting works', hi: 'मतदान कैसे होता है', pa: 'ਵੋਟਿੰਗ ਕਿਵੇਂ', mr: 'मतदान कसे होते' },
  askm: { en: 'Ask Mitra', hi: 'मित्र से पूछें', pa: 'ਮਿੱਤਰ ਤੋਂ ਪੁੱਛੋ', mr: 'मित्रला विचारा' },
}
export const STEPS5: Record<Lang, [string, string][]> = {
  en: [['Verify & ink', 'BLO scans your slip QR on the Booth App; finger inked.'], ['Sign register', 'Signature/thumb on Form 17A.'], ['Press on the EVM', 'Blue button next to your choice — one beep.'], ['Check the VVPAT', 'A slip shows your choice for 7 seconds, then drops in the sealed box.']],
  hi: [['सत्यापन व स्याही', 'BLO आपकी स्लिप QR स्कैन करते हैं।'], ['हस्ताक्षर', 'फॉर्म 17A पर हस्ताक्षर।'], ['EVM दबाएँ', 'पसंद के पास नीला बटन — एक बीप।'], ['VVPAT देखें', '7 सेकंड पर्ची पर पसंद।']],
  pa: [['ਤਸਦੀਕ ਤੇ ਸਿਆਹੀ', 'BLO ਤੁਹਾਡੀ ਪਰਚੀ QR ਸਕੈਨ ਕਰਦਾ ਹੈ।'], ['ਦਸਤਖ਼ਤ', 'ਫਾਰਮ 17A ਤੇ ਦਸਤਖ਼ਤ।'], ['EVM ਦਬਾਓ', 'ਪਸੰਦ ਕੋਲ ਨੀਲਾ ਬਟਨ।'], ['VVPAT', '7 ਸਕਿੰਟ ਪਰਚੀ ਤੇ ਪਸੰਦ।']],
  mr: [['पडताळणी व शाई', 'BLO तुमची स्लिप QR स्कॅन करतात.'], ['सही', 'फॉर्म 17A वर सही.'], ['EVM दाबा', 'पसंतीजवळ निळे बटन — एक बीप.'], ['VVPAT पाहा', '7 सेकंद स्लिपवर पसंती.']],
}
/** Hindi variants for the English/Hindi-only journeys. Anything missing falls back to English, visibly. */
export const HI: Record<string, string> = {
  'Check enrolment status': 'नामांकन स्थिति', 'Check status': 'जाँचें', 'You are enrolled': 'आप नामांकित हैं', 'Download e-EPIC': 'e-EPIC डाउनलोड',
  'Track application': 'आवेदन ट्रैक', 'Form 6 (new voter)': 'फॉर्म 6 (नया)', 'Form 8 (correction)': 'फॉर्म 8 (सुधार)', 'Form 7 (objection)': 'फॉर्म 7 (आपत्ति)',
  'Get my voter slip': 'मेरी मतदाता पर्ची', 'Documents you can carry': 'स्वीकार्य दस्तावेज़', 'First-time voter — 4 steps': 'पहली बार मतदाता — 4 चरण', 'Do’s & don’ts': 'क्या करें / क्या न करें', 'Pledge to vote': 'मतदान संकल्प', 'I pledge to vote': 'मैं मतदान का संकल्प लेता/लेती हूँ',
  'Remind me on poll day': 'मतदान दिवस रिमाइंडर', 'Add to my calendar': 'कैलेंडर में जोड़ें', 'Wheelchair at the booth': 'बूथ पर व्हीलचेयर', 'Volunteer escort': 'स्वयंसेवक सहायक', 'Sign-language help': 'सांकेतिक भाषा', 'Priority entry (senior)': 'प्राथमिकता प्रवेश (वरिष्ठ)', 'Check eligibility': 'पात्रता जाँचें',
  'Select a category': 'श्रेणी चुनें', 'Report anonymously': 'गुमनाम', 'Submit report': 'भेजें', 'Track this report': 'इस रिपोर्ट को ट्रैक करें', 'Track': 'ट्रैक', 'Status': 'स्थिति',
  'Call Voter Helpline 1950': 'वोटर हेल्पलाइन 1950 पर कॉल', 'Download voter slip': 'मतदाता पर्ची डाउनलोड', 'Official voter services': 'आधिकारिक सेवाएँ',
  'Live turnout': 'लाइव मतदान', 'Hourly turnout': 'घंटेवार मतदान', 'Hold to speak': 'बोलने के लिए दबाएँ', 'Type your question…': 'अपना प्रश्न लिखें…',
  'Cash / gift distribution': 'नकद / उपहार', 'Posters without permission': 'बिना अनुमति पोस्टर', 'Paid transport of voters': 'मतदाता परिवहन', 'Intimidation / threats': 'धमकी', 'Other': 'अन्य',
}
