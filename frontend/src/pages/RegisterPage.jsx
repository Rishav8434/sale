import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, User, Mail, Lock, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';

const registerSchema = yup.object().shape({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: yup.string().oneOf(['ROLE_CUSTOMER', 'ROLE_ADMIN']).default('ROLE_CUSTOMER'),
});

const RegisterPage = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      role: 'ROLE_CUSTOMER',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setServerError('');
    setSubmitting(true);
    try {
      const user = await registerAuth(data);
      if (user.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setServerError(err.response?.data?.message || 'Registration failed. Email may already be in use.');
    } finally {
      setSubmitting(false);
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
              Private Registry Membership
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-950 tracking-tight">
              Create Your Account
            </h2>
          </div>
          <p className="text-sm text-stone-500 max-w-xs mx-auto">
            Join the premier architectural property collective. Acquire, lease, or list world-class residences.
          </p>
        </div>

        {/* Form Container */}
        <div className="luxury-card p-8 sm:p-10 space-y-6">
          
          {serverError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-800">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Sophia Kensington"
                  {...register('name')}
                  className={`w-full pl-10 pr-4 py-3 bg-stone-50/80 rounded-xl border text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all ${
                    errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2">
                Email Address
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
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2">
                Secure Password
              </label>
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
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2">
                Select Client Standing
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`p-3.5 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                    selectedRole === 'ROLE_CUSTOMER'
                      ? 'border-stone-900 bg-stone-900 text-stone-100 font-bold shadow-md'
                      : 'border-stone-200 bg-stone-50/70 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <input
                    type="radio"
                    value="ROLE_CUSTOMER"
                    {...register('role')}
                    className="sr-only"
                  />
                  <span className="text-xs font-semibold">Private Client</span>
                  <span className={`text-[10px] mt-0.5 ${selectedRole === 'ROLE_CUSTOMER' ? 'text-amber-300' : 'text-stone-400'}`}>
                    List & Acquire
                  </span>
                </label>

                <label
                  className={`p-3.5 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                    selectedRole === 'ROLE_ADMIN'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-md'
                      : 'border-stone-200 bg-stone-50/70 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <input
                    type="radio"
                    value="ROLE_ADMIN"
                    {...register('role')}
                    className="sr-only"
                  />
                  <span className="text-xs flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    Broker / Partner
                  </span>
                  <span className="text-[10px] text-amber-700/80 mt-0.5">Admin & Curation</span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3.5 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-stone-900/20 hover:scale-[1.01] transition-all disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  Creating Registry Account...
                </>
              ) : (
                <>
                  Register Membership
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
            Already hold a RealNest membership?{' '}
            <Link to="/login" className="font-bold text-stone-900 hover:text-amber-800 underline decoration-amber-500/50 underline-offset-4">
              Access portal
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
