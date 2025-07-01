import mockInteractions from '@/services/mockData/interactions.json';

class InteractionService {
  constructor() {
    this.interactions = [...mockInteractions];
    this.nextId = Math.max(...this.interactions.map(interaction => interaction.Id)) + 1;
  }

  async getAll() {
    await this.delay(200);
    return [...this.interactions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async getById(id) {
    await this.delay(150);
    const interaction = this.interactions.find(interaction => interaction.Id === parseInt(id));
    if (!interaction) {
      throw new Error(`Interaction with id ${id} not found`);
    }
    return { ...interaction };
  }

  async create(interactionData) {
    await this.delay(300);
    const newInteraction = {
      ...interactionData,
      Id: this.nextId++,
      timestamp: interactionData.timestamp || new Date().toISOString()
    };
    this.interactions.unshift(newInteraction);
    return { ...newInteraction };
  }

  async update(id, updates) {
    await this.delay(250);
    const index = this.interactions.findIndex(interaction => interaction.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Interaction with id ${id} not found`);
    }
    this.interactions[index] = { ...this.interactions[index], ...updates };
    return { ...this.interactions[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.interactions.findIndex(interaction => interaction.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Interaction with id ${id} not found`);
    }
    this.interactions.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const interactionService = new InteractionService();