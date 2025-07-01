import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import MemoryCard from '@/components/molecules/MemoryCard';
import RecordingInterface from '@/components/molecules/RecordingInterface';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { memoryService } from '@/services/api/memoryService';

const MemoryCollection = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRecording, setShowRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

const memoryQuestions = [
    {
      category: 'life',
      question: "What's the most important thing you want your loved ones to know about living a meaningful life?",
    },
    {
      category: 'family',
      question: "Share a moment when you felt the deepest love for your family. What made that moment so special?",
    },
    {
      category: 'wisdom',
      question: "If you could sit down with each person you love and share one piece of wisdom from your heart, what would it be?",
    },
    {
      category: 'values',
      question: "What values have guided your heart throughout your life, and how do you hope they'll live on in others?",
    },
    {
      category: 'experiences',
      question: "Tell me about a time when you felt truly proud of who you are. What made that moment so meaningful?",
    },
    {
      category: 'advice',
      question: "What do you want your children and grandchildren to remember about finding joy and hope, even in difficult times?",
    },
    {
      category: 'love',
      question: "How do you want to be remembered? What feeling do you hope lives on in the hearts of those you love?",
    },
    {
      category: 'legacy',
      question: "What story from your life do you most want to pass down through generations?",
    },
  ];

const categories = [
    { id: 'all', label: 'All Memories', icon: 'BookOpen' },
    { id: 'life', label: 'Life Lessons', icon: 'Heart' },
    { id: 'family', label: 'Family Love', icon: 'Users' },
    { id: 'wisdom', label: 'Wisdom', icon: 'Lightbulb' },
    { id: 'values', label: 'Values', icon: 'Star' },
    { id: 'experiences', label: 'Special Moments', icon: 'Camera' },
    { id: 'advice', label: 'Guidance', icon: 'MessageSquare' },
    { id: 'love', label: 'Love Letters', icon: 'Heart' },
    { id: 'legacy', label: 'Legacy Stories', icon: 'Crown' },
  ];

  const loadMemories = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await memoryService.getAll();
      setMemories(data);
    } catch (err) {
      setError('Failed to load memories. Please try again.');
      console.error('Memory loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemories();
  }, []);

  const handleAddMemory = () => {
    const unansweredQuestions = memoryQuestions.filter(q => 
      !memories.some(m => m.question === q.question)
    );
    
    if (unansweredQuestions.length === 0) {
      toast.info('You\'ve answered all available questions! More coming soon.');
      return;
    }

    const randomQuestion = unansweredQuestions[Math.floor(Math.random() * unansweredQuestions.length)];
    setCurrentQuestion(randomQuestion);
    setShowRecording(true);
  };

  const handleRecordingComplete = async (audioBlob, duration) => {
    try {
      const newMemory = {
        question: currentQuestion.question,
        answer: `Audio recording (${duration} seconds)`,
        mediaUrl: URL.createObjectURL(audioBlob),
        category: currentQuestion.category,
        createdAt: new Date().toISOString()
      };

      const savedMemory = await memoryService.create(newMemory);
      setMemories(prev => [savedMemory, ...prev]);
      setShowRecording(false);
      setCurrentQuestion(null);
      toast.success('Memory recorded successfully!');
    } catch (error) {
      toast.error('Failed to save memory. Please try again.');
      console.error('Memory save error:', error);
    }
  };

  const handleTextSubmit = async (textAnswer) => {
    try {
      const newMemory = {
        question: currentQuestion.question,
        answer: textAnswer,
        category: currentQuestion.category,
        createdAt: new Date().toISOString()
      };

      const savedMemory = await memoryService.create(newMemory);
      setMemories(prev => [savedMemory, ...prev]);
      setShowRecording(false);
      setCurrentQuestion(null);
      toast.success('Memory saved successfully!');
    } catch (error) {
      toast.error('Failed to save memory. Please try again.');
      console.error('Memory save error:', error);
    }
  };

  const handleMemoryClick = (memory) => {
    // Could navigate to detailed memory view
    console.log('Memory clicked:', memory);
  };

  const filteredMemories = selectedCategory === 'all' 
    ? memories 
    : memories.filter(memory => memory.category === selectedCategory);

  if (loading) return <Loading type="memory-list" />;
  if (error) return <Error message={error} onRetry={loadMemories} />;

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
<h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 font-outfit">
              My Heart & Wisdom 💕
            </h1>
            <p className="text-gray-600 text-lg">
              Share your love, your stories, and the wisdom that lives in your heart
            </p>
          </div>
          <Button
            onClick={handleAddMemory}
            icon="Plus"
            size="lg"
            className="mt-4 sm:mt-0"
          >
            Add Memory
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2 font-outfit">
            {memories.length}
          </div>
          <div className="text-gray-600">Total Memories</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-pink-600 mb-2 font-outfit">
            {memories.filter(m => m.mediaUrl).length}
          </div>
          <div className="text-gray-600">Audio Recordings</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-amber-600 mb-2 font-outfit">
            {Math.round((memories.length / memoryQuestions.length) * 100)}%
          </div>
          <div className="text-gray-600">Questions Answered</div>
        </Card>
      </div>

      {/* Recording Interface Modal */}
      <AnimatePresence>
        {showRecording && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRecording(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <RecordingInterface
                question={currentQuestion?.question}
                onRecordingComplete={handleRecordingComplete}
                onTextSubmit={handleTextSubmit}
              />
              <div className="text-center mt-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowRecording(false)}
                  className="text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'primary' : 'ghost'}
              size="sm"
              icon={category.icon}
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Memories List */}
      {filteredMemories.length === 0 ? (
        <Empty
          icon="BookOpen"
          title={selectedCategory === 'all' ? "No memories yet" : `No ${categories.find(c => c.id === selectedCategory)?.label.toLowerCase()} memories`}
          description="Start preserving your wisdom and experiences by adding your first memory."
          actionText="Add First Memory"
          onAction={handleAddMemory}
        />
      ) : (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredMemories.map((memory, index) => (
            <motion.div
              key={memory.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MemoryCard
                memory={memory}
                onClick={() => handleMemoryClick(memory)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Suggested Questions */}
      {memories.length > 0 && (
        <Card className="p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 font-outfit">
            Suggested Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memoryQuestions
              .filter(q => !memories.some(m => m.question === q.question))
              .slice(0, 4)
              .map((question, index) => (
                <motion.div
                  key={index}
                  className="p-4 bg-gradient-card rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setCurrentQuestion(question);
                    setShowRecording(true);
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <ApperIcon name="MessageCircle" size={16} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium text-sm">
                        {question.question}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 capitalize">
                        {question.category}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MemoryCollection;