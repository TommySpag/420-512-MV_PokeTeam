import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Example test file structure
import MockAdapter from 'axios-mock-adapter';
import { api } from '../lib/axios'; // Import the same axios instance
import { render, fireEvent, waitFor } from '@testing-library/react-native';

// Set up the mock
const mockAxios = new MockAdapter(api);
import { signUp } from '../lib/axios'; // Ensure this is imported
import SignUp from '../app/auth/signup'; // Import the component
// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve(null)), // Default return value for getItem
}));  

beforeEach(() => {
  mockAxios.reset(); // Reset before each test
});

const MockThemeProvider = ({ children }) => {
  const mockTheme = { theme: 'light' }; // Or whatever theme you want to mock
  return <ThemeProvider value={mockTheme}>{children}</ThemeProvider>;
};

describe('SignUp Component Integration with axios.js', () => {
  afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <MockThemeProvider>
        <SignUp />
      </MockThemeProvider>
      );
    expect(getByText('ChatMV')).toBeTruthy();
    expect(getByText("Créez votre compte")).toBeTruthy();
  });

  it('shows validation messages for empty fields', async () => {
    const { getByText } = render(
      <MockThemeProvider>
        <SignUp />
      </MockThemeProvider>
      );
    
    fireEvent.press(getByText("Créez le compte"));

    expect(getByText("Courriel : Ce champs doit être rempli")).toBeTruthy();
    expect(getByText("Identifiant : Ce champs doit être rempli")).toBeTruthy();
    expect(getByText("Mot de passe : Ce champs doit être rempli")).toBeTruthy();
  });

  it('submits the form successfully', async () => {
    const mockResponse = { id: '123', token: 'mockToken' };
    mockAxios.onPost('/users').reply(201, mockResponse);

    const { getByPlaceholderText, getByText } = render(
      <MockThemeProvider>
        <SignUp />
      </MockThemeProvider>);
    const username = "testUser"
    fireEvent.changeText(getByPlaceholderText("Entrez votre courriel"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Entrez l'identifiant"), username);
    fireEvent.changeText(getByPlaceholderText("Entrez le mot de passe"), "password123");

    fireEvent.press(getByText("Créez le compte"));

    await waitFor(() => {
      expect(mockAxios.history.post.length).toBe(1);
      expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
        email: "test@example.com",
        username: "testUser",
        password: "password123"
      });
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('jwt', 'mockToken');
  });

  it('shows error message on sign-up failure', async () => {
    mockAxios.onPost('/users').reply(409);

    const { getByPlaceholderText, getByText } = render(
      <MockThemeProvider><SignUp /></MockThemeProvider>);
    
    fireEvent.changeText(getByPlaceholderText("Entrez votre courriel"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Entrez l'identifiant"), "testUser");
    fireEvent.changeText(getByPlaceholderText("Entrez le mot de passe"), "password123");

    fireEvent.press(getByText("Créez le compte"));

    await waitFor(() => {
      expect(getByText("Email et/ou Identifiant déjà utilisé")).toBeTruthy();
    });
  });
});
