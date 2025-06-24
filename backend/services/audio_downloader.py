import os
import aiohttp
import asyncio
from typing import Optional

AUDIO_DIR = os.path.join(os.path.dirname(__file__), "..", "audio")

class AudioDownloader:
    def __init__(self):
        # Ensure audio directory exists
        os.makedirs(AUDIO_DIR, exist_ok=True)
    
    async def download_track(self, track_url: str, filename: str) -> Optional[str]:
        """
        Downloads an audio track from the given URL
        Returns the path to the downloaded file or None if download fails
        """
        output_path = os.path.join(AUDIO_DIR, filename)
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(track_url) as response:
                    if response.status == 200:
                        with open(output_path, 'wb') as f:
                            while True:
                                chunk = await response.content.read(8192)
                                if not chunk:
                                    break
                                f.write(chunk)
                        return output_path
                    return None
        except Exception as e:
            print(f"Error downloading track: {str(e)}")
            return None
    
    def get_track_path(self, track_id: str) -> Optional[str]:
        """
        Returns the path to a downloaded track if it exists
        """
        path = os.path.join(AUDIO_DIR, f"{track_id}.mp3")
        return path if os.path.exists(path) else None 