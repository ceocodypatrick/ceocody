import React, { useState } from 'react';
import { Music, Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../types';
import { validateEmail, getErrorMessage } from '../utils/helpers';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!formData.password) {
      setError('Please enter your password');
      return;
    }

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage('INVALID_EMAIL'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center lg:text-left space-y-6">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Music className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">Harmoni</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Where Music
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              {' '}Comes Together
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-lg">
            Connect with musicians worldwide, collaborate on projects, and bring your musical ideas to life.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-8">
            {[
              { number: '10K+', label: 'Active Musicians' },
              { number: '5K+', label: 'Projects Created' },
              { number: '150+', label: 'Countries' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-purple-400">{stat.number}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full max-w-md">
          <Card variant="glass" padding="xl" className="backdrop-blur-xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400">Sign in to your account to continue</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-600/10 border border-red-600/20 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="email"
                name="email"
                label="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                leftIcon={<Mail className="h-4 w-4" />}
                disabled={isLoading}
              />

              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                }
                disabled={isLoading}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-900"
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                loading={isLoading}
                className="w-full"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-white"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-white"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  Facebook
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;