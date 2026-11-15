// Audio player for wedding invitations
// Plays chosen YouTube song (or audio source) with seamless fallback to procedural ambient acoustic synth
import { weddingData } from '../data/weddingData';

class AmbientWeddingAudio {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.gainNode = null;
    this.tempo = 72;
    this.currentStep = 0;

    this.notes = [
      [261.63, 329.63, 392.00, 493.88, 523.25],
      [392.00, 523.25, 659.25],
      [329.63, 493.88],
      [392.00, 587.33],
      [220.00, 261.63, 329.63, 392.00, 493.88],
      [329.63, 440.00, 659.25],
      [261.63, 392.00],
      [329.63, 523.25],
      [174.61, 261.63, 329.63, 349.23, 440.00],
      [261.63, 349.23, 523.25],
      [220.00, 329.63],
      [261.63, 440.00, 659.25],
      [196.00, 293.66, 392.00, 440.00, 587.33],
      [293.66, 392.00, 523.25],
      [246.94, 392.00],
      [293.66, 493.88, 659.25],
    ];
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
        this.gainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPluck(freq, delay = 0, volume = 0.12) {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

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
    const currentChordNotes = this.notes[this.currentStep % this.notes.length];
    currentChordNotes.forEach((freq, idx) => {
      this.playPluck(freq, idx * 0.12, 0.08);
    });
    this.currentStep = (this.currentStep + 1) % this.notes.length;
    const stepDurationMs = (60 / this.tempo) * 1000 * 1.5;
    this.timer = setTimeout(() => this.tick(), stepDurationMs);
  }

  play() {
    this.init();
    if (!this.ctx) return;
    this.isPlaying = true;
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
}

class WeddingAudioManager {
  constructor() {
    this.isPlaying = false;
    this.isPlayerReady = false;
    this.pendingPlay = false;
    this.hasError = false;
    this.player = null;
    this.listeners = new Set();
    this.fallbackAudio = new AmbientWeddingAudio();
    this.youtubeId = weddingData.music?.youtubeId || 'IVTYOsaO0Mw';

    if (typeof window !== 'undefined') {
      // Lazy init on DOM readiness
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(() => this.initYouTubePlayer(), 300);
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          setTimeout(() => this.initYouTubePlayer(), 300);
        });
      }
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.isPlaying);
    return () => this.listeners.delete(callback);
  }

  notify(state) {
    this.listeners.forEach((cb) => {
      try {
        cb(state);
      } catch (err) {
        console.error('Audio listener error:', err);
      }
    });
  }

  initYouTubePlayer() {
    if (typeof window === 'undefined' || this.player || this.hasError) return;

    try {
      // Create hidden offscreen container with adequate size for browser active render
      let container = document.getElementById('wedding-yt-audio-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'wedding-yt-audio-container';
        container.setAttribute('aria-hidden', 'true');
        container.style.cssText =
          'position:fixed;bottom:0;left:-9999px;width:200px;height:200px;opacity:0.001;pointer-events:none;z-index:-9999;';
        document.body.appendChild(container);

        const iframeTarget = document.createElement('div');
        iframeTarget.id = 'wedding-yt-iframe-slot';
        container.appendChild(iframeTarget);
      }

      const createPlayer = () => {
        if (!window.YT || !window.YT.Player) return;
        this.player = new window.YT.Player('wedding-yt-iframe-slot', {
          height: '200',
          width: '200',
          videoId: this.youtubeId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            loop: 1,
            playlist: this.youtubeId,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: (event) => {
              this.isPlayerReady = true;
              try {
                event.target.setVolume(80);
              } catch (e) {}

              if (this.pendingPlay) {
                this.pendingPlay = false;
                try {
                  event.target.playVideo();
                } catch (e) {
                  this.fallbackAudio.play();
                }
              }
            },
            onStateChange: (event) => {
              // 1: PLAYING, 2: PAUSED, 0: ENDED
              if (window.YT && event.data === window.YT.PlayerState.PLAYING) {
                this.isPlaying = true;
                this.notify(true);
              } else if (
                window.YT &&
                (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED)
              ) {
                if (event.data === window.YT.PlayerState.ENDED) {
                  // Loop video smoothly
                  try {
                    event.target.seekTo(0);
                    event.target.playVideo();
                    return;
                  } catch (e) {}
                }
                this.isPlaying = false;
                this.notify(false);
              }
            },
            onError: (err) => {
              console.warn('YouTube audio player error, fallback to ambient synth', err);
              this.hasError = true;
              if (this.isPlaying) {
                this.fallbackAudio.play();
              }
            },
          },
        });
      };

      if (window.YT && window.YT.Player) {
        createPlayer();
      } else {
        const prevCallback = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (typeof prevCallback === 'function') prevCallback();
          createPlayer();
        };

        if (!document.getElementById('yt-iframe-api-tag')) {
          const tag = document.createElement('script');
          tag.id = 'yt-iframe-api-tag';
          tag.src = 'https://www.youtube.com/iframe_api';
          const firstScriptTag = document.getElementsByTagName('script')[0];
          if (firstScriptTag && firstScriptTag.parentNode) {
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
          } else {
            document.head.appendChild(tag);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to initialize YouTube Audio Player:', e);
      this.hasError = true;
    }
  }

  play() {
    this.isPlaying = true;
    this.notify(true);

    if (this.hasError) {
      this.fallbackAudio.play();
      return;
    }

    if (!this.player) {
      this.initYouTubePlayer();
    }

    if (this.isPlayerReady && this.player && typeof this.player.playVideo === 'function') {
      try {
        this.player.playVideo();
      } catch (err) {
        console.warn('playVideo error, fallback:', err);
        this.fallbackAudio.play();
      }
    } else {
      this.pendingPlay = true;
      // Fallback timer if YouTube takes too long or is blocked
      setTimeout(() => {
        if (this.pendingPlay && !this.isPlayerReady) {
          console.log('YouTube loading delay, fallback to ambient audio');
          this.fallbackAudio.play();
        }
      }, 4000);
    }
  }

  pause() {
    this.isPlaying = false;
    this.pendingPlay = false;
    this.notify(false);

    if (this.isPlayerReady && this.player && typeof this.player.pauseVideo === 'function') {
      try {
        this.player.pauseVideo();
      } catch (e) {}
    }
    if (this.fallbackAudio.isPlaying) {
      this.fallbackAudio.pause();
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

export const weddingAudio = new WeddingAudioManager();
