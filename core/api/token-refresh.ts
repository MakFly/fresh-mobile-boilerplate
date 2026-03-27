/**
 * Wire a refresh flow here later (e.g. POST /auth/refresh) and call `setApiAuthToken`.
 * `getApiClient()` can be extended with a 401 retry that invokes this handler.
 */
export type RefreshSessionHandler = () => Promise<{ token: string } | null>;

let refreshSession: RefreshSessionHandler | null = null;

export function registerSessionRefreshHandler(handler: RefreshSessionHandler | null) {
  refreshSession = handler;
}

export function getSessionRefreshHandler() {
  return refreshSession;
}
