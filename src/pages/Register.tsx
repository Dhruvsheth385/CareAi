//Register.tsx
import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Heart, UserRound, Mail, Lock, Phone, MapPin } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: number;
  interests: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

const Register: React.FC = () => {
  const { register: registerUser, error, isAuthenticated, clearError } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, formState: { errors }, getValues } = useForm<RegisterFormData>();
  
  useEffect(() => {
    // Clear any existing errors when component mounts
    clearError();
  }, [clearError]);

  // Watch for authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormData) => {
    const interestsArray = data.interests.split(',').map(interest => interest.trim());
    
    const userData = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      age: data.age,
      interests: interestsArray,
      address: data.address
    };
    
    try {
      await registerUser(userData);
      // Navigation will be handled by the useEffect above when isAuthenticated changes
    } catch (err) {
      console.error('Registration error:', err);
    }
  };
  
  const nextStep = () => {
    const values = getValues();
    if (step === 1) {
      if (!values.fullName || !values.email || !values.password || !values.confirmPassword || password !== values.confirmPassword) {
        return;
      }
    }
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="rounded-full bg-blue-100 p-4 shadow-inner">
          <Heart className="h-14 w-14 text-blue-600" />
        </div>
        <h1 className="mt-6 text-4xl font-bold text-center text-gray-800">CompanionCare</h1>
        <h2 className="mt-2 text-2xl font-medium text-center text-gray-600">Create New Account</h2>
        <p className="mt-2 text-xl text-center text-gray-500">
          Join our community to overcome loneliness
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <Card variant="elevated" className="py-8 px-4 sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 text-lg">{error}</p>
            </div>
          )}
          
          <div className="mb-8">
            <div className="relative">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                <div 
                  style={{ width: `${step * 50}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500 ease-in-out"
                ></div>
              </div>
              <div className="flex justify-between mt-2">
                <div className={`text-lg ${step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>Basic Info</div>
                <div className={`text-lg ${step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>Personal Details</div>
              </div>
            </div>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <>
                <div>
                  <label htmlFor="fullName" className="block text-xl font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserRound className="h-6 w-6 text-gray-400" />
                    </div>
                    <input
                      id="fullName"
                      type="text"
                      className={`pl-12 pr-4 py-4 block w-full text-xl rounded-lg border ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="John Doe"
                      {...register('fullName', { 
                        required: 'Full name is required'
                      })}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-2 text-red-600 text-lg">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xl font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-6 w-6 text-gray-400" />
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
                      placeholder="Create a password"
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

                <div>
                  <label htmlFor="confirmPassword" className="block text-xl font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-6 w-6 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      className={`pl-12 pr-4 py-4 block w-full text-xl rounded-lg border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Confirm your password"
                      {...register('confirmPassword', { 
                        required: 'Please confirm your password',
                        validate: value => value === password || 'Passwords do not match'
                      })}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-red-600 text-lg">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label htmlFor="age" className="block text-xl font-medium text-gray-700">
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    className={`mt-1 py-4 px-4 block w-full text-xl rounded-lg border ${
                      errors.age ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    min="60"
                    {...register('age', { 
                      required: 'Age is required',
                      min: {
                        value: 60,
                        message: 'Age must be at least 60'
                      },
                      valueAsNumber: true
                    })}
                  />
                  {errors.age && (
                    <p className="mt-2 text-red-600 text-lg">{errors.age.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="interests" className="block text-xl font-medium text-gray-700">
                    Interests (comma separated)
                  </label>
                  <textarea
                    id="interests"
                    className={`mt-1 py-4 px-4 block w-full text-xl rounded-lg border ${
                      errors.interests ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Reading, Gardening, Walking, etc."
                    rows={3}
                    {...register('interests', { 
                      required: 'Please enter at least one interest'
                    })}
                  />
                  {errors.interests && (
                    <p className="mt-2 text-red-600 text-lg">{errors.interests.message}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="block text-xl font-medium text-gray-700">
                    Address
                  </label>
                  
                  <div>
                    <label htmlFor="street" className="block text-lg font-medium text-gray-700">
                      Street Address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="street"
                        type="text"
                        className="pl-12 pr-4 py-3 block w-full text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="123 Main St"
                        {...register('address.street')}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-lg font-medium text-gray-700">
                        City
                      </label>
                      <input
                        id="city"
                        type="text"
                        className="mt-1 py-3 px-4 block w-full text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="City"
                        {...register('address.city')}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-lg font-medium text-gray-700">
                        State
                      </label>
                      <input
                        id="state"
                        type="text"
                        className="mt-1 py-3 px-4 block w-full text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="State"
                        {...register('address.state')}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="zipCode" className="block text-lg font-medium text-gray-700">
                      Zip Code
                    </label>
                    <input
                      id="zipCode"
                      type="text"
                      className="mt-1 py-3 px-4 block w-full text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Zip Code"
                      {...register('address.zipCode')}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between space-x-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={prevStep}
                  size="lg"
                  className="text-xl w-1/2"
                >
                  Back
                </Button>
              )}
              
              {step < 2 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  size="lg"
                  className={`text-xl ${step > 1 ? 'w-1/2' : 'w-full'}`}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="lg"
                  className="text-xl w-1/2"
                >
                  Register
                </Button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-lg text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;