import { Redirect } from 'expo-router';

// Never actually shown — the tab bar intercepts presses on this tab to open
// the Add bottom sheet instead of navigating (see (tabs)/_layout.tsx).
export default function AddPlaceholder() {
  return <Redirect href="/(tabs)/today" />;
}
