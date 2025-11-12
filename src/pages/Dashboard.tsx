import React, { useState } from 'react';
import { 
  Music, 
  Users, 
  Play, 
  Clock, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Heart,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Project, ProjectStatus, UserRole } from '../types';
import { formatDate, timeAgo, truncateText } from '../utils/helpers';

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Summer Vibes',
    description: 'An upbeat electronic track perfect for summer playlists',
    genre: 'Electronic',
    mood: 'Happy',
    bpm: 128,
    key: 'C Major',
    duration: 245,
    coverImage: 'https://picsum.photos/seed/project1/400/400',
    status: ProjectStatus.IN_PROGRESS,
    visibility: 'collaborators' as any,
    createdBy: '1',
    collaborators: [
      { userId: '1', role: 'owner' as any, permissions: [], joinedAt: new Date(), lastActive: new Date() },
      { userId: '2', role: 'producer' as any, permissions: [], joinedAt: new Date(), lastActive: new Date() }
    ],
    files: [],
    comments: [],
    tags: ['electronic', 'dance', 'summer'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    deadline: new Date('2024-02-01')
  },
  {
    id: '2',
    title: 'Midnight Blues',
    description: 'A soulful blues composition with jazz influences',
    genre: 'Blues',
    mood: 'Melancholic',
    bpm: 80,
    key: 'A Minor',
    duration: 320,
    coverImage: 'https://picsum.photos/seed/project2/400/400',
    status: ProjectStatus.REVIEW,
    visibility: 'public' as any,
    createdBy: '1',
    collaborators: [],
    files: [],
    comments: [],
    tags: ['blues', 'jazz', 'acoustic'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    title: 'Urban Dreams',
    description: 'Hip hop track with lo-fi elements',
    genre: 'Hip Hop',
    mood: 'Relaxed',
    bpm: 95,
    key: 'G Minor',
    duration: 180,
    coverImage: 'https://picsum.photos/seed/project3/400/400',
    status: ProjectStatus.DRAFT,
    visibility: 'private' as any,
    createdBy: '1',
    collaborators: [],
    files: [],
    comments: [],
    tags: ['hip-hop', 'lo-fi', 'urban'],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-14')
  }
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { loadTrack } = useAudioPlayer();
  const [activeTab, setActiveTab] = useState<'recent' | 'collaborating' | 'drafts'>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = mockProjects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.IN_PROGRESS:
        return 'bg-blue-600';
      case ProjectStatus.REVIEW:
        return 'bg-yellow-600';
      case ProjectStatus.COMPLETED:
        return 'bg-green-600';
      case ProjectStatus.DRAFT:
        return 'bg-gray-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusText = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.IN_PROGRESS:
        return 'In Progress';
      case ProjectStatus.REVIEW:
        return 'In Review';
      case ProjectStatus.COMPLETED:
        return 'Completed';
      case ProjectStatus.DRAFT:
        return 'Draft';
      default:
        return 'Unknown';
    }
  };

  const handlePlayProject = (project: Project) => {
    // In a real app, you'd play the actual audio file
    console.log('Playing project:', project.title);
  };

  const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <Card variant="elevated" interactive className="group">
      <div className="relative">
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-48 object-cover rounded-t-xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <button
              onClick={() => handlePlayProject(project)}
              className="p-3 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors shadow-lg"
            >
              <Play className="h-5 w-5 text-white fill-current" />
            </button>
            <button className="p-2 bg-gray-800/80 rounded-full hover:bg-gray-800 transition-colors">
              <MoreVertical className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
        <div className="absolute top-4 left-4">
          <span className={cn(
            'px-2 py-1 text-xs font-medium rounded-full',
            getStatusColor(project.status)
          )}>
            {getStatusText(project.status)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-gray-400 mb-3">
          {truncateText(project.description, 80)}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{project.genre}</span>
          <span>{project.bpm} BPM • {project.key}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{project.collaborators.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-3 w-3" />
              <span>{project.comments.length}</span>
            </div>
          </div>
          
          <span className="text-xs text-gray-500">
            {timeAgo(project.updatedAt)}
          </span>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.displayName}!
          </h1>
          <p className="text-gray-400">
            Ready to create something amazing today?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Active Projects</p>
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-xs text-green-400 mt-1">+2 this week</p>
              </div>
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <Music className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Collaborators</p>
                <p className="text-2xl font-bold text-white">28</p>
                <p className="text-xs text-green-400 mt-1">+5 this month</p>
              </div>
              <div className="p-3 bg-purple-600/20 rounded-lg">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </Card>

          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Hours Tracked</p>
                <p className="text-2xl font-bold text-white">156</p>
                <p className="text-xs text-yellow-400 mt-1">+12 this week</p>
              </div>
              <div className="p-3 bg-green-600/20 rounded-lg">
                <Clock className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </Card>

          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Completion Rate</p>
                <p className="text-2xl font-bold text-white">87%</p>
                <p className="text-xs text-green-400 mt-1">+3% this month</p>
              </div>
              <div className="p-3 bg-yellow-600/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Projects Section */}
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-white">Your Projects</h2>
              
              {/* Tabs */}
              <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('recent')}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    activeTab === 'recent'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  )}
                >
                  Recent
                </button>
                <button
                  onClick={() => setActiveTab('collaborating')}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    activeTab === 'collaborating'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  )}
                >
                  Collaborating
                </button>
                <button
                  onClick={() => setActiveTab('drafts')}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    activeTab === 'drafts'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  )}
                >
                  Drafts
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                />
              </div>

              {/* Filter */}
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>

              {/* New Project */}
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <Music className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery ? 'Try adjusting your search terms' : 'Start by creating your first project'}
              </p>
              {!searchQuery && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Project
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-gray-900 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { icon: Music, text: 'Summer Vibes - New audio track added', time: '2 hours ago' },
              { icon: Users, text: 'Sarah Producer joined Urban Dreams', time: '5 hours ago' },
              { icon: MessageSquare, text: 'New comment on Midnight Blues', time: '1 day ago' },
            ].map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                  <div className="p-2 bg-purple-600/20 rounded-lg">
                    <Icon className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.text}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;