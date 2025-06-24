interface YT {
  Player: {
    new (
      elementId: string,
      options: {
        videoId: string;
        playerVars?: {
          autoplay?: 0 | 1;
          controls?: 0 | 1;
          disablekb?: 0 | 1;
          fs?: 0 | 1;
          rel?: 0 | 1;
          origin?: string;
        };
        events?: {
          onReady?: (event: { target: YT.Player }) => void;
          onStateChange?: (event: { data: number }) => void;
          onError?: (event: { data: number }) => void;
        };
      }
    ): YT.Player;
  };
  PlayerState: {
    UNSTARTED: -1;
    ENDED: 0;
    PLAYING: 1;
    PAUSED: 2;
    BUFFERING: 3;
    CUED: 5;
  };
}

interface Window {
  YT: YT;
  onYouTubeIframeAPIReady: () => void;
} 