export type SubscriptionType = 'paid' | 'free' | 'lifetime' | 'trial';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';
export type BillingCycle = 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'one-time';

export interface CostHistoryEntry {
  date: string; // ISO
  amount: number;
  note?: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  url?: string;
}

export interface Subscription {
  id: string;
  name: string;
  vendor: string;
  category: string;
  type: SubscriptionType;
  status: SubscriptionStatus;
  cost: number;
  currency: string;
  billingCycle: BillingCycle;
  startDate: string;
  renewalDate: string;
  autoRenew: boolean;
  cancellationReminderDate?: string;
  paymentMethod: string;
  notes: string;
  tags: string[];
  logo?: string; // emoji or url
  costHistory: CostHistoryEntry[];
  invoices: Invoice[];
  createdAt: string;
  updatedAt: string;
}

export interface ActivityEntry {
  id: string;
  type: 'created' | 'updated' | 'renewed' | 'cancelled' | 'paused' | 'resumed';
  subscriptionId?: string;
  subscriptionName?: string;
  message: string;
  date: string;
}

export interface Settings {
  currency: string;
  theme: 'dark' | 'light';
  notifications: boolean;
  reminderDays: number;
}
