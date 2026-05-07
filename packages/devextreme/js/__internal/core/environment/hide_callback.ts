interface HideCallback {
  add: (callback: Function) => void;
  remove: (callback: Function) => void;
  fire: () => boolean;
  hasCallback: () => boolean;
  reset: () => void;
}

// eslint-disable-next-line func-names
export const hideCallback = (function (): HideCallback {
  let callbacks: Function[] = [];
  return {
    add(callback: Function): void {
      if (!callbacks.includes(callback)) {
        callbacks.push(callback);
      }
    },
    remove(callback: Function): void {
      const indexOfCallback = callbacks.indexOf(callback);
      if (indexOfCallback !== -1) {
        callbacks.splice(indexOfCallback, 1);
      }
    },
    fire(): boolean {
      const callback = callbacks.pop();
      const result = !!callback;
      if (result) {
        callback();
      }
      return result;
    },
    hasCallback(): boolean {
      return callbacks.length > 0;
    },
    /// #DEBUG

    reset(): void {
      callbacks = [];
    },
    /// #ENDDEBUG
  };
}());

export const fireCallback = (): boolean => hideCallback.fire();
