export type DestinationType = 'beach' | 'mountain' | 'city';
export type PageKey = 'home' | 'itinerary' | 'budget' | 'admin';

export interface Destination {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  rating: number;
  type: DestinationType;
  visitDuration: number;
  costBreakdown: { food: number; stay: number; transport: number };
  coordinates?: { lat: number; lng: number };
  tags?: string[];
}

export interface ItineraryItem {
  id: string;
  destinationId: string;
  order: number;
  notes?: string;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  items: ItineraryItem[];
}

export interface Itinerary {
  id: string;
  name: string;
  days: ItineraryDay[];
  createdAt: string;
}

export interface BudgetThreshold {
  total: number;
  food?: number;
  stay?: number;
  transport?: number;
}

export interface FilterOptions {
  types: DestinationType[];
  priceRange: [number, number];
  minRating: number;
  sortBy: 'rating' | 'price' | 'name';
  sortOrder: 'asc' | 'desc';
}

export interface BudgetAlert {
  category: 'total' | 'food' | 'stay' | 'transport';
  level: 'warning' | 'exceeded';
  percent: number;
  spent: number;
  limit: number;
}

export const MAX_PER_DAY = 6;
export const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };

export const genId = (): string => `id_${Math.random().toString(36).slice(2, 9)}`;

export const formatVND = (v: number): string =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

export const totalCost = (d: Destination): number =>
  d.costBreakdown.food + d.costBreakdown.stay + d.costBreakdown.transport;

export const DEST_TYPE_LABELS: Record<DestinationType, string> = {
  beach: 'Biển',
  mountain: 'Núi',
  city: 'Thành phố',
};

export const DEST_TYPE_COLORS: Record<DestinationType, string> = {
  beach: '#1890ff',
  mountain: '#52c41a',
  city: '#fa8c16',
};

export const CATEGORY_LABELS: Record<string, string> = {
  food: 'Ăn uống',
  stay: 'Lưu trú',
  transport: 'Di chuyển',
  total: 'Tổng',
};

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
