import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import ProgressRing from '@/components/molecules/ProgressRing';
import AvatarPreview from '@/components/molecules/AvatarPreview';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { avatarService } from '@/services/api/avatarService';
import { memoryService } from '@/services/api/memoryService';
import { interactionService } from '@/services/api/interactionService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [recentMemories, setRecentMemories] = useState([]);
  const [recentInteractions, setRecentInteractions] = useState([]);
  const [stats, setStats] = useState({
    totalMemories: 0,
    averageCompletion: 0,
    familyMembers: 0,
    interactionsToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [avatarsData, memoriesData, interactionsData] = await Promise.all([
        avatarService.getAll(),
        memoryService.getAll(),
        interactionService.getAll()
      ]);

      setAvatars(avatarsData);
      setRecentMemories(memoriesData.slice(0, 3));
      setRecentInteractions(interactionsData.slice(0, 5));

      // Calculate stats
      const totalMemories = memoriesData.length;
      const averageCompletion = avatarsData.length > 0 
        ? avatarsData.reduce((sum, avatar) => sum + (avatar.completionPercentage || 0), 0) / avatarsData.length 
        : 0;
      const familyMembers = 12; // Mock family member count
      const interactionsToday = interactionsData.filter(interaction => 
        new Date(interaction.timestamp).toDateString() === new Date().toDateString()
      ).length;

      setStats({
        totalMemories,
        averageCompletion,
        familyMembers,
        interactionsToday
      });

    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Dashboard loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCreateAvatar = () => {
    navigate('/create-avatar');
  };

  const handleAvatarClick = (avatar) => {
    navigate('/chat', { state: { avatarId: avatar.Id } });
  };

  const handleAddMemory = () => {
    navigate('/memories');
  };

  if (loading) return <Loading type="avatar-grid" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 font-outfit">
              Welcome back! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Continue building your digital legacy
            </p>
          </div>
          <Button
            onClick={handleCreateAvatar}
            icon="Plus"
            size="lg"
            className="mt-4 sm:mt-0"
          >
            Create New Avatar
          </Button>
        </motion.div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { 
            label: 'Total Memories', 
            value: stats.totalMemories, 
            icon: 'BookOpen', 
            color: 'purple',
            change: '+12% this month'
          },
          { 
            label: 'Avg Completion', 
            value: `${Math.round(stats.averageCompletion)}%`, 
            icon: 'Target', 
            color: 'pink',
            change: '+8% this week'
          },
          { 
            label: 'Family Members', 
            value: stats.familyMembers, 
            icon: 'Users', 
            color: 'amber',
            change: '3 new invites'
          },
          { 
            label: 'Today\'s Chats', 
            value: stats.interactionsToday, 
            icon: 'MessageCircle', 
            color: 'green',
            change: 'Very active!'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 text-center">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 flex items-center justify-center`}>
                <ApperIcon name={stat.icon} size={24} className={`text-${stat.color}-600`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1 font-outfit">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {stat.label}
              </div>
              <div className="text-xs text-green-600 font-medium">
                {stat.change}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Avatars */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 font-outfit">
              My Avatars
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/create-avatar')}
            >
              View All
            </Button>
          </div>

          {avatars.length === 0 ? (
            <Empty
              icon="UserPlus"
              title="Create Your First Avatar"
              description="Start preserving your digital legacy by creating your first AI avatar. Upload photos, record your voice, and share your memories."
              actionText="Create Avatar"
              onAction={handleCreateAvatar}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {avatars.slice(0, 4).map((avatar) => (
                <AvatarPreview
                  key={avatar.Id}
                  avatar={avatar}
                  onClick={() => handleAvatarClick(avatar)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions & Progress */}
        <div className="space-y-6">
          {/* Overall Progress */}
          <Card className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-outfit">
              Overall Progress
            </h3>
            <ProgressRing 
              progress={stats.averageCompletion} 
              size={120}
              color="purple"
            />
            <p className="text-sm text-gray-600 mt-4">
              Keep going! Your digital legacy is taking shape.
            </p>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-outfit">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="Plus"
                onClick={handleAddMemory}
              >
                Add New Memory
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="Home"
                onClick={() => navigate('/digital-home')}
              >
                Visit Digital Home
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="UserPlus"
                onClick={() => navigate('/family')}
              >
                Invite Family
              </Button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-outfit">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentInteractions.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent activity
                </p>
              ) : (
                recentInteractions.map((interaction) => (
                  <div key={interaction.Id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <ApperIcon name="MessageCircle" size={16} className="text-purple-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 truncate">
                        Chat with avatar
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(interaction.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;