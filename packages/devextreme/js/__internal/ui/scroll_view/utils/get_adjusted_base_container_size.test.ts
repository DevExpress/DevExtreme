import { describe, expect, it } from '@jest/globals';

import { getAdjustedBaseContainerSize } from './get_adjusted_base_container_size';

describe('getAdjustedBaseContainerSize', () => {
  it('should not adjust when zoom is 100% even if sizes differ by 1px', () => {
    const result = getAdjustedBaseContainerSize(100, 100, 101);

    expect(result).toBe(100);
  });

  it('should adjust when zoomed and sizes differ by 1px', () => {
    const result = getAdjustedBaseContainerSize(99.82, 100, 101);

    expect(result).toBe(101);
  });

  it('should not adjust when zoomed but sizes differ by more than 1px', () => {
    const result = getAdjustedBaseContainerSize(99.82, 100, 102);

    expect(result).toBe(100);
  });

  it('should not adjust when zoomed and container is larger than content', () => {
    const result = getAdjustedBaseContainerSize(99.82, 101, 100);

    expect(result).toBe(101);
  });

  it('should not adjust when zoomed and sizes are equal', () => {
    const result = getAdjustedBaseContainerSize(99.82, 100, 100);

    expect(result).toBe(100);
  });
});
