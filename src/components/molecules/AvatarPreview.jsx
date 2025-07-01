import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const AvatarPreview = ({ avatar, onClick, showProgress = true }) => {
  const completionPercentage = avatar?.completionPercentage || 0;
  
  return (
    <Card 
      className="p-6 cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
    >
      <div className="text-center">
        {/* Avatar Image/Icon */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center shadow-lg">
          {avatar?.photos && avatar.photos.length > 0 ? (
            <img 
              src={avatar.photos[0]} 
              alt={avatar.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <ApperIcon name="User" size={32} className="text-purple-500" />
          )}
        </div>
        
        {/* Avatar Name */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 font-outfit">
          {avatar?.name || 'New Avatar'}
        </h3>
        
        {/* Progress or Status */}
        {showProgress && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {completionPercentage}% Complete
            </p>
          </div>
        )}
        
        {/* Stats */}
        <div className="flex justify-between text-sm text-gray-500">
          <span className="flex items-center">
            <ApperIcon name="MessageCircle" size={14} className="mr-1" />
            {avatar?.memoryCount || 0}
          </span>
          <span className="flex items-center">
            <ApperIcon name="Home" size={14} className="mr-1" />
            Level {avatar?.homeLevel || 1}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default AvatarPreview;