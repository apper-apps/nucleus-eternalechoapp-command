import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  variant = 'default',
  className = '',
  hover = true,
  ...props 
}) => {
  const variants = {
    default: 'avatar-card',
    memory: 'memory-card',
    glass: 'glass-morphism rounded-xl shadow-lg',
    gradient: 'bg-gradient-card rounded-xl shadow-lg border border-purple-100',
  };

  const hoverProps = hover ? {
    whileHover: { scale: 1.02, y: -2 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <motion.div
      className={`${variants[variant]} ${className}`}
      {...hoverProps}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;