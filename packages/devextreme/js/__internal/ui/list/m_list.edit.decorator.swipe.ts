import { fx } from '@js/common/core/animation';
import { move } from '@js/common/core/animation/translator';
import type { dxElementWrapper } from '@js/core/renderer';
import { Deferred } from '@js/core/utils/deferred';
import { getWidth } from '@js/core/utils/size';
import type { SwipeEndEvent, SwipeUpdateEvent } from '@ts/events/m_swipe';

import EditDecorator from './m_list.edit.decorator';
import { register as registerDecorator } from './m_list.edit.decorator_registry';

class EditDecoratorSwipe extends EditDecorator {
  _itemElementWidth!: number;

  // eslint-disable-next-line class-methods-use-this
  _shouldHandleSwipe(): boolean {
    return true;
  }

  _renderItemPosition(
    $itemElement: dxElementWrapper,
    offset: number,
    animate?: boolean,
  ): Promise<unknown> {
    const deferred = Deferred();
    const itemOffset = offset * this._itemElementWidth;

    if (animate) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fx.animate($itemElement.get(0), {
        to: { left: itemOffset },
        type: 'slide',
        complete(): void {
          deferred.resolve($itemElement, offset);
        },
      });
    } else {
      move($itemElement, { left: itemOffset });
      deferred.resolve();
    }

    return deferred.promise();
  }

  _swipeStartHandler($itemElement: dxElementWrapper): boolean {
    this._itemElementWidth = getWidth($itemElement);
    return true;
  }

  _swipeUpdateHandler($itemElement: dxElementWrapper, args: SwipeUpdateEvent['event']): boolean {
    const { offset } = args;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._renderItemPosition($itemElement, offset);
    return true;
  }

  _swipeEndHandler($itemElement: dxElementWrapper, args: SwipeEndEvent['event']): boolean {
    const { targetOffset } = args;

    this._renderItemPosition($itemElement, targetOffset, true)
      // @ts-expect-error ts-error
      .done(($element: dxElementWrapper, offset: number): void => {
        if (Math.abs(offset)) {
          // @ts-expect-error ts-error
          this._list.deleteItem($element).fail((): void => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this._renderItemPosition($element, 0, true);
          });
        }
      });
    return true;
  }
}

registerDecorator(
  'delete',
  'swipe',
  EditDecoratorSwipe,
);
