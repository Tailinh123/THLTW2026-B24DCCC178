import type { Destination, Itinerary, BudgetThreshold } from './types';
import { MOCK_DESTINATIONS, DEFAULT_ITINERARY, DEFAULT_BUDGET } from './data.mock';

const KEYS = {
  destinations: 'th06_destinations',
  itinerary: 'th06_itinerary',
  budget: 'th06_budget',
};

const delay = (ms = 400): Promise<void> => new Promise((r) => setTimeout(r, ms));

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const api = {
  getDestinations: async (): Promise<Destination[]> => {
    await delay(300);
    return load(KEYS.destinations, MOCK_DESTINATIONS);
  },
  saveDestinations: async (data: Destination[]): Promise<void> => {
    await delay(200);
    save(KEYS.destinations, data);
  },

  getItinerary: async (): Promise<Itinerary> => {
    await delay(300);
    return load(KEYS.itinerary, DEFAULT_ITINERARY);
  },
  saveItinerary: async (data: Itinerary): Promise<void> => {
    await delay(200);
    save(KEYS.itinerary, data);
  },

  getBudget: async (): Promise<BudgetThreshold> => {
    await delay(200);
    return load(KEYS.budget, DEFAULT_BUDGET);
  },
  saveBudget: async (data: BudgetThreshold): Promise<void> => {
    await delay(200);
    save(KEYS.budget, data);
  },

  
  resetAll: (): void => {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
