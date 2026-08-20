import { BibleBook, BibleVerse } from '../types';

export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament
  { id: 'GEN', name: 'Genesis', tamilName: 'ஆதியாகமம்', testament: 'OT', category: 'Law', totalChapters: 50 },
  { id: 'EXO', name: 'Exodus', tamilName: 'யாத்திராகமம்', testament: 'OT', category: 'Law', totalChapters: 40 },
  { id: 'LEV', name: 'Leviticus', tamilName: 'லேவியராகமம்', testament: 'OT', category: 'Law', totalChapters: 27 },
  { id: 'NUM', name: 'Numbers', tamilName: 'எண்ணாகமம்', testament: 'OT', category: 'Law', totalChapters: 36 },
  { id: 'DEU', name: 'Deuteronomy', tamilName: 'உபாகமம்', testament: 'OT', category: 'Law', totalChapters: 34 },
  { id: 'JOS', name: 'Joshua', tamilName: 'யோசுவா', testament: 'OT', category: 'History', totalChapters: 24 },
  { id: 'JDG', name: 'Judges', tamilName: 'நியாயாதிபதிகள்', testament: 'OT', category: 'History', totalChapters: 21 },
  { id: 'RUT', name: 'Ruth', tamilName: 'ரூத்', testament: 'OT', category: 'History', totalChapters: 4 },
  { id: '1SA', name: '1 Samuel', tamilName: '1 சாமுவேல்', testament: 'OT', category: 'History', totalChapters: 31 },
  { id: '2SA', name: '2 Samuel', tamilName: '2 சாமுவேல்', testament: 'OT', category: 'History', totalChapters: 24 },
  { id: '1KI', name: '1 Kings', tamilName: '1 இராஜாக்கள்', testament: 'OT', category: 'History', totalChapters: 22 },
  { id: '2KI', name: '2 Kings', tamilName: '2 இராஜாக்கள்', testament: 'OT', category: 'History', totalChapters: 25 },
  { id: '1CH', name: '1 Chronicles', tamilName: '1 நாளாகமம்', testament: 'OT', category: 'History', totalChapters: 29 },
  { id: '2CH', name: '2 Chronicles', tamilName: '2 நாளாகமம்', testament: 'OT', category: 'History', totalChapters: 36 },
  { id: 'EZR', name: 'Ezra', tamilName: 'எஸ்றா', testament: 'OT', category: 'History', totalChapters: 10 },
  { id: 'NEH', name: 'Nehemiah', tamilName: 'நெகேமியா', testament: 'OT', category: 'History', totalChapters: 13 },
  { id: 'EST', name: 'Esther', tamilName: 'எஸ்தர்', testament: 'OT', category: 'History', totalChapters: 10 },
  { id: 'JOB', name: 'Job', tamilName: 'யோபு', testament: 'OT', category: 'Poetry & Wisdom', totalChapters: 42 },
  { id: 'PSA', name: 'Psalms', tamilName: 'சங்கீதம்', testament: 'OT', category: 'Poetry & Wisdom', totalChapters: 150 },
  { id: 'PRO', name: 'Proverbs', tamilName: 'நீதிமொழிகள்', testament: 'OT', category: 'Poetry & Wisdom', totalChapters: 31 },
  { id: 'ECC', name: 'Ecclesiastes', tamilName: 'பிரசங்கி', testament: 'OT', category: 'Poetry & Wisdom', totalChapters: 12 },
  { id: 'SNG', name: 'Song of Solomon', tamilName: 'உன்னதப்பாட்டு', testament: 'OT', category: 'Poetry & Wisdom', totalChapters: 8 },
  { id: 'ISA', name: 'Isaiah', tamilName: 'ஏசாயா', testament: 'OT', category: 'Prophets', totalChapters: 66 },
  { id: 'JER', name: 'Jeremiah', tamilName: 'எரேமியா', testament: 'OT', category: 'Prophets', totalChapters: 52 },
  { id: 'LAM', name: 'Lamentations', tamilName: 'புலம்பல்', testament: 'OT', category: 'Prophets', totalChapters: 5 },
  { id: 'EZK', name: 'Ezekiel', tamilName: 'எசேக்கியேல்', testament: 'OT', category: 'Prophets', totalChapters: 48 },
  { id: 'DAN', name: 'Daniel', tamilName: 'தானியேல்', testament: 'OT', category: 'Prophets', totalChapters: 12 },
  { id: 'HOS', name: 'Hosea', tamilName: 'ஓசியா', testament: 'OT', category: 'Prophets', totalChapters: 14 },
  { id: 'JOL', name: 'Joel', tamilName: 'யோவேல்', testament: 'OT', category: 'Prophets', totalChapters: 3 },
  { id: 'AMO', name: 'Amos', tamilName: 'ஆமோஸ்', testament: 'OT', category: 'Prophets', totalChapters: 9 },
  { id: 'OBA', name: 'Obadiah', tamilName: 'ஒபதியா', testament: 'OT', category: 'Prophets', totalChapters: 1 },
  { id: 'JON', name: 'Jonah', tamilName: 'யோனா', testament: 'OT', category: 'Prophets', totalChapters: 4 },
  { id: 'MIC', name: 'Micah', tamilName: 'மீகா', testament: 'OT', category: 'Prophets', totalChapters: 7 },
  { id: 'NAM', name: 'Nahum', tamilName: 'நாகூம்', testament: 'OT', category: 'Prophets', totalChapters: 3 },
  { id: 'HAB', name: 'Habakkuk', tamilName: 'ஆபகூக்', testament: 'OT', category: 'Prophets', totalChapters: 3 },
  { id: 'ZEP', name: 'Zephaniah', tamilName: 'செப்பனியா', testament: 'OT', category: 'Prophets', totalChapters: 3 },
  { id: 'HAG', name: 'Haggai', tamilName: 'ஆகாய்', testament: 'OT', category: 'Prophets', totalChapters: 2 },
  { id: 'ZEC', name: 'Zechariah', tamilName: 'சகரியா', testament: 'OT', category: 'Prophets', totalChapters: 14 },
  { id: 'MAL', name: 'Malachi', tamilName: 'மல்கியா', testament: 'OT', category: 'Prophets', totalChapters: 4 },

  // New Testament
  { id: 'MAT', name: 'Matthew', tamilName: 'மத்தேயு', testament: 'NT', category: 'Gospels', totalChapters: 28 },
  { id: 'MRK', name: 'Mark', tamilName: 'மாற்கு', testament: 'NT', category: 'Gospels', totalChapters: 16 },
  { id: 'LUK', name: 'Luke', tamilName: 'லூக்கா', testament: 'NT', category: 'Gospels', totalChapters: 24 },
  { id: 'JHN', name: 'John', tamilName: 'யோவான்', testament: 'NT', category: 'Gospels', totalChapters: 21 },
  { id: 'ACT', name: 'Acts', tamilName: 'அப்போஸ்தலர்', testament: 'NT', category: 'History', totalChapters: 28 },
  { id: 'ROM', name: 'Romans', tamilName: 'ரோமர்', testament: 'NT', category: 'Epistles', totalChapters: 16 },
  { id: '1CO', name: '1 Corinthians', tamilName: '1 கொரிந்தியர்', testament: 'NT', category: 'Epistles', totalChapters: 16 },
  { id: '2CO', name: '2 Corinthians', tamilName: '2 கொரிந்தியர்', testament: 'NT', category: 'Epistles', totalChapters: 13 },
  { id: 'GAL', name: 'Galatians', tamilName: 'கலாத்தியர்', testament: 'NT', category: 'Epistles', totalChapters: 6 },
  { id: 'EPH', name: 'Ephesians', tamilName: 'எபேசியர்', testament: 'NT', category: 'Epistles', totalChapters: 6 },
  { id: 'PHP', name: 'Philippians', tamilName: 'பிலிப்பியர்', testament: 'NT', category: 'Epistles', totalChapters: 4 },
  { id: 'COL', name: 'Colossians', tamilName: 'கொலோசெயர்', testament: 'NT', category: 'Epistles', totalChapters: 4 },
  { id: '1TH', name: '1 Thessalonians', tamilName: '1 தெசலோனிக்கேயர்', testament: 'NT', category: 'Epistles', totalChapters: 5 },
  { id: '2TH', name: '2 Thessalonians', tamilName: '2 தெசலோனிக்கேயர்', testament: 'NT', category: 'Epistles', totalChapters: 3 },
  { id: '1TI', name: '1 Timothy', tamilName: '1 தீமோத்தேயு', testament: 'NT', category: 'Epistles', totalChapters: 6 },
  { id: '2TI', name: '2 Timothy', tamilName: '2 தீமோத்தேயு', testament: 'NT', category: 'Epistles', totalChapters: 4 },
  { id: 'TIT', name: 'Titus', tamilName: 'தீத்து', testament: 'NT', category: 'Epistles', totalChapters: 3 },
  { id: 'PHM', name: 'Philemon', tamilName: 'பிலேமோன்', testament: 'NT', category: 'Epistles', totalChapters: 1 },
  { id: 'HEB', name: 'Hebrews', tamilName: 'எபிரேயர்', testament: 'NT', category: 'Epistles', totalChapters: 13 },
  { id: 'JAS', name: 'James', tamilName: 'யாக்கோபு', testament: 'NT', category: 'Epistles', totalChapters: 5 },
  { id: '1PE', name: '1 Peter', tamilName: '1 பேதுரு', testament: 'NT', category: 'Epistles', totalChapters: 5 },
  { id: '2PE', name: '2 Peter', tamilName: '2 பேதுரு', testament: 'NT', category: 'Epistles', totalChapters: 3 },
  { id: '1JH', name: '1 John', tamilName: '1 யோவான்', testament: 'NT', category: 'Epistles', totalChapters: 5 },
  { id: '2JH', name: '2 John', tamilName: '2 யோவான்', testament: 'NT', category: 'Epistles', totalChapters: 1 },
  { id: '3JH', name: '3 John', tamilName: '3 யோவான்', testament: 'NT', category: 'Epistles', totalChapters: 1 },
  { id: 'JUD', name: 'Jude', tamilName: 'யூதா', testament: 'NT', category: 'Epistles', totalChapters: 1 },
  { id: 'REV', name: 'Revelation', tamilName: 'வெளிப்படுத்தின விசேஷம்', testament: 'NT', category: 'Prophecy', totalChapters: 22 },
];

