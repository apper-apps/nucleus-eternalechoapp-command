import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Navigation = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: 'LayoutDashboard', label: 'Dashboard' },
{ path: '/create-avatar', icon: 'UserPlus', label: 'Create Legacy Avatar' },
    { path: '/memories', icon: 'BookOpen', label: 'My Memories' },
    { path: '/digital-home', icon: 'Home', label: 'Digital Home' },
    { path: '/chat', icon: 'MessageCircle', label: 'Chat' },
    { path: '/family', icon: 'Users', label: 'Family Access' },
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
          isActive
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
            : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <ApperIcon 
            name={item.icon} 
            size={20} 
            className={`transition-transform duration-300 ${
              isActive ? 'scale-110' : 'group-hover:scale-110'
            }`}
          />
          <span className="font-medium">{item.label}</span>
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="ml-auto w-2 h-2 bg-white rounded-full"
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full w-72 bg-white shadow-xl z-50 lg:relative lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <ApperIcon name="Sparkles" size={24} className="text-white" />
              </div>
              <div>
<h1 className="text-xl font-bold text-gray-800 font-outfit">
                  EternalEcho
                </h1>
                <p className="text-sm text-gray-500">Personal Legacy</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gradient-card">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <ApperIcon name="Heart" size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
<p className="text-sm font-medium text-gray-800 truncate">
                  Love lives forever
                </p>
                <p className="text-xs text-gray-500">
                  In every heart you touch
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Navigation;