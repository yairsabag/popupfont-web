'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { account, databases, ID } from '@/lib/client';
import { Permission, Role } from 'appwrite';
import { APPWRITE_CONFIG } from '@/lib/config';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref'); // referral code from URL

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Generate referral code
  function generateRefCode() {
    return Math.random().toString(36).substring(2, 10);
  }

  // Generate license key: FPOP-XXXX-XXXX-XXXX
  function generateLicenseKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `FPOP-${segment()}-${segment()}-${segment()}`;
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Create Appwrite account
      const newUser = await account.create(ID.unique(), email, password, name);

      // 2. Log in immediately
      await account.createEmailPasswordSession(email, password);

      const { collections, databaseId } = APPWRITE_CONFIG;
      const now = new Date().toISOString();
      const trialEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      // 3. Create profile document
      await databases.createDocument(databaseId, collections.profiles, ID.unique(), {
        user_id: newUser.$id,
        email: email,
        full_name: name,
        avatar_url: '',
        referral_code: generateRefCode(),
        referred_by: refCode || '',
      }, [
        Permission.read(Role.user(newUser.$id)),
        Permission.update(Role.user(newUser.$id)),
      ]);

      // 4. Create trial subscription
      await databases.createDocument(databaseId, collections.subscriptions, ID.unique(), {
        user_id: newUser.$id,
        plan: 'trial',
        status: 'trialing',
        max_devices: 1,
        trial_starts_at: now,
        trial_ends_at: trialEnd,
      }, [
        Permission.read(Role.user(newUser.$id)),
      ]);

      // 5. Create license key
      await databases.createDocument(databaseId, collections.licenses, ID.unique(), {
        user_id: newUser.$id,
        license_key: generateLicenseKey(),
        is_active: true,
      }, [
        Permission.read(Role.user(newUser.$id)),
      ]);

      // 6. If referred, create referral record
      if (refCode) {
        try {
          const refResult = await databases.listDocuments(databaseId, collections.profiles, [
            `equal("referral_code", "${refCode}")`,
          ]);
          if (refResult.documents.length > 0) {
            await databases.createDocument(databaseId, collections.referrals, ID.unique(), {
              referrer_id: refResult.documents[0].user_id,
              referred_id: newUser.$id,
              payments_count: 0,
              reward_months_earned: 0,
            });
          }
        } catch {
          // Referral tracking failed — not critical
        }
      }

      router.push('/account');
    } catch (err: any) {
      if (err.code === 409) {
        setError('An account with this email already exists');
      } else if (err.message?.includes('password')) {
        setError('Password must be at least 8 characters');
      } else {
        setError(err.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-2">Start your free trial</h1>
      <p className="text-[#999] mb-8">30 days free — no credit card required</p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#999] mb-2">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="John Doe"
            className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-[#1ed760] transition"
          />
        </div>

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

        <div>
          <label className="block text-sm font-medium text-[#999] mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="Min. 8 characters"
            className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-[#1ed760] transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#1ed760] text-[#0d0d0d] font-bold rounded-lg hover:bg-[#1ab854] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating account...
            </span>
          ) : (
            'Create Account & Start Trial'
          )}
        </button>
      </form>

      <p className="text-center text-[#666] mt-6 text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-[#1ed760] hover:underline font-medium">
          Sign in
        </Link>
      </p>

      {refCode && (
        <p className="text-center text-[#1ed760]/60 mt-3 text-xs">
          Referred by: {refCode}
        </p>
      )}
    </>
  );
}
