import { logger } from '@/core/logger';

export type AnalyticsProps = Record<string, unknown>;

function logDev(event: string, payload?: AnalyticsProps) {
  if (__DEV__) {
    logger.debug(`analytics:${event}`, payload ?? {});
  }
}

export const analytics = {
  identify(userId: string, traits?: AnalyticsProps) {
    logDev('identify', { userId, ...traits });
  },
  screen(name: string, props?: AnalyticsProps) {
    logDev('screen', { name, ...props });
  },
  track(event: string, props?: AnalyticsProps) {
    logDev('track', { event, ...props });
  },
};
