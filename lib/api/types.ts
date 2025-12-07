/**
 * Authentication Types
 */

export interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  age?: number;
  gender?: string;
  phone?: string;
}

export interface SignupResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

/**
 * API Error Response
 */
export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}
