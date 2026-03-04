'use client';

import { useState } from 'react';
import Link from 'next/link';
import { account } from '@/lib/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // This sends a password reset email via Appwrite
      const resetUrl = `${window.location.origin}/reset-password`;
      await account.createRecovery(email, resetUrl);
      setSent(true);
    } catch (err: any) {
      // Don't reveal if email exists or not (security)
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-[#1ed760]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-[#1ed760]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
        <p className="text-[#999] mb-8">
          If an account exists for <span className="text-white">{email}</span>, 
          we&apos;ve sent a password reset link.
        </p>
        <Link 
          href="/login" 
          className="text-[#1ed760] hover:underline font-medium"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-2">Reset password</h1>
      <p className="text-[#999] mb-8">Enter your email and we&apos;ll send you a reset link</p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#999] mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-[#1ed760] transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#1ed760] text-[#0d0d0d] font-bold rounded-lg hover:bg-[#1ab854] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <p className="text-center text-[#666] mt-6 text-sm">
        Remember your password?{' '}
        <Link href="/login" className="text-[#1ed760] hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </>
  );
}
