// eslint-disable-next-line no-restricted-globals
const macroTaskIdSet = new Set<ReturnType<typeof setTimeout>>();

export const schedule = async (
  callback: () => void,
  macroTaskTimeoutMs: number,
): Promise<void> => new Promise<void>((resolve) => {
  // NOTE: Used setTimeout here because this method is used in heavy calculations
  // and we wouldn't like to freeze the event loop by them
  // eslint-disable-next-line no-restricted-globals
  const taskId = setTimeout(() => {
    callback();
    macroTaskIdSet.delete(taskId);
    resolve();
  }, macroTaskTimeoutMs);
  macroTaskIdSet.add(taskId);
});

export const dispose = (): void => {
  macroTaskIdSet.forEach((id) => clearTimeout(id));
};

export default {
  schedule,
  dispose,
};
