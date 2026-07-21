// Placeholder pricing for prototype display. Real prices are configured in
// RevenueCat / App Store Connect / Play Console — this file exists so no
// price is hardcoded into business logic, only into this single config point.

export const PRICING = {
  monthly: { amount: '$12.99', period: '/month', billingNote: 'Billed monthly' },
  annual: { amount: '$79.99', period: '/year', billingNote: 'Billed annually — about $6.67/month' },
};

export const FREE_FEATURES = [
  'Basic daily dashboard',
  'Manual meal logging',
  'Manual water and workout logging',
  'Limited AI meal scans',
  'Basic progress view',
  'One-minute Calm experiences',
  'Limited daily recommendations',
];

export const PREMIUM_FEATURES = [
  'Unlimited AI meal analysis',
  'Personalized nearby meal recommendations',
  'Nearby workout and wellness discovery',
  'Wearable integrations',
  'Advanced AI concierge',
  'Personalized daily insights',
  'Full progress analytics',
  'Weekly and monthly reports',
  'Full Calm library',
  'Travel mode',
  'Advanced nutrition filtering',
  'Priority personalization',
];
