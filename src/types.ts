export type NavigationTab = 'bible' | 'songs' | 'presentation';

export type BibleTranslation = 'WEB' | 'KJV' | 'ASV' | 'BBE' | 'YLT' | 'DARBY' | 'OEB' | 'TAM';

export interface BibleBook {
  id: string;
  name: string;
  tamilName?: string;
  testament: 'OT' | 'NT';
  category: string;
  totalChapters: number;
}

export interface BibleVerse {
  number: number;
  text: string;
}

export interface BibleChapter {
  bookId: string;
  bookName: string;
  chapter: number;
  verses: BibleVerse[];
}

export interface HighlightedVerse {
  id: string;
  bookName: string;
  chapter: number;
  verseNumber: number;
  text: string;
  color: 'purple' | 'sky' | 'rose' | 'yellow';
  timestamp: number;
}

export interface BookmarkedVerse {
  id: string;
  bookName: string;
  chapter: number;
  verseNumber: number;
  text: string;
  note?: string;
  timestamp: number;
}

export type SongCategory = 'Worship' | 'Praise' | 'Hymn' | 'Acoustic' | 'Prayer' | 'Devotional';

export interface WorshipSong {
  id: string;
  title: string;
  tamilTitle?: string;
  artist: string;
  originalKey: string;
  currentKey: string;
  tempo?: string;
  timeSignature?: string;
  category: SongCategory;
  tags: string[];
  scriptureRef?: string;
  lyricsWithChords: string;
  isFavorite?: boolean;
  custom?: boolean;
}

export type AmbientPadKey = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

export interface DailyVerse {
  id: string;
  reference: string;
  bookName: string;
  chapter: number;
  verseNumber: number;
  text: string;
  theme: string;
  devotionalSummary: string;
  prayer?: string;
  dateString?: string;
}

export interface AISongSuggestion {
  title: string;
  artist: string;
  key: string;
  tempo?: string;
  category: string;
  reason: string;
  sampleLyricsWithChords?: string;
}

export type PresentationTheme = 'cinematic' | 'black' | 'midnight' | 'parchment' | 'lower-third';
export type PresentationFontSize = 'normal' | 'large' | 'xlarge' | 'giant' | 'max';

export interface PresentationSlide {
  id?: string;
  bookName: string;
  tamilBookName?: string;
  chapter: number;
  verseNumber: number;
  text: string;
  secondaryText?: string;
  // Media slide options
  mediaType?: 'image' | 'video' | 'none';
  mediaUrl?: string;
  // Legacy or slide styling options
  bgType?: 'color' | 'gradient' | 'image';
  bgValue?: string;
  overlayOpacity?: number;
  textColor?: string;
  fontFamily?: 'serif' | 'sans' | 'mono' | 'cursive' | 'display';
  fontSize?: 'small' | 'medium' | 'large' | 'xlarge' | 'giant';
  textAlign?: 'center' | 'left' | 'right';
  designStyle?: 'minimal' | 'card' | 'banner' | 'quote' | 'lower-third';
}

export interface DefaultSlidePreset {
  id: string;
  name: string;
  slide: PresentationSlide;
  createdAt: number;
}

export interface PresentationState {
  slides: PresentationSlide[];
  currentIndex: number;
  theme: PresentationTheme;
  fontSize: PresentationFontSize;
  showSecondaryTranslation: boolean;
  isAutoPlaying: boolean;
  autoPlayInterval: number; // in seconds
  lowerThirdTitle?: string;
  isPublished?: boolean;
  isBlack?: boolean;
  customBackground?: {
    type: 'gradient' | 'image' | 'color';
    value: string;
  } | null;
  updatedAt: number;
}
