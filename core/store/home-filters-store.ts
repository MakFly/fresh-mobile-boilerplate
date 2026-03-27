import { create } from 'zustand';

export const DEFAULT_HOME_CHECKPOINT_IDS = ['auth', 'query', 'samples'] as const;

type HomeFiltersStore = {
  selectedCheckpointIds: string[];
  showAiSample: boolean;
  setHomeFilters: (filters: { checkpointIds: string[]; showAiSample: boolean }) => void;
  resetHomeFilters: () => void;
};

export const useHomeFiltersStore = create<HomeFiltersStore>((set) => ({
  selectedCheckpointIds: [...DEFAULT_HOME_CHECKPOINT_IDS],
  showAiSample: true,
  setHomeFilters: ({ checkpointIds, showAiSample }) =>
    set({
      selectedCheckpointIds: checkpointIds,
      showAiSample,
    }),
  resetHomeFilters: () =>
    set({
      selectedCheckpointIds: [...DEFAULT_HOME_CHECKPOINT_IDS],
      showAiSample: true,
    }),
}));
