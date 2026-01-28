import { MOCK_STARTERS } from '../constants';
import { Starter, CategoryStats } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';
const USE_REAL_API = false;

// Simulated storage with localStorage for persistence in demo
const getLocalPending = (): Starter[] => {
  const saved = localStorage.getItem('talkspark-pending');
  return saved ? JSON.parse(saved) : [];
};

const setLocalPending = (data: Starter[]) => {
  localStorage.setItem('talkspark-pending', JSON.stringify(data));
};

export const DataService = {
  getAllStarters: async (): Promise<Starter[]> => {
    if (USE_REAL_API) {
      try {
        const res = await fetch(`${API_BASE_URL}/conversations/search?query=`);
        if (!res.ok) throw new Error('Network response was not ok');
        return await res.json();
      } catch (error) {
        console.error("Failed to fetch from API, falling back to mock", error);
        return MOCK_STARTERS;
      }
    }
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_STARTERS), 300));
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
        }
    }
    const all = await DataService.getAllStarters();
    const randomIndex = Math.floor(Math.random() * all.length);
    return all[randomIndex];
  },

  submitStarter: async (starter: Omit<Starter, 'id' | 'status'>): Promise<void> => {
    if (USE_REAL_API) {
      const res = await fetch(`${API_BASE_URL}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...starter, status: 'pending' })
      });
      if (!res.ok) throw new Error('Failed to submit');
      return;
    }
    
    const pending = getLocalPending();
    const newSubmission: Starter = {
      ...starter,
      id: Date.now(),
      status: 'pending'
    };
    pending.push(newSubmission);
    setLocalPending(pending);
    
    // Dispatch a custom event to notify components that data changed (like Navbar)
    window.dispatchEvent(new Event('talkspark-data-update'));
    
    return new Promise(resolve => setTimeout(resolve, 800));
  },

  getPendingStarters: async (): Promise<Starter[]> => {
    if (USE_REAL_API) {
      const res = await fetch(`${API_BASE_URL}/admin/pending`);
      return res.json();
    }
    return getLocalPending();
  },

  moderateStarter: async (id: number, action: 'approve' | 'reject'): Promise<void> => {
    if (USE_REAL_API) {
      const res = await fetch(`${API_BASE_URL}/admin/${action}/${id}`, { method: 'POST' });
      if (!res.ok) throw new Error('Moderation failed');
      return;
    }
    
    let pending = getLocalPending();
    if (action === 'approve') {
      const s = pending.find(x => x.id === id);
      if (s) {
        // In this mock environment, we push it to the main list
        MOCK_STARTERS.push({ ...s, status: 'approved' });
      }
    }
    pending = pending.filter(x => x.id !== id);
    setLocalPending(pending);
    
    window.dispatchEvent(new Event('talkspark-data-update'));
    return new Promise(resolve => setTimeout(resolve, 500));
  }
};