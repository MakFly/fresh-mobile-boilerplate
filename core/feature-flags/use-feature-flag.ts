import { useMemo } from 'react';

import { featureFlags, type FeatureFlagKey } from '@/core/feature-flags/flags';

export function useFeatureFlag<K extends FeatureFlagKey>(key: K) {
  return useMemo(() => featureFlags[key], [key]);
}

export function getFeatureFlag<K extends FeatureFlagKey>(key: K) {
  return featureFlags[key];
}
