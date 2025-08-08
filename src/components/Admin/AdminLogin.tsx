import React, { useState } from 'react';
import { api } from '../../services/api';
import { Eye, EyeOff, Loader, Shield } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (user: any, token: string) => void;
  onBackToMain: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBackToMain }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { user, token } = await api.adminLogin(formData);
      onLogin(user, token);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Portal</h2>
          <p className="text-gray-600 mt-2">JIRAO Administration</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900">Admin Login</h3>
            <p className="text-gray-600 mt-1">Access the administration dashboard</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter admin username"
              />
            </div>

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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Admin Login</span>
              )}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-gray-200">
            <button
              onClick={onBackToMain}
              className="text-gray-600 hover:text-gray-700 font-medium hover:underline"
            >
              Back to Main Login
            </button>
          </div>
        </div>

        {/* Demo Account */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 text-center mb-2 font-medium">Demo Admin Account</p>
          <div className="bg-white rounded p-2 text-xs text-gray-700 text-center">
            <p className="font-medium">Username: admin_user</p>
            <p>Password: any</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;