import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Music, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle,
  AlertCircle,
  Music2,
  Headphones,
  Mic
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { RegisterForm, UserRole, ExperienceLevel } from '../types';
import { validateEmail, validatePassword, validateUsername, getErrorMessage } from '../utils/helpers';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState<RegisterForm>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    role: UserRole.MUSICIAN,
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const roles = [
    { value: UserRole.MUSICIAN, label: 'Musician', icon: Music, description: 'Create and perform music' },
    { value: UserRole.PRODUCER, label: 'Producer', icon: Headphones, description: 'Produce and mix tracks' },
    { value: UserRole.COMPOSER, label: 'Composer', icon: Mic, description: 'Compose and arrange music' },
    { value: UserRole.DJ, label: 'DJ', icon: Music2, description: 'Mix and perform sets' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (error) {
      setError('');
    }
  };

  const validateStep1 = () => {
    if (!formData.email) {
      setError('Please enter your email address');
      return false;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.username) {
      setError('Please enter a username');
      return false;
    }

    if (!validateUsername(formData.username)) {
      setError('Username must be 3-20 characters with letters, numbers and underscores only');
      return false;
    }

    if (!formData.displayName) {
      setError('Please enter your display name');
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!formData.password) {
      setError('Please enter a password');
      return false;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, number and special character');
      return false;
    }

    if (!formData.confirmPassword) {
      setError('Please confirm your password');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!formData.acceptTerms) {
      setError('Please accept the terms of service and privacy policy');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateStep2()) {
      return;
    }

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage('INVALID_EMAIL'));
    }
  };

  const getPasswordRequirements = () => {
    const requirements = [
      { regex: /.{8,}/, text: 'At least 8 characters', met: formData.password.length >= 8 },
      { regex: /[A-Z]/, text: 'One uppercase letter', met: /[A-Z]/.test(formData.password) },
      { regex: /[a-z]/, text: 'One lowercase letter', met: /[a-z]/.test(formData.password) },
      { regex: /\d/, text: 'One number', met: /\d/.test(formData.password) },
      { regex: /[@$!%*?&]/, text: 'One special character', met: /[@$!%*?&]/.test(formData.password) },
    ];

    return requirements;
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
            Join the
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              {' '}Music Community
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-lg">
            Connect with musicians worldwide, collaborate on projects, and bring your musical ideas to life.
          </p>

          {/* Progress Indicator */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-purple-600' : 'bg-gray-700'}`}>
                <span className="text-sm font-medium text-white">1</span>
              </div>
              <div className={`h-1 w-16 rounded ${step >= 2 ? 'bg-purple-600' : 'bg-gray-700'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-purple-600' : 'bg-gray-700'}`}>
                <span className="text-sm font-medium text-white">2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Registration Form */}
        <div className="w-full max-w-md">
          <Card variant="glass" padding="xl" className="backdrop-blur-xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Create Your Account</h2>
              <p className="text-gray-400">
                {step === 1 ? 'Let\'s start with your basic information' : 'Set up your password to secure your account'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-600/10 border border-red-600/20 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <div className="space-y-6">
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
                    type="text"
                    name="username"
                    label="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Choose a username"
                    leftIcon={<User className="h-4 w-4" />}
                    helperText="This will be your unique identifier"
                    disabled={isLoading}
                  />

                  <Input
                    type="text"
                    name="displayName"
                    label="Display Name"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    placeholder="How should we call you?"
                    helperText="This is how other users will see you"
                    disabled={isLoading}
                  />

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      I am a...
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {roles.map((role) => {
                        const Icon = role.icon;
                        return (
                          <button
                            key={role.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, role: role.value as UserRole }))}
                            className={`p-3 border rounded-lg text-left transition-all duration-200 ${
                              formData.role === role.value
                                ? 'border-purple-600 bg-purple-600/10 text-purple-400'
                                : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                            }`}
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <Icon className="h-4 w-4" />
                              <span className="font-medium">{role.label}</span>
                            </div>
                            <p className="text-xs">{role.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleNext}
                    className="w-full"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Continue
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      label="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a strong password"
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

                    {/* Password Requirements */}
                    {formData.password && (
                      <div className="mt-2 space-y-1">
                        {getPasswordRequirements().map((req, index) => (
                          <div key={index} className="flex items-center space-x-2 text-xs">
                            {req.met ? (
                              <CheckCircle className="h-3 w-3 text-green-400" />
                            ) : (
                              <AlertCircle className="h-3 w-3 text-gray-500" />
                            )}
                            <span className={req.met ? 'text-green-400' : 'text-gray-500'}>
                              {req.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    label="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    leftIcon={<Lock className="h-4 w-4" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    }
                    disabled={isLoading}
                  />

                  {/* Terms and Privacy */}
                  <label className="flex items-start space-x-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className="mt-1 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-900"
                    />
                    <span>
                      I agree to the{' '}
                      <Link to="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleBack}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      loading={isLoading}
                      className="flex-1"
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      Create Account
                    </Button>
                  </div>
                </div>
              )}
            </form>

            <p className="mt-8 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;