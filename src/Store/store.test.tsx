import { store } from './Store';
import { setItems, setError, updateSelectedItems } from './resultsSlice';
import { configureStore } from '@reduxjs/toolkit';
import resultsReducer from './resultsSlice';
import type { Item } from './Store';

describe('Store Configuration', () => {
  const mockItem: Item = {
    id: 1,
    name: 'Test Card',
    images: {
      small: 'small.jpg',
      large: 'large.jpg'
    },
    flavorText: 'Test description'
  };

  it('should create store with initial state', () => {
    const testStore = configureStore({
      reducer: {
        results: resultsReducer
      }
    });

    expect(testStore.getState().results).toEqual({
      items: [],
      error: null,
      selectedItems: [],
      isLoading: false
    });
  });

  it('should handle setItems action', () => {
    store.dispatch(setItems([mockItem]));
    const state = store.getState();
    expect(state.results.items).toEqual([mockItem]);
  });

  it('should handle setError action', () => {
    const errorMessage = 'Test error';
    store.dispatch(setError(errorMessage));
    const state = store.getState();
    expect(state.results.error).toBe(errorMessage);
  });

  it('should handle updateSelectedItems action', () => {
    store.dispatch(updateSelectedItems([mockItem]));
    const state = store.getState();
    expect(state.results.selectedItems).toEqual([mockItem]);
  });

  it('should apply middleware and maintain state consistency', () => {
    let state = store.getState();
    expect(state.results.items).toEqual([mockItem]);

    store.dispatch(setItems([]));
    store.dispatch(setError(null));
    store.dispatch(updateSelectedItems([]));

    state = store.getState();
    expect(state.results.items).toEqual([]);
    expect(state.results.error).toBeNull();
    expect(state.results.selectedItems).toEqual([]);
  });

  it('should handle multiple state updates correctly', () => {
    store.dispatch(setItems([mockItem]));
    store.dispatch(updateSelectedItems([mockItem]));
    store.dispatch(setError('New error'));

    const state = store.getState();
    expect(state.results.items).toEqual([mockItem]);
    expect(state.results.selectedItems).toEqual([mockItem]);
    expect(state.results.error).toBe('New error');
  });

  it('should handle undefined/null values', () => {
    store.dispatch(setItems([]));
    store.dispatch(setError(null));
    store.dispatch(updateSelectedItems([]));

    const state = store.getState();
    expect(state.results.items).toEqual([]);
    expect(state.results.error).toBeNull();
    expect(state.results.selectedItems).toEqual([]);
  });

  it('should maintain state immutability', () => {
    const initialState = store.getState();
    const initialItems = initialState.results.items;

    store.dispatch(setItems([mockItem]));

    const newState = store.getState();
    expect(newState.results.items).not.toBe(initialItems);
    expect(initialState.results.items).not.toBe(newState.results.items);
  });

  it('should apply custom logger middleware', () => {
    const consoleLogSpy = vi.spyOn(console, 'log');

    store.dispatch(setItems([mockItem]));

    expect(consoleLogSpy).not.toHaveBeenCalled();

    consoleLogSpy.mockRestore();
  });
});
