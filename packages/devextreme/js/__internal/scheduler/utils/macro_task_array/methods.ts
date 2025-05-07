import macroTaskDispatcher from './dispatcher';

export const DEFAULT_STEPS_VALUE = 100;
export const DEFAULT_MACRO_TASK_TIMEOUT = 0;

export const macroTaskArrayForEach = async <TItem>(
  array: TItem[],
  callback: (item: TItem) => void,
  step = DEFAULT_STEPS_VALUE,
  macroTaskTimeoutMs = DEFAULT_MACRO_TASK_TIMEOUT,
): Promise<void> => {
  const promises: Promise<void>[] = [];
  const batchesCount = Math.ceil(array.length / step);

  for (let batchIdx = 0; batchIdx < batchesCount; batchIdx += 1) {
    const scheduledTask = macroTaskDispatcher.schedule(() => {
      const startIdx = batchIdx * step;
      const maxIdx = startIdx + step;

      for (let idx = startIdx; idx < maxIdx && array[idx] !== undefined; idx += 1) {
        callback(array[idx]);
      }
    }, macroTaskTimeoutMs);

    promises.push(scheduledTask);
  }

  await Promise.all(promises);
};

export const macroTaskArrayMap = async <TItem, TResult>(
  array: TItem[],
  callback: (item: TItem) => TResult,
  step = DEFAULT_STEPS_VALUE,
  macroTaskTimeoutMs = DEFAULT_MACRO_TASK_TIMEOUT,
): Promise<TResult[]> => {
  const result: TResult[] = [];
  await macroTaskArrayForEach(
    array,
    (item) => { result.push(callback(item)); },
    step,
    macroTaskTimeoutMs,
  );

  return result;
};
