import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignIn from '../app/auth/signin';
import { useRouter } from 'expo-router';
import { signIn, setToken} from '../lib/axios';
import { ThemeProvider } from '../contexts/ThemeContext';

// Mock the dependencies
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Link: jest.fn(({ children }) => <>{children}</>),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve(null)), // Default return value for getItem
}));



const MockThemeProvider = ({ children }) => {
  const mockTheme = { theme: 'light' }; // Or whatever theme you want to mock
  return <ThemeProvider value={mockTheme}>{children}</ThemeProvider>;
};
describe('Integration Tests for Authentication', () => {
  it('should successfully sign in with valid credentials', async () => {
    const username = 'A';
    const password = 'A';
    
    // Make sure you have this user in your test database
    const response = await signIn("A", "A");
    expect(response).toHaveProperty('token'); // Check if a token is returned
  });

  it('should fail to sign in with invalid credentials', async () => {
    const username = 'invalidUser';
    const password = 'wrongPassword';

    await expect(signIn(username, password)).rejects.toThrow(); // Ensure it throws an error
  });
});