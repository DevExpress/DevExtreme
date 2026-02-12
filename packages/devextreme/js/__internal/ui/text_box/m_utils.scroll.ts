import { isDxMouseWheelEvent } from '@js/common/core/events/utils/index';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { PointerInteractionEvent } from '@js/events';

interface TextBoxScrollData {
  validate: (e: PointerInteractionEvent & {
    target?: dxElementWrapper;
    delta?: number;
    _needSkipEvent?: boolean;
  }) => boolean;
}

export const allowScroll = (
  container: dxElementWrapper,
  delta: number,
  shiftKey?: boolean,
): boolean | undefined => {
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

  return undefined;
};

export const prepareScrollData = (
  container: dxElementWrapper,
  validateTarget?: boolean,
): TextBoxScrollData => {
  const $container = $(container);

  const isCorrectTarget = (
    eventTarget: dxElementWrapper | HTMLElement,
  ): boolean => (validateTarget ? $(eventTarget).is(container) : true);

  const scrollData: TextBoxScrollData = {
    validate: (e) => {
      if (isDxMouseWheelEvent(e) && isCorrectTarget(e.target)) {
        if (allowScroll($container, -(e.delta ?? 0), e.shiftKey)) {
          e._needSkipEvent = true;

          return true;
        }

        return false;
      }

      return false;
    },
  };

  return scrollData;
};
