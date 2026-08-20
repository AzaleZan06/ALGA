import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Monitor,
  ExternalLink,
  Maximize2,
  Sliders,
  Sparkles,
  Layers,
  Type,
  Sun,
  Moon,
  Tv,
  Check,
  Grid,
} from 'lucide-react';
import {
  PresentationState,
  PresentationSlide,
  PresentationTheme,
  PresentationFontSize,
  BibleVerse,
  BibleBook,
  BibleTranslation,
} from '../../types';
import { broadcastPresentationState, getStoredPresentationState } from '../../utils/presentationSync';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: BibleBook;
  chapter: number;
  verses: BibleVerse[];
  translation: BibleTranslation;
  secondaryVerses?: BibleVerse[];
}

export const PresentationModal: React.FC<PresentationModalProps> = ({
  isOpen,
  onClose,
  book,
  chapter,
  verses,
  translation,
  secondaryVerses,
}) => {
  if (!isOpen) return null;

  const isTamil = translation === 'TAM';
  const bookTitle = isTamil ? (book.tamilName || book.name) : book.name;

  // Build slides from verses
  const slides: PresentationSlide[] = verses.map((v) => {
    const secV = secondaryVerses?.find((sv) => sv.number === v.number);
    return {
      bookName: bookTitle,
      tamilBookName: isTamil ? book.tamilName : undefined,
      chapter,
      verseNumber: v.number,
      text: v.text,
      secondaryText: secV?.text,
    };
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [theme, setTheme] = useState<PresentationTheme>('cinematic');
  const [fontSize, setFontSize] = useState<PresentationFontSize>('xlarge');
  const [showSecondaryTranslation, setShowSecondaryTranslation] = useState<boolean>(
    Boolean(secondaryVerses && secondaryVerses.length > 0)
  );
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState<number>(8); // 8 seconds default
  const [secondaryWindowRef, setSecondaryWindowRef] = useState<Window | null>(null);
  const [activeTab, setActiveTab] = useState<'control' | 'slides' | 'settings'>('control');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load existing presentation state or initialize
  useEffect(() => {
    const existing = getStoredPresentationState();
    if (existing && existing.slides && existing.slides.length > 0) {
      setTheme(existing.theme || 'cinematic');
      setFontSize(existing.fontSize || 'xlarge');
    }
  }, []);

  // Broadcast state changes whenever any presentation parameter changes
  useEffect(() => {
    if (slides.length === 0) return;

    const state: PresentationState = {
      slides,
      currentIndex,
      theme,
      fontSize,
      showSecondaryTranslation,
      isAutoPlaying,
      autoPlayInterval,
      updatedAt: Date.now(),
    };

    broadcastPresentationState(state);
  }, [slides, currentIndex, theme, fontSize, showSecondaryTranslation, isAutoPlaying, autoPlayInterval]);

  // Slideshow Auto-advance logic
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (isAutoPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= slides.length - 1) {
            setIsAutoPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, autoPlayInterval * 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, autoPlayInterval, slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        setCurrentIndex((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, slides.length, onClose]);

  // Launch Secondary Pop-out Screen
  const handleOpenSecondaryScreen = () => {
    if (secondaryWindowRef && !secondaryWindowRef.closed) {
      secondaryWindowRef.focus();
      return;
    }

    const popup = window.open(
      `${window.location.origin}${window.location.pathname}?mode=presentation`,
      'BiblePresentationWindow',
      'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no'
    );

    if (popup) {
      setSecondaryWindowRef(popup);
    } else {
      alert('Pop-up window blocked. Please allow pop-ups for this site to open the secondary presentation window.');
    }
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 font-sans">
      <div className="relative w-full max-w-6xl h-[92vh] bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-100">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/60 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/15 text-purple-400 rounded-xl border border-purple-500/20">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2">
                <span>Presenter Console: {translation === 'TAM' && book.tamilName ? book.tamilName : book.name} {chapter}</span>
              </h3>
              <p className="text-xs text-stone-400">
                Live Verse Presentation & Secondary Screen Projection Deck
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Popout Secondary Screen Button */}
            <button
              onClick={handleOpenSecondaryScreen}
              className="flex items-center space-x-2 px-3.5 py-2 bg-purple-600 text-white hover:bg-purple-500 font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm active:scale-95"
              title="Open Projection View in Secondary Monitor"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Open 2nd Screen Window</span>
              <span className="sm:hidden">2nd Screen</span>
            </button>

            {/* Exit Presentation */}
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
              title="Close Presenter Mode"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Console Layout Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
          
          {/* Main Monitor Preview Screen (8 cols) */}
          <div className="lg:col-span-8 flex flex-col bg-black/40 border-b lg:border-b-0 lg:border-r border-stone-800 p-6 space-y-6 overflow-y-auto custom-scrollbar">
            
            {/* Live Stream / Monitor Frame */}
            <div className="relative flex-1 min-h-[320px] bg-stone-950 rounded-2xl border border-stone-800 p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-inner overflow-hidden">
              <div className="absolute top-3 left-4 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
                <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">Live Slide Preview</span>
              </div>

              <div className="absolute top-3 right-4 text-xs font-mono text-purple-300 font-bold bg-stone-900/80 px-2.5 py-1 rounded-md border border-stone-800">
                {currentIndex + 1} / {slides.length}
              </div>

              {/* Preview Verse Content */}
              {currentSlide && (
                <div className="space-y-4 max-w-2xl mx-auto">
                  <p className="font-serif text-2xl sm:text-3xl text-stone-100 leading-relaxed whitespace-pre-line">
                    "{currentSlide.text}"
                  </p>

                  {showSecondaryTranslation && currentSlide.secondaryText && (
                    <p className="font-sans text-sm sm:text-base text-stone-400 border-t border-stone-800/80 pt-3 whitespace-pre-line">
                      {currentSlide.secondaryText}
                    </p>
                  )}

                  <div className="pt-2">
                    <span className="inline-block font-sans text-xs font-bold uppercase tracking-widest text-stone-100 px-4 py-1.5 rounded-full border border-white/30 dark:border-white/20 bg-white/15 dark:bg-stone-950/40 backdrop-blur-3xl backdrop-saturate-150 shadow-[0_8px_25px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)]">
                      {currentSlide.bookName} {currentSlide.chapter}:{currentSlide.verseNumber}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Primary Navigation & Playback Controls */}
            <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800 flex flex-wrap items-center justify-between gap-4">
              
              {/* Prev / Next */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={currentIndex === 0}
                  className="flex items-center space-x-1 px-3.5 py-2 bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, slides.length - 1))}
                  disabled={currentIndex === slides.length - 1}
                  className="flex items-center space-x-1 px-3.5 py-2 bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-40 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Auto Play / Interval Controller */}
              <div className="flex items-center space-x-3 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800 text-xs">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    isAutoPlaying ? 'bg-purple-600 text-white' : 'bg-stone-800 text-stone-300 hover:text-white'
                  }`}
                >
                  {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isAutoPlaying ? 'Pause Slideshow' : 'Auto Play'}</span>
                </button>

                <div className="flex items-center space-x-1.5 text-stone-400">
                  <span>Timer:</span>
                  <select
                    value={autoPlayInterval}
                    onChange={(e) => setAutoPlayInterval(Number(e.target.value))}
                    className="bg-stone-800 text-stone-200 border border-stone-700 rounded-md px-2 py-0.5 text-xs focus:outline-none"
                  >
                    <option value={3}>3 sec</option>
                    <option value={5}>5 sec</option>
                    <option value={8}>8 sec</option>
                    <option value={10}>10 sec</option>
                    <option value={15}>15 sec</option>
                    <option value={20}>20 sec</option>
                    <option value={30}>30 sec</option>
                  </select>
                </div>
              </div>

              {/* Shortcuts hint */}
              <div className="hidden xl:flex items-center space-x-1 text-[11px] text-stone-500">
                <span>Nav Keys:</span>
                <kbd className="px-1.5 py-0.5 bg-stone-800 text-stone-300 rounded border border-stone-700 font-mono">←</kbd>
                <kbd className="px-1.5 py-0.5 bg-stone-800 text-stone-300 rounded border border-stone-700 font-mono">→</kbd>
                <kbd className="px-1.5 py-0.5 bg-stone-800 text-stone-300 rounded border border-stone-700 font-mono">Space</kbd>
              </div>

            </div>
          </div>

          {/* Presenter Side Panel: Verse List & Display Settings (4 cols) */}
          <div className="lg:col-span-4 flex flex-col bg-stone-900 border-t lg:border-t-0 border-stone-800 overflow-hidden">
            
            {/* Panel Tab Switcher */}
            <div className="flex border-b border-stone-800 bg-stone-950/40 p-2 gap-1">
              <button
                onClick={() => setActiveTab('slides')}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  activeTab === 'slides' ? 'bg-stone-800 text-purple-400 font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Verse Grid ({slides.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  activeTab === 'settings' ? 'bg-stone-800 text-purple-400 font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Screen Style</span>
              </button>
            </div>

            {/* Tab 1: Verse Jump Grid */}
            {activeTab === 'slides' && (
              <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400 pb-1">
                  <span>Click any verse to jump live:</span>
                  <span className="text-purple-400 font-mono">{currentIndex + 1} selected</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {slides.map((s, idx) => {
                    const isSelected = idx === currentIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-400 shadow-md scale-105'
                            : 'bg-stone-950 text-stone-300 border-stone-800 hover:bg-stone-800'
                        }`}
                      >
                        Verse {s.verseNumber}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-stone-800 space-y-2">
                  <span className="text-xs font-bold text-stone-300">Verse Directory:</span>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                    {slides.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start space-x-2 border ${
                          idx === currentIndex
                            ? 'bg-purple-500/10 border-purple-500/40 text-purple-300 font-medium'
                            : 'bg-stone-950/40 border-stone-800/60 text-stone-400 hover:bg-stone-800/60 hover:text-stone-200'
                        }`}
                      >
                        <span className="font-bold text-purple-400 text-[11px] shrink-0 w-6">v{s.verseNumber}</span>
                        <span className="line-clamp-2 text-stone-300 leading-snug">{s.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Display & Projection Styling */}
            {activeTab === 'settings' && (
              <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-6">
                
                {/* Theme Selector */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>Projection Screen Theme</span>
                  </label>

                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'cinematic', label: 'Cinematic Night', desc: 'Dark stone gradient with purple accents' },
                      { id: 'black', label: 'Pitch Black (OLED)', desc: '100% black for theater projectors' },
                      { id: 'midnight', label: 'Royal Midnight', desc: 'Deep navy blue for sanctuary screens' },
                      { id: 'parchment', label: 'Sanctuary Parchment', desc: 'Warm paper mode for daylight displays' },
                      { id: 'lower-third', label: 'Lower Thirds Overlay', desc: 'Bottom banner card for live streams' },
                    ].map((t) => {
                      const isActive = theme === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t.id as PresentationTheme)}
                          className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                            isActive
                              ? 'bg-purple-500/15 border-purple-500 text-purple-300 font-bold'
                              : 'bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-800'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-semibold">{t.label}</div>
                            <div className="text-[11px] text-stone-400 font-normal">{t.desc}</div>
                          </div>
                          {isActive && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Font Size Selector */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center space-x-1.5">
                    <Type className="w-3.5 h-3.5 text-purple-400" />
                    <span>Projection Font Scale</span>
                  </label>

                  <div className="grid grid-cols-5 gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
                    {[
                      { id: 'normal', label: 'S' },
                      { id: 'large', label: 'M' },
                      { id: 'xlarge', label: 'L' },
                      { id: 'giant', label: 'XL' },
                      { id: 'max', label: 'MAX' },
                    ].map((f) => {
                      const isActive = fontSize === f.id;
                      return (
                        <button
                          key={f.id}
                          onClick={() => setFontSize(f.id as PresentationFontSize)}
                          className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            isActive
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Secondary Subtitle Toggle */}
                {secondaryVerses && secondaryVerses.length > 0 && (
                  <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-stone-200">Show Dual Language Subtitle</div>
                      <div className="text-[11px] text-stone-400">Display secondary translation under primary verse</div>
                    </div>

                    <button
                      onClick={() => setShowSecondaryTranslation(!showSecondaryTranslation)}
                      className={`w-11 h-6 rounded-full transition-colors p-1 cursor-pointer ${
                        showSecondaryTranslation ? 'bg-purple-600' : 'bg-stone-800'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-stone-950 transition-transform ${
                          showSecondaryTranslation ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

        {/* Footer info strip */}
        <div className="px-6 py-3 bg-stone-950 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>Presentation Sync Active (Main + Pop-out 2nd Screen)</span>
          </span>
          <span className="hidden sm:inline">Press <kbd className="px-1 bg-stone-800 rounded text-stone-300">Esc</kbd> to leave presenter console</span>
        </div>

      </div>
    </div>
  );
};
