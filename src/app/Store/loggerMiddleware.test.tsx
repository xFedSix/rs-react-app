import { describe, it, expect, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import type { Dispatch, MiddlewareAPI } from '@reduxjs/toolkit';
import loggerMiddleware from './loggerMiddleware';

describe('loggerMiddleware', () => {
  const mockApi: MiddlewareAPI = {
    dispatch: (() => {}) as Dispatch,
    getState: () => ({})
  };

  it('should call next function with the original action', () => {
    const nextMock = vi.fn();
    const action = { type: 'TEST_ACTION' };

    const middlewareFunction = loggerMiddleware(mockApi)(nextMock);
    middlewareFunction(action);

    expect(nextMock).toHaveBeenCalledWith(action);
  });

  it('should return the result of calling next function', () => {
    const nextMock = vi.fn().mockReturnValue('NEXT_RESULT');
    const action = { type: 'TEST_ACTION' };

    const middlewareFunction = loggerMiddleware(mockApi)(nextMock);
    const result = middlewareFunction(action);

    expect(result).toBe('NEXT_RESULT');
  });

  it('should not modify the action object', () => {
    const nextMock = vi.fn();
    const originalAction = { type: 'TEST_ACTION', payload: 'test' };
    const actionCopy = { ...originalAction };

    const middlewareFunction = loggerMiddleware(mockApi)(nextMock);
    middlewareFunction(originalAction);

    expect(originalAction).toEqual(actionCopy);
  });

  it('should handle actions with different types of payloads', () => {
    const nextMock = vi.fn();
    const actions = [
      { type: 'TEST_ACTION_STRING', payload: 'string payload' },
      { type: 'TEST_ACTION_NUMBER', payload: 42 },
      { type: 'TEST_ACTION_OBJECT', payload: { key: 'value' } },
      { type: 'TEST_ACTION_ARRAY', payload: [1, 2, 3] },
      { type: 'TEST_ACTION_NULL', payload: null },
      { type: 'TEST_ACTION_UNDEFINED', payload: undefined }
    ];

    const middlewareFunction = loggerMiddleware(mockApi)(nextMock);

    actions.forEach((action) => {
      middlewareFunction(action);
      expect(nextMock).toHaveBeenCalledWith(action);
    });

    expect(nextMock).toHaveBeenCalledTimes(actions.length);
  });

  it('should not throw an error when action is null or undefined', () => {
    const nextMock = vi.fn();
    const middlewareFunction = loggerMiddleware(mockApi)(nextMock);

    expect(() => middlewareFunction(null)).not.toThrow();
    expect(() => middlewareFunction(undefined)).not.toThrow();

    expect(nextMock).toHaveBeenCalledWith(null);
    expect(nextMock).toHaveBeenCalledWith(undefined);
  });

  it('should handle edge cases like empty actions or actions without type', () => {
    const nextMock = vi.fn();
    const middlewareFunction = loggerMiddleware(mockApi)(nextMock);

    const emptyAction = {};
    const actionWithoutType = { payload: 'test' };

    middlewareFunction(emptyAction);
    expect(nextMock).toHaveBeenCalledWith(emptyAction);

    middlewareFunction(actionWithoutType);
    expect(nextMock).toHaveBeenCalledWith(actionWithoutType);

    expect(nextMock).toHaveBeenCalledTimes(2);
  });

  it('should work with store configuration', () => {
    const store = configureStore({
      reducer: (state = {}) => state,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(loggerMiddleware)
    });

    const action = { type: 'TEST_ACTION' };
    expect(() => store.dispatch(action)).not.toThrow();
  });
});
