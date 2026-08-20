import React, { useState } from 'react';
import {
  Bookmark,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Calendar,
  BookOpen,
  Sun,
  RotateCcw,
  Quote,
} from 'lucide-react';
import { getDailyVerseForDate } from '../../data/dailyVerses';
import { BookmarkedVerse } from '../../types';

interface DailyVerseSectionProps {
  onSelectBibleVerse: (bookName: string, chapter: number) => void;
  onToggleBookmark: (verse: {
    bookName: string;
    chapter: number;
    verseNumber: number;
    text: string;
  }) => void;
  bookmarks: BookmarkedVerse[];
}

export const DailyVerseSection: React.FC<DailyVerseSectionProps> = ({
  onSelectBibleVerse,
  onToggleBookmark,
  bookmarks,
}) => {
  const [dayOffset, setDayOffset] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);

  const { verse, formattedDate, isToday } = getDailyVerseForDate(new Date(), dayOffset);

  const bookmarkId = `${verse.bookName}-${verse.chapter}-${verse.verseNumber}`;
  const isBookmarked = bookmarks.some((b) => b.id === bookmarkId);

  const handleCopy = () => {
    const text = `Verse of the Day (${formattedDate})\n${verse.reference}\n"${verse.text}"\n\n- ALGA Word & Worship`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Daily Verse: ${verse.reference}`,
        text: `"${verse.text}" — ${verse.reference}`,
      }).catch(() => {});
    } else {
      handleCopy();
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <section className="bg-gradient-to-br from-purple-950/20 via-stone-900 to-stone-950 p-6 sm:p-8 rounded-2xl border border-stone-800 shadow-sm relative overflow-hidden space-y-6" id="daily-verse-section">
      
      {/* Date Header & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/15 text-purple-400 rounded-xl">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-400">
                DAILY VERSE
              </span>
              {isToday && (
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20">
                  Today
                </span>
              )}
            </div>
            <h2 className="text-sm font-serif font-bold text-stone-100 flex items-center space-x-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>{formattedDate}</span>
            </h2>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center space-x-2">
          {dayOffset !== 0 && (
            <button
              onClick={() => setDayOffset(0)}
              className="px-2.5 py-1 text-xs font-semibold text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-lg border border-stone-700 transition-colors flex items-center space-x-1 cursor-pointer"
              title="Return to Today"
            >
              <RotateCcw className="w-3 h-3 text-purple-400" />
              <span>Today</span>
            </button>
          )}

          <div className="flex items-center bg-stone-800 rounded-lg p-0.5 border border-stone-700">
            <button
              onClick={() => setDayOffset((prev) => prev - 1)}
              className="p-1 text-stone-300 hover:text-white rounded transition-colors cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-stone-700 mx-1" />
            <button
              onClick={() => setDayOffset((prev) => prev + 1)}
              className="p-1 text-stone-300 hover:text-white rounded transition-colors cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Scripture & Theme */}
      <div className="space-y-4">
        <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-stone-800 text-stone-300 border border-stone-700">
          {verse.theme}
        </span>

        <div className="relative pl-4 border-l-3 border-purple-500 py-1">
          <Quote className="w-6 h-6 text-purple-400/20 absolute -top-2 -left-1 pointer-events-none" />
          <p className="text-xl sm:text-2xl font-serif font-light italic leading-relaxed text-stone-100">
            "{verse.text}"
          </p>
          <div className="mt-2 text-base font-serif font-bold text-purple-300">
            — {verse.reference}
          </div>
        </div>

        {verse.devotionalSummary && (
          <p className="text-sm text-stone-400 font-sans leading-relaxed pt-1">
            {verse.devotionalSummary}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-stone-800">
        <button
          onClick={() => onSelectBibleVerse(verse.bookName, verse.chapter)}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-purple-600 text-white hover:bg-purple-500 rounded-lg text-xs font-bold transition-colors cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Read {verse.bookName} {verse.chapter}</span>
        </button>

        <button
          onClick={() =>
            onToggleBookmark({
              bookName: verse.bookName,
              chapter: verse.chapter,
              verseNumber: verse.verseNumber,
              text: verse.text,
            })
          }
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
            isBookmarked
              ? 'bg-purple-600 text-white font-bold border-purple-500'
              : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 transition-colors ${isBookmarked ? 'fill-white text-white' : ''}`} />
          <span>{isBookmarked ? 'Saved' : 'Save'}</span>
        </button>

        <button
          onClick={handleCopy}
          className="p-1.5 text-stone-300 hover:text-white bg-stone-800 border border-stone-700 rounded-lg transition-colors cursor-pointer"
          title="Copy Verse"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-purple-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={handleShare}
          className="p-1.5 text-stone-300 hover:text-white bg-stone-800 border border-stone-700 rounded-lg transition-colors cursor-pointer"
          title="Share Verse"
        >
          {shared ? <Check className="w-3.5 h-3.5 text-purple-400" /> : <Share2 className="w-3.5 h-3.5" />}
        </button>
      </div>

    </section>
  );
};

