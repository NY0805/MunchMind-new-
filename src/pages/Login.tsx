import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ChefHat } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!password.trim()) {
      setError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!isLogin && !name.trim()) {
      setError('Name is required for registration');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const createUserProfile = async (userId: string, userName: string) => {
    try {
      const { error: profileError } = await supabase.from('profiles').insert({
        user_id: userId,
        name: userName.trim(),
        diet_type: 'flexitarian',
        allergies: ['peanuts'],
        dislikes: ['mushrooms', 'olives'],
      });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Don't throw error, just log it - profile creation failure shouldn't block login
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      // Don't throw error, just log it
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    try {
      // Trim email to remove any leading/trailing whitespace
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });

        if (error) throw error;

        if (data.user) {
          // Store session based on Remember Me preference
          const sessionDuration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : null; // 30 days or session only
          
          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('user_id', data.user.id);
            localStorage.setItem('session_token', data.session?.access_token || '');
            localStorage.setItem('session_expires', (Date.now() + sessionDuration!).toString());
            localStorage.setItem('userRegistrationDate', data.user.created_at);
          } else {
            localStorage.setItem('rememberMe', 'false');
            sessionStorage.setItem('user_id', data.user.id);
            sessionStorage.setItem('session_token', data.session?.access_token || '');
            sessionStorage.setItem('userRegistrationDate', data.user.created_at);
          }
          
          // Initialize RevenueCat with user ID
          if (window.Purchases) {
            try {
              await window.Purchases.identify(data.user.id);
              console.log('✅ RevenueCat user identified:', data.user.id);
            } catch (rcError) {
              console.error('❌ Failed to identify user with RevenueCat:', rcError);
            }
          }
          
          navigate('/home');
        }
      } else {
        // Registration with email confirmation DISABLED
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: trimmedPassword,
          options: {
            data: {
              name: name.trim(),
            },
            // Disable email confirmation by not setting emailRedirectTo
            emailRedirectTo: undefined
          }
        });

        if (error) throw error;

        if (data.user) {
          // Create profile immediately after registration
          await createUserProfile(data.user.id, name.trim());

          // Store session based on Remember Me preference
          const sessionDuration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : null; // 30 days or session only
          
          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('user_id', data.user.id);
            localStorage.setItem('session_token', data.session?.access_token || '');
            localStorage.setItem('session_expires', (Date.now() + sessionDuration!).toString());
            localStorage.setItem('userRegistrationDate', data.user.created_at);
          } else {
            localStorage.setItem('rememberMe', 'false');
            sessionStorage.setItem('user_id', data.user.id);
            sessionStorage.setItem('session_token', data.session?.access_token || '');
            sessionStorage.setItem('userRegistrationDate', data.user.created_at);
          }

          // Initialize RevenueCat with user ID
          if (window.Purchases) {
            try {
              await window.Purchases.identify(data.user.id);
              console.log('✅ RevenueCat user identified:', data.user.id);
            } catch (rcError) {
              console.error('❌ Failed to identify user with RevenueCat:', rcError);
            }
          }

          // Auto-login after registration (no email confirmation needed)
          navigate('/home');
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // Handle specific Supabase errors
      if (error.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
        // Auto-switch to register tab if login fails
        if (isLogin) {
          setTimeout(() => {
            setIsLogin(false);
            setError('Account not found. Please register a new account.');
          }, 2000);
        }
      } else if (error.message?.includes('User already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
        setIsLogin(true);
      } else if (error.message?.includes('Email not confirmed')) {
        // This should not happen anymore, but handle it gracefully
        setError('There was an issue with your account. Please try registering again.');
        setIsLogin(false);
      } else {
        setError(error.message || 'An error occurred during authentication');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    // Clear any existing sessions
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('user_id');
    localStorage.removeItem('session_token');
    localStorage.removeItem('session_expires');
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('session_token');
    sessionStorage.removeItem('userRegistrationDate');
    
    // Reset RevenueCat if available
    if (window.Purchases) {
      window.Purchases.logOut()
        .then(() => console.log('✅ RevenueCat logged out for guest access'))
        .catch(error => console.error('❌ Failed to log out from RevenueCat for guest access:', error));
    }
    
    navigate('/home');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      theme === 'synesthesia' 
        ? 'bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100' 
        : theme === 'dark' 
          ? 'bg-gray-900' 
          : 'bg-gray-50'
    }`}>
      <div className="w-full max-w-md p-6">
        <div className={`rounded-2xl shadow-xl overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* Header */}
          <div className={`p-8 text-center ${
            theme === 'synesthesia'
              ? 'bg-gradient-to-br from-purple-500 to-pink-500'
              : 'bg-gradient-to-br from-orange-500 to-amber-500'
          } text-white`}>
            <ChefHat size={48} className="mx-auto mb-4" />
            <h1 className="text-2xl font-bold">MunchMind</h1>
            <p className="text-white/90 text-sm">Your AI Food Decision Assistant</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <div className="flex mb-6">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
                className={`flex-1 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                  isLogin
                    ? theme === 'synesthesia'
                      ? 'bg-purple-500 text-white'
                      : 'bg-orange-500 text-white'
                    : theme === 'dark'
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-100 text-gray-600'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
                className={`flex-1 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                  !isLogin
                    ? theme === 'synesthesia'
                      ? 'bg-purple-500 text-white'
                      : 'bg-orange-500 text-white'
                    : theme === 'dark'
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-100 text-gray-600'
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User size={18} className={`absolute left-3 top-3 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'bg-gray-50 text-gray-800 border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-orange-400`}
                  />
                </div>
              )}

              <div className="relative">
                <Mail size={18} className={`absolute left-3 top-3 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-gray-50 text-gray-800 border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-orange-400`}
                />
              </div>

              <div className="relative">
                <Lock size={18} className={`absolute left-3 top-3 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-gray-50 text-gray-800 border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-orange-400`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-3 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={`mr-2 rounded ${
                    theme === 'synesthesia'
                      ? 'text-purple-500 focus:ring-purple-400'
                      : 'text-orange-500 focus:ring-orange-400'
                  }`}
                />
                <label 
                  htmlFor="rememberMe" 
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Remember Me (30 days)
                </label>
              </div>

              {error && (
                <div className={`p-3 rounded-lg text-sm ${
                  error.includes('successful') 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  isLoading
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : theme === 'synesthesia'
                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                {isLoading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={handleGuestAccess}
                className={`text-sm ${
                  theme === 'synesthesia' ? 'text-purple-600' : 'text-orange-600'
                } hover:underline`}
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;