export const featureFlags = {
  /** AI chat sample stack */
  samplesStack: true,
  /** Glass experiments tab / lab */
  glassLab: true,
} as const;

export type FeatureFlagKey = keyof typeof featureFlags;
