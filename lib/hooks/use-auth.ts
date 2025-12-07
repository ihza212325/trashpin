import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import AuthService from '../api/auth.service';
import type { ApiError, LoginRequest, LoginResponse, SignupRequest, SignupResponse, User } from '../api/types';
import UserService from '../api/user.service';

/**
 * Query Keys for authentication
 */
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  isAuthenticated: () => [...authKeys.all, 'isAuthenticated'] as const,
};

/**
 * Hook for user login mutation
 * Handles login API call with proper state management
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<LoginResponse, ApiError, LoginRequest>({
    mutationFn: (credentials) => AuthService.login(credentials),
    onSuccess: (data) => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      queryClient.invalidateQueries({ queryKey: authKeys.isAuthenticated() });
      
      // Update cache with new user data
      queryClient.setQueryData(authKeys.user(), data);
      
      // Navigate to main app
      router.replace('/home');
    },
    onError: (error) => {
      console.error('Login failed:', error.message);
    },
  });
}

/**
 * Hook for user signup mutation
 * Note: Since DummyJSON doesn't persist new users, signup only creates a mock user.
 * User needs to login manually with existing credentials after signup.
 */
export function useSignup() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<SignupResponse, ApiError, SignupRequest>({
    mutationFn: (userData) => AuthService.signup(userData),
    onSuccess: (data) => {
      // Don't navigate to home - user needs to login first
      // Navigate back to login page instead
      router.replace('/login');
    },
    onError: (error) => {
      console.error('Signup failed:', error.message);
    },
  });
}

/**
 * Hook for user logout mutation
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<void, ApiError, void>({
    mutationFn: () => AuthService.logout(),
    onSuccess: async () => {
      // Invalidate auth queries
      await queryClient.invalidateQueries({ queryKey: authKeys.isAuthenticated() });
      await queryClient.invalidateQueries({ queryKey: authKeys.user() });
      
      // Clear all cached data
      queryClient.clear();
      
      // Navigate to login
      router.replace('/login');
    },
  });
}

/**
 * Hook to get current user
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => AuthService.getCurrentUser(),
    staleTime: Infinity, // User data doesn't change unless explicitly updated
  });
}

/**
 * Hook to check authentication status
 */
export function useIsAuthenticated() {
  return useQuery({
    queryKey: authKeys.isAuthenticated(),
    queryFn: () => AuthService.isAuthenticated(),
    staleTime: Infinity,
  });
}

/**
 * Hook for updating user profile
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<
    User,
    ApiError,
    { id: number; data: Partial<Pick<User, 'firstName' | 'lastName' | 'email' | 'username'>> }
  >({
    mutationFn: ({ id, data }) => UserService.updateUser(id, data),
    onSuccess: (updatedUser) => {
      // Update user in cache
      queryClient.setQueryData(authKeys.user(), updatedUser);
      
      // Update user in SecureStore
      SecureStore.setItemAsync('user', JSON.stringify(updatedUser)).catch(
        (error) => console.error('Error updating user in storage:', error)
      );
    },
  });
}

/**
 * Hook for deleting user account
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<User, ApiError, number>({
    mutationFn: (id) => UserService.deleteUser(id),
    onSuccess: async () => {
      // Logout user after deletion
      await AuthService.logout();
      
      // Clear all cached data
      queryClient.clear();
      
      // Navigate to login
      router.replace('/login');
    },
  });
}
