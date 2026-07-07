import { create } from 'zustand';
import { UserProfile, HealthStats, healthStats, userProfile } from '../data/mockData';

interface AppState {
  currentPage: 'dashboard' | 'health' | 'settings';
  setCurrentPage: (page: 'dashboard' | 'health' | 'settings') => void;
  
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  
  stats: HealthStats;
  
  showModal: boolean;
  modalTitle: string;
  modalMessage: string;
  openModal: (title: string, message: string) => void;
  closeModal: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'dashboard',
  setCurrentPage: (page) => set({ currentPage: page }),
  
  user: userProfile,
  setUser: (user) => set({ user }),
  
  stats: healthStats,
  
  showModal: false,
  modalTitle: '',
  modalMessage: '',
  openModal: (title, message) => set({ showModal: true, modalTitle: title, modalMessage: message }),
  closeModal: () => set({ showModal: false, modalTitle: '', modalMessage: '' }),
}));