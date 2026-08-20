import React, { useState } from 'react';
import {
  Music,
  Search,
  Plus,
  Bookmark,
  SlidersHorizontal,
  Tag,
  X,
  Volume2,
  Pencil,
} from 'lucide-react';
import { SongCategory, WorshipSong, AmbientPadKey } from '../../types';
import { SongDetailView } from './SongDetailView';

interface SongsSectionProps {
  songs: WorshipSong[];
  favorites: string[];
  onToggleFavorite: (songId: string) => void;
  onAddSong: (song: WorshipSong) => void;
  onUpdateSong?: (updatedSong: WorshipSong) => void;
  onPlayPadKey: (key: AmbientPadKey) => void;
  targetSong?: WorshipSong | null;
  onClearTargetSong?: () => void;
}

export const SongsSection: React.FC<SongsSectionProps> = ({
  songs,
  favorites,
  onToggleFavorite,
  onAddSong,
  onUpdateSong,
  onPlayPadKey,
  targetSong,
  onClearTargetSong,
}) => {
  const [selectedSong, setSelectedSong] = useState<WorshipSong | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Target song navigation from favorites / search
  React.useEffect(() => {
    if (targetSong) {
      setSelectedSong(targetSong);
      onClearTargetSong?.();
    }
  }, [targetSong, onClearTargetSong]);

  // Song Creator / Editor Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingSongId, setEditingSongId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newArtist, setNewArtist] = useState<string>('');
  const [newKey, setNewKey] = useState<string>('G');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Worship']);
  const [customCategoryInput, setCustomCategoryInput] = useState<string>('');
  const [newLyrics, setNewLyrics] = useState<string>('');

  const DEFAULT_CATEGORIES = ['Worship', 'Praise', 'Hymn', 'Acoustic', 'Devotional', 'Prayer', 'Gospel', 'English', 'Tamil'];
  const categories = ['ALL', 'Worship', 'Praise', 'Hymn', 'Acoustic', 'Devotional', 'Prayer', 'Gospel', 'English', 'Tamil'];

  const handleOpenAddModal = () => {
    setEditingSongId(null);
    setNewTitle('');
    setNewArtist('');
    setNewKey('G');
    setSelectedCategories(['Worship']);
    setCustomCategoryInput('');
    setNewLyrics('');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (song: WorshipSong) => {
    setEditingSongId(song.id);
    setNewTitle(song.title);
    setNewArtist(song.artist);
    setNewKey(song.originalKey || song.currentKey || 'G');
    const songTags = Array.from(new Set([song.category, ...(song.tags || [])])).filter(Boolean).slice(0, 3);
    setSelectedCategories(songTags.length > 0 ? songTags : ['Worship']);
    setCustomCategoryInput('');
    setNewLyrics(song.lyricsWithChords);
    setIsAddModalOpen(true);
  };

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else if (selectedCategories.length < 3) {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleAddCustomCategory = () => {
    const trimmed = customCategoryInput.trim();
    if (trimmed && !selectedCategories.includes(trimmed) && selectedCategories.length < 3) {
      setSelectedCategories([...selectedCategories, trimmed]);
      setCustomCategoryInput('');
    }
  };

  const handleCustomCategoryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddCustomCategory();
    }
  };

  const removeCategory = (cat: string) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== cat));
  };

  const filteredSongs = (() => {
    const list = songs.filter((s) => {
      const matchesCategory = categoryFilter === 'ALL' || s.category === categoryFilter || s.tags.includes(categoryFilter);
      const matchesSearch =
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
    const seen = new Set<string>();
    return list.filter((s) => {
      if (!s || !s.id || seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });
  })();

  const handleCreateSongSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newLyrics) return;

    const attachedTags = selectedCategories.slice(0, 3);
    const mainCategory = (attachedTags[0] as SongCategory) || 'Worship';

    if (editingSongId) {
      const updated: WorshipSong = {
        id: editingSongId,
        title: newTitle,
        artist: newArtist || 'Unknown Artist',
        originalKey: newKey,
        currentKey: newKey,
        category: mainCategory,
        tags: attachedTags.length > 0 ? attachedTags : ['Custom Song'],
        lyricsWithChords: newLyrics,
        custom: true,
      };

      if (onUpdateSong) {
        onUpdateSong(updated);
      } else {
        onAddSong(updated);
      }

      if (selectedSong && selectedSong.id === editingSongId) {
        setSelectedSong(updated);
      }
    } else {
      const created: WorshipSong = {
        id: `custom-user-${Date.now()}`,
        title: newTitle,
        artist: newArtist || 'Unknown Artist',
        originalKey: newKey,
        currentKey: newKey,
        category: mainCategory,
        tags: attachedTags.length > 0 ? attachedTags : ['Custom Song'],
        lyricsWithChords: newLyrics,
        custom: true,
      };

      onAddSong(created);
    }

    setIsAddModalOpen(false);
    setEditingSongId(null);
    setNewTitle('');
    setNewArtist('');
    setNewLyrics('');
    setSelectedCategories(['Worship']);
    setCustomCategoryInput('');
  };

  if (selectedSong) {
    return (
      <SongDetailView
        song={selectedSong}
        onBack={() => setSelectedSong(null)}
        onToggleFavorite={onToggleFavorite}
        isFavorite={favorites.includes(selectedSong.id)}
        onPlayPadKey={onPlayPadKey}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10" id="songs-section-container">
      
      {/* Editorial Header Banner */}
      <div className="relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-stone-950 via-fuchsia-950 to-purple-950 text-stone-100 p-8 sm:p-12 rounded-3xl shadow-2xl">
        {/* Vibrant multi-color ambient light splashes */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-fuchsia-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-pink-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Large faint background decorative number */}
        <div className="absolute right-4 bottom-0 -mb-10 text-[10rem] sm:text-[14rem] font-serif font-light text-white/[0.07] pointer-events-none select-none">
          02
        </div>

        <div className="relative z-10 space-y-4 max-w-2xl">
          <span className="text-[10px] uppercase tracking-[0.4em] bg-fuchsia-400/20 text-fuchsia-300 border border-fuchsia-400/30 px-3.5 py-1 rounded-full font-bold inline-block shadow-sm">
            02 • SONG LIBRARY
          </span>

          <h2 className="text-3xl sm:text-5xl font-serif font-light italic leading-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-100 via-pink-100 to-purple-200 drop-shadow-sm">
            Praise & Worship
          </h2>
        </div>

        {/* Header Actions */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-purple-500 hover:from-fuchsia-400 hover:to-purple-400 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-fuchsia-500/20 transition-all hover:scale-105 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Song</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by title, artist, or tag (e.g. Grace, Peace)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full focus:outline-hidden focus:ring-2 focus:ring-stone-900/20 shadow-2xs text-stone-900 dark:text-stone-100 placeholder-stone-400"
            />
          </div>

          {/* Total Count */}
          <span className="text-xs font-medium uppercase tracking-wider text-stone-400 self-center">
            {filteredSongs.length} of {songs.length} Songs
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-2xs font-bold'
                  : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Song Grid Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSongs.map((song) => {
          const isFav = favorites.includes(song.id);
          const songTags = Array.from(new Set([song.category, ...(song.tags || [])])).filter(Boolean).slice(0, 3);

          return (
            <div
              key={song.id}
              onClick={() => setSelectedSong(song)}
              className="group bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5 max-w-[75%]">
                    {songTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditModal(song);
                      }}
                      className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
                      title="Edit song"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(song.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors shrink-0 cursor-pointer"
                      title={isFav ? "Remove from saved" : "Save song"}
                    >
                      <Bookmark className={`w-4 h-4 transition-colors ${
                        isFav 
                          ? 'fill-purple-600 text-purple-600 dark:fill-purple-400 dark:text-purple-400' 
                          : 'text-stone-300 dark:text-stone-600 hover:text-stone-500 dark:hover:text-stone-400'
                      }`} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {song.title}
                </h3>

                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium tracking-wide">
                  {song.artist}
                </p>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal: Add/Edit Custom Song */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-[#F9F7F2] dark:bg-stone-900 border border-stone-300 dark:border-stone-800 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-xl w-full space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
              <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                {editingSongId ? 'Edit Worship Song' : 'Add Custom Worship Song'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSongSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Song Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Goodness of God"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Artist / Author
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bethel Music"
                    value={newArtist}
                    onChange={(e) => setNewArtist(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-stone-700 dark:text-stone-300">
                    Categories
                  </label>
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                    {selectedCategories.length}/3 selected
                  </span>
                </div>

                {/* Selected Category Pills Container */}
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl min-h-[42px] items-center">
                  {selectedCategories.length === 0 ? (
                    <span className="text-stone-400 text-xs italic px-1">Select or type categories below...</span>
                  ) : (
                    selectedCategories.map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-600 text-white dark:bg-purple-500 shadow-2xs"
                      >
                        <span>{cat}</span>
                        <button
                          type="button"
                          onClick={() => removeCategory(cat)}
                          className="hover:bg-purple-700 dark:hover:bg-purple-600 rounded-full p-0.5 transition-colors cursor-pointer"
                          title={`Remove ${cat}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Custom Category Input */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type custom category & press Enter..."
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    onKeyDown={handleCustomCategoryKeyDown}
                    className="flex-1 px-3.5 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:outline-hidden focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomCategory}
                    className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {/* Default Category Presets */}
                <div className="pt-1">
                  <span className="block text-[11px] font-medium text-stone-500 dark:text-stone-400 mb-1.5">
                    Default Categories
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {DEFAULT_CATEGORIES.map((cat) => {
                      const isSelected = selectedCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700 font-semibold shadow-2xs'
                              : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-750'
                          }`}
                        >
                          {isSelected ? `✓ ${cat}` : `+ ${cat}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Song Lyrics *
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder={`[Verse 1]\nGreat is the Lord and most worthy of praise\nIn the city of our God, his holy mountain.`}
                  value={newLyrics}
                  onChange={(e) => setNewLyrics(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-full font-semibold uppercase tracking-wider text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 rounded-full font-semibold uppercase tracking-wider text-[11px] shadow-md cursor-pointer"
                >
                  {editingSongId ? 'Save Changes' : 'Save Song'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
