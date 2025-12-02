import React, { useState } from 'react';
import { Music, Upload, Waveform, Edit, FolderOpen } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AudioUpload } from '../components/music/AudioUpload';
import { WaveformPlayer } from '../components/music/WaveformPlayer';
import { MetadataEditor } from '../components/music/MetadataEditor';
import { FolderManager } from '../components/music/FolderManager';

export const MusicDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string>('upload');
  const [showMetadataEditor, setShowMetadataEditor] = useState(false);
  const [folders, setFolders] = useState([
    { id: '1', name: 'Electronic', trackCount: 12, color: '#3b82f6', createdAt: new Date() },
    { id: '2', name: 'Rock', trackCount: 8, color: '#ef4444', createdAt: new Date() },
    { id: '3', name: 'Jazz', trackCount: 15, color: '#8b5cf6', createdAt: new Date() },
  ]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>();

  const sampleMetadata = {
    title: 'Summer Vibes',
    artist: 'DJ Producer',
    album: 'Beach Sessions',
    genre: 'Electronic',
    year: 2024,
    bpm: 128,
    key: 'C Major',
    mood: 'Energetic',
    tags: ['summer', 'upbeat', 'dance'],
    description: 'An energetic summer track perfect for beach parties and outdoor festivals.',
    coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
  };

  const demos = [
    {
      id: 'upload',
      title: 'Audio Upload',
      description: 'Drag & drop file upload with progress tracking',
      icon: Upload,
    },
    {
      id: 'player',
      title: 'Waveform Player',
      description: 'Audio player with waveform visualization',
      icon: Waveform,
    },
    {
      id: 'metadata',
      title: 'Metadata Editor',
      description: 'Comprehensive metadata editing interface',
      icon: Edit,
    },
    {
      id: 'folders',
      title: 'Folder Manager',
      description: 'Organize music into folders and collections',
      icon: FolderOpen,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Music Components Demo
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Explore the new music library features built for Harmoni
          </p>
        </div>

        {/* Demo Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {demos.map((demo) => {
            const Icon = demo.icon;
            return (
              <Card
                key={demo.id}
                variant={activeDemo === demo.id ? 'elevated' : 'outlined'}
                className={`
                  cursor-pointer transition-all hover:shadow-lg
                  ${activeDemo === demo.id ? 'ring-2 ring-primary-500' : ''}
                `}
                onClick={() => setActiveDemo(demo.id)}
              >
                <div className="p-6 text-center space-y-3">
                  <div className={`
                    w-12 h-12 mx-auto rounded-lg flex items-center justify-center
                    ${activeDemo === demo.id
                      ? 'bg-primary-600'
                      : 'bg-gray-800'
                    }
                  `}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      {demo.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {demo.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Demo Content */}
        <Card>
          <div className="p-6">
            {activeDemo === 'upload' && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Audio File Upload
                  </h2>
                  <p className="text-gray-400">
                    Try uploading audio files using drag & drop or click to browse
                  </p>
                </div>
                <AudioUpload
                  onUploadComplete={(files) => {
                    console.log('Uploaded:', files);
                  }}
                  maxFiles={5}
                  maxSize={50}
                />
              </div>
            )}

            {activeDemo === 'player' && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Waveform Audio Player
                  </h2>
                  <p className="text-gray-400">
                    Interactive audio player with waveform visualization
                  </p>
                </div>
                <div className="max-w-3xl mx-auto">
                  <WaveformPlayer
                    audioUrl="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                    title="Sample Track"
                    artist="Demo Artist"
                  />
                  <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">Features:</h3>
                    <ul className="text-gray-400 text-sm space-y-1">
                      <li>• Click on waveform to seek</li>
                      <li>• Play/pause controls</li>
                      <li>• Skip forward/backward (10s)</li>
                      <li>• Volume control with mute</li>
                      <li>• Real-time progress tracking</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeDemo === 'metadata' && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Metadata Editor
                  </h2>
                  <p className="text-gray-400">
                    Comprehensive metadata editing with cover art upload
                  </p>
                </div>
                <div className="text-center">
                  <Button onClick={() => setShowMetadataEditor(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Open Metadata Editor
                  </Button>
                </div>
                <div className="max-w-2xl mx-auto p-4 bg-gray-900 rounded-lg">
                  <h3 className="text-white font-semibold mb-3">Features:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-400 text-sm">
                    <div>
                      <h4 className="text-white font-medium mb-2">Basic Info</h4>
                      <ul className="space-y-1">
                        <li>• Title & Artist</li>
                        <li>• Album & Year</li>
                        <li>• Genre Selection</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Musical Data</h4>
                      <ul className="space-y-1">
                        <li>• BPM & Key</li>
                        <li>• Mood Selection</li>
                        <li>• Tag Management</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Visual</h4>
                      <ul className="space-y-1">
                        <li>• Cover Art Upload</li>
                        <li>• Image Preview</li>
                        <li>• Drag & Drop</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Additional</h4>
                      <ul className="space-y-1">
                        <li>• Description Field</li>
                        <li>• Custom Tags</li>
                        <li>• Form Validation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeDemo === 'folders' && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Folder Management
                  </h2>
                  <p className="text-gray-400">
                    Organize your music library with custom folders
                  </p>
                </div>
                <div className="max-w-2xl mx-auto">
                  <FolderManager
                    folders={folders}
                    selectedFolderId={selectedFolderId}
                    onSelectFolder={setSelectedFolderId}
                    onCreateFolder={(name, color) => {
                      const newFolder = {
                        id: Date.now().toString(),
                        name,
                        trackCount: 0,
                        color,
                        createdAt: new Date(),
                      };
                      setFolders([...folders, newFolder]);
                    }}
                    onUpdateFolder={(id, name, color) => {
                      setFolders(folders.map(f =>
                        f.id === id ? { ...f, name, color } : f
                      ));
                    }}
                    onDeleteFolder={(id) => {
                      setFolders(folders.filter(f => f.id !== id));
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Info Card */}
        <Card variant="outlined">
          <div className="p-6">
            <h3 className="text-white font-semibold mb-3">
              Phase 2: Core Music Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="text-primary-400 font-medium mb-2">Completed</h4>
                <ul className="text-gray-400 space-y-1">
                  <li>✅ Audio Upload System</li>
                  <li>✅ Music Library Interface</li>
                  <li>✅ Waveform Player</li>
                  <li>✅ Metadata Editor</li>
                  <li>✅ Folder Management</li>
                </ul>
              </div>
              <div>
                <h4 className="text-yellow-400 font-medium mb-2">In Progress</h4>
                <ul className="text-gray-400 space-y-1">
                  <li>🔄 Playlist Management</li>
                  <li>🔄 Bulk Operations</li>
                  <li>🔄 Playback Speed Control</li>
                  <li>🔄 Queue Management</li>
                </ul>
              </div>
              <div>
                <h4 className="text-gray-400 font-medium mb-2">Next Up</h4>
                <ul className="text-gray-400 space-y-1">
                  <li>⏳ AI Genre Detection</li>
                  <li>⏳ Mood Analysis</li>
                  <li>⏳ Collaboration Tools</li>
                  <li>⏳ Real-time Editing</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Metadata Editor Modal */}
      {showMetadataEditor && (
        <MetadataEditor
          metadata={sampleMetadata}
          onSave={(metadata) => {
            console.log('Saved metadata:', metadata);
            setShowMetadataEditor(false);
          }}
          onCancel={() => setShowMetadataEditor(false)}
        />
      )}
    </div>
  );
};