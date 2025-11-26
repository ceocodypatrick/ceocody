import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, CheckCircle, AlertCircle, Music, FileAudio, Brain, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { analyzeAudioFile, AIAnalysisResult } from '../../utils/ai-analysis';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'analyzing' | 'uploading' | 'success' | 'error';
  error?: string;
  metadata?: {
    duration?: number;
    bitrate?: number;
    sampleRate?: number;
    format?: string;
  };
  aiAnalysis?: AIAnalysisResult;
}

interface AudioUploadProps {
  onUploadComplete?: (files: File[]) => void;
  onAnalysisComplete?: (analyses: { file: File; analysis: AIAnalysisResult }[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
}

const ACCEPTED_AUDIO_FORMATS = {
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/flac': ['.flac'],
  'audio/m4a': ['.m4a'],
  'audio/ogg': ['.ogg'],
  'audio/aac': ['.aac'],
};

export const AudioUpload: React.FC<AudioUploadProps> = ({
  onUploadComplete,
  onAnalysisComplete,
  maxFiles = 10,
  maxSize = 100, // 100MB default
  acceptedFormats = Object.keys(ACCEPTED_AUDIO_FORMATS),
}) => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedAnalyses, setCompletedAnalyses] = useState<{ file: File; analysis: AIAnalysisResult }[]>([]);

  const processAudioFile = async (file: File): Promise<UploadFile['metadata']> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      
      audio.addEventListener('loadedmetadata', () => {
        const metadata = {
          duration: audio.duration,
          format: file.type,
        };
        URL.revokeObjectURL(url);
        resolve(metadata);
      });

      audio.addEventListener('error', () => {
        URL.revokeObjectURL(url);
        resolve({});
      });

