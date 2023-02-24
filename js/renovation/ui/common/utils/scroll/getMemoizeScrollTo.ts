export interface ScrollOffset {
  top?: number;
  left?: number;
}

export type ScrollToFunc = (params: ScrollOffset, force?: boolean) => void;

export interface ScrollableInstance {
  scrollTo: ScrollToFunc;
}

export function getMemoizeScrollTo(getScrollableInstance: () => ScrollableInstance): ScrollToFunc {
  const instance = getScrollableInstance();
  let lastParams: ScrollOffset = {};

  return (params: ScrollOffset, force = false): void => {
    const normalizedParams = {
      top: params.top !== undefined ? Math.ceil(params.top) : undefined,
      left: params.left !== undefined ? Math.ceil(params.left) : undefined,
    };

    const isSameParams = normalizedParams.top === lastParams.top
      && normalizedParams.left === lastParams.left;

    if (!force && isSameParams) {
      return;
    }

    lastParams = normalizedParams;
    instance.scrollTo(params);
  };
}
