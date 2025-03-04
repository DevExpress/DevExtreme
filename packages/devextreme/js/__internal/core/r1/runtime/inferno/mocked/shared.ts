export const ERROR_MSG = 'a runtime error occured! Use Inferno in development environment to find the error.';

export function isNullOrUndef(o: any): o is undefined | null {
  return o === void 0 || o === null;
}

export function isInvalid(o: any): o is null | boolean | undefined {
  return o === null || o === false || o === true || o === void 0;
}

export function isFunction(o: any): o is Function {
  return typeof o === 'function';
}

export function isNull(o: any): o is null {
  return o === null;
}

export function throwError(message?: string) {
  if (!message) {
    message = ERROR_MSG;
  }
  throw new Error(`Inferno Error: ${message}`);
}
