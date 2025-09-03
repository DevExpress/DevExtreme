/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

const CENTER = 0.5;

export default {
  getFigures(data) {
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

  normalizeValues(items) {
    // eslint-disable-next-line @stylistic/max-len
    const max = items.reduce((max, item) => Math.max(item.value, max), items[0] && items[0].value || 0);

    return items.map((item) => item.value / max);
  },
};
