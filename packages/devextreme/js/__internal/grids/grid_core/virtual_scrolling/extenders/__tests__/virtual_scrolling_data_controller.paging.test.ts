import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { DataGridScrollMode } from '@js/ui/data_grid';
import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';

declare class ExposedDataController extends DataController {
  public resolvePaginate(enabled: boolean | undefined): boolean | undefined;

  public requiresTotalCount(): boolean;
}

const withScrollingMode = async (mode: DataGridScrollMode): Promise<ExposedDataController> => {
  const { instance } = await createDataGrid({ dataSource: [], scrolling: { mode } });

  return instance.getController('data') as unknown as ExposedDataController;
};

describe('Virtual scrolling data controller paging', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('resolvePaginate', () => {
    it.each<{ mode: DataGridScrollMode; enabled: boolean; expected: boolean }>([
      { mode: 'standard', enabled: true, expected: true },
      { mode: 'standard', enabled: false, expected: false },
      { mode: 'virtual', enabled: false, expected: true },
      { mode: 'infinite', enabled: false, expected: true },
    ])('should be $expected in $mode mode with enabled=$enabled', async ({
      mode, enabled, expected,
    }) => {
      const dataController = await withScrollingMode(mode);

      expect(dataController.resolvePaginate(enabled)).toBe(expected);
    });

    it.each<DataGridScrollMode>(['standard', 'virtual', 'infinite'])(
      'should leave paginate untouched when enabled is undefined in %s mode',
      async (mode) => {
        const dataController = await withScrollingMode(mode);

        expect(dataController.resolvePaginate(undefined)).toBeUndefined();
      },
    );
  });

  describe('requiresTotalCount', () => {
    it.each<{ mode: DataGridScrollMode; expected: boolean }>([
      { mode: 'standard', expected: true },
      { mode: 'virtual', expected: true },
      { mode: 'infinite', expected: false },
    ])('should be $expected in $mode mode', async ({ mode, expected }) => {
      const dataController = await withScrollingMode(mode);

      expect(dataController.requiresTotalCount()).toBe(expected);
    });
  });

  it('should reset the data controller when the scrolling option changes', async () => {
    const { instance } = await createDataGrid({ dataSource: [] });
    const dataController = instance.getController('data');
    const resetSpy = jest.spyOn(dataController, 'reset');

    instance.option('scrolling.mode', 'virtual');

    expect(resetSpy).toHaveBeenCalled();
  });
});
