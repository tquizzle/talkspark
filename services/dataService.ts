import { MOCK_STARTERS } from '../constants';
import { Starter, CategoryStats } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const USE_REAL_API = false;

// Simulated storage with localStorage for persistence in demo
const getLocalPending = (): Starter[] => {
  const saved = localStorage.getItem('talkspark-pending');
  return saved ? JSON.parse(saved) : [];
};

const setLocalPending = (data: Starter[]) => {
  localStorage.setItem('talkspark-pending', JSON.stringify(data));
};

const getLocalApproved = (): Starter[] => {
  const saved = localStorage.getItem('talkspark-approved');
  return saved ? JSON.parse(saved) : [];
};

const setLocalApproved = (data: Starter[]) => {
  localStorage.setItem('talkspark-approved', JSON.stringify(data));
};

// Cloudflare Worker API functions
const workerApi = {
  getAllStarters: async (): Promise<Starter[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/conversations`);
      if (!res.ok) throw new Error('Network response was not ok');
      return await res.json();
    } catch (error) {
      console.error("Failed to fetch from Worker API, falling back to mock", error);
      return MOCK_STARTERS;
    }
  },

  getStarterById: async (id: number): Promise<Starter | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/conversations/${id}`);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Network response was not ok');
      }
      return await res.json();
    } catch (error) {
      console.error("Failed to fetch starter by ID", error);
      return null;
    }
  },

  saveStarter: async (starter: Omit<Starter, 'id'>): Promise<number> => {
    try {
      const res = await fetch(`${API_BASE_URL}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...starter, status: 'pending' })
      });
      if (!res.ok) throw new Error('Failed to save starter');
      const data = await res.json();
      return data.id;
    } catch (error) {
      console.error("Failed to save starter via Worker API", error);
      throw error;
    }
  },

  getPendingIds: async (): Promise<number[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/pending`);
      if (!res.ok) throw new Error('Network response was not ok');
      return await res.json();
    } catch (error) {
      console.error("Failed to fetch pending IDs", error);
      return [];
    }
  },

  addPendingId: async (id: number): Promise<void> => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/pending/${id}`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to add pending ID');
    } catch (error) {
      console.error("Failed to add pending ID via Worker API", error);
      throw error;
    }
  },

  removePendingId: async (id: number): Promise<void> => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/pending/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to remove pending ID');
    } catch (error) {
      console.error("Failed to remove pending ID via Worker API", error);
      throw error;
    }
  },

  getTheme: async (sessionId: string): Promise<string | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/theme/${sessionId}`);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      return data.theme || null;
    } catch (error) {
      console.error("Failed to get theme via Worker API", error);
      return null;
    }
  },

  saveTheme: async (sessionId: string, theme: string): Promise<void> => {
    try {
      const res = await fetch(`${API_BASE_URL}/theme`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, theme })
      });
      if (!res.ok) throw new Error('Failed to save theme');
    } catch (error) {
      console.error("Failed to save theme via Worker API", error);
      throw error;
    }
  }
};

export const DataService = {
  getAllStarters: async (): Promise<Starter[]> => {
    if (USE_REAL_API) {
      return workerApi.getAllStarters();
    }
    return new Promise((resolve) =>
      setTimeout(() => resolve([...MOCK_STARTERS, ...getLocalApproved()]), 300)
    );
  },

  getCategories: async (): Promise<CategoryStats[]> => {
    const starters = await DataService.getAllStarters();
    const categoryMap = starters.reduce((acc, starter) => {
      if (!acc[starter.category]) {
        acc[starter.category] = {
          name: starter.category,
          count: 0,
          color: "",
          icon: ""
        };
      }
      acc[starter.category].count++;
      return acc;
    }, {} as Record<string, CategoryStats>);

    return Object.values(categoryMap);
  },

  getStartersByCategory: async (categoryName: string): Promise<Starter[]> => {
    const all = await DataService.getAllStarters();
    return all.filter(s => s.category === categoryName);
  },

  getRandomStarter: async (): Promise<Starter> => {
    if (USE_REAL_API) {
      try {
        const res = await fetch(`${API_BASE_URL}/conversations/random`);
        if (!res.ok) throw new Error('Network error');
        return await res.json();
      } catch (e) {
        console.error(e);
        // Fall through to mock
      }
    }
    const all = await DataService.getAllStarters();
    const randomIndex = Math.floor(Math.random() * all.length);
    return all[randomIndex];
  },

  submitStarter: async (starter: Omit<Starter, 'id' | 'status'>): Promise<void> => {
    if (USE_REAL_API) {
      try {
        await workerApi.saveStarter(starter);
        return;
      } catch (error) {
        console.error("Worker API failed, falling back to localStorage", error);
        // Fall back to localStorage
      }
    }

    const pending = getLocalPending();
    const newSubmission: Starter = {
      ...starter,
      id: Math.floor(Math.random() * 1e12),
      status: 'pending'
    };
    pending.push(newSubmission);
    setLocalPending(pending);

    window.dispatchEvent(new Event('talkspark-data-update'));

    return new Promise(resolve => setTimeout(resolve, 800));
  },

  getPendingStarters: async (): Promise<Starter[]> => {
    if (USE_REAL_API) {
      const pendingIds = await workerApi.getPendingIds();
      const pendingPromises = pendingIds.map(id => workerApi.getStarterById(id));
      const pendingStarters = await Promise.all(pendingPromises);
      // Filter out nulls (in case of inconsistent state)
      return pendingStarters.filter((starter): starter is Starter => starter !== null);
    }
    return getLocalPending();
  },

  updatePendingStarter: (id: number, updates: Partial<Starter>): void => {
    if (USE_REAL_API) {
      // For now, fall back to localStorage for updates
      // In a full implementation, this would call the Worker API
      console.warn('UpdatePendingStarter not fully implemented for Worker API, falling back to localStorage');
    }

    const pending = getLocalPending();
    const updated = pending.map(p => p.id === id ? { ...p, ...updates } : p);
    setLocalPending(updated);
  },

  moderateStarter: async (id: number, action: 'approve' | 'reject'): Promise<void> => {
    if (USE_REAL_API) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/${action}/${id}`, { method: 'POST' });
        if (!res.ok) throw new Error('Moderation failed');
        return;
      } catch (error) {
        console.error("Worker API moderation failed, falling back to localStorage", error);
        // Fall back to localStorage
      }
    }

    let pending = getLocalPending();
    if (action === 'approve') {
      const s = pending.find(x => x.id === id);
      if (s) {
        const approved = getLocalApproved();
        approved.push({ ...s, status: 'approved' });
        setLocalApproved(approved);
      }
    }
    pending = pending.filter(x => x.id !== id);
    setLocalPending(pending);

    window.dispatchEvent(new Event('talkspark-data-update'));
    return new Promise(resolve => setTimeout(resolve, 500));
  }
};