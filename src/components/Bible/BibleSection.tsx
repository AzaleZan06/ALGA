import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Share2,
  Highlighter,
  Copy,
  Check,
  Type,
  ListFilter,
  Search,
  Sun,
  Shield,
  Zap,
  Heart,
  Lightbulb,
  X,
  ArrowUp,
  Tv,
} from 'lucide-react';
import { PresentationModal } from './PresentationModal';
import {
  BIBLE_BOOKS,
  TOPICAL_COLLECTIONS,
  VERSE_OF_THE_DAY,
  fetchChapterVerses,
} from '../../data/bibleData';
import {
  BibleBook,
  BibleTranslation,
  BibleVerse,
  BookmarkedVerse,
  HighlightedVerse,
} from '../../types';

interface BibleSectionProps {
  bookmarks: BookmarkedVerse[];
  onToggleBookmark: (verse: {
    bookName: string;
    chapter: number;
    verseNumber: number;
    text: string;
  }) => void;
  highlights: HighlightedVerse[];
  onAddHighlight: (verseId: string, color: 'purple' | 'sky' | 'rose' | 'yellow', bookName: string, chapter: number, verseNumber: number, text: string) => void;
  onRemoveHighlight?: (verseId: string) => void;
  targetNavigation?: { bookName: string; chapter: number; verseNumber?: number } | null;
  onClearTargetNavigation?: () => void;
}

