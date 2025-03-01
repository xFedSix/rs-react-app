import resultsReducer, {
  setItems,
  setError,
  updateSelectedItems
} from './resultsSlice';
import { Item, ResultsState } from './Store';

describe('resultsSlice', () => {
  const initialState: ResultsState = {
    items: [],
    error: null,
    selectedItems: [],
    isLoading: false
  };

  it('should handle setItems', () => {
    const items: Item[] = [
      {
        id: 1,
        name: 'Item 1',
        images: { small: 'small.jpg', large: 'large.jpg' },
        flavorText: 'Test item'
      }
    ];
    const action = setItems(items);
    const state = resultsReducer(initialState, action);
    expect(state.items).toEqual(items);
  });

  it('should handle setError', () => {
    const error = 'Error occurred';
    const action = setError(error);
    const state = resultsReducer(initialState, action);
    expect(state.error).toBe(error);
  });

  it('should handle updateSelectedItems', () => {
    const selectedItems: Item[] = [
      {
        id: 2,
        name: 'Item 2',
        images: { small: 'small2.jpg', large: 'large2.jpg' },
        flavorText: 'Another test item'
      }
    ];
    const action = updateSelectedItems(selectedItems);
    const state = resultsReducer(initialState, action);
    expect(state.selectedItems).toEqual(selectedItems);
  });
});
