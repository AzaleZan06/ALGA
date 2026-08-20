import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Monitor } from 'lucide-react';
import { PresentationState, PresentationSlide } from '../../types';
import {
  subscribeToPresentationState,
  getStoredPresentationState,
  broadcastPresentationState,
  subscribeToWsStatus,
  broadcastScreenStatus,
} from '../../utils/presentationSync';

export const PresentationSecondaryWindow: React.FC = () => {
  const [state, setState] = useState<PresentationState | null>(() => getStoredPresentationState());
  const [localIsBlackout, setLocalIsBlackout] = useState<boolean>(false);

  // Broadcast screen open on mount, and screen closed on unload/unmount
  useEffect(() => {
    broadcastScreenStatus('opened');

    const handleBeforeUnload = () => {
      broadcastScreenStatus('closed');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      broadcastScreenStatus('closed');
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
    };
  }, []);

  // Track WebSocket connection status
  useEffect(() => {
    const unsub = subscribeToWsStatus(() => {});
    return () => unsub();
  }, []);

  // Subscribe to live presentation state changes
  useEffect(() => {
    const unsubscribe = subscribeToPresentationState(
      (newState) => {
        setState(newState);
      },
      { emitInitial: true }
    );

    const syncInterval = setInterval(() => {
      const stored = getStoredPresentationState();
      if (stored) {
        setState((prev) => {
          if (
            !prev ||
            prev.updatedAt !== stored.updatedAt ||
            prev.currentIndex !== stored.currentIndex ||
            prev.theme !== stored.theme ||
            prev.fontSize !== stored.fontSize ||
            prev.showSecondaryTranslation !== stored.showSecondaryTranslation ||
            prev.slides !== stored.slides ||
            prev.isPublished !== stored.isPublished ||
            prev.isBlack !== stored.isBlack ||
            prev.customBackground !== stored.customBackground
          ) {
            return stored;
          }
          return prev;
        });
      }
    }, 200);

    return () => {
      unsubscribe();
      clearInterval(syncInterval);
    };
  }, []);

  const hasActiveContent = !!(state?.slides && state.slides.length > 0);
  const activeSlides = hasActiveContent && state?.slides ? state.slides : [];
  const rawIndex = state && typeof state.currentIndex === 'number' ? state.currentIndex : 0;
  const currentIndex = activeSlides.length > 0 ? Math.min(Math.max(0, rawIndex), activeSlides.length - 1) : 0;
  const currentSlide: PresentationSlide | null = activeSlides.length > 0 ? activeSlides[currentIndex] || activeSlides[0] : null;

  const isBlackout = state?.isBlack ?? localIsBlackout;

  const showSecondaryTranslation = state?.showSecondaryTranslation ?? false;
  const activeThemeName = state?.theme || 'cinematic';

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const toggleBlackout = (val?: boolean) => {
    const nextVal = typeof val === 'boolean' ? val : !isBlackout;
    setLocalIsBlackout(nextVal);
    if (state) {
      const updated = { ...state, isBlack: nextVal, updatedAt: Date.now() };
      setState(updated);
      broadcastPresentationState(updated);
    }
  };

  const handlePrevSlide = () => {
    const nextIdx = Math.max(0, currentIndex - 1);
    if (state) {
      const updated = { ...state, currentIndex: nextIdx, isBlack: false, updatedAt: Date.now() };
      setState(updated);
      broadcastPresentationState(updated);
    }
  };

  const handleNextSlide = () => {
    const nextIdx = Math.min(activeSlides.length - 1, currentIndex + 1);
    if (state) {
      const updated = { ...state, currentIndex: nextIdx, isBlack: false, updatedAt: Date.now() };
      setState(updated);
      broadcastPresentationState(updated);
    }
  };

  const handleFirstSlide = () => {
    if (state) {
      const updated = { ...state, currentIndex: 0, isBlack: false, updatedAt: Date.now() };
      setState(updated);
      broadcastPresentationState(updated);
    }
  };

  const handleLastSlide = () => {
    if (state && activeSlides.length > 0) {
      const updated = { ...state, currentIndex: activeSlides.length - 1, isBlack: false, updatedAt: Date.now() };
      setState(updated);
      broadcastPresentationState(updated);
    }
  };

  // Comprehensive keyboard navigation shortcuts for external slidescreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const lowerKey = key.toLowerCase();

      // Blackout toggle
      if (lowerKey === 'b' || key === '.') {
        e.preventDefault();
        toggleBlackout();
      } 
      // Fullscreen toggle
      else if (lowerKey === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } 
      // Next slide shortcuts (ArrowRight, ArrowDown, Space, PageDown, Enter, 'n')
      else if (
        key === 'ArrowRight' ||
        key === 'ArrowDown' ||
        key === ' ' ||
        key === 'PageDown' ||
        key === 'Enter' ||
        lowerKey === 'n'
      ) {
        e.preventDefault();
        handleNextSlide();
      } 
      // Previous slide shortcuts (ArrowLeft, ArrowUp, PageUp, Backspace, 'p')
      else if (
        key === 'ArrowLeft' ||
        key === 'ArrowUp' ||
        key === 'PageUp' ||
        key === 'Backspace' ||
        lowerKey === 'p'
      ) {
        e.preventDefault();
        handlePrevSlide();
      } 
      // First slide (Home)
      else if (key === 'Home') {
        e.preventDefault();
        handleFirstSlide();
      }
      // Last slide (End)
      else if (key === 'End') {
        e.preventDefault();
        handleLastSlide();
      }
      // Escape
      else if (key === 'Escape' && isBlackout) {
        e.preventDefault();
        toggleBlackout(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, activeSlides.length, isBlackout, state]);

  // Auto-fit font size state (in pixels)
  const [autoFontSize, setAutoFontSize] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const minDim = Math.min(window.innerWidth, window.innerHeight);
      return Math.max(48, Math.floor(minDim * 0.12));
    }
    return 72;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const primaryTextRef = useRef<HTMLParagraphElement>(null);
  const secondaryTextRef = useRef<HTMLParagraphElement>(null);

  // Maximum screen-filling dynamic font calculation with instantaneous DOM measurement
  const updateOptimalFontSize = () => {
    const textWrapper = textWrapperRef.current;
    const primaryP = primaryTextRef.current;
    const secondaryP = secondaryTextRef.current;

    if (!currentSlide || !textWrapper || !primaryP) return;

    // Use full actual window viewport dimensions
    const winWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const winHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

    const hasBadge = currentSlide.chapter > 0;
    const availWidth = Math.max(200, Math.floor(winWidth * 0.94));
    // Allocate up to 78% of the screen height for scripture text (or 88% if no badge)
    const availHeight = Math.max(160, Math.floor(winHeight * (hasBadge ? 0.78 : 0.88)));

    if (availWidth <= 0 || availHeight <= 0) return;

    const hasSec = showSecondaryTranslation && !!currentSlide.secondaryText;
    const secRatio = 0.56;

    // Disable transition while computing to guarantee immediate layout feedback
    primaryP.style.transition = 'none';
    if (secondaryP) secondaryP.style.transition = 'none';

    // Binary search range for maximum possible font size that fills screen height
    let low = 20;
    let high = Math.min(320, Math.floor(availHeight * 0.95));
    let best = low;

    for (let i = 0; i < 16; i++) {
      if (low > high) break;
      const mid = Math.floor((low + high) / 2);

      primaryP.style.fontSize = `${mid}px`;
      primaryP.style.lineHeight = '1.25';
      if (hasSec && secondaryP) {
        secondaryP.style.fontSize = `${Math.max(16, Math.round(mid * secRatio))}px`;
        secondaryP.style.lineHeight = '1.25';
      }

      // Check if wrapper content fits within container height & screen width
      const wrapperHeight = Math.max(textWrapper.scrollHeight, textWrapper.clientHeight, textWrapper.offsetHeight);
      const overflowsHeight = wrapperHeight > availHeight;
      const overflowsWidth = primaryP.scrollWidth > (availWidth + 8);

      if (!overflowsHeight && !overflowsWidth) {
        best = mid;
        low = mid + 1; // It fits within screen height, try even larger!
      } else {
        high = mid - 1; // Too big, step down
      }
    }

    // Apply the absolute maximum fitted size
    primaryP.style.fontSize = `${best}px`;
    primaryP.style.lineHeight = '1.25';
    if (hasSec && secondaryP) {
      secondaryP.style.fontSize = `${Math.max(16, Math.round(best * secRatio))}px`;
      secondaryP.style.lineHeight = '1.25';
    }
    setAutoFontSize(best);
  };

  useLayoutEffect(() => {
    if (!currentSlide) return;
    updateOptimalFontSize();

    // Re-check across animation frames and font load to ensure instant crisp fit
    const raf1 = requestAnimationFrame(updateOptimalFontSize);
    const timer1 = setTimeout(updateOptimalFontSize, 40);
    const timer2 = setTimeout(updateOptimalFontSize, 150);

    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateOptimalFontSize).catch(() => {});
    }

    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      updateOptimalFontSize();
    });

    resizeObserver.observe(container);
    window.addEventListener('resize', updateOptimalFontSize);
    window.addEventListener('orientationchange', updateOptimalFontSize);

    return () => {
      cancelAnimationFrame(raf1);
      clearTimeout(timer1);
      clearTimeout(timer2);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateOptimalFontSize);
      window.removeEventListener('orientationchange', updateOptimalFontSize);
    };
  }, [
    currentSlide?.text,
    currentSlide?.secondaryText,
    showSecondaryTranslation,
    currentSlide?.fontFamily,
    currentSlide?.chapter,
    currentSlide?.verseNumber,
    currentSlide?.designStyle,
    state?.fontSize,
  ]);

  // Theme configuration with Apple Liquid Glass frosted aesthetics
  const themeStyles: Record<string, { bg: string; text: string; ref: string; border: string; secondary: string }> = {
    cinematic: {
      bg: 'bg-gradient-to-b from-stone-950 via-stone-900 to-black',
      text: 'text-stone-100',
      ref: 'text-stone-100 border border-white/30 dark:border-white/20 bg-white/15 dark:bg-stone-950/40 backdrop-blur-3xl backdrop-saturate-150 shadow-[0_10px_38px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)]',
      border: 'border-white/15',
      secondary: 'text-stone-300',
    },
    black: {
      bg: 'bg-black',
      text: 'text-white',
      ref: 'text-stone-100 border border-white/25 dark:border-white/20 bg-white/15 dark:bg-stone-950/40 backdrop-blur-3xl backdrop-saturate-150 shadow-[0_10px_38px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.35)]',
      border: 'border-stone-800',
      secondary: 'text-stone-400',
    },
    midnight: {
      bg: 'bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900',
      text: 'text-sky-50',
      ref: 'text-stone-100 border border-white/30 dark:border-white/20 bg-white/15 dark:bg-stone-950/40 backdrop-blur-3xl backdrop-saturate-150 shadow-[0_10px_38px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)]',
      border: 'border-sky-500/20',
      secondary: 'text-indigo-200',
    },
    parchment: {
      bg: 'bg-[#F7F3EB]',
      text: 'text-stone-900',
      ref: 'text-stone-900 border border-black/15 bg-black/5 backdrop-blur-3xl backdrop-saturate-150 shadow-[0_10px_38px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.8)]',
      border: 'border-stone-400/30',
      secondary: 'text-stone-700',
    },
    'lower-third': {
      bg: 'bg-stone-950/90 backdrop-blur-md',
      text: 'text-stone-100',
      ref: 'text-stone-100 border border-white/25 dark:border-white/20 bg-white/15 dark:bg-stone-950/40 backdrop-blur-3xl backdrop-saturate-150 shadow-[0_10px_38px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.35)]',
      border: 'border-stone-700',
      secondary: 'text-stone-300',
    },
  };

  const activeTheme = themeStyles[activeThemeName] || themeStyles.cinematic;

  const customBg = state?.customBackground;
  const isCustomBgImage = customBg?.type === 'image';
  const isCustomBgGradientOrColor = customBg?.type === 'gradient' || customBg?.type === 'color';

  const isVideo =
    !customBg &&
    !!currentSlide &&
    (currentSlide.mediaType === 'video' ||
      (currentSlide.mediaUrl &&
        (currentSlide.mediaUrl.startsWith('data:video') ||
          currentSlide.mediaUrl.endsWith('.mp4') ||
          currentSlide.mediaUrl.endsWith('.webm') ||
          currentSlide.mediaUrl.endsWith('.mov') ||
          currentSlide.mediaUrl.endsWith('.m4v'))));

  const imageUrl = isCustomBgImage
    ? customBg.value
    : currentSlide?.mediaUrl || (currentSlide?.bgType === 'image' ? currentSlide?.bgValue : undefined);

  const fontFamilyClass = {
    serif: 'font-serif',
    sans: 'font-sans font-medium',
    mono: 'font-mono',
    cursive: 'font-serif italic font-light',
    display: 'font-sans font-black tracking-tight',
  }[currentSlide?.fontFamily || 'serif'];

  const hasCustomBg = isCustomBgGradientOrColor || (!!currentSlide?.bgValue && currentSlide?.bgType !== 'image');
  const customBgStyle = isCustomBgGradientOrColor
    ? { background: customBg.value }
    : hasCustomBg && currentSlide?.bgValue
    ? { background: currentSlide.bgValue }
    : undefined;
  const hasSecondary = showSecondaryTranslation && !!currentSlide?.secondaryText;

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-black text-white font-sans">
      {/* Main Slide Presentation Stage or Blank/Standby State when No Content Selected or when Blanked (B key) */}
      {!hasActiveContent || !currentSlide || isBlackout ? (
        <div
          onClick={() => isBlackout && toggleBlackout(false)}
          className={`relative w-full h-full bg-[#0a0a0c] flex flex-col items-center justify-center space-y-5 p-8 select-none ${
            isBlackout ? 'cursor-pointer' : ''
          }`}
          title={isBlackout ? 'Screen Blanked (Click or press B to restore presentation)' : undefined}
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#18181b] border border-stone-800/80 flex items-center justify-center text-stone-300 shadow-2xl">
            <Monitor className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-stone-200" strokeWidth={1.75} />
          </div>
          <div className="space-y-2 text-center max-w-lg">
            <span className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wider uppercase text-stone-100 block font-sans">
              No Content Selected
            </span>
            <span className="text-xs sm:text-sm md:text-base text-stone-400 block leading-relaxed font-sans">
              Select a presentation slide, Bible verse, or song to preview and project
            </span>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full">
          {/* Background Layer */}
          <div
            className={`absolute inset-0 w-full h-full pointer-events-none transition-colors duration-500 ${
              !imageUrl && !isVideo && !hasCustomBg ? (currentSlide.chapter > 0 ? activeTheme.bg : 'bg-black') : 'bg-black'
            }`}
            style={customBgStyle}
          >
            {/* Background Video */}
            {isVideo && currentSlide.mediaUrl && (
              <video
                src={currentSlide.mediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}

            {/* Background Image */}
            {!isVideo && imageUrl && (
              <img
                src={imageUrl}
                alt={currentSlide.bookName || 'Background'}
                className={`absolute inset-0 w-full h-full ${isCustomBgImage ? 'object-cover' : 'object-contain'}`}
              />
            )}

            {/* Readability Overlay only when text is displayed */}
            {(isVideo || imageUrl) && (currentSlide.text || currentSlide.secondaryText) && (
              <div className="absolute inset-0 bg-black/55 backdrop-blur-[0.5px]" />
            )}
          </div>

          {/* Content Layer with Proportionate Viewport-Based Padding & Margins */}
          <div
            className={`relative z-10 w-full h-full flex flex-col justify-between items-center text-center px-[2vw] py-[2vh] sm:px-[3vw] sm:py-[2.5vh] transition-opacity duration-300 box-border ${fontFamilyClass}`}
          >
            {/* Top Region: Reference Header / Book Chapter Verse Badge (Only for Scripture Verses) */}
            <div className="w-full flex items-center justify-center min-h-[5vh] shrink-0 pt-2">
              {currentSlide.chapter > 0 && (
                <div
                  className={`inline-flex items-center space-x-3 px-7 py-2 sm:px-10 sm:py-2.5 rounded-full border shadow-2xl backdrop-blur-lg font-sans font-bold uppercase tracking-widest transition-all duration-300 animate-in fade-in slide-in-from-top-4 duration-300 ${
                    currentSlide.textColor ? '' : activeTheme.ref
                  }`}
                  style={{
                    fontSize: 'clamp(1.05rem, 2.2vmin, 1.65rem)',
                    ...(currentSlide.textColor ? { color: currentSlide.textColor } : {}),
                  }}
                >
                  <span>
                    {`${currentSlide.bookName} ${currentSlide.chapter}:${currentSlide.verseNumber}`}
                  </span>
                </div>
              )}
            </div>

            {/* Center Region: Max-Fitted Primary Scripture / Presentation Text */}
            <div
              ref={containerRef}
              className="flex-1 w-full max-w-[96vw] mx-auto flex flex-col justify-center items-center overflow-hidden py-2"
            >
              <div ref={textWrapperRef} className="w-full max-w-[94vw] mx-auto flex flex-col items-center justify-center space-y-4">
                <p
                  ref={primaryTextRef}
                  className="font-bold leading-[1.3] tracking-wide drop-shadow-2xl max-w-full break-words [overflow-wrap:anywhere] text-center whitespace-pre-line"
                  style={{
                    fontSize: `${autoFontSize}px`,
                    ...(currentSlide.textColor ? { color: currentSlide.textColor } : {}),
                  }}
                >
                  <span className={currentSlide.textColor ? '' : activeTheme.text}>
                    {currentSlide.designStyle === 'quote' ? `“${currentSlide.text}”` : currentSlide.text}
                  </span>
                </p>

                {/* Secondary Translation / Subtitle Lyrics with Even Separation */}
                {hasSecondary && (
                  <p
                    ref={secondaryTextRef}
                    className={`font-normal leading-snug tracking-normal opacity-90 border-t border-white/15 pt-3 mt-2 max-w-[92vw] mx-auto [overflow-wrap:anywhere] text-center whitespace-pre-line ${
                      currentSlide.textColor ? '' : activeTheme.secondary
                    }`}
                    style={{
                      fontSize: `${Math.max(16, Math.round(autoFontSize * 0.56))}px`,
                      ...(currentSlide.textColor ? { color: currentSlide.textColor } : {}),
                    }}
                  >
                    {currentSlide.secondaryText}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Region: Geometric Counterbalance */}
            <div className="w-full min-h-[3vh] shrink-0 pointer-events-none flex items-center justify-center" />
          </div>
        </div>
      )}
    </div>
  );
};
