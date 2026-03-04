'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { databases } from '@/lib/client';
import { APPWRITE_CONFIG } from '@/lib/config';
import { Query } from 'appwrite';

type Tab = 'profile' | 'invoices' | 'referrals';

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: userLoading, logout } = useUser();
  const [tab, setTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [license, setLicense] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && !user) router.push('/login');
  }, [user, userLoading, router]);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  async function loadData() {
    if (!user) return;
    const { databaseId, collections } = APPWRITE_CONFIG;
    try {
      const [profileRes, subRes, devRes, licRes] = await Promise.all([
        databases.listDocuments(databaseId, collections.profiles, [Query.equal('user_id', user.$id)]),
        databases.listDocuments(databaseId, collections.subscriptions, [Query.equal('user_id', user.$id), Query.orderDesc('$createdAt'), Query.limit(1)]),
        databases.listDocuments(databaseId, collections.devices, [Query.equal('user_id', user.$id)]),
        databases.listDocuments(databaseId, collections.licenses, [Query.equal('user_id', user.$id)]),
      ]);
      if (profileRes.documents.length) setProfile(profileRes.documents[0]);
      if (subRes.documents.length) setSubscription(subRes.documents[0]);
      setDevices(devRes.documents);
      if (licRes.documents.length) setLicense(licRes.documents[0]);
    } catch (err) { console.error('Load error:', err); }
    finally { setLoading(false); }
  }

  const handleLogout = async () => { await logout(); router.push('/'); };

  if (userLoading) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-[#1ed760] border-t-transparent rounded-full" />
    </div>
  );

  const planLabel = subscription?.plan === 'trial' ? 'Free Trial' : subscription?.plan === 'basic' ? 'Basic' : subscription?.plan === 'pro' ? 'Pro' : 'No Plan';
  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing';
  const expiresAt = subscription?.status === 'trialing' ? subscription?.trial_ends_at : subscription?.current_period_end;

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* Nav */}
      <nav className="border-b border-[#2a2a2a] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1ed760] rounded-lg flex items-center justify-center text-[#0d0d0d] font-black text-sm">Fp</div>
          <span className="text-white font-bold text-lg">FontPop</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#999] text-sm">{user?.name || user?.email}</span>
          <button onClick={handleLogout} className="text-sm text-[#666] hover:text-white transition">Sign Out</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex border border-[#2a2a2a] rounded-xl overflow-hidden mb-10">
          {(['profile', 'invoices', 'referrals'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-4 text-center font-semibold transition capitalize ${tab === t ? 'bg-[#1a1a1a] text-white border border-[#1ed760] rounded-xl -m-[1px]' : 'text-[#666] hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* PROFILE */}
        {tab === 'profile' && (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#1ed760] rounded-full flex items-center justify-center text-[#0d0d0d] font-black text-xl">
                {(profile?.full_name || user?.name || 'U')[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">{profile?.full_name || user?.name}</h2>
                <p className="text-[#666] text-sm">{profile?.email || user?.email}</p>
              </div>
            </div>

            {/* Plan */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">Current plan</h3>
                <div className="flex gap-3">
                  {subscription?.plan !== 'pro' && (
                    <button className="px-4 py-2 bg-[#1ed760] text-[#0d0d0d] text-sm font-bold rounded-lg hover:bg-[#1ab854] transition">Upgrade to Pro</button>
                  )}
                  {isActive && subscription?.plan !== 'trial' && (
                    <button className="px-4 py-2 border border-[#2a2a2a] text-[#999] text-sm font-medium rounded-lg hover:border-[#666] transition">Cancel Subscription</button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
                  <p className="text-[#666] text-xs font-semibold tracking-wider uppercase mb-2">Monthly Plan</p>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-[#2a2a2a] text-[#999] px-3 py-1 rounded-md text-sm font-medium">{planLabel}</span>
                    {isActive && <span className="flex items-center gap-1 text-[#1ed760] text-sm font-medium"><span className="w-2 h-2 bg-[#1ed760] rounded-full" />Active</span>}
                  </div>
                  <p className="text-white font-bold">{subscription?.max_devices || 1} Computer{(subscription?.max_devices || 1) > 1 ? 's' : ''}</p>
                </div>
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
                  <p className="text-[#666] text-xs font-semibold tracking-wider uppercase mb-2">{subscription?.status === 'trialing' ? 'Trial Ends' : 'Next Charge'}</p>
                  <p className="text-white font-bold text-lg">
                    {expiresAt ? new Date(expiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* License */}
            {license && (
              <div>
                <h3 className="text-white font-bold text-lg mb-4">License Key</h3>
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 flex items-center justify-between">
                  <code className="text-[#1ed760] font-mono text-lg">{license.license_key}</code>
                  <button onClick={() => navigator.clipboard.writeText(license.license_key)}
                    className="px-4 py-2 bg-[#1ed760] text-[#0d0d0d] text-sm font-bold rounded-lg hover:bg-[#1ab854] transition">📋 Copy</button>
                </div>
              </div>
            )}

            {/* Devices */}
            <div>
              <h3 className="text-white font-bold text-lg mb-2">Authorized Devices</h3>
              <p className="text-[#666] text-sm mb-4">{devices.length} / {subscription?.max_devices || 1} devices linked</p>
              <div className="flex gap-4">
                {devices.map((d) => (
                  <div key={d.$id} className="bg-[#1a1a1a] border-2 border-[#1ed760]/30 border-dashed rounded-xl p-6 text-center min-w-[140px]">
                    {d.is_main && <span className="bg-[#1ed760] text-[#0d0d0d] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">Main</span>}
                    <p className="text-[#1ed760] font-mono text-sm mt-2">{d.device_id.slice(-6)}</p>
                    <p className="text-[#666] text-xs mt-1">{d.platform === 'macos' ? '🍎' : '🪟'} {d.platform}</p>
                  </div>
                ))}
                {devices.length < (subscription?.max_devices || 1) && (
                  <div className="bg-[#1a1a1a] border-2 border-[#2a2a2a] border-dashed rounded-xl p-6 text-center min-w-[140px] flex flex-col items-center justify-center">
                    <span className="text-[#666] text-2xl">+</span>
                    <span className="text-[#666] text-xs mt-1">Link Device</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* INVOICES */}
        {tab === 'invoices' && (
          <div className="text-[#666] text-center py-16">
            <p>Invoices will appear here after your first payment.</p>
            <p className="text-sm mt-1">Managed by Lemon Squeezy</p>
          </div>
        )}

        {/* REFERRALS */}
        {tab === 'referrals' && (
          <div className="space-y-8">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
              <h4 className="text-white font-bold mb-4">Your Referral Link</h4>
              <div className="flex gap-3">
                <input type="text" readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/signup?ref=${profile?.referral_code || ''}`}
                  className="flex-1 px-4 py-3 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-[#999] font-mono text-sm" />
                <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/signup?ref=${profile?.referral_code || ''}`)}
                  className="px-6 py-3 bg-[#1ed760] text-[#0d0d0d] font-bold rounded-lg hover:bg-[#1ab854] transition">📋 Copy Link</button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[['Total Referred', 0], ['Active Subscribers', 0], ['Rewards Earned', 0]].map(([label, val]) => (
                <div key={label as string} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 text-center">
                  <p className="text-[#666] text-xs font-semibold tracking-wider uppercase mb-2">{label as string}</p>
                  <p className="text-white text-3xl font-bold">{val as number}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
              <h4 className="text-[#1ed760] font-bold mb-4">ℹ️ How the Referral Program Works</h4>
              <div className="space-y-3">
                {[
                  'Share your unique referral link with friends',
                  'When they click your link and sign up, they become your referred users',
                  'For every 5 monthly payments from referred users, you automatically receive 1 free month',
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[#1ed760] rounded-full flex items-center justify-center text-[#0d0d0d] text-xs font-bold flex-shrink-0">{i + 1}</span>
                    <p className="text-[#999] text-sm">{text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-[#0d0d0d] rounded-lg p-3 flex items-center gap-2">
                <span>⭐</span>
                <p className="text-[#999] text-sm">No limit — refer more and get more free months!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
