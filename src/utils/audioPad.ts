import { AmbientPadKey } from '../types';

class WorshipPadEngine {
  private ctx: AudioContext | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private masterGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private isPlaying: boolean = false;
  private currentKey: AmbientPadKey = 'G';
  private volume: number = 0.35;

  private keyFrequencies: Record<AmbientPadKey, number[]> = {
    'C': [130.81, 196.00, 261.63, 392.00], // C3, G3, C4, G4
    'D': [146.83, 220.00, 293.66, 440.00], // D3, A3, D4, A4
    'E': [164.81, 246.94, 329.63, 493.88], // E3, B3, E4, B4
    'F': [174.61, 261.63, 349.23, 523.25], // F3, C4, F4, C5
    'G': [196.00, 293.66, 392.00, 587.33], // G3, D4, G4, D5
    'A': [220.00, 329.63, 440.00, 659.25], // A3, E4, A4, E5
    'B': [246.94, 369.99, 493.88, 739.99], // B3, F#4, B4, F#5
  };

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  public play(key: AmbientPadKey = 'G') {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.stopOscillators();
    this.currentKey = key;

    const freqs = this.keyFrequencies[key] || this.keyFrequencies['G'];

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 2.0); // 2 sec warm fade in

    // Lowpass filter for smooth pad sound
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(450, this.ctx.currentTime); // Warm cutoff

    // Connect Filter to Gain to Destination
    this.filter.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    // Create detuned sine/triangle oscillators
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.filter) return;

      // Primary warm triangle wave
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc1.detune.setValueAtTime((idx % 2 === 0 ? 3 : -3), this.ctx.currentTime);

      // Sub warm sine wave for root body
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc2.detune.setValueAtTime((idx % 2 === 0 ? -4 : 4), this.ctx.currentTime);

      osc1.connect(this.filter);
      osc2.connect(this.filter);

      osc1.start();
      osc2.start();

      this.activeOscillators.push(osc1, osc2);
    });

    this.isPlaying = true;
  }

  public stop() {
    if (!this.masterGain || !this.ctx) {
      this.isPlaying = false;
      return;
    }

    // Soft fade out over 1.5s
    const now = this.ctx.currentTime;
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.5);

    setTimeout(() => {
      this.stopOscillators();
      this.isPlaying = false;
    }, 1500);
  }

  private stopOscillators() {
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Ignore already stopped
      }
    });
    this.activeOscillators = [];
  }

  public setKey(key: AmbientPadKey) {
    this.currentKey = key;
    if (this.isPlaying) {
      this.play(key); // smooth crossfade restart
    }
  }

  public setVolume(vol: number) {
    this.volume = vol;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.1);
    }
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      key: this.currentKey,
      volume: this.volume,
    };
  }
}

export const padEngine = new WorshipPadEngine();
