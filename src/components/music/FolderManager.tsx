import React, { useState } from 'react';
import { Folder, Plus, Edit2, Trash2, FolderOpen, Music, MoreVertical, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

interface FolderItem {
  id: string;
  name: string;
  trackCount: number;
  color?: string;
  createdAt: Date;
}

interface FolderManagerProps {
  folders: FolderItem[];
  onCreateFolder: (name: string, color?: string) => void;
  onUpdateFolder: (id: string, name: string, color?: string) => void;
  onDeleteFolder: (id: string) => void;
  onSelectFolder: (id: string) => void;
  selectedFolderId?: string;
}

const FOLDER_COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#10b981' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Gray', value: '#6b7280' },
];

export const FolderManager: React.FC<FolderManagerProps> = ({
  folders,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
  onSelectFolder,
  selectedFolderId,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [folderName, setFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState(FOLDER_COLORS[0].value);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleCreate = () => {
    if (folderName.trim()) {
      onCreateFolder(folderName.trim(), selectedColor);
      setFolderName('');
      setSelectedColor(FOLDER_COLORS[0].value);
      setIsCreating(false);
    }
  };

  const handleUpdate = (id: string) => {
    if (folderName.trim()) {
      onUpdateFolder(id, folderName.trim(), selectedColor);
      setFolderName('');
      setSelectedColor(FOLDER_COLORS[0].value);
      setEditingId(null);
    }
  };

  const startEdit = (folder: FolderItem) => {
    setEditingId(folder.id);
    setFolderName(folder.name);
    setSelectedColor(folder.color || FOLDER_COLORS[0].value);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFolderName('');
    setSelectedColor(FOLDER_COLORS[0].value);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <FolderOpen className="w-5 h-5 mr-2" />
          Folders & Collections
        </h3>
        {!isCreating && !editingId && (
          <Button size="sm" onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4 mr-1" />
            New Folder
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card variant="outlined">
          <div className="p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: selectedColor }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <Folder className="w-5 h-5 text-white" />
              </div>
              <Input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Folder name"
                className="flex-1"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    editingId ? handleUpdate(editingId) : handleCreate();
                  }
                }}
              />
            </div>

            {/* Color Picker */}
            {showColorPicker && (
              <div className="grid grid-cols-5 gap-2">
                {FOLDER_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => {
                      setSelectedColor(color.value);
                      setShowColorPicker(false);
                    }}
                    className={`
                      w-full aspect-square rounded-lg transition-transform hover:scale-110
                      ${selectedColor === color.value ? 'ring-2 ring-offset-2 ring-primary-500' : ''}
                    `}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="ghost" size="sm" onClick={cancelEdit}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => editingId ? handleUpdate(editingId) : handleCreate()}
                disabled={!folderName.trim()}
              >
                {editingId ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Folder List */}
      <div className="space-y-2">
        {folders.length === 0 ? (
          <Card variant="outlined">
            <div className="p-8 text-center">
              <Folder className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                No folders yet
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                Create folders to organize your music library
              </p>
              <Button size="sm" onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Create First Folder
              </Button>
            </div>
          </Card>
        ) : (
          folders.map((folder) => (
            <Card
              key={folder.id}
              variant={selectedFolderId === folder.id ? 'elevated' : 'outlined'}
              className={`
                cursor-pointer transition-all hover:shadow-md
                ${selectedFolderId === folder.id ? 'ring-2 ring-primary-500' : ''}
              `}
              onClick={() => onSelectFolder(folder.id)}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: folder.color || FOLDER_COLORS[0].value }}
                  >
                    <Folder className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">
                      {folder.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <Music className="w-3 h-3 mr-1" />
                      {folder.trackCount} {folder.trackCount === 1 ? 'track' : 'tracks'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(folder);
                    }}
                    className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete folder "${folder.name}"?`)) {
                        onDeleteFolder(folder.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Quick Stats */}
      {folders.length > 0 && (
        <Card variant="outlined">
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {folders.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Folders
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {folders.reduce((sum, f) => sum + f.trackCount, 0)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Tracks
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};