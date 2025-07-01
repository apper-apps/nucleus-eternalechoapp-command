import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { familyMemberService } from '@/services/api/familyMemberService';
import { avatarService } from '@/services/api/avatarService';

const FamilyPortal = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'viewer',
    avatarId: '',
    permissions: ['view_memories', 'chat_with_avatar']
  });

  const roles = [
    { id: 'viewer', name: 'Viewer', description: 'Can view memories and chat with avatars' },
    { id: 'contributor', name: 'Contributor', description: 'Can add memories and chat' },
    { id: 'admin', name: 'Admin', description: 'Full access including member management' }
  ];

  const permissions = [
    { id: 'view_memories', name: 'View Memories', description: 'Access to stored memories' },
    { id: 'chat_with_avatar', name: 'Chat with Avatar', description: 'Interact with AI avatar' },
    { id: 'add_memories', name: 'Add Memories', description: 'Contribute new memories' },
    { id: 'manage_members', name: 'Manage Members', description: 'Invite/remove family members' }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [membersData, avatarsData] = await Promise.all([
        familyMemberService.getAll(),
        avatarService.getAll()
      ]);

      setFamilyMembers(membersData);
      setAvatars(avatarsData);

      if (avatarsData.length > 0 && !inviteForm.avatarId) {
        setInviteForm(prev => ({ ...prev, avatarId: avatarsData[0].Id }));
      }

    } catch (err) {
      setError('Failed to load family data. Please try again.');
      console.error('Family loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInviteMember = async () => {
    try {
      if (!inviteForm.email || !inviteForm.avatarId) {
        toast.error('Please fill in all required fields.');
        return;
      }

      const newMember = {
        ...inviteForm,
        invitedAt: new Date().toISOString(),
        status: 'pending'
      };

      const savedMember = await familyMemberService.create(newMember);
      setFamilyMembers(prev => [savedMember, ...prev]);
      setShowInviteModal(false);
      setInviteForm({
        email: '',
        role: 'viewer',
        avatarId: avatars.length > 0 ? avatars[0].Id : '',
        permissions: ['view_memories', 'chat_with_avatar']
      });
      
      toast.success(`Invitation sent to ${inviteForm.email}!`);
    } catch (error) {
      toast.error('Failed to send invitation. Please try again.');
      console.error('Invite error:', error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await familyMemberService.delete(memberId);
      setFamilyMembers(prev => prev.filter(member => member.Id !== memberId));
      toast.success('Family member removed successfully.');
    } catch (error) {
      toast.error('Failed to remove member. Please try again.');
      console.error('Remove error:', error);
    }
  };

  const handleUpdatePermissions = async (memberId, newPermissions) => {
    try {
      const updatedMember = await familyMemberService.update(memberId, { permissions: newPermissions });
      setFamilyMembers(prev => prev.map(member => 
        member.Id === memberId ? updatedMember : member
      ));
      toast.success('Permissions updated successfully.');
    } catch (error) {
      toast.error('Failed to update permissions. Please try again.');
      console.error('Update permissions error:', error);
    }
  };

  const getRolePermissions = (role) => {
    switch (role) {
      case 'admin':
        return ['view_memories', 'chat_with_avatar', 'add_memories', 'manage_members'];
      case 'contributor':
        return ['view_memories', 'chat_with_avatar', 'add_memories'];
      case 'viewer':
      default:
        return ['view_memories', 'chat_with_avatar'];
    }
  };

  const handleRoleChange = (role) => {
    setInviteForm(prev => ({
      ...prev,
      role,
      permissions: getRolePermissions(role)
    }));
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 font-outfit">
              Family Access 👨‍👩‍👧‍👦
            </h1>
            <p className="text-gray-600 text-lg">
              Share your digital legacy with loved ones
            </p>
          </div>
          <Button
            onClick={() => setShowInviteModal(true)}
            icon="UserPlus"
            size="lg"
            className="mt-4 sm:mt-0"
            disabled={avatars.length === 0}
          >
            Invite Family Member
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <ApperIcon name="Users" size={24} className="text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1 font-outfit">
            {familyMembers.length}
          </div>
          <div className="text-gray-600 text-sm">Family Members</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
            <ApperIcon name="CheckCircle" size={24} className="text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1 font-outfit">
            {familyMembers.filter(m => m.status === 'active').length}
          </div>
          <div className="text-gray-600 text-sm">Active Members</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
            <ApperIcon name="Clock" size={24} className="text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1 font-outfit">
            {familyMembers.filter(m => m.status === 'pending').length}
          </div>
          <div className="text-gray-600 text-sm">Pending Invites</div>
        </Card>
      </div>

      {/* Family Members List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 font-outfit">
            Family Members
          </h2>
          {avatars.length === 0 && (
            <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              Create an avatar first to invite family members
            </div>
          )}
        </div>

        {familyMembers.length === 0 ? (
          <Empty
            icon="Users"
            title="No Family Members Yet"
            description="Invite your loved ones to experience your digital legacy. They can chat with your avatar and view your memories."
            actionText="Invite First Member"
            onAction={() => setShowInviteModal(true)}
          />
        ) : (
          <div className="space-y-4">
            {familyMembers.map((member, index) => (
              <motion.div
                key={member.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      member.status === 'active' 
                        ? 'bg-gradient-to-br from-green-100 to-blue-100' 
                        : 'bg-gradient-to-br from-amber-100 to-orange-100'
                    }`}>
                      <ApperIcon 
                        name={member.status === 'active' ? 'User' : 'Clock'} 
                        size={24} 
                        className={member.status === 'active' ? 'text-green-600' : 'text-amber-600'} 
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {member.email}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="capitalize">{member.role}</span>
                        <span>•</span>
                        <span className={`capitalize ${
                          member.status === 'active' ? 'text-green-600' : 'text-amber-600'
                        }`}>
                          {member.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Settings"
                      onClick={() => {/* Handle edit permissions */}}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={() => handleRemoveMember(member.Id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                </div>

                {/* Permissions */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions:</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.permissions?.map((permission) => {
                      const permissionData = permissions.find(p => p.id === permission);
                      return (
                        <span
                          key={permission}
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                        >
                          {permissionData?.name || permission}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 font-outfit">
                  Invite Family Member
                </h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Email */}
                <Input
                  label="Email Address"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="family@example.com"
                  icon="Mail"
                />

                {/* Avatar Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Avatar Access
                  </label>
                  <select
                    value={inviteForm.avatarId}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, avatarId: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                  >
                    {avatars.map((avatar) => (
                      <option key={avatar.Id} value={avatar.Id}>
                        {avatar.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Role
                  </label>
                  <div className="space-y-2">
                    {roles.map((role) => (
                      <label key={role.id} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          value={role.id}
                          checked={inviteForm.role === role.id}
                          onChange={(e) => handleRoleChange(e.target.value)}
                          className="mt-1 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{role.name}</div>
                          <div className="text-sm text-gray-600">{role.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Permissions Preview */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Permissions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {inviteForm.permissions.map((permission) => {
                      const permissionData = permissions.find(p => p.id === permission);
                      return (
                        <span
                          key={permission}
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                        >
                          {permissionData?.name || permission}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInviteMember}
                  icon="Send"
                  className="flex-1"
                  disabled={!inviteForm.email || !inviteForm.avatarId}
                >
                  Send Invite
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FamilyPortal;