import json
import os
from typing import List, Dict, Optional
from datetime import datetime
import random
import threading
import time

# Try to import watchdog, but handle gracefully if not available
try:
    from watchdog.observers import Observer
    from watchdog.events import FileSystemEventHandler
    WATCHDOG_AVAILABLE = True
    
    class ApifyFileHandler(FileSystemEventHandler):
        """Handler for file system events on the AI_Setlist.json file"""
        
        def __init__(self, data_service):
            super().__init__()
            self.data_service = data_service
            self.last_modified = 0
            
        def on_modified(self, event):
            if event.is_directory:
                return
                
            # Check if it's our target file
            if os.path.basename(event.src_path) == "AI_Setlist.json":
                # Debounce rapid file changes (some editors save multiple times)
                current_time = time.time()
                if current_time - self.last_modified > 1:  # 1 second debounce
                    self.last_modified = current_time
                    print(f"Detected change in {event.src_path}, reloading data...")
                    # Use a small delay to ensure file write is complete
                    threading.Timer(0.5, self.data_service._reload_data).start()
    
except ImportError:
    print("Warning: watchdog library not available. File watching will be disabled.")
    WATCHDOG_AVAILABLE = False
    Observer = None
    FileSystemEventHandler = None
    
    class ApifyFileHandler:
        """Dummy handler when watchdog is not available"""
        def __init__(self, data_service):
            pass

