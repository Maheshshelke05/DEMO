// ─────────────────────────────────────────────────────────────────────────────
//  EDIT THIS FILE to change any words on the site. Nothing else needs touching.
//  Photos come from the photos/ folder by themselves. `photo: 'camera-03'` only
//  names the spot a caption belongs to; the spots are listed in scripts/slots.mjs.
// ─────────────────────────────────────────────────────────────────────────────

// Start here: what you call her, and how you sign the last page.
const her = 'pretty girl'
const me = 'your favourite person'

export const opening = {
  invite: 'psst… this tiny bear has something to tell you',
  prompt: `Heyyy ${her}! Are you ready for something special? 💗`,
  button: "I'm ready 💗",
  skip: 'skip to the scrapbook',
  hint: '(or just tap the bear)',
}

export const questions = [
  {
    text: 'Do you want to see a little surprise?',
    yes: 'YES 💗',
    no: 'NO 🙈',
    noReplies: [
      "Hmm? That doesn't look like the right button 🙈",
      "You sure? It's really tiny and really cute 🥺",
      "Okay okay, no rush. I'll wait right here 💗",
      '(the YES button is getting a bit lonely btw)',
      'Still here. Still waiting. Still cute 🧸',
    ],
    yesReply: 'Yayyy! 💗',
  },
  {
    text: 'Are you really ready for it, cutie?',
    yes: 'YES 🎀',
    no: 'NO 🥺',
    noReplies: [
      'Take your time. I made it for you, it can wait 🥺',
      'Should I bring you a snack while you decide? 🍓',
      'That pout is working on me, but still… press YES 🎀',
      'I can do this all day. I really can 🧸',
    ],
    yesReply: "That's my girl 🎀",
  },
]

export const gift = {
  ask: 'Should I open your little surprise? 🎁',
  yes: 'YES 🎁',
  no: 'NO 🙈',
  stages: [
    { text: 'Waittt! Are you really sure, princess? 🥹', yes: 'Yes, sure! 🥹', no: 'Hmm, wait 🙈' },
    { text: `One more timeee, ${her}! 💗`, yes: 'YESSS 💗', no: 'Tease me more 🙈' },
    { text: 'Okayyy! Your surprise is waiting for you! 🎀', yes: 'Open it! 🎀' },
  ],
  noReplies: [
    "Okayyy, I'll keep holding it for you 🥺",
    'It is very heavy. Full of love. My arms hurt 🥲',
    'Spin it around with your finger while you decide 🎁',
  ],
  dragHint: 'psst, you can spin it',
}

export const cover = {
  kicker: 'a little scrapbook',
  title: ['Happy Birthday,', her],
  sub: 'volume one, made by hand, for you only',
  scrollHint: 'scroll to open',
  photo: 'cover',
  photoCaption: 'my favourite girl',
  inside: 'This book belongs to',
  insideName: 'my favourite girl',
  insidePhoto: 'cover-inside',
  insideCaption: 'page one: you',
}

// The three romantic notes between pages.
export const messages = {
  first: 'Some memories deserve their own little corner. 💗',
  second: 'Every picture has a story, and every story reminds me of you.',
  third: "You're my favourite notification, my favourite person and my favourite everything.",
}

export const camera = {
  title: 'Say cheese, princess',
  hint: 'press the pink shutter 📸',
  brand: 'Cutie-cam',
  tagline: '12.0 MEGA KISSES',
  menuReply: 'Menu: kisses, hugs, more kisses 💌',
  heartReply: 'Sending hearts… 💗',
  // Each shutter press prints the next one of these as a Polaroid.
  roll: [
    { photo: 'camera-01', caption: 'that smile', note: 'Okay this one is illegal 💗' },
    { photo: 'camera-02', caption: 'all sparkly', note: 'How are you even real? ✨' },
    { photo: 'camera-03', caption: 'lazy days', note: 'My favourite view, every single time 🥰' },
    { photo: 'camera-04', caption: 'serving looks', note: 'Excuse me, miss, you dropped my heart 🫠' },
    { photo: 'camera-05', caption: 'hii cutie', note: 'I would like this one framed, please 🖼️' },
    { photo: 'camera-06', caption: 'hello you', note: 'No thoughts, just you 🥹' },
    { photo: 'camera-07', caption: 'too cool for me', note: 'And yet, somehow, mine 😎' },
    { photo: 'camera-08', caption: 'wow. just wow', note: 'I forgot what I was going to say 😳' },
    { photo: 'camera-09', caption: 'that look', note: 'That look should come with a warning 😉' },
    { photo: 'camera-10', caption: 'date night', note: 'Best view in the whole place 💗' },
    { photo: 'camera-11', caption: 'cutie alert', note: 'Every single time, I am gone 🙈' },
    { photo: 'camera-12', caption: 'golden', note: 'Even the sun wants a closer look 🌤️' },
    { photo: 'camera-13', caption: 'adorable', note: 'Cutest human on the internet 🐾' },
    { photo: 'camera-14', caption: 'soft', note: 'Softest face in the whole world 🌸' },
    { photo: 'camera-15', caption: 'butterflies', note: 'This is exactly what you do to my stomach 🦋' },
    { photo: 'camera-16', caption: 'mwah', note: 'One for me, please 💋' },
    { photo: 'camera-17', caption: 'all mine', note: 'Even my camera has a crush on you 📷' },
    { photo: 'camera-18', caption: 'my person', note: 'Out of everyone in the world, I get you 🥹' },
  ],
  // Pinned around the camera before any shutter press
  around: [
    { photo: 'camera-01', caption: 'hi you' },
    { photo: 'camera-18', caption: 'my person' },
    { photo: 'camera-17', caption: 'all mine' },
    { photo: 'camera-10', caption: 'date night' },
    { photo: 'camera-05', caption: 'hii cutie' },
    { photo: 'camera-02', caption: 'all sparkly' },
  ],
  finished: 'That was the whole roll. You can keep shooting, I never get tired of these 💗',
}

