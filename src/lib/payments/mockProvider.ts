import { supabase } from '@/lib/supabase';
import type { Entitlement, PaymentsProvider, SubscriptionPlan } from './types';

function toEntitlement(row: { plan: SubscriptionPlan; status: Entitlement['status']; current_period_end: string | null }): Entitlement {
  return {
    plan: row.plan,
    status: row.status,
    isPremium: row.plan !== 'free' && row.status === 'active',
    currentPeriodEnd: row.current_period_end ?? undefined,
  };
}

export const mockPaymentsProvider: PaymentsProvider = {
  async getEntitlement(userId) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('plan, status, current_period_end')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return { plan: 'free', status: 'active', isPremium: false };
    }
    return toEntitlement(data);
  },

  async purchase(userId, plan) {
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + (plan === 'annual' ? 12 : 1));

    const { data, error } = await supabase
      .from('subscriptions')
      .update({ plan, status: 'active', provider: 'mock', current_period_end: periodEnd.toISOString() })
      .eq('user_id', userId)
      .select('plan, status, current_period_end')
      .single();

    if (error || !data) throw error ?? new Error('Failed to update subscription');
    return toEntitlement(data);
  },

  async restorePurchases(userId) {
    return this.getEntitlement(userId);
  },
};
