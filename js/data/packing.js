// Packing lists. Student list is from the Westminster Woods School Programs packing list.
export const STUDENT = [
  { id: 'gear', title: 'Gear', icon: 'pack', items: [
    'Reusable water bottle', 'Backpack', 'Sleeping bag', 'Pillow', 'Towel',
    ['Dirty clothes bag', 'Trash bags work well'],
  ] },
  { id: 'clothing', title: 'Clothing', icon: 'shirt', items: [
    '2 pairs of closed-toed shoes', 'Flip-flops for shower', 'Swimsuit for shower', 'Pajamas',
    ['Socks', '1 pair per day'], ['Underwear', '1 per day'], ['Long pants', '2–4'],
    ['Short sleeved shirts', '2–4'], ['Long sleeved shirts', '2–4'], 'Sweatshirt', 'Warm jacket',
    ['Hats', '1 for sun and 1 for cold'], ['Rain gear', 'Rain jacket, waterproof pants, or poncho'],
  ] },
  { id: 'medication', title: 'Medication', icon: 'med', items: [
    ['All necessary medications', 'Including Epi-Pens and inhalers. Hand them to the teachers'],
  ] },
  { id: 'food', title: 'Food', icon: 'food',
    note: 'Westminster Woods provides meals beginning with dinner on the first day. Special dietary needs? See the Dietary Letter.',
    items: [['Sack lunch for the first day', 'Fully disposable: no containers to bring home']] },
  { id: 'toiletries', title: 'Toiletries', icon: 'drop', items: [
    'Sunscreen', 'Toothbrush', 'Toothpaste', 'Deodorant', 'Soap', 'Shampoo', 'Comb or brush', 'Hand sanitizer',
  ] },
  { id: 'extras', title: 'Optional Extras', icon: 'star', optional: true, items: [
    'Book', ['Bug repellent', 'Non-DEET'], 'Binoculars', 'Chapstick', 'Disposable camera', 'Flashlight', 'Gloves', 'Wrist watch',
  ] },
  { id: 'dontbring', title: 'Do Not Bring', icon: 'no', leave: true,
    note: 'Check each one off once you\'ve made sure it stays home.',
    items: [
      'Cell phones', ['Electronics of any kind', 'Tablets, music players, or video games'],
      ['Additional snacks', 'Gum, sodas, or candy'], ['Scented products', 'Perfume, cologne, or body sprays'],
    ] },
];

// Chaperone list: handbook "Adult Packing List" + suggestions for a cabin chaperone.
export const CHAPERONE = [
  { id: 'c-handbook', title: 'From the Handbook', icon: 'book', items: [
    'Reusable coffee mug', ['Alarm clock', 'There\'s no wake-up call. You\'re the alarm!'],
    ['Digital or disposable camera', 'Use instead of your phone around students'],
  ] },
  { id: 'c-sleep', title: 'Sleep & Cabin', icon: 'moon', items: [
    'Sleeping bag', 'Pillow', 'Towel', ['Headlamp or flashlight', 'Red-light mode is cabin-friendly'],
    ['Earplugs', 'Cabins of 8–10 kids…'], ['Spare trash bags', 'Wet gear, laundry, the unexpected'],
  ] },
  { id: 'c-wear', title: 'Clothing', icon: 'shirt', items: [
    ['Closed-toed shoes', 'Required from breakfast until the end of the day'], 'Long pants', 'Warm layers & a warm jacket',
    'Rain jacket', 'Warm hat', 'Pajamas', 'Shower flip-flops',
  ] },
  { id: 'c-kit', title: 'Chaperone Kit', icon: 'kit', items: [
    ['Small daypack', 'Water, layers, snacks for you'], 'Water bottle',
    ['Your own medications', 'Kept with you, never in student reach'], ['Phone + charger / battery pack', 'Use away from students'],
    ['Pen & pocket notebook', 'Names, cabin agreement, notes for teachers'],
    ['A bedtime story or two', 'Your secret weapon at lights out'],
  ] },
];
