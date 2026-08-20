import React from 'react';
import { BookOpen, Music, Search, Bookmark, Tv } from 'lucide-react';
import { NavigationTab } from '../types';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onOpenQuickSearch: () => void;
  onOpenFavorites: () => void;
  isFavoritesOpen?: boolean;
  isPadActive?: boolean;
  onTogglePad?: () => void;
  bookmarkCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickSearch,
  onOpenFavorites,
  isFavoritesOpen = false,
  bookmarkCount,
}) => {
  return (
    <header className="sticky top-3 sm:top-4 z-40 w-full px-3 sm:px-6 lg:px-8 transition-all duration-300 mb-2">
      <div className="max-w-7xl mx-auto rounded-2xl sm:rounded-3xl backdrop-blur-3xl backdrop-saturate-150 bg-white/35 dark:bg-stone-950/35 border border-white/60 dark:border-white/15 shadow-[0_10px_38px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.7)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)] px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Brand */}
          <div className="flex items-center">
            <button
              onClick={() => setActiveTab('bible')}
              className="flex items-center space-x-3 text-left group focus:outline-hidden"
              id="alga-brand-logo"
            >
              <div className="w-10 h-10 rounded-full bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center font-serif text-lg font-light tracking-widest group-hover:scale-105 transition-transform shadow-md">
                A
              </div>
              <div>
                <span className="text-2xl font-serif tracking-[0.3em] font-light uppercase text-stone-900 dark:text-stone-100 drop-shadow-xs">
                  ALGA
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Sections Centered */}
          <nav className="hidden md:flex items-center space-x-1.5 p-1.5 bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-full border border-white/50 dark:border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] absolute left-1/2 -translate-x-1/2">
            <button
              onClick={() => setActiveTab('bible')}
              id="nav-tab-bible"
              className={`flex items-center space-x-2 px-5 py-2 rounded-full text-xs uppercase tracking-widest font-bold transition-all duration-200 ${
                activeTab === 'bible'
                  ? 'bg-white text-stone-950 dark:bg-white dark:text-stone-950 shadow-[0_4px_16px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] scale-102'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-white/30 dark:hover:bg-white/10 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Bible</span>
            </button>

            <button
              onClick={() => setActiveTab('songs')}
              id="nav-tab-songs"
              className={`flex items-center space-x-2 px-5 py-2 rounded-full text-xs uppercase tracking-widest font-bold transition-all duration-200 ${
                activeTab === 'songs'
                  ? 'bg-white text-stone-950 dark:bg-white dark:text-stone-950 shadow-[0_4px_16px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] scale-102'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-white/30 dark:hover:bg-white/10 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Songs</span>
            </button>

            <button
              onClick={() => setActiveTab('presentation')}
              id="nav-tab-presentation"
              className={`flex items-center space-x-2 px-5 py-2 rounded-full text-xs uppercase tracking-widest font-bold transition-all duration-200 ${
                activeTab === 'presentation'
                  ? 'bg-white text-stone-950 dark:bg-white dark:text-stone-950 shadow-[0_4px_16px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] scale-102'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-white/30 dark:hover:bg-white/10 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Live Presentation</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Favorites Floating Menu Toggle Button */}
            <button
              onClick={onOpenFavorites}
              id="btn-favorites-drawer"
              className={`relative p-2.5 rounded-full transition-all duration-200 cursor-pointer backdrop-blur-md active:scale-95 ${
                isFavoritesOpen
                  ? 'bg-white text-stone-950 border border-white shadow-[0_0_20px_rgba(255,255,255,0.25)]'
                  : 'text-stone-800 dark:text-stone-200 bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 border border-white/60 dark:border-white/15 shadow-xs'
              }`}
              title={isFavoritesOpen ? 'Close Saved Collection' : 'Open Saved Collection'}
              aria-expanded={isFavoritesOpen}
              aria-haspopup="dialog"
            >
              <Bookmark
                className={`w-4 h-4 transition-transform duration-200 ${
                  isFavoritesOpen ? 'fill-stone-950 text-stone-950 scale-105' : 'text-stone-800 dark:text-stone-200'
                }`}
              />
              {bookmarkCount > 0 && (
                <span
                  id="navbar-favorites-badge"
                  className="absolute -top-1 -right-1 text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md bg-purple-600 text-white border border-purple-400/30 transition-colors"
                >
                  {bookmarkCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="md:hidden flex border-t border-white/30 dark:border-white/10 py-2.5 justify-center space-x-3">
          <button
            onClick={() => setActiveTab('bible')}
            className={`flex items-center space-x-2 px-6 py-2 rounded-full text-xs uppercase tracking-widest font-semibold transition-all ${
              activeTab === 'bible'
                ? 'bg-white text-stone-950 dark:bg-white dark:text-stone-950 font-bold shadow-md'
                : 'text-stone-700 dark:text-stone-300 bg-white/30 dark:bg-white/10'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bible</span>
          </button>
          <button
            onClick={() => setActiveTab('songs')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs uppercase tracking-widest font-semibold transition-all ${
              activeTab === 'songs'
                ? 'bg-white text-stone-950 dark:bg-white dark:text-stone-950 font-bold shadow-md'
                : 'text-stone-700 dark:text-stone-300 bg-white/30 dark:bg-white/10'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Songs</span>
          </button>
          <button
            onClick={() => setActiveTab('presentation')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs uppercase tracking-widest font-semibold transition-all ${
              activeTab === 'presentation'
                ? 'bg-white text-stone-950 dark:bg-white dark:text-stone-950 font-bold shadow-md'
                : 'text-stone-700 dark:text-stone-300 bg-white/30 dark:bg-white/10'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Live Present</span>
          </button>
        </div>

      </div>
    </header>
  );
};

