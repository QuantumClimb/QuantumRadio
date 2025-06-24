import React, { useEffect, useState } from 'react';
import { useAudioStore } from '@/services/audioService';
import { fetchTrackById, type Track } from '@/services/trackService';
import { Volume2, VolumeX, Play, Pause, SkipBack, SkipForward, Minimize2, ExternalLink } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { youtubeService } from '@/services/youtubeService';
import ThumbnailImage from './ThumbnailImage';

interface AudioPlayerProps {
  videoId: string;
  onEnded?: () => void;
}

export function AudioPlayer({ videoId, onEnded }: AudioPlayerProps) {
  const { isPlaying, volume, setIsPlaying, setVolume } = useAudioStore();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!videoId) {
      console.warn('No video ID provided to AudioPlayer');
      return;
    }

    loadCurrentTrack();
    youtubeService.loadVideo(videoId);
    youtubeService.onStateChange(setIsPlaying);
    
    // Wait for player to be ready before setting volume
    youtubeService.onPlayerReady(() => {
      youtubeService.setVolume(volume);
    });

    // Set up progress tracking
    const progressInterval = setInterval(() => {
      const current = youtubeService.getCurrentTime();
      const total = youtubeService.getDuration();
      if (current && total && total > 0) {
        setCurrentTime(current);
        setDuration(total);
        setProgress((current / total) * 100);
      }
    }, 1000);

    return () => clearInterval(progressInterval);
  }, [videoId]);

  useEffect(() => {
    // Only set volume if player is ready
    youtubeService.onPlayerReady(() => {
      youtubeService.setVolume(volume);
    });
  }, [volume]);

  const loadCurrentTrack = async () => {
    try {
      const track = await fetchTrackById(videoId);
      setCurrentTrack(track);
    } catch (error) {
      console.error('Failed to load current track:', error);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      youtubeService.pauseVideo();
    } else {
      youtubeService.playVideo();
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
  };

  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0];
    const seekTime = (newProgress / 100) * duration;
    youtubeService.seekTo(seekTime);
    setProgress(newProgress);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const playerContent = (
    <>
      {/* Progress Bar */}
      <div className="w-full mb-3">
        <Slider
          value={[progress]}
          onValueChange={handleProgressChange}
          max={100}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Track Info */}
        {currentTrack && (
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative">
              <ThumbnailImage
                videoId={currentTrack.video_id}
                title={currentTrack.title}
                className="w-12 h-12 rounded-lg object-cover"
                thumbnailUrl={currentTrack.thumbnail}
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-white text-sm line-clamp-1">
                {currentTrack.title}
              </h4>
              <p className="text-xs text-quantum-accent line-clamp-1">
                {currentTrack.channel_title}
              </p>
              
              {/* Track Stats */}
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                {currentTrack.view_count && (
                  <span>{formatNumber(currentTrack.view_count)} views</span>
                )}
                {currentTrack.likes && (
                  <span>{formatNumber(currentTrack.likes)} likes</span>
                )}
              </div>
            </div>

            {/* External Link */}
            <a
              href={`https://youtube.com/watch?v=${currentTrack.video_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors p-1"
              title="Watch on YouTube"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-quantum-accent hover:text-quantum-accent/80"
            onClick={() => {/* TODO: Previous track */}}
          >
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-quantum-accent hover:text-quantum-accent/80 bg-white/10 hover:bg-white/20"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-quantum-accent hover:text-quantum-accent/80"
            onClick={() => {/* TODO: Next track */}}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 min-w-[120px]">
          <Button
            variant="ghost"
            size="icon"
            className="text-quantum-accent hover:text-quantum-accent/80"
            onClick={() => handleVolumeChange([volume === 0 ? 1 : 0])}
          >
            {volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-20"
          />
        </div>

        {/* Minimize Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-gray-400 hover:text-white"
        >
          <Minimize2 className="h-4 w-4" />
        </Button>
      </div>
    </>
  );

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-quantum-dark/95 backdrop-blur-lg border-t border-quantum-accent/20 transition-all duration-300 ${
        isMinimized ? 'translate-y-[calc(100%-60px)]' : 'translate-y-0'
      }`}
    >
      <div className="max-w-7xl mx-auto p-4">
        {isMinimized ? (
          /* Minimized View */
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentTrack && (
                <>
                  <ThumbnailImage
                    videoId={currentTrack.video_id}
                    title={currentTrack.title}
                    className="w-8 h-8 rounded object-cover"
                    thumbnailUrl={currentTrack.thumbnail}
                  />
                  <div>
                    <p className="text-sm text-white line-clamp-1">
                      {currentTrack.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {currentTrack.channel_title}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="text-quantum-accent hover:text-quantum-accent/80"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(false)}
                className="text-gray-400 hover:text-white"
              >
                <Minimize2 className="h-4 w-4 rotate-180" />
              </Button>
            </div>
          </div>
        ) : (
          /* Full View */
          playerContent
        )}
      </div>
    </div>
  );
} 