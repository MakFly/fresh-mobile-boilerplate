import { useQuery } from '@tanstack/react-query';

import { fetchDashboardSummary } from '@/features/dashboard/api';
import { queryKeys } from '@/core/query/keys';

export function useDashboardSummary() {
  return useQuery({
    queryKey: queryKeys.dashboardSummary,
    queryFn: fetchDashboardSummary,
  });
}
