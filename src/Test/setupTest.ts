import '@testing-library/jest-dom';
import { afterEach, expect } from 'vitest';
import { cleanup } from '@testing-library/react';

globalThis.expect = expect;

afterEach(() => {
  cleanup();
});
