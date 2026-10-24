export type ApiKeyStatus = 'active' | 'revoked' | 'expired' | 'rotating';
export type ApiKeyEnvironment = 'development' | 'staging' | 'production';
export type ApiKeyType = 'free' | 'paid' | 'trial';

export interface ApiKey {
  id: string;
  name: string;
  service: string; // software/vendor
  subscriptionId?: string; // linked subscription
  key: string; // full key (mock only)
  masked: string;
  type: ApiKeyType;
  status: ApiKeyStatus;
  environment: ApiKeyEnvironment;
  scopes: string[];
  createdAt: string;
  expiresAt?: string;
  lastUsedAt?: string;
  notes: string;
  usageCount: number;
  rateLimit?: string; // e.g. "1000 req/min"
}
