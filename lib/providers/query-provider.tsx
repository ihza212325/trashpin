import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

/**
 * Query Client configuration
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: false,
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * Query Provider Component
 * Wraps the app with TanStack Query functionality
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export { queryClient };
