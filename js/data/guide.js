// Chaperone guide. Condensed from the Westminster Woods Chaperone Handbook (Nov 2024).

export const MISSION = 'Above all else, your job is to help make the most excellent community possible. If you\'re doing your darndest to foster peace, connection and empathy, you\'re doing it right.';

export const GOLDEN_RULE = 'Take care of yourself, others and nature.';

export const ROLE = [
  ['Safety first', 'Provide a safe environment for your cabin group and every other student at camp.'],
  ['Be a role model', 'Students will remember you as much as anything else at camp. Model the behavior you want to see.'],
  ['Treat all students equally', 'If your child is in your cabin, staff shouldn\'t be able to tell which one is yours.'],
  ['Maintain a 2:1 ratio', 'Never be alone with a single student (other than your own child). Bring another student or adult along.'],
  ['Phones out of sight', 'Students should never see a phone. Excuse yourself before using yours; photos in front of the group are OK.'],
  ['Be on time', 'Meals on time, rec area by 4:00 pm, meeting room by 7:15 pm.'],
  ['No medication from you', 'Teachers store and give all meds. Never give any medication, even over-the-counter, without a teacher.'],
  ['Use inclusive language', 'Use students\' correct pronouns; avoid gendered stereotypes like "be a man."'],
  ['Check in early', 'Flag challenges early to teachers or WW staff, before they grow.'],
  ['Be positive', 'If you think something is boring, they will too. Participate, ask questions, have fun!'],
];

export const RULES = {
  General: [
    'Stick together: students walk alone only during rec time, and only within rec zones. Cabins are not a rec zone.',
    'No phones or tech for students.',
    'Stay where you\'re expected to be. No creek or trail exploring without WW permission.',
    'No pranks, ever.',
    'Closed-toed shoes from breakfast until the end of the day; long pants recommended.',
    'Leave No Trace: leave sticks, rocks, plants and animals where you found them, and pack out all trash.',
  ],
  Cabin: [
    'Only enter your own cabin, even if invited into another.',
    'In bed and quiet by 9:30 pm; stay in bed until 7:00 am.',
    'No food in cabins (critters!). Use the animal-proof bins in the Dining Hall.',
    'No medications in cabins except Epi-Pens and inhalers.',
    'Stay with your cabin group and use the buddy system.',
  ],
  'Dining Hall': [
    'Wash hands before each meal.',
    'At least one chaperone per table.',
    'Follow the portion size.',
    'Quiet during announcements; talk quietly at tables.',
    'Only two people up at a time per table.',
    'Everyone helps clean up; one "gopher" carries to the clean-up area.',
    'Stay seated until final dismissal.',
  ],
};

export const SERIOUS = ['Hate speech', 'Fighting or violence', 'Bullying', 'Illegal substances', 'Theft or vandalism', 'Weapons', 'Offensive sexual behavior or speech'];

export const BEDTIME = [
  ['Set expectations', 'Huddle up before heading back: PJs, teeth, bathroom, straight into bed.'],
  ['Get everyone ready', 'Until 9:20, focus on follow-through. Ask, confirm, move to the next student.'],
  ['Lights off', 'After 9:20 everyone is in bed. Announce lights out and no talking.'],
  ['Tuck in', 'Go bed to bed: "Glad you\'re in our cabin. Sweet dreams."'],
  ['Tell a story', 'A favorite story or a happy memory helps everyone drift off.'],
  ['Stay present', 'Stay for 5–10 minutes after the story. Gently stop talkers.'],
];

export const NIGHT = [
  ['Bathroom', 'Students may go without waking anyone, but tell them they can wake you if they\'re nervous to walk out alone.'],
  ['Bedwetting', 'Keep it discreet. Swap in a spare sleeping bag from the meeting room, bag the wet one outside the cabin, and tell WW staff at breakfast. They\'ll quietly launder it.'],
  ['Vomit', 'Grab the nearest vomit kit and follow its instructions. Locations are on the campus map.', { 'campus map': '#/directions?v=campus' }],
  ['Need help?', 'The teachers and the WW Evening Coordinator are on call. Use a camp landline or emergency radio (see the campus map).', { 'campus map': '#/directions?v=campus' }],
  ['Homesick at night', 'Try to get them back to bed. If that fails, call the teacher house. A familiar teacher helps, and you get some sleep.'],
];

