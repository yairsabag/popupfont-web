// Appwrite configuration constants
export const APPWRITE_CONFIG = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'fontdrop_db',
  
  // Collection IDs
  collections: {
    profiles: 'profiles',
    subscriptions: 'subscriptions',
    devices: 'devices',
    licenses: 'licenses',
    referrals: 'referrals',
    usageLog: 'usage_log',
  },
} as const;
