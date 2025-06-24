import React from "react";
import { Play, Pause, ExternalLink, Eye, Heart, Clock, Users } from "lucide-react";
import { useAudioStore } from "@/services/audioService";
import { useNavigate } from "react-router-dom";
import ThumbnailImage from "./ThumbnailImage";
import type { Track } from "@/services/trackService";

interface TrackCardProps {
  track: Track;
  viewMode?: 'grid' | 'list';
}

const TrackCard: React.FC<TrackCardProps> = ({ track, viewMode = 'grid' }) => {
  const navigate = useNavigate();
  const { currentTrackId, isPlaying, setCurrentTrack, setIsPlaying } = useAudioStore();
  const isCurrentTrack = currentTrackId === track.video_id;
  
  const youtubeUrl = `https://youtube.com/watch?v=${track.video_id}`;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentTrack) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track.video_id);
    }
  };

  const handleCardClick = () => {
    navigate(`/track/${track.video_id}`);
  };

  const formatNumber = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (duration?: string) => {
    if (!duration) return '';
    return duration;
  };

  // List View (Media Player Style)
  if (viewMode === 'list') {
    return (
      <div 
        className={`glass-effect rounded-lg overflow-hidden transition-all hover:bg-white/10 cursor-pointer group ${
          isCurrentTrack ? 'ring-2 ring-quantum-accent/50 bg-white/5' : ''
        }`}
        onClick={handleCardClick}
      >
        <div className="flex items-center p-3 gap-4">
          {/* Small Thumbnail with Play Button */}
          <div className="relative flex-shrink-0">
            <ThumbnailImage
              videoId={track.video_id}
              title={track.title}
              className="w-16 h-16 rounded-lg object-cover"
              thumbnailUrl={track.thumbnail}
            />
            
            {/* Play Button Overlay */}
            <button
              onClick={handlePlayClick}
              className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/60 transition-all duration-200 rounded-lg group-hover:bg-black/30"
            >
              <div className="bg-quantum-accent/90 hover:bg-quantum-accent text-white rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform duration-200">
                {isCurrentTrack && isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </div>
            </button>
            
            {/* Duration badge */}
            {track.duration && (
              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded text-[10px]">
                {formatDuration(track.duration)}
              </div>
            )}
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm line-clamp-1 mb-1">
              {track.title}
            </h3>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs text-quantum-accent font-medium line-clamp-1">
                {track.channel_title}
              </p>
              {track.subscribers && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Users className="w-3 h-3" />
                  {formatNumber(track.subscribers)}
                </div>
              )}
            </div>
            
            {/* Hashtags (mobile hidden) */}
            {track.hashtags && track.hashtags.length > 0 && (
              <div className="hidden sm:flex flex-wrap gap-1 mt-1">
                {track.hashtags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-quantum-accent/15 text-quantum-accent px-1.5 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {track.hashtags.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{track.hashtags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex-shrink-0 text-right">
            <div className="flex items-center gap-4 text-xs text-gray-400 mb-1">
              {track.view_count && (
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span className="hidden sm:inline">{formatNumber(track.view_count)}</span>
                  <span className="sm:hidden">{formatNumber(track.view_count)}</span>
                </div>
              )}
              {track.likes && (
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span className="hidden sm:inline">{formatNumber(track.likes)}</span>
                  <span className="sm:hidden">{formatNumber(track.likes)}</span>
                </div>
              )}
            </div>
            
            {track.upload_date && (
              <div className="text-xs text-gray-500 hidden sm:block">
                {new Date(track.upload_date).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <button
              onClick={handlePlayClick}
              className={`p-2 rounded-full transition-colors ${
                isCurrentTrack && isPlaying 
                  ? 'bg-quantum-primary/20 text-quantum-primary' 
                  : 'bg-white/10 text-quantum-accent hover:bg-quantum-accent/20'
              }`}
              title={isCurrentTrack && isPlaying ? 'Pause' : 'Play'}
            >
              {isCurrentTrack && isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>

            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
              onClick={(e) => e.stopPropagation()}
              title="Watch on YouTube"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (Original Card Design)
  return (
    <div 
      className={`mobile-video-card desktop-video-card glass-effect rounded-xl overflow-hidden transition-all hover:bg-white/10 cursor-pointer group ${
        isCurrentTrack ? 'ring-2 ring-quantum-accent/50 bg-white/5' : ''
      }`}
      onClick={handleCardClick}
    >
      <div className="relative aspect-video">
        <ThumbnailImage
          videoId={track.video_id}
          title={track.title}
          className="mobile-card-thumbnail w-full h-full object-cover"
          thumbnailUrl={track.thumbnail}
        />
        
        {/* Duration badge */}
        {track.duration && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1 md:text-sm">
            <Clock className="w-3 h-3" />
            {formatDuration(track.duration)}
          </div>
        )}
        
        {/* Play button overlay */}
        <button
          onClick={handlePlayClick}
          className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/60 transition-all duration-300 group-hover:bg-black/40"
        >
          <div className="bg-quantum-accent/90 hover:bg-quantum-accent text-white rounded-full p-2 md:p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
            {isCurrentTrack && isPlaying ? (
              <Pause className="w-4 h-4 md:w-6 md:h-6" />
            ) : (
              <Play className="w-4 h-4 md:w-6 md:h-6 ml-0.5" />
            )}
          </div>
        </button>
      </div>

      <div className="mobile-card-content p-3 md:p-4">
        {/* Title */}
        <h3 className="mobile-card-title text-sm md:text-lg font-semibold mb-1 md:mb-2 text-white line-clamp-2 leading-tight">
          {track.title}
        </h3>
        
        {/* Channel info */}
        <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
          <p className="mobile-card-channel text-xs md:text-sm text-quantum-accent font-medium line-clamp-1">
            {track.channel_title}
          </p>
          {track.subscribers && (
            <div className="hidden md:flex items-center gap-1 text-xs text-gray-400">
              <Users className="w-3 h-3" />
              {formatNumber(track.subscribers)}
            </div>
          )}
        </div>
        
        {/* Stats row */}
        <div className="mobile-card-stats flex items-center justify-between text-xs text-gray-400 mb-2 md:mb-3">
          <div className="flex items-center gap-2 md:gap-3">
            {track.view_count && (
              <div className="mobile-card-stat flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {formatNumber(track.view_count)}
              </div>
            )}
            {track.likes && (
              <div className="mobile-card-stat flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {formatNumber(track.likes)}
              </div>
            )}
          </div>
          
          {track.upload_date && (
            <span className="text-xs hidden md:inline">
              {new Date(track.upload_date).toLocaleDateString()}
            </span>
          )}
        </div>
        
        {/* Hashtags - Hidden on mobile */}
        {track.hashtags && track.hashtags.length > 0 && (
          <div className="hidden md:flex flex-wrap gap-1 mb-3">
            {track.hashtags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-quantum-accent/20 text-quantum-accent px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {track.hashtags.length > 3 && (
              <span className="text-xs text-gray-400">
                +{track.hashtags.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* Action buttons - Simplified on mobile */}
        <div className="flex justify-between items-center pt-2 border-t border-white/10">
          <button
            onClick={handlePlayClick}
            className={`flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium transition-colors ${
              isCurrentTrack && isPlaying 
                ? 'text-quantum-primary' 
                : 'text-quantum-accent hover:text-quantum-primary'
            }`}
          >
            {isCurrentTrack && isPlaying ? (
              <>
                <Pause className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden md:inline">Playing</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden md:inline">Play</span>
              </>
            )}
          </button>

          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs md:text-sm text-gray-400 hover:text-white transition-colors"
            onClick={(e) => e.stopPropagation()}
            title="Watch on YouTube"
          >
            <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
