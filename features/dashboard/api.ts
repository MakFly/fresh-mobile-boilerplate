export type DashboardSummary = {
  checkpoints: Array<{
    id: string;
    title: string;
    detail: string;
  }>;
  stats: Array<{
    id: string;
    label: string;
    value: string;
  }>;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  await wait(250);

  return {
    checkpoints: [
      {
        id: 'auth',
        title: 'Auth local',
        detail: 'Public routes, protected routes, session restore and logout are already connected.',
      },
      {
        id: 'query',
        title: 'TanStack Query',
        detail: 'Queries and mutations are wired with clear query keys and invalidation points.',
      },
      {
        id: 'samples',
        title: 'Feature samples',
        detail: 'A sample AI chat remains isolated from the core app shell.',
      },
    ],
    stats: [
      { id: 'pm', label: 'Package manager', value: 'bun' },
      { id: 'auth', label: 'Auth mode', value: 'local-first' },
      { id: 'platforms', label: 'Primary targets', value: 'iOS + Android' },
    ],
  };
}
