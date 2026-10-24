import type { ApiKey } from '../types/apiKey';

const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const monthsAgo = (n: number) => {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toISOString().slice(0, 10);
};

function mask(key: string) {
  if (key.length <= 8) return '••••••••';
  return key.slice(0, 6) + '••••••••' + key.slice(-4);
}

const raw: Omit<ApiKey, 'masked'>[] = [
  {
    id: 'key_1',
    name: 'OpenAI Production',
    service: 'OpenAI',
    subscriptionId: 'sub_1',
    key: 'sk-proj-abc123def456ghi789jkl012mno345pqr678stu',
    type: 'paid',
    status: 'active',
    environment: 'production',
    scopes: ['chat.completions', 'embeddings'],
    createdAt: monthsAgo(2),
    expiresAt: daysFromNow(60),
    lastUsedAt: daysFromNow(-1),
    notes: 'Used by backend chat service.',
    usageCount: 12450,
    rateLimit: '10k req/min',
  },
  {
    id: 'key_2',
    name: 'OpenAI Dev',
    service: 'OpenAI',
    subscriptionId: 'sub_1',
    key: 'sk-proj-dev987zyx654wvu321tsr098qpo765nml432kji',
    type: 'paid',
    status: 'active',
    environment: 'development',
    scopes: ['chat.completions'],
    createdAt: monthsAgo(1),
    lastUsedAt: daysFromNow(-3),
    notes: 'Local testing.',
    usageCount: 320,
    rateLimit: '3k req/min',
  },
  {
    id: 'key_3',
    name: 'Anthropic Claude',
    service: 'Anthropic',
    subscriptionId: 'sub_2',
    key: 'sk-ant-api03-xyz789abc456def123ghi012jkl345mno678',
    type: 'paid',
    status: 'active',
    environment: 'production',
    scopes: ['messages'],
    createdAt: monthsAgo(3),
    expiresAt: daysFromNow(90),
    lastUsedAt: daysFromNow(0),
    notes: '',
    usageCount: 8900,
    rateLimit: '5k req/min',
  },
  {
    id: 'key_4',
    name: 'GitHub PAT',
    service: 'GitHub',
    subscriptionId: 'sub_3',
    key: 'ghp_abcdefghijklmnopqrstuvwxyz1234567890',
    type: 'free',
    status: 'active',
    environment: 'production',
    scopes: ['repo', 'workflow'],
    createdAt: monthsAgo(6),
    lastUsedAt: daysFromNow(-7),
    notes: 'CI/CD automation.',
    usageCount: 412,
  },
  {
    id: 'key_5',
    name: 'AWS Access Key',
    service: 'AWS',
    subscriptionId: 'sub_4',
    key: 'AKIAIOSFODNN7EXAMPLE',
    type: 'paid',
    status: 'active',
    environment: 'production',
    scopes: ['s3:*', 'lambda:*'],
    createdAt: monthsAgo(12),
    notes: 'Rotated quarterly.',
    usageCount: 56000,
  },
  {
    id: 'key_6',
    name: 'Stripe Test Key',
    service: 'Stripe',
    key: 'sk_test_51H8xYzABCdefGHIjklMNOpqrSTUvwxYZ',
    type: 'free',
    status: 'active',
    environment: 'development',
    scopes: ['charges.read', 'customers.read'],
    createdAt: monthsAgo(4),
    lastUsedAt: daysFromNow(-14),
    notes: 'Test mode only.',
    usageCount: 88,
  },
  {
    id: 'key_7',
    name: 'Old Revoked Key',
    service: 'OpenAI',
    key: 'sk-proj-oldrevokedkey1234567890abcdef',
    type: 'paid',
    status: 'revoked',
    environment: 'production',
    scopes: ['chat.completions'],
    createdAt: monthsAgo(8),
    lastUsedAt: monthsAgo(1),
    notes: 'Revoked after leak.',
    usageCount: 2100,
  },
  {
    id: 'key_8',
    name: 'Mailchimp Trial',
    service: 'Mailchimp',
    subscriptionId: 'sub_11',
    key: 'mc_trial_key_abc123def456',
    type: 'trial',
    status: 'expired',
    environment: 'development',
    scopes: ['campaigns'],
    createdAt: monthsAgo(1),
    expiresAt: daysFromNow(-5),
    notes: 'Trial expired.',
    usageCount: 12,
  },
];

export const mockApiKeys: ApiKey[] = raw.map((r) => ({ ...r, masked: mask(r.key) }));
export const API_KEY_SERVICES = ['OpenAI', 'Anthropic', 'GitHub', 'AWS', 'Stripe', 'Google', 'Vercel', 'Other'];
export const API_KEY_SCOPES_PRESET = ['read', 'write', 'admin', 'chat.completions', 'embeddings', 'repo', 'workflow'];
