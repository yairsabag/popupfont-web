export const dynamic = 'force-dynamic';

import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 bg-[#1ed760] rounded-xl flex items-center justify-center text-[#0d0d0d] font-black text-lg">
            Fp
          </div>
          <span className="text-white font-extrabold text-2xl">FontPop</span>
        </Link>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
          {children}
        </div>
      </div>
    </div>
  );
}