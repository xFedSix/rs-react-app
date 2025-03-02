import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Item } from '../components/Result/Result';

interface ResultsState {
  items: Item[] | Item;
  error: string | null;
  selectedItems: Item[];
  isLoading: boolean;
}

const initialState: ResultsState = {
  items: [] as Item[] | Item,
  error: null,
  selectedItems: [],
  isLoading: false
};

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateSelectedItems: (state, action: PayloadAction<Item[]>) => {
      state.selectedItems = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const { setItems, setError, updateSelectedItems, setLoading } =
  resultsSlice.actions;
export default resultsSlice.reducer;
