import * as SecureStore from 'expo-secure-store';
import apiClient from './client';
import type { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from './types';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export class AuthService {
  /**
   * Login user with username and password
   * @param credentials - User login credentials
   * @returns Promise with user data and tokens
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      username: credentials.username,
      password: credentials.password,
      expiresInMins: credentials.expiresInMins || 30,
    });

    const { accessToken, refreshToken, ...userData } = response.data;

    // Store tokens securely using SecureStore
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    await SecureStore.setItemAsync('user', JSON.stringify(userData));

    return response.data;
  }

  /**
   * Signup new user
   * Note: DummyJSON /users/add creates a mock user but doesn't persist it for login.
   * The user will need to login manually after signup.
   * @param userData - User registration data
   * @returns Promise with user data
   */
  static async signup(userData: SignupRequest): Promise<SignupResponse> {
    const response = await apiClient.post<SignupResponse>('/users/add', {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      username: userData.username,
      password: userData.password,
      age: userData.age || 18,
      gender: userData.gender || 'male',
      phone: userData.phone || '',
    });

    // Note: DummyJSON doesn't persist new users for login authentication
    // Auto-login removed - user needs to login manually with existing credentials
    // For demo purposes, you can use: username: "emilys", password: "emilyspass"

    return response.data;
  }

  /**
   * Logout user and clear stored tokens
   */
  static async logout(): Promise<void> {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('user');
  }

  /**
   * Get current user from storage
   */
  static async getCurrentUser() {
    try {
      const userJson = await SecureStore.getItemAsync('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const token = await SecureStore.getItemAsync('accessToken');
    return !!token;
  }

  /**
   * Refresh access token
   */
  static async refreshToken(): Promise<string> {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh',
      { refreshToken }
    );

    await SecureStore.setItemAsync('accessToken', response.data.accessToken);
    await SecureStore.setItemAsync('refreshToken', response.data.refreshToken);

    return response.data.accessToken;
  }
}

export default AuthService;
