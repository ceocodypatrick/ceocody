import React, { useState, useMemo } from 'react';
import { 
  Music, 
  Grid3x3, 
  List, 
  Search, 
  Filter, 
  Upload,
  Play,
  MoreVertical,
  Heart,
  Share2,
  Download,
  Trash2,
  Edit,
  Folder,
  Clock,
  Calendar,
  SortAsc,
  SortDesc,
  Brain
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { AudioUpload } from '../components/music/AudioUpload';
import { AIAnalysisResult } from '../utils/ai-analysis';

interface AudioFile {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  size: number;
  format: string;
  genre?: string;
  mood?: string;
  key?: string;
  bpm?: number;
  dateAdded: Date;
  coverArt?: string;
  isFavorite: boolean;
  tags: string[];
  folder?: string;
}

type ViewMode = 'grid' | 'list';
type SortField = 'title' | 'dateAdded' | 'duration' | 'size';
type SortOrder = 'asc' | 'desc';

// Mock data
const mockAudioFiles: AudioFile[] = [
  {
    id: '1',
    title: 'Summer Vibes',
    artist: 'DJ Producer',
    album: 'Beach Sessions',
    duration: 245,
    size: 8500000,
    format: 'mp3',
    genre: 'Electronic',
    mood: 'Energetic',
    key: 'C Major',
    bpm: 128,
    dateAdded: new Date('2024-01-15'),
    coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    isFavorite: true,
    tags: ['summer', 'upbeat', 'dance'],
    folder: 'Electronic',
  },
  {
    id: '2',
    title: 'Midnight Jazz',
    artist: 'The Smooth Trio',
    album: 'Late Night Sessions',
    duration: 312,
    size: 12000000,
    format: 'flac',
    genre: 'Jazz',
    mood: 'Relaxed',
    key: 'Bb Major',
    bpm: 92,
    dateAdded: new Date('2024-01-20'),
    coverArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop',
    isFavorite: false,
    tags: ['jazz', 'smooth', 'instrumental'],
    folder: 'Jazz',
  },
  {
    id: '3',
    title: 'Rock Anthem',
    artist: 'The Thunder Band',
    album: 'Electric Dreams',
    duration: 198,
    size: 7200000,
    format: 'wav',
    genre: 'Rock',
    mood: 'Aggressive',
    key: 'E Minor',
    bpm: 140,
    dateAdded: new Date('2024-02-01'),
    coverArt: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&h=400&fit=crop',
    isFavorite: true,
    tags: ['rock', 'guitar', 'energetic'],
    folder: 'Rock',
  },
  {
    id: '4',
    title: 'Acoustic Sunrise',
    artist: 'Sarah Mitchell',
    duration: 267,
    size: 9100000,
    format: 'mp3',
    genre: 'Folk',
    mood: 'Peaceful',
    key: 'G Major',
    bpm: 76,
    dateAdded: new Date('2024-02-05'),
    coverArt: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=400&fit=crop',
    isFavorite: false,
    tags: ['acoustic', 'folk', 'morning'],
    folder: 'Folk',
  },
  {
    id: '5',
    title: 'Hip Hop Beat',
    artist: 'MC Flow',
    album: 'Street Chronicles',
    duration: 189,
    size: 6800000,
    format: 'm4a',
    genre: 'Hip Hop',
    mood: 'Confident',
    key: 'F Minor',
    bpm: 95,
    dateAdded: new Date('2024-02-10'),
    coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    isFavorite: true,
    tags: ['hip-hop', 'rap', 'urban'],
    folder: 'Hip Hop',
  },
  {
    id: '6',
    title: 'Classical Symphony',
    artist: 'Orchestra Ensemble',
    album: 'Timeless Classics',
    duration: 456,
    size: 18000000,
    format: 'flac',
    genre: 'Classical',
    mood: 'Dramatic',
    key: 'D Major',
    bpm: 120,
    dateAdded: new Date('2024-02-12'),
    coverArt: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop',
    isFavorite: false,
    tags: ['classical', 'orchestra', 'symphony'],
    folder: 'Classical',
  },
];

export const Library: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('dateAdded');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showUpload, setShowUpload] = useState(false);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>(mockAudioFiles);
  const [aiAnalyses, setAiAnalyses] = useState<{ file: File; analysis: AIAnalysisResult }[]>([]);

  // Get unique genres
  const genres = useMemo(() => {
    const genreSet = new Set(audioFiles.map(file => file.genre).filter(Boolean));
    return ['all', ...Array.from(genreSet)];
  }, [audioFiles]);

  // Filter and sort files
  const filteredFiles = useMemo(() => {
    let filtered = audioFiles;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(file =>
        file.title.toLowerCase().includes(query) ||
        file.artist.toLowerCase().includes(query) ||
        file.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Genre filter
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(file => file.genre === selectedGenre);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'dateAdded':
          comparison = a.dateAdded.getTime() - b.dateAdded.getTime();
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [audioFiles, searchQuery, selectedGenre, sortField, sortOrder]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const toggleFavorite = (id: string) => {
    setAudioFiles(prev =>
      prev.map(file =>
        file.id === id ? { ...file, isFavorite: !file.isFavorite } : file
      )
    );
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleAIAnalysisComplete = (analyses: { file: File; analysis: AIAnalysisResult }[]) => {
    console.log('AI analyses completed:', analyses);
    setAiAnalyses(analyses);
    
    // Optionally create new audio files from uploaded and analyzed files
    const newAudioFiles: AudioFile[] = analyses.map(({ file, analysis }, index) => ({
      id: `ai-${Date.now()}-${index}`,
      title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
      artist: 'Unknown Artist',
      album: undefined,
      duration: 0, // Will be calculated when audio is processed
      size: file.size,
      format: file.type.split('/')[1] || 'unknown',
      genre: analysis.genre || undefined,
      mood: analysis.mood || undefined,
      key: analysis.key || undefined,
      bpm: analysis.bpm || undefined,
      dateAdded: new Date(),
      coverArt: undefined,
      isFavorite: false,
      tags: [],
      folder: undefined,
    }));

    // Add to existing files or update them
    setAudioFiles(prev => [...prev, ...newAudioFiles]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Music Library</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredFiles.length} {filteredFiles.length === 1 ? 'track' : 'tracks'}
          </p>
        </div>
        <Button onClick={() => setShowUpload(!showUpload)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Music
        </Button>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <div className="animate-fade-in">
          <AudioUpload
            onUploadComplete={(files) => {
              console.log('Uploaded files:', files);
              setShowUpload(false);
            }}
            onAnalysisComplete={handleAIAnalysisComplete}
          />
        </div>
      )}

      {/* Filters and Controls */}
      <Card>
        <div className="p-4 space-y-4">
          {/* Search and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by title, artist, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Genre Filter and Sort */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`
                  px-3 py-1 rounded-full text-sm font-medium transition-colors
                  ${selectedGenre === genre
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Sort by:</span>
            {[
              { field: 'title' as SortField, label: 'Title' },
              { field: 'dateAdded' as SortField, label: 'Date Added' },
              { field: 'duration' as SortField, label: 'Duration' },
              { field: 'size' as SortField, label: 'Size' },
            ].map(({ field, label }) => (
              <button
                key={field}
                onClick={() => toggleSort(field)}
                className={`
                  flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors
                  ${sortField === field
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <span>{label}</span>
                {sortField === field && (
                  sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                )}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* File Grid/List */}
      {filteredFiles.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <Music className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No tracks found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery || selectedGenre !== 'all'
                ? 'Try adjusting your filters'
                : 'Upload your first track to get started'
              }
            </p>
            {!showUpload && (
              <Button onClick={() => setShowUpload(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Music
              </Button>
            )}
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map(file => (
            <Card key={file.id} variant="elevated" className="group hover:shadow-xl transition-shadow">
              <div className="relative">
                {/* Cover Art */}
                <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-200 dark:bg-gray-800">
                  {file.coverArt ? (
                    <img
                      src={file.coverArt}
                      alt={file.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="lg" className="rounded-full">
                      <Play className="w-6 h-6" />
                    </Button>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(file.id)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${file.isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`}
                    />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
                    {file.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
                    {file.artist}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDuration(file.duration)}
                    </span>
                    <span className="uppercase">{file.format}</span>
                  </div>

                  {/* Tags */}
                  {file.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {file.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredFiles.map(file => (
              <div
                key={file.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
              >
                <div className="flex items-center space-x-4">
                  {/* Cover Art */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                      {file.coverArt ? (
                        <img
                          src={file.coverArt}
                          alt={file.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <button className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <Play className="w-6 h-6 text-white" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {file.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {file.artist}
                      {file.album && ` • ${file.album}`}
                    </p>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {file.genre && <span>{file.genre}</span>}
                      {file.bpm && (
                        <>
                          <span>•</span>
                          <span>{file.bpm} BPM</span>
                        </>
                      )}
                      {file.key && (
                        <>
                          <span>•</span>
                          <span>{file.key}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDuration(file.duration)}
                    </span>
                    <span>{formatFileSize(file.size)}</span>
                    <span className="uppercase">{file.format}</span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(file.dateAdded)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleFavorite(file.id)}
                      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${file.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                      />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};