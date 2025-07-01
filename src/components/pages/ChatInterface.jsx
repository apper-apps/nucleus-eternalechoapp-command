import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { avatarService } from '@/services/api/avatarService';
import { interactionService } from '@/services/api/interactionService';
import { memoryService } from '@/services/api/memoryService';

const ChatInterface = () => {
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatars, setAvatars] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const avatarsData = await avatarService.getAll();
      setAvatars(avatarsData);

      // If avatar ID was passed via navigation state, select it
      const avatarId = location.state?.avatarId;
      if (avatarId) {
        const avatar = avatarsData.find(a => a.Id === avatarId);
        if (avatar) {
          setSelectedAvatar(avatar);
          await loadChatHistory(avatar.Id);
        }
      } else if (avatarsData.length === 1) {
        // Auto-select if only one avatar
        setSelectedAvatar(avatarsData[0]);
        await loadChatHistory(avatarsData[0].Id);
      }

    } catch (err) {
      setError('Failed to load chat data. Please try again.');
      console.error('Chat loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadChatHistory = async (avatarId) => {
    try {
      const interactions = await interactionService.getAll();
      const avatarInteractions = interactions
        .filter(interaction => interaction.avatarId === avatarId)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      
      const chatMessages = avatarInteractions.flatMap(interaction => [
        {
          id: `${interaction.Id}-user`,
          text: interaction.message,
          sender: 'user',
          timestamp: interaction.timestamp
        },
        {
          id: `${interaction.Id}-avatar`,
          text: interaction.response,
          sender: 'avatar',
          timestamp: interaction.timestamp
        }
      ]);

      setMessages(chatMessages);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const generateAvatarResponse = async (message, avatar) => {
    // Simulate AI response generation based on avatar's memories
    try {
      const memories = await memoryService.getAll();
      const avatarMemories = memories.filter(m => m.avatarId === avatar.Id);
      
      // Simple response generation based on keywords
      const keywords = message.toLowerCase().split(' ');
      let response = "Thank you for talking with me. ";

      if (keywords.some(word => ['family', 'parents', 'children', 'kids'].includes(word))) {
        response += "Family has always been the most important thing to me. ";
      } else if (keywords.some(word => ['advice', 'wisdom', 'learn', 'lesson'].includes(word))) {
        response += "One of the most important lessons I've learned is to always be kind and patient. ";
      } else if (keywords.some(word => ['happy', 'happiness', 'joy', 'smile'].includes(word))) {
        response += "Happiness comes from the simple moments we share with loved ones. ";
      } else if (keywords.some(word => ['future', 'tomorrow', 'hope', 'dream'].includes(word))) {
        response += "I believe in staying hopeful and working towards a better future for everyone. ";
      } else {
        response += "I'm grateful we can have this conversation together. ";
      }

      if (avatarMemories.length > 0) {
        response += "This reminds me of something I shared in my memories...";
      }

      return response;
    } catch (err) {
      return "I'm here to listen and share what I can with you.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedAvatar) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Generate avatar response
      const avatarResponse = await generateAvatarResponse(messageToSend, selectedAvatar);
      
      // Simulate typing delay
      setTimeout(() => {
        const avatarMessage = {
          id: `avatar-${Date.now()}`,
          text: avatarResponse,
          sender: 'avatar',
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, avatarMessage]);
        setIsTyping(false);

        // Save interaction
        interactionService.create({
          avatarId: selectedAvatar.Id,
          userId: 'current-user', // In a real app, this would be the actual user ID
          message: messageToSend,
          response: avatarResponse,
          timestamp: new Date().toISOString()
        });
      }, 1500 + Math.random() * 1000); // Random delay 1.5-2.5 seconds

    } catch (err) {
      setIsTyping(false);
      toast.error('Failed to get response. Please try again.');
      console.error('Chat error:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAvatarSelect = async (avatar) => {
    setSelectedAvatar(avatar);
    await loadChatHistory(avatar.Id);
  };

  if (loading) return <Loading type="chat" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="flex h-full max-h-screen">
      {/* Avatar Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 font-outfit">
            Chat with Avatars
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Select an avatar to start chatting
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {avatars.length === 0 ? (
            <Empty
              icon="UserPlus"
              title="No Avatars Yet"
              description="Create your first avatar to start chatting"
              actionText="Create Avatar"
              onAction={() => window.location.href = '/create-avatar'}
            />
          ) : (
            avatars.map((avatar) => (
              <motion.div
                key={avatar.Id}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                  selectedAvatar?.Id === avatar.Id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                }`}
                onClick={() => handleAvatarSelect(avatar)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedAvatar?.Id === avatar.Id
                      ? 'bg-white/20'
                      : 'bg-gradient-to-br from-purple-100 to-pink-100'
                  }`}>
                    {avatar.photos && avatar.photos.length > 0 ? (
                      <img 
                        src={avatar.photos[0]} 
                        alt={avatar.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <ApperIcon 
                        name="User" 
                        size={24} 
                        className={selectedAvatar?.Id === avatar.Id ? 'text-white' : 'text-purple-500'} 
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {avatar.name}
                    </h3>
                    <p className={`text-sm truncate ${
                      selectedAvatar?.Id === avatar.Id ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {avatar.memoryCount || 0} memories
                    </p>
                  </div>
                  {selectedAvatar?.Id === avatar.Id && (
                    <ApperIcon name="MessageCircle" size={20} className="text-white" />
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedAvatar ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  {selectedAvatar.photos && selectedAvatar.photos.length > 0 ? (
                    <img 
                      src={selectedAvatar.photos[0]} 
                      alt={selectedAvatar.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <ApperIcon name="User" size={24} className="text-purple-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 font-outfit">
                    {selectedAvatar.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Digital Avatar • Always available
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <ApperIcon name="MessageCircle" size={32} className="text-purple-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 font-outfit">
                    Start a conversation
                  </h3>
                  <p className="text-gray-600">
                    Say hello to {selectedAvatar.name} and begin your chat
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'bg-white text-gray-800 shadow-md'
                        }`}>
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-2 ${
                            message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white text-gray-800 shadow-md px-4 py-3 rounded-lg">
                        <div className="flex space-x-2">
                          {[0, 1, 2].map((dot) => (
                            <motion.div
                              key={dot}
                              className="w-2 h-2 bg-purple-400 rounded-full"
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: dot * 0.2,
                              }}
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-2">
                            {selectedAvatar.name} is typing...
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-6 bg-white border-t border-gray-200">
              <div className="flex space-x-4">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${selectedAvatar.name}...`}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg resize-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                  rows={1}
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  icon="Send"
                  className="px-6"
                >
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <ApperIcon name="MessageCircle" size={40} className="text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 font-outfit">
                Select an Avatar
              </h3>
              <p className="text-gray-600">
                Choose an avatar from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;