import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sliders, X, Radio } from 'lucide-react';
import { AmbientPadKey } from '../types';
import { padEngine } from '../utils/audioPad';

interface WorshipPadPlayerProps {
  isPadActive: boolean;
  onTogglePad: () => void;
}

export const WorshipPadPlayer: React.FC<WorshipPadPlayerProps> = ({
  isPadActive,
  onTogglePad,
}) => {
  const [activeKey, setActiveKey] = useState<AmbientPadKey>('G');
  const [volume, setVolume] = useState<number>(0.35);
  const [expanded, setExpanded] = useState<boolean>(false);

  const keys: AmbientPadKey[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  const handleKeySelect = (k: AmbientPadKey) => {
    setActiveKey(k);
    padEngine.setKey(k);
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    padEngine.setVolume(v);
  };

  if (!isPadActive) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 animate-fade-in" id="worship-pad-widget">
      <div className="backdrop-blur-3xl backdrop-saturate-150 bg-white/40 dark:bg-stone-950/40 text-stone-900 dark:text-white border border-white/60 dark:border-white/15 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.7)] dark:shadow-[0_25px_65px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] space-y-3 max-w-xs w-full">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
            </span>
            <span className="text-xs font-bold font-serif tracking-wide text-purple-600 dark:text-purple-300">
              Ambient Worship Pad
            </span>
          </div>

          <button
            onClick={onTogglePad}
            className="p-1 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-white/40 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title="Turn off Ambient Pad"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Key Picker Buttons */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Select Pad Key
          </span>
          <div className="grid grid-cols-7 gap-1">
            {keys.map((k) => (
              <button
                key={k}
                onClick={() => handleKeySelect(k)}
                className={`py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  activeKey === k
                    ? 'bg-purple-600 text-white shadow-xs scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center space-x-2 pt-1 border-t border-slate-800">
          <Volume2 className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer"
          />
        </div>

      </div>
    </div>
  );
};
