interface ScrollOffset {
  top?: number;
  left?: number;
}

type ScrollToFunc = (params: ScrollOffset) => void;

interface ScrollableInstance {
  scrollTo: ScrollToFunc;
}

export function getMemoizeScrollTo(instance: ScrollableInstance): ScrollToFunc {
  let lastParams: ScrollOffset = {};

  return (params): void => {
    const normalizedParams = {
      top: params?.top !== undefined ? Math.ceil(params.top) : undefined,
      left: params?.left !== undefined ? Math.ceil(params.left) : undefined,
    };

    const isSameParams = normalizedParams?.top === lastParams?.top
      && normalizedParams?.left === lastParams?.left;

    if (isSameParams) {
      return;
    }

    lastParams = normalizedParams;
    instance.scrollTo(params);
  };
}
