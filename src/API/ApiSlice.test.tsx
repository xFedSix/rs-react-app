import { setupApiStore } from '../Test/testUtils';
import { apiSlice } from './ApiSlice';

const storeRef = setupApiStore(apiSlice);

describe('apiSlice', () => {
  describe('fetchItems query', () => {
    it('generates correct URL with all parameters', async () => {
      const store = storeRef.store;
      const result = await store.dispatch(
        apiSlice.endpoints.fetchItems.initiate({
          searchQuery: 'charizard',
          page: 1,
          pageSize: 20,
          orderBy: 'name',
          select: 'id,name,image'
        })
      );

      expect(result.originalArgs).toEqual({
        searchQuery: 'charizard',
        page: 1,
        pageSize: 20,
        orderBy: 'name',
        select: 'id,name,image'
      });
    });

    it('generates correct URL without optional parameters', async () => {
      const store = storeRef.store;
      const result = await store.dispatch(
        apiSlice.endpoints.fetchItems.initiate({
          searchQuery: '',
          page: 2,
          pageSize: 15,
          orderBy: '',
          select: ''
        })
      );

      expect(result.originalArgs).toEqual({
        searchQuery: '',
        page: 2,
        pageSize: 15,
        orderBy: '',
        select: ''
      });
    });

    it('handles missing searchQuery but includes other params', async () => {
      const store = storeRef.store;
      const result = await store.dispatch(
        apiSlice.endpoints.fetchItems.initiate({
          searchQuery: '',
          page: 3,
          pageSize: 10,
          orderBy: 'number',
          select: 'id'
        })
      );

      expect(result.originalArgs).toEqual({
        searchQuery: '',
        page: 3,
        pageSize: 10,
        orderBy: 'number',
        select: 'id'
      });
    });

    it('handles URL encoding for search queries', async () => {
      const store = storeRef.store;
      const result = await store.dispatch(
        apiSlice.endpoints.fetchItems.initiate({
          searchQuery: 'shadow rider',
          page: 1,
          pageSize: 10,
          orderBy: '',
          select: ''
        })
      );

      expect(result.originalArgs?.searchQuery).toBe('shadow rider');
    });

    it('properly forms query with all parameters', async () => {
      const store = storeRef.store;
      const params = {
        searchQuery: 'pikachu',
        page: 1,
        pageSize: 5,
        orderBy: '',
        select: ''
      };

      const result = await store.dispatch(
        apiSlice.endpoints.fetchItems.initiate(params)
      );

      expect(result.originalArgs).toEqual(params);
    });
  });
});
