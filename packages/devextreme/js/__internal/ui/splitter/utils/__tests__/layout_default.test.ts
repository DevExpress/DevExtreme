import { describe, expect, it } from '@jest/globals';
import { isDefined } from '@js/core/utils/type';

import { convertSizeToRatio } from '../layout';
import { fitAutoSizesIntoLayout, getDefaultLayout } from '../layout_default';
import type { PaneRestrictions } from '../types';

// mirrors Splitter._getDefaultLayoutBasedOnSize(undefined, true) — the render-time
// recalculation, where the stored sizes may come from another container size
function getRenderLayout(restrictions: PaneRestrictions[]): number[] {
  return getDefaultLayout(fitAutoSizesIntoLayout(restrictions));
}

interface TestItem {
  size?: string | number;
  minSize?: string | number;
  maxSize?: string | number;
  collapsedSize?: string | number;
  resizable?: boolean;
  visible?: boolean;
  collapsed?: boolean;
}

// mirrors Splitter._updateItemsRestrictions() called without a current item
function getItemRestrictions(
  items: TestItem[],
  elementSize: number,
  handlesSizeSum: number,
  declaredSizes: (string | number | undefined)[] = items.map((item) => item.size),
): PaneRestrictions[] {
  return items.map((item, index) => ({
    resizable: item.resizable !== false,
    visible: item.visible !== false,
    collapsed: item.collapsed === true,
    collapsedSize: convertSizeToRatio(item.collapsedSize, elementSize, handlesSizeSum),
    size: convertSizeToRatio(item.size, elementSize, handlesSizeSum),
    maxSize: convertSizeToRatio(item.maxSize, elementSize, handlesSizeSum),
    minSize: convertSizeToRatio(item.minSize, elementSize, handlesSizeSum),
    isSizeAuto: !isDefined(declaredSizes[index]),
  }));
}

// the layout is applied as flex-grow on panes with flex-basis: 0, flex-shrink: 0 and
// overflow: hidden, so their rendered size is their share of the whole available space
function getPaneSizes(layout: number[], availableSize: number): number[] {
  const totalGrow = layout.reduce((total, grow) => total + grow, 0);

  return layout.map((grow) => (availableSize * grow) / totalGrow);
}

function expectSizes(actual: number[], expected: number[]): void {
  expect(actual.map((size) => Number(size.toFixed(3)))).toEqual(expected);
}

