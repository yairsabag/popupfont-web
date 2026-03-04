// Appwrite configuration constants
export const APPWRITE_CONFIG = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'fontpop_db',
  
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
