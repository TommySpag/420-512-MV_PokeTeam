import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignUp from '../app/auth/signup'; // Adjust the import based on your file structure
import { useRouter } from 'expo-router';
import { signUp, setToken} from '../lib/axios';
import { ThemeProvider } from '../contexts/ThemeContext';

// Mock the dependencies
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Link: jest.fn(({ children }) => <>{children}</>),
}));

jest.mock('../lib/axios', () => ({
  signUp: jest.fn(),
}));


const MockThemeProvider = ({ children }) => {
  const mockTheme = { theme: 'light' }; // Or whatever theme you want to mock
  return <ThemeProvider value={mockTheme}>{children}</ThemeProvider>;
};
describe('SignUp Component', () => {
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
      <SignUp />
    </MockThemeProvider>);
    expect(getByText('ChatMV')).toBeTruthy();
    expect(getByText('Créez le compte')).toBeTruthy();
  });

  it('shows validation messages for empty fields', async () => {
    const { getByText, getByPlaceholderText } = render(
        <MockThemeProvider>
            <SignUp />
        </MockThemeProvider>);
    
    fireEvent.press(getByText('Créez le compte'));
    
    expect(getByText('Identifiant : Ce champs doit être rempli')).toBeTruthy();
    expect(getByText('Mot de passe : Ce champs doit être rempli')).toBeTruthy();
    expect(getByText('Courriel : Ce champs doit être rempli')).toBeTruthy();
  });
 

  it('handles successful sign-up', async () => {
  signUp.mockResolvedValue({ id: 1 }); // Mock successful sign-up response
    const { getByPlaceholderText, getByText } = render(
    <MockThemeProvider>
      <SignUp />
    </MockThemeProvider>);
    
    fireEvent.changeText(getByPlaceholderText('Entrez l\'identifiant'), 'Mike');
    fireEvent.changeText(getByPlaceholderText('Entrez votre courriel'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Entrez le mot de passe'), 'password123');
    
    fireEvent.press(getByText('Créez le compte'));
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('../1/profile');
    });
  });

  it('handles sign-up failure', async () => {
    signUp.mockRejectedValue(new Error('AxiosError: Request failed with status code 409')); // Mock sign-in failure
    const { getByPlaceholderText, getByText } = render(
    <MockThemeProvider>
      <SignUp />
    </MockThemeProvider>);
    
    fireEvent.changeText(getByPlaceholderText('Entrez l\'identifiant'), 'Mike');
    fireEvent.changeText(getByPlaceholderText('Entrez votre courriel'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Entrez le mot de passe'), 'password123');
    
    fireEvent.press(getByText('Créez le compte'));
    
    await waitFor(() => {
      expect(getByText('Email et/ou Identifiant déjà utilisé')).toBeTruthy();
    });
  });
});
