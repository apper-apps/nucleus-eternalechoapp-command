import mockMemories from '@/services/mockData/memories.json';

class MemoryService {
  constructor() {
    this.memories = [...mockMemories];
    this.nextId = Math.max(...this.memories.map(memory => memory.Id)) + 1;
  }

  async getAll() {
    await this.delay(300);
    return [...this.memories].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getById(id) {
    await this.delay(150);
    const memory = this.memories.find(memory => memory.Id === parseInt(id));
    if (!memory) {
      throw new Error(`Memory with id ${id} not found`);
    }
    return { ...memory };
  }

  async create(memoryData) {
    await this.delay(400);
    const newMemory = {
      ...memoryData,
      Id: this.nextId++,
      createdAt: memoryData.createdAt || new Date().toISOString()
    };
    this.memories.unshift(newMemory);
    return { ...newMemory };
  }

  async update(id, updates) {
    await this.delay(250);
    const index = this.memories.findIndex(memory => memory.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Memory with id ${id} not found`);
    }
    this.memories[index] = { ...this.memories[index], ...updates };
    return { ...this.memories[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.memories.findIndex(memory => memory.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Memory with id ${id} not found`);
    }
    this.memories.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const memoryService = new MemoryService();