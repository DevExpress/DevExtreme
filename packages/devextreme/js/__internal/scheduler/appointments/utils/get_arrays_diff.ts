interface NoChanges<A> { item: A }
interface ToRemove<A> { item: A; needToRemove: true }
interface ToAdd<B> { item: B; needToAdd: true }

export type DiffItem<A, B> = | NoChanges<B>
  | ToRemove<A>
  | ToAdd<B>;

export const isNeedToRemove = <A, B>(
  item: DiffItem<A, B>,
): item is ToRemove<A> => (item as ToRemove<A>).needToRemove;

export const isNeedToAdd = <A, B>(
  item: DiffItem<A, B>,
): item is ToAdd<B> => (item as ToAdd<B>).needToAdd;

export function getArraysDiff<A, B = A>(
  a: A[],
  b: B[],
  equal: (x: A, y: B) => boolean,
): DiffItem<A, B>[] {
  const n = a.length;
  const m = b.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));

  for (let i = 1; i <= n; i += 1) {
    const ai = a[i - 1];
    for (let j = 1; j <= m; j += 1) {
      dp[i][j] = equal(ai, b[j - 1])
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const result: DiffItem<A, B>[] = [];
  let i = n;
  let j = m;

  while (i > 0 && j > 0) {
    if (equal(a[i - 1], b[j - 1])) {
      result.push({ item: b[j - 1] });
      i -= 1;
      j -= 1;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      result.push({ item: a[i - 1], needToRemove: true });
      i -= 1;
    } else {
      result.push({ item: b[j - 1], needToAdd: true });
      j -= 1;
    }
  }

  while (i > 0) {
    result.push({ item: a[i - 1], needToRemove: true });
    i -= 1;
  }
  while (j > 0) {
    result.push({ item: b[j - 1], needToAdd: true });
    j -= 1;
  }

  result.reverse();
  return result;
}
