import { isDxMouseWheelEvent } from '@js/common/core/events/utils/index';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { PointerInteractionEvent } from '@js/events';

type PointerInteractionEventTarget = Element | null;

interface TextBoxScrollData {
  validate: (e: PointerInteractionEvent & {
    target?: PointerInteractionEventTarget;
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
  const scrollTopPos = Number(shiftKey
    ? $container.scrollLeft<number | undefined>()
    : $container.scrollTop<number | undefined>());

  const prop = shiftKey ? 'Width' : 'Height';

  const scrollSize = Number($container.prop<unknown>(`scroll${prop}`));
  const clientSize = Number($container.prop<unknown>(`client${prop}`));

  // NOTE: round to the nearest integer towards zero
  const scrollBottomPos = Math.trunc(scrollSize - clientSize - scrollTopPos);

  if (scrollTopPos === 0 && scrollBottomPos === 0) {
    return false;
  }

  const isScrollFromTop = scrollTopPos === 0 && delta >= 0;
  const isScrollFromBottom = scrollBottomPos === 0 && delta <= 0;
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
    eventTarget: PointerInteractionEventTarget,
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
