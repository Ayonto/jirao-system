import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, LoginCredentials, RegisterData } from '../types';
import { api } from '../services/api';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState & { loading: boolean; error: string | null }, action: AuthAction) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOGOUT':
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    default:
      return state;
  }
};

const initialState: AuthState & { loading: boolean; error: string | null } = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for stored auth data on app load
    const storedToken = localStorage.getItem('jirao_token');
    const storedUser = localStorage.getItem('jirao_user');
    
    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: storedToken } });
      } catch (error) {
        localStorage.removeItem('jirao_token');
        localStorage.removeItem('jirao_user');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const { user, token } = await api.login(credentials);
      
      localStorage.setItem('jirao_token', token);
      localStorage.setItem('jirao_user', JSON.stringify(user));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const { user, token } = await api.register(data);
      
      localStorage.setItem('jirao_token', token);
      localStorage.setItem('jirao_user', JSON.stringify(user));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Registration failed' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('jirao_token');
    localStorage.removeItem('jirao_user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};