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
      console.log('Reducer setItems called');
      console.log('Set items:', action.payload);
      state.items = action.payload;
      console.log('Updated state:', state);
    },
    setError: (state, action: PayloadAction<string | null>) => {
      console.log('Reducer setError called');
      console.log('Set error:', action.payload);
      state.error = action.payload;
    },
    updateSelectedItems: (state, action: PayloadAction<Item[]>) => {
      console.log('Reducer updateSelectedItems called');
      console.log('Update selected items:', action.payload);
      state.selectedItems = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      console.log('Reducer setLoading called');
      console.log('Set loading:', action.payload);
      state.isLoading = action.payload;
    }
  }
});

export const { setItems, setError, updateSelectedItems, setLoading } =
  resultsSlice.actions;
export default resultsSlice.reducer;
