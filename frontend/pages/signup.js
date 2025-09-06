import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { loginStart, loginSuccess, loginFailure } from '../utils/slices/authSlice';

// Mock signup function for the prototype
const mockSignup = (name, email, password, userType) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // For demo purposes, accept any email with a valid format and password length > 5
      if (email.includes('@') && password.length > 5) {
        resolve({
          id: '123456',
          name,
          email,
          type: userType,
          avatar: null
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000); // Simulate network delay
  });
};

const Signup = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'listener',
    agreeTerms: false
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.includes('@')) {
      errors.email = 'Valid email is required';
    }
    
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeTerms) {
      errors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      dispatch(loginStart());
      
      // In a real app, this would be an API call
      const user = await mockSignup(
        formData.name,
        formData.email,
        formData.password,
        formData.userType
      );
      
      dispatch(loginSuccess(user));
      
      // Redirect based on user type
      if (user.type === 'artist') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    } catch (err) {
      dispatch(loginFailure(err.message));
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Sign Up | HARMONI</title>
        <meta name="description" content="Create your HARMONI account" />
      </Head>
      
      <div className="flex justify-center items-center mb-8">
        <div className="w-10 h-10 bg-secondary rounded-lg"></div>
        <h1 className="ml-2 text-2xl font-bold text-primary">HARMONI</h1>
      </div>
      
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-medium">
        <h2 className="text-2xl font-bold text-center mb-6">Create your account</h2>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
              className={`input ${formErrors.name ? 'border-red-500' : ''}`}
              placeholder="Enter your name"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`input ${formErrors.email ? 'border-red-500' : ''}`}
              placeholder="Enter your email"
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`input ${formErrors.password ? 'border-red-500' : ''}`}
              placeholder="Create a password"
            />
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`input ${formErrors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="Confirm your password"
            />
            {formErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a:
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="listener"
                  checked={formData.userType === 'listener'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Listener</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="artist"
                  checked={formData.userType === 'artist'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Artist</span>
              </label>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="flex items-start">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className={`h-4 w-4 mt-1 text-primary focus:ring-primary border-gray-300 rounded ${
                  formErrors.agreeTerms ? 'border-red-500' : ''
                }`}
              />
              <span className="ml-2 text-sm text-gray-700">
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:text-primary-dark">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary hover:text-primary-dark">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {formErrors.agreeTerms && (
              <p className="mt-1 text-sm text-red-600">{formErrors.agreeTerms}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full btn btn-primary py-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:text-primary-dark font-medium">
              Log in
            </Link>
          </p>
        </div>
        
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <span className="sr-only">Sign up with Google</span>
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
              </svg>
            </button>
            
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <span className="sr-only">Sign up with Apple</span>
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.152,6.896c-0.948,0-2.415-1.078-3.96-1.04c-2.04,0.027-3.913,1.183-4.962,3.007c-2.12,3.675-0.54,9.127,1.519,12.122c1.013,1.454,2.208,3.09,3.792,3.039c1.52-0.065,2.09-0.987,3.935-0.987c1.831,0,2.35,0.987,3.96,0.948c1.637-0.026,2.676-1.48,3.676-2.948c1.156-1.688,1.636-3.325,1.662-3.415c-0.035-0.013-3.182-1.258-3.22-4.921c-0.026-3.078,2.506-4.547,2.623-4.623c-1.454-2.091-3.688-2.325-4.48-2.376C15.2,5.658,13.211,6.896,12.152,6.896z M15.629,3.809c0.837-1.013,1.403-2.427,1.247-3.83c-1.207,0.052-2.662,0.805-3.532,1.818c-0.78,0.896-1.454,2.338-1.273,3.714C13.445,5.587,14.779,4.822,15.629,3.809z"/>
              </svg>
            </button>
            
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <span className="sr-only">Sign up with Facebook</span>
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;