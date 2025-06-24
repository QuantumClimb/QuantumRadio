export interface Track {
  title: string;
  video_id: string;
  channel_title: string;
  thumbnail?: string;
  description?: string;
  url: string;
  view_count?: number;
  likes?: number;
  duration?: string;
  upload_date?: string;
  channel_url?: string;
  channel_id?: string;
  subscribers?: number;
  hashtags?: string[];
  search_query?: string;
  comments_count?: number;
}

export interface TrackStats {
  total_tracks: number;
  total_views: number;
  total_likes: number;
  unique_channels: number;
  avg_views_per_track: number;
  avg_likes_per_track: number;
}

export interface Channel {
  channel_title: string;
  channel_id: string;
  channel_url: string;
  subscribers: number;
  video_count: number;
  total_views: number;
}

const API_BASE_URL = 'http://localhost:8000/api';

export async function fetchTracks(params?: {
  limit?: number;
  channel?: string;
  search?: string;
}): Promise<Track[]> {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.channel) searchParams.append('channel', params.channel);
  if (params?.search) searchParams.append('search', params.search);
  
  const url = `${API_BASE_URL}/tracks${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch tracks');
  }
  return response.json();
}

export async function fetchRandomTrack(): Promise<Track> {
  const response = await fetch(`${API_BASE_URL}/tracks/random`);
  if (!response.ok) {
    throw new Error('Failed to fetch random track');
  }
  return response.json();
}

export async function fetchTrackStats(): Promise<TrackStats> {
  const response = await fetch(`${API_BASE_URL}/tracks/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch track stats');
  }
  return response.json();
}

export async function fetchChannels(): Promise<Channel[]> {
  const response = await fetch(`${API_BASE_URL}/channels`);
  if (!response.ok) {
    throw new Error('Failed to fetch channels');
  }
  return response.json();
}

export async function fetchTrackById(videoId: string): Promise<Track> {
  const response = await fetch(`${API_BASE_URL}/tracks/${videoId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch track');
  }
  return response.json();
}
