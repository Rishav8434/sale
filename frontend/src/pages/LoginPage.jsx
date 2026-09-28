import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Lock, Mail, Loader2, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

const loginSchema = yup.object().shape({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = new URLSearchParams(location.search).get('redirect') || '/';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setServerError('');
    setSubmitting(true);
    try {
      const user = await login(data.email, data.password);
      if (user.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate(from === '/' ? '/dashboard' : from);
      }
    } catch (err) {
      console.error(err);
      setServerError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = (role) => {
    if (role === 'admin') {
      setValue('email', 'admin@realnest.io');
      setValue('password', 'Password@123');
    } else {
      setValue('email', 'sophia@realnest.io');
      setValue('password', 'Password@123');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        
        {/* Card Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-stone-900 text-amber-300 items-center justify-center shadow-xl border border-stone-800">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-amber-700/80 mb-1">
              Private Client Portal
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-950 tracking-tight">
              Welcome to RealNest
            </h2>
          </div>
          <p className="text-sm text-stone-500 max-w-xs mx-auto">
            Sign in to manage your private portfolio, curated acquisitions, and exclusive listings.
          </p>
        </div>

        {/* Form Container */}
        <div className="luxury-card p-8 sm:p-10 space-y-6">
          
          {serverError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-800">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2">
                Client Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="sophia@realnest.io"
                  {...register('email')}
                  className={`w-full pl-10 pr-4 py-3 bg-stone-50/80 rounded-xl border text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all ${
                    errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Master Password
                </label>
                <span className="text-[11px] text-stone-400 hover:text-stone-700 cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full pl-10 pr-4 py-3 bg-stone-50/80 rounded-xl border text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all ${
                    errors.password ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-stone-900/20 hover:scale-[1.01] transition-all disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  Authenticating Client...
                </>
              ) : (
                <>
                  Enter Private Portal
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Buttons */}
          <div className="pt-5 border-t border-stone-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                Quick Demo Access
              </span>
              <span className="text-[10px] text-amber-700 font-bold uppercase">1-Click Fill</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleFillDemo('customer')}
                className="py-2.5 px-3 rounded-xl border border-stone-200 bg-stone-50/80 hover:bg-stone-100 text-xs font-semibold text-stone-800 flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-stone-700" />
                Demo Client
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('admin')}
                className="py-2.5 px-3 rounded-xl border border-amber-200/80 bg-amber-50/60 hover:bg-amber-100/70 text-xs font-semibold text-amber-900 flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                Demo Admin
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-stone-500 pt-2">
            New to RealNest Private Registry?{' '}
            <Link to="/register" className="font-bold text-stone-900 hover:text-amber-800 underline decoration-amber-500/50 underline-offset-4">
              Apply for membership
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;