      audio.src = url;
    });
  };

  const performAIAnalysis = async (uploadFile: UploadFile): Promise<AIAnalysisResult | null> => {
    try {
      // Set status to analyzing
      setUploadFiles(prev =>
        prev.map(f =>
          f.id === uploadFile.id
            ? { ...f, status: 'analyzing' }
            : f
        )
      );

      // Perform AI analysis
      const analysis = await analyzeAudioFile(uploadFile.file);
      
      // Update file with AI analysis results
      setUploadFiles(prev =>
        prev.map(f =>
          f.id === uploadFile.id
            ? { ...f, aiAnalysis: analysis }
            : f
        )
      );

      return analysis;
    } catch (error) {
      console.error('AI analysis failed:', error);
      return null;
    }
  };

  const simulateUpload = (fileId: string): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadFiles(prev =>
            prev.map(f =>
              f.id === fileId
                ? { ...f, progress: 100, status: 'success' }
                : f
            )
          );
          resolve();
        } else {
          setUploadFiles(prev =>
            prev.map(f =>
              f.id === fileId
                ? { ...f, progress: Math.floor(progress), status: 'uploading' }
                : f
            )
          );
        }
      }, 200);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    setIsProcessing(true);

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejectedUploads: UploadFile[] = rejectedFiles.map(({ file, errors }) => ({
        id: `${file.name}-${Date.now()}`,
        file,
        progress: 0,
        status: 'error',
        error: errors[0]?.message || 'File rejected',
      }));
      setUploadFiles(prev => [...prev, ...rejectedUploads]);
    }

    // Process accepted files with AI analysis
    const newFiles: UploadFile[] = await Promise.all(
      acceptedFiles.map(async (file) => {
        const metadata = await processAudioFile(file);
        return {
          id: `${file.name}-${Date.now()}`,
          file,
          progress: 0,
          status: 'pending' as const,
          metadata,
        };
      })
    );

    setUploadFiles(prev => [...prev, ...newFiles]);

    // Start AI analysis first
    const analyses: { file: File; analysis: AIAnalysisResult }[] = [];
    for (const uploadFile of newFiles) {
      const analysis = await performAIAnalysis(uploadFile);
      if (analysis) {
        analyses.push({ file: uploadFile.file, analysis });
      }
      
      // Then start uploading
      await simulateUpload(uploadFile.id);
    }

    // Notify parent component of completed analyses
    if (onAnalysisComplete && analyses.length > 0) {
      onAnalysisComplete(analyses);
    }
    setCompletedAnalyses(prev => [...prev, ...analyses]);

    setIsProcessing(false);

    // Notify parent component
    if (onUploadComplete) {
      const successfulFiles = newFiles.map(uf => uf.file);
      onUploadComplete(successfulFiles);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats.reduce((acc, format) => {
      acc[format] = ACCEPTED_AUDIO_FORMATS[format as keyof typeof ACCEPTED_AUDIO_FORMATS] || [];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles,
    maxSize: maxSize * 1024 * 1024,
    multiple: true,
  });

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const clearAll = () => {
    setUploadFiles([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const successCount = uploadFiles.filter(f => f.status === 'success').length;
  const errorCount = uploadFiles.filter(f => f.status === 'error').length;
  const uploadingCount = uploadFiles.filter(f => f.status === 'uploading').length;
  const analyzingCount = uploadFiles.filter(f => f.status === 'analyzing').length;

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <Card variant="outlined">
        <div
          {...getRootProps()}
          className={`
            p-12 text-center cursor-pointer transition-all duration-200
            border-2 border-dashed rounded-lg
            ${isDragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
              : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className={`
              p-4 rounded-full transition-colors
              ${isDragActive
                ? 'bg-primary-100 dark:bg-primary-900/20'
                : 'bg-gray-100 dark:bg-gray-800'
              }
            `}>
              <Upload className={`w-12 h-12 ${isDragActive ? 'text-primary-600' : 'text-gray-400'}`} />
            </div>
            
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {isDragActive ? 'Drop your audio files here' : 'Upload Audio Files'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Drag & drop or click to browse
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">MP3</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">WAV</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">FLAC</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">M4A</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">OGG</span>
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500">
              Max {maxFiles} files • Up to {maxSize}MB each
            </p>
          </div>
        </div>
      </Card>

      {/* Upload Status Summary */}
      {uploadFiles.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            {successCount > 0 && (
              <span className="flex items-center text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4 mr-1" />
                {successCount} uploaded
              </span>
            )}
            {analyzingCount > 0 && (
              <span className="flex items-center text-purple-600 dark:text-purple-400">
                <Brain className="w-4 h-4 mr-1 animate-pulse" />
                {analyzingCount} analyzing
              </span>
            )}
            {uploadingCount > 0 && (
              <span className="flex items-center text-blue-600 dark:text-blue-400">
                <Upload className="w-4 h-4 mr-1 animate-pulse" />
                {uploadingCount} uploading
              </span>
            )}
            {errorCount > 0 && (
              <span className="flex items-center text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errorCount} failed
              </span>
            )}
          </div>
          
          {uploadFiles.length > 0 && !isProcessing && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear All
            </Button>
          )}
        </div>
      )}

      {/* File List */}
      {uploadFiles.length > 0 && (
        <div className="space-y-2">
          {uploadFiles.map((uploadFile) => (
            <Card key={uploadFile.id} variant="outlined">
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className={`
                    p-2 rounded-lg flex-shrink-0
                    ${uploadFile.status === 'success' ? 'bg-green-100 dark:bg-green-900/20' :
                      uploadFile.status === 'error' ? 'bg-red-100 dark:bg-red-900/20' :
                      'bg-blue-100 dark:bg-blue-900/20'
                    }
                  `}>
                    {uploadFile.status === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : uploadFile.status === 'error' ? (
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    ) : (
                      <FileAudio className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {uploadFile.file.name}
                        </p>
                        <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>{formatFileSize(uploadFile.file.size)}</span>
                          {uploadFile.metadata?.duration && (
                            <>
                              <span>•</span>
                              <span>{formatDuration(uploadFile.metadata.duration)}</span>
                            </>
                          )}
                          {uploadFile.metadata?.format && (
                            <>
                              <span>•</span>
                              <span className="uppercase">{uploadFile.metadata.format.split('/')[1]}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Remove Button */}
                      {uploadFile.status !== 'uploading' && (
                        <button
                          onClick={() => removeFile(uploadFile.id)}
                          className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {uploadFile.status === 'analyzing' && (
                      <div className="mt-2">
                        <div className="flex items-center text-xs text-purple-600 dark:text-purple-400 mb-1">
                          <Brain className="w-3 h-3 mr-1 animate-pulse" />
                          <span>AI Analyzing...</span>
                        </div>
                        <div className="w-full bg-purple-200 dark:bg-purple-900 rounded-full h-1.5">
                          <div className="bg-purple-600 h-1.5 rounded-full animate-pulse transition-all duration-300" />
                        </div>
                      </div>
                    )}

                    {uploadFile.status === 'uploading' && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Uploading...</span>
                          <span>{uploadFile.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div
                            className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadFile.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* AI Analysis Results */}
                    {uploadFile.aiAnalysis && uploadFile.aiAnalysis.analysisComplete && (
                      <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center mb-2">
                          <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-2" />
                          <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                            AI Analysis Complete
                          </span>
                          {uploadFile.aiAnalysis.confidence > 0 && (
                            <span className="ml-auto text-xs text-purple-600 dark:text-purple-400">
                              {Math.round(uploadFile.aiAnalysis.confidence * 100)}% confidence
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {uploadFile.aiAnalysis.bpm && (
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">BPM:</span>
                              <span className="ml-1 font-medium text-gray-900 dark:text-white">
                                {uploadFile.aiAnalysis.bpm}
                              </span>
                            </div>
                          )}
                          
                          {uploadFile.aiAnalysis.key && (
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Key:</span>
                              <span className="ml-1 font-medium text-gray-900 dark:text-white">
                                {uploadFile.aiAnalysis.key}
                              </span>
                            </div>
                          )}
                          
                          {uploadFile.aiAnalysis.genre && (
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Genre:</span>
                              <span className="ml-1 font-medium text-gray-900 dark:text-white">
                                {uploadFile.aiAnalysis.genre}
                              </span>
                            </div>
                          )}
                          
                          {uploadFile.aiAnalysis.mood && (
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Mood:</span>
                              <span className="ml-1 font-medium text-gray-900 dark:text-white">
                                {uploadFile.aiAnalysis.mood}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Error Message */}
                    {uploadFile.status === 'error' && uploadFile.error && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                        {uploadFile.error}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};