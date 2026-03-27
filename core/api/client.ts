import ky, { type KyInstance, type Options } from 'ky';

import { getApiAuthToken } from '@/core/api/auth-token';
import { ApiError } from '@/core/api/errors';
import { appEnv } from '@/core/env';

function createKy(): KyInstance {
  const prefixUrl = appEnv.apiUrl?.replace(/\/$/, '') ?? '';

  return ky.create({
    prefixUrl: prefixUrl || undefined,
    timeout: 30_000,
    retry: {
      limit: 1,
      methods: ['get', 'head', 'delete', 'options', 'trace'],
      statusCodes: [408, 413, 429, 500, 502, 503, 504],
    },
    hooks: {
      beforeRequest: [
        (request) => {
          const token = getApiAuthToken();
          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
          }
        },
      ],
      afterResponse: [
        async (_request, _options, response) => {
          if (response.ok) {
            return response;
          }
          let body: unknown;
          try {
            body = await response.clone().json();
          } catch {
            body = await response.clone().text();
          }
          const message =
            typeof body === 'object' && body !== null && 'message' in body && typeof (body as { message: unknown }).message === 'string'
              ? (body as { message: string }).message
              : response.statusText || 'Request failed';
          throw new ApiError(message, response.status, body);
        },
      ],
    },
  });
}

let client: KyInstance | null = null;

export function getApiClient(): KyInstance {
  if (!client) {
    client = createKy();
  }
  return client;
}

/** Reset client when base URL changes (e.g. env reload in dev). */
export function resetApiClient() {
  client = null;
}

export async function apiGet<T>(url: string, options?: Options): Promise<T> {
  const base = appEnv.apiUrl?.trim();
  if (!base) {
    throw new ApiError('API base URL is not configured (EXPO_PUBLIC_API_URL)', 0, null);
  }
  return getApiClient()
    .get(url, options)
    .json<T>();
}

export async function apiPost<T>(url: string, json?: unknown, options?: Options): Promise<T> {
  const base = appEnv.apiUrl?.trim();
  if (!base) {
    throw new ApiError('API base URL is not configured (EXPO_PUBLIC_API_URL)', 0, null);
  }
  return getApiClient()
    .post(url, { json, ...options })
    .json<T>();
}
