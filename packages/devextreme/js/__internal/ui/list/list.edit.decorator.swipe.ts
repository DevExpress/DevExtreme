import { fx } from '@js/common/core/animation';
import { move } from '@js/common/core/animation/translator';
import type { dxElementWrapper } from '@js/core/renderer';
import { Deferred } from '@js/core/utils/deferred';
import { getWidth } from '@js/core/utils/size';
import type { DxEvent } from '@js/events';
import type { SwipeEndArgs, SwipeUpdateArgs } from '@ts/ui/list/list.edit.decorator';
import EditDecorator from '@ts/ui/list/list.edit.decorator';
import { register as registerDecorator } from '@ts/ui/list/list.edit.decorator_registry';

class EditDecoratorSwipe extends EditDecorator {
  _itemElementWidth!: number;

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

  _swipeStartHandler($itemElement: dxElementWrapper): void {
    this._itemElementWidth = getWidth($itemElement);
  }

  _swipeUpdateHandler($itemElement: dxElementWrapper, e: DxEvent & SwipeUpdateArgs): void {
    const { offset } = e;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._renderItemPosition($itemElement, offset);
  }

  _swipeEndHandler($itemElement: dxElementWrapper, e: DxEvent & SwipeEndArgs): void {
    const { targetOffset } = e;

    this._renderItemPosition($itemElement, targetOffset, true)
      // @ts-expect-error ts-error
      .done(($element: dxElementWrapper, offset: number): void => {
        if (Math.abs(offset)) {
          // @ts-expect-error ts-error
          this._list.deleteItem($element.get(0)).fail((): void => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this._renderItemPosition($element, 0, true);
          });
        }
      });
  }
}

registerDecorator(
  'delete',
  'swipe',
  EditDecoratorSwipe,
);
