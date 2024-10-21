export function throttle<Args extends unknown[], This = unknown>(
  func: (this: This, ...args: Args) => void,
  delay: number,
): (this: This, ...args: Args) => void {
  let timestamp = 0;

  // eslint-disable-next-line func-names
  return function (this: This, ...args: Args) {
    const now = Date.now();

    if (now - timestamp >= delay) {
      func.apply(this, args);

      timestamp = now;
    }
  };
}
