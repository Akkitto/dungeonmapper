import { useCallback, useEffect } from 'react';
import type { DungeonMap, DungeonProject } from '../types/map';
import { loadProject as loadProjectFromStorage, migrateFromLocalStorage } from '../utils/storage';
import { wrapMapAsProject } from '../utils/storage';
import type { LevelHistory } from './mapStateUtils';
import { createDefaultProject, withDefaults, withProjectDefaults } from './mapStateUtils';

export function useMapPersistence(
  setProject: React.Dispatch<React.SetStateAction<DungeonProject>>,
  setActiveLevelIndex: React.Dispatch<React.SetStateAction<number>>,
  debouncedSave: (proj: DungeonProject) => void,
  historyRef: React.MutableRefObject<Map<number, LevelHistory>>,
  setCanUndo: React.Dispatch<React.SetStateAction<boolean>>,
  setCanRedo: React.Dispatch<React.SetStateAction<boolean>>,
  syncIdsToLevel: (level: DungeonMap) => void,
  resetIds: () => void,
  setSelectedNoteId: React.Dispatch<React.SetStateAction<number | null>>,
) {
  useEffect(() => {
    let cancelled = false;

    const restoreProject = async () => {
      // A legacy localStorage save must be persisted before IndexedDB is
      // read, otherwise the first post-upgrade load can race the migration
      // and leave the freshly migrated project invisible until a reload.
      await migrateFromLocalStorage();
      const loaded = await loadProjectFromStorage();
      if (!loaded || cancelled) return;

      const ready = withProjectDefaults(loaded);
      if (ready.levels.length === 0) return;
      setProject(ready);
      const idx = Math.max(0, Math.min(ready.activeLevelIndex, ready.levels.length - 1));
      setActiveLevelIndex(idx);
      syncIdsToLevel(ready.levels[idx]);
    };

    restoreProject().catch(() => {});
    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMapData = useCallback((loaded: DungeonMap) => {
    const proj = withProjectDefaults(wrapMapAsProject(withDefaults(loaded)));
    historyRef.current = new Map();
    setCanUndo(false);
    setCanRedo(false);
    setProject(proj);
    setActiveLevelIndex(0);
    debouncedSave(proj);
    syncIdsToLevel(proj.levels[0]);
    setSelectedNoteId(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSave]);

  const loadProjectData = useCallback((loaded: DungeonProject) => {
    const proj = withProjectDefaults(loaded);
    historyRef.current = new Map();
    setCanUndo(false);
    setCanRedo(false);
    const idx = Math.min(proj.activeLevelIndex, proj.levels.length - 1);
    setProject(proj);
    setActiveLevelIndex(idx);
    debouncedSave(proj);
    syncIdsToLevel(proj.levels[idx]);
    setSelectedNoteId(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSave]);

  const newMap = useCallback(() => {
    const fresh = createDefaultProject();
    historyRef.current = new Map();
    setCanUndo(false);
    setCanRedo(false);
    setProject(fresh);
    setActiveLevelIndex(0);
    debouncedSave(fresh);
    resetIds();
    setSelectedNoteId(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSave]);

  return { loadMapData, loadProjectData, newMap };
}
