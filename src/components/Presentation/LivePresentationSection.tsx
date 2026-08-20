import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BookOpen,
  Music,
  Search,
  Tv,
  Check,
  Play,
  Sliders,
  Layers,
  Type,
  Radio,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Filter,
  Eye,
  EyeOff,
  RefreshCw,
  List,
  Layers3,
  Square,
  Monitor,
  Palette,
  Image as ImageIcon,
  FolderPlus,
  FolderInput,
  Bookmark,
  Trash2,
  Plus,
  Save,
  Layout,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Wand2,
  Link as LinkIcon,
  Copy,
  Video,
  Upload,
  Edit3,
  Moon,
  X,
} from 'lucide-react';
import {
  BIBLE_BOOKS,
  fetchChapterVerses,
} from '../../data/bibleData';
import {
  WorshipSong,
  BibleBook,
  BibleVerse,
  BibleTranslation,
  PresentationSlide,
  PresentationTheme,
  PresentationFontSize,
  PresentationState,
  DefaultSlidePreset,
} from '../../types';
import {
  broadcastPresentationState,
  subscribeToPresentationState,
  subscribeToWsStatus,
  subscribeToScreenStatus,
  broadcastScreenStatus,
} from '../../utils/presentationSync';
import {
  saveSlidesToStorage,
  loadSlidesFromStorage,
  optimizeImageForSlide,
} from '../../utils/slideStorage';

interface LivePresentationSectionProps {
  songs: WorshipSong[];
}

export interface CustomBackgroundConfig {
  type: 'gradient' | 'image' | 'color';
  value: string;
  name?: string;
}

const GRADIENT_PRESETS: { name: string; value: string; cssPreview: string }[] = [
  {
    name: 'Midnight Indigo',
    value: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #000000 100%)',
    cssPreview: 'linear-gradient(135deg, #0f172a, #1e1b4b, #000000)',
  },
  {
    name: 'Royal Purple',
    value: 'linear-gradient(135deg, #2e1065 0%, #3b0764 50%, #09090b 100%)',
    cssPreview: 'linear-gradient(135deg, #2e1065, #3b0764, #09090b)',
  },
  {
    name: 'Deep Ocean',
    value: 'linear-gradient(135deg, #082f49 0%, #0c4a6e 50%, #020617 100%)',
    cssPreview: 'linear-gradient(135deg, #082f49, #0c4a6e, #020617)',
  },
  {
    name: 'Ruby Velvet',
    value: 'linear-gradient(135deg, #4c0519 0%, #881337 50%, #09090b 100%)',
    cssPreview: 'linear-gradient(135deg, #4c0519, #881337, #09090b)',
  },
  {
    name: 'Emerald Sanctuary',
    value: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #020617 100%)',
    cssPreview: 'linear-gradient(135deg, #022c22, #064e3b, #020617)',
  },
  {
    name: 'Warm Amber',
    value: 'linear-gradient(135deg, #451a03 0%, #78350f 50%, #09090b 100%)',
    cssPreview: 'linear-gradient(135deg, #451a03, #78350f, #09090b)',
  },
  {
    name: 'Cinematic Slate',
    value: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #09090b 100%)',
    cssPreview: 'linear-gradient(135deg, #18181b, #27272a, #09090b)',
  },
  {
    name: 'Pure Black',
    value: '#000000',
    cssPreview: '#000000',
  },
];

