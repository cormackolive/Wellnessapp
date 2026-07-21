export type SubscriptionPlan = 'free' | 'monthly' | 'annual';

export type Entitlement = {
  plan: SubscriptionPlan;
  status: 'active' | 'trialing' | 'canceled' | 'expired';
  isPremium: boolean;
  currentPeriodEnd?: string;
};

export interface PaymentsProvider {
  getEntitlement(userId: string): Promise<Entitlement>;
  purchase(userId: string, plan: Exclude<SubscriptionPlan, 'free'>): Promise<Entitlement>;
  restorePurchases(userId: string): Promise<Entitlement>;
}
