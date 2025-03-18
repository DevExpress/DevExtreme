/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { compileGetter } from '@js/core/utils/data';
import { isDefined } from '@js/core/utils/type';
import { combined, computed, state } from '@ts/core/reactive/index';
import type { OptionsController } from '@ts/grids/new/card_view/options_controller';

import { ContentView as ContentViewBase } from '../../grid_core/content_view/view';
import type { DataObject } from '../../grid_core/data_controller/types';
import type { ContentViewProps } from './content_view';
import { ContentView as ContentViewComponent } from './content_view';
import { factors } from './utils';

export class ContentView extends ContentViewBase<ContentViewProps> {
  // @ts-expect-error
  protected options: OptionsController;

  private readonly cardMinWidth = this.options.oneWay('cardMinWidth');

  private readonly rowHeight = state(0);

  private readonly cardsPerRow = computed(
    (width, cardMinWidth, pageSize, cardsPerRowProp) => {
      if (cardsPerRowProp !== 'auto') {
        return cardsPerRowProp;
      }

      const result = factors(pageSize).reverse().find((cardsPerRow) => {
        const cardWidth = (width - 6 * (cardsPerRow - 1)) / cardsPerRow;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return cardMinWidth! <= cardWidth;
      });

      return result ?? 1;
    },
    [this.width, this.cardMinWidth, this.dataController.pageSize, this.options.oneWay('cardsPerRow')],
  );

  private readonly virtualState = computed(
    (items, scrollTop, viewportHeight, rowHeight, cardsPerRow) => {
      const scrollHeight = (items.length / cardsPerRow) * rowHeight;

      const scrollBottom = scrollHeight - viewportHeight - scrollTop;

      const nonVisibleRowCountUp = Math.floor(scrollTop / rowHeight);
      const nonVisibleRowCountBottom = Math.floor(scrollBottom / rowHeight);

      const virtualTop = nonVisibleRowCountUp * rowHeight;
      const virtualBottom = nonVisibleRowCountBottom * rowHeight;

      const virtualItems = items.slice(
        nonVisibleRowCountUp * cardsPerRow,
        items.length - nonVisibleRowCountBottom * cardsPerRow,
      );

      return {
        virtualTop,
        virtualBottom,
        virtualItems,
      };
    },
    [
      this.itemsController.items,
      this.scrollTop,
      this.viewportHeight,
      this.rowHeight,
      this.cardsPerRow,
    ],
  );

  protected override component = ContentViewComponent;

  protected override getProps() {
    return combined({
      ...this.getBaseProps(),
      contentProps: combined({
        items: this.itemsController.items,
        // items: computed((virtualState) => virtualState.virtualItems, [this.virtualState]),
        fieldTemplate: this.options.template('fieldTemplate'),
        cardsPerRow: this.cardsPerRow,
        onRowHeightChange: this.rowHeight.update.bind(this.rowHeight),
        cardProps: combined({
          minWidth: this.cardMinWidth,
          maxWidth: this.options.oneWay('cardMaxWidth'),
          onClick: this.options.action('onCardClick'),
          onDblClick: this.options.action('onCardDblClick'),
          onHoverChanged: this.options.action('onCardHoverChanged'),
          onPrepared: this.options.action('onCardPrepared'),
          template: this.options.template('cardTemplate'),
          cover: combined({
            imageExpr: computed(
              (imageExpr) => this.processExpr(imageExpr),
              [this.options.oneWay('cardCover.imageExpr')],
            ),
            altExpr: computed(
              (altExpr) => this.processExpr(altExpr),
              [this.options.oneWay('cardCover.altExpr')],
            ),
          }),
          header: combined({
            captionExpr: computed(
              (captionExpr) => this.processExpr(captionExpr),
              [this.options.oneWay('cardHeader.captionExpr')],
            ),
          }),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          toolbar: this.options.oneWay('cardHeader.items') as any,
        }),
      }),
      virtualScrollingProps: combined({
        heightUp: 0,
        heightDown: 0,
        // heightUp: computed((virtualState) => virtualState.virtualTop, [this.virtualState]),
        // heightDown: computed((virtualState) => virtualState.virtualBottom, [this.virtualState]),
      }),
    });
  }

  private processExpr<T>(
    expr: T | ((data: DataObject) => T) | undefined,
  ): ((data: DataObject) => T) | undefined {
    if (!isDefined(expr)) {
      return undefined;
    }
    // @ts-expect-error
    return compileGetter(expr);
  }
}