export const LivePresentationSection: React.FC<LivePresentationSectionProps> = ({ songs }) => {
  // Source Selection Mode: 'default' | 'bible' | 'songs'
  const [sourceType, setSourceType] = useState<'default' | 'bible' | 'songs'>('default');

  // WebSocket real-time connection status
  const [wsStatus, setWsStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');

  useEffect(() => {
    const unsub = subscribeToWsStatus((status) => {
      setWsStatus(status);
    });
    return () => unsub();
  }, []);

  // Track screen status: when external projection screen opens or closes
  useEffect(() => {
    const unsub = subscribeToScreenStatus((status) => {
      if (status === 'closed') {
        setIsPublished(false);
        secondaryWindowRef.current = null;
      } else if (status === 'opened') {
        setIsPublished(true);
      }
    });
    return () => unsub();
  }, []);

  // Ref for hidden file input on Add New Slide
  const directFileInputRef = useRef<HTMLInputElement | null>(null);

  // Default Presentation Custom Media Slides State
  const [defaultSlides, setDefaultSlides] = useState<PresentationSlide[]>(() => {
    const saved = localStorage.getItem('alga_default_slides_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved default slides', e);
      }
    }
    return [
      {
        id: 'default-1',
        bookName: 'Divine Worship Service',
        tamilBookName: 'ஆராதனை',
        chapter: 0,
        verseNumber: 1,
        text: 'Welcome to Divine Worship Service',
        secondaryText: 'கர்த்தருடைய பரிசுத்த ஆலயத்திற்கு அன்புடன் வரவேற்கிறோம்',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80',
        bgType: 'image',
        bgValue: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'default-2',
        bookName: 'Call to Worship',
        tamilBookName: 'வேத வசனம்',
        chapter: 0,
        verseNumber: 2,
        text: 'God is spirit, and those who worship him must worship in spirit and truth.',
        secondaryText: 'தேவன் ஆவியாயிருக்கிறார், அவரைத் தொழுதுகொள்ளுகிறவர்கள் ஆவியோடும் உண்மையோடும் அவரைத் தொழுதுகொள்ளவேண்டும்.',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1509021436468-d510300e00f3?auto=format&fit=crop&w=1200&q=80',
        bgType: 'image',
        bgValue: 'https://images.unsplash.com/photo-1509021436468-d510300e00f3?auto=format&fit=crop&w=1200&q=80',
      },
    ];
  });

  // Modal State for Adding/Editing Slide
  const [isSlideModalOpen, setIsSlideModalOpen] = useState<boolean>(false);
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);

  // Form fields for modal
  const [slideFormTitle, setSlideFormTitle] = useState<string>('');
  const [slideFormText, setSlideFormText] = useState<string>('');
  const [slideFormSecondaryText, setSlideFormSecondaryText] = useState<string>('');
  const [slideFormMediaType, setSlideFormMediaType] = useState<'image' | 'video' | 'none'>('image');
  const [slideFormMediaUrl, setSlideFormMediaUrl] = useState<string>('');

  // Persist defaultSlides to High-Capacity Storage (IndexedDB + localStorage fallback)
  useEffect(() => {
    loadSlidesFromStorage().then((saved) => {
      if (saved && Array.isArray(saved) && saved.length > 0) {
        setDefaultSlides(saved);
      }
    });
  }, []);

  useEffect(() => {
    saveSlidesToStorage(defaultSlides);
  }, [defaultSlides]);

  const [selectedDefaultIndex, setSelectedDefaultIndex] = useState<number | null>(null);

  // Direct File Importer from PC (triggers native OS file picker for image/video)
  const handleTriggerDirectFileImport = () => {
    directFileInputRef.current?.click();
  };

  const handleDirectFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    e.target.value = '';

    setToastMessage(`Processing ${filesArray.length} file${filesArray.length > 1 ? 's' : ''}...`);

    try {
      const processedSlides = await Promise.all(
        filesArray.map(async (file: File, idx: number) => {
          const isVid = file.type.startsWith('video/');
          const cleanTitle = file.name.replace(/\.[^/.]+$/, '');

          let mediaUrl = '';
          if (isVid) {
            mediaUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = (event) => resolve((event.target?.result as string) || '');
              reader.onerror = () => resolve('');
              reader.readAsDataURL(file);
            });
          } else {
            mediaUrl = await optimizeImageForSlide(file);
          }

          const newSlide: PresentationSlide = {
            id: `default-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
            bookName: cleanTitle || `Presentation`,
            tamilBookName: '',
            chapter: 0,
            verseNumber: 1,
            text: '',
            secondaryText: '',
            mediaType: isVid ? 'video' : 'image',
            mediaUrl: mediaUrl,
            bgType: isVid ? 'color' : 'image',
            bgValue: isVid ? '#000000' : mediaUrl,
          };

          return newSlide;
        })
      );

      const validSlides = processedSlides.filter((s) => Boolean(s.mediaUrl));
      if (validSlides.length > 0) {
        setDefaultSlides((prev) => [...prev, ...validSlides]);

        setToastMessage(`Imported ${validSlides.length} presentation${validSlides.length > 1 ? 's' : ''}!`);
        setTimeout(() => setToastMessage(null), 2500);
      }
    } catch (err) {
      console.error('Error importing presentation files:', err);
      setToastMessage('Error importing some files. Please try again.');
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  // Open modal to add new slide
  const handleOpenAddSlideModal = () => {
    setEditingSlideIndex(null);
    setSlideFormTitle('');
    setSlideFormText('');
    setSlideFormSecondaryText('');
    setSlideFormMediaType('image');
    setSlideFormMediaUrl('');
    setIsSlideModalOpen(true);
  };

  // Open modal to edit slide
  const handleOpenEditSlideModal = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const slide = defaultSlides[index];
    if (!slide) return;
    setEditingSlideIndex(index);
    setSlideFormTitle(slide.bookName || '');
    setSlideFormText(slide.text || '');
    setSlideFormSecondaryText(slide.secondaryText || '');
    setSlideFormMediaType(slide.mediaType || (slide.mediaUrl || slide.bgType === 'image' ? 'image' : 'none'));
    setSlideFormMediaUrl(slide.mediaUrl || (slide.bgType === 'image' ? slide.bgValue || '' : ''));
    setIsSlideModalOpen(true);
  };

  // File upload handler converting selected image or video to Data URL
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVid = file.type.startsWith('video/');
    setSlideFormMediaType(isVid ? 'video' : 'image');

    if (isVid) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSlideFormMediaUrl(event.target.result as string);
          setToastMessage('Imported video successfully!');
          setTimeout(() => setToastMessage(null), 2200);
        }
      };
      reader.readAsDataURL(file);
    } else {
      const dataUrl = await optimizeImageForSlide(file);
      if (dataUrl) {
        setSlideFormMediaUrl(dataUrl);
        setToastMessage('Imported image successfully!');
        setTimeout(() => setToastMessage(null), 2200);
      }
    }
  };

  // Save slide handler
  const handleSaveSlideForm = () => {
    if (!slideFormTitle.trim() && !slideFormText.trim() && !slideFormMediaUrl) {
      setToastMessage('Please enter a title, description, or import an image/video.');
      setTimeout(() => setToastMessage(null), 2200);
      return;
    }

    const newSlideData: PresentationSlide = {
      id: editingSlideIndex !== null ? defaultSlides[editingSlideIndex]?.id || `default-${Date.now()}` : `default-${Date.now()}`,
      bookName: slideFormTitle.trim() || 'Custom Slide',
      tamilBookName: '',
      chapter: 0,
      verseNumber: (editingSlideIndex !== null ? editingSlideIndex : defaultSlides.length) + 1,
      text: slideFormText.trim() || '',
      secondaryText: slideFormSecondaryText.trim() || '',
      mediaType: slideFormMediaType,
      mediaUrl: slideFormMediaUrl.trim() || undefined,
      bgType: slideFormMediaType === 'image' ? 'image' : 'color',
      bgValue: slideFormMediaType === 'image' ? slideFormMediaUrl : '#000000',
    };

    if (editingSlideIndex !== null) {
      setDefaultSlides((prev) => {
        const next = [...prev];
        next[editingSlideIndex] = newSlideData;
        if (activePreviewSourceRef.current === 'default' && selectedDefaultIndex === editingSlideIndex) {
          setActivePreviewSlides([newSlideData]);
        }
        return next;
      });
      if (activePreviewSourceRef.current === 'default') {
        setSelectedDefaultIndex(editingSlideIndex);
        setActivePreviewSlides([newSlideData]);
        setPreviewIndex(0);
      }
      setToastMessage('Presentation updated successfully!');
    } else {
      setDefaultSlides((prev) => [...prev, newSlideData]);
      setToastMessage('New presentation added!');
    }

    setIsSlideModalOpen(false);
    setTimeout(() => setToastMessage(null), 2200);
  };

  // Delete slide handler
  const handleDeleteDefaultSlide = (indexToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDefaultSlides((prev) => {
      const next = prev.filter((_, idx) => idx !== indexToDelete);
      if (activePreviewSourceRef.current === 'default') {
        if (next.length === 0) {
          setSelectedDefaultIndex(null);
          setActivePreviewSlides([]);
          setPreviewIndex(0);
        } else {
          const nextIdx = Math.min(selectedDefaultIndex ?? 0, next.length - 1);
          setSelectedDefaultIndex(nextIdx);
          setActivePreviewSlides(next[nextIdx] ? [next[nextIdx]] : []);
          setPreviewIndex(0);
        }
      }
      return next;
    });
    setToastMessage('Presentation deleted.');
    setTimeout(() => setToastMessage(null), 2200);
  };

  // Popup Window Reference for Secondary Display
  const secondaryWindowRef = useRef<Window | null>(null);

  // ================= BIBLE SELECTION STATE =================
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [selectedVerseNumber, setSelectedVerseNumber] = useState<number | 'ALL' | null>(null);
  const [bibleTranslation, setBibleTranslation] = useState<BibleTranslation>('WEB');
  const [bookSearch, setBookSearch] = useState<string>('');
  const [testamentFilter, setTestamentFilter] = useState<'ALL' | 'OT' | 'NT'>('ALL');
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loadingVerses, setLoadingVerses] = useState<boolean>(false);

  // ================= SONG SELECTION STATE =================
  const [songSearch, setSongSearch] = useState<string>('');
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [selectedStanzaIndex, setSelectedStanzaIndex] = useState<number | 'ALL'>('ALL');

  // ================= INDEPENDENT ACTIVE PREVIEW STATE =================
  const [activePreviewSource, setActivePreviewSource] = useState<'default' | 'bible' | 'songs' | null>(null);
  const [activePreviewSlides, setActivePreviewSlides] = useState<PresentationSlide[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [theme, setTheme] = useState<PresentationTheme>('cinematic');
  const [fontSize, setFontSize] = useState<PresentationFontSize>('large');
  const [showSecondaryTranslation, setShowSecondaryTranslation] = useState<boolean>(false);
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [isBlack, setIsBlack] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ================= CUSTOM BACKGROUND STATE (Holy Bible & Worship Songs) =================
  const [customBg, setCustomBg] = useState<CustomBackgroundConfig | null>(() => {
    try {
      const stored = localStorage.getItem('worship_presentation_custom_bg');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      // ignore
    }
    return null;
  });

  const [isBgDropdownOpen, setIsBgDropdownOpen] = useState<boolean>(false);
  const [customBgUrlInput, setCustomBgUrlInput] = useState<string>('');
  const bgFileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync custom background to local storage
  useEffect(() => {
    try {
      if (customBg) {
        localStorage.setItem('worship_presentation_custom_bg', JSON.stringify(customBg));
      } else {
        localStorage.removeItem('worship_presentation_custom_bg');
      }
    } catch (e) {
      // ignore
    }
  }, [customBg]);

  const handleSelectGradient = (preset: typeof GRADIENT_PRESETS[0]) => {
    setCustomBg({
      type: preset.value.startsWith('#') ? 'color' : 'gradient',
      value: preset.value,
      name: preset.name,
    });
    setToastMessage(`Applied background: ${preset.name}`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleApplyUrlBackground = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const url = customBgUrlInput.trim();
    if (!url) return;
    setCustomBg({
      type: 'image',
      value: url,
      name: 'Custom Web Link',
    });
    setCustomBgUrlInput('');
    setToastMessage('Applied custom web link background!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleFileUploadBackground = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WebP, etc.).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCustomBg({
          type: 'image',
          value: result,
          name: file.name,
        });
        setToastMessage(`Uploaded background: ${file.name}`);
        setTimeout(() => setToastMessage(null), 2500);
      }
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = '';
  };

  const handleClearCustomBg = () => {
    setCustomBg(null);
    setToastMessage('Reset background to default.');
    setTimeout(() => setToastMessage(null), 2000);
  };

  // Handle blanking the screen and unselecting all active presentation content
  const handleBlankScreenAndUnselect = () => {
    setIsBlack(true);
    setSelectedDefaultIndex(null);
    setSelectedVerseNumber(null);
    setSelectedStanzaIndex(null);
    setActivePreviewSlides([]);
    setPreviewIndex(0);
  };

  const activePreviewSourceRef = useRef(activePreviewSource);
  activePreviewSourceRef.current = activePreviewSource;

  // Fetch Bible verses whenever selected book, chapter, or translation changes
  useEffect(() => {
    if (!selectedBook || !selectedChapter) {
      setVerses([]);
      setLoadingVerses(false);
      return;
    }

    let isMounted = true;
    const loadVerses = async () => {
      setLoadingVerses(true);
      try {
        const data = await fetchChapterVerses(selectedBook.name, selectedChapter, bibleTranslation);
        if (isMounted) {
          setVerses(data);
        }
      } catch (err) {
        console.error('Error loading Bible verses for projection:', err);
      } finally {
        if (isMounted) setLoadingVerses(false);
      }
    };

    loadVerses();

    return () => {
      isMounted = false;
    };
  }, [selectedBook?.id, selectedChapter, bibleTranslation]);

  // Clean chord tags from song lyrics while preserving exact line-by-line formatting
  const cleanChords = (text: string) => {
    return text
      .split('\n')
      .map((line) => {
        // Remove chord brackets like [G], [Em7], [F#m], etc.
        const cleaned = line.replace(/\[[A-G][b#]?(?:m|maj|min|dim|aug|sus|add|\d)*[\w\d/]*\]/g, '');
        return cleaned.trimEnd();
      })
      .join('\n')
      .trim();
  };

  // Helper to build Bible slides array containing all verses of the chapter
  const getBibleSlides = (
    vList: BibleVerse[],
    book: BibleBook | null,
    ch: number | null
  ): PresentationSlide[] => {
    if (!book || !ch) return [];
    const isTamil = bibleTranslation === 'TAM';
    const bookTitle = isTamil ? (book.tamilName || book.name) : book.name;

    if (vList.length === 0) {
      return [
        {
          bookName: bookTitle,
          tamilBookName: isTamil ? book.tamilName : undefined,
          chapter: ch,
          verseNumber: 1,
          text: isTamil ? `ஏற்றுகிறது... ${bookTitle} ${ch}` : `Loading ${book.name} ${ch}...`,
        },
      ];
    }

    return vList.map((v) => ({
      bookName: bookTitle,
      tamilBookName: isTamil ? book.tamilName : undefined,
      chapter: ch,
      verseNumber: v.number,
      text: v.text,
      mediaType: 'none',
      bgType: customBg ? customBg.type : 'color',
      bgValue: customBg ? customBg.value : '#000000',
    }));
  };

  // Helper to build Song slides array containing all stanzas of the song with line-by-line integrity
  const getSongSlides = (
    song: WorshipSong | undefined
  ): PresentationSlide[] => {
    if (!song) return [];
    const cleanLyrics = cleanChords(song.lyricsWithChords);
    const blocks = cleanLyrics.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

    if (blocks.length === 0) {
      return [
        {
          bookName: song.title,
          tamilBookName: song.tamilTitle,
          chapter: 0,
          verseNumber: 1,
          text: song.title,
          secondaryText: undefined,
        },
      ];
    }

    return blocks.map((block, idx) => {
      const rawLines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      let sectionName = '';
      let lyricLines = rawLines;

      if (rawLines.length > 0 && rawLines[0].startsWith('[') && rawLines[0].endsWith(']')) {
        sectionName = rawLines[0].slice(1, -1);
        lyricLines = rawLines.slice(1);
      }

      const textContent = lyricLines.join('\n').trim();

      return {
        bookName: sectionName ? `${song.title} (${sectionName})` : song.title,
        tamilBookName: song.tamilTitle,
        chapter: 0,
        verseNumber: idx + 1,
        text: textContent || block,
        secondaryText: undefined,
      };
    });
  };

  // Filter Bible books based on search & testament filter
  const filteredBooks = useMemo(() => {
    return BIBLE_BOOKS.filter((book) => {
      const matchesTestament =
        testamentFilter === 'ALL' || book.testament === testamentFilter;
      const q = bookSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        book.name.toLowerCase().includes(q) ||
        (book.tamilName && book.tamilName.includes(q)) ||
        book.id.toLowerCase().includes(q);
      return matchesTestament && matchesSearch;
    });
  }, [bookSearch, testamentFilter]);

  // Filter songs based on search
  const filteredSongs = useMemo(() => {
    const list = !songSearch.trim()
      ? songs
      : songs.filter(
          (s) =>
            s.title.toLowerCase().includes(songSearch.toLowerCase().trim()) ||
            (s.tamilTitle && s.tamilTitle.toLowerCase().includes(songSearch.toLowerCase().trim())) ||
            s.artist.toLowerCase().includes(songSearch.toLowerCase().trim()) ||
            s.lyricsWithChords.toLowerCase().includes(songSearch.toLowerCase().trim())
        );
    const seen = new Set<string>();
    return list.filter((s) => {
      if (!s || !s.id || seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });
  }, [songs, songSearch]);

  const selectedSong = useMemo(() => {
    if (!selectedSongId) return null;
    return songs.find((s) => s.id === selectedSongId) || null;
  }, [songs, selectedSongId]);

  // Convert song lyrics to presentation slides
  const songSlides = useMemo<PresentationSlide[]>(() => {
    if (!selectedSong) return [];
    return getSongSlides(selectedSong);
  }, [selectedSong]);

  // Keep refs for callbacks
  const currentSlidesRef = useRef(activePreviewSlides);
  currentSlidesRef.current = activePreviewSlides;
  const previewIndexRef = useRef(previewIndex);
  previewIndexRef.current = previewIndex;

  // Active current slides in preview panel
  const currentSlides = activePreviewSlides;

  // Custom background only active for Holy Bible and Worship Songs sections
  const effectiveCustomBg = (activePreviewSource === 'bible' || activePreviewSource === 'songs') ? customBg : null;

  // Ensure previewIndex stays within bounds when currentSlides change
  useEffect(() => {
    if (previewIndex >= currentSlides.length && currentSlides.length > 0) {
      setPreviewIndex(0);
    }
  }, [currentSlides.length, previewIndex]);

  const activeSlide: PresentationSlide | null =
    activePreviewSource && currentSlides.length > 0
      ? currentSlides[previewIndex] || currentSlides[0] || null
      : null;

  // Synchronize Bible selection (verse number) or Default slide selection whenever active slide changes in preview or from external screen
  useEffect(() => {
    if (!activeSlide) return;

    if (activePreviewSource === 'default' && typeof selectedDefaultIndex === 'number') {
      setSelectedDefaultIndex(previewIndex);
    } else if (activePreviewSource === 'bible' && activeSlide.chapter > 0 && typeof activeSlide.verseNumber === 'number') {
      if (typeof selectedVerseNumber === 'number' && selectedVerseNumber !== activeSlide.verseNumber) {
        setSelectedVerseNumber(activeSlide.verseNumber);
      }
    }
  }, [activePreviewSource, previewIndex, activeSlide?.chapter, activeSlide?.verseNumber, selectedVerseNumber, selectedDefaultIndex]);

  // Listen for navigation updates coming from secondary projection screen (Arrow keys / Remote triggers)
  useEffect(() => {
    const unsubscribe = subscribeToPresentationState((incoming) => {
      if (incoming && typeof incoming.currentIndex === 'number') {
        if (
          incoming.currentIndex !== previewIndexRef.current &&
          incoming.currentIndex >= 0 &&
          incoming.currentIndex < currentSlidesRef.current.length
        ) {
          setPreviewIndex(incoming.currentIndex);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Keyboard navigation shortcuts on controller window (when not typing in inputs)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown' || e.key === 'ArrowDown') {
        if (currentSlides.length > 1) {
          e.preventDefault();
          setPreviewIndex((prev) => Math.min(currentSlides.length - 1, prev + 1));
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'ArrowUp') {
        if (currentSlides.length > 1) {
          e.preventDefault();
          setPreviewIndex((prev) => Math.max(0, prev - 1));
        }
      } else if (e.key.toLowerCase() === 'b' || e.key === '.') {
        e.preventDefault();
        if (isBlack && !activeSlide) {
          setIsBlack(false);
        } else {
          handleBlankScreenAndUnselect();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlides.length]);

  // Sync state continuously with published secondary window when active
  useEffect(() => {
    const payload: PresentationState = {
      slides: currentSlides,
      currentIndex: previewIndex,
      theme,
      fontSize,
      showSecondaryTranslation,
      isAutoPlaying: false,
      autoPlayInterval: 5,
      isPublished: isPublished,
      isBlack: isBlack,
      customBackground: effectiveCustomBg,
      updatedAt: Date.now(),
    };
    broadcastPresentationState(payload);
  }, [previewIndex, currentSlides, theme, fontSize, showSecondaryTranslation, isPublished, isBlack, effectiveCustomBg]);

  // Monitor popup window closure directly from controller
  useEffect(() => {
    if (!isPublished) return;
    const interval = setInterval(() => {
      if (secondaryWindowRef.current && secondaryWindowRef.current.closed) {
        secondaryWindowRef.current = null;
        setIsPublished(false);
        broadcastScreenStatus('closed');
        const payload: PresentationState = {
          slides: currentSlides,
          currentIndex: previewIndex,
          theme,
          fontSize,
          showSecondaryTranslation,
          isAutoPlaying: false,
          autoPlayInterval: 5,
          isPublished: false,
          isBlack: isBlack,
          customBackground: effectiveCustomBg,
          updatedAt: Date.now(),
        };
        broadcastPresentationState(payload);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [isPublished, currentSlides, previewIndex, theme, fontSize, showSecondaryTranslation, isBlack, effectiveCustomBg]);

  // Publish handler to sync with 2nd screen / presentation window
  const handlePublishToLive = () => {
    const hasActiveContent = Boolean(activeSlide && currentSlides.length > 0);

    const payload: PresentationState = {
      slides: hasActiveContent ? currentSlides : [],
      currentIndex: hasActiveContent ? previewIndex : 0,
      theme,
      fontSize,
      showSecondaryTranslation,
      isAutoPlaying: false,
      autoPlayInterval: 5,
      isPublished: true,
      isBlack: isBlack,
      customBackground: effectiveCustomBg,
      updatedAt: Date.now(),
    };

    broadcastPresentationState(payload);
    broadcastScreenStatus('opened');
    setIsPublished(true);

    if (!secondaryWindowRef.current || secondaryWindowRef.current.closed) {
      secondaryWindowRef.current = window.open(
        '/?mode=presentation',
        'ALGA_Projection_Screen',
        'width=1280,height=720,menubar=no,toolbar=no'
      );
    } else {
      try {
        secondaryWindowRef.current.focus();
      } catch (e) {
        // ignore
      }
    }

    // Follow-up sync broadcasts to ensure newly opened window gets state
    setTimeout(() => {
      broadcastPresentationState({ ...payload, updatedAt: Date.now() });
    }, 250);

    setTimeout(() => {
      broadcastPresentationState({ ...payload, updatedAt: Date.now() });
    }, 650);

    setToastMessage(
      hasActiveContent
        ? 'Live Projection Started on Secondary Display!'
        : 'Live Screen Opened. Select any slide, verse, or song to project.'
    );
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Stop Publishing handler
  const handleStopPublishing = () => {
    // If the secondary window is currently open, close it
    if (secondaryWindowRef.current && !secondaryWindowRef.current.closed) {
      try {
        secondaryWindowRef.current.close();
      } catch (e) {
        // ignore
      }
      secondaryWindowRef.current = null;
    }

    const payload: PresentationState = {
      slides: currentSlides,
      currentIndex: previewIndex,
      theme,
      fontSize,
      showSecondaryTranslation,
      isAutoPlaying: false,
      autoPlayInterval: 5,
      isPublished: false,
      isBlack: isBlack,
      customBackground: effectiveCustomBg,
      updatedAt: Date.now(),
    };

    broadcastPresentationState(payload);
    broadcastScreenStatus('closed');
    setIsPublished(false);

    setToastMessage('Live Projection Stopped');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Launch pop-out secondary window for projectors
  const handleOpenSecondaryWindow = () => {
    setIsPublished(true);
    broadcastScreenStatus('opened');
    const payload: PresentationState = {
      slides: currentSlides,
      currentIndex: previewIndex,
      theme,
      fontSize,
      showSecondaryTranslation,
      isAutoPlaying: false,
      autoPlayInterval: 5,
      isPublished: true,
      isBlack: isBlack,
      updatedAt: Date.now(),
    };

    broadcastPresentationState(payload);

    secondaryWindowRef.current = window.open(
      '/?mode=presentation',
      'ALGA_Reveal_Projection',
      'width=1280,height=720,menubar=no,toolbar=no'
    );

    setTimeout(() => {
      broadcastPresentationState({ ...payload, updatedAt: Date.now() });
    }, 250);

    setTimeout(() => {
      broadcastPresentationState({ ...payload, updatedAt: Date.now() });
    }, 650);
  };

  // Theme styling dictionary for live preview
  const themePreviewStyles: Record<string, { bg: string; text: string; ref: string; border: string }> = {
    cinematic: {
      bg: 'bg-gradient-to-b from-stone-950 via-stone-900 to-black',
      text: 'text-stone-100',
      ref: 'text-purple-300 border-purple-500/30 bg-purple-500/10',
      border: 'border-stone-800',
    },
    black: {
      bg: 'bg-black',
      text: 'text-white',
      ref: 'text-stone-300 border-stone-800 bg-stone-900',
      border: 'border-stone-900',
    },
    midnight: {
      bg: 'bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900',
      text: 'text-sky-100',
      ref: 'text-sky-300 border-sky-500/30 bg-sky-500/10',
      border: 'border-slate-800',
    },
    parchment: {
      bg: 'bg-[#F7F3EB]',
      text: 'text-stone-900',
      ref: 'text-stone-800 border-stone-300 bg-stone-200/50',
      border: 'border-stone-300',
    },
    'lower-third': {
      bg: 'bg-stone-950/90',
      text: 'text-stone-100',
      ref: 'text-stone-300 border-stone-700 bg-stone-900',
      border: 'border-stone-800',
    },
  };

  const activePreviewTheme = themePreviewStyles[theme] || themePreviewStyles.cinematic;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="live-presentation-container">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-purple-600 text-white font-bold text-xs rounded-full shadow-2xl flex items-center space-x-2 animate-bounce border border-purple-400">
          <Check className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Editorial Header Banner - Hidden for now */}
      {/* 
      <div className="relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-950 text-stone-100 p-8 sm:p-12 rounded-3xl shadow-2xl">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-rose-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute right-4 bottom-0 -mb-10 text-[10rem] sm:text-[14rem] font-serif font-light text-white/[0.07] pointer-events-none select-none">
          03
        </div>

        <div className="relative z-10 space-y-4 max-w-2xl">
          <span className="text-[10px] uppercase tracking-[0.4em] bg-purple-400/20 text-purple-300 border border-purple-400/30 px-3.5 py-1 rounded-full font-bold inline-block shadow-sm">
            03 • PROJECTION STUDIO
          </span>

          <h2 className="text-3xl sm:text-5xl font-serif font-light italic leading-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-rose-100 to-indigo-100 drop-shadow-sm">
            Live Presentation Studio
          </h2>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleOpenSecondaryWindow}
            className="flex items-center justify-center space-x-2 px-5 py-3 bg-stone-900/80 hover:bg-stone-800/90 text-stone-100 border border-purple-500/30 text-xs font-bold rounded-full transition-all cursor-pointer shadow-lg backdrop-blur-md"
            title="Launch 2nd Window Display for External Screen or Projector"
          >
            <ExternalLink className="w-4 h-4 text-purple-400" />
            <span>Launch 2nd Screen Display</span>
          </button>
        </div>
      </div>
      */}

      {/* Main Workspace Layout with Right-Most Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT / MAIN COLUMN: CONTENT SELECTION PANEL (DEFAULT, BIBLE, SONGS) */}
        <div className="lg:col-span-8 xl:col-span-8 space-y-6">
          
          {/* DEFAULT MODE CONTROLS */}
          {sourceType === 'default' && (
            <div className="bg-[#1b1a1a] border border-stone-800 rounded-2xl p-6 space-y-6 backdrop-blur-xl">
              {/* Header with Source Tabs & Import Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
                <div className="bg-black border border-stone-800 rounded-xl p-1 inline-flex items-center gap-1 w-fit">
                  <button
                    onClick={() => setSourceType('default')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                      sourceType === 'default'
                        ? 'bg-white text-black font-bold shadow-xs'
                        : 'text-stone-400 hover:text-white hover:bg-stone-900'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Default</span>
                  </button>

                  <button
                    onClick={() => setSourceType('bible')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                      sourceType === 'bible'
                        ? 'bg-white text-black font-bold shadow-xs'
                        : 'text-stone-400 hover:text-white hover:bg-stone-900'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Bible</span>
                  </button>

                  <button
                    onClick={() => setSourceType('songs')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                      sourceType === 'songs'
                        ? 'bg-white text-black font-bold shadow-xs'
                        : 'text-stone-400 hover:text-white hover:bg-stone-900'
                    }`}
                  >
                    <Music className="w-3.5 h-3.5" />
                    <span>Songs</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={directFileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleDirectFileImport}
                    className="hidden"
                  />

                  <button
                    onClick={handleTriggerDirectFileImport}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-purple-600/20 cursor-pointer flex items-center justify-center space-x-2 active:scale-95"
                    title="Import images or videos from your computer (Multiple files supported)"
                  >
                    <FolderInput className="w-4 h-4" />
                    <span>Import Media</span>
                  </button>
                </div>
              </div>

              {/* Full Width Slide Cards Grid */}
              <div className="space-y-3 flex flex-col items-center text-center w-full mb-4 pt-0 pl-0">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center justify-center text-center w-full">
                  <span>Presentations ({defaultSlides.length})</span>
                </label>

                {defaultSlides.length === 0 ? (
                  <div className="w-full p-8 text-center bg-stone-950/40 rounded-xl border border-dashed border-stone-800 space-y-3 flex flex-col items-center justify-center pt-0 pl-0">
                    <p className="text-xs text-stone-400">No imported presentation slides found.</p>
                    <button
                      onClick={handleTriggerDirectFileImport}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-purple-400 hover:text-purple-300 text-xs font-bold rounded-xl border border-stone-800 inline-flex items-center space-x-1.5 cursor-pointer transition-all"
                    >
                      <FolderInput className="w-3.5 h-3.5" />
                      <span>Import Media</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center items-center text-center w-full pt-0 pl-0">
                    {defaultSlides.map((slide, idx) => {
                      const isSelected =
                        activePreviewSource === 'default' &&
                        selectedDefaultIndex === idx;
                      const isVid = slide.mediaType === 'video' || (slide.mediaUrl && (slide.mediaUrl.startsWith('data:video') || slide.mediaUrl.endsWith('.mp4') || slide.mediaUrl.endsWith('.webm') || slide.mediaUrl.endsWith('.mov') || slide.mediaUrl.endsWith('.m4v')));
                      const hasMedia = Boolean(slide.mediaUrl || slide.bgType === 'image');
                      const mediaSrc = slide.mediaUrl || (slide.bgType === 'image' ? slide.bgValue : undefined);
                      const displayName = slide.bookName || `Presentation ${idx + 1}`;

                      return (
                        <div
                          key={slide.id || idx}
                          id={`default-slide-card-${idx}`}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedDefaultIndex(null);
                              setActivePreviewSlides([]);
                              setPreviewIndex(0);
                            } else {
                              setSelectedDefaultIndex(idx);
                              setActivePreviewSource('default');
                              setActivePreviewSlides(defaultSlides);
                              setPreviewIndex(idx);
                              setIsBlack(false);
                            }
                          }}
                          className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between items-center text-center aspect-video min-h-[120px] ${
                            isSelected
                              ? 'bg-purple-950/70 border-purple-500 shadow-xl shadow-purple-950/80 ring-2 ring-purple-500/80 scale-[1.02] z-10'
                              : 'bg-stone-950/80 border-stone-800 hover:border-stone-700 hover:bg-stone-900/60 hover:scale-[1.01]'
                          }`}
                        >
                          {/* Pulsing Active Indicator Dot on top-right outline */}
                          {isSelected && (
                            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 pointer-events-none z-30">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-300 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-300 border border-stone-950"></span>
                            </span>
                          )}

                          {/* Media Thumbnail Background Overlay */}
                          {hasMedia && mediaSrc && (
                            <div className="absolute inset-0 z-0 rounded-xl overflow-hidden bg-black/85 flex items-center justify-center p-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                              {isVid ? (
                                <video src={mediaSrc} className="w-full h-full object-cover rounded-lg" muted />
                              ) : (
                                <img src={mediaSrc} alt="" className="w-full h-full object-cover rounded-lg" />
                              )}
                            </div>
                          )}

                          <div className="relative z-10 flex flex-col justify-between items-center text-center h-full w-full space-y-2 pointer-events-none">
                            <div className="flex items-center justify-between w-full gap-1.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md truncate max-w-[75%] border text-center ${
                                isSelected
                                  ? 'bg-purple-600 text-white border-purple-400/60 shadow-xs'
                                  : 'bg-black/70 text-stone-300 border-white/10'
                              }`}>
                                {displayName}
                              </span>

                              <button
                                type="button"
                                id={`btn-delete-default-slide-${idx}`}
                                onClick={(e) => handleDeleteDefaultSlide(idx, e)}
                                className="pointer-events-auto p-1 rounded-md bg-black/70 hover:bg-rose-600/90 text-stone-400 hover:text-white border border-white/10 hover:border-rose-500 transition-all cursor-pointer shadow-xs"
                                title="Delete presentation"
                                aria-label="Delete presentation"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {(slide.text || slide.secondaryText) && (
                              <div className="my-1 bg-black/60 backdrop-blur-xs p-1.5 rounded-lg border border-white/10 text-center w-full flex flex-col items-center justify-center">
                                {slide.text && <p className="text-[11px] text-stone-200 line-clamp-2 font-medium text-center">{slide.text}</p>}
                                {slide.secondaryText && <p className="text-[10px] text-stone-400 line-clamp-1 italic mt-0.5 text-center">{slide.secondaryText}</p>}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* BIBLE MODE CONTROLS */}
          {sourceType === 'bible' && (
            <div className="bg-[#1b1a1a] border border-stone-800 rounded-2xl p-6 space-y-6 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
                <div className="bg-black border border-stone-800 rounded-xl p-1 inline-flex items-center gap-1 w-fit">
                  <button
                    onClick={() => setSourceType('default')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                      sourceType === 'default'
                        ? 'bg-white text-black font-bold shadow-xs'
                        : 'text-stone-400 hover:text-white hover:bg-stone-900'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Default</span>
                  </button>

                  <button
                    onClick={() => setSourceType('bible')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                      sourceType === 'bible'
                        ? 'bg-white text-black font-bold shadow-xs'
                        : 'text-stone-400 hover:text-white hover:bg-stone-900'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Bible</span>
                  </button>

                  <button
                    onClick={() => setSourceType('songs')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                      sourceType === 'songs'
                        ? 'bg-white text-black font-bold shadow-xs'
                        : 'text-stone-400 hover:text-white hover:bg-stone-900'
                    }`}
                  >
                    <Music className="w-3.5 h-3.5" />
                    <span>Songs</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-purple-300 font-bold bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20">
                    {bibleTranslation} Bible
                  </span>
                </div>
              </div>

              {/* Translation Filter Bar positioned directly above the 3-Column selection grid */}
              <div className="flex items-center justify-start">
                <div className="inline-flex items-center gap-1 p-1 bg-stone-950/90 border border-stone-800 rounded-xl text-xs backdrop-blur-md overflow-x-auto max-w-full">
                  {[
                    { code: 'WEB', label: 'WEB', fullName: 'World English Bible' },
                    { code: 'TAM', label: 'TAM', fullName: 'Tamil Bible (தமிழ்)' },
                    { code: 'KJV', label: 'KJV', fullName: 'King James Version' },
                    { code: 'ASV', label: 'ASV', fullName: 'American Standard Version' },
                    { code: 'BBE', label: 'BBE', fullName: 'Bible in Basic English' },
                    { code: 'YLT', label: 'YLT', fullName: "Young's Literal Translation" },
                    { code: 'DARBY', label: 'DARBY', fullName: 'Darby Bible' },
                    { code: 'OEB', label: 'OEB', fullName: 'Open English Bible' },
                  ].map((t) => (
                    <button
                      key={t.code}
                      onClick={() => setBibleTranslation(t.code as BibleTranslation)}
                      title={t.fullName}
                      className={`px-3 py-1 rounded-lg font-bold text-xs tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                        bibleTranslation === t.code
                          ? 'bg-stone-900 text-purple-400 shadow-xs'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 1, 2, 3: Bible Selection Layout */}
              <div className="space-y-6 pt-2">
                {/* Top Row: Select Book & Select Chapter side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Column 1: Select Book */}
                  <div className="space-y-3 bg-stone-950/60 p-4 rounded-xl border border-stone-800 flex flex-col h-[380px]">
                    <div className="space-y-2 shrink-0">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center space-x-1.5">
                          <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px]">1</span>
                          <span>Select Book</span>
                        </label>
                        {/* Testament Filter Toggle */}
                        <div className="flex bg-stone-900 p-0.5 rounded-lg border border-stone-800 text-[10px] font-bold">
                          {(['ALL', 'OT', 'NT'] as const).map((t) => (
                            <button
                              key={t}
                              onClick={() => setTestamentFilter(t)}
                              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                testamentFilter === t ? 'bg-purple-600 text-white' : 'text-stone-400 hover:text-stone-200'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Book Search Bar */}
                      <div className="relative flex items-center">
                        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={bookSearch}
                          onChange={(e) => setBookSearch(e.target.value)}
                          placeholder="Search book..."
                          className="w-full bg-stone-900 text-xs text-stone-100 placeholder-stone-500 pl-8 pr-3 py-2 rounded-lg border border-stone-800 outline-hidden focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
                        />
                      </div>
                    </div>

                    {/* Book List / Grid */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-1 mt-2">
                      {filteredBooks.map((book) => {
                        const isSelected = selectedBook ? book.id === selectedBook.id : false;
                        const isTamil = bibleTranslation === 'TAM';
                        const displayName = isTamil ? (book.tamilName || book.name) : book.name;
                        return (
                          <button
                            key={book.id}
                            onClick={() => {
                              setSelectedBook(book);
                              setSelectedChapter(1);
                              setSelectedVerseNumber(null);
                            }}
                            className={`w-full p-2 rounded-lg text-left border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-purple-600 text-white border-purple-400 shadow-xs font-bold'
                                : 'bg-stone-900/80 border-stone-800/80 text-stone-300 hover:bg-stone-800'
                            }`}
                          >
                            <span className="text-xs truncate">{displayName}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column 2: Select Chapter */}
                  <div className="space-y-3 bg-stone-950/60 p-4 rounded-xl border border-stone-800 flex flex-col h-[380px]">
                    <div className="shrink-0">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center space-x-1.5">
                        <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px]">2</span>
                        <span>Select Chapter</span>
                      </label>
                      {selectedBook ? (
                        <p className="text-[11px] text-purple-400 font-semibold mt-1 truncate">
                          {bibleTranslation === 'TAM' ? (selectedBook.tamilName || selectedBook.name) : selectedBook.name} ({selectedBook.totalChapters} Ch.)
                        </p>
                      ) : (
                        <p className="text-[11px] text-stone-500 italic mt-1">
                          Select a book first
                        </p>
                      )}
                    </div>

                    {/* Chapter Grid */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-1.5">
                      {selectedBook ? (
                        <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 p-1">
                          {Array.from({ length: selectedBook.totalChapters }, (_, i) => i + 1).map((ch) => {
                            const isSelected = ch === selectedChapter;
                            return (
                              <button
                                key={ch}
                                onClick={() => {
                                  setSelectedChapter(ch);
                                  setSelectedVerseNumber(null);
                                }}
                                className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-purple-600 text-white border-purple-400 shadow-xs scale-105'
                                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                                }`}
                              >
                                {ch}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4 text-xs text-stone-500">
                          <span>Please select a book from the list on the left.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Select Verse (below Select Book & Select Chapter) */}
                <div className="space-y-3 bg-stone-950/60 p-4 rounded-xl border border-stone-800 flex flex-col min-h-[220px]">
                  <div className="flex items-center justify-between shrink-0">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center space-x-1.5">
                      <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px]">3</span>
                      <span>Select Verse</span>
                    </label>
                  </div>

                  {!selectedBook || !selectedChapter ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-xs text-stone-500 py-8 space-y-1">
                      <p>Select a book and chapter above to view verses.</p>
                    </div>
                  ) : loadingVerses ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-xs text-stone-400 space-y-2 py-8">
                      <RefreshCw className="w-5 h-5 animate-spin text-purple-400" />
                      <p>Loading verses...</p>
                    </div>
                  ) : verses.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-xs text-stone-500 py-8">
                      <p>No verses found for this chapter.</p>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-1.5 flex flex-col justify-between space-y-3">
                      {/* Tiny cards grid for verses - wide layout with padding for glow & scale */}
                      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 p-1.5">
                        {verses.map((v) => {
                          const isCurrentActive =
                            (activeSlide?.chapter === selectedChapter && activeSlide?.verseNumber === v.number) ||
                            selectedVerseNumber === v.number;
                          return (
                            <button
                              key={v.number}
                              id={`bible-verse-btn-${v.number}`}
                              onClick={() => {
                                if (isCurrentActive) {
                                  setSelectedVerseNumber(null);
                                  setActivePreviewSlides([]);
                                  setPreviewIndex(0);
                                } else {
                                  const vIdx = verses.findIndex((item) => item.number === v.number);
                                  setSelectedVerseNumber(v.number);
                                  setActivePreviewSource('bible');
                                  setActivePreviewSlides(getBibleSlides(verses, selectedBook, selectedChapter));
                                  setPreviewIndex(vIdx >= 0 ? vIdx : 0);
                                  setIsBlack(false);
                                }
                              }}
                              className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer relative ${
                                isCurrentActive
                                  ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-950/70 scale-105 ring-2 ring-purple-400/80 z-10'
                                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                              }`}
                            >
                              v{v.number}
                              {isCurrentActive && (
                                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 pointer-events-none">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-300 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-300 border border-stone-950"></span>
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Selected Verse Text Preview Snippet at the bottom - only displayed when a verse is selected */}
                      {typeof selectedVerseNumber === 'number' && (
                        <div className="p-3 rounded-xl bg-stone-900/95 border border-purple-500/30 text-stone-200 text-xs leading-relaxed shrink-0 max-h-28 overflow-y-auto custom-scrollbar shadow-inner animate-in fade-in slide-in-from-bottom-2 duration-150">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-bold text-purple-400 text-xs tracking-wide">
                                {bibleTranslation === 'TAM' ? (selectedBook?.tamilName || selectedBook?.name) : selectedBook?.name} {selectedChapter}:{selectedVerseNumber}
                              </span>
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                                Live Projected
                              </span>
                            </div>
                            <p className="text-stone-200 text-xs font-medium leading-relaxed">
                              {verses.find((v) => v.number === selectedVerseNumber)?.text || activeSlide?.text}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* SONG MODE CONTROLS */}
          {sourceType === 'songs' && (
            <div className="bg-[#1b1a1a] border border-stone-800 rounded-2xl p-6 space-y-6 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
                <div className="bg-black border border-stone-800 rounded-xl p-1 inline-flex items-center gap-1 w-fit">
                  <button
                    onClick={() => setSourceType('default')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                      sourceType === 'default'
                        ? 'bg-white text-black font-bold shadow-xs'
                        : 'text-stone-400 hover:text-white hover:bg-stone-900'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Default</span>
                  </button>

                  <button
                    onClick={() => setSourceType('bible')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                      sourceType === 'bible'
                        ? 'bg-white text-black font-bold shadow-xs'
                        : 'text-stone-400 hover:text-white hover:bg-stone-900'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Bible</span>
                  </button>

                  <button
                    onClick={() => setSourceType('songs')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                      sourceType === 'songs'
                        ? 'bg-white text-black font-bold shadow-xs'
                        : 'text-stone-400 hover:text-white hover:bg-stone-900'
                    }`}
                  >
                    <Music className="w-3.5 h-3.5" />
                    <span>Songs</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-purple-300 font-bold bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20">
                    {filteredSongs.length} Songs
                  </span>
                </div>
              </div>

              {/* Two Column Layout: Select Song & Select Stanza */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Column 1: Step 1 - Select Song */}
                <div className="space-y-3 bg-stone-950/60 p-4 rounded-xl border border-stone-800 flex flex-col h-[400px]">
                  <div className="shrink-0 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center space-x-1.5">
                        <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px]">1</span>
                        <span>Select Song</span>
                      </label>
                      <span className="text-[10px] font-mono text-stone-400">
                        {filteredSongs.length} found
                      </span>
                    </div>

                    {/* Search inside Select Song container */}
                    <div className="relative flex items-center">
                      <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={songSearch}
                        onChange={(e) => setSongSearch(e.target.value)}
                        placeholder="Search song title, lyrics, artist..."
                        className="w-full bg-stone-900 text-xs text-stone-100 placeholder-stone-500 pl-8 pr-3 py-2 rounded-lg border border-stone-800 outline-hidden focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-1">
                    {filteredSongs.map((s) => {
                      const isSelected = s.id === selectedSong?.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            setSelectedSongId(s.id);
                            setSelectedStanzaIndex('ALL');
                            setActivePreviewSource('songs');
                            setActivePreviewSlides(getSongSlides(s));
                            setPreviewIndex(0);
                            setIsBlack(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-purple-600 text-white border-purple-400 shadow-xs font-bold'
                              : 'bg-stone-900/80 border-stone-800 text-stone-300 hover:bg-stone-800/80'
                          }`}
                        >
                          <div className="space-y-0.5 min-w-0 pr-2">
                            <div className="text-xs font-bold truncate">{s.title}</div>
                            {s.tamilTitle && (
                              <div className={`text-[11px] font-serif italic truncate ${isSelected ? 'text-purple-100' : 'text-stone-400'}`}>
                                {s.tamilTitle}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Column 2: Step 2 - Select Stanza */}
                <div className="space-y-3 bg-stone-950/60 p-4 rounded-xl border border-stone-800 flex flex-col h-[400px]">
                  <div className="shrink-0">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center space-x-1.5">
                      <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px]">2</span>
                      <span>Select Stanza</span>
                    </label>
                    {selectedSong && (
                      <p className="text-[11px] text-purple-400 font-semibold mt-1 truncate">
                        {selectedSong.title} ({songSlides.length} {songSlides.length === 1 ? 'Stanza' : 'Stanzas'})
                      </p>
                    )}
                  </div>

                  {selectedSong ? (
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {songSlides.map((slide, idx) => {
                          const isSelected =
                            activePreviewSource === 'songs' && previewIndex === idx;
                          return (
                            <button
                              key={idx}
                              id={`song-section-btn-${idx}`}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedStanzaIndex(null);
                                  setActivePreviewSlides([]);
                                  setPreviewIndex(0);
                                } else {
                                  setSelectedStanzaIndex(idx);
                                  setActivePreviewSource('songs');
                                  setActivePreviewSlides(getSongSlides(selectedSong));
                                  setPreviewIndex(idx);
                                  setIsBlack(false);
                                }
                              }}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                                isSelected
                                  ? 'bg-purple-500/20 border-purple-500 text-purple-200 font-bold shadow-md shadow-purple-950/50 ring-2 ring-purple-400/80 z-10'
                                  : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800/60'
                              }`}
                            >
                              {/* Pulsing Active Indicator on top-right corner */}
                              {isSelected && (
                                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 pointer-events-none z-20">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-300 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-300 border border-stone-950"></span>
                                </span>
                              )}

                              <div className="text-[11px] font-bold text-purple-300 truncate">
                                Stanza {idx + 1}
                              </div>
                              <div className="text-[10px] text-stone-400 whitespace-pre-line line-clamp-3 mt-0.5 leading-relaxed">
                                {slide.text}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-xs text-stone-500 italic">
                      Select a song on the left to view stanzas
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* RIGHT-MOST COLUMN: COMMON LIVE PREVIEW FOR ALL THREE SECTIONS */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-4 sticky top-24 sm:top-28 z-30 self-start">
          <div className="bg-[#1b1a1a] border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-3.5 backdrop-blur-xl shadow-2xl max-w-md mx-auto lg:max-w-none max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
            {/* Live Preview Header */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div className="flex items-center space-x-2.5">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    !activeSlide
                      ? 'bg-stone-600'
                      : isBlack
                      ? 'bg-stone-500'
                      : isPublished
                      ? 'bg-amber-400 animate-pulse'
                      : 'bg-emerald-500 animate-pulse'
                  }`}
                />
                <span className="text-xs font-bold uppercase tracking-wider text-stone-200">
                  {!activeSlide
                    ? 'No Slide Selected'
                    : isBlack
                    ? 'Blank Screen (Standby)'
                    : isPublished
                    ? 'Live Projected'
                    : 'Live Preview'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {/* WebSocket Real-time Status */}
                <div
                  className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider border ${
                    wsStatus === 'connected'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : wsStatus === 'connecting'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}
                  title={
                    wsStatus === 'connected'
                      ? 'WebSocket Real-Time Connected: Instant slide sync active'
                      : wsStatus === 'connecting'
                      ? 'WebSocket Connecting...'
                      : 'WebSocket Reconnecting...'
                  }
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      wsStatus === 'connected'
                        ? 'bg-emerald-400 animate-pulse'
                        : wsStatus === 'connecting'
                        ? 'bg-amber-400 animate-ping'
                        : 'bg-rose-400'
                    }`}
                  />
                  <span>{wsStatus === 'connected' ? 'WS Live' : wsStatus === 'connecting' ? 'WS Sync' : 'WS Off'}</span>
                </div>

                {isPublished && (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                    ON AIR
                  </span>
                )}
              </div>
            </div>

            {/* 16:9 Aspect Ratio Live Screen */}
            <div className="w-full aspect-video rounded-xl overflow-hidden relative flex flex-col justify-between p-3.5 sm:p-4 text-center shadow-xl border border-stone-800/80 bg-black">
              {!activeSlide || isBlack ? (
                <div
                  id="live-screen-no-content"
                  className="absolute inset-0 bg-[#0a0a0c] z-20 flex flex-col items-center justify-center space-y-2.5 p-4 select-none cursor-pointer"
                  onClick={() => isBlack && setIsBlack(false)}
                  title={isBlack ? 'Blanked Screen (Click or press B to restore)' : undefined}
                >
                  <div className="w-10 h-10 rounded-full bg-[#18181b] border border-stone-800/80 flex items-center justify-center text-stone-300 shadow-inner">
                    <Monitor className="w-5 h-5 text-stone-200" strokeWidth={1.75} />
                  </div>
                  <div className="space-y-1 text-center max-w-[240px]">
                    <span className="text-xs font-bold tracking-wider uppercase text-stone-100 block font-sans">
                      No Content Selected
                    </span>
                    <span className="text-[10px] text-stone-400 block leading-relaxed font-sans">
                      Select a presentation slide, Bible verse, or song to preview and project
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Media Background Video / Image / Gradient */}
                  {activePreviewSource === 'default' ? (
                    (activeSlide.mediaType === 'video' || (activeSlide.mediaUrl && (activeSlide.mediaUrl.startsWith('data:video') || activeSlide.mediaUrl.endsWith('.mp4') || activeSlide.mediaUrl.endsWith('.webm') || activeSlide.mediaUrl.endsWith('.mov') || activeSlide.mediaUrl.endsWith('.m4v')))) && activeSlide.mediaUrl ? (
                      <video
                        src={activeSlide.mediaUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                      />
                    ) : activeSlide.mediaUrl || (activeSlide.bgType === 'image' && activeSlide.bgValue) ? (
                      <img
                        src={activeSlide.mediaUrl || activeSlide.bgValue}
                        alt=""
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full pointer-events-none bg-black" />
                    )
                  ) : effectiveCustomBg ? (
                    effectiveCustomBg.type === 'image' ? (
                      <img
                        src={effectiveCustomBg.value}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{ background: effectiveCustomBg.value }}
                      />
                    )
                  ) : (activeSlide.mediaType === 'video' || (activeSlide.mediaUrl && (activeSlide.mediaUrl.startsWith('data:video') || activeSlide.mediaUrl.endsWith('.mp4') || activeSlide.mediaUrl.endsWith('.webm') || activeSlide.mediaUrl.endsWith('.mov') || activeSlide.mediaUrl.endsWith('.m4v')))) && activeSlide.mediaUrl ? (
                    <video
                      src={activeSlide.mediaUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    />
                  ) : activeSlide.mediaUrl || (activeSlide.bgType === 'image' && activeSlide.bgValue) ? (
                    <img
                      src={activeSlide.mediaUrl || activeSlide.bgValue}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      style={activeSlide.bgValue && activeSlide.bgType !== 'image' ? { background: activeSlide.bgValue } : { background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)' }}
                    />
                  )}

                  {/* Dark Overlay for Readability only when text content exists */}
                  {(activeSlide.text || activeSlide.secondaryText) && (
                    <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                  )}

                  {/* Slide Reference / Title Tag at top with Apple Liquid Glass design (Bible only, omitted for Songs and Default slides) */}
                  {activeSlide.chapter > 0 && activeSlide.bookName && (
                    <div className="relative z-10 flex items-center justify-center">
                      <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-stone-100 px-3.5 py-1 rounded-full border border-white/30 dark:border-white/20 bg-white/15 dark:bg-stone-950/40 backdrop-blur-3xl backdrop-saturate-150 shadow-[0_4px_18px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.45)] max-w-[90%] truncate">
                        {`${activeSlide.bookName} ${activeSlide.chapter}:${activeSlide.verseNumber}`}
                      </span>
                    </div>
                  )}

                  {/* Text Content Overlay */}
                  <div className="relative z-10 space-y-1 max-w-full px-1.5 text-white my-auto">
                    {activeSlide.text && (
                      <h3 className="text-xs sm:text-sm md:text-[15px] font-bold leading-relaxed drop-shadow-md whitespace-pre-line">
                        {activeSlide.text}
                      </h3>
                    )}
                    {activeSlide.secondaryText && (
                      <p className="text-[9.5px] sm:text-[11px] opacity-85 italic font-normal pt-0.5 whitespace-pre-line">
                        {activeSlide.secondaryText}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Collapsible Background Dropdown */}
            <div className="border border-stone-800/90 rounded-xl bg-stone-950/70 overflow-hidden transition-all">
              {/* Collapsible Header Button */}
              <button
                type="button"
                onClick={() => setIsBgDropdownOpen((prev) => !prev)}
                className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-stone-800/50 cursor-pointer transition-colors"
                title="Customize Slide Background"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="p-1.5 rounded-lg shrink-0 bg-purple-500/10 text-purple-400">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-stone-200">
                        Slide Background
                      </span>
                      {customBg && (
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
                      )}
                    </div>
                    <p className="text-[9.5px] text-stone-400 truncate">
                      {customBg ? customBg.name || 'Custom active' : 'Theme default'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 ml-2">
                  {/* Active preview swatch */}
                  <div
                    className="w-4 h-4 rounded border border-stone-700 overflow-hidden shadow-xs shrink-0"
                    style={
                      customBg
                        ? customBg.type === 'image'
                          ? { backgroundImage: `url(${customBg.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                          : { background: customBg.value }
                        : { background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)' }
                    }
                    title={customBg?.name || 'Default Background'}
                  />
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isBgDropdownOpen ? 'rotate-180 text-purple-400' : 'text-stone-400'
                    }`}
                  />
                </div>
              </button>

              {/* Collapsible Dropdown Content */}
              {isBgDropdownOpen && (
                <div className="p-3 pt-2 border-t border-stone-800/80 space-y-3 bg-stone-900/60 animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* Presets Grid */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-stone-400 font-semibold uppercase tracking-wider">
                      <span>Gradient Presets</span>
                      {customBg && (
                        <button
                          type="button"
                          onClick={handleClearCustomBg}
                          className="text-[9.5px] text-purple-400 hover:text-purple-300 flex items-center space-x-1 cursor-pointer"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {GRADIENT_PRESETS.map((preset) => {
                        const isSelected = customBg?.value === preset.value;
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => handleSelectGradient(preset)}
                            style={{ background: preset.cssPreview }}
                            title={preset.name}
                            className={`h-7 rounded-lg border transition-all cursor-pointer relative group flex items-center justify-center ${
                              isSelected
                                ? 'border-purple-400 ring-2 ring-purple-400/70 scale-105 shadow-md shadow-purple-950/60 z-10'
                                : 'border-stone-700/80 hover:border-stone-500 hover:scale-102 opacity-90 hover:opacity-100'
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
                            )}
                            <span className="sr-only">{preset.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Web Link / Image URL */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block">
                      Web Link / Image URL
                    </label>
                    <form onSubmit={handleApplyUrlBackground} className="flex gap-1.5">
                      <div className="relative flex-1">
                        <LinkIcon className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          value={customBgUrlInput}
                          onChange={(e) => setCustomBgUrlInput(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-stone-950 text-xs text-stone-200 pl-7 pr-2 py-1.5 rounded-lg border border-stone-800 focus:border-purple-500 outline-hidden placeholder:text-stone-600"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!customBgUrlInput.trim()}
                        className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
                      >
                        Apply
                      </button>
                    </form>
                  </div>

                  {/* Upload Image from Device */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block">
                      Upload Image
                    </label>
                    <input
                      ref={bgFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUploadBackground}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => bgFileInputRef.current?.click()}
                      className="w-full py-2 px-3 bg-stone-950 hover:bg-stone-800 border border-dashed border-stone-700 hover:border-purple-500 text-stone-300 text-xs font-medium rounded-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-purple-400" />
                      <span>Upload Device Image</span>
                    </button>
                  </div>

                  {/* Current Custom Background Preview & Clear */}
                  {customBg && (
                    <div className="flex items-center justify-between pt-1.5 border-t border-stone-800/60 text-[10px]">
                      <span className="text-stone-400 truncate max-w-[150px]">
                        <strong className="text-stone-200">{customBg.name || 'Custom'}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={handleClearCustomBg}
                        className="text-rose-400 hover:text-rose-300 text-[9.5px] font-semibold flex items-center space-x-1 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                        <span>Clear</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation & Projection Actions */}
            <div className="space-y-2.5 pt-1">
              {/* Action Row: Prev / Next / Blank Screen (B) */}
              <div className="flex items-center justify-between gap-2">
                {currentSlides.length > 1 && (
                  <>
                    <button
                      id="btn-prev-slide"
                      onClick={() => {
                        setPreviewIndex((prev) => Math.max(0, prev - 1));
                        setIsBlack(false);
                      }}
                      disabled={previewIndex === 0}
                      className="flex-1 py-1.5 bg-stone-950 hover:bg-stone-800 disabled:opacity-40 text-stone-200 border border-stone-800 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Prev</span>
                    </button>

                    <button
                      id="btn-next-slide"
                      onClick={() => {
                        setPreviewIndex((prev) => Math.min(currentSlides.length - 1, prev + 1));
                        setIsBlack(false);
                      }}
                      disabled={previewIndex >= currentSlides.length - 1}
                      className="flex-1 py-1.5 bg-stone-950 hover:bg-stone-800 disabled:opacity-40 text-stone-200 border border-stone-800 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                <button
                  id="btn-blank-screen"
                  type="button"
                  onClick={handleBlankScreenAndUnselect}
                  className={`py-1.5 px-3 rounded-lg border text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                    currentSlides.length <= 1 ? 'w-full' : ''
                  } ${
                    isBlack || !activeSlide
                      ? 'bg-stone-900/90 text-stone-400 border-stone-800 hover:bg-stone-800 hover:text-stone-200'
                      : 'bg-stone-950 hover:bg-stone-800 text-stone-200 border-stone-800 hover:border-purple-500/50'
                  }`}
                  title="Blank screen and unselect content (B)"
                >
                  <EyeOff className="w-3.5 h-3.5 text-stone-400" />
                  <span>Blank (B)</span>
                </button>
              </div>

              {/* Primary Live / Stop Button */}
              {isPublished ? (
                <button
                  id="btn-stop-live-projection"
                  onClick={handleStopPublishing}
                  className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-rose-600/25 active:scale-95"
                  title="Stop projecting live"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Stop Live</span>
                </button>
              ) : (
                <button
                  id="btn-start-live-projection"
                  onClick={handlePublishToLive}
                  className="w-full py-2.5 px-4 bg-white hover:bg-stone-100 text-stone-950 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg active:scale-95"
                  title="Start live projection in external tab/window"
                >
                  <Radio className="w-4 h-4 text-purple-600 animate-pulse" />
                  <span>Live</span>
                </button>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* ================= ADD / EDIT SLIDE MODAL ================= */}
      {isSlideModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl space-y-5 p-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-purple-600/20 text-purple-400 rounded-xl">
                  {editingSlideIndex !== null ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-100">
                    {editingSlideIndex !== null ? 'Edit Presentation Slide' : 'Add New Presentation Slide'}
                  </h3>
                  <p className="text-xs text-stone-400">
                    Customize titles, text content, and upload background media (images/videos).
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSlideModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-1">
              {/* Slide Title */}
              <div>
                <label className="text-xs font-semibold text-stone-300 mb-1 block">
                  Slide Title / Header
                </label>
                <input
                  type="text"
                  value={slideFormTitle}
                  onChange={(e) => setSlideFormTitle(e.target.value)}
                  placeholder="e.g. Welcome to Church, Call to Worship, Announcement..."
                  className="w-full bg-stone-950 text-xs text-stone-100 px-3.5 py-2.5 rounded-xl border border-stone-800 focus:border-purple-500 outline-hidden"
                />
              </div>

              {/* Main Text */}
              <div>
                <label className="text-xs font-semibold text-stone-300 mb-1 block">
                  Primary Text / Message
                </label>
                <textarea
                  rows={3}
                  value={slideFormText}
                  onChange={(e) => setSlideFormText(e.target.value)}
                  placeholder="Enter main verse, lyric, or announcement text..."
                  className="w-full bg-stone-950 text-xs text-stone-100 px-3.5 py-2.5 rounded-xl border border-stone-800 focus:border-purple-500 outline-hidden resize-y"
                />
              </div>

              {/* Secondary Text */}
              <div>
                <label className="text-xs font-semibold text-stone-300 mb-1 block">
                  Secondary Text (e.g. Tamil Translation or Subtitle)
                </label>
                <textarea
                  rows={2}
                  value={slideFormSecondaryText}
                  onChange={(e) => setSlideFormSecondaryText(e.target.value)}
                  placeholder="e.g. கர்த்தருடைய பரிசுத்த ஆலயத்திற்கு அன்புடன் வரவேற்கிறோம்..."
                  className="w-full bg-stone-950 text-xs text-stone-100 px-3.5 py-2.5 rounded-xl border border-stone-800 focus:border-purple-500 outline-hidden resize-y"
                />
              </div>

              {/* Media Background Upload */}
              <div className="space-y-2 bg-stone-950/80 p-4 rounded-xl border border-stone-800">
                <label className="text-xs font-semibold text-stone-200 block flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Upload className="w-4 h-4 text-purple-400" />
                    <span>Upload Image or Video Background</span>
                  </span>
                  <span className="text-[10px] text-stone-400 font-normal">Supports PNG, JPG, MP4, WEBM</span>
                </label>

                {/* File input button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <label className="flex-1 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2">
                    <Upload className="w-4 h-4 text-purple-400" />
                    <span>Choose Image or Video File</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {slideFormMediaUrl && (
                    <button
                      onClick={() => setSlideFormMediaUrl('')}
                      className="px-3 py-2.5 bg-stone-900 hover:bg-red-900/40 text-red-400 border border-stone-800 hover:border-red-800 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Clear Media</span>
                    </button>
                  )}
                </div>

                {/* Web URL input alternative */}
                <div className="pt-2">
                  <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider mb-1 block">
                    Or Enter Image / Video Direct URL:
                  </span>
                  <input
                    type="text"
                    value={slideFormMediaUrl}
                    onChange={(e) => {
                      setSlideFormMediaUrl(e.target.value);
                      if (e.target.value.match(/\.(mp4|webm|mov|m4v)$/i)) {
                        setSlideFormMediaType('video');
                      } else {
                        setSlideFormMediaType('image');
                      }
                    }}
                    placeholder="https://images.unsplash.com/... or https://domain.com/video.mp4"
                    className="w-full bg-stone-900 text-xs text-stone-100 px-3 py-2 rounded-xl border border-stone-800 focus:border-purple-500 outline-hidden font-mono"
                  />
                </div>

                {/* Media Preview Box */}
                {slideFormMediaUrl && (
                  <div className="mt-3 relative rounded-xl overflow-hidden border border-stone-800 bg-black max-h-44 flex items-center justify-center">
                    {slideFormMediaType === 'video' || (slideFormMediaUrl.startsWith('data:video') || slideFormMediaUrl.match(/\.(mp4|webm|mov|m4v)$/i)) ? (
                      <video
                        src={slideFormMediaUrl}
                        controls
                        muted
                        className="max-h-44 w-full object-contain"
                      />
                    ) : (
                      <img
                        src={slideFormMediaUrl}
                        alt="Preview"
                        className="max-h-44 w-full object-cover"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-800">
              <button
                onClick={() => setIsSlideModalOpen(false)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSlideForm}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-purple-600/30 cursor-pointer active:scale-95"
              >
                {editingSlideIndex !== null ? 'Save Changes' : 'Create Slide'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

