import { fx } from '@js/common/core/animation';
import { move } from '@js/common/core/animation/translator';
import { Deferred } from '@js/core/utils/deferred';
import { getWidth } from '@js/core/utils/size';

import EditDecorator from './m_list.edit.decorator';
import { register as registerDecorator } from './m_list.edit.decorator_registry';

registerDecorator(
  'delete',
  'swipe',
  EditDecorator.inherit({

    _shouldHandleSwipe: true,

    _renderItemPosition($itemElement, offset, animate) {
      const deferred = Deferred();
      const itemOffset = offset * this._itemElementWidth;

      if (animate) {
        fx.animate($itemElement, {
          to: { left: itemOffset },
          type: 'slide',
          complete() {
            deferred.resolve($itemElement, offset);
          },
        });
      } else {
        move($itemElement, { left: itemOffset });
        deferred.resolve();
      }

      return deferred.promise();
    },

    _swipeStartHandler($itemElement) {
      this._itemElementWidth = getWidth($itemElement);
      return true;
    },

    _swipeUpdateHandler($itemElement, args) {
      this._renderItemPosition($itemElement, args.offset);
      return true;
    },

    _swipeEndHandler($itemElement, args) {
      const offset = args.targetOffset;

      this._renderItemPosition($itemElement, offset, true).done(($itemElement, offset) => {
        if (Math.abs(offset)) {
          this._list.deleteItem($itemElement).fail(() => {
            this._renderItemPosition($itemElement, 0, true);
          });
        }
      });
      return true;
    },
  }),
);
