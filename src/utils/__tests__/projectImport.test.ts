import { describe, expect, it } from 'vitest';
import { createDefaultMap } from '../../hooks/mapStateUtils';
import { importProjectJSON } from '../export';

describe('project JSON import', () => {
  it('imports a legacy bare DungeonMap that uses the released tiles schema', async () => {
    const legacyMap = createDefaultMap('Legacy Map');
    legacyMap.tiles[1][2] = { type: 'floor' };

    const file = new File(
      [JSON.stringify(legacyMap)],
      'legacy-map.json',
      { type: 'application/json' },
    );

    const project = await importProjectJSON(file);

    expect(project.name).toBe('Legacy Map');
    expect(project.activeLevelIndex).toBe(0);
    expect(project.levels).toHaveLength(1);
    expect(project.levels[0].tiles[1][2]).toEqual({ type: 'floor' });
  });
});
