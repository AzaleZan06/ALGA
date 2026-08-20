import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bookmark, BookOpen, Music, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { BookmarkedVerse, WorshipSong } from '../types';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkedVerse[];
  onRemoveBookmark: (id: string) => void;
  favoriteSongs: WorshipSong[];
  onRemoveFavoriteSong?: (id: string) => void;
  onSelectSong: (song: WorshipSong) => void;
  onSelectBibleVerse: (bookName: string, chapter: number, verseNumber?: number) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onRemoveBookmark,
  favoriteSongs,
  onRemoveFavoriteSong,
  onSelectSong,
  onSelectBibleVerse,
}) => {
  const [activeTab, setActiveTab] = useState<'verses' | 'songs'>('verses');
  const windowRef = useRef<HTMLDivElement>(null);

  // Close on Escape key or outside click without blurring or masking the background
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handlePointerDownOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      // Do not close if clicking the toggle button in navbar
      if (target.closest('#btn-favorites-drawer')) {
        return;
      }
      if (windowRef.current && !windowRef.current.contains(target)) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDownOutside);
    document.addEventListener('touchstart', handlePointerDownOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDownOutside);
      document.removeEventListener('touchstart', handlePointerDownOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-x-3 top-20 sm:top-24 sm:inset-x-auto sm:right-6 lg:right-8 z-50 flex justify-end pointer-events-none">
          <motion.div
            ref={windowRef}
            initial={{ opacity: 0, y: -14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto w-full sm:w-[420px] max-h-[calc(100vh-6.5rem)] rounded-2xl sm:rounded-3xl backdrop-blur-3xl backdrop-saturate-150 bg-white/40 dark:bg-stone-950/40 border border-white/60 dark:border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.7)] dark:shadow-[0_25px_65px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col overflow-hidden text-stone-900 dark:text-stone-100 font-sans"
            role="dialog"
            aria-label="Favorites Floating Window"
          >
            {/* Floating Window Header Bar */}
            <div className="px-5 py-3.5 border-b border-white/20 dark:border-white/10 flex items-center justify-between bg-white/20 dark:bg-stone-950/30 backdrop-blur-md select-none">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-300 shadow-inner">
                  <Bookmark className="w-4 h-4 text-purple-300 fill-purple-300/20" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-medium tracking-wide text-stone-900 dark:text-white flex items-center gap-1.5">
                    <span>Saved Collection</span>
                  </h3>
                  <p className="text-[10px] text-purple-600 dark:text-purple-300/80 font-mono tracking-wider uppercase">
                    {bookmarks.length + favoriteSongs.length} items saved
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/10 transition-colors cursor-pointer active:scale-95"
                  title="Close Window"
                  aria-label="Close Window"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Segmented Control Tab Switcher */}
            <div className="p-3 border-b border-white/10 dark:border-white/5 bg-white/10 dark:bg-stone-950/20 backdrop-blur-xs">
              <div className="flex items-center p-1 bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-xl border border-white/40 dark:border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]">
                <button
                  onClick={() => setActiveTab('verses')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer ${
                    activeTab === 'verses'
                      ? 'bg-white text-stone-950 dark:bg-white dark:text-stone-950 shadow-[0_2px_8px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] font-bold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-white/20 dark:hover:bg-white/5'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Verses</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                      activeTab === 'verses'
                        ? 'bg-stone-900 text-stone-100 dark:bg-stone-900 dark:text-stone-100'
                        : 'bg-white/30 dark:bg-white/10 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {bookmarks.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('songs')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer ${
                    activeTab === 'songs'
                      ? 'bg-white text-stone-950 dark:bg-white dark:text-stone-950 shadow-[0_2px_8px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] font-bold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-white/20 dark:hover:bg-white/5'
                  }`}
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Songs</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                      activeTab === 'songs'
                        ? 'bg-stone-900 text-stone-100 dark:bg-stone-900 dark:text-stone-100'
                        : 'bg-white/30 dark:bg-white/10 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {favoriteSongs.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Floating Window Body Content */}
            <div className="p-4 overflow-y-auto flex-1 space-y-2.5 max-h-[380px] scrollbar-thin scrollbar-thumb-stone-700">
              {activeTab === 'verses' ? (
                bookmarks.length === 0 ? (
                  <div className="py-10 px-4 text-center flex flex-col items-center justify-center space-y-2 select-none">
                    <div className="w-11 h-11 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-1">
                      <BookOpen className="w-5 h-5 text-purple-300" />
                    </div>
                    <p className="text-xs font-medium text-stone-300">No saved Bible verses yet</p>
                    <p className="text-[11px] text-stone-500 max-w-[240px] leading-relaxed">
                      Tap the bookmark icon beside any verse while reading the Bible to pin it here.
                    </p>
                  </div>
                ) : (
                  bookmarks.map((bm) => (
                    <div
                      key={bm.id}
                      onClick={() => {
                        onSelectBibleVerse(bm.bookName, bm.chapter, bm.verseNumber);
                        onClose();
                      }}
                      className="p-3.5 bg-white/10 dark:bg-white/5 hover:bg-purple-500/15 dark:hover:bg-purple-950/30 rounded-xl border border-white/20 dark:border-white/10 hover:border-purple-400/40 dark:hover:border-purple-500/30 backdrop-blur-xs transition-all duration-150 space-y-2 group relative cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold tracking-wide text-purple-600 dark:text-purple-300 font-sans group-hover:text-purple-500 dark:group-hover:text-purple-200 transition-colors">
                            {bm.bookName} {bm.chapter}:{bm.verseNumber}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveBookmark(bm.id);
                          }}
                          className="text-stone-400 hover:text-rose-400 p-1 rounded-md hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Remove Bookmark"
                          aria-label={`Remove bookmark ${bm.bookName} ${bm.chapter}:${bm.verseNumber}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-stone-800 dark:text-stone-300 font-serif italic text-xs leading-relaxed line-clamp-3">
                        "{bm.text}"
                      </p>

                      <div className="pt-2 flex items-center justify-between border-t border-black/5 dark:border-white/5">
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-purple-600 dark:text-purple-300 group-hover:text-purple-500 dark:group-hover:text-purple-200 transition-colors">
                          <span className="leading-none">Open</span>
                          <ArrowRight className="w-3 h-3 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : favoriteSongs.length === 0 ? (
                <div className="py-10 px-4 text-center flex flex-col items-center justify-center space-y-2 select-none">
                  <div className="w-11 h-11 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-1">
                    <Music className="w-5 h-5 text-purple-300" />
                  </div>
                  <p className="text-xs font-medium text-stone-300">No favorite songs saved yet</p>
                  <p className="text-[11px] text-stone-500 max-w-[240px] leading-relaxed">
                    Tap the star or bookmark icon in the Songs section to keep quick access to your worship set.
                  </p>
                </div>
              ) : (
                favoriteSongs.map((song) => (
                  <div
                    key={song.id}
                    onClick={() => {
                      onSelectSong(song);
                      onClose();
                    }}
                    className="p-3 bg-white/10 dark:bg-white/5 hover:bg-purple-500/15 dark:hover:bg-purple-950/30 rounded-xl border border-white/20 dark:border-white/10 hover:border-purple-400/40 dark:hover:border-purple-500/30 backdrop-blur-xs transition-all duration-150 cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-0.5 min-w-0 pr-2 flex-1">
                      <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate group-hover:text-purple-500 dark:group-hover:text-purple-200 transition-colors">
                        {song.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate font-sans">
                        {song.artist || 'Traditional / ALGA'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 shrink-0">
                      {onRemoveFavoriteSong && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFavoriteSong(song.id);
                          }}
                          className="text-stone-400 hover:text-rose-400 p-1.5 rounded-md hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Remove from Favorites"
                          aria-label={`Remove ${song.title} from favorites`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <div className="w-6 h-6 rounded-full bg-white/10 dark:bg-white/5 group-hover:bg-purple-500/20 flex items-center justify-center text-stone-500 dark:text-stone-400 group-hover:text-purple-600 dark:group-hover:text-purple-200 transition-colors">
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Floating Window Footer Notice */}
            <div className="px-4 py-2.5 bg-white/20 dark:bg-stone-950/30 backdrop-blur-md border-t border-white/20 dark:border-white/10 flex items-center justify-between text-[10px] text-stone-600 dark:text-stone-400 select-none">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-purple-500 dark:text-purple-400" />
                <span>Synced locally</span>
              </span>
              <span className="font-mono text-purple-600 dark:text-purple-400/70 uppercase tracking-widest text-[9px]">
                ALGA Favorites
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

