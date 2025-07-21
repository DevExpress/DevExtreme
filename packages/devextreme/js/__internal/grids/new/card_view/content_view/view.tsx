/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable
  @typescript-eslint/explicit-function-return-type,
  @typescript-eslint/explicit-module-boundary-types,
  spellcheck/spell-checker
*/
import { compileGetter } from '@js/core/utils/data';
import { isDefined } from '@js/core/utils/type';
import { computed, effect, signal } from '@ts/core/state_manager/index';
import type { OptionsController } from '@ts/grids/new/card_view/options_controller';
import type { CardInfo } from '@ts/grids/new/grid_core/columns_controller/types';
import {
  NavigationStrategyMatrix,
} from '@ts/grids/new/grid_core/keyboard_navigation/index';

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

  private readonly rowHeight = signal(0);

  protected readonly columnGap = signal(0);

  private readonly cardsPerRowProp = this.options.oneWay('cardsPerRow');

  private readonly cardsPerRow = computed(
    () => {
      const width = this.width.value;
      const cardMinWidth = this.cardMinWidth.value;
      const pageSize = this.dataController.pageSize.value;
      const cardsPerRowProp = this.cardsPerRowProp.value;

      if (cardsPerRowProp !== 'auto') {
        return cardsPerRowProp;
      }

      const result = factors(pageSize).reverse().find((cardsPerRow) => {
        const cardWidth = (width - this.columnGap.value * (cardsPerRow - 1)) / cardsPerRow;

        return cardMinWidth <= cardWidth;
      });

      return result ?? 1;
    },
  );

  protected readonly navigationStrategy = new NavigationStrategyMatrix(
    this.cardsPerRow.peek(),
  );

  protected override component = ContentViewComponent;

  private readonly items = computed(
    () => this.itemsController.items.value
      .filter((item) => item.visible),
  );

  constructor(...args) {
    // @ts-expect-error
    super(...args);

    effect(() => {
      this.navigationStrategy.updateColumnsCount(this.cardsPerRow.value);
    });
  }

  protected override getProps() {
    return computed(() => ({
      ...this.getBaseProps(),
      contentProps: {
        items: this.items.value,
        kbnEnabled: this.keyboardNavigationController.enabled.value,
        navigationStrategy: this.navigationStrategy,
        isLoading: this.dataController.isReloading.value,
        needToHiddenCheckBoxes: this.selectionController.needToHiddenCheckBoxes.value,
        cardsPerRow: this.cardsPerRow.value,
        onRowHeightChange: (height) => { this.rowHeight.value = height; },
        onFirstElementChange: (firstElement: HTMLDivElement | undefined): void => {
          this.keyboardNavigationController.setFirstCardElement(firstElement);
        },
        onColumnGapChange: (gap: number): void => {
          this.columnGap.value = gap;
        },
        onPageChange: this.onPageChange.bind(this),
        showCardContextMenu: this.showCardContextMenu.bind(this),
        wordWrapEnabled: this.options.oneWay('wordWrapEnabled').value,
        cardProps: {
          minWidth: this.cardMinWidth.value,
          maxWidth: this.options.oneWay('cardMaxWidth').value,
          fieldHintEnabled: this.options.oneWay('fieldHintEnabled').value,
          isCheckBoxesRendered: this.selectionController.isCheckBoxesRendered.value,
          allowSelectOnClick: this.selectionController.allowSelectOnClick.value,
          onHold: this.onCardHold.bind(this),
          onClick: this.options.action('onCardClick').value,
          onDblClick: this.options.action('onCardDblClick').value,
          onHoverChanged: this.options.action('onCardHoverChanged').value,
          onPrepared: this.options.action('onCardPrepared').value,
          fieldProps: {
            captionProps: {
              onClick: this.options.action('onFieldCaptionClick').value as any,
              onDblClick: this.options.action('onFieldCaptionDblClick').value as any,
              onPrepared: this.options.action('onFieldCaptionPrepared').value as any,
            },
            valueProps: {
              onClick: this.options.action('onFieldValueClick').value as any,
              onDblClick: this.options.action('onFieldValueDblClick').value as any,
              onPrepared: this.options.action('onFieldValuePrepared').value as any,
            },
          },
          onEdit: (key: Key, returnFocusTo?: HTMLElement) => {
            this.keyboardNavigationController.setReturnFocusTo(returnFocusTo);
            this.editingController.editCard(key);
          },
          onDelete: (key: Key, returnFocusTo?: HTMLElement) => {
            this.keyboardNavigationController.setReturnFocusTo(returnFocusTo);

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.editingController.deleteCard(key);
          },
          allowUpdating: this.editingController.allowUpdating.value,
          allowDeleting: this.editingController.allowDeleting.value,
          footerTemplate: this.options.template('cardFooterTemplate').value,
          template: this.options.template('cardTemplate').value,
          contentTemplate: this.options.template('cardContentTemplate').value,
          cover: {
            imageExpr: this.processExpr(
              this.options.oneWay('cardCover.imageExpr').value,
            ),
            altExpr: this.processExpr(
              this.options.oneWay('cardCover.altExpr').value,
            ),
            // NOTE: Default value set in SCSS (180px / 140px)
            maxHeight: this.options.oneWay('cardCover.maxHeight').value,
            ratio: this.options.oneWay('cardCover.aspectRatio').value,
            template: this.options.template('cardCover.template').value,
          },
          header: {
            visible: this.options.oneWay('cardHeader.visible').value,
            items: this.options.oneWay('cardHeader.items').value,
            template: this.options.template('cardHeader.template').value,
          },

          toolbar: this.options.oneWay('cardHeader.items').value as any,
          selectCard: this.selectCard.bind(this),
          onSelectAllCards: this.onSelectAllCards.bind(this),
          onSearchFocus: () => {
            this.searchUIController.doUIAction('focusSearchTextBox');
          },
          onFocusedCardChanged: (card: CardInfo, cardIdx: number, element: HTMLElement) => {
            this.keyboardNavigationController.onFocusedCardChanged(card, cardIdx, element);
          },
        },
      },
    }));
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

  private selectCard(card: CardInfo, options: SelectCardOptions) {
    if (options.needToUpdateCheckboxes) {
      this.selectionController.updateSelectionCheckBoxesVisible(true);
    }

    this.selectionController.changeCardSelection(card.index, options);
  }

  private onCardHold(e: CardHoldEvent) {
    this.selectionController.processLongTap(e.card);
  }

  private showCardContextMenu(e: MouseEvent, card?: CardInfo, cardIndex?: number): void {
    this.contextMenuController.show(e, 'content', { card, cardIndex });
  }

  private onSelectAllCards(): void {
    this.selectionController.selectAll();
  }

  private onPageChange(value: number) {
    if (value < 0) {
      this.dataController.decreasePageIndex();
    } else {
      this.dataController.increasePageIndex();
    }
  }
}