// "Tools of the Trade" from the handbook.
export const PROACTIVE = [
  ['💬', 'Communicate clearly', 'Use words that already make sense to them: "stay safe," not "manage risk." Reword if needed.'],
  ['➕', 'Speak in the positive', 'Ask for what you want: "walk," not "don\'t run."'],
  ['🪞', 'Model behavior', 'Follow the rules you set. Ham it up: "Oops, I talked over you! Go ahead."'],
  ['🫂', 'Relatedness', 'Bring quiet students in. Help everyone feel heard by their peers.'],
  ['📛', 'Learn names', 'Using names helps students feel seen and valued.'],
  ['💛', 'Emotional needs', 'Open with neutral questions: "Hey, what\'s up?" rather than "What\'s wrong?" Follow through on anything shared.'],
  ['🌟', 'Point out positives', 'Describe the behavior, then name the impact: "I saw you pick up that trash. You\'re keeping it away from animals!"'],
  ['🗓️', 'Share the schedule', 'Not knowing what\'s next causes anxiety, especially around meals, bathrooms and sleep.'],
  ['🥪', 'Basic needs', 'Warm enough? Fed? Hydrated? Rain layers? Bathroom?'],
  ['✌️', 'The power of choice', '"Brush your teeth first, or change out of PJs first?"'],
];

export const RESPONSIVE = [
  ['🙅', 'Signal interference', 'A head shake or a simple "cut that out" is often enough.'],
  ['🧭', 'Interpretation', 'Help them understand a rule they misread. Go slowly and clearly.'],
  ['🚶', 'Proximity', 'Move closer. A friendly hand on the shoulder can help, but never when you\'re angry.'],
  ['🍟', 'Diversion', 'Ask a captivating question: "Better fries, In-N-Out or McDonald\'s?"'],
  ['😄', 'Humor', 'Humor is contagious and can defuse tension.'],
  ['📣', 'Strong & direct', 'Warm but supervisory. Use direct wording when needed.'],
  ['🆘', 'Still not working?', 'Loop in WW staff or a teacher early and often. No physical punishments, ever.'],
];

export const HOMESICK = {
  do: [
    ['Empathy', 'It\'s normal to miss home. Share your own story with a happy ending.'],
    ['Positive, leading questions', '"What was your favorite activity today?" Then follow up on whatever they love.'],
    ['Redirection', 'Turn attention to what\'s next: "You\'re going to love tomorrow!"'],
  ],
  avoid: [
    ['Too much sympathy', '"You look so sad…" can deepen the spiral.'],
    ['Open-ended questions', '"How are you doing?" invites "Terrible!"'],
    ['Escape routes', 'Don\'t mention calling home or leaving. Teachers and staff decide that.'],
  ],
};

export const TN_TIPS = [
  ['Participate', 'Join in games, lessons and team circles.'],
  ['Teachable moments', 'Let students struggle productively. Step back and let them solve it.'],
  ['Model out loud', '"I picked up your bottle because our group said being kind matters."'],
  ['Layers & shoes', 'Before breakfast and dinner: layers, full water bottle, closed-toed shoes, even on the last day.'],
];

export const OTHER = [
  ['Hiking', 'Less about miles, more about relationships with nature: interview a banana slug! Expect uneven, uphill ground.'],
  ['Camp store', 'In the main office. Chaperones are welcome but be discreet; we downplay it for students.'],
  ['Sustainability', 'Lights and heater off when leaving the cabin. Take only the food you\'ll eat.'],
  ['Tobacco', 'Designated areas only for adults 21+. Never around students.'],
  ['Free time', 'No alcohol, marijuana or other recreational drugs. It\'s a school event.'],
  ['Rainy days', 'Rec time and cabin time combine. Supervise your cabin in the meeting room, the cabin or outside.'],
  ['Competition', 'Shut down school-vs-school or gender-vs-gender contests early; suggest other ways to split teams.'],
];
