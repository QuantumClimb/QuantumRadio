import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Track } from "@/services/trackService";
import { useAudioStore } from "@/services/audioService";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause } from "lucide-react";
import ThumbnailImage from "@/components/ThumbnailImage";

const TrackPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [track, setTrack] = useState<Track | null>(null);
  const { currentTrackId, isPlaying, setCurrentTrack, setIsPlaying } = useAudioStore();
  const isCurrentTrack = currentTrackId === videoId;

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/tracks`);
        const tracks = await response.json();
        const foundTrack = tracks.find((t: Track) => t.video_id === videoId);
        if (foundTrack) {
          setTrack(foundTrack);
          // Automatically start playing when track is found
          setCurrentTrack(foundTrack.video_id);
        }
      } catch (error) {
        console.error("Failed to fetch track:", error);
      }
    };

    fetchTrack();
  }, [videoId, setCurrentTrack]);

  const handlePlayPause = () => {
    if (isCurrentTrack) {
      setIsPlaying(!isPlaying);
    } else if (track) {
      setCurrentTrack(track.video_id);
    }
  };

  if (!track) {
    return (
      <div className="min-h-screen bg-quantum-dark flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-quantum-accent/30 border-t-quantum-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-quantum-dark text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 text-gray-400 hover:text-white"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
              <ThumbnailImage
                videoId={track.video_id}
                title={track.title}
                className="w-full h-full object-cover"
                thumbnailUrl={track.thumbnail}
              />
              <button
                onClick={handlePlayPause}
                className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors"
              >
                {isCurrentTrack && isPlaying ? (
                  <Pause className="w-16 h-16" />
                ) : (
                  <Play className="w-16 h-16" />
                )}
              </button>
            </div>

            <div className="mt-6">
              <h1 className="text-2xl font-bold mb-2">{track.title}</h1>
              <p className="text-gray-400">{track.channel_title}</p>
              {track.description && (
                <p className="mt-4 text-gray-300 whitespace-pre-wrap">
                  {track.description}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar - Related Tracks (to be implemented) */}
          <div className="hidden lg:block">
            <h2 className="text-xl font-semibold mb-4">More AI Music</h2>
            {/* Related tracks will be added here */}
          </div>
        </div>
      </div>

      {/* Audio Player */}
      {currentTrackId && <AudioPlayer videoId={currentTrackId} />}
    </div>
  );
};

export default TrackPage; 