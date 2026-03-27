import { create } from 'zustand';

type NavigationChromeStore = {
  homeTabCollapsed: boolean;
  setHomeTabCollapsed: (value: boolean) => void;
};

export const useNavigationChromeStore = create<NavigationChromeStore>()((set) => ({
  homeTabCollapsed: false,
  setHomeTabCollapsed: (value) => set({ homeTabCollapsed: value }),
}));
