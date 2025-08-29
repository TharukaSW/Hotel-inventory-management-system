import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  setIsSubmitting(true);
    setError('');

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message || 'Invalid email or password');
      } // redirect handled in useEffect
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect user to their role-specific dashboard after successful login
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      const route = (() => {
        switch (user.role) {
          case 'ADMIN':
          case 'STOCK_MANAGER':
            return '/admin';
          case 'FRONT_DESK':
            return '/frontdesk';
          case 'INSPECTOR':
            return '/inspector';
          default:
            return '/';
        }
      })();
      navigate(route, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex">
      {/* Left brand / illustration panel (hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-600" />
        <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 25% 25%, rgba(255,255,255,.35) 0, transparent 60%)'}} />
        <div className="relative z-10 flex flex-col justify-between p-10 text-indigo-50 w-full">
          <div>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center font-bold text-lg">HI</div>
              <span className="text-xl font-semibold tracking-wide">Hotel Inventory</span>
            </div>
            <h1 className="mt-14 text-4xl leading-tight font-bold max-w-md">
              Smart, Centralized <span className="text-white">Inventory Control</span>
            </h1>
            <p className="mt-6 text-indigo-100 max-w-md leading-relaxed text-sm">
              Streamline stock tracking, inspections, requests, and approvals across your hotel operation with a unified platform.
            </p>
          </div>
          <div className="text-[11px] tracking-wide uppercase opacity-70">© {new Date().getFullYear()} Hotel Inventory Suite</div>
        </div>
      </div>

      {/* Right auth panel */}
      <div className="flex-1 flex items-center justify-center py-12 px-6 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:mb-12">
            <div className="flex items-center lg:hidden justify-center mb-6">
              <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg shadow-indigo-600/30">HI</div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center">Sign in</h2>
            <p className="mt-2 text-center text-sm text-gray-600">Access your dashboard</p>
          </div>

            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="space-y-5">
                <div className="group">
                  <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wide text-gray-600 mb-1">Email</label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="peer w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                    />
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 peer-focus:hidden peer-valid:hidden">email@domain.com</span>
                  </div>
                </div>
                <div className="group">
                  <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wide text-gray-600 mb-1">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      className="peer w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition pr-10"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword(s => !s)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.5a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .638C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700 flex items-start space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-indigo-600 hover:text-indigo-500 font-medium">Forgot password?</button>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-600/30 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {isSubmitting && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </form>

            <div className="mt-10 text-[10px] text-center tracking-wide text-gray-400">
              Protected Hotel Operations Portal
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
