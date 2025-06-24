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

  private initializeYouTubeAPI() {
    if (document.getElementById('youtube-api-script')) return;

    const tag = document.createElement('script');
    tag.id = 'youtube-api-script';
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      this.isApiReady = true;
      this.createPlayer();
    };
  }

  private createPlayer() {
    if (!document.getElementById('youtube-player')) {
      const playerContainer = document.createElement('div');
      playerContainer.id = 'youtube-player';
      playerContainer.style.width = '0';
      playerContainer.style.height = '0';
      document.body.appendChild(playerContainer);
    }

    // @ts-ignore - YT is loaded by the iframe API
    this.player = new YT.Player('youtube-player', {
      videoId: this.currentVideoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        rel: 0,
        origin: window.location.origin,
        playsinline: 1,
      },
      events: {
        onReady: () => {
          this.playerReadyCallbacks.forEach(callback => callback(this.player!));
        },
        onStateChange: (event: YouTubeEvent) => {
          // YouTube states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering)
          this.stateChangeCallbacks.forEach(callback => callback(event.data === 1));
        },
      },
    });
  }

  onPlayerReady(callback: PlayerCallback) {
    if (this.player) {
      callback(this.player);
    }
    this.playerReadyCallbacks.push(callback);
  }

  onStateChange(callback: StateChangeCallback) {
    this.stateChangeCallbacks.push(callback);
  }

  loadVideo(videoId: string) {
    this.currentVideoId = videoId;
    if (this.player) {
      this.player.loadVideoById(videoId);
    } else if (this.isApiReady) {
      this.createPlayer();
    }
  }

  playVideo() {
    this.player?.playVideo();
  }

  pauseVideo() {
    this.player?.pauseVideo();
  }

  setVolume(volume: number) {
    this.player?.setVolume(Math.round(volume * 100));
  }

  getCurrentTime(): number {
    return this.player?.getCurrentTime() || 0;
  }

  getDuration(): number {
    return this.player?.getDuration() || 0;
  }

  seekTo(seconds: number) {
    this.player?.seekTo(seconds, true);
  }

  destroy() {
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }
    this.playerReadyCallbacks = [];
    this.stateChangeCallbacks = [];
  }
}

export const youtubeService = YouTubeService.getInstance(); 