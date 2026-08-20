import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Music, X, ChevronRight } from 'lucide-react';
import { BIBLE_BOOKS, CURATED_CHAPTERS } from '../data/bibleData';
import { WorshipSong, NavigationTab } from '../types';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  songs: WorshipSong[];
  onSelectBibleVerse: (bookName: string, chapter: number, verseNumber?: number) => void;
  onSelectSong: (song: WorshipSong) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  songs,
  onSelectBibleVerse,
  onSelectSong,
}) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter Bible books
  const matchingBooks = BIBLE_BOOKS.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  // Filter Songs
  const matchingSongs = songs
    .filter(
      (s) =>
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.artist.toLowerCase().includes(query.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
    )
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-md">
      <div
        className="backdrop-blur-3xl backdrop-saturate-150 bg-white/70 dark:bg-stone-950/70 border border-white/60 dark:border-white/15 w-full max-w-xl rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.7)] dark:shadow-[0_25px_65px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        id="quick-search-modal"
      >
        {/* Input Bar */}
        <div className="relative p-4 border-b border-black/5 dark:border-white/10 flex items-center bg-white/20 dark:bg-stone-950/20 backdrop-blur-md">
          <Search className="w-5 h-5 text-purple-500 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search Bible books, verses, or worship songs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm bg-transparent border-none outline-hidden text-stone-900 dark:text-white placeholder-stone-400"
          />
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-white rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 space-y-6 max-h-96 overflow-y-auto text-xs">
          {!query.trim() ? (
            <div className="text-center py-8 text-slate-400 space-y-2">
              <p className="font-semibold text-slate-600 dark:text-slate-300">
                Type to search Bible books or Worship songs
              </p>
              <p className="text-[11px]">e.g. "John", "Psalm 23", "How Great Is Our God", "Grace"</p>
            </div>
          ) : (
            <>
              {/* Bible Results */}
              {matchingBooks.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                    <span>Holy Bible Books</span>
                  </div>
                  <div className="space-y-1">
                    {matchingBooks.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          onSelectBibleVerse(b.name, 1);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-left transition-colors"
                      >
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">{b.name}</span>
                          <span className="text-[10px] text-slate-400 ml-2">({b.testament === 'OT' ? 'Old Testament' : 'New Testament'})</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Worship Songs Results */}
              {matchingSongs.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    <Music className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Worship Songs</span>
                  </div>
                  <div className="space-y-1">
                    {matchingSongs.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          onSelectSong(s);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-left transition-colors"
                      >
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">{s.title}</span>
                          <span className="text-[10px] text-slate-400 ml-2">By {s.artist}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchingBooks.length === 0 && matchingSongs.length === 0 && (
                <div className="text-center py-6 text-slate-400">
                  No matching Bible books or worship songs found.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
