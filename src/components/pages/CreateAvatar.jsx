import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import { avatarService } from '@/services/api/avatarService';

const CreateAvatar = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    photos: [],
    voiceSamples: [],
    personality: {
      hobbies: '',
      values: '',
      lifeHighlights: '',
      familyInfo: ''
    }
  });

  const totalSteps = 4;

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    const photoUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...photoUrls]
    }));
  };

  const handleVoiceUpload = (event) => {
    const files = Array.from(event.target.files);
    const voiceUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      voiceSamples: [...prev.voiceSamples, ...voiceUrls]
    }));
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const removeVoiceSample = (index) => {
    setFormData(prev => ({
      ...prev,
      voiceSamples: prev.voiceSamples.filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const newAvatar = {
        ...formData,
        completionPercentage: 25, // Initial completion
        homeLevel: 1,
        memoryCount: 0,
        createdAt: new Date().toISOString()
      };

      await avatarService.create(newAvatar);
      toast.success('Avatar created successfully! Start adding memories to bring it to life.');
      navigate('/memories');
    } catch (error) {
      toast.error('Failed to create avatar. Please try again.');
      console.error('Avatar creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== '';
      case 2:
        return formData.photos.length > 0;
      case 3:
        return formData.voiceSamples.length > 0;
      case 4:
        return formData.personality.hobbies.trim() !== '' && 
               formData.personality.values.trim() !== '';
      default:
        return false;
    }
  };

  const stepVariants = {
    enter: { x: 300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 }
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
<h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 font-outfit">
          Create Your Personal Legacy Avatar
        </h1>
        <p className="text-gray-600 text-lg">
          Preserve your voice, wisdom, and love for the people who matter most
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-purple-600">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-8 mb-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <ApperIcon name="User" size={32} className="text-purple-500" />
                </div>
<h2 className="text-2xl font-bold text-gray-800 mb-2 font-outfit">
                  What should your loved ones call you?
                </h2>
                <p className="text-gray-600">
                  How do you want to be remembered? This is how your avatar will introduce itself to family and friends
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <Input
                  label="Avatar Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your name"
                  icon="User"
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Photos */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <ApperIcon name="Camera" size={32} className="text-purple-500" />
                </div>
<h2 className="text-2xl font-bold text-gray-800 mb-2 font-outfit">
                  Share Your Beautiful Face
                </h2>
                <p className="text-gray-600">
                  Upload photos that capture your warmth, your smile, and the love in your eyes - the way you want to be remembered
                </p>
              </div>

              <div className="space-y-6">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <ApperIcon name="Upload" size={48} className="text-purple-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Click to upload photos
                    </p>
                    <p className="text-gray-500">
                      PNG, JPG up to 10MB each
                    </p>
                  </label>
                </div>

                {/* Uploaded Photos */}
                {formData.photos.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4">
                      Uploaded Photos ({formData.photos.length})
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ApperIcon name="X" size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Voice Samples */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <ApperIcon name="Mic" size={32} className="text-purple-500" />
                </div>
<h2 className="text-2xl font-bold text-gray-800 mb-2 font-outfit">
                  Preserve Your Voice Forever
                </h2>
                <p className="text-gray-600">
                  Record yourself speaking so your loved ones can always hear your voice - your comfort, your guidance, your love
                </p>
              </div>

              <div className="space-y-6">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="audio/*"
                    onChange={handleVoiceUpload}
                    className="hidden"
                    id="voice-upload"
                  />
                  <label htmlFor="voice-upload" className="cursor-pointer">
                    <ApperIcon name="Mic" size={48} className="text-purple-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Upload voice recordings
                    </p>
                    <p className="text-gray-500">
                      MP3, WAV, M4A up to 25MB each
                    </p>
                  </label>
                </div>

                {/* Voice Sample Suggestions */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <ApperIcon name="Lightbulb" size={20} className="mr-2" />
                    Recording Tips
                  </h3>
                  <ul className="space-y-2 text-blue-700 text-sm">
                    <li>• Record in a quiet environment</li>
                    <li>• Speak naturally and clearly</li>
                    <li>• Include various emotions and tones</li>
                    <li>• Minimum 30 seconds per recording</li>
                  </ul>
                </div>

                {/* Uploaded Voice Samples */}
                {formData.voiceSamples.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4">
                      Voice Samples ({formData.voiceSamples.length})
                    </h3>
                    <div className="space-y-3">
                      {formData.voiceSamples.map((sample, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <ApperIcon name="Music" size={20} className="text-purple-500" />
                            <span className="text-gray-700">
                              Voice Sample {index + 1}
                            </span>
                          </div>
                          <button
                            onClick={() => removeVoiceSample(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 4: Personality */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <ApperIcon name="Heart" size={32} className="text-purple-500" />
                </div>
<h2 className="text-2xl font-bold text-gray-800 mb-2 font-outfit">
                  Share Your Heart and Soul
                </h2>
                <p className="text-gray-600">
                  Tell us about what makes you who you are - your passions, your wisdom, the love you want to leave behind
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
<label className="block text-sm font-semibold text-gray-700 mb-2">
                    What brings you joy in life?
                  </label>
                  <textarea
                    value={formData.personality.hobbies}
                    onChange={(e) => handleInputChange('personality.hobbies', e.target.value)}
                    placeholder="The activities that light up your soul - gardening, reading stories to grandchildren, cooking family recipes..."
                    className="w-full h-24 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 resize-none"
                  />
                </div>

                <div>
<label className="block text-sm font-semibold text-gray-700 mb-2">
                    What matters most to you?
                  </label>
                  <textarea
                    value={formData.personality.values}
                    onChange={(e) => handleInputChange('personality.values', e.target.value)}
                    placeholder="The principles that guide your heart - love for family, treating everyone with kindness, never giving up hope..."
                    className="w-full h-24 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 resize-none"
                  />
                </div>

                <div>
<label className="block text-sm font-semibold text-gray-700 mb-2">
                    What are you most proud of?
                  </label>
                  <textarea
                    value={formData.personality.lifeHighlights}
                    onChange={(e) => handleInputChange('personality.lifeHighlights', e.target.value)}
                    placeholder="The moments that shaped you, the love you've given, the difference you've made in others' lives..."
                    className="w-full h-24 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 resize-none"
                  />
                </div>

                <div>
<label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tell us about the people you love
                  </label>
                  <textarea
                    value={formData.personality.familyInfo}
                    onChange={(e) => handleInputChange('personality.familyInfo', e.target.value)}
                    placeholder="Share about your family, friends, and loved ones - how they make you smile, what you want them to know about your love for them..."
                    className="w-full h-24 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 resize-none"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          icon="ChevronLeft"
        >
          Previous
        </Button>

        <div className="flex items-center space-x-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i + 1 === currentStep
                  ? 'bg-purple-500'
                  : i + 1 < currentStep
                  ? 'bg-purple-300'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {currentStep === totalSteps ? (
          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={!canProceed()}
            icon="Check"
            size="lg"
          >
            Create Avatar
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            icon="ChevronRight"
            iconPosition="right"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateAvatar;