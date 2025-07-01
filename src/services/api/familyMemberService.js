import mockFamilyMembers from '@/services/mockData/familyMembers.json';

class FamilyMemberService {
  constructor() {
    this.familyMembers = [...mockFamilyMembers];
    this.nextId = Math.max(...this.familyMembers.map(member => member.Id)) + 1;
  }

  async getAll() {
    await this.delay(250);
    return [...this.familyMembers].sort((a, b) => new Date(b.invitedAt) - new Date(a.invitedAt));
  }

  async getById(id) {
    await this.delay(150);
    const member = this.familyMembers.find(member => member.Id === parseInt(id));
    if (!member) {
      throw new Error(`Family member with id ${id} not found`);
    }
    return { ...member };
  }

  async create(memberData) {
    await this.delay(350);
    const newMember = {
      ...memberData,
      Id: this.nextId++,
      invitedAt: memberData.invitedAt || new Date().toISOString(),
      status: memberData.status || 'pending'
    };
    this.familyMembers.unshift(newMember);
    return { ...newMember };
  }

  async update(id, updates) {
    await this.delay(250);
    const index = this.familyMembers.findIndex(member => member.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Family member with id ${id} not found`);
    }
    this.familyMembers[index] = { ...this.familyMembers[index], ...updates };
    return { ...this.familyMembers[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.familyMembers.findIndex(member => member.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Family member with id ${id} not found`);
    }
    this.familyMembers.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const familyMemberService = new FamilyMemberService();