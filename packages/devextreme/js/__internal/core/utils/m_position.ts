import config from '@js/core/config';
import { isWindow } from '@js/core/utils/type';

const getDefaultAlignment = (isRtlEnabled?: boolean): 'left' | 'right' => {
  const rtlEnabled = isRtlEnabled ?? config().rtlEnabled;

  return rtlEnabled ? 'right' : 'left';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- callers read DOMRect members
const getBoundingRect = (element: unknown): any => {
  if (isWindow(element)) {
    return {
      width: element.outerWidth,
      height: element.outerHeight,
    };
  }

  return (element as Partial<Pick<Element, 'getBoundingClientRect'>>).getBoundingClientRect?.();
};

export {
  getBoundingRect,
  getDefaultAlignment,
};
