import React, { useState } from 'react';
import { X, Save, Upload, Music, Tag, Calendar, Clock, Disc, Brain } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

interface AudioMetadata {
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  year?: number;
  bpm?: number;
  key?: string;
  mood?: string;
  tags: string[];
  description?: string;
  coverArt?: string;
}

interface MetadataEditorProps {
  metadata: AudioMetadata;
  aiSuggestions?: {
    bpm?: number;
    key?: string;
    genre?: string;
    mood?: string;
    confidence?: number;
  };
  onSave: (metadata: AudioMetadata) => void;
  onCancel: () => void;
}

const GENRE_OPTIONS = [
  'Electronic', 'Rock', 'Pop', 'Hip Hop', 'Jazz', 'Classical',
  'R&B', 'Country', 'Folk', 'Metal', 'Indie', 'Blues',
  'Reggae', 'Latin', 'World', 'Ambient', 'Experimental', 'Other'
];

const KEY_OPTIONS = [
  'C Major', 'C Minor', 'C# Major', 'C# Minor',
  'D Major', 'D Minor', 'D# Major', 'D# Minor',
  'E Major', 'E Minor', 'F Major', 'F Minor',
  'F# Major', 'F# Minor', 'G Major', 'G Minor',
  'G# Major', 'G# Minor', 'A Major', 'A Minor',
  'A# Major', 'A# Minor', 'B Major', 'B Minor'
];

const MOOD_OPTIONS = [
  'Energetic', 'Calm', 'Happy', 'Sad', 'Aggressive',
  'Peaceful', 'Romantic', 'Dark', 'Uplifting', 'Melancholic',
  'Mysterious', 'Playful', 'Dramatic', 'Relaxed', 'Intense'
];

export const MetadataEditor: React.FC<MetadataEditorProps> = ({
  metadata: initialMetadata,
  aiSuggestions,
  onSave,
  onCancel,
}) => {
  const [metadata, setMetadata] = useState<AudioMetadata>({
    ...initialMetadata,
    // Apply AI suggestions if present
    bpm: aiSuggestions?.bpm || initialMetadata.bpm,
    key: aiSuggestions?.key || initialMetadata.key,
    genre: aiSuggestions?.genre || initialMetadata.genre,
    mood: aiSuggestions?.mood || initialMetadata.mood,
  });
  const [tagInput, setTagInput] = useState('');
  const [coverArtFile, setCoverArtFile] = useState<File | null>(null);

  const handleInputChange = (field: keyof AudioMetadata, value: any) => {
    setMetadata(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !metadata.tags.includes(tagInput.trim())) {
      setMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleCoverArtUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setCoverArtFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setMetadata(prev => ({
          ...prev,
          coverArt: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(metadata);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                <Music className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit Metadata
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Update track information and details
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* AI Analysis Status */}
          {aiSuggestions && (
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-purple-900 dark:text-purple-300">
                  AI Analysis Complete
                </h3>
                {aiSuggestions.confidence && (
                  <span className="px-2 py-1 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                    {Math.round(aiSuggestions.confidence * 100)}% confidence
                  </span>
                )}
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">
                AI has analyzed your audio and suggested values for BPM, key, genre, and mood. 
                Fields with purple highlights contain AI suggestions that you can accept or modify.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cover Art Section */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cover Art
              </label>
              <div className="space-y-3">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 relative group">
                  {metadata.coverArt ? (
                    <>
                      <img
                        src={metadata.coverArt}
                        alt="Cover art"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverArtUpload}
                            className="hidden"
                          />
                          <div className="flex flex-col items-center text-white">
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-sm">Change Image</span>
                          </div>
                        </label>
                      </div>
                    </>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverArtUpload}
                        className="hidden"
                      />
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Upload Cover Art
                      </span>
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Recommended: 1000x1000px, JPG or PNG
                </p>
              </div>
            </div>

            {/* Metadata Fields */}
            <div className="lg:col-span-2 space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <Input
                    type="text"
                    value={metadata.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Track title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Artist *
                  </label>
                  <Input
                    type="text"
                    value={metadata.artist}
                    onChange={(e) => handleInputChange('artist', e.target.value)}
                    placeholder="Artist name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Album
                  </label>
                  <Input
                    type="text"
                    value={metadata.album || ''}
                    onChange={(e) => handleInputChange('album', e.target.value)}
                    placeholder="Album name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Genre
                    {aiSuggestions?.genre && (
                      <span className="ml-2 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs rounded-full">
                        AI: {aiSuggestions.genre}
                      </span>
                    )}
                  </label>
                  <select
                    value={metadata.genre || ''}
                    onChange={(e) => handleInputChange('genre', e.target.value)}
                    className={`w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      aiSuggestions?.genre 
                        ? 'border-purple-300 dark:border-purple-600 focus:border-purple-500' 
                        : 'border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    <option value="">Select genre</option>
                    {GENRE_OPTIONS.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Year
                  </label>
                  <Input
                    type="number"
                    value={metadata.year || ''}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value) || undefined)}
                    placeholder="2024"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    BPM
                    {aiSuggestions?.bpm && (
                      <span className="ml-2 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs rounded-full">
                        AI: {aiSuggestions.bpm}
                      </span>
                    )}
                  </label>
                  <Input
                    type="number"
                    value={metadata.bpm || ''}
                    onChange={(e) => handleInputChange('bpm', parseInt(e.target.value) || undefined)}
                    placeholder="120"
                    min="1"
                    max="300"
                    className={aiSuggestions?.bpm ? 'border-purple-300 dark:border-purple-600 focus:border-purple-500' : ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Key
                    {aiSuggestions?.key && (
                      <span className="ml-2 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs rounded-full">
                        AI: {aiSuggestions.key}
                      </span>
                    )}
                  </label>
                  <select
                    value={metadata.key || ''}
                    onChange={(e) => handleInputChange('key', e.target.value)}
                    className={`w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      aiSuggestions?.key 
                        ? 'border-purple-300 dark:border-purple-600 focus:border-purple-500' 
                        : 'border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    <option value="">Select key</option>
                    {KEY_OPTIONS.map(key => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mood
                    {aiSuggestions?.mood && (
                      <span className="ml-2 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs rounded-full">
                        AI: {aiSuggestions.mood}
                      </span>
                    )}
                  </label>
                  <select
                    value={metadata.mood || ''}
                    onChange={(e) => handleInputChange('mood', e.target.value)}
                    className={`w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      aiSuggestions?.mood 
                        ? 'border-purple-300 dark:border-purple-600 focus:border-purple-500' 
                        : 'border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    <option value="">Select mood</option>
                    {MOOD_OPTIONS.map(mood => (
                      <option key={mood} value={mood}>{mood}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={metadata.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Add a description for this track..."
                  rows={3}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add tags..."
                    className="flex-1"
                  />
                  <Button onClick={handleAddTag} variant="secondary">
                    <Tag className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {metadata.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};