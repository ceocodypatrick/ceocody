import React, { useState } from 'react';
import { Brain, Upload, Play, Settings, BarChart3, Music, TrendingUp, Zap } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AudioUpload } from '../components/music/AudioUpload';
import { WaveformPlayer } from '../components/music/WaveformPlayer';
import { MetadataEditor } from '../components/music/MetadataEditor';
import { AIAnalysisResult } from '../utils/ai-analysis';

export const AIDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string>('overview');
  const [aiAnalyses, setAiAnalyses] = useState<{ file: File; analysis: AIAnalysisResult }[]>([]);
  const [showMetadataEditor, setShowMetadataEditor] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AIAnalysisResult | null>(null);

  const aiFeatures = [
    {
      id: 'upload',
      title: 'AI-Powered Upload',
      description: 'Upload audio files and watch AI analyze BPM, key, genre, and mood in real-time',
      icon: Upload,
      status: 'ready',
    },
    {
      id: 'analysis',
      title: 'Audio Analysis',
      description: 'Deep audio analysis using Essentia.js for professional music insights',
      icon: BarChart3,
      status: 'ready',
    },
    {
      id: 'metadata',
      title: 'Smart Metadata',
      description: 'AI suggests metadata that you can accept, modify, or reject',
      icon: Settings,
      status: 'ready',
    },
    {
      id: 'recommendations',
      title: 'Smart Recommendations',
      description: 'Get track recommendations based on audio characteristics and mood',
      icon: TrendingUp,
      status: 'coming-soon',
    },
  ];

  const handleAIAnalysisComplete = (analyses: { file: File; analysis: AIAnalysisResult }[]) => {
    console.log('AI analyses completed:', analyses);
    setAiAnalyses(analyses);
    setActiveDemo('results');
  };

  const handleOpenMetadataEditor = (analysis: AIAnalysisResult) => {
    setSelectedAnalysis(analysis);
    setShowMetadataEditor(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              AI-Powered Music Analysis
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Experience the future of music metadata with intelligent audio analysis
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                variant={activeDemo === feature.id ? 'elevated' : 'outlined'}
                className={`
                  cursor-pointer transition-all hover:shadow-lg
                  ${activeDemo === feature.id ? 'ring-2 ring-purple-500' : ''}
                  ${feature.status === 'coming-soon' ? 'opacity-60' : ''}
                `}
                onClick={() => feature.status !== 'coming-soon' && setActiveDemo(feature.id)}
              >
                <div className="p-6 text-center space-y-3">
                  <div className={`
                    w-12 h-12 mx-auto rounded-lg flex items-center justify-center
                    ${activeDemo === feature.id
                      ? 'bg-purple-600'
                      : feature.status === 'coming-soon'
                      ? 'bg-gray-800'
                      : 'bg-gray-800'
                    }
                  `}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1 flex items-center justify-center">
                      {feature.title}
                      {feature.status === 'coming-soon' && (
                        <span className="ml-2 px-2 py-0.5 bg-gray-700 text-gray-400 text-xs rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {feature.description}
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
            {activeDemo === 'overview' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Choose a Feature to Explore
                  </h2>
                  <p className="text-gray-400">
                    Select any feature above to see AI-powered music analysis in action
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card variant="outlined">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                        Powered by Essentia.js
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Advanced audio analysis library from the Music Technology Group 
                        at Universitat Pompeu Fabra, bringing professional-grade music 
                        analysis to your browser.
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">BPM Detection:</span>
                          <span className="text-green-400">✅ Active</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Key Detection:</span>
                          <span className="text-green-400">✅ Active</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Genre Classification:</span>
                          <span className="text-green-400">✅ Active</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Mood Analysis:</span>
                          <span className="text-green-400">✅ Active</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card variant="outlined">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <Music className="w-5 h-5 mr-2 text-blue-400" />
                        Supported Formats
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Upload and analyze all major audio formats with automatic 
                        metadata extraction and AI-powered insights.
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">MP3:</span>
                          <span className="text-green-400">✅ Supported</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">WAV:</span>
                          <span className="text-green-400">✅ Supported</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">FLAC:</span>
                          <span className="text-green-400">✅ Supported</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">M4A:</span>
                          <span className="text-green-400">✅ Supported</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">OGG:</span>
                          <span className="text-green-400">✅ Supported</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeDemo === 'upload' && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    AI-Powered Audio Upload
                  </h2>
                  <p className="text-gray-400">
                    Upload audio files and watch AI analyze them in real-time
                  </p>
                </div>
                <AudioUpload
                  onUploadComplete={(files) => {
                    console.log('Uploaded files:', files);
                  }}
                  onAnalysisComplete={handleAIAnalysisComplete}
                  maxFiles={3}
                  maxSize={50}
                />
              </div>
            )}

            {activeDemo === 'analysis' && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Audio Analysis Engine
                  </h2>
                  <p className="text-gray-400">
                    Deep audio analysis using Essentia.js and WebAssembly
                  </p>
                </div>
                <div className="text-center">
                  <Button onClick={() => setActiveDemo('upload')}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files to See Analysis
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card variant="outlined">
                    <div className="p-4">
                      <h4 className="text-white font-semibold mb-2">Technical Features</h4>
                      <ul className="text-gray-400 text-sm space-y-1">
                        <li>• WebAssembly-powered processing</li>
                        <li>• Real-time audio feature extraction</li>
                        <li>• Browser-based analysis (no server)</li>
                        <li>• Multi-format support</li>
                        <li>• Confidence scoring</li>
                      </ul>
                    </div>
                  </Card>
                  <Card variant="outlined">
                    <div className="p-4">
                      <h4 className="text-white font-semibold mb-2">Analysis Types</h4>
                      <ul className="text-gray-400 text-sm space-y-1">
                        <li>• Temporal features (BPM, rhythm)</li>
                        <li>• Spectral features (frequency content)</li>
                        <li>• Key and scale detection</li>
                        <li>• Energy and loudness</li>
                        <li>• Danceability analysis</li>
                      </ul>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeDemo === 'metadata' && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Smart Metadata Generation
                  </h2>
                  <p className="text-gray-400">
                    AI suggests metadata that you can accept, modify, or reject
                  </p>
                </div>
                <div className="text-center">
                  <Button onClick={() => setActiveDemo('upload')}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files to Try Metadata Editor
                  </Button>
                </div>
                <Card variant="outlined">
                  <div className="p-4">
                    <h4 className="text-white font-semibold mb-3">AI-Suggested Fields</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">128</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">BPM</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Am</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Key</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Electronic</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Genre</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Energetic</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Mood</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeDemo === 'results' && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    AI Analysis Results
                  </h2>
                  <p className="text-gray-400">
                    Results from your uploaded audio files
                  </p>
                </div>
                
                {aiAnalyses.length === 0 ? (
                  <div className="text-center py-8">
                    <Brain className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400 mb-4">
                      No analysis results yet. Upload some audio files to see AI in action!
                    </p>
                    <Button onClick={() => setActiveDemo('upload')}>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Files
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {aiAnalyses.map(({ file, analysis }, index) => (
                      <Card key={index} variant="outlined">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-white font-semibold">{file.name}</h4>
                            <div className="flex items-center space-x-2">
                              {analysis.confidence > 0 && (
                                <span className="px-2 py-1 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                                  {Math.round(analysis.confidence * 100)}% confidence
                                </span>
                              )}
                              <Button
                                size="sm"
                                onClick={() => handleOpenMetadataEditor(analysis)}
                              >
                                <Settings className="w-3 h-3 mr-1" />
                                Edit Metadata
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            {analysis.bpm && (
                              <div>
                                <span className="text-gray-500">BPM:</span>
                                <span className="ml-1 font-medium text-white">{analysis.bpm}</span>
                              </div>
                            )}
                            {analysis.key && (
                              <div>
                                <span className="text-gray-500">Key:</span>
                                <span className="ml-1 font-medium text-white">{analysis.key}</span>
                              </div>
                            )}
                            {analysis.genre && (
                              <div>
                                <span className="text-gray-500">Genre:</span>
                                <span className="ml-1 font-medium text-white">{analysis.genre}</span>
                              </div>
                            )}
                            {analysis.mood && (
                              <div>
                                <span className="text-gray-500">Mood:</span>
                                <span className="ml-1 font-medium text-white">{analysis.mood}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Metadata Editor Modal */}
        {showMetadataEditor && selectedAnalysis && (
          <MetadataEditor
            metadata={{
              title: 'AI-Generated Metadata',
              artist: 'Unknown Artist',
              bpm: selectedAnalysis.bpm,
              key: selectedAnalysis.key,
              genre: selectedAnalysis.genre,
              mood: selectedAnalysis.mood,
              tags: [],
            }}
            aiSuggestions={{
              bpm: selectedAnalysis.bpm,
              key: selectedAnalysis.key,
              genre: selectedAnalysis.genre,
              mood: selectedAnalysis.mood,
              confidence: selectedAnalysis.confidence,
            }}
            onSave={(metadata) => {
              console.log('Saved metadata:', metadata);
              setShowMetadataEditor(false);
            }}
            onCancel={() => setShowMetadataEditor(false)}
          />
        )}
      </div>
    </div>
  );
};