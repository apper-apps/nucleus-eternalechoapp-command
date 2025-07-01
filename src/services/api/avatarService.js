import mockAvatars from '@/services/mockData/avatars.json';

class AvatarService {
  constructor() {
    this.avatars = [...mockAvatars];
    this.nextId = Math.max(...this.avatars.map(avatar => avatar.Id)) + 1;
  }

  async getAll() {
    await this.delay(200);
    return [...this.avatars];
  }

  async getById(id) {
    await this.delay(150);
    const avatar = this.avatars.find(avatar => avatar.Id === parseInt(id));
    if (!avatar) {
      throw new Error(`Avatar with id ${id} not found`);
    }
    return { ...avatar };
  }

  async create(avatarData) {
    await this.delay(300);
    const newAvatar = {
      ...avatarData,
      Id: this.nextId++,
      createdAt: new Date().toISOString(),
      homeLevel: avatarData.homeLevel || 1,
      memoryCount: avatarData.memoryCount || 0,
      completionPercentage: avatarData.completionPercentage || 25
    };
    this.avatars.unshift(newAvatar);
    return { ...newAvatar };
  }

  async update(id, updates) {
    await this.delay(250);
    const index = this.avatars.findIndex(avatar => avatar.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Avatar with id ${id} not found`);
    }
    this.avatars[index] = { ...this.avatars[index], ...updates };
    return { ...this.avatars[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.avatars.findIndex(avatar => avatar.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Avatar with id ${id} not found`);
    }
    this.avatars.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const avatarService = new AvatarService();