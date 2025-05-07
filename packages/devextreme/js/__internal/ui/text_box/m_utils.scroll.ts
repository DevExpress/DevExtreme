import { isDxMouseWheelEvent } from '@js/common/core/events/utils/index';
import $ from '@js/core/renderer';

// @ts-expect-error
const allowScroll = function (container, delta, shiftKey?: boolean) {
  const $container = $(container);
  const scrollTopPos = shiftKey ? $container.scrollLeft() : $container.scrollTop();

  const prop = shiftKey ? 'Width' : 'Height';
  // @ts-expect-error
  const scrollSize = $container.prop(`scroll${prop}`);
  // @ts-expect-error
  const clientSize = $container.prop(`client${prop}`);
  // @ts-expect-error
  // NOTE: round to the nearest integer towards zero
  const scrollBottomPos = (scrollSize - clientSize - scrollTopPos) | 0;
  // @ts-expect-error
  if (scrollTopPos === 0 && scrollBottomPos === 0) {
    return false;
  }
  // @ts-expect-error
  const isScrollFromTop = scrollTopPos === 0 && delta >= 0;
  const isScrollFromBottom = scrollBottomPos === 0 && delta <= 0;
  // @ts-expect-error
  const isScrollFromMiddle = scrollTopPos > 0 && scrollBottomPos > 0;

  if (isScrollFromTop || isScrollFromBottom || isScrollFromMiddle) {
    return true;
  }
};

const prepareScrollData = function (container, validateTarget?: any) {
  const $container = $(container);
  const isCorrectTarget = function (eventTarget) {
    return validateTarget ? $(eventTarget).is(container) : true;
  };

  return {
    // @ts-expect-error
    validate(e) {
      if (isDxMouseWheelEvent(e) && isCorrectTarget(e.target)) {
        if (allowScroll($container, -e.delta, e.shiftKey)) {
          e._needSkipEvent = true;
          return true;
        }
        return false;
      }
    },
  };
};

export {
  allowScroll,
  prepareScrollData,
};
