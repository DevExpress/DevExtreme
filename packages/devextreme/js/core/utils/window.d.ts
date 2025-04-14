export declare function getWindow(): Window;
export declare function hasWindow(): boolean;
export declare function getNavigator(): Navigator;
export declare function hasProperty(property: string): boolean;
export declare function setWindow(
  newWindowObject: Window | Record<string, unknown>,

  hasWindow?: boolean
): void;
