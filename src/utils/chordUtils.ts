// Chromatic scale notes using sharps and flats
const CHROMATIC_SCALE = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

export const ALL_KEYS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

// Map aliases to standard chromatic representation
const NOTE_ALIASES: Record<string, string> = {
  'Db': 'C#',
  'D#': 'Eb',
  'Gb': 'F#',
  'G#': 'Ab',
  'A#': 'Bb',
};

export function normalizeNote(note: string): string {
  const trimmed = note.trim();
  return NOTE_ALIASES[trimmed] || trimmed;
}

export function transposeNote(note: string, semitones: number): string {
  if (!note) return note;

  // Extract root note vs chord suffix (e.g., "F#m7/C#" -> root "F#", suffix "m7", bass "C#")
  let root = note;
  let bass = '';

  if (note.includes('/')) {
    const parts = note.split('/');
    root = parts[0];
    bass = parts[1];
  }

  // Handle chord qualities like m, m7, maj7, 2, sus4, add9, 7
  let rootNote = root;
  let suffix = '';

  const match = root.match(/^([A-G][#b]?)(.*)$/);
  if (match) {
    rootNote = match[1];
    suffix = match[2];
  }

  const normalizedRoot = normalizeNote(rootNote);
  const index = CHROMATIC_SCALE.indexOf(normalizedRoot);

  if (index === -1) {
    return note; // If unknown format, return as is
  }

  let newIndex = (index + semitones) % 12;
  if (newIndex < 0) newIndex += 12;

  const newRoot = CHROMATIC_SCALE[newIndex] + suffix;

  if (bass) {
    const newBass = transposeNote(bass, semitones);
    return `${newRoot}/${newBass}`;
  }

  return newRoot;
}

// Transposes entire lyric string with [Chord] brackets
export function transposeLyrics(lyricsWithChords: string, semitones: number): string {
  if (semitones === 0) return lyricsWithChords;

  return lyricsWithChords.replace(/\[([A-G][#b]?[^\]]*)\]/g, (_, chord) => {
    const transposed = transposeNote(chord, semitones);
    return `[${transposed}]`;
  });
}

// Simple guitar chord diagram definitions for popular chords
export interface ChordDiagram {
  name: string;
  frets: number[]; // -1 = muted (X), 0 = open (O), 1..4 = fret number [E, A, D, G, B, e]
  fingers?: number[];
}

export const GUITAR_CHORD_DIAGRAMS: Record<string, ChordDiagram> = {
  'C': { name: 'C Major', frets: [-1, 3, 2, 0, 1, 0] },
  'C2': { name: 'C2 / Cadd9', frets: [-1, 3, 2, 0, 3, 3] },
  'Cadd9': { name: 'Cadd9', frets: [-1, 3, 2, 0, 3, 3] },
  'D': { name: 'D Major', frets: [-1, -1, 0, 2, 3, 2] },
  'D/F#': { name: 'D over F#', frets: [2, 0, 0, 2, 3, 2] },
  'Dsus4': { name: 'D Sus4', frets: [-1, -1, 0, 2, 3, 3] },
  'E': { name: 'E Major', frets: [0, 2, 2, 1, 0, 0] },
  'Em': { name: 'E Minor', frets: [0, 2, 2, 0, 0, 0] },
  'Em7': { name: 'E Minor 7', frets: [0, 2, 2, 0, 3, 3] },
  'F': { name: 'F Major', frets: [1, 3, 3, 2, 1, 1] },
  'F#m': { name: 'F# Minor', frets: [2, 4, 4, 2, 2, 2] },
  'G': { name: 'G Major', frets: [3, 2, 0, 0, 3, 3] },
  'G/D': { name: 'G over D', frets: [-1, -1, 0, 0, 3, 3] },
  'A': { name: 'A Major', frets: [-1, 0, 2, 2, 2, 0] },
  'A2': { name: 'A2 / Asus2', frets: [-1, 0, 2, 2, 0, 0] },
  'Am': { name: 'A Minor', frets: [-1, 0, 2, 2, 1, 0] },
  'Am7': { name: 'A Minor 7', frets: [-1, 0, 2, 0, 1, 0] },
  'B': { name: 'B Major', frets: [-1, 2, 4, 4, 4, 2] },
  'Bm': { name: 'B Minor', frets: [-1, 2, 4, 4, 3, 2] },
  'Bb': { name: 'Bb Major', frets: [-1, 1, 3, 3, 3, 1] },
};

export function getChordDiagram(chordName: string): ChordDiagram | null {
  // Strip slash notes if not exact match
  const cleanName = chordName.trim();
  if (GUITAR_CHORD_DIAGRAMS[cleanName]) {
    return GUITAR_CHORD_DIAGRAMS[cleanName];
  }
  const rootOnly = cleanName.split('/')[0];
  if (GUITAR_CHORD_DIAGRAMS[rootOnly]) {
    return GUITAR_CHORD_DIAGRAMS[rootOnly];
  }
  const baseRoot = rootOnly.replace(/m7|7|2|maj7|sus4|add9/, '');
  if (GUITAR_CHORD_DIAGRAMS[baseRoot]) {
    return GUITAR_CHORD_DIAGRAMS[baseRoot];
  }
  return null;
}
