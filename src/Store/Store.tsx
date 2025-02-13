import { configureStore, createSlice } from '@reduxjs/toolkit';
import resultsReducer from './resultsSlice';

export interface Item {
  id: number | string;
  name: string;
  images: {
    small: string;
    large: string;
  };
  flavorText: string | undefined;
}

export interface ResultsState {
  items: Item[] | Item;
  error: string | null;
  selectedItems: Item[];
  isLoading: boolean;
}

const initialState: ResultsState = {
  items: [],
  error: null,
  selectedItems: [],
  isLoading: false
};

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateSelectedItems: (state, action) => {
      state.selectedItems = action.payload;
    }
  }
});

export const { setItems, setError, updateSelectedItems } = resultsSlice.actions;
export default resultsSlice.reducer;

const customLoggerMiddleware =
  () => (next: (action: any) => any) => (action: any) => {
    let result = next(action);
    return result;
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
