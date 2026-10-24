export type BudgetScope = 'global' | 'category' | 'service';
export type BudgetPeriod = 'monthly' | 'annual';

export interface Budget {
  id: string;
  name: string;
  scope: BudgetScope;
  target: string; // 'all' | category name | service name
  limit: number;
  period: BudgetPeriod;
  alertThreshold: number; // percent 0-100
  createdAt: string;
}

export type AlertType = 'budget' | 'renewal' | 'expiry' | 'system';
export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}
