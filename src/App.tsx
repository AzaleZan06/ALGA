import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { NavigationTab, BookmarkedVerse, HighlightedVerse, WorshipSong, AmbientPadKey } from './types';
import { INITIAL_SONGS } from './data/songsData';
import { BIBLE_BOOKS } from './data/bibleData';
import { Navbar } from './components/Navbar';
import { BibleSection } from './components/Bible/BibleSection';
import { SongsSection } from './components/Songs/SongsSection';
import { LivePresentationSection } from './components/Presentation/LivePresentationSection';
import { QuickSearchModal } from './components/QuickSearchModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { WorshipPadPlayer } from './components/WorshipPadPlayer';
import { PresentationSecondaryWindow } from './components/Bible/PresentationSecondaryWindow';
import { padEngine } from './utils/audioPad';

export default function App() {
  // Check if URL specifies secondary presentation window mode
  const isPresentationWindowMode = typeof window !== 'undefined' && (
    window.location.search.includes('mode=presentation') ||
    window.location.search.includes('mode=projection')
  );

  if (isPresentationWindowMode) {
    return <PresentationSecondaryWindow />;
  }

  const [activeTab, setActiveTab] = useState<NavigationTab>('bible');

  // Local Storage state for Bookmarks
  const [bookmarks, setBookmarks] = useState<BookmarkedVerse[]>(() => {
    try {
      const saved = localStorage.getItem('alga_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Local Storage state for Highlights
  const [highlights, setHighlights] = useState<HighlightedVerse[]>(() => {
    try {
      const saved = localStorage.getItem('alga_highlights');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Local Storage state for Songs
  const [songs, setSongs] = useState<WorshipSong[]>(() => {
    try {
      const saved = localStorage.getItem('alga_custom_songs');
      const cleanSongLyrics = (s: WorshipSong): WorshipSong => ({
        ...s,
        lyricsWithChords: s.lyricsWithChords ? s.lyricsWithChords.replace(/\[[^\]]*\]/g, (match) => {
          if (
            match.startsWith('[Verse') ||
            match.startsWith('[Chorus') ||
            match.startsWith('[Bridge') ||
            match.startsWith('[Intro') ||
            match.startsWith('[Outro') ||
            match.startsWith('[Refrain')
          ) {
            return match;
          }
          return '';
        }) : '',
      });
      const parsed = saved ? (JSON.parse(saved) as WorshipSong[]).map(cleanSongLyrics) : [];
      const all = [...INITIAL_SONGS, ...parsed];
      const seen = new Set<string>();
      return all.filter((s) => {
        if (!s || !s.id || seen.has(s.id)) return false;
        seen.add(s.id);
        return true;
      });
    } catch {
      return INITIAL_SONGS;
    }
  });

  // Local Storage state for Favorite Songs
  const [favoriteSongIds, setFavoriteSongIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('alga_favorite_songs');
      return saved ? JSON.parse(saved) : ['song-1', 'song-2'];
    } catch {
      return ['song-1', 'song-2'];
    }
  });

  // Modals & Floating Widgets State
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState<boolean>(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);

  // Floating Scroll to Top button state
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
  };

  // Ensure Dark Mode is permanently active
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Worship Pad Engine state
  const [isPadActive, setIsPadActive] = useState<boolean>(false);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('alga_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem('alga_highlights', JSON.stringify(highlights));
    } catch (e) {
      console.error(e);
    }
  }, [highlights]);

  useEffect(() => {
    try {
      localStorage.setItem('alga_favorite_songs', JSON.stringify(favoriteSongIds));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteSongIds]);

  // Handlers for Bible Bookmarking & Highlighting
  const handleToggleBookmark = (v: { bookName: string; chapter: number; verseNumber: number; text: string }) => {
    const id = `${v.bookName}-${v.chapter}-${v.verseNumber}`;
    setBookmarks((prev) => {
      const exists = prev.some((bm) => bm.id === id);
      if (exists) {
        return prev.filter((bm) => bm.id !== id);
      }
      return [
        {
          id,
          bookName: v.bookName,
          chapter: v.chapter,
          verseNumber: v.verseNumber,
          text: v.text,
          timestamp: Date.now(),
        },
        ...prev,
      ];
    });
  };

  const handleAddHighlight = (
    id: string,
    color: 'purple' | 'sky' | 'rose' | 'yellow',
    bookName: string,
    chapter: number,
    verseNumber: number,
    text: string
  ) => {
    setHighlights((prev) => {
      const filtered = prev.filter((h) => h.id !== id);
      return [{ id, color, bookName, chapter, verseNumber, text, timestamp: Date.now() }, ...filtered];
    });
  };

  const handleRemoveHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  // Handlers for Worship Songs
  const handleToggleFavoriteSong = (songId: string) => {
    setFavoriteSongIds((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  };

  const handleAddCustomSong = (newSong: WorshipSong) => {
    setSongs((prev) => [newSong, ...prev]);
    // Save custom songs
    try {
      const existingCustoms = JSON.parse(localStorage.getItem('alga_custom_songs') || '[]');
      localStorage.setItem('alga_custom_songs', JSON.stringify([newSong, ...existingCustoms]));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateCustomSong = (updatedSong: WorshipSong) => {
    setSongs((prev) => prev.map((s) => (s.id === updatedSong.id ? updatedSong : s)));
    try {
      const existingCustoms: WorshipSong[] = JSON.parse(localStorage.getItem('alga_custom_songs') || '[]');
      const exists = existingCustoms.some((s) => s.id === updatedSong.id);
      let updatedCustoms: WorshipSong[];
      if (exists) {
        updatedCustoms = existingCustoms.map((s) => (s.id === updatedSong.id ? updatedSong : s));
      } else {
        updatedCustoms = [updatedSong, ...existingCustoms];
      }
      localStorage.setItem('alga_custom_songs', JSON.stringify(updatedCustoms));
    } catch (e) {
      console.error(e);
    }
  };

  // Handler for Ambient Worship Pad Toggle
  const handleTogglePad = () => {
    if (isPadActive) {
      padEngine.stop();
      setIsPadActive(false);
    } else {
      padEngine.play('G');
      setIsPadActive(true);
    }
  };

  const handlePlayPadKey = (key: AmbientPadKey) => {
    padEngine.play(key);
    setIsPadActive(true);
  };

  // Selected navigation targets from favorites/search
  const [targetBibleNav, setTargetBibleNav] = useState<{
    bookName: string;
    chapter: number;
    verseNumber?: number;
  } | null>(null);
  const [targetSong, setTargetSong] = useState<WorshipSong | null>(null);

  const handleSelectBibleVerse = (bookName: string, chapter: number, verseNumber?: number) => {
    setTargetBibleNav({ bookName, chapter, verseNumber });
    setActiveTab('bible');
    setIsFavoritesOpen(false);
  };

  const handleSelectSong = (song: WorshipSong) => {
    setTargetSong(song);
    setActiveTab('songs');
    setIsFavoritesOpen(false);
  };

  const favoriteSongsList = songs.filter((s) => favoriteSongIds.includes(s.id));

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-100">
      
      {/* Translucent Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickSearch={() => setIsQuickSearchOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen((prev) => !prev)}
        isFavoritesOpen={isFavoritesOpen}
        isPadActive={isPadActive}
        onTogglePad={handleTogglePad}
        bookmarkCount={bookmarks.length + favoriteSongIds.length}
      />

      {/* Main Section Content */}
      <main className="flex-1">
        {activeTab === 'bible' && (
          <BibleSection
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            highlights={highlights}
            onAddHighlight={handleAddHighlight}
            onRemoveHighlight={handleRemoveHighlight}
            targetNavigation={targetBibleNav}
            onClearTargetNavigation={() => setTargetBibleNav(null)}
          />
        )}

        {activeTab === 'songs' && (
          <SongsSection
            songs={songs}
            favorites={favoriteSongIds}
            onToggleFavorite={handleToggleFavoriteSong}
            onAddSong={handleAddCustomSong}
            onUpdateSong={handleUpdateCustomSong}
            onPlayPadKey={handlePlayPadKey}
            targetSong={targetSong}
            onClearTargetSong={() => setTargetSong(null)}
          />
        )}

        {activeTab === 'presentation' && (
          <LivePresentationSection songs={songs} />
        )}
      </main>

      {/* Global Quick Search Modal */}
      <QuickSearchModal
        isOpen={isQuickSearchOpen}
        onClose={() => setIsQuickSearchOpen(false)}
        songs={songs}
        onSelectBibleVerse={(bookName, chapter, verseNumber) => {
          handleSelectBibleVerse(bookName, chapter, verseNumber);
        }}
        onSelectSong={(song) => {
          handleSelectSong(song);
        }}
      />

      {/* Saved Favorites Floating Window */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        bookmarks={bookmarks}
        onRemoveBookmark={(id) => setBookmarks((prev) => prev.filter((b) => b.id !== id))}
        favoriteSongs={favoriteSongsList}
        onRemoveFavoriteSong={handleToggleFavoriteSong}
        onSelectSong={handleSelectSong}
        onSelectBibleVerse={handleSelectBibleVerse}
      />

      {/* Floating Ambient Worship Pad Widget */}
      <WorshipPadPlayer
        isPadActive={isPadActive}
        onTogglePad={handleTogglePad}
      />

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          id="scroll-to-top-button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-1.5 px-4 py-2.5 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer font-sans font-medium text-xs border border-stone-700/20 active:scale-95"
          title="Scroll to Top"
        >
          <span>Top</span>
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Editorial Footer */}
      <footer className="mt-16 py-8 px-6 sm:px-12 border-t border-stone-200/80 dark:border-stone-800/80 bg-[#F9F7F2]/60 dark:bg-stone-950/60 backdrop-blur-xs text-center">
        <div className="max-w-7xl mx-auto flex justify-center items-center text-[10px] uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
          <div>&copy; {new Date().getFullYear()} ALGA</div>
        </div>
      </footer>
    </div>
  );
}

