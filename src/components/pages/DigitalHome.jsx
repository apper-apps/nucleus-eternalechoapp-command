import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import ProgressRing from '@/components/molecules/ProgressRing';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { avatarService } from '@/services/api/avatarService';
import { memoryService } from '@/services/api/memoryService';

const DigitalHome = () => {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);

  const rooms = [
    {
      id: 'living_room',
      name: 'Living Room',
      icon: 'Sofa',
      description: 'A cozy space for family gatherings',
      unlockRequirement: 5,
      color: 'from-purple-400 to-pink-400'
    },
    {
      id: 'study',
      name: 'Study',
      icon: 'BookOpen',
      description: 'Where wisdom and knowledge reside',
      unlockRequirement: 10,
      color: 'from-blue-400 to-purple-400'
    },
    {
      id: 'garden',
      name: 'Memory Garden',
      icon: 'Trees',
      description: 'Beautiful memories bloom here',
      unlockRequirement: 15,
      color: 'from-green-400 to-blue-400'
    },
    {
      id: 'gallery',
      name: 'Photo Gallery',
      icon: 'Image',
      description: 'Precious moments captured in time',
      unlockRequirement: 20,
      color: 'from-amber-400 to-orange-400'
    },
    {
      id: 'music_room',
      name: 'Music Room',
      icon: 'Music',
      description: 'Where melodies and memories harmonize',
      unlockRequirement: 25,
      color: 'from-pink-400 to-red-400'
    },
    {
      id: 'workshop',
      name: 'Workshop',
      icon: 'Wrench',
      description: 'Creative projects and life skills',
      unlockRequirement: 30,
      color: 'from-gray-400 to-gray-600'
    }
  ];

  const furniture = [
    {
      id: 'comfortable_chair',
      name: 'Comfortable Chair',
      description: 'Perfect for long conversations',
      cost: 3,
      room: 'living_room'
    },
    {
      id: 'bookshelf',
      name: 'Wisdom Bookshelf',
      description: 'Stores all your life lessons',
      cost: 5,
      room: 'study'
    },
    {
      id: 'rose_bush',
      name: 'Memory Rose Bush',
      description: 'Blooms with beautiful memories',
      cost: 4,
      room: 'garden'
    },
    {
      id: 'photo_frame',
      name: 'Golden Photo Frame',
      description: 'Displays your favorite moments',
      cost: 2,
      room: 'gallery'
    }
  ];

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [avatars, memories] = await Promise.all([
        avatarService.getAll(),
        memoryService.getAll()
      ]);

      const memoryCount = memories.length;
      const homeLevel = Math.floor(memoryCount / 5) + 1;
      const unlockedRooms = rooms.filter(room => memoryCount >= room.unlockRequirement);
      
      setHomeData({
        memoryCount,
        homeLevel,
        unlockedRooms,
        totalRooms: rooms.length,
        availableDecorations: furniture.filter(item => 
          unlockedRooms.some(room => room.id === item.room)
        )
      });

    } catch (err) {
      setError('Failed to load digital home. Please try again.');
      console.error('Home loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const handleRoomClick = (room) => {
    if (homeData.memoryCount >= room.unlockRequirement) {
      setSelectedRoom(room);
      toast.success(`Welcome to your ${room.name}!`);
    } else {
      toast.info(`Unlock ${room.name} by adding ${room.unlockRequirement - homeData.memoryCount} more memories!`);
    }
  };

  const handleDecorationPurchase = (decoration) => {
    toast.success(`${decoration.name} added to your ${decoration.room}!`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadHomeData} />;
  if (!homeData) return <Empty title="No home data available" />;

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
<h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 font-outfit">
          Your Legacy Home 🏠
        </h1>
        <p className="text-gray-600 text-lg">
          Watch your home fill with love as you share more of your heart and wisdom
        </p>
      </div>

      {/* Home Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <ApperIcon name="Home" size={24} className="text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1 font-outfit">
            Level {homeData.homeLevel}
          </div>
          <div className="text-gray-600 text-sm">Home Level</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <ApperIcon name="BookOpen" size={24} className="text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1 font-outfit">
            {homeData.memoryCount}
          </div>
          <div className="text-gray-600 text-sm">Memories Shared</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
            <ApperIcon name="DoorOpen" size={24} className="text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1 font-outfit">
            {homeData.unlockedRooms.length}
          </div>
          <div className="text-gray-600 text-sm">Rooms Unlocked</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
            <ApperIcon name="Sparkles" size={24} className="text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1 font-outfit">
            {Math.round((homeData.unlockedRooms.length / homeData.totalRooms) * 100)}%
          </div>
          <div className="text-gray-600 text-sm">Home Complete</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Home Layout */}
        <div className="lg:col-span-2">
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-outfit">
              Home Layout
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {rooms.map((room, index) => {
                const isUnlocked = homeData.memoryCount >= room.unlockRequirement;
                
                return (
                  <motion.div
                    key={room.id}
                    className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      isUnlocked
                        ? 'border-purple-200 bg-gradient-to-br ' + room.color + ' text-white shadow-lg hover:shadow-xl'
                        : 'border-gray-200 bg-gray-100 text-gray-400'
                    }`}
                    onClick={() => handleRoomClick(room)}
                    whileHover={isUnlocked ? { scale: 1.05, y: -2 } : {}}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {!isUnlocked && (
                      <div className="absolute top-2 right-2">
                        <ApperIcon name="Lock" size={16} className="text-gray-400" />
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${
                        isUnlocked ? 'bg-white/20' : 'bg-gray-200'
                      }`}>
                        <ApperIcon 
                          name={room.icon} 
                          size={24} 
                          className={isUnlocked ? 'text-white' : 'text-gray-400'} 
                        />
                      </div>
                      
                      <h3 className="font-semibold mb-2 text-sm">
                        {room.name}
                      </h3>
                      
                      {!isUnlocked && (
                        <p className="text-xs text-gray-500">
                          {room.unlockRequirement - homeData.memoryCount} more memories
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>

          {/* Room Details */}
          {selectedRoom && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedRoom.color} flex items-center justify-center`}>
                    <ApperIcon name={selectedRoom.icon} size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 font-outfit">
                      {selectedRoom.name}
                    </h3>
                    <p className="text-gray-600">
                      {selectedRoom.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Available Decorations:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {furniture
                      .filter(item => item.room === selectedRoom.id)
                      .map((decoration) => (
                        <div key={decoration.id} className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-gray-800 mb-2">
                            {decoration.name}
                          </h5>
                          <p className="text-sm text-gray-600 mb-3">
                            {decoration.description}
                          </p>
                          <Button
                            size="sm"
                            onClick={() => handleDecorationPurchase(decoration)}
                            icon="Plus"
                          >
                            Add ({decoration.cost} memories)
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Progress & Actions */}
        <div className="space-y-6">
          {/* Overall Progress */}
          <Card className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-outfit">
              Home Progress
            </h3>
            <ProgressRing 
              progress={(homeData.unlockedRooms.length / homeData.totalRooms) * 100}
              size={120}
              color="purple"
            />
            <p className="text-sm text-gray-600 mt-4">
              {homeData.totalRooms - homeData.unlockedRooms.length} rooms to unlock
            </p>
          </Card>

          {/* Next Unlock */}
          {homeData.unlockedRooms.length < homeData.totalRooms && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 font-outfit">
                Next Unlock
              </h3>
              {(() => {
                const nextRoom = rooms.find(room => 
                  homeData.memoryCount < room.unlockRequirement
                );
                const memoriesNeeded = nextRoom.unlockRequirement - homeData.memoryCount;
                
                return (
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${nextRoom.color} flex items-center justify-center`}>
                      <ApperIcon name={nextRoom.icon} size={32} className="text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {nextRoom.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      {memoriesNeeded} more memories needed
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{
                          width: `${(homeData.memoryCount / nextRoom.unlockRequirement) * 100}%`
                        }}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      icon="Plus"
                      onClick={() => window.location.href = '/memories'}
                    >
                      Add Memories
                    </Button>
                  </div>
                );
              })()}
            </Card>
          )}

          {/* Achievement Badges */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-outfit">
              Achievements
            </h3>
            <div className="space-y-3">
              {[
                { name: 'First Memory', earned: homeData.memoryCount >= 1, icon: 'Award' },
                { name: 'Storyteller', earned: homeData.memoryCount >= 5, icon: 'BookOpen' },
                { name: 'Wisdom Keeper', earned: homeData.memoryCount >= 10, icon: 'Crown' },
                { name: 'Legacy Builder', earned: homeData.memoryCount >= 20, icon: 'Star' },
              ].map((achievement) => (
                <div key={achievement.name} className={`flex items-center space-x-3 p-3 rounded-lg ${
                  achievement.earned ? 'bg-gradient-to-r from-purple-100 to-pink-100' : 'bg-gray-100'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    achievement.earned ? 'bg-purple-500' : 'bg-gray-400'
                  }`}>
                    <ApperIcon name={achievement.icon} size={16} className="text-white" />
                  </div>
                  <span className={`font-medium ${
                    achievement.earned ? 'text-purple-800' : 'text-gray-500'
                  }`}>
                    {achievement.name}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DigitalHome;