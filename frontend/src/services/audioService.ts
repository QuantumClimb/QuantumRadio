import { create } from 'zustand';

interface AudioState {
  currentTrackId: string | null;
  isPlaying: boolean;
  volume: number;
  setCurrentTrack: (trackId: string | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  togglePlay: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  currentTrackId: null,
  isPlaying: false,
  volume: 1,
  setCurrentTrack: (trackId) => set({ currentTrackId: trackId, isPlaying: true }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}; 