describe('getDefaultLayout', () => {
  describe('pane sizes requested by the user', () => {
    // the Splitter Overview demo: two 140px panes around a pane with no size of its own,
    // one resize handle (8px) and one inactive handle next to the non-resizable pane (2px)
    const demoItems: TestItem[] = [
      { size: '140px', minSize: '70px' },
      {},
      { size: '140px', resizable: false },
    ];
    const demoHandles = 8 + 2;
    const demoElementSize = 982;

    it('keeps sizes declared in pixels when another pane limits itself with a percentage maxSize', () => {
      const items: TestItem[] = [
        { size: '140px', minSize: '70px' },
        { maxSize: '75%' },
        { size: '140px', resizable: false },
      ];

      const layout = getDefaultLayout(
        getItemRestrictions(items, demoElementSize, demoHandles),
      );

      expectSizes(
        getPaneSizes(layout, demoElementSize - demoHandles),
        [140, 692, 140],
      );
    });

    it('takes the space a shrunk container lost from the pane the widget sized itself', () => {
      // the first layout pass runs before the page is resized to its final width
      const wideElementSize = 1018;
      const wideLayout = getDefaultLayout(
        getItemRestrictions(demoItems, wideElementSize, demoHandles),
      );
      const measuredSizes = getPaneSizes(wideLayout, wideElementSize - demoHandles);

      expectSizes(measuredSizes, [140, 728, 140]);

      // _updateItemSizes() writes the measured sizes back into items[].size, so a layout
      // recalculation after the container has shrunk gets sizes that no longer fit into it
      const resizedItems: TestItem[] = demoItems.map((item, index) => ({
        ...item,
        size: measuredSizes[index],
      }));

      const layout = getRenderLayout(getItemRestrictions(
        resizedItems,
        demoElementSize,
        demoHandles,
        demoItems.map((item) => item.size),
      ));

      expectSizes(
        getPaneSizes(layout, demoElementSize - demoHandles),
        [140, 692, 140],
      );
    });

    it('is not affected by the container size the previous layout pass was based on', () => {
      const layoutFromScratch = getRenderLayout(
        getItemRestrictions(demoItems, demoElementSize, demoHandles),
      );

      [1018, 982, 900].forEach((previousElementSize) => {
        const previousLayout = getDefaultLayout(
          getItemRestrictions(demoItems, previousElementSize, demoHandles),
        );
        const measuredSizes = getPaneSizes(
          previousLayout,
          previousElementSize - demoHandles,
        );

        const layout = getRenderLayout(getItemRestrictions(
          demoItems.map((item, index) => ({ ...item, size: measuredSizes[index] })),
          demoElementSize,
          demoHandles,
          demoItems.map((item) => item.size),
        ));

        expect(layout).toEqual(layoutFromScratch);
      });
    });

    it('keeps sizes the widget measured itself when they still fit into the container', () => {
      const layout = getRenderLayout(getItemRestrictions(
        [{ size: 200 }, { size: 100 }, { size: 100 }],
        408,
        8,
        [undefined, undefined, undefined],
      ));

      expectSizes(getPaneSizes(layout, 400), [200, 100, 100]);
    });

    it('without the render-time fit oversubscribed sizes keep resolving positionally', () => {
      // option-change recalculations (collapsedSize, minSize, maxSize) call getDefaultLayout
      // directly: sizes are fresh there and conflicts are resolved in pane order
      const layout = getDefaultLayout(getItemRestrictions(
        [{ size: 200 }, { size: 200 }, { size: 100 }],
        408,
        8,
        [undefined, undefined, undefined],
      ));

      expectSizes(getPaneSizes(layout, 400), [200, 200, 0]);
    });
  });

  // the layouts asserted by the 'Pane sizing' QUnit module, all of them rendered into a
  // 408px container: sizes requested by the user must keep resolving the same way
  describe('layouts covered by the QUnit tests', () => {
    const cases: { items: TestItem[]; expected: number[] }[] = [
      { items: [{ minSize: '30%' }], expected: [100] },
      // rounding dust makes the pre-normalization total 99.9999999999 here — the layout
      // must not be rescaled because of it
      { items: [{ minSize: '30%' }, {}, {}], expected: [33.3333, 33.3333, 33.3333] },
      { items: [{ size: '40%', minSize: '30%' }, {}], expected: [40.8, 59.2] },
      { items: [{ minSize: '40%' }, {}, {}], expected: [41.6327, 25.034, 33.3333] },
      { items: [{ size: '30%' }, {}, { minSize: '30%' }], expected: [31.2245, 34.3878, 34.3878] },
      { items: [{ size: '30%' }, {}, { minSize: '30%', size: '40%' }], expected: [31.2245, 27.1429, 41.6327] },
      { items: [{}, {}, { minSize: '30%', size: '20%' }], expected: [29.1837, 39.5918, 31.2245] },
      { items: [{ size: '50%' }, { minSize: '40%' }, { minSize: '40%' }], expected: [16.7347, 41.6327, 41.6327] },
      { items: [{ size: '200px', minSize: '30%' }, {}], expected: [50, 50] },
      { items: [{ size: 200, minSize: 300 }, {}], expected: [75, 25] },
      { items: [{ minSize: '70%' }, { minSize: 100 }, { minSize: 100 }], expected: [72.8571, 25.5102, 25.5102] },
      { items: [{ maxSize: '30%' }], expected: [100] },
      { items: [{ size: '40%', maxSize: '30%' }, {}], expected: [30.6, 69.4] },
      { items: [{ size: '20%', maxSize: '30%' }, {}], expected: [20.4, 79.6] },
      { items: [{ size: '40%' }, { maxSize: '30%' }], expected: [69.4, 30.6] },
      { items: [{}, { maxSize: '20%' }, {}], expected: [39.5918, 20.8163, 39.5918] },
      { items: [{}, {}, { maxSize: '20%' }, { maxSize: '20%' }], expected: [28.75, 28.75, 21.25, 21.25] },
      { items: [{}, { maxSize: '20%' }, {}, { maxSize: '10%' }], expected: [34.0625, 21.25, 34.0625, 10.625] },
      { items: [{}, { maxSize: '20%' }, {}, { maxSize: '40%' }], expected: [26.25, 21.25, 26.25, 26.25] },
      { items: [{ maxSize: '20%' }, { size: '10%' }, {}], expected: [20.8163, 10.4082, 68.7755] },
      { items: [{ maxSize: '10%' }, { maxSize: '10%' }, { maxSize: '10%' }], expected: [10.4082, 10.4082, 79.1837] },
    ];

    cases.forEach(({ items, expected }) => {
      it(`items: ${JSON.stringify(items)}`, () => {
        const layout = getDefaultLayout(
          getItemRestrictions(items, 408, (items.length - 1) * 8),
        );

        layout.forEach((grow, index) => {
          expect(grow).toBeCloseTo(expected[index], 3);
        });
      });
    });
  });
});
