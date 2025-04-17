// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BaseFunctionType = (...args: any[]) => any;

export interface NavigationItem {
  focus: () => void;
  getElement: () => HTMLElement | null;
}

export interface ActiveItem {
  idx: number;
  element: HTMLElement;
}