export const BibleSection: React.FC<BibleSectionProps> = ({
  bookmarks,
  onToggleBookmark,
  highlights,
  onAddHighlight,
  onRemoveHighlight,
  targetNavigation,
  onClearTargetNavigation,
}) => {
  // Navigation State
  const [selectedBook, setSelectedBook] = useState<BibleBook>(BIBLE_BOOKS[0]); // Default Genesis
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [highlightedVerseNum, setHighlightedVerseNum] = useState<number | null>(null);

  // Target navigation from bookmarks / search / favorites
  useEffect(() => {
    if (targetNavigation) {
      const book = BIBLE_BOOKS.find(
        (b) => b.name.toLowerCase() === targetNavigation.bookName.toLowerCase()
      );
      if (book) {
        setSelectedBook(book);
        setSelectedChapter(targetNavigation.chapter);
        if (targetNavigation.verseNumber) {
          setHighlightedVerseNum(targetNavigation.verseNumber);
        }
      }
      onClearTargetNavigation?.();
    }
  }, [targetNavigation, onClearTargetNavigation]);

  // Scroll to targeted verse once chapter verses are loaded
  useEffect(() => {
    if (!loading && highlightedVerseNum && verses.length > 0) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`verse-${highlightedVerseNum}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        const pulseTimer = setTimeout(() => {
          setHighlightedVerseNum(null);
        }, 3500);
        return () => clearTimeout(pulseTimer);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [loading, highlightedVerseNum, verses]);

  // Filter & Reader Settings
  const [testamentFilter, setTestamentFilter] = useState<'ALL' | 'OT' | 'NT'>('ALL');
  const [bookSearchQuery, setBookSearchQuery] = useState<string>('');
  const [translation, setTranslation] = useState<BibleTranslation>('WEB');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');

  // Action toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Presentation Mode state
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);
  const [secondaryVerses, setSecondaryVerses] = useState<BibleVerse[]>([]);

  // Floating Scroll to Top state
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      setShowScrollTop(scrollTop > 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const container = document.getElementById('bible-section-container');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const fetchedVerses = await fetchChapterVerses(selectedBook.name, selectedChapter, translation);
        if (isMounted) {
          setVerses(fetchedVerses);
        }
      } catch (err) {
        console.error('Failed to fetch chapter verses:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [selectedBook, selectedChapter, translation]);

  const handleSelectBibleVerse = (bookName: string, chapter: number) => {
    const foundBook = BIBLE_BOOKS.find((b) => b.name === bookName) || BIBLE_BOOKS[0];
    setSelectedBook(foundBook);
    setSelectedChapter(chapter);
    const readerEl = document.getElementById('bible-reader-main');
    if (readerEl) {
      readerEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleOpenPresentation = async () => {
    setIsPresentationOpen(true);
    const secondaryTransCode = translation === 'TAM' ? 'WEB' : 'TAM';
    try {
      const secVerses = await fetchChapterVerses(selectedBook.name, selectedChapter, secondaryTransCode as BibleTranslation);
      setSecondaryVerses(secVerses);
    } catch (e) {
      console.warn('Failed to fetch secondary verses for presentation:', e);
    }
  };

  const handleNextChapter = () => {
    if (selectedChapter < selectedBook.totalChapters) {
      setSelectedChapter((prev) => prev + 1);
    } else {
      // Find next book
      const currentIndex = BIBLE_BOOKS.findIndex((b) => b.id === selectedBook.id);
      if (currentIndex < BIBLE_BOOKS.length - 1) {
        setSelectedBook(BIBLE_BOOKS[currentIndex + 1]);
        setSelectedChapter(1);
      }
    }
  };

  const handlePrevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter((prev) => prev - 1);
    } else {
      const currentIndex = BIBLE_BOOKS.findIndex((b) => b.id === selectedBook.id);
      if (currentIndex > 0) {
        const prevBook = BIBLE_BOOKS[currentIndex - 1];
        setSelectedBook(prevBook);
        setSelectedChapter(prevBook.totalChapters);
      }
    }
  };

  const filteredBooks = BIBLE_BOOKS.filter((b) => {
    const matchesTestament = testamentFilter === 'ALL' || b.testament === testamentFilter;
    const matchesSearch =
      b.name.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
      (b.tamilName && b.tamilName.toLowerCase().includes(bookSearchQuery.toLowerCase()));
    return matchesTestament && matchesSearch;
  });

  const isVerseBookmarked = (verseNum: number) => {
    const id = `${selectedBook.name}-${selectedChapter}-${verseNum}`;
    return bookmarks.some((bm) => bm.id === id);
  };

  const getVerseHighlight = (verseNum: number) => {
    const id = `${selectedBook.name}-${selectedChapter}-${verseNum}`;
    return highlights.find((h) => h.id === id);
  };

  const handleCopyVerse = (verseNum: number, text: string) => {
    const refText = `${selectedBook.name} ${selectedChapter}:${verseNum} (${translation})\n"${text}"`;
    navigator.clipboard.writeText(refText);
    showToast(`Copied ${selectedBook.name} ${selectedChapter}:${verseNum}`);
  };

  const fontClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
    xl: 'text-xl leading-loose',
  }[fontSize];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12" id="bible-section-container">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold rounded-full shadow-2xl flex items-center space-x-2 animate-bounce border border-stone-700">
          <Check className="w-4 h-4 text-purple-400 dark:text-purple-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Editorial Header Banner */}
      <div className="relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-950 text-stone-100 p-8 sm:p-12 rounded-3xl shadow-2xl">
        {/* Vibrant multi-color ambient light splashes */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-rose-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />

        {/* Large faint background decorative number */}
        <div className="absolute right-4 bottom-0 -mb-10 text-[10rem] sm:text-[14rem] font-serif font-light text-white/[0.07] pointer-events-none select-none">
          01
        </div>

        <div className="relative z-10 space-y-4 max-w-2xl">
          <span className="text-[10px] uppercase tracking-[0.4em] bg-purple-400/20 text-purple-300 border border-purple-400/30 px-3.5 py-1 rounded-full font-bold inline-block shadow-sm">
            01 • HOLY BIBLE
          </span>

          <h2 className="text-3xl sm:text-5xl font-serif font-light italic leading-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-rose-100 to-indigo-100 drop-shadow-sm">
            Scripture Reader
          </h2>
        </div>

        {/* Header Translation Selector */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5 p-1.5 bg-stone-950/70 border border-purple-500/30 rounded-full text-xs backdrop-blur-md shadow-inner">
            {[
              { code: 'WEB', label: 'English' },
              { code: 'TAM', label: 'தமிழ்' },
            ].map((t) => (
              <button
                key={t.code}
                onClick={() => setTranslation(t.code as BibleTranslation)}
                className={`px-4 py-1.5 rounded-full font-bold text-xs tracking-wider transition-all cursor-pointer ${
                  (t.code === 'TAM' ? translation === 'TAM' : translation !== 'TAM')
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md scale-105'
                    : 'text-purple-200/70 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>



      {/* Bible Explorer & Reader Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Book & Chapter Selector Sidebar */}
        <aside className="lg:col-span-4 space-y-6 bg-[#1b1a1a] p-6 rounded-2xl border border-stone-800 shadow-2xs h-fit self-start">
          
          {/* Header & Testament Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-stone-900 dark:text-stone-100 uppercase tracking-[0.2em]">
              Books & Chapters
            </h3>

            {/* Testament Tab Pills */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-stone-200/50 dark:bg-stone-800/60 rounded-xl text-xs font-medium">
              <button
                onClick={() => setTestamentFilter('ALL')}
                className={`py-1.5 rounded-lg transition-all ${
                  testamentFilter === 'ALL'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                All (66)
              </button>
              <button
                onClick={() => setTestamentFilter('OT')}
                className={`py-1.5 rounded-lg transition-all ${
                  testamentFilter === 'OT'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                Old (39)
              </button>
              <button
                onClick={() => setTestamentFilter('NT')}
                className={`py-1.5 rounded-lg transition-all ${
                  testamentFilter === 'NT'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                New (27)
              </button>
            </div>

            {/* Book Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search Bible book..."
                value={bookSearchQuery}
                onChange={(e) => setBookSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-stone-900/20"
              />
            </div>
          </div>

          {/* Book Selection List */}
          <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredBooks.map((book) => {
              const isSelected = book.id === selectedBook.id;
              return (
                <button
                  key={book.id}
                  onClick={() => {
                    setSelectedBook(book);
                    setSelectedChapter(1);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-left transition-all ${
                    isSelected
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold shadow-2xs'
                      : 'hover:bg-stone-200/50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <span className="truncate">
                    {translation === 'TAM' && book.tamilName ? book.tamilName : book.name}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-stone-700 text-stone-100 dark:bg-stone-300 dark:text-stone-900'
                        : 'bg-stone-200/60 dark:bg-stone-800 text-stone-500'
                    }`}
                  >
                    {book.totalChapters} ch
                  </span>
                </button>
              );
            })}
          </div>

          {/* Chapter Grid */}
          <div className="space-y-2 pt-3 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                {translation === 'TAM' && selectedBook.tamilName ? selectedBook.tamilName : selectedBook.name} Chapters
              </span>
              <span>1 to {selectedBook.totalChapters}</span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 max-h-[430px] overflow-y-auto pr-1.5 custom-scrollbar">
              {Array.from({ length: selectedBook.totalChapters }, (_, i) => i + 1).map((ch) => {
                const isCurrent = ch === selectedChapter;
                return (
                  <button
                    key={ch}
                    onClick={() => setSelectedChapter(ch)}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-purple-600 text-white font-bold dark:bg-purple-500 shadow-xs'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Column: Main Scripture Reader */}
        <main id="bible-reader-main" className="lg:col-span-8 bg-[#1b1a1a] p-6 sm:p-10 rounded-2xl border border-stone-800 shadow-2xs space-y-6">
          
          {/* Reader Control Bar */}
          <div className="space-y-4 pb-4 border-b border-stone-200 dark:border-stone-800">
            {/* Top Navigation Row: Previous, Centered Title, Next */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handlePrevChapter}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full transition-colors cursor-pointer shrink-0"
                title="Previous Chapter"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous Chapter</span>
              </button>

              <div className="flex items-center justify-center space-x-2 text-center flex-1">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  {translation === 'TAM' && selectedBook.tamilName ? selectedBook.tamilName : selectedBook.name} {selectedChapter}
                </h2>
                {!loading && verses.length > 0 && (
                  <span className="hidden md:inline-block text-[11px] font-sans font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    {verses.length} Verses
                  </span>
                )}
              </div>

              <button
                onClick={handleNextChapter}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 rounded-full transition-colors shadow-2xs cursor-pointer shrink-0"
                title="Next Chapter"
              >
                <span>Next Chapter</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Controls: Version & Font Family (English only) / Font Size (All languages) */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {translation !== 'TAM' && (
                <>
                  {/* English Bible Version Segmented Control */}
                  <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-1 border border-stone-200 dark:border-stone-700 gap-0.5 h-8">
                    {[
                      { code: 'WEB', label: 'WEB', name: 'World English' },
                      { code: 'KJV', label: 'KJV', name: 'King James' },
                      { code: 'ASV', label: 'ASV', name: 'American Standard' },
                      { code: 'BBE', label: 'BBE', name: 'Basic English' },
                      { code: 'YLT', label: 'YLT', name: "Young's Literal" },
                      { code: 'DARBY', label: 'DARBY', name: 'Darby Translation' },
                      { code: 'OEB', label: 'OEB', name: 'Open English Bible' },
                    ].map((ver) => {
                      const isActive = translation === ver.code;
                      return (
                        <button
                          key={ver.code}
                          onClick={() => setTranslation(ver.code as BibleTranslation)}
                          className={`h-6 px-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                            isActive
                              ? 'bg-white dark:bg-stone-900 text-purple-600 dark:text-purple-400 font-bold shadow-xs'
                              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                          }`}
                          title={`${ver.label} - ${ver.name}`}
                        >
                          {ver.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Font Family Segmented Control */}
                  <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-1 border border-stone-200 dark:border-stone-700 gap-0.5 h-8">
                    {[
                      { code: 'serif', label: 'Serif' },
                      { code: 'sans', label: 'Sans' },
                    ].map((font) => {
                      const isActive = fontFamily === font.code;
                      return (
                        <button
                          key={font.code}
                          onClick={() => setFontFamily(font.code as 'serif' | 'sans')}
                          className={`h-6 px-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                            isActive
                              ? 'bg-white dark:bg-stone-900 text-purple-600 dark:text-purple-400 font-bold shadow-xs'
                              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                          }`}
                          title={`Font ${font.label}`}
                        >
                          {font.label}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Font Size Segmented Control (Available to all versions including Tamil) */}
              <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-1 border border-stone-200 dark:border-stone-700 gap-0.5 h-8">
                {[
                  { code: 'sm', label: 'SM' },
                  { code: 'base', label: 'MD' },
                  { code: 'lg', label: 'LG' },
                  { code: 'xl', label: 'XL' },
                ].map((sz) => {
                  const isActive = fontSize === sz.code;
                  return (
                    <button
                      key={sz.code}
                      onClick={() => setFontSize(sz.code as 'sm' | 'base' | 'lg' | 'xl')}
                      className={`h-6 px-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                        isActive
                          ? 'bg-white dark:bg-stone-900 text-purple-600 dark:text-purple-400 font-bold shadow-xs'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                      }`}
                      title={`Font size ${sz.label}`}
                    >
                      {sz.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reader Body / Verses Display */}
          {loading ? (
            <div className="py-8 space-y-5 animate-pulse">
              <div className="flex items-center space-x-3 text-stone-400 text-xs font-semibold">
                <div className="w-4 h-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                <span>Fetching {selectedBook.name} {selectedChapter} ({translation})...</span>
              </div>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-start space-x-3 p-3 bg-stone-100/50 dark:bg-stone-800/40 rounded-xl">
                  <div className="w-5 h-4 bg-stone-300 dark:bg-stone-700 rounded-sm" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-stone-300 dark:bg-stone-700 rounded-md w-11/12" />
                    <div className="h-4 bg-stone-300 dark:bg-stone-700 rounded-md w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`space-y-4 ${fontClasses} ${
                fontFamily === 'serif' ? 'font-serif' : 'font-sans'
              }`}
            >
              {verses.map((verse) => {
                const bookmarked = isVerseBookmarked(verse.number);
                const highlight = getVerseHighlight(verse.number);

                // Highlight colors map with blended single border and slightly thicker left side
                const highlightBg = highlight
                  ? {
                      purple: 'bg-purple-500/10 border border-l-2 border-purple-500/50 text-purple-100 font-medium',
                      sky: 'bg-sky-500/10 border border-l-2 border-sky-500/50 text-sky-100 font-medium',
                      rose: 'bg-rose-500/10 border border-l-2 border-rose-500/50 text-rose-100 font-medium',
                      yellow: 'bg-yellow-400/10 border border-l-2 border-yellow-400/60 text-yellow-100 font-medium',
                    }[highlight.color as 'purple' | 'sky' | 'rose' | 'yellow'] || ''
                  : '';

                return (
                  <div
                    key={verse.number}
                    id={`verse-${verse.number}`}
                    className={`group relative p-3 rounded-xl transition-all duration-300 ${
                      highlightedVerseNum === verse.number
                        ? 'ring-2 ring-amber-400/90 bg-amber-500/15 border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
                        : highlight
                        ? `${highlightBg} hover:brightness-110`
                        : 'border border-transparent hover:bg-stone-900/80 hover:border-stone-800/80'
                    }`}
                  >
                    {/* Quick Hover Action Toolbar - floating above the text */}
                    <div className="absolute right-3 -top-3.5 z-20 opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-all duration-150 bg-stone-900/95 backdrop-blur-md p-1 rounded-xl shadow-xl border border-stone-700 pointer-events-none group-hover:pointer-events-auto">
                      {/* Highlight Picker Dropdown/Colors */}
                      <div className="flex items-center space-x-1 px-1 border-r border-stone-700">
                        {(['purple', 'sky', 'rose', 'yellow'] as const).map((color) => {
                          const verseId = `${selectedBook.name}-${selectedChapter}-${verse.number}`;
                          const isCurrentColor = highlight?.color === color;
                          const colorBg = {
                            purple: 'bg-purple-400',
                            sky: 'bg-sky-400',
                            rose: 'bg-rose-400',
                            yellow: 'bg-yellow-300 ring-1 ring-yellow-400',
                          }[color];

                          return (
                            <button
                              key={color}
                              onClick={() => {
                                if (isCurrentColor && onRemoveHighlight) {
                                  onRemoveHighlight(verseId);
                                  showToast('Highlight removed');
                                } else {
                                  onAddHighlight(
                                    verseId,
                                    color,
                                    selectedBook.name,
                                    selectedChapter,
                                    verse.number,
                                    verse.text
                                  );
                                  showToast(`Highlighted in ${color}`);
                                }
                              }}
                              className={`w-3.5 h-3.5 rounded-full ${colorBg} hover:scale-125 transition-transform cursor-pointer ${
                                isCurrentColor ? 'ring-2 ring-white scale-110' : ''
                              }`}
                              title={isCurrentColor ? `Remove ${color === 'yellow' ? 'yellow' : color} highlight` : `Highlight ${color === 'yellow' ? 'yellow' : color}`}
                            />
                          );
                        })}

                        {highlight && onRemoveHighlight && (
                          <button
                            onClick={() => {
                              const verseId = `${selectedBook.name}-${selectedChapter}-${verse.number}`;
                              onRemoveHighlight(verseId);
                              showToast('Highlight removed');
                            }}
                            className="p-0.5 ml-0.5 text-stone-400 hover:text-rose-400 rounded transition-colors cursor-pointer"
                            title="Remove Highlight"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Bookmark Toggle */}
                      <button
                        onClick={() =>
                          onToggleBookmark({
                            bookName: selectedBook.name,
                            chapter: selectedChapter,
                            verseNumber: verse.number,
                            text: verse.text,
                          })
                        }
                        className={`p-1 rounded-md hover:bg-stone-800 transition-colors ${
                          bookmarked ? 'text-purple-400' : 'text-stone-400 hover:text-stone-200'
                        }`}
                        title={bookmarked ? 'Remove Bookmark' : 'Bookmark Verse'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 transition-colors ${bookmarked ? 'fill-purple-400 text-purple-400' : ''}`} />
                      </button>

                      {/* Copy Verse */}
                      <button
                        onClick={() => handleCopyVerse(verse.number, verse.text)}
                        className="p-1 text-stone-400 hover:text-stone-200 rounded-md hover:bg-stone-800 transition-colors"
                        title="Copy Verse"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-start space-x-3 w-full">
                      {/* Verse Number */}
                      <span className="font-sans text-xs font-bold text-purple-400 select-none pt-0.5 shrink-0 min-w-[22px]">
                        {verse.number}
                      </span>

                      {/* Verse Text - Full Width */}
                      <p className="w-full text-stone-200 leading-relaxed">
                        {verse.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Next / Previous Chapter Footer Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-stone-200 dark:border-stone-800 text-xs font-semibold">
            <button
              onClick={handlePrevChapter}
              className="flex items-center space-x-1.5 px-4 py-2 text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Chapter</span>
            </button>

            <span className="text-stone-500 dark:text-stone-400">
              {translation === 'TAM' && selectedBook.tamilName ? selectedBook.tamilName : selectedBook.name} {selectedChapter} : 1 - {verses.length}
            </span>

            <button
              onClick={handleNextChapter}
              className="flex items-center space-x-1.5 px-4 py-2 text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 rounded-full transition-colors shadow-2xs"
            >
              <span>Next Chapter</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      </div>

      {/* Presentation Modal Console */}
      <PresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        book={selectedBook}
        chapter={selectedChapter}
        verses={verses}
        translation={translation}
        secondaryVerses={secondaryVerses}
      />

    </div>
  );
};