export const TOPICAL_COLLECTIONS = [
  {
    id: 'peace',
    title: 'Peace & Anxiety',
    description: 'Scriptures offering calm, reassurance, and divine quietness in times of storm.',
    badge: 'Popular',
    iconName: 'Shield',
    verses: [
      { bookName: 'Philippians', chapter: 4, verseNumber: 6, text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.' },
      { bookName: 'Philippians', chapter: 4, verseNumber: 7, text: 'And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.' },
      { bookName: 'John', chapter: 14, verseNumber: 27, text: 'Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.' },
      { bookName: 'Isaiah', chapter: 26, verseNumber: 3, text: 'You will keep in perfect peace those whose minds are steadfast, because they trust in you.' },
    ],
  },
  {
    id: 'strength',
    title: 'Strength & Courage',
    description: 'Verses to ignite endurance, hope, and steady faith through all battles.',
    badge: 'Uplifting',
    iconName: 'Zap',
    verses: [
      { bookName: 'Isaiah', chapter: 40, verseNumber: 31, text: 'But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.' },
      { bookName: 'Joshua', chapter: 1, verseNumber: 9, text: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.' },
      { bookName: 'Psalm', chapter: 46, verseNumber: 1, text: 'God is our refuge and strength, an ever-present help in trouble.' },
      { bookName: '2 Timothy', chapter: 1, verseNumber: 7, text: 'For God has not given us a spirit of fear, but of power and of love and of a sound mind.' },
    ],
  },
  {
    id: 'praise',
    title: 'Praise & Gratitude',
    description: 'Expressions of thanksgiving, joy, and reverence for God\'s lovingkindness.',
    badge: 'Worship',
    iconName: 'Heart',
    verses: [
      { bookName: 'Psalm', chapter: 100, verseNumber: 1, text: 'Shout for joy to the LORD, all the earth.' },
      { bookName: 'Psalm', chapter: 100, verseNumber: 2, text: 'Worship the LORD with gladness; come before him with joyful songs.' },
      { bookName: 'Psalm', chapter: 103, verseNumber: 1, text: 'Praise the LORD, my soul; all my inmost being, praise his holy name.' },
      { bookName: '1 Thessalonians', chapter: 5, verseNumber: 18, text: 'Give thanks in all circumstances; for this is God\'s will for you in Christ Jesus.' },
    ],
  },
  {
    id: 'love',
    title: 'Love & Forgiveness',
    description: 'Deep revelations of God\'s unconditional grace and our call to love others.',
    badge: 'Grace',
    iconName: 'Sun',
    verses: [
      { bookName: 'John', chapter: 3, verseNumber: 16, text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
      { bookName: '1 Corinthians', chapter: 13, verseNumber: 4, text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.' },
      { bookName: '1 Corinthians', chapter: 13, verseNumber: 13, text: 'And now these three remain: faith, hope and love. But the greatest of these is love.' },
      { bookName: 'Romans', chapter: 8, verseNumber: 38, text: 'For I am convinced that neither death nor life, neither angels nor demons... will be able to separate us from the love of God.' },
    ],
  },
];

export const VERSE_OF_THE_DAY = {
  reference: 'Psalm 23:1-3',
  bookName: 'Psalms',
  chapter: 23,
  verses: [
    { number: 1, text: 'The LORD is my shepherd; I shall not want.' },
    { number: 2, text: 'He makes me to lie down in green pastures; He leads me beside the still waters.' },
    { number: 3, text: 'He restores my soul; He leads me in the paths of righteousness for His name\'s sake.' },
  ],
  devotionalSummary: 'Even when the path feels uncertain, the Shepherd goes before us. Rest in His restorative leadership today.',
};

// Rich curated offline verses for key chapters
export const CURATED_CHAPTERS: Record<string, BibleVerse[]> = {
  'GEN-1': [
    { number: 1, text: 'In the beginning God created the heavens and the earth.' },
    { number: 2, text: 'Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.' },
    { number: 3, text: 'And God said, "Let there be light," and there was light.' },
    { number: 4, text: 'God saw that the light was good, and he separated the light from the darkness.' },
    { number: 5, text: 'God called the light "day," and the darkness he called "night." And there was evening, and there was morning—the first day.' },
    { number: 26, text: 'Then God said, "Let us make mankind in our image, in our likeness, so that they may rule over the fish in the sea and the birds in the sky..."' },
    { number: 27, text: 'So God created mankind in his own image, in the image of God he created them; male and female he created them.' },
    { number: 31, text: 'God saw all that he had made, and it was very good. And there was evening, and there was morning—the sixth day.' },
  ],
  'PSA-23': [
    { number: 1, text: 'The LORD is my shepherd; I shall not want.' },
    { number: 2, text: 'He makes me to lie down in green pastures; He leads me beside the still waters.' },
    { number: 3, text: 'He restores my soul; He leads me in the paths of righteousness for His name\'s sake.' },
    { number: 4, text: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil; for You are with me; Your rod and Your staff, they comfort me.' },
    { number: 5, text: 'You prepare a table before me in the presence of my enemies; You anoint my head with oil; my cup runs over.' },
    { number: 6, text: 'Surely goodness and mercy shall follow me all the days of my life; and I will dwell in the house of the LORD forever.' },
  ],
  'PSA-91': [
    { number: 1, text: 'Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty.' },
    { number: 2, text: 'I will say of the LORD, "He is my refuge and my fortress, my God, in whom I trust."' },
    { number: 4, text: 'He will cover you with his feathers, and under his wings you will find refuge; his faithfulness will be your shield and rampart.' },
    { number: 11, text: 'For he will command his angels concerning you to guard you in all your ways;' },
    { number: 14, text: '"Because he loves me," says the LORD, "I will rescue him; I will protect him, for he acknowledges my name."' },
  ],
  'PSA-121': [
    { number: 1, text: 'I lift up my eyes to the mountains—where does my help come from?' },
    { number: 2, text: 'My help comes from the LORD, the Maker of heaven and earth.' },
    { number: 3, text: 'He will not let your foot slip—he who watches over you will not slumber;' },
    { number: 7, text: 'The LORD will keep you from all harm—he will watch over your life;' },
    { number: 8, text: 'The LORD will watch over your coming and going both now and forevermore.' },
  ],
  'ISA-40': [
    { number: 28, text: 'Do you not know? Have you not heard? The LORD is the everlasting God, the Creator of the ends of the earth. He will not grow tired or weary, and his understanding no one can fathom.' },
    { number: 29, text: 'He gives strength to the weary and increases the power of the weak.' },
    { number: 30, text: 'Even youths grow tired and weary, and young men stumble and fall;' },
    { number: 31, text: 'But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.' },
  ],
  'MAT-5': [
    { number: 3, text: 'Blessed are the poor in spirit, for theirs is the kingdom of heaven.' },
    { number: 4, text: 'Blessed are those who mourn, for they will be comforted.' },
    { number: 5, text: 'Blessed are the meek, for they will inherit the earth.' },
    { number: 6, text: 'Blessed are those who hunger and thirst for righteousness, for they will be filled.' },
    { number: 7, text: 'Blessed are the merciful, for they will be shown mercy.' },
    { number: 8, text: 'Blessed are the pure in heart, for they will see God.' },
    { number: 9, text: 'Blessed are the peacemakers, for they will be called children of God.' },
    { number: 14, text: 'You are the light of the world. A town built on a hill cannot be hidden.' },
    { number: 16, text: 'In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven.' },
  ],
  'JHN-1': [
    { number: 1, text: 'In the beginning was the Word, and the Word was with God, and the Word was God.' },
    { number: 2, text: 'He was with God in the beginning.' },
    { number: 3, text: 'Through him all things were made; without him nothing was made that has been made.' },
    { number: 4, text: 'In him was life, and that life was the light of all mankind.' },
    { number: 5, text: 'The light shines in the darkness, and the darkness has not overcome it.' },
    { number: 14, text: 'The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth.' },
  ],
  'JHN-3': [
    { number: 16, text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
    { number: 17, text: 'For God did not send his Son into the world to condemn the world, but to save the world through him.' },
    { number: 30, text: 'He must become greater; I must become less.' },
  ],
  'JHN-14': [
    { number: 1, text: 'Do not let your hearts be troubled. You believe in God; believe also in me.' },
    { number: 2, text: 'My Father\'s house has many rooms; if that were not so, would I have told you that I am going there to prepare a place for you?' },
    { number: 6, text: 'Jesus answered, "I am the way and the truth and the life. No one comes to the Father except through me."' },
    { number: 27, text: 'Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.' },
  ],
  'ROM-8': [
    { number: 1, text: 'Therefore, there is now no condemnation for those who are in Christ Jesus,' },
    { number: 28, text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.' },
    { number: 31, text: 'What, then, shall we say in response to these things? If God is for us, who can be against us?' },
    { number: 38, text: 'For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers,' },
    { number: 39, text: 'neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.' },
  ],
  '1CO-13': [
    { number: 1, text: 'If I speak in the tongues of men or of angels, but do not have love, I am only a resounding gong or a clanging cymbal.' },
    { number: 4, text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.' },
    { number: 5, text: 'It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs.' },
    { number: 7, text: 'It always protects, always trusts, always hopes, always perseveres.' },
    { number: 8, text: 'Love never fails.' },
    { number: 13, text: 'And now these three remain: faith, hope and love. But the greatest of these is love.' },
  ],
  'PHP-4': [
    { number: 4, text: 'Rejoice in the Lord always. I will say it again: Rejoice!' },
    { number: 6, text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.' },
    { number: 7, text: 'And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.' },
    { number: 13, text: 'I can do all this through him who gives me strength.' },
    { number: 19, text: 'And my God will meet all your needs according to the riches of his glory in Christ Jesus.' },
  ],
  'EPH-6': [
    { number: 10, text: 'Finally, be strong in the Lord and in his mighty power.' },
    { number: 11, text: 'Put on the full armor of God, so that you can take your stand against the devil\'s schemes.' },
    { number: 14, text: 'Stand firm then, with the belt of truth buckled around your waist, with the breastplate of righteousness in place,' },
    { number: 16, text: 'In addition to all this, take up the shield of faith, with which you can extinguish all the flaming arrows of the evil one.' },
    { number: 17, text: 'Take the helmet of salvation and the sword of the Spirit, which is the word of God.' },
  ],
  'HEB-11': [
    { number: 1, text: 'Now faith is confidence in what we hope for and assurance about what we do not see.' },
    { number: 3, text: 'By faith we understand that the universe was formed at God\'s command, so that what is seen was not made out of what was visible.' },
    { number: 6, text: 'And without faith it is impossible to please God, because anyone who comes to him must believe that he exists and that he rewards those who earnestly seek him.' },
  ],
  'REV-21': [
    { number: 1, text: 'Then I saw "a new heaven and a new earth," for the first heaven and the first earth had passed away, and there was no longer any sea.' },
    { number: 3, text: 'And I heard a loud voice from the throne saying, "Look! God\'s dwelling place is now among the people, and he will dwell with them. They will be his people, and God himself will be with them and be their God."' },
    { number: 4, text: '"He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain, for the old order of things has passed away."' },
    { number: 5, text: 'He who was seated on the throne said, "I am making everything new!"' },
  ],
  '2JH-1': [
    { number: 1, text: 'The elder unto the elect lady and her children, whom I love in the truth; and not I only, but also all they that have known the truth;' },
    { number: 2, text: 'For the truth\'s sake, which dwelleth in us, and shall be with us for ever.' },
    { number: 3, text: 'Grace be with you, mercy, and peace, from God the Father, and from the Lord Jesus Christ, the Son of the Father, in truth and love.' },
    { number: 4, text: 'I rejoiced greatly that I found of thy children walking in truth, as we have received a commandment from the Father.' },
    { number: 5, text: 'And now I beseech thee, lady, not as though I wrote a new commandment unto thee, but that which we had from the beginning, that we love one another.' },
    { number: 6, text: 'And this is love, that we walk after his commandments. This is the commandment, That, as ye have heard from the beginning, ye should walk in it.' },
    { number: 7, text: 'For many deceivers are entered into the world, who confess not that Jesus Christ is come in the flesh. This is a deceiver and an antichrist.' },
    { number: 8, text: 'Look to yourselves, that we lose not those things which we have wrought, but that we receive a full reward.' },
    { number: 9, text: 'Whosoever transgresseth, and abideth not in the doctrine of Christ, hath not God. He that abideth in the doctrine of Christ, he hath both the Father and the Son.' },
    { number: 10, text: 'If there come any unto you, and bring not this doctrine, receive him not into your house, neither bid him God speed:' },
    { number: 11, text: 'For he that biddeth him God speed is partaker of his evil deeds.' },
    { number: 12, text: 'Having many things to write unto you, I would not write with paper and ink: but I trust to come unto you, and speak face to face, that our joy may be full.' },
    { number: 13, text: 'The children of thy elect sister greet thee. Amen.' },
  ],
  '3JH-1': [
    { number: 1, text: 'The elder unto the wellbeloved Gaius, whom I love in the truth.' },
    { number: 2, text: 'Beloved, I wish above all things that thou mayest prosper and be in health, even as thy soul prospereth.' },
    { number: 3, text: 'For I rejoiced greatly, when the brethren came and testified of the truth that is in thee, even as thou walkest in the truth.' },
    { number: 4, text: 'I have no greater joy than to hear that my children walk in truth.' },
    { number: 5, text: 'Beloved, thou doest faithfully whatsoever thou doest to the brethren, and to strangers;' },
    { number: 6, text: 'Which have borne witness of thy charity before the church: whom if thou bring forward on their journey after a godly sort, thou shalt do well:' },
    { number: 7, text: 'Because that for his name\'s sake they went forth, taking nothing of the Gentiles.' },
    { number: 8, text: 'We therefore ought to receive such, that we might be fellowhelpers to the truth.' },
    { number: 9, text: 'I wrote unto the church: but Diotrephes, who loveth to have the preeminence among them, receiveth us not.' },
    { number: 10, text: 'Wherefore, if I come, I will remember his deeds which he doeth, prating against us with malicious words: and not content therewith, neither doth he himself receive the brethren, and forbiddeth them that would, and casteth them out of the church.' },
    { number: 11, text: 'Beloved, follow not that which is evil, but that which is good. He that doeth good is of God: but he that doeth evil hath not seen God.' },
    { number: 12, text: 'Demetrius hath good report of all men, and of the truth itself: yea, and we also bear record; and ye know that our record is true.' },
    { number: 13, text: 'I had many things to write, but I will not with ink and pen write unto thee:' },
    { number: 14, text: 'But I trust I shall shortly see thee, and we shall speak face to face. Peace be to thee. Our friends salute thee. Greet the friends by name.' },
  ],
  'JUD-1': [
    { number: 1, text: 'Jude, the servant of Jesus Christ, and brother of James, to them that are sanctified by God the Father, and preserved in Jesus Christ, and called:' },
    { number: 2, text: 'Mercy unto you, and peace, and love, be multiplied.' },
    { number: 3, text: 'Beloved, when I gave all diligence to write unto you of the common salvation, it was needful for me to write unto you, and exhort you that ye should earnestly contend for the faith which was once delivered unto the saints.' },
    { number: 4, text: 'For there are certain men crept in unawares, who were before of old ordained to this condemnation, ungodly men, turning the grace of our God into lasciviousness, and denying the only Lord God, and our Lord Jesus Christ.' },
    { number: 5, text: 'I will therefore put you in remembrance, though ye once knew this, how that the Lord, having saved the people out of the land of Egypt, afterward destroyed them that believed not.' },
    { number: 6, text: 'And the angels which kept not their first estate, but left their own habitation, he hath reserved in everlasting chains under darkness unto the judgment of the great day.' },
    { number: 7, text: 'Even as Sodom and Gomorrha, and the cities about them in like manner, giving themselves over to fornication, and going after strange flesh, are set forth for an example, suffering the vengeance of eternal fire.' },
    { number: 8, text: 'Likewise also these filthy dreamers defile the flesh, despise dominion, and speak evil of dignities.' },
    { number: 9, text: 'Yet Michael the archangel, when contending with the devil he disputed about the body of Moses, durst not bring against him a railing accusation, but said, The Lord rebuke thee.' },
    { number: 10, text: 'But these speak evil of those things which they know not: but what they know naturally, as brute beasts, in those things they corrupt themselves.' },
    { number: 11, text: 'Woe unto them! for they have gone in the way of Cain, and ran greedily after the error of Balaam for reward, and perished in the gainsaying of Core.' },
    { number: 12, text: 'These are spots in your feasts of charity, when they feast with you, feeding themselves without fear: clouds they are without water, carried about of winds; trees whose fruit withereth, without fruit, twice dead, plucked up by the roots;' },
    { number: 13, text: 'Raging waves of the sea, foaming out their own shame; wandering stars, to whom is reserved the blackness of darkness for ever.' },
    { number: 14, text: 'And Enoch also, the seventh from Adam, prophesied of these, saying, Behold, the Lord cometh with ten thousands of his saints,' },
    { number: 15, text: 'To execute judgment upon all, and to convince all that are ungodly among them of all their ungodly deeds which they have ungodly committed, and of all their hard speeches which ungodly sinners have spoken against him.' },
    { number: 16, text: 'These are murmurers, complainers, walking after their own lusts; and their mouth speaketh great swelling words, having men\'s persons in admiration because of advantage.' },
    { number: 17, text: 'But, beloved, remember ye the words which were spoken before of the apostles of our Lord Jesus Christ;' },
    { number: 18, text: 'How that they told you there should be mockers in the last time, who should walk after their own ungodly lusts.' },
    { number: 19, text: 'These be they who separate themselves, sensual, having not the Spirit.' },
    { number: 20, text: 'But ye, beloved, building up yourselves on your most holy faith, praying in the Holy Ghost,' },
    { number: 21, text: 'Keep yourselves in the love of God, looking for the mercy of our Lord Jesus Christ unto eternal life.' },
    { number: 22, text: 'And of some have compassion, making a difference:' },
    { number: 23, text: 'And others save with fear, pulling them out of the fire; hating even the garment spotted by the flesh.' },
    { number: 24, text: 'Now unto him that is able to keep you from falling, and to present you faultless before the presence of his glory with exceeding joy,' },
    { number: 25, text: 'To the only wise God our Saviour, be glory and majesty, dominion and power, both now and ever. Amen.' },
  ],
  'PHM-1': [
    { number: 1, text: 'Paul, a prisoner of Jesus Christ, and Timothy our brother, unto Philemon our dearly beloved, and fellowlabourer,' },
    { number: 2, text: 'And to our beloved Apphia, and Archippus our fellowsoldier, and to the church in thy house:' },
    { number: 3, text: 'Grace to you, and peace, from God our Father and the Lord Jesus Christ.' },
    { number: 4, text: 'I thank my God, making mention of thee always in my prayers,' },
    { number: 5, text: 'Hearing of thy love and faith, which thou hast toward the Lord Jesus, and toward all saints;' },
    { number: 6, text: 'That the communication of thy faith may become effectual by the acknowledging of every good thing which is in you in Christ Jesus.' },
    { number: 7, text: 'For we have great joy and consolation in thy love, because the bowels of the saints are refreshed by thee, brother.' },
    { number: 8, text: 'Wherefore, though I might be much bold in Christ to enjoin thee that which is convenient,' },
    { number: 9, text: 'Yet for love\'s sake I rather beseech thee, being such an one as Paul the aged, and now also a prisoner of Jesus Christ.' },
    { number: 10, text: 'I beseech thee for my son Onesimus, whom I have begotten in my bonds:' },
    { number: 11, text: 'Which in time past was to thee unprofitable, but now profitable to thee and to me:' },
    { number: 12, text: 'Whom I have sent again: thou therefore receive him, that is, mine own bowels:' },
    { number: 13, text: 'Whom I would have retained with me, that in thy stead he might have ministered unto me in the bonds of the gospel:' },
    { number: 14, text: 'But without thy mind would I do nothing; that thy benefit should not be as it were of necessity, but willingly.' },
    { number: 15, text: 'For perhaps he therefore departed for a season, that thou shouldest receive him for ever;' },
    { number: 16, text: 'Not now as a servant, but above a servant, a brother beloved, specially to me, but how much more unto thee, both in the flesh, and in the Lord?' },
    { number: 17, text: 'If thou count me therefore a partner, receive him as myself.' },
    { number: 18, text: 'If he hath wronged thee, or oweth thee aught, put that on mine account;' },
    { number: 19, text: 'I Paul have written it with mine own hand, I will repay it: albeit I do not say to thee how thou owest unto me even thine own self besides.' },
    { number: 20, text: 'Yea, brother, let me have joy of thee in the Lord: refresh my bowels in the Lord.' },
    { number: 21, text: 'Having confidence in thy obedience I wrote unto thee, knowing that thou wilt also do more than I say.' },
    { number: 22, text: 'But withal prepare me also a lodging: for I trust that through your prayers I shall be given unto you.' },
    { number: 23, text: 'There salute thee Epaphras, my fellowprisoner in Christ Jesus;' },
    { number: 24, text: 'Marcus, Aristarchus, Demas, Lucas, my fellowlabourers.' },
    { number: 25, text: 'The grace of our Lord Jesus Christ be with your spirit. Amen.' },
  ],
  'OBA-1': [
    { number: 1, text: 'The vision of Obadiah. Thus saith the Lord GOD concerning Edom; We have heard a rumour from the LORD, and an ambassador is sent among the heathen, Arise ye, and let us rise up against her in battle.' },
    { number: 2, text: 'Behold, I have made thee small among the heathen: thou art greatly despised.' },
    { number: 3, text: 'The pride of thine heart hath deceived thee, thou that dwellest in the clefts of the rock, whose habitation is high; that saith in his heart, Who shall bring me down to the ground?' },
    { number: 4, text: 'Though thou exalt thyself as the eagle, and though thou set thy nest among the stars, thence will I bring thee down, saith the LORD.' },
    { number: 5, text: 'If thieves came to thee, if robbers by night, (how art thou cut off!) would they not have stolen till they had enough? if the grapegatherers came to thee, would they not leave some grapes?' },
    { number: 6, text: 'How are the things of Esau searched out! how are his hidden things sought up!' },
    { number: 7, text: 'All the men of thy confederacy have brought thee even to the border: the men that were at peace with thee have deceived thee, and prevailed against thee; they that eat thy bread have laid a wound under thee: there is none understanding in him.' },
    { number: 8, text: 'Shall I not in that day, saith the LORD, even destroy the wise men out of Edom, and understanding out of the mount of Esau?' },
    { number: 9, text: 'And thy mighty men, O Teman, shall be dismayed, to the end that every one of the mount of Esau may be cut off by slaughter.' },
    { number: 10, text: 'For thy violence against thy brother Jacob shame shall cover thee, and thou shalt be cut off for ever.' },
    { number: 11, text: 'In the day that thou stoodest on the other side, in the day that the strangers carried away captive his forces, and foreigners entered into his gates, and cast lots upon Jerusalem, even thou wast as one of them.' },
    { number: 12, text: 'But thou shouldest not have looked on the day of thy brother in the day that he became a stranger; neither shouldest thou have rejoiced over the children of Judah in the day of their destruction; neither shouldest thou have spoken proudly in the day of distress.' },
    { number: 13, text: 'Thou shouldest not have entered into the gate of my people in the day of their calamity; yea, thou shouldest not have looked on their affliction in the day of their calamity, nor have laid hands on their substance in the day of their calamity;' },
    { number: 14, text: 'Neither shouldest thou have stood in the crossway, to cut off those of his that did escape; neither shouldest thou have delivered up those of his that did remain in the day of distress.' },
    { number: 15, text: 'For the day of the LORD is near upon all the heathen: as thou hast done, it shall be done unto thee: thy reward shall return upon thine own head.' },
    { number: 16, text: 'For as ye have drunk upon my holy mountain, so shall all the heathen drink continually, yea, they shall drink, and they shall swallow down, and they shall be as though they had not been.' },
    { number: 17, text: 'But upon mount Zion shall be deliverance, and there shall be holiness; and the house of Jacob shall possess their possessions.' },
    { number: 18, text: 'And the house of Jacob shall be a fire, and the house of Joseph a flame, and the house of Esau for stubble, and they shall kindle in them, and devour them; and there shall not be any remaining of the house of Esau; for the LORD hath spoken it.' },
    { number: 19, text: 'And they of the south shall possess the mount of Esau; and they of the plain the Philistines: and they shall possess the fields of Ephraim, and the fields of Samaria: and Benjamin shall possess Gilead.' },
    { number: 20, text: 'And the captivity of this host of the children of Israel shall possess that of the Canaanites, even unto Zarephath; and the captivity of Jerusalem, which is in Sepharad, shall possess the cities of the south.' },
    { number: 21, text: 'And saviours shall come up on mount Zion to judge the mount of Esau; and the kingdom shall be the LORD\'s.' },
  ],
};

// In-memory cache for fetched Bible chapters
const verseCache: Record<string, BibleVerse[]> = {};

// Fallback dynamic generator for offline/error states
export function getChapterVerses(bookId: string, chapter: number): BibleVerse[] {
  const key = `${bookId}-${chapter}`;
  if (CURATED_CHAPTERS[key]) {
    return CURATED_CHAPTERS[key];
  }

  const book = BIBLE_BOOKS.find((b) => b.id === bookId || b.name === bookId) || BIBLE_BOOKS[0];
  
  return [
    { number: 1, text: `The beginning of ${book.name} chapter ${chapter}. Praise be to God whose Word endures forever.` },
    { number: 2, text: `Thy word is a lamp unto my feet, and a light unto my path. (${book.name} ${chapter}:2)` },
  ];
}

// Curated Tamil verses for key chapters
const TAMIL_CURATED_CHAPTERS: Record<string, BibleVerse[]> = {
  'GEN-1': [
    { number: 1, text: 'ஆதியிலே தேவன் வானத்தையும் பூமியையும் சிருஷ்டித்தார்.' },
    { number: 2, text: 'பூமியானது ஒழுங்கின்மையும் வெறுமையுமாய் இருந்தது; ஆழத்தின்மேல் இருள் இருந்தது; தேவ ஆவியானவர் ஜலத்தின்மேல் அசைவாடிக்கொண்டிருந்தார்.' },
    { number: 3, text: 'தேவன்: வெளிச்சம் உண்டாகக்கடவது என்றார், வெளிச்சம் உண்டாயிற்று.' },
    { number: 4, text: 'வெளிச்சம் நல்லது என்று தேவன் கண்டார்; வெளிச்சத்தையும் இருளையும் தேவன் வெவ்வேறாகப் பிரித்தார்.' },
    { number: 5, text: 'தேவன் வெளிச்சத்துக்குப் பகல் என்று பேரிட்டார், இருளுக்கு இரவென்று பேரிட்டார்; சாயங்காலமும் விடியற்காலமுமாகி முதலாம் நாள் ஆயிற்று.' },
    { number: 6, text: 'பின்பு தேவன்: ஜலத்தின் மத்தியில் ஆகாயவிரிவு உண்டாகக்கடவது என்றும், அது ஜலத்தினின்று ஜலத்தைப் பிரிக்கக்கடவது என்றும் சொன்னார்.' },
  ],
  'JHN-3': [
    { number: 16, text: 'தேவன், தம்முடைய ஒரேபேறான குமாரனை விசுவாசிக்கிறவன் எவனோ அவன் கெட்டுப்போகாமல் நித்தியஜீவனை அடையும்படிக்கு, அவரைத் தந்தருளி, இவ்வளவாய் உலகத்தில் அன்புகூர்ந்தார்.' },
    { number: 17, text: 'உலகத்தை ஆக்கினைக்குள்ளாகத் தீர்க்கும்படி தேவன் தம்முடைய குமாரனை உலகத்தில் அனுப்பாமல், அவராலே உலகம் இரட்சிக்கப்படுவதற்காகவே அவரை அனுப்பினார்.' },
    { number: 18, text: 'அவரை விசுவாசிக்கிறவன் ஆக்கினைக்குள்ளாகத் தீர்க்கப்படான்; விசுவாசியாதவனோ தேவனுடைய ஒரேபேறான குமாரனுடைய நாமத்தில் விசுவாசமுள்ளவனாயிராதபடியினால் ஆக்கினைத்தீர்ப்பு அடைந்தாயிற்று.' },
  ],
  'PSA-23': [
    { number: 1, text: 'கர்த்தர் என் மேய்ப்பராயிருக்கிறார்; நான் தாழ்ச்சியடையேன்.' },
    { number: 2, text: 'அவர் என்னைப்பசும்புல்லுள்ள இடங்களில் மேய்த்து, அமர்ந்த தண்ணீர்கள் அண்டையில் என்னைக் கொண்டுபோய் விடுகிறார்.' },
    { number: 3, text: 'அவர் என் ஆத்துமாவைத் தேற்றி, தம்முடைய நாமத்தினிமித்தம் என்னை நீதியின் பாதைகளில் நடத்துகிறார்.' },
    { number: 4, text: 'நான் மரண இருளின் பள்ளத்தாக்கிலே நடந்தாலும் பொல்லாப்புக்குப் பயப்படேன்; தேவரீர் என்னோடேகூட இருக்கிறீர்; உமது கோலும் உமது தடியும் என்னைத்தேற்றும்.' },
    { number: 5, text: 'என் சத்துருக்களுக்கு முன்பாக நீர் எனக்கு ஒரு பந்தியை ஆயத்தப்படுத்தி, என் தலையை எண்ணெயால் அபிஷேகம் பண்ணுகிறீர்; என் பாத்திரம் நிரம்பி வழிகிறது.' },
    { number: 6, text: 'என் ஆயுளுள்ள நாளெல்லாம் நன்மையும் கிருபையும் என்னைத் தொடரும்; நான் கர்த்தருடைய வீட்டிலே நீடித்த நாட்களாய் நிலைத்திருப்பேன்.' },
  ],
  'MAT-1': [
    { number: 21, text: 'அவள் ஒரு குமாரனைப் பெறுவாள், அவருக்கு இயேசு என்று பேரிடுவாயாக; ஏனெனில் அவர் தம்முடைய ஜனங்களின் பாவங்களை நீக்கி அவர்களை இரட்சிப்பார் என்றான்.' },
    { number: 23, text: 'இதோ, ஒரு கன்னிகை கர்ப்பவதியாகி ஒரு குமாரனைப் பெறுவாள்; அவருக்கு இம்மானுவேல் என்று பேரிடுவார்கள் என்று சொல்லப்பட்டது; இம்மானுவேல் என்பதற்கு தேவன் நம்மோடே இருக்கிறார் என்று அர்த்தமாம்.' },
  ],
};

/**
 * Helper to clean verse text by stripping Strong's concordance numbers (<S>...</S>),
 * superscript tags (<sup>...</sup>), and general HTML tags.
 */
function cleanVerseText(raw: string): string {
  if (!raw) return '';
  return String(raw)
    .replace(/<s[^>]*>[\s\S]*?<\/s>/gi, '')
    .replace(/<sup[^>]*>[\s\S]*?<\/sup>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Sanitizes parsed verses by removing empty/blank verses (such as trailing empty entries in Darby or psalm titles)
 * and normalizing verse numbering to clean sequential integers (1..N).
 */
function sanitizeVerses(rawList: Array<{ verse?: any; number?: any; text?: any }>): BibleVerse[] {
  if (!Array.isArray(rawList)) return [];

  // Filter out any entries that have empty or whitespace-only text
  const cleanList = rawList
    .map((v, idx) => ({
      number: Number(v.verse ?? v.number) || (idx + 1),
      text: cleanVerseText(v.text),
    }))
    .filter((v) => v.text.length > 0);

  if (cleanList.length === 0) return [];

  // Normalize verse numbers to 1..N sequence to fix any gaps, offset titles, or trailing empty verses
  return cleanList.map((v, idx) => ({
    number: idx + 1,
    text: v.text,
  }));
}

/**
 * Fetch complete chapter verses from free public Bible APIs (bible-api.com & bolls.life).
 * Supports caching for fast repeat views.
 */
export async function fetchChapterVerses(
  bookName: string,
  chapter: number,
  translation: string = 'WEB'
): Promise<BibleVerse[]> {
  const normalizedTrans = translation.toLowerCase();

  // Find matching book in BIBLE_BOOKS catalog
  const book = BIBLE_BOOKS.find(
    (b) => b.name.toLowerCase() === bookName.toLowerCase() || b.id.toLowerCase() === bookName.toLowerCase() || (b.tamilName && b.tamilName.toLowerCase() === bookName.toLowerCase())
  );

  const realBookName = book ? book.name : bookName;
  const bookId = book ? book.id : 'GEN';

  const cacheKey = `${realBookName}-${chapter}-${normalizedTrans}`;

  if (verseCache[cacheKey]) {
    return verseCache[cacheKey];
  }

  // --- TAMIL BIBLE FETCHING ---
  if (normalizedTrans === 'tam' || normalizedTrans === 'tamil') {
    let tamilFileName = realBookName;
    if (realBookName === 'Song of Solomon') {
      tamilFileName = 'Song of Songs';
    }

    const urlsToTry = [
      `https://cdn.jsdelivr.net/gh/aruljohn/Bible-tamil@master/${encodeURIComponent(tamilFileName)}.json`,
      `https://raw.githubusercontent.com/aruljohn/Bible-tamil/master/${encodeURIComponent(tamilFileName)}.json`,
    ];

    for (const url of urlsToTry) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.chapters)) {
            const chData = data.chapters.find((c: any) => Number(c.chapter) === Number(chapter)) || data.chapters[chapter - 1];
            if (chData && Array.isArray(chData.verses) && chData.verses.length > 0) {
              const parsed = sanitizeVerses(chData.verses);
              if (parsed.length > 0) {
                verseCache[cacheKey] = parsed;
                return parsed;
              }
            }
          }
        }
      } catch (e) {
        console.warn(`Tamil Bible fetch error from ${url}:`, e);
      }
    }

    // Fallback to Tamil Curated Local Chapters if network fails
    if (book) {
      const curatedKey = `${book.id}-${chapter}`;
      if (TAMIL_CURATED_CHAPTERS[curatedKey]) {
        return sanitizeVerses(TAMIL_CURATED_CHAPTERS[curatedKey]);
      }
    }

    return [
      {
        number: 1,
        text: `தேவன், தம்முடைய ஒரேபேறான குமாரனை விசுவாசிக்கிறவன் எவனோ அவன் கெட்டுப்போகாமல் நித்தியஜீவனை அடையும்படிக்கு, அவரைத் தந்தருளி, இவ்வளவாய் உலகத்தில் அன்புகூர்ந்தார். (${book?.tamilName || realBookName} ${chapter}:1)`,
      },
    ];
  }

  // --- ENGLISH BIBLE FETCHING ---
  const bookIndex = book ? BIBLE_BOOKS.indexOf(book) + 1 : 1;

  // 1. Try Bolls.life API for English translations where available
  let bollsCode = '';
  if (normalizedTrans === 'kjv') bollsCode = 'KJV';
  else if (normalizedTrans === 'asv') bollsCode = 'ASV';
  else if (normalizedTrans === 'bbe') bollsCode = 'BBE';
  else if (normalizedTrans === 'ylt') bollsCode = 'YLT';
  else if (normalizedTrans === 'web') bollsCode = 'WEB';

  if (bollsCode && bookIndex > 0) {
    try {
      const url = `https://bolls.life/get-chapter/${bollsCode}/${bookIndex}/${chapter}/`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const parsedVerses = sanitizeVerses(data);

          if (parsedVerses.length > 0) {
            verseCache[cacheKey] = parsedVerses;
            return parsedVerses;
          }
        }
      }
    } catch (e) {
      console.warn('Bolls English API fetch error:', e);
    }
  }

  // 2. Try bible-api.com with proper parameters and identifiers
  let apiTransList: string[] = [];
  if (normalizedTrans === 'darby') apiTransList = ['darby'];
  else if (normalizedTrans === 'oeb') apiTransList = ['oeb-us', 'oeb-cw'];
  else if (normalizedTrans === 'ylt') apiTransList = ['ylt'];
  else if (normalizedTrans === 'kjv') apiTransList = ['kjv'];
  else if (normalizedTrans === 'asv') apiTransList = ['asv'];
  else if (normalizedTrans === 'bbe') apiTransList = ['bbe'];
  else apiTransList = ['web'];

  for (const apiTrans of apiTransList) {
    const urlsToTry = [
      `https://bible-api.com/data/${apiTrans}/${bookId}/${chapter}`,
      `https://bible-api.com/${encodeURIComponent(realBookName)}%20${chapter}?translation=${apiTrans}&single_chapter_book_matching=indifferent`,
    ];

    for (const url of urlsToTry) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.verses) && data.verses.length > 0) {
            const parsedVerses = sanitizeVerses(data.verses);

            if (parsedVerses.length > 0) {
              verseCache[cacheKey] = parsedVerses;
              return parsedVerses;
            }
          }
        }
      } catch (e) {
        console.warn(`bible-api.com failed for url "${url}":`, e);
      }
    }
  }

  // 3. Fallback to WEB translation on bible-api if specific translation missing chapter (e.g. OEB OT)
  if (normalizedTrans !== 'web') {
    const fallbackUrls = [
      `https://bible-api.com/data/web/${bookId}/${chapter}`,
      `https://bible-api.com/${encodeURIComponent(realBookName)}%20${chapter}?translation=web&single_chapter_book_matching=indifferent`,
    ];
    for (const url of fallbackUrls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.verses) && data.verses.length > 0) {
            const parsedVerses = sanitizeVerses(data.verses);

            if (parsedVerses.length > 0) {
              verseCache[cacheKey] = parsedVerses;
              return parsedVerses;
            }
          }
        }
      } catch (e) {
        console.warn('Fallback WEB fetch error:', e);
      }
    }
  }

  // Fallback to curated local dataset if present
  if (book) {
    const curatedKey = `${book.id}-${chapter}`;
    if (CURATED_CHAPTERS[curatedKey]) {
      return sanitizeVerses(CURATED_CHAPTERS[curatedKey]);
    }
  }

  // Graceful offline fallback message
  return [
    {
      number: 1,
      text: `Unable to load verses for ${realBookName} Chapter ${chapter}. Please check your connection and try again.`,
    },
  ];
}
