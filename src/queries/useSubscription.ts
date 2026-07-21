import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentsProvider, type SubscriptionPlan } from '@/lib/payments';

export function useEntitlement(userId: string | undefined) {
  return useQuery({
    queryKey: ['entitlement', userId],
    enabled: Boolean(userId),
    queryFn: () => paymentsProvider.getEntitlement(userId!),
  });
}

export function usePurchase(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (plan: Exclude<SubscriptionPlan, 'free'>) => {
      if (!userId) throw new Error('Missing user id');
      return paymentsProvider.purchase(userId, plan);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['entitlement', userId], data);
    },
  });
}
