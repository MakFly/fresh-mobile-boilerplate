import { normalizeInboundPath } from '@/core/navigation/deep-links';

export function redirectSystemPath({
  path,
}: {
  path: string | null;
  initial: boolean;
}) {
  return normalizeInboundPath(path);
}
