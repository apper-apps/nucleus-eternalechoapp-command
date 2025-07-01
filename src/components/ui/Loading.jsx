import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ type = 'default' }) => {
  if (type === 'avatar-grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index} className="avatar-card p-6">
            <div className="animate-pulse">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded mb-2"></div>
              <div className="h-3 bg-gradient-to-r from-pink-200 to-amber-200 rounded w-2/3 mx-auto mb-4"></div>
              <div className="h-2 bg-gray-200 rounded mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'memory-list') {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="memory-card p-6">
            <div className="animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-amber-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chat') {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((index) => (
          <div key={index} className="animate-pulse">
            <div className={`flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`max-w-xs px-4 py-2 rounded-lg ${
                index % 2 === 0 
                  ? 'bg-gradient-to-r from-purple-200 to-pink-200' 
                  : 'bg-gray-200'
              }`}>
                <div className="h-3 bg-white/50 rounded mb-1"></div>
                <div className="h-3 bg-white/50 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Loading;