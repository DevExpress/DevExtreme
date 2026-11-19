/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import type { FunnelDataItem } from './funnel';

const CENTER = 0.5;

export default {
  getFigures(data: number[]): number[][] {
    const height = 1 / data.length;

    return data.map((value, index, array) => {
      const nextValue = array[index + 1] ? array[index + 1] : array[index];
      return [
        CENTER - value / 2, height * index,
        CENTER + value / 2, height * index,
        CENTER + nextValue / 2, height * (index + 1),
        CENTER - nextValue / 2, height * (index + 1),
      ];
    });
  },

  normalizeValues(items: FunnelDataItem[]): number[] {
    const max = items.reduce(
      (max, item) => Math.max(item.value, max),
      (items[0] && items[0].value) || 0,
    );

    return items.map((item) => item.value / max);
  },
};
