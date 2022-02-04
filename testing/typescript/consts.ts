/* eslint-disable @typescript-eslint/no-type-alias */
export const ANY = undefined as any;

export function notAny<T>(x: 0 extends (1 & T) ? never : T): void { }
