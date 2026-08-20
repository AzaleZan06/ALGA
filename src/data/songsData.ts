import { WorshipSong } from '../types';

export const INITIAL_SONGS: WorshipSong[] = [
  {
    id: 'song-1',
    title: 'How Great Is Our God',
    artist: 'Chris Tomlin',
    originalKey: 'G',
    currentKey: 'G',
    tempo: '76 BPM',
    timeSignature: '4/4',
    category: 'Worship',
    tags: ['Praise', 'Majesty', 'Creation', 'Classic'],
    scriptureRef: 'Psalm 104:1-2',
    lyricsWithChords: `[Verse 1]
The splendor of the King, clothed in majesty
Let all the earth rejoice, all the earth rejoice
He wraps Himself in light, and darkness tries to hide
And trembles at His voice, and trembles at His voice

[Chorus]
How great is our God, sing with me
How great is our God, and all will see
How great, how great is our God

[Verse 2]
And age to age He stands, and time is in His hands
Beginning and the End, Beginning and the End
The Godhead, three in one, Father, Spirit, Son
The Lion and the Lamb, the Lion and the Lamb

[Bridge]
Name above all names,
You are worthy of all praise
My heart will sing, how great is our God`,
  },
  {
    id: 'song-2',
    title: 'What A Beautiful Name',
    artist: 'Hillsong Worship',
    originalKey: 'D',
    currentKey: 'D',
    tempo: '68 BPM',
    timeSignature: '4/4',
    category: 'Worship',
    tags: ['Jesus', 'Victory', 'Resurrection', 'Name of Jesus'],
    scriptureRef: 'Philippians 2:9-11',
    lyricsWithChords: `[Verse 1]
You were the Word at the beginning
One with God the Lord Most High
Your hidden glory in creation
Now revealed in You our Christ

[Chorus 1]
What a beautiful Name it is, what a beautiful Name it is
The Name of Jesus Christ my King
What a beautiful Name it is, nothing compares to this
What a beautiful Name it is, the Name of Jesus

[Verse 2]
You didn't want heaven without us
So Jesus You brought heaven down
My sin was great Your love was greater
What could separate us now

[Chorus 2]
What a wonderful Name it is, what a wonderful Name it is
The Name of Jesus Christ my King
What a wonderful Name it is, nothing compares to this
What a wonderful Name it is, the Name of Jesus

[Bridge]
Death could not hold You, the veil tore before You
You silence the boast of sin and grave
The heavens are roaring, the praise of Your glory
For You are raised to life again

You have no rival, You have no equal
Now and forever God You reign
Yours is the kingdom, Yours is the glory
Yours is the Name above all names`,
  },
  {
    id: 'song-3',
    title: '10,000 Reasons (Bless The Lord)',
    artist: 'Matt Redman',
    originalKey: 'G',
    currentKey: 'G',
    tempo: '73 BPM',
    timeSignature: '4/4',
    category: 'Praise',
    tags: ['Thanksgiving', 'Morning Prayer', 'Gratitude', 'Acoustic'],
    scriptureRef: 'Psalm 103:1-5',
    lyricsWithChords: `[Chorus]
Bless the Lord, O my soul, O my soul
Worship His holy name
Sing like never before, O my soul
I'll worship Your holy name

[Verse 1]
The sun comes up, it's a new day dawning
It's time to sing Your song again
Whatever may pass and whatever lies before me
Let me be singing when the evening comes

[Verse 2]
You're rich in love and You're slow to anger
Your name is great and Your heart is kind
For all Your goodness I will keep on singing
Ten thousand reasons for my heart to find

[Verse 3]
And on that day when my strength is failing
The end draws near and my time has come
Still my soul will sing Your praise unending
Ten thousand years and then forevermore`,
  },
  {
    id: 'song-4',
    title: 'Way Maker',
    artist: 'Sinach / Leeland',
    originalKey: 'E',
    currentKey: 'E',
    tempo: '68 BPM',
    timeSignature: '4/4',
    category: 'Worship',
    tags: ['Miracle', 'Promise Keeper', 'Light', 'Faith'],
    scriptureRef: 'Exodus 14:14',
    lyricsWithChords: `[Verse 1]
You are here, moving in our midst
I worship You, I worship You
You are here, working in this place
I worship You, I worship You

[Chorus]
(You are) Way Maker, Miracle Worker, Promise Keeper
Light in the darkness, my God, that is who You are
(You are) Way Maker, Miracle Worker, Promise Keeper
Light in the darkness, my God, that is who You are

[Verse 2]
You are here, touching every heart
I worship You, I worship You
You are here, healing every life
I worship You, I worship You

[Refrain]
That is who You are, that is who You are
That is who You are, that is who You are

[Bridge]
Even when I don't see it, You're working
Even when I don't feel it, You're working
You never stop, You never stop working
You never stop, You never stop working`,
  },
  {
    id: 'song-5',
    title: 'Goodness Of God',
    artist: 'Bethel Worship / CeCe Winans',
    originalKey: 'A',
    currentKey: 'A',
    tempo: '71 BPM',
    timeSignature: '4/4',
    category: 'Devotional',
    tags: ['Faithfulness', 'Testimony', 'Lovingkindness'],
    scriptureRef: 'Psalm 23:6',
    lyricsWithChords: `[Verse 1]
I love You Lord, Oh Your mercy never fails me
All my days, I've been held in Your hands
From the moment that I wake up, until I lay my head
Oh I will sing of the goodness of God

[Chorus]
All my life You have been faithful
All my life You have been so, so good
With every breath that I am able
Oh I will sing of the goodness of God

[Verse 2]
I love Your voice, You have led me through the fire
In darkest nights, You are close like no other
I've known You as a Father, I've known You as a Friend
And I have lived in the goodness of God

[Bridge]
Your goodness is running after, it's running after me
Your goodness is running after, it's running after me
With my life laid down, I'm surrendered now, I give You everything
Your goodness is running after, it's running after me`,
  },
  {
    id: 'song-6',
    title: 'Amazing Grace (My Chains Are Gone)',
    artist: 'Chris Tomlin / John Newton',
    originalKey: 'F',
    currentKey: 'F',
    tempo: '64 BPM',
    timeSignature: '3/4',
    category: 'Hymn',
    tags: ['Grace', 'Freedom', 'Salvation', 'Classic Hymn'],
    scriptureRef: 'Ephesians 2:8-9',
    lyricsWithChords: `[Verse 1]
Amazing grace, how sweet the sound
That saved a wretch like me
I once was lost, but now am found
Was blind, but now I see

[Verse 2]
'Twas grace that taught my heart to fear
And grace my fears relieved
How precious did that grace appear
The hour I first believed

[Chorus]
My chains are gone, I've been set free
My God, my Savior has ransomed me
And like a flood His mercy reigns
Unending love, amazing grace

[Verse 3]
The Lord has promised good to me
His word my hope secures
He will my shield and portion be
As long as life endures`,
  },
  {
    id: 'song-7',
    title: 'In Christ Alone',
    artist: 'Keith & Kristyn Getty',
    originalKey: 'D',
    currentKey: 'D',
    tempo: '60 BPM',
    timeSignature: '3/4',
    category: 'Hymn',
    tags: ['Cornerstone', 'Cross', 'Hope', 'Theology'],
    scriptureRef: 'Acts 4:12',
    lyricsWithChords: `[Verse 1]
In Christ alone my hope is found, He is my light, my strength, my song
This Cornerstone, this solid Ground, firm through the fiercest drought and storm
What heights of love, what depths of peace, when fears are stilled, when strivings cease!
My Comforter, my All in All, here in the love of Christ I stand.

[Verse 2]
In Christ alone! who took on flesh, fullness of God in helpless babe!
This gift of love and righteousness, scorned by the ones He came to save
Till on that cross as Jesus died, the wrath of God was satisfied
For every sin on Him was laid; Here in the death of Christ I live.

[Verse 3]
There in the ground His body lay, Light of the world by darkness slain:
Then bursting forth in glorious Day up from the grave He rose again!
And as He stands in victory sin's curse has lost its grip on me,
For I am His and He is mine bought with the precious blood of Christ.`,
  },
  {
    id: 'song-8',
    title: 'It Is Well With My Soul',
    artist: 'Horatio Spafford',
    originalKey: 'C',
    currentKey: 'C',
    tempo: '66 BPM',
    timeSignature: '4/4',
    category: 'Hymn',
    tags: ['Peace', 'Comfort', 'Trial', 'Traditional'],
    scriptureRef: 'Psalm 46:10',
    lyricsWithChords: `[Verse 1]
When peace, like a river, attendeth my way,
When sorrows like sea billows roll;
Whatever my lot, Thou hast taught me to say,
It is well, it is well with my soul.

[Chorus]
It is well (it is well)
With my soul (with my soul)
It is well, it is well with my soul.

[Verse 2]
Though Satan should buffet, though trials should come,
Let this blest assurance control,
That Christ has regarded my helpless estate,
And hath shed His own blood for my soul.`,
  },
];
