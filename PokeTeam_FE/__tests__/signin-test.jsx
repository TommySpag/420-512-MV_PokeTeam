import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignIn from '../app/auth/signin'; // Adjust the import based on your file structure
import { useRouter } from 'expo-router';
import { signIn, setToken} from '../lib/axios';
import { ThemeProvider } from '../contexts/ThemeContext';

// Mock the dependencies
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Link: jest.fn(({ children }) => <>{children}</>),
}));

jest.mock('../lib/axios', () => ({
  signIn: jest.fn(),
}));


const MockThemeProvider = ({ children }) => {
  const mockTheme = { theme: 'light' }; // Or whatever theme you want to mock
  return <ThemeProvider value={mockTheme}>{children}</ThemeProvider>;
};
describe('SignIn Component', () => {
  const mockRouter = { push: jest.fn() };
  
  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(
    <MockThemeProvider>
      <SignIn />
    </MockThemeProvider>);
    expect(getByText('ChatMV')).toBeTruthy();
    expect(getByText('Connectez-vous')).toBeTruthy();
  });

  it('shows validation messages for empty fields', async () => {
    const { getByText, getByPlaceholderText } = render(
        <MockThemeProvider>
            <SignIn />
        </MockThemeProvider>);
    
    fireEvent.press(getByText('Se connectez'));
    
    expect(getByText('Identifiant : Ce champs doit être rempli')).toBeTruthy();
    expect(getByText('Mot de passe : Ce champs doit être rempli')).toBeTruthy();
  });

  it('handles successful sign-in', async () => {
    signIn.mockResolvedValue({ id: 1 }); // Mock successful sign-in response
    const { getByPlaceholderText, getByText } = render(
    <MockThemeProvider>
      <SignIn />
    </MockThemeProvider>);
    
    fireEvent.changeText(getByPlaceholderText('Entrez l\'identifiant'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Entrez le mot de passe'), 'password123');
    
    fireEvent.press(getByText('Se connectez'));
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('../1/profile');
    });
  });

  it('handles sign-in failure', async () => {
    signIn.mockRejectedValue(new Error('AxiosError: Request failed with status code 401')); // Mock sign-in failure
    const { getByPlaceholderText, getByText } = render(
    <MockThemeProvider>
      <SignIn />
    </MockThemeProvider>);
    
    fireEvent.changeText(getByPlaceholderText('Entrez l\'identifiant'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Entrez le mot de passe'), 'wrongpassword');
    
    fireEvent.press(getByText('Se connectez'));
    
    await waitFor(() => {
      expect(getByText('Identifiant ou mot de passe incorrect')).toBeTruthy();
    });
  });
});
