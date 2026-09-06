import { act, renderHook, waitFor } from '@testing-library/react';
import type React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DungeonMap, DungeonProject } from '../../types/map';
import type { LevelHistory } from '../mapStateUtils';

const storageMocks = vi.hoisted(() => ({
  loadProject: vi.fn(),
  migrateFromLocalStorage: vi.fn(),
}));

vi.mock('../../utils/storage', async importOriginal => {
  const actual = await importOriginal<typeof import('../../utils/storage')>();
  return {
    ...actual,
    loadProject: storageMocks.loadProject,
    migrateFromLocalStorage: storageMocks.migrateFromLocalStorage,
  };
});

import { useMapPersistence } from '../useMapPersistence';

describe('useMapPersistence startup restore', () => {
  beforeEach(() => {
    storageMocks.loadProject.mockReset();
    storageMocks.migrateFromLocalStorage.mockReset();
  });

  it('waits for legacy migration before reading the IndexedDB autosave', async () => {
    let finishMigration: (() => void) | undefined;
    storageMocks.migrateFromLocalStorage.mockImplementation(() => new Promise<void>(resolve => {
      finishMigration = resolve;
    }));
    storageMocks.loadProject.mockResolvedValue(null);

    const setProject = vi.fn() as React.Dispatch<React.SetStateAction<DungeonProject>>;
    const setActiveLevelIndex = vi.fn() as React.Dispatch<React.SetStateAction<number>>;
    const debouncedSave = vi.fn<(project: DungeonProject) => void>();
    const historyRef = { current: new Map<number, LevelHistory>() } as React.MutableRefObject<Map<number, LevelHistory>>;
    const setCanUndo = vi.fn() as React.Dispatch<React.SetStateAction<boolean>>;
    const setCanRedo = vi.fn() as React.Dispatch<React.SetStateAction<boolean>>;
    const syncIdsToLevel = vi.fn<(level: DungeonMap) => void>();
    const resetIds = vi.fn<() => void>();
    const setSelectedNoteId = vi.fn() as React.Dispatch<React.SetStateAction<number | null>>;

    renderHook(() => useMapPersistence(
      setProject,
      setActiveLevelIndex,
      debouncedSave,
      historyRef,
      setCanUndo,
      setCanRedo,
      syncIdsToLevel,
      resetIds,
      setSelectedNoteId,
    ));

    expect(storageMocks.migrateFromLocalStorage).toHaveBeenCalledTimes(1);
    expect(storageMocks.loadProject).not.toHaveBeenCalled();

    await act(async () => {
      finishMigration?.();
    });

    await waitFor(() => {
      expect(storageMocks.loadProject).toHaveBeenCalledTimes(1);
    });
  });
});
