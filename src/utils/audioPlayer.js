// Audio player for wedding invitations
// Plays the chosen wedding song: 삐그덕 (Seesaw) - Crush Feat. IU
import { weddingData } from '../data/weddingData';

// Immediately close/silence any old web audio synth context that might still be lingering
if (typeof window !== 'undefined') {
  try {
    if (window.__weddingOldAudioCtx) {
      window.__weddingOldAudioCtx.close();
      window.__weddingOldAudioCtx = null;
    }
  } catch {}
}

class WeddingAudioManager {
  constructor() {
    this.isPlaying = false;
    this.isPlayerReady = false;
    this.pendingPlay = false;
    this.hasError = false;
    this.player = null;
    this.listeners = new Set();
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
                event.target.setVolume(85);
              } catch (e) {}

              if (this.pendingPlay) {
                this.pendingPlay = false;
                try {
                  event.target.playVideo();
                } catch (e) {}
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
              console.warn('YouTube audio player error:', err);
              this.hasError = true;
              this.isPlaying = false;
              this.notify(false);
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

    if (!this.player) {
      this.initYouTubePlayer();
    }

    if (this.isPlayerReady && this.player && typeof this.player.playVideo === 'function') {
      try {
        this.player.playVideo();
      } catch (err) {
        console.warn('playVideo error:', err);
      }
    } else {
      this.pendingPlay = true;
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
