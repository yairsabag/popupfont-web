'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const BASIC_VARIANT = '1575477';
const PRO_VARIANT   = '1575461';
const STORE_NAME    = 'fontdrop'; // fontdrop.lemonsqueezy.com

export default function ActivatePage() {
  const searchParams = useSearchParams();
  const [userNumber, setUserNumber] = useState('');
  const [error, setError] = useState('');

  // Pre-fill from URL: /activate?u=ABC12345
  useEffect(() => {
    const u = searchParams.get('u');
    if (u) setUserNumber(u);
  }, [searchParams]);

  const validateAndCheckout = (variantId: string) => {
    const trimmed = userNumber.trim().toUpperCase();
    if (trimmed.length < 6) {
      setError('Please enter your User Number (8 characters from the app menu).');
      return;
    }
    setError('');
    // Lemon Squeezy checkout URL with custom data
    const BASIC_URL = 'https://fontdrop.lemonsqueezy.com/checkout/buy/5de67aa7-9c47-4908-8047-a467f5495528';
    const PRO_URL   = 'https://fontdrop.lemonsqueezy.com/checkout/buy/5aa28641-c2a7-453b-9584-c6030879547e';
    const baseUrl = variantId === BASIC_VARIANT ? BASIC_URL : PRO_URL;
    const checkoutUrl =
      `${baseUrl}?checkout[custom][user_id]=${encodeURIComponent(trimmed)}` +
      `&checkout[custom][device_id]=${encodeURIComponent(trimmed)}`;
    window.location.href = checkoutUrl;
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col">
      {/* Nav */}
      <nav className="border-b border-[#2a2a2a] px-6 py-4">
        <a href="/" className="flex items-center gap-3 w-fit">
          <div className="w-8 h-8 bg-[#1ed760] rounded-lg flex items-center justify-center text-[#0d0d0d] font-black text-sm">Fp</div>
          <span className="text-white font-bold text-lg">FontDrop</span>
        </a>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black text-white text-center mb-3">
            Activate FontDrop
          </h1>
          <p className="text-[#999] text-center mb-10">
            Enter your <span className="text-[#1ed760] font-semibold">User Number</span> from the app menu, then pick a plan.
          </p>

          {/* User Number Input */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 mb-8">
            <label className="block text-white font-semibold mb-2">Your User Number</label>
            <p className="text-[#666] text-sm mb-4">
              Open FontDrop → click <code className="text-[#1ed760]">i</code> on the bubble → click your <strong>Account</strong> status → copy the User Number.
            </p>
            <input
              type="text"
              value={userNumber}
              onChange={(e) => setUserNumber(e.target.value.toUpperCase())}
              placeholder="ABC12345"
              maxLength={16}
              className="w-full px-4 py-4 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl text-white font-mono text-lg tracking-widest text-center focus:outline-none focus:border-[#1ed760] transition"
            />
            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Basic */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 flex flex-col">
              <h3 className="text-white font-bold text-xl mb-1">Basic</h3>
              <p className="text-[#666] text-sm mb-4">For solo designers</p>
              <div className="mb-6">
                <span className="text-white text-4xl font-black">$9</span>
                <span className="text-[#666]">/month</span>
              </div>
              <ul className="space-y-2 mb-8 flex-1">
                <li className="text-[#999] text-sm flex items-start gap-2"><span className="text-[#1ed760] mt-0.5">✓</span> Unlimited font scans</li>
                <li className="text-[#999] text-sm flex items-start gap-2"><span className="text-[#1ed760] mt-0.5">✓</span> AI-powered detection</li>
                <li className="text-[#999] text-sm flex items-start gap-2"><span className="text-[#1ed760] mt-0.5">✓</span> Free font alternatives</li>
                <li className="text-[#999] text-sm flex items-start gap-2"><span className="text-[#1ed760] mt-0.5">✓</span> 1 computer</li>
                <li className="text-[#999] text-sm flex items-start gap-2"><span className="text-[#1ed760] mt-0.5">✓</span> Email support</li>
              </ul>
              <button
                onClick={() => validateAndCheckout(BASIC_VARIANT)}
                className="w-full py-3 border border-[#1ed760] text-[#1ed760] font-bold rounded-xl hover:bg-[#1ed760] hover:text-[#0d0d0d] transition"
              >
                Get Basic
              </button>
            </div>

            {/* Pro */}
            <div className="bg-[#1a1a1a] border-2 border-[#1ed760] rounded-2xl p-6 flex flex-col relative">
              <span className="absolute -top-3 right-6 bg-[#1ed760] text-[#0d0d0d] text-xs font-bold px-3 py-1 rounded-full">RECOMMENDED</span>
              <h3 className="text-white font-bold text-xl mb-1">Pro</h3>
              <p className="text-[#666] text-sm mb-4">For working designers</p>
              <div className="mb-6">
                <span className="text-white text-4xl font-black">$15</span>
                <span className="text-[#666]">/month</span>
              </div>
              <ul className="space-y-2 mb-8 flex-1">
                <li className="text-[#999] text-sm flex items-start gap-2"><span className="text-[#1ed760] mt-0.5">✓</span> Everything in Basic</li>
                <li className="text-[#999] text-sm flex items-start gap-2"><span className="text-[#1ed760] mt-0.5">✓</span> Up to 3 computers</li>
                <li className="text-[#999] text-sm flex items-start gap-2"><span className="text-[#1ed760] mt-0.5">✓</span> Priority email support</li>
                <li className="text-[#999] text-sm flex items-start gap-2"><span className="text-[#1ed760] mt-0.5">✓</span> Early access to new features</li>
              </ul>
              <button
                onClick={() => validateAndCheckout(PRO_VARIANT)}
                className="w-full py-3 bg-[#1ed760] text-[#0d0d0d] font-bold rounded-xl hover:bg-[#1ab854] transition"
              >
                Get Pro
              </button>
            </div>
          </div>

          <p className="text-[#666] text-xs text-center mt-8">
            Cancel anytime · Secure checkout via Lemon Squeezy
          </p>
        </div>
      </div>
    </div>
  );
}
