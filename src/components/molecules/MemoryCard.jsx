import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const MemoryCard = ({ memory, onClick }) => {
  const categoryIcons = {
    life: 'Heart',
    family: 'Users',
    wisdom: 'Lightbulb',
    values: 'Star',
    experiences: 'Camera',
    advice: 'MessageSquare',
  };

  const categoryColors = {
    life: 'text-red-500 bg-red-100',
    family: 'text-blue-500 bg-blue-100',
    wisdom: 'text-yellow-500 bg-yellow-100',
    values: 'text-purple-500 bg-purple-100',
    experiences: 'text-green-500 bg-green-100',
    advice: 'text-pink-500 bg-pink-100',
  };

  return (
    <Card 
      variant="memory"
      className="p-6 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        {/* Category Icon */}
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${categoryColors[memory.category] || 'text-gray-500 bg-gray-100'}`}>
          <ApperIcon 
            name={categoryIcons[memory.category] || 'MessageCircle'} 
            size={24} 
          />
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Question */}
          <h4 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 font-outfit">
            {memory.question}
          </h4>
          
          {/* Answer Preview */}
          <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
            {memory.answer?.substring(0, 120)}...
          </p>
          
          {/* Media Indicator */}
          {memory.mediaUrl && (
            <div className="flex items-center space-x-2 mb-3">
              <ApperIcon name="Play" size={16} className="text-purple-500" />
              <span className="text-sm text-purple-600 font-medium">
                Audio Recording
              </span>
            </div>
          )}
          
          {/* Timestamp */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 flex items-center">
              <ApperIcon name="Clock" size={12} className="mr-1" />
              {format(new Date(memory.createdAt), 'MMM d, yyyy')}
            </span>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="text-purple-500"
            >
              <ApperIcon name="ChevronRight" size={16} />
            </motion.div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MemoryCard;