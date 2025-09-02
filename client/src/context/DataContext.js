import { createContext } from 'react';

export const DataContext = createContext({
  actions: [],
  setActions: () => {},
  logs: [],
  setLogs: () => {},
  categories: [],
  setCategories: () => {}
});
