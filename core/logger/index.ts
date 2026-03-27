const isDev = typeof __DEV__ !== 'undefined' && __DEV__;

type LogContext = Record<string, unknown> | undefined;

function formatContext(context?: LogContext) {
  if (!context) return undefined;
  return Object.keys(context).length > 0 ? context : undefined;
}

export const logger = {
  debug(message: string, context?: LogContext) {
    if (!isDev) return;
    console.log(`[debug] ${message}`, formatContext(context) ?? '');
  },

  info(message: string, context?: LogContext) {
    console.log(`[info] ${message}`, formatContext(context) ?? '');
  },

  warn(message: string, context?: LogContext) {
    console.warn(`[warn] ${message}`, formatContext(context) ?? '');
  },

  error(message: string, context?: LogContext) {
    console.error(`[error] ${message}`, formatContext(context) ?? '');
  },
};
