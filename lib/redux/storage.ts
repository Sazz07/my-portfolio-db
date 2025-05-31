// Import the official redux-persist storage
import storage from 'redux-persist/lib/storage';

// Create a no-op storage object for SSR
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(value: string) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

// Export a storage object that works in both client and server environments
export const webStorage =
  typeof window !== 'undefined' ? storage : createNoopStorage();
