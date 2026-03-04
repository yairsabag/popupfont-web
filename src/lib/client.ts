import { Client, Account, Databases } from 'appwrite';
import { APPWRITE_CONFIG } from './config';

// Browser-side Appwrite client (used in React components)
const client = new Client()
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export { client };
export { ID } from 'appwrite';
