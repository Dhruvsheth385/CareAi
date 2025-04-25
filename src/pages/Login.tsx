//Login.tsx
import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserRound, Lock, Heart } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login, error, isAuthenticated, clearError } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  
  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/');
    }
    
    // Clear any existing errors when component mounts
    clearError();
  }, [isAuthenticated, navigate, clearError]);
  
  const onSubmit = async (data: LoginFormData) => {
    await login(data.email, data.password);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="rounded-full bg-blue-100 p-4 shadow-inner">
          <Heart className="h-14 w-14 text-blue-600" />
        </div>
        <h1 className="mt-6 text-4xl font-bold text-center text-gray-800">CareAi</h1>
        <h2 className="mt-2 text-2xl font-medium text-center text-gray-600">Welcome Back</h2>
        <p className="mt-2 text-xl text-center text-gray-500">
          Please log in to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card variant="elevated" className="py-8 px-4 sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 text-lg">{error}</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-xl font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserRound className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  className={`pl-12 pr-4 py-4 block w-full text-xl rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="your-email@example.com"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-red-600 text-lg">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xl font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`pl-12 pr-4 py-4 block w-full text-xl rounded-lg border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Your password"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-blue-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="mt-2 text-red-600 text-lg">{errors.password.message}</p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-6 w-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-lg text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-lg">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                fullWidth 
                size="lg" 
                className="text-xl py-4"
              >
                Log in
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-lg">
                <span className="px-2 bg-white text-gray-500">
                  New to CareAi?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/register">
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  size="lg"
                  className="text-xl py-4"
                >
                  Create an account
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;