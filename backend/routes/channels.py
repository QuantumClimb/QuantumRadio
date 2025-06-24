from fastapi import APIRouter, HTTPException
from typing import List, Dict
from services.apify_data_service import apify_service

router = APIRouter(tags=["channels"])

@router.get("/channels", response_model=List[Dict])
async def get_channels():
    """Get all unique channels from APIFY data with their statistics"""
    try:
        channels = apify_service.get_channels_summary()
        # Sort by subscriber count (descending)
        channels.sort(key=lambda x: x.get('subscribers', 0), reverse=True)
        return channels
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/channels/{channel_id}/tracks", response_model=List[Dict])
async def get_channel_tracks(channel_id: str):
    """Get all tracks from a specific channel"""
    try:
        all_tracks = apify_service.get_all_tracks()
        channel_tracks = [track for track in all_tracks if track.get('channel_id') == channel_id]
        
        if not channel_tracks:
            raise HTTPException(status_code=404, detail="No tracks found for this channel")
        
        return channel_tracks
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 