export const diary = {
  word: ['HAPPY', 'BIRTHDAY'],
  note: {
    title: 'Dear birthday girl,',
    body: 'Today the whole world gets a bit prettier, because it is the day you showed up in it. Eat too much cake. Take too many pictures. Let me spoil you.',
  },
  hero: { photo: 'diary-hero', caption: 'make a wish' },
  strip: ['diary-strip-1', 'diary-strip-2', 'diary-strip-3'],
  mono: { photo: 'diary-mono', caption: 'my favourite day' },
  voice: { label: 'a little tune for you', hint: 'tap to play' },
}

export const ring = {
  title: 'Pretty in pink',
  sub: 'keep scrolling, spin the whole thing',
  photos: [
    { photo: 'ring-01', caption: 'that dress' },
    { photo: 'ring-02', caption: 'pretty, pretty' },
    { photo: 'ring-03', caption: 'my flower' },
    { photo: 'ring-04', caption: 'look at you' },
    { photo: 'ring-05', caption: 'shy one' },
    { photo: 'ring-06', caption: 'that smile again' },
    { photo: 'ring-07', caption: 'iconic' },
    { photo: 'ring-08', caption: 'sunny day' },
    { photo: 'ring-09', caption: 'in bloom' },
    { photo: 'ring-10', caption: 'mine' },
  ],
}

export const tunnel = {
  intro: "Come on, let's walk through it",
  outro: 'still walking… still you',
  photos: [
    'tunnel-01', 'tunnel-02', 'tunnel-03', 'tunnel-04', 'tunnel-05', 'tunnel-06', 'tunnel-07',
    'tunnel-08', 'tunnel-09', 'tunnel-10', 'tunnel-11', 'tunnel-12', 'tunnel-13', 'tunnel-14',
  ],
}

export const cherry = {
  label: 'the cherry on top of everything',
  photos: {
    top: { photo: 'cherry-1', caption: 'in full bloom' },
    right: { photo: 'cherry-2', caption: 'my favourite view' },
    left: { photo: 'cherry-3', caption: 'every colour is your colour' },
    middle: { photo: 'cherry-4', caption: 'you light up everything' },
    big: { photo: 'cherry-5', caption: 'stunning, as usual' },
    bottomLeft: { photo: 'cherry-6', caption: 'heart eyes' },
    bottomRight: { photo: 'cherry-7', caption: 'I will always find you' },
  },
  note: 'A hundred pages of just you, and I would still want more.',
}

export const journal = {
  label: 'dear diary,',
  turnHint: 'keep scrolling to turn the page',
  pages: [
    { photo: 'journal-1', text: 'I could look at this one all day. Actually, I have.' },
    { photo: 'journal-2', text: 'You, looking at the camera. Me, looking at you.' },
    { photo: 'journal-3', text: 'Black & white, and still the most colourful thing in my life.' },
    { photo: 'journal-4', text: 'No filter could ever do you justice. I checked.' },
    { photo: 'journal-5', text: 'My whole heart, in one little picture.' },
  ],
  loose: [
    { photo: 'journal-6', caption: 'the cutest thing I have ever seen, and I have seen puppies.' },
    { photo: 'journal-7', caption: 'like a scene from an old film' },
    { photo: 'journal-8', caption: 'every page of this book is about you' },
  ],
}

export const blue = {
  label: 'my favourite shade of you',
  note: 'They say the sky is pretty. They have clearly never seen you smile.',
  photos: {
    card1: { photo: 'blue-1', caption: 'on top of the world' },
    card2: { photo: 'blue-2', caption: 'that look' },
    card3: { photo: 'blue-3', caption: 'cool girl' },
    card4: { photo: 'blue-4', caption: 'sit pretty' },
    small1: { photo: 'blue-5', caption: 'lovely' },
    small2: { photo: 'blue-6', caption: 'peekaboo' },
    small3: { photo: 'blue-7', caption: 'effortless' },
    small4: { photo: 'blue-8', caption: 'out and about' },
  },
}

export const sunshine = {
  label: 'you are my sunshine',
  note: 'on the rainy days, and on all of the other days too',
  lines: [
    [
      { photo: 'sunshine-1', caption: 'golden girl' },
      { photo: 'sunshine-2', caption: 'bloom' },
    ],
    [
      { photo: 'sunshine-3', caption: 'carefree' },
      { photo: 'sunshine-4', caption: 'happy girl' },
    ],
  ],
  hero: { photo: 'sunshine-5', caption: 'she smiled, and the whole garden gave up' },
  sunset: { photo: 'sunshine-6', caption: 'golden hour, and you' },
}

export const finale = {
  heartLine: 'and now, the last page',
  heartHint: 'keep going…',
  photo: 'finale',
  photoCaption: 'my whole heart',
  side: 'finale-side',
  sideCaption: 'and every day after',
  heading: 'Happy Birthday, my love',
  letter: [
    'To my favourite person,',
    'I made you this little book because a normal birthday message did not feel like enough.',
    'You make ordinary days feel special. You make me laugh when I am trying very hard to stay annoyed. And you somehow look like this without even trying, which, honestly, is unfair to everyone else.',
    'I hope this year gives you everything you keep quietly wishing for. And until it does, I will be right here: annoying you, loving you, and taking far too many pictures of you.',
    'Thank you for being mine.',
  ],
  closing: 'Forever yours,',
  // The very last line on the page, written by hand with a tiny beating heart.
  signature: `Made with love by ${me}`,
  signatureHeart: '💗',
}
