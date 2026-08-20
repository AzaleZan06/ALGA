import React, { useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Copy,
  Check,
} from 'lucide-react';
import { WorshipSong, AmbientPadKey } from '../../types';

interface SongDetailViewProps {
  song: WorshipSong;
  onBack: () => void;
  onToggleFavorite: (songId: string) => void;
  isFavorite: boolean;
  onPlayPadKey?: (key: AmbientPadKey) => void;
}

export const SongDetailView: React.FC<SongDetailViewProps> = ({
  song,
  onBack,
  onToggleFavorite,
  isFavorite,
  onPlayPadKey,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const cleanLyricsText = song.lyricsWithChords.replace(/\[[^\]]*\]/g, (match) => {
    // Keep section headers like [Verse 1], [Chorus], [Bridge]
    if (
      match.startsWith('[Verse') ||
      match.startsWith('[Chorus') ||
      match.startsWith('[Bridge') ||
      match.startsWith('[Intro') ||
      match.startsWith('[Outro')
    ) {
      return match;
    }
    return '';
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(`${song.title} - ${song.artist}\n\n${cleanLyricsText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render formatted song lines
  const renderFormattedSong = () => {
    const lines = cleanLyricsText.split('\n');

    return lines.map((line, idx) => {
      const trimmed = line.trim();
      // Check if header line like [Chorus], [Verse 1], [Bridge]
      if (
        trimmed.startsWith('[Verse') ||
        trimmed.startsWith('[Chorus') ||
        trimmed.startsWith('[Bridge') ||
        trimmed.startsWith('[Intro') ||
        trimmed.startsWith('[Outro')
      ) {
        return (
          <div
            key={idx}
            className="pt-4 pb-1 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 font-sans"
          >
            {trimmed.replace('[', '').replace(']', '')}
          </div>
        );
      }

      if (!trimmed) {
        return <div key={idx} className="h-3" />;
      }

      return (
        <p key={idx} className="text-base text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6" id="song-detail-container">
      
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200/60 dark:border-slate-700/60"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Songs</span>
        </button>

        <div className="flex items-center space-x-2">
          {/* Favorite Toggle */}
          <button
            onClick={() => onToggleFavorite(song.id)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isFavorite
                ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-purple-600 dark:fill-purple-400 text-purple-600 dark:text-purple-400' : ''}`} />
            <span>{isFavorite ? 'Saved' : 'Save'}</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-purple-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Song Metadata Card */}
      <div className="bg-gradient-to-r from-indigo-900/10 via-slate-900/5 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-6">
        <div>
          {/* Song Tags (Up to 3) */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {Array.from(new Set([song.category, ...(song.tags || [])])).filter(Boolean).slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] uppercase tracking-widest font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white">
            {song.title}
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            By {song.artist}
          </p>

          {song.scriptureRef && (
            <div className="mt-2 text-xs font-serif italic text-purple-600 dark:text-purple-400">
              Scripture Connection: {song.scriptureRef}
            </div>
          )}
        </div>
      </div>

      {/* Main Song Sheet Reader Container */}
      <div
        className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
      >
        {renderFormattedSong()}
      </div>

    </div>
  );
};
