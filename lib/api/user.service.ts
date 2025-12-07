import apiClient from './client';
import type { User } from './types';

/**
 * User Service
 * Handles user-related API calls (update, delete)
 */
export class UserService {
  /**
   * Update user information
   * @param id - User ID
   * @param data - User data to update
   * @returns Promise with updated user data
   */
  static async updateUser(
    id: number,
    data: Partial<Pick<User, 'firstName' | 'lastName' | 'email' | 'username'>>
  ): Promise<User> {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  }

  /**
   * Delete user account
   * @param id - User ID
   * @returns Promise with deleted user data
   */
  static async deleteUser(id: number): Promise<User> {
    const response = await apiClient.delete<User>(`/users/${id}`);
    return response.data;
  }
}

export default UserService;

