export interface CataloguePlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'annual' | 'one-time' | 'free';
  type: 'free' | 'paid' | 'trial';
  features: string[];
  limits?: string;
  recommended?: boolean;
}

export interface CatalogueItem {
  id: string;
  name: string;
  vendor: string;
  category: string;
  description: string;
  website: string;
  logo: string;
  tags: string[];
  plans: CataloguePlan[];
  subscribedPlanId?: string; // linked plan if you have a subscription
  linkedSubscriptionIds?: string[]; // m2m: catalogue item ↔ subscriptions
}
