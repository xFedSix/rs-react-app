import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

export function setupApiStore(api: any, withoutListeners = false) {
  const store = configureStore({
    reducer: {
      [api.reducerPath]: api.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware)
  });

  if (!withoutListeners) setupListeners(store.dispatch);

  return {
    store,
    api
  };
}
