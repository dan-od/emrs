import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { authService } from '../services/authService';
import { useUiStore } from '@/store/uiStore';

const notify = (type, message) => useUiStore.getState().addNotification({ type, message });

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const storeLogin = useAuthStore(s => s.login);
  const storeLogout = useAuthStore(s => s.logout);
  const refreshToken = useAuthStore(s => s.refreshToken);

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      // Backend returns { success, data: { user, token, refreshToken } }
      const { user, token, refreshToken } = response.data || response;
      storeLogin(user, token, refreshToken);
      
      const displayName = user.first_name || user.name || 'User';
      notify('success', `Welcome back, ${displayName}!`);
      
      // Redirect to intended page or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
      
      return response;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      notify('error', message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout(refreshToken);
    } catch (err) {
      // Ignore logout errors — client-side state is cleared regardless
    } finally {
      storeLogout();
      navigate('/login', { replace: true });
      notify('success', 'Logged out successfully');
    }
  };

  const forgotPassword = async (email) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.forgotPassword(email);
      notify('success', 'Password reset instructions sent to your email');
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to send reset email';
      setError(message);
      notify('error', message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token, password) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.resetPassword(token, password);
      notify('success', 'Password reset successfully. Please login.');
      navigate('/login', { replace: true });
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to reset password';
      setError(message);
      notify('error', message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    logout,
    forgotPassword,
    resetPassword,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};