import pointerMock from '../../../helpers/pointerMock.js';

const REORDER_HANDLE_CLASS = 'dx-list-reorder-handle';

export const toSelector = (cssClass) => `.${cssClass}`;

export const reorderingPointerMock = ($item, clock, usePixel) => {
    const itemOffset = $item.offset().top;
    const itemHeight = $item.outerHeight();
    const scale = usePixel ? 1 : itemHeight;
    const $handle = $item.find(toSelector(REORDER_HANDLE_CLASS));
    const pointer = pointerMock($handle);

    return {
        dragStart: function(offset) {
            offset = offset || 0;

            pointer.start().down(0, itemOffset + scale * offset);

            if(clock) {
                clock.tick(30);
            }

            return this;
        },
        drag: function(offset) {
            offset = offset || 0;

            pointer.move(0, scale * offset);

            return this;
        },
        dragEnd: function() {
            pointer.up();

            return this;
        }
    };
};
