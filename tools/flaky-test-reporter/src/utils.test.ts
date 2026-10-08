import { mapWithConcurrency } from './utils';

describe('mapWithConcurrency', () => {
  it('preserves input order regardless of completion order', async () => {
    const delays = [30, 5, 20, 1, 15];
    const result = await mapWithConcurrency(delays, 2, async (delay) => {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return delay;
    });

    expect(result).toEqual(delays);
  });

  it('never exceeds the limit', async () => {
    let inFlight = 0;
    let peak = 0;

    await mapWithConcurrency(
      Array.from({ length: 20 }, (_, i) => i),
      4,
      async () => {
        inFlight += 1;
        peak = Math.max(peak, inFlight);
        await new Promise((resolve) => setTimeout(resolve, 1));
        inFlight -= 1;
      },
    );

    expect(peak).toBeLessThanOrEqual(4);
  });

  it.each([0, -1, 1.5, Number.NaN])(
    'rejects a limit of %p instead of returning holes',
    async (limit) => {
      await expect(mapWithConcurrency([1, 2, 3], limit, async (n) => n)).rejects.toThrow(
        /positive integer/,
      );
    },
  );

  it('handles an empty list', async () => {
    await expect(mapWithConcurrency([], 4, async () => 1)).resolves.toEqual([]);
  });
});
