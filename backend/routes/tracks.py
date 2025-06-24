from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Optional
from services.apify_data_service import apify_service

router = APIRouter(tags=["tracks"])

@router.get("/tracks", response_model=List[Dict])
async def get_tracks(
    limit: Optional[int] = Query(None, description="Limit number of tracks returned"),
    channel: Optional[str] = Query(None, description="Filter by channel name"),
    search: Optional[str] = Query(None, description="Search in title, channel, or description")
):
    """Get tracks from APIFY data with optional filtering"""
    try:
        if search:
            tracks = apify_service.search_tracks(search)
        elif channel:
            tracks = apify_service.get_tracks_by_channel(channel)
        else:
            tracks = apify_service.get_all_tracks()
        
        # Apply limit if specified
        if limit and limit > 0:
            tracks = tracks[:limit]
            
        return tracks
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tracks/random", response_model=Dict)
async def get_random_track():
    """Get a random track from APIFY data"""
    try:
        track = apify_service.get_random_track()
        if not track:
            raise HTTPException(status_code=404, detail="No tracks available")
        return track
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tracks/stats", response_model=Dict)
async def get_tracks_stats():
    """Get statistics about the track collection"""
    try:
        return apify_service.get_stats()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tracks/watcher/status", response_model=Dict)
async def get_file_watcher_status():
    """Get the status of the file watcher"""
    try:
        return apify_service.get_watcher_status()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tracks/{video_id}", response_model=Dict)
async def get_track_by_id(video_id: str):
    """Get a specific track by video ID"""
    try:
        all_tracks = apify_service.get_all_tracks()
        track = next((t for t in all_tracks if t['video_id'] == video_id), None)
        
        if not track:
            raise HTTPException(status_code=404, detail="Track not found")
        
        return track
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/tracks/reload")
async def reload_tracks():
    """Manually force reload of APIFY data"""
    try:
        result = apify_service.force_reload()
        stats = apify_service.get_stats()
        result["stats"] = stats
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Legacy endpoint for backward compatibility
@router.post("/tracks/refresh")
async def refresh_tracks():
    """Reload APIFY data (for backward compatibility)"""
    try:
        result = apify_service.force_reload()
        stats = apify_service.get_stats()
        return {
            "message": result["message"], 
            "stats": stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 