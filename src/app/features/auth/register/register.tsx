import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../../core/services/auth.service';
import type { RegisterRequest } from '../../../core/models/register-request';

export function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const passwordsMatch = password === confirmPassword;
  const isInvalid = (field: string) => {
    if (field === 'firstName') return !firstName;
    if (field === 'lastName') return !lastName;
    if (field === 'email') return !email;
    if (field === 'password') return password.length < 6;
    if (field === 'confirmPassword') return confirmPassword !== password;
    if (field === 'acceptTerms') return !acceptTerms;
    return false;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || password.length < 6 || !passwordsMatch || !acceptTerms) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const request: RegisterRequest = { firstName, lastName, email, password, confirmPassword };
      await authService.register(request);
      navigate('/');
    } catch (error: any) {
      setErrorMessage(error?.error?.message || 'Unable to create your account. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Join Finder for premium shopping</p>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input-field"
              placeholder="John"
            />
            {isInvalid('firstName') && (
              <p className="mt-1 text-sm text-red-600">First name is required.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input-field"
              placeholder="Doe"
            />
            {isInvalid('lastName') && (
              <p className="mt-1 text-sm text-red-600">Last name is required.</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="you@example.com"
          />
          {isInvalid('email') && (
            <p className="mt-1 text-sm text-red-600">Enter a valid email address.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="••••••••"
          />
          {isInvalid('password') && (
            <p className="mt-1 text-sm text-red-600">Password must be at least 6 characters.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
            placeholder="••••••••"
          />
          {(isInvalid('confirmPassword') || !passwordsMatch) && (
            <p className="mt-1 text-sm text-red-600">Passwords must match.</p>
          )}
        </div>

        <label className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span>
            I agree to the <a href="#" className="text-primary-600 hover:text-primary-700">Terms of Service</a> and <a href="#" className="text-primary-600 hover:text-primary-700">Privacy Policy</a>
          </span>
        </label>
        {isInvalid('acceptTerms') && (
          <p className="text-sm text-red-600">You must accept the terms to continue.</p>
        )}

        <button
          type="submit"
          disabled={!firstName || !lastName || !email || password.length < 6 || !passwordsMatch || !acceptTerms || isLoading}
          className="btn-primary w-full py-3 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </button>

        {errorMessage && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {errorMessage}
          </div>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?
        <Link to="/account/login" className="text-primary-600 hover:text-primary-700 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
