import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  icon = "Sparkles", 
  title = "Nothing here yet", 
  description = "Get started by creating your first item",
  actionText = "Get Started",
  onAction
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-6 shadow-lg"
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <ApperIcon name={icon} size={40} className="text-purple-500" />
      </motion.div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center font-outfit">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md leading-relaxed">
        {description}
      </p>
      
      {onAction && (
        <motion.button
          onClick={onAction}
          className="btn-primary inline-flex items-center space-x-2 px-8 py-4 text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Plus" size={20} />
          <span>{actionText}</span>
        </motion.button>
      )}
      
      <motion.div
        className="mt-8 opacity-30"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ApperIcon name="ArrowDown" size={24} className="text-purple-400" />
      </motion.div>
    </motion.div>
  );
};

export default Empty;