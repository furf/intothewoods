// Core trip facts. Sources: Thornhill "Week 12" schedule (Fall 2026),
// "Westminster Woods overnight field trip" slides, and the WW Chaperone Handbook.

export const TRIP = {
  school: 'Thornhill School',
  camp: 'Westminster Woods',
  start: '2026-11-17T08:00',
  end: '2026-11-19T15:00',
  dates: 'Tue Nov 17 – Thu Nov 19, 2026',
  video: 'hNVTTHDv_0k',
};

export const PLACES = {
  camp: {
    name: 'Westminster Woods',
    address: '6510 Bohemian Highway, Occidental, CA 95465',
    phone: '(707) 874-2426',
    tel: '+17078742426',
    web: 'https://www.westminsterwoods.org',
  },
  school: {
    name: 'Thornhill Elementary School',
    address: '5880 Thornhill Dr, Oakland, CA 94611',
  },
};

const enc = encodeURIComponent;
const from = `${PLACES.school.name}, ${PLACES.school.address}`;
const to = `${PLACES.camp.name}, ${PLACES.camp.address}`;
export const MAPS = {
  google: `https://www.google.com/maps/dir/?api=1&origin=${enc(from)}&destination=${enc(to)}&travelmode=driving`,
  googleHere: `https://www.google.com/maps/dir/?api=1&destination=${enc(to)}&travelmode=driving`,
  apple: `https://maps.apple.com/?saddr=${enc(PLACES.school.address)}&daddr=${enc(PLACES.camp.address)}&dirflg=d`,
  waze: `https://waze.com/ul?q=${enc(PLACES.camp.address)}&navigate=yes`,
  embed: `https://www.google.com/maps?saddr=${enc(PLACES.school.address)}&daddr=${enc(PLACES.camp.address)}&output=embed`,
  // Getting home: the same set, reversed (camp → Thornhill).
  back: {
    google: `https://www.google.com/maps/dir/?api=1&origin=${enc(to)}&destination=${enc(from)}&travelmode=driving`,
    googleHere: `https://www.google.com/maps/dir/?api=1&destination=${enc(from)}&travelmode=driving`,
    apple: `https://maps.apple.com/?saddr=${enc(PLACES.camp.address)}&daddr=${enc(PLACES.school.address)}&dirflg=d`,
    waze: `https://waze.com/ul?q=${enc(PLACES.school.address)}&navigate=yes`,
    embed: `https://www.google.com/maps?saddr=${enc(PLACES.camp.address)}&daddr=${enc(PLACES.school.address)}&output=embed`,
  },
};

const DOC = {
  itinerary: 'https://drive.google.com/file/d/1wyYW0prPxbsaYolV0_zZQMHcNdZmYTpC/view?usp=sharing',
  menu: 'https://docs.google.com/document/d/1F6kLN9EwWtXr--4m7ryxesP6cGObT8iT/edit?usp=sharing',
  dietary: 'https://drive.google.com/file/d/13-Ouqw3JRs9i4Se83sUJVMEHdsJ-hIFa/view?usp=sharing',
  allergens: 'https://drive.google.com/file/d/1QAfWqpTOVpphAm7yT0O9SoyTefpTnJIJ/view?usp=sharing',
  naturalists: 'https://www.westminsterwoods.org/meet-our-teacher-naturalists',
};

// kind: travel | program | meal | routine | chaperone | evening
// who: optional note on who's involved. cal: include in calendar export.
const EVENING = [
  { t: '15:45', title: 'Council of All Schools', kind: 'routine', desc: 'Every school on campus gathers together to close out the program day.' },
  { t: '16:00', title: 'Recreation', kind: 'routine', desc: 'Students choose from the tree house, cargo net, playground, gaga ball, basketball court and scavenger hunt. Chaperones are stationed at a rec area (or roam as a "free agent"). One train whistle = rec is over: walk students to their cabin post on the Big Green Field.', chap: 'Be at your rec area by 4:00. You may need to leave your trail group a few minutes early.' },
  { t: '16:45', title: 'Cabin Time', kind: 'routine', desc: 'Back to cabins to regroup before dinner. Make sure everyone has layers and water for the evening program.', chap: 'Bring students to dinner ready for the whole evening.' },
  { t: '17:15', title: 'Dinner', kind: 'meal', where: 'Vernon Dining Hall', desc: 'Hot family-style meal at Thornhill\'s assigned tables.', chap: 'At least one adult per table. Wash hands, follow portion sizes, one "gopher" per table, everyone stays seated until dismissal.' },
  { t: '18:15', title: 'Class Meeting', kind: 'routine', desc: 'Teacher-led hour: journaling, reflecting on the day, reinforcing science concepts, class bonding.', chap: 'Chaperone time off! Shower, call home, recharge. Be back at the meeting room by 7:15.' },
  { t: '19:00', title: 'Transition Time', kind: 'routine', desc: 'Gather layers and flashlights and head to the meeting room.' },
];
const BEDTIME = [
  { t: '20:45', title: 'Bed Prep', kind: 'routine', desc: 'Huddle up before heading back: PJs, teeth, bathroom, straight into bed. Evening showers are open until lights out (keep them to ~5 minutes).', chap: 'Focus on getting everyone ready first. Don\'t try to settle some while others are still prepping.' },
  { t: '21:30', title: 'Lights Out', kind: 'routine', desc: 'In bed and quiet. Students stay in bed until 7:00 am, except for the bathroom.', chap: 'Go bed to bed, say goodnight, tell a story, then stay present for 5–10 minutes.' },
];
const MORNING = [
  { t: '07:00', title: 'Wake Up', kind: 'routine', desc: 'No wake-up call, so chaperones bring an alarm. Morning showers are open until breakfast. Do a quick all-together cabin tidy.', chap: 'Students arrive at breakfast dressed for the day with a day pack, a full water bottle, a jacket and layers, and closed-toed shoes.' },
  { t: '08:15', title: 'Breakfast', kind: 'meal', where: 'Vernon Dining Hall', desc: 'After breakfast there\'s often recess on the playground with all visiting schools.', chap: 'Supervise the Gaga Pit and playground. No basketball or cargo net during recess. Escort anyone who needs to grab something from a cabin.' },
  { t: '08:50', approx: true, title: 'Chaperone Check-in', kind: 'chaperone', desc: 'A brief daily meeting to hear about the day\'s activities and ask for support with your cabin group.', chap: 'Time is approximate; staff will confirm on site.' },
];

export const SCHEDULE = [
  {
    date: '2026-11-17', day: 'Tuesday', short: 'Tue', label: 'Day 1 · Arrive',
    items: [
      { t: '08:00', title: 'Meet at Thornhill', kind: 'travel', where: 'Thornhill School', desc: 'Students bring a fully disposable sack lunch, plus luggage they can carry to the cabin themselves.', cal: true },
      { t: '08:30', title: 'Depart for camp', kind: 'travel', desc: 'We drive up in parent vehicles.', cal: true },
      { t: '10:15', title: 'Arrive at Westminster Woods', kind: 'travel', desc: '15–20 minutes to use the restroom and play in the rec areas.', chap: 'Supervise the rec areas while students stretch their legs.', cal: true },
      { t: '10:35', approx: true, title: 'Welcome', kind: 'program', end: '12:30', desc: 'The Welcome Assembly (~45 min): Teacher Naturalists make introductions, walk through the flow of the day and go over camp rules. Then move-in: students settle into their assigned cabins.', chap: 'Help your cabin move in. Teachers meet staff about medical, emotional and behavioral needs.', cal: true },
      { t: '12:30', title: 'Sack Lunch', kind: 'meal', desc: 'Everyone eats the lunch they brought. Staff talk about composting and conservation.' },
      { t: '13:30', title: 'Community Exploration', kind: 'program', end: '15:45', desc: 'Students meet their trail groups for a first adventure, building a sense of place in the forest and community within the group.', chap: 'Chaperone Meeting happens now: chaperones and teachers meet the Daytime Coordinator to cover safety, expectations and tools for success.', cal: true },
      ...EVENING,
      { t: '19:15', title: 'Campfire', kind: 'evening', end: '20:45', with: 'Bearheart', desc: 'Evening program in the redwood amphitheater: songs, skits and reflection.', chap: 'Be at the meeting room by 7:15 so the program can start on time.', cal: true },
      ...BEDTIME,
    ],
  },
  {
    date: '2026-11-18', day: 'Wednesday', short: 'Wed', label: 'Day 2 · Full day',
    items: [
      ...MORNING,
      { t: '09:20', title: 'Team Challenges', kind: 'program', end: '12:30', desc: 'Trail groups work through cooperative challenges that build communication, trust and problem solving.', chap: 'Step back and let students find the solutions. Teachable moments beat quick answers.', cal: true },
      { t: '12:30', title: 'Lunch', kind: 'meal' },
      { t: '13:30', title: 'High Ropes Challenges', kind: 'program', end: '15:45', desc: 'Up in the trees at the Challenge Course Canyon, with "challenge by choice": every student decides how far to push themselves, and the group cheers them on.', chap: 'Encourage without pressuring. Celebrate effort, not height.', cal: true },
      ...EVENING,
      { t: '19:15', title: 'Mix & Mingle', kind: 'evening', end: '20:45', desc: 'Evening program run by Teacher Naturalists. Could include night ecology, night-sky observation and nocturnal-animal adaptations.', chap: 'Be at the meeting room by 7:15.', cal: true },
      ...BEDTIME,
    ],
  },
  {
    date: '2026-11-19', day: 'Thursday', short: 'Thu', label: 'Day 3 · Head home',
    items: [
      { ...MORNING[0], desc: 'Last morning! Pack up bags, check under bunks for stray socks, and tidy the cabin.' },
      MORNING[1], MORNING[2],
      { t: '09:20', title: 'Be the Change', kind: 'program', end: '12:30', desc: 'The final program: students reflect on what they discovered and how they\'ll bring it home to their school, community and planet.', cal: true },
      { t: '12:30', approx: true, title: 'Lunch & Depart', kind: 'travel', desc: 'Load the cars and head home.', chap: 'Dress students for the outdoors even on the last day: closed-toed shoes and layers.', cal: true },
      { t: '15:00', approx: true, title: 'Arrive back at Thornhill', kind: 'travel', desc: 'Pick-up at school around 3:00 pm.', cal: true },
    ],
  },
];

