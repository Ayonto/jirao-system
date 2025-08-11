import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Loader, Home, Phone, CreditCard } from 'lucide-react';
import AdminLogin from '../Admin/AdminLogin';

// const LOGO_SIZE_PX = 150;

const AuthPage: React.FC = () => {
  const { login, register, loading, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'guest' as 'guest' | 'host',
    phone: '',
    nid_number: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register(formData);
      }
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'guest',
      phone: '',
      nid_number: ''
    });
  };

  const handleAdminLogin = (user: any, token: string) => {
    // Store admin auth data
    localStorage.setItem('jirao_token', token);
    localStorage.setItem('jirao_user', JSON.stringify(user));
    window.location.reload(); // Reload to trigger auth context update
  };

  if (showAdminLogin) {
    return (
      <AdminLogin 
        onLogin={handleAdminLogin}
        onBackToMain={() => setShowAdminLogin(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <img
            src="/logo.png"
            alt="JIRAO logo"
            className="block mx-auto mb-4 object-contain"
            style={{ width: 220, height: 80 }}
            loading="eager"
            decoding="async"
          />
          {/* <h2 className="text-3xl font-bold text-gray-900">JIRAO</h2> */}
          
          <p className="text-gray-600 mt-2">Your space rental marketplace</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h3>
            <p className="text-gray-600 mt-1">
              {isLogin ? 'Sign in to your account' : 'Join our rental community'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required={!isLogin}
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                  placeholder="Choose a username"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder={isLogin ? "Enter your email to sign in" : "Enter your email"}
              />
            </div>


            {!isLogin && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required={!isLogin}
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && formData.role === 'host' && (
              <div>
                <label htmlFor="nid_number" className="block text-sm font-medium text-gray-700 mb-1">
                  NID Card Number *
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="nid_number"
                    name="nid_number"
                    type="text"
                    required={formData.role === 'host'}
                    value={formData.nid_number}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your NID card number"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Required for host verification and approval process
                </p>
              </div>
            )}

            {!isLogin && (
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'guest' }))}
                    className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                      formData.role === 'guest'
                        ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span className="font-medium">Guest</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'host' }))}
                    className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                      formData.role === 'host'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors" */}
                    <span className="font-medium">Host</span>
                  </button>
                </div>
              </div>
            )}

            

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                </>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={switchMode}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
            <div className="mt-3">
              <button
                onClick={() => setShowAdminLogin(true)}
                className="text-cyan-600 hover:text-cyan-700 font-medium hover:underline text-sm"
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 text-center mb-2 font-medium">Demo Accounts (for testing)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
            <div className="bg-white rounded p-2">
              <p className="font-medium">Guest Account:</p>
              <p>Email: ratul@gmail.com</p>
              <p>Password: 1234</p>
            </div>
            <div className="bg-white rounded p-2">
              <p className="font-medium">Host Account:</p>
              <p>Email: mehedi12@gmail.com</p>
              <p>Password: 1234</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;