// Procedural ambient romantic acoustic music box generator for wedding invitations
// Works offline, zero bandwidth, zero CORS issues, smooth fade in/out

class AmbientWeddingAudio {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.gainNode = null;
    this.tempo = 72; // bpm
    this.currentStep = 0;

    // Romantic chord progression notes (frequencies in Hz)
    // Chords: Cmaj7 -> Am9 -> Fmaj7 -> Gsus4 -> Em7
    this.notes = [
      // Step 0 - Cmaj7
      [261.63, 329.63, 392.00, 493.88, 523.25],
      [392.00, 523.25, 659.25],
      [329.63, 493.88],
      [392.00, 587.33],
      // Step 1 - Am9
      [220.00, 261.63, 329.63, 392.00, 493.88],
      [329.63, 440.00, 659.25],
      [261.63, 392.00],
      [329.63, 523.25],
      // Step 2 - Fmaj7
      [174.61, 261.63, 329.63, 349.23, 440.00],
      [261.63, 349.23, 523.25],
      [220.00, 329.63],
      [261.63, 440.00, 659.25],
      // Step 3 - Gsus4 / G7
      [196.00, 293.66, 392.00, 440.00, 587.33],
      [293.66, 392.00, 523.25],
      [246.94, 392.00],
      [293.66, 493.88, 659.25],
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPluck(freq, delay = 0, volume = 0.12) {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime + delay;

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    // Use sine + subtle triangle for warm rhodes/music-box chime tone
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Warm envelope
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(volume, now + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(volume * 0.4, now + 0.5);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

    osc.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(now);
    osc.stop(now + 2.3);
  }

  tick() {
    if (!this.isPlaying) return;
    const chordsList = this.notes;
    const currentChordNotes = chordsList[this.currentStep % chordsList.length];

    currentChordNotes.forEach((freq, idx) => {
      // Arpeggiate slightly
      this.playPluck(freq, idx * 0.12, 0.08);
    });

    this.currentStep = (this.currentStep + 1) % chordsList.length;

    const stepDurationMs = (60 / this.tempo) * 1000 * 1.5;
    this.timer = setTimeout(() => this.tick(), stepDurationMs);
  }

  play() {
    this.init();
    this.isPlaying = true;

    // Fade in master volume
    const now = this.ctx.currentTime;
    this.gainNode.gain.cancelScheduledValues(now);
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
    this.gainNode.gain.linearRampToValueAtTime(0.35, now + 1.2);

    this.tick();
  }

  pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.gainNode && this.ctx) {
      const now = this.ctx.currentTime;
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
      this.gainNode.gain.linearRampToValueAtTime(0.001, now + 0.8);
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }
}

export const weddingAudio = new AmbientWeddingAudio();
