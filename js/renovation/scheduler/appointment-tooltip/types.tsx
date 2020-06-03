export type Color = string | undefined;
export type DeferredColor = Promise<Color> & JQueryPromise<Color>;
