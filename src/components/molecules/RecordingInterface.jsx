import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const RecordingInterface = ({ onRecordingComplete, onTextSubmit, question }) => {
  const [mode, setMode] = useState('text'); // 'text' or 'audio'
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [textAnswer, setTextAnswer] = useState('');
  const intervalRef = useRef();

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    intervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(intervalRef.current);
    // Simulate recording data
    const mockAudioBlob = new Blob(['mock audio data'], { type: 'audio/wav' });
    onRecordingComplete?.(mockAudioBlob, recordingTime);
  };

  const handleTextSubmit = () => {
    if (textAnswer.trim()) {
      onTextSubmit?.(textAnswer);
      setTextAnswer('');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 font-outfit">
          {question}
        </h3>
        <p className="text-gray-600 text-sm">
          Share your thoughts through text or voice recording
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex space-x-2 mb-6">
        <Button
          variant={mode === 'text' ? 'primary' : 'ghost'}
          size="sm"
          icon="Type"
          onClick={() => setMode('text')}
        >
          Text
        </Button>
        <Button
          variant={mode === 'audio' ? 'primary' : 'ghost'}
          size="sm"
          icon="Mic"
          onClick={() => setMode('audio')}
        >
          Audio
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'text' && (
          <motion.div
            key="text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Share your thoughts, memories, or wisdom..."
              className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 resize-none"
            />
            <Button
              onClick={handleTextSubmit}
              disabled={!textAnswer.trim()}
              icon="Send"
            >
              Save Response
            </Button>
          </motion.div>
        )}

        {mode === 'audio' && (
          <motion.div
            key="audio"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-6"
          >
            <div className="relative">
              <motion.div
                className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                  isRecording 
                    ? 'bg-gradient-to-br from-red-500 to-pink-500' 
                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}
                animate={isRecording ? {
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(239, 68, 68, 0.7)',
                    '0 0 0 20px rgba(239, 68, 68, 0)',
                    '0 0 0 0 rgba(239, 68, 68, 0.7)',
                  ]
                } : {}}
                transition={{ duration: 1.5, repeat: isRecording ? Infinity : 0 }}
              >
                <ApperIcon 
                  name={isRecording ? "Square" : "Mic"} 
                  size={32} 
                  className="text-white" 
                />
              </motion.div>
            </div>

            {isRecording && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <div className="text-2xl font-bold text-red-500 font-mono">
                  {formatTime(recordingTime)}
                </div>
                <div className="text-sm text-gray-600">Recording...</div>
              </motion.div>
            )}

            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? 'danger' : 'primary'}
              size="lg"
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecordingInterface;