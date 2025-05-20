// Import the official redux-persist storage
import storage from 'redux-persist/lib/storage';

// Create a no-op storage object for SSR
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// Export a storage object that works in both client and server environments
export const webStorage =
  typeof window !== 'undefined' ? storage : createNoopStorage();
