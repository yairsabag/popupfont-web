'use client';

import { useState, useEffect, useCallback } from 'react';
import { account } from '@/lib/appwrite/client';
import { Models } from 'appwrite';

export function useUser() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUser = useCallback(async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return { user, loading, logout, refresh: checkUser };
}
