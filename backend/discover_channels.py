# discover_channels.py

# This script searches YouTube for AI music-related channels
# It filters by subscriber count and video count to find reliable sources
# Output is saved as a JSON list of promising channels

import os
import json
from dotenv import load_dotenv
from googleapiclient.discovery import build

# Load API key from .env
load_dotenv()
API_KEY = os.getenv("YOUTUBE_API_KEY")

if not API_KEY:
    raise ValueError("YouTube API key not found in .env file")

# YouTube API client
youtube = build("youtube", "v3", developerKey=API_KEY)

# List of AI music search terms
SEARCH_TERMS = [
    "AI generated pop song",
    "AI generated rock song",
    "AI generated dance music",
    "AI generated rap",
    "AI pop music",
    "AI synthwave",
    "neural composer",
    "artificial intelligence music original",
    "Udio music",
    "Suno AI song",
    "Udio AI music",
    "Suno original music"
]

# Ensure path is relative to this script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, "data")
CHANNELS_FILE = os.path.join(DATA_DIR, "ai_music_channels.json")
PLAYLISTS_FILE = os.path.join(DATA_DIR, "ai_music_playlists.json")

# Function to fetch channels matching a query
def search_channels(query, max_results=10):
    request = youtube.search().list(
        part="snippet",
        q=query,
        type="channel",
        maxResults=max_results
    )
    response = request.execute()

    channels = []
    for item in response["items"]:
        channels.append({
            "channel_title": item["snippet"]["title"],
            "channel_id": item["snippet"]["channelId"]
        })
    return channels

# Function to fetch playlists
def search_playlists(query, max_results=10):
    request = youtube.search().list(
        part="snippet",
        q=query,
        type="playlist",
        maxResults=max_results
    )
    response = request.execute()

    playlists = []
    for item in response["items"]:
        try:
            title = item["snippet"]["title"].lower()
            if any(keyword in title for keyword in ["cover", "in the style", "tribute", "beatles", "metallica"]):
                continue  # Skip likely covers or parody references

            # Extract playlist ID safely
            playlist_id = item.get("id", {}).get("playlistId")
            if not playlist_id:
                continue

            playlists.append({
                "playlist_id": playlist_id,
                "title": item["snippet"]["title"],
                "channel_id": item["snippet"]["channelId"],
                "channel_title": item["snippet"]["channelTitle"],
                "description": item["snippet"]["description"],
                "thumbnail": item["snippet"]["thumbnails"]["high"]["url"] if "high" in item["snippet"]["thumbnails"] else None,
                "url": f"https://youtube.com/playlist?list={playlist_id}"
            })
        except KeyError as e:
            print(f"Warning: Skipping playlist due to missing data: {e}")
            continue
    return playlists

# Function to fetch channel statistics like subscriber count
def get_channel_details(channel_id):
    request = youtube.channels().list(
        part="snippet,statistics",
        id=channel_id
    )
    response = request.execute()

    if not response["items"]:
        return None

    item = response["items"][0]
    stats = item["statistics"]
    return {
        "channel_title": item["snippet"]["title"],
        "channel_id": channel_id,
        "channel_url": f"https://youtube.com/channel/{channel_id}",
        "subscribers": int(stats.get("subscriberCount", 0)),
        "video_count": int(stats.get("videoCount", 0))
    }

def main():
    # Ensure data directory exists
    os.makedirs(DATA_DIR, exist_ok=True)
    print(f"Data directory: {DATA_DIR}")

    seen_channel_ids = set()
    seen_playlist_ids = set()
    result_channels = []
    result_playlists = []

    for term in SEARCH_TERMS:
        print(f"🔍 Searching for: {term}")
        
        # Search for channels
        channels = search_channels(term)
        for ch in channels:
            if ch["channel_id"] in seen_channel_ids:
                continue
            seen_channel_ids.add(ch["channel_id"])
            details = get_channel_details(ch["channel_id"])
            if not details:
                continue
            if details["video_count"] >= 10:
                result_channels.append(details)
        
        # Search for playlists
        playlists = search_playlists(term)
        for pl in playlists:
            if pl["playlist_id"] in seen_playlist_ids:
                continue
            seen_playlist_ids.add(pl["playlist_id"])
            result_playlists.append(pl)

    # Save channels
    with open(CHANNELS_FILE, "w", encoding="utf-8") as f:
        json.dump(result_channels, f, indent=2, ensure_ascii=False)
    print(f"✅ Saved {len(result_channels)} channels to {CHANNELS_FILE}")

    # Save playlists
    with open(PLAYLISTS_FILE, "w", encoding="utf-8") as f:
        json.dump(result_playlists, f, indent=2, ensure_ascii=False)
    print(f"✅ Saved {len(result_playlists)} playlists to {PLAYLISTS_FILE}")

if __name__ == "__main__":
    main()