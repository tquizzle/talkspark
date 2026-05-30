import { Starter } from '../types';

export interface Storage {
  getAllStarters(): Promise<Starter[]>;
  getStarterById(id: number): Promise<Starter | null>;
  saveStarter(starter: Omit<Starter, 'id'>): Promise<number>;
  getPendingIds(): Promise<number[]>;
  addPendingId(id: number): Promise<void>;
  removePendingId(id: number): Promise<void>;
  getTheme(sessionId: string): Promise<string | null>;
  saveTheme(sessionId: string, theme: string): Promise<void>;
}

// In-memory storage for development/testing when not using real API
export class MemoryStorage implements Storage {
  private starters: Map<number, Starter> = new Map();
  private pendingIds: Set<number> = new Set();
  private themes: Map<string, string> = new Map();
  private idCounter = 1;

  async getAllStarters(): Promise<Starter[]> {
    return Array.from(this.starters.values());
  }

  async getStarterById(id: number): Promise<Starter | null> {
    return this.starters.get(id) || null;
  }

  async saveStarter(starter: Omit<Starter, 'id'>): Promise<number> {
    const id = this.idCounter++;
    const newStarter: Starter = { ...starter, id, status: 'pending' };
    this.starters.set(id, newStarter);
    return id;
  }

  async getPendingIds(): Promise<number[]> {
    return Array.from(this.pendingIds);
  }

  async addPendingId(id: number): Promise<void> {
    this.pendingIds.add(id);
  }

  async removePendingId(id: number): Promise<void> {
    this.pendingIds.delete(id);
  }

  async getTheme(sessionId: string): Promise<string | null> {
    return this.themes.get(sessionId) || null;
  }

  async saveTheme(sessionId: string, theme: string): Promise<void> {
    this.themes.set(sessionId, theme);
  }
}

// Cloudflare KV storage implementation
export class KVStorage implements Storage {
  private starters: KVNamespace;
  private pending: KVNamespace;
  private themes: KVNamespace;

  constructor(starters: KVNamespace, pending: KVNamespace, themes: KVNamespace) {
    this.starters = starters;
    this.pending = pending;
    this.themes = themes;
  }

  private starterKey(id: number): string {
    return `starter:${id}`;
  }

  async getAllStarters(): Promise<Starter[]> {
    // For simplicity in KV, we'll store all starters under a single key
    // In production with more data, we might want to iterate or use list operations
    const startersData = await this.starters.get<Starter[]>('all');
    return startersData || [];
  }

  async getStarterById(id: number): Promise<Starter | null> {
    const starterData = await this.starters.get<Starter>(this.starterKey(id));
    return starterData || null;
  }

  async saveStarter(starter: Omit<Starter, 'id'>): Promise<number> {
    // Get all starters to find next ID
    const allStarters = await this.getAllStarters();
    const nextId = allStarters.length > 0
      ? Math.max(...allStarters.map(s => s.id)) + 1
      : 1;

    const newStarter: Starter = { ...starter, id: nextId, status: 'pending' };

    // Save individual starter
    await this.starters.put(this.starterKey(nextId), newStarter);

    // Update all starters list
    const updatedStarters = [...allStarters, newStarter];
    await this.starters.put('all', updatedStarters);

    return nextId;
  }

  async getPendingIds(): Promise<number[]> {
    const pendingData = await this.pending.get<number[]>('ids');
    return pendingData || [];
  }

  async addPendingId(id: number): Promise<void> {
    const currentIds = await this.getPendingIds();
    if (!currentIds.includes(id)) {
      currentIds.push(id);
      await this.pending.put('ids', currentIds);
    }
  }

  async removePendingId(id: number): Promise<void> {
    const currentIds = await this.getPendingIds();
    const index = currentIds.indexOf(id);
    if (index !== -1) {
      currentIds.splice(index, 1);
      await this.pending.put('ids', currentIds);
    }
  }

  async getTheme(sessionId: string): Promise<string | null> {
    return this.themes.get(sessionId) || null;
  }

  async saveTheme(sessionId: string, theme: string): Promise<void> {
    await this.themes.put(sessionId, theme);
  }
}