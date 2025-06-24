import React, { useState, useEffect } from 'react';
import { fetchChannels, type Channel } from '@/services/trackService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Filter, 
  X, 
  TrendingUp, 
  Clock, 
  Heart, 
  Eye,
  Users,
  Hash,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: FilterState) => void;
  currentFilters: FilterState;
}

export interface FilterState {
  search: string;
  selectedChannel: string;
  sortBy: 'views' | 'likes' | 'date' | 'title';
  sortOrder: 'asc' | 'desc';
  minViews?: number;
  hasHashtags?: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  onFilterChange,
  currentFilters
}) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [channelSearch, setChannelSearch] = useState('');
  const [showAllChannels, setShowAllChannels] = useState(false);

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      const channelData = await fetchChannels();
      setChannels(channelData);
    } catch (error) {
      console.error('Failed to load channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChannels = channels.filter(channel =>
    channel.channel_title.toLowerCase().includes(channelSearch.toLowerCase())
  );

  const displayChannels = showAllChannels ? filteredChannels : filteredChannels.slice(0, 10);

  const handleFilterChange = (updates: Partial<FilterState>) => {
    onFilterChange({ ...currentFilters, ...updates });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      selectedChannel: '',
      sortBy: 'views',
      sortOrder: 'desc',
    });
    setChannelSearch('');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const sortOptions = [
    { value: 'views', label: 'Most Views', icon: Eye },
    { value: 'likes', label: 'Most Liked', icon: Heart },
    { value: 'date', label: 'Newest', icon: Clock },
    { value: 'title', label: 'Alphabetical', icon: Hash },
  ] as const;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Mobile overlay */}
      <div 
        className="absolute inset-0 bg-black/50 lg:hidden" 
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-80 bg-quantum-dark/95 backdrop-blur-lg border-l border-white/10 lg:relative lg:w-full lg:bg-transparent lg:border-l-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-quantum-accent" />
              <h3 className="font-semibold text-white">Filters</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            {/* Search */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Search Tracks
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search titles, channels..."
                  value={currentFilters.search}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  className="pl-9 bg-white/5 border-white/10"
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-300 mb-3 block">
                Sort By
              </label>
              <div className="grid grid-cols-2 gap-2">
                {sortOptions.map(({ value, label, icon: Icon }) => (
                  <Button
                    key={value}
                    variant={currentFilters.sortBy === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange({ sortBy: value })}
                    className="justify-start gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Button>
                ))}
              </div>
              
              {/* Sort Order */}
              <div className="flex gap-2 mt-2">
                <Button
                  variant={currentFilters.sortOrder === 'desc' ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange({ sortOrder: 'desc' })}
                  className="flex-1"
                >
                  <TrendingUp className="w-4 h-4 mr-1" />
                  High to Low
                </Button>
                <Button
                  variant={currentFilters.sortOrder === 'asc' ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange({ sortOrder: 'asc' })}
                  className="flex-1"
                >
                  <TrendingUp className="w-4 h-4 mr-1 rotate-180" />
                  Low to High
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Channels */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-300 mb-3 block">
                Channels ({channels.length})
              </label>
              
              {/* Channel search */}
              <Input
                placeholder="Search channels..."
                value={channelSearch}
                onChange={(e) => setChannelSearch(e.target.value)}
                className="mb-3 bg-white/5 border-white/10"
              />

              {/* Selected channel */}
              {currentFilters.selectedChannel && (
                <div className="mb-3">
                  <Badge 
                    variant="secondary" 
                    className="bg-quantum-accent/20 text-quantum-accent"
                  >
                    {currentFilters.selectedChannel}
                    <button
                      onClick={() => handleFilterChange({ selectedChannel: '' })}
                      className="ml-2 hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                </div>
              )}

              {/* Channel list */}
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {loading ? (
                  <div className="text-sm text-gray-400">Loading channels...</div>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFilterChange({ selectedChannel: '' })}
                      className={`w-full justify-between text-left ${
                        !currentFilters.selectedChannel ? 'bg-white/10' : ''
                      }`}
                    >
                      <span>All Channels</span>
                      <span className="text-xs text-gray-400">{channels.length}</span>
                    </Button>
                    
                    {displayChannels.map((channel) => (
                      <Button
                        key={channel.channel_id}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFilterChange({ selectedChannel: channel.channel_title })}
                        className={`w-full justify-between text-left ${
                          currentFilters.selectedChannel === channel.channel_title ? 'bg-white/10' : ''
                        }`}
                      >
                        <div className="flex flex-col items-start">
                          <span className="text-sm truncate max-w-[200px]">
                            {channel.channel_title}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {formatNumber(channel.subscribers)}
                            </span>
                            <span>{channel.video_count} videos</span>
                          </div>
                        </div>
                      </Button>
                    ))}
                    
                    {filteredChannels.length > 10 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAllChannels(!showAllChannels)}
                        className="w-full"
                      >
                        {showAllChannels ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-2" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-2" />
                            Show All ({filteredChannels.length})
                          </>
                        )}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Quick Filters */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-300 mb-3 block">
                Quick Filters
              </label>
              <div className="space-y-2">
                <Button
                  variant={currentFilters.hasHashtags ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange({ hasHashtags: !currentFilters.hasHashtags })}
                  className="w-full justify-start"
                >
                  <Hash className="w-4 h-4 mr-2" />
                  Has Hashtags
                </Button>
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full"
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar; 