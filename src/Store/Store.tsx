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
      console.log('Set items:', action.payload);
      state.items = action.payload;
    },
    setError: (state, action) => {
      console.log('Set error:', action.payload);
      state.error = action.payload;
    },
    updateSelectedItems: (state, action) => {
      console.log('Update selected items:', action.payload);
      state.selectedItems = action.payload;
    }
  }
});

export const { setItems, setError, updateSelectedItems } = resultsSlice.actions;
export default resultsSlice.reducer;

interface CustomLoggerMiddlewareAPI {
  getState: () => RootState;
  dispatch: (action: any) => void;
}

const customLoggerMiddleware =
  (store: CustomLoggerMiddlewareAPI) =>
  (next: (action: any) => any) =>
  (action: any) => {
    console.log('Dispatching', action);
    let result = next(action);
    console.log('Next state', store.getState());
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
