/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { compileGetter } from '@js/core/utils/data';
import { isDefined } from '@js/core/utils/type';
import { combined, computed, state } from '@ts/core/reactive/index';
import type { OptionsController } from '@ts/grids/new/card_view/options_controller';
import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';

import { ContentView as ContentViewBase } from '../../grid_core/content_view/view';
import type { DataObject, Key } from '../../grid_core/data_controller/types';
import type { ContentViewProps } from './content_view';
import { ContentView as ContentViewComponent } from './content_view';
import type { CardHoldEvent, SelectCardOptions } from './types';
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

  protected override component = ContentViewComponent;

  protected override getProps() {
    return combined({
      ...this.getBaseProps(),
      contentProps: combined({
        items: this.itemsController.items,
        needToHiddenCheckBoxes: this.selectionController.needToHiddenCheckBoxes,
        fieldTemplate: this.options.template('fieldTemplate'),
        cardsPerRow: this.cardsPerRow,
        onRowHeightChange: this.rowHeight.update.bind(this.rowHeight),
        cardProps: combined({
          minWidth: this.cardMinWidth,
          maxWidth: this.options.oneWay('cardMaxWidth'),
          isCheckBoxesRendered: this.selectionController.isCheckBoxesRendered,
          allowSelectOnClick: this.selectionController.allowSelectOnClick,
          onHold: this.onCardHold.bind(this),
          onClick: this.options.action('onCardClick'),
          onDblClick: this.options.action('onCardDblClick'),
          onHoverChanged: this.options.action('onCardHoverChanged'),
          onPrepared: this.options.action('onCardPrepared'),
          onEdit: (key: Key) => { this.editingController.editRow(key); },

          onDelete: (key: Key) => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.editingController.deleteRow(key);
          },
          allowUpdating: this.editingController.allowUpdating,
          allowDeleting: this.editingController.allowDeleting,
          cover: combined({
            imageExpr: computed(
              (imageExpr) => this.processExpr(imageExpr),
              [this.options.oneWay('cardCover.imageExpr')],
            ),
            altExpr: computed(
              (altExpr) => this.processExpr(altExpr),
              [this.options.oneWay('cardCover.altExpr')],
            ),
            maxHeight: this.options.oneWay('cardCover.maxHeight'),
            ratio: this.options.oneWay('cardCover.ratio'),
          }),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          toolbar: this.options.oneWay('cardHeader.items') as any,
          selectCard: this.selectCard.bind(this),
        }),
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

  private selectCard(row: DataRow, options: SelectCardOptions) {
    if (options.needToUpdateCheckboxes) {
      this.selectionController.updateSelectionCheckBoxesVisible(true);
    }

    this.selectionController.changeCardSelection(row.index, options);
  }

  private onCardHold(e: CardHoldEvent) {
    this.selectionController.processLongTap(e.row);
  }
}
