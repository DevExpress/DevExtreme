/** Warnings go to stderr so stdout stays free for the tool's own progress output. */
export function warn(message: string): void {
  console.error(`warning: ${message}`);
}

/** Runs `worker` over `items` with at most `limit` in flight, preserving input order. */
export async function mapWithConcurrency<TItem, TResult>(
  items: TItem[],
  limit: number,
  worker: (item: TItem) => Promise<TResult>,
): Promise<TResult[]> {
  const results = new Array<TResult>(items.length);
  let next = 0;

  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    for (;;) {
      const index = next;
      next += 1;
      if (index >= items.length) return;
      results[index] = await worker(items[index]);
    }
  });

  await Promise.all(runners);
  return results;
}
