export type PaymentMethodType = 'card' | 'paypal' | 'bank' | 'other';

export interface PaymentMethod {
  id: string;
  label: string;
  type: PaymentMethodType;
  last4?: string;
  expiry?: string; // MM/YY
  holder?: string;
  isDefault: boolean;
}
