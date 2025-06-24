import { useState, useEffect } from "react";
import { fetchTracks, fetchTrackStats, type Track, type TrackStats } from "@/services/trackService";
import TrackCard from "@/components/TrackCard";
import FilterSidebar, { type FilterState } from "@/components/FilterSidebar";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useAudioStore } from "@/services/audioService";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, BarChart3, Shuffle, Grid, List } from "lucide-react";
import { QuantumLogo } from "@/components/QuantumLogo";

const Index = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [stats, setStats] = useState<TrackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const tracksPerPage = 24;
  
  const { toast } = useToast();
  const { currentTrackId } = useAudioStore();

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    selectedChannel: '',
    sortBy: 'views',
    sortOrder: 'desc',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [tracksData, statsData] = await Promise.all([
        fetchTracks(),
        fetchTrackStats()
      ]);
      setTracks(tracksData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast({
        title: "Error loading data",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...tracks];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(track => 
        track.title.toLowerCase().includes(searchLower) ||
        track.channel_title.toLowerCase().includes(searchLower) ||
        track.description?.toLowerCase().includes(searchLower) ||
        track.hashtags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply channel filter
    if (filters.selectedChannel) {
      filtered = filtered.filter(track => 
        track.channel_title === filters.selectedChannel
      );
    }

    // Apply hashtag filter
    if (filters.hasHashtags) {
      filtered = filtered.filter(track => 
        track.hashtags && track.hashtags.length > 0
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'views':
          aValue = a.view_count || 0;
          bValue = b.view_count || 0;
          break;
        case 'likes':
          aValue = a.likes || 0;
          bValue = b.likes || 0;
          break;
        case 'date':
          aValue = new Date(a.upload_date || 0).getTime();
          bValue = new Date(b.upload_date || 0).getTime();
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          aValue = 0;
          bValue = 0;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTracks(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, tracks]);

  // Paginate tracks
  const startIndex = (currentPage - 1) * tracksPerPage;
  const paginatedTracks = filteredTracks.slice(startIndex, startIndex + tracksPerPage);
  const totalPages = Math.ceil(filteredTracks.length / tracksPerPage);

  const handleShuffle = () => {
    const shuffled = [...filteredTracks].sort(() => Math.random() - 0.5);
    setFilteredTracks(shuffled);
    setCurrentPage(1);
  };

  const formatNumber = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-quantum-dark bg-gradient">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 py-8 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <header className="text-center mb-8 mobile-header">
              <QuantumLogo className="mb-3" />
              <p className="text-gray-400 max-w-lg mx-auto mb-6">
                Your AI-powered music station featuring the best machine-generated tracks
              </p>

              {/* Stats Bar */}
              {stats && (
                <div className="mobile-stats flex flex-wrap justify-center gap-4 mb-6">
                  <Badge variant="secondary" className="bg-white/10 text-white">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {formatNumber(stats.total_tracks)} tracks
                  </Badge>
                  <Badge variant="secondary" className="bg-white/10 text-white">
                    {formatNumber(stats.total_views)} total views
                  </Badge>
                  <Badge variant="secondary" className="bg-white/10 text-white">
                    {formatNumber(stats.unique_channels)} channels
                  </Badge>
                  <Badge variant="secondary" className="bg-white/10 text-white hide-mobile">
                    Avg {formatNumber(stats.avg_views_per_track)} views/track
                  </Badge>
                </div>
              )}

              {/* Controls */}
              <div className="mobile-controls flex flex-wrap justify-center gap-2 mb-8">
                <Button
                  variant="outline"
                  onClick={() => setIsFilterOpen(true)}
                  className="bg-white/5 border-white/10 hover:bg-white/10"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {(filters.search || filters.selectedChannel || filters.hasHashtags) && (
                    <Badge variant="secondary" className="ml-2 bg-quantum-accent text-black">
                      {[filters.search, filters.selectedChannel, filters.hasHashtags].filter(Boolean).length}
                    </Badge>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleShuffle}
                  className="bg-white/5 border-white/10 hover:bg-white/10"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Shuffle
                </Button>

                <div className="show-desktop flex bg-white/5 rounded-md overflow-hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </header>

            {/* Results Info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-400 text-sm">
                Showing {paginatedTracks.length} of {filteredTracks.length} tracks
                {filters.selectedChannel && (
                  <span className="ml-2">
                    from <span className="text-quantum-accent">{filters.selectedChannel}</span>
                  </span>
                )}
              </p>
              
              <p className="text-gray-400 text-sm">
                Sorted by {filters.sortBy} ({filters.sortOrder === 'desc' ? 'high to low' : 'low to high'})
              </p>
            </div>

            {/* Track Grid/List */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-quantum-accent/30 border-t-quantum-accent rounded-full animate-spin"></div>
              </div>
            ) : paginatedTracks.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? "mobile-video-grid md:tablet-video-grid lg:desktop-video-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6"
                  : "space-y-4"
              }>
                {paginatedTracks.map((track, index) => (
                  <TrackCard
                    key={track.video_id + index}
                    track={track}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">
                  {filters.search || filters.selectedChannel || filters.hasHashtags
                    ? "No tracks found matching your filters"
                    : "No tracks available"
                  }
                </p>
                {(filters.search || filters.selectedChannel || filters.hasHashtags) && (
                  <Button
                    variant="outline"
                    onClick={() => setFilters({
                      search: '',
                      selectedChannel: '',
                      sortBy: 'views',
                      sortOrder: 'desc',
                    })}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="bg-white/5 border-white/10"
                >
                  Previous
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        onClick={() => setCurrentPage(pageNum)}
                        className="bg-white/5 border-white/10"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="bg-white/5 border-white/10"
                >
                  Next
                </Button>
              </div>
            )}

            <footer className="mt-16 text-center text-sm text-gray-600">
              <p>© {new Date().getFullYear()} Quantum Radio - AI Music Station</p>
            </footer>
          </div>
        </div>

        {/* Filter Sidebar */}
        <FilterSidebar
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onFilterChange={setFilters}
          currentFilters={filters}
        />
      </div>

      {/* Audio Player */}
      {currentTrackId && <AudioPlayer videoId={currentTrackId} />}
    </div>
  );
};

export default Index;
