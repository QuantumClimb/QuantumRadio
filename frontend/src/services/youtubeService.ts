interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (volume: number) => void;
  loadVideoById: (videoId: string) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  destroy: () => void;
}

interface YouTubeEvent {
  data: number;
  target: YouTubePlayer;
}

type PlayerCallback = (player: YouTubePlayer) => void;
type StateChangeCallback = (isPlaying: boolean) => void;

class YouTubeService {
  private static instance: YouTubeService;
  private player: YouTubePlayer | null = null;
  private isApiReady = false;
  private isPlayerReady = false;
  private playerReadyCallbacks: PlayerCallback[] = [];
  private stateChangeCallbacks: StateChangeCallback[] = [];
  private currentVideoId: string | null = null;

  private constructor() {
    this.initializeYouTubeAPI();
  }

  static getInstance(): YouTubeService {
    if (!YouTubeService.instance) {
      YouTubeService.instance = new YouTubeService();
    }
    return YouTubeService.instance;
  }

  // Helper function to validate YouTube video ID
  private isValidVideoId(videoId: string): boolean {
    if (!videoId || typeof videoId !== 'string') return false;
    // YouTube video IDs are typically 11 characters long and contain alphanumeric characters, hyphens, and underscores
    const videoIdRegex = /^[a-zA-Z0-9_-]{11}$/;
    return videoIdRegex.test(videoId);
  }

  private initializeYouTubeAPI() {
    if (document.getElementById('youtube-api-script')) return;

    const tag = document.createElement('script');
    tag.id = 'youtube-api-script';
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      this.isApiReady = true;
      if (this.currentVideoId && this.isValidVideoId(this.currentVideoId)) {
        this.createPlayer();
      }
    };
  }

  private createPlayer() {
    if (!this.currentVideoId || !this.isValidVideoId(this.currentVideoId)) {
      console.warn('Cannot create player: Invalid video ID', this.currentVideoId);
      return;
    }

    if (!document.getElementById('youtube-player')) {
      const playerContainer = document.createElement('div');
      playerContainer.id = 'youtube-player';
      playerContainer.style.width = '0';
      playerContainer.style.height = '0';
      playerContainer.style.position = 'absolute';
      playerContainer.style.left = '-9999px';
      document.body.appendChild(playerContainer);
    }

    try {
      // @ts-ignore - YT is loaded by the iframe API
      this.player = new YT.Player('youtube-player', {
        videoId: this.currentVideoId,
        playerVars: {
          autoplay: 0, // Don't autoplay initially
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          origin: window.location.origin,
          playsinline: 1,
          iv_load_policy: 3, // Disable annotations
          modestbranding: 1,
        },
        events: {
          onReady: () => {
            console.log('YouTube player ready');
            this.isPlayerReady = true;
            this.playerReadyCallbacks.forEach(callback => {
              try {
                callback(this.player!);
              } catch (error) {
                console.error('Error in player ready callback:', error);
              }
            });
          },
          onStateChange: (event: YouTubeEvent) => {
            // YouTube states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
            const isPlaying = event.data === 1;
            this.stateChangeCallbacks.forEach(callback => {
              try {
                callback(isPlaying);
              } catch (error) {
                console.error('Error in state change callback:', error);
              }
            });
          },
          onError: (event: any) => {
            console.error('YouTube player error:', event);
            // Handle different error codes
            switch (event.data) {
              case 2:
                console.error('Invalid video ID');
                break;
              case 5:
                console.error('HTML5 player error');
                break;
              case 100:
                console.error('Video not found or private');
                break;
              case 101:
              case 150:
                console.error('Video not available in embedded players');
                break;
              default:
                console.error('Unknown YouTube player error');
            }
          },
        },
      });
    } catch (error) {
      console.error('Failed to create YouTube player:', error);
    }
  }

  onPlayerReady(callback: PlayerCallback) {
    if (this.player && this.isPlayerReady) {
      callback(this.player);
    } else {
      this.playerReadyCallbacks.push(callback);
    }
  }

  onStateChange(callback: StateChangeCallback) {
    this.stateChangeCallbacks.push(callback);
  }

  loadVideo(videoId: string) {
    if (!videoId || !this.isValidVideoId(videoId)) {
      console.error('Invalid video ID provided:', videoId);
      return;
    }

    this.currentVideoId = videoId;
    
    if (this.player && this.isPlayerReady) {
      try {
        this.player.loadVideoById(videoId);
      } catch (error) {
        console.error('Error loading video:', error);
      }
    } else if (this.isApiReady) {
      this.createPlayer();
    }
  }

  playVideo() {
    if (this.player && this.isPlayerReady) {
      try {
        this.player.playVideo();
      } catch (error) {
        console.error('Error playing video:', error);
      }
    }
  }

  pauseVideo() {
    if (this.player && this.isPlayerReady) {
      try {
        this.player.pauseVideo();
      } catch (error) {
        console.error('Error pausing video:', error);
      }
    }
  }

  setVolume(volume: number) {
    if (this.player && this.isPlayerReady) {
      try {
        this.player.setVolume(Math.round(Math.max(0, Math.min(100, volume * 100))));
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    }
  }

  getCurrentTime(): number {
    if (this.player && this.isPlayerReady) {
      try {
        return this.player.getCurrentTime() || 0;
      } catch (error) {
        console.error('Error getting current time:', error);
      }
    }
    return 0;
  }

  getDuration(): number {
    if (this.player && this.isPlayerReady) {
      try {
        return this.player.getDuration() || 0;
      } catch (error) {
        console.error('Error getting duration:', error);
      }
    }
    return 0;
  }

  seekTo(seconds: number) {
    if (this.player && this.isPlayerReady) {
      try {
        this.player.seekTo(seconds, true);
      } catch (error) {
        console.error('Error seeking:', error);
      }
    }
  }

  destroy() {
    if (this.player) {
      try {
        this.player.destroy();
      } catch (error) {
        console.error('Error destroying player:', error);
      }
      this.player = null;
    }
    this.isPlayerReady = false;
    this.playerReadyCallbacks = [];
    this.stateChangeCallbacks = [];
  }
}

export const youtubeService = YouTubeService.getInstance(); 