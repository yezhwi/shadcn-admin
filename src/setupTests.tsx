import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock the global fetch API
vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
  })
));

// Mock window.matchMedia for testing responsive components
vi.stubGlobal('matchMedia', vi.fn((query) => ({
  matches: query.includes('max-width: 640px') ? false : true,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
})));

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

vi.stubGlobal('ResizeObserver', MockResizeObserver);

// Mock useRouter from TanStack Router
export const mockNavigate = vi.fn();
export const mockUseRouter = vi.fn(() => ({
  navigate: mockNavigate,
  location: { pathname: '/', search: '', hash: '' },
  params: {},
  query: {},
  state: null,
  preload: vi.fn(),
  isLoading: false,
  isTransitioning: false,
}));

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const original = await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...original,
    useRouter: mockUseRouter,
  };
});

// Create a test QueryClient with default options
export const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

// Test wrapper that provides QueryClient and other providers
export const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