export const EXPERIENCE = [
  { title: 'Forest Ecology', text: 'Redwood forest anatomy, food chains and local biodiversity.' },
  { title: 'Watershed & Stream Ecology', text: 'Aquatic habitats, water chemistry, macro-invertebrates and Coho salmon habitat in Dutch Bill Creek.' },
  { title: 'Night Ecology & Biomimicry', text: 'Nocturnal adaptations, night-sky observation and how engineering mimics nature.' },
  { title: 'Social-Emotional Learning', text: 'Cabin life and group activities build cooperation, empathy and independence ahead of middle school.' },
  { title: 'Campfires & Community', text: 'Redwood amphitheater programs with songs, skits and reflection circles.' },
];

// Trip at a glance: the one place for logistics.
export const QUICK = [
  ['Meet', '8:00 am Tuesday at Thornhill; depart ~8:30'],
  ['Ride', 'Parent vehicles (carpool)'],
  ['Return', '~3:00 pm Thursday at Thornhill'],
  ['Screens', 'Screen-free campus: no phones or electronics for students'],
];
export const STAY = [
  'Single-gender cabins with only Thornhill students and two parent chaperones. Cabins have 8–10 beds.',
  'Each cabin area has its own bath house with separate shower stalls, toilets and sinks.',
  'Day (trail) groups: one Teacher Naturalist plus 2–3 parent chaperones.',
  'Students listed up to three peers for cabin and day groups; each is guaranteed at least one.',
  'Meals are served in Vernon Dining Hall at Thornhill\'s own tables.',
  'Unfortunately there is no gender-neutral cabin option.',
];

// Questions families ask, each with its supporting documents.
export const FAQ = [
  { q: 'Food & allergies', a: 'Camp serves hot meals starting with Tuesday dinner. If your child has dietary needs, read the dietary letter and allergen grid and tell the teachers before the trip.',
    links: [['Sample menu', DOC.menu], ['Dietary letter', DOC.dietary], ['Allergen grid', DOC.allergens]] },
  { q: 'Medication', a: 'Pack it, then hand it to the teachers at drop-off. They store and give all medication. Only emergency meds (Epi-Pens, inhalers) stay with students.' },
  { q: 'Can I call my child?', a: 'Students are screen-free, and calls home tend to make homesickness worse. Teachers and staff will reach out if anything comes up.' },
  { q: 'Cell service & this app', a: 'Service is spotty in the redwoods. This app saves itself for offline use the first time you open it, so open it once on Wi-Fi before you leave.' },
  { q: 'Who leads the program?', a: 'Westminster Woods Teacher Naturalists lead each trail group and evening program; Mr. Wilkins and Ms. Gustafson float between groups.',
    links: [['Meet the Teacher Naturalists', DOC.naturalists], ['Thornhill\'s itinerary (PDF)', DOC.itinerary]] },
];