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
