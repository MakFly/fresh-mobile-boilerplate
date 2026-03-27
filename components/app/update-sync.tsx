import { useAppUpdateCheck } from '@/core/updates/use-app-update';

export function UpdateSync() {
  useAppUpdateCheck();
  return null;
}
