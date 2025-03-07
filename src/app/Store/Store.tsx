import { configureStore } from '@reduxjs/toolkit';
import resultsReducer from './resultsSlice';

const customLoggerMiddleware =
  () => (next: (action: any) => any) => (action: any) => {
    return next(action);
  };

export const store = configureStore({
  reducer: {
    results: resultsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(customLoggerMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