class ApifyDataService:
    def __init__(self):
        self.data_file = os.path.join(os.path.dirname(__file__), "..", "..", "AI_Setlist.json")
        self._data = None
        self._data_lock = threading.RLock()  # Thread-safe access to data
        self._observer = None
        self._file_handler = None
        self._watcher_enabled = WATCHDOG_AVAILABLE
        
        # Load initial data
        self._load_data()
        
        # Start file watching if available
        if WATCHDOG_AVAILABLE:
            self._start_file_watcher()
        else:
            print("File watching disabled - watchdog library not available")
    
    def _start_file_watcher(self):
        """Start monitoring the JSON file for changes"""
        if not WATCHDOG_AVAILABLE:
            return
            
        try:
            if not os.path.exists(self.data_file):
                print(f"Warning: Data file {self.data_file} does not exist yet. File watcher will start when file is created.")
                return
                
            # Set up file watcher
            self._file_handler = ApifyFileHandler(self)
            self._observer = Observer()
            
            # Watch the directory containing the file
            watch_directory = os.path.dirname(self.data_file)
            self._observer.schedule(self._file_handler, watch_directory, recursive=False)
            
            # Start the observer in a separate thread
            self._observer.start()
            print(f"Started file watcher for {self.data_file}")
            
        except Exception as e:
            print(f"Error starting file watcher: {e}")
            self._watcher_enabled = False
    
    def _stop_file_watcher(self):
        """Stop the file watcher"""
        if WATCHDOG_AVAILABLE and self._observer:
            try:
                self._observer.stop()
                self._observer.join()
                print("Stopped file watcher")
            except Exception as e:
                print(f"Error stopping file watcher: {e}")
    
    def _reload_data(self):
        """Reload data from file (called by file watcher)"""
        with self._data_lock:
            print("Reloading AI_Setlist.json data...")
            old_count = len(self._data) if self._data else 0
            self._load_data()
            new_count = len(self._data) if self._data else 0
            print(f"Data reloaded: {old_count} -> {new_count} tracks")
    
    def _load_data(self):
        """Load the APIFY scraped data"""
        try:
            with open(self.data_file, 'r', encoding='utf-8') as f:
                self._data = json.load(f)
            print(f"Loaded {len(self._data)} tracks from APIFY data")
        except FileNotFoundError:
            print(f"Data file {self.data_file} not found. Starting with empty dataset.")
            self._data = []
        except json.JSONDecodeError as e:
            print(f"Invalid JSON in data file: {e}")
            self._data = []
        except Exception as e:
            print(f"Error loading APIFY data: {e}")
            self._data = []
    
    def get_all_tracks(self) -> List[Dict]:
        """Get all tracks in the format expected by the frontend"""
        with self._data_lock:
            if not self._data:
                self._load_data()
            
            tracks = []
            for item in self._data:
                track = self._format_track(item)
                if track:
                    tracks.append(track)
            
            return tracks
    
    def get_random_track(self) -> Optional[Dict]:
        """Get a random track"""
        with self._data_lock:
            if not self._data:
                return None
            
            random_item = random.choice(self._data)
            return self._format_track(random_item)
    
    def get_tracks_by_channel(self, channel_name: str) -> List[Dict]:
        """Get tracks filtered by channel name"""
        with self._data_lock:
            if not self._data:
                return []
            
            tracks = []
            for item in self._data:
                if item.get('channelName', '').lower() == channel_name.lower():
                    track = self._format_track(item)
                    if track:
                        tracks.append(track)
            
            return tracks
    
    def search_tracks(self, query: str) -> List[Dict]:
        """Search tracks by title, channel name, or description"""
        with self._data_lock:
            if not self._data:
                return []
            
            query = query.lower()
            tracks = []
            
            for item in self._data:
                # Search in title, channel name, and description
                searchable_text = " ".join([
                    item.get('title', ''),
                    item.get('channelName', ''),
                    item.get('text', '')
                ]).lower()
                
                if query in searchable_text:
                    track = self._format_track(item)
                    if track:
                        tracks.append(track)
            
            return tracks
    
    def get_channels_summary(self) -> List[Dict]:
        """Get a summary of all unique channels with their stats"""
        with self._data_lock:
            if not self._data:
                return []
            
            channels = {}
            
            for item in self._data:
                channel_name = item.get('channelName')
                channel_id = item.get('channelId')
                
                if channel_name and channel_id:
                    if channel_id not in channels:
                        channels[channel_id] = {
                            'channel_title': channel_name,
                            'channel_id': channel_id,
                            'channel_url': item.get('channelUrl', ''),
                            'subscribers': item.get('numberOfSubscribers', 0),
                            'video_count': 0,
                            'total_views': 0,
                            'avg_duration': 0
                        }
                    
                    channels[channel_id]['video_count'] += 1
                    channels[channel_id]['total_views'] += item.get('viewCount', 0)
            
            return list(channels.values())
    
    def _format_track(self, item: Dict) -> Optional[Dict]:
        """Format APIFY data item to match the frontend's expected track format"""
        try:
            # Extract video ID from URL or use the 'id' field
            video_id = item.get('id')
            if not video_id and item.get('url'):
                # Extract from YouTube URL
                url = item.get('url', '')
                if 'watch?v=' in url:
                    video_id = url.split('watch?v=')[1].split('&')[0]
            
            if not video_id:
                return None
            
            # Format duration from HH:MM:SS to readable format
            duration = item.get('duration', '')
            
            return {
                'title': item.get('title', 'Unknown Title'),
                'video_id': video_id,
                'channel_title': item.get('channelName', 'Unknown Channel'),
                'thumbnail': item.get('thumbnailUrl', ''),
                'description': item.get('text', ''),
                'url': item.get('url', f'https://www.youtube.com/watch?v={video_id}'),
                'view_count': item.get('viewCount', 0),
                'likes': item.get('likes', 0),
                'duration': duration,
                'upload_date': item.get('date', ''),
                'channel_url': item.get('channelUrl', ''),
                'channel_id': item.get('channelId', ''),
                'subscribers': item.get('numberOfSubscribers', 0),
                'hashtags': item.get('hashtags', []),
                'search_query': item.get('input', ''),  # Original search query used in APIFY
                'comments_count': item.get('commentsCount', 0)
            }
        except Exception as e:
            print(f"Error formatting track: {e}")
            return None
    
    def get_stats(self) -> Dict:
        """Get overall statistics about the dataset"""
        with self._data_lock:
            if not self._data:
                return {}
            
            total_views = sum(item.get('viewCount', 0) for item in self._data)
            total_likes = sum(item.get('likes', 0) for item in self._data)
            unique_channels = len(set(item.get('channelId') for item in self._data if item.get('channelId')))
            
            return {
                'total_tracks': len(self._data),
                'total_views': total_views,
                'total_likes': total_likes,
                'unique_channels': unique_channels,
                'avg_views_per_track': total_views // len(self._data) if self._data else 0,
                'avg_likes_per_track': total_likes // len(self._data) if self._data else 0
            }
    
    def force_reload(self) -> Dict:
        """Manually force a reload of the data (useful for API endpoint)"""
        with self._data_lock:
            old_count = len(self._data) if self._data else 0
            self._load_data()
            new_count = len(self._data) if self._data else 0
            
            return {
                'success': True,
                'message': f'Data reloaded: {old_count} -> {new_count} tracks',
                'old_count': old_count,
                'new_count': new_count
            }
    
    def get_watcher_status(self) -> Dict:
        """Get the status of the file watcher"""
        is_watching = (WATCHDOG_AVAILABLE and 
                      self._observer is not None and 
                      self._observer.is_alive())
        
        return {
            "file_watcher_available": WATCHDOG_AVAILABLE,
            "file_watcher_active": is_watching,
            "watched_file": self.data_file,
            "message": ("File watcher is monitoring for changes" if is_watching 
                       else "File watcher is not active" if WATCHDOG_AVAILABLE 
                       else "File watching disabled - watchdog library not available")
        }
    
    def __del__(self):
        """Cleanup when service is destroyed"""
        self._stop_file_watcher()

# Global instance
apify_service = ApifyDataService() 