import { Client, Databases, Users } from 'node-appwrite';
import { APPWRITE_CONFIG } from './config';

// Server-side Appwrite client (used in API routes & server components)
// Uses API key — never expose this to the browser
export function createAdminClient() {
  const client = new Client()
    .setEndpoint(APPWRITE_CONFIG.endpoint)
    .setProject(APPWRITE_CONFIG.projectId)
    .setKey(process.env.APPWRITE_API_KEY!);

  return {
    databases: new Databases(client),
    users: new Users(client),
  };
}

// Server client that acts on behalf of a user (using their session)
export function createSessionClient(session: string) {
  const client = new Client()
    .setEndpoint(APPWRITE_CONFIG.endpoint)
    .setProject(APPWRITE_CONFIG.projectId)
    .setSession(session);

  return {
    databases: new Databases(client),
  };
}
