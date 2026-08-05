import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FavoriteTrain, RecentSearch } from '../types/favorites';

interface UserState {
  favorites: FavoriteTrain[];
  recentSearches: RecentSearch[];
  addFavorite: (train: Omit<FavoriteTrain, 'addedAt'>) => void;
  removeFavorite: (trainNumber: string) => void;
  isFavorite: (trainNumber: string) => boolean;
  addRecentSearch: (search: Omit<RecentSearch, 'searchedAt'>) => void;
  clearRecentSearches: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      favorites: [],
      recentSearches: [],
      addFavorite: (train) => {
        const current = get().favorites;
        if (!current.some((f) => f.trainNumber === train.trainNumber)) {
          set({
            favorites: [{ ...train, addedAt: new Date().toISOString() }, ...current],
          });
        }
      },
      removeFavorite: (trainNumber) => {
        set({
          favorites: get().favorites.filter((f) => f.trainNumber !== trainNumber),
        });
      },
      isFavorite: (trainNumber) => {
        return get().favorites.some((f) => f.trainNumber === trainNumber);
      },
      addRecentSearch: (search) => {
        const current = get().recentSearches.filter((s) => s.trainNumber !== search.trainNumber);
        set({
          recentSearches: [{ ...search, searchedAt: new Date().toISOString() }, ...current].slice(0, 10),
        });
      },
      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },
    }),
    {
      name: 'railgaadi-user-storage',
    }
  )
);
