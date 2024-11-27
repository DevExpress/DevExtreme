/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable spellcheck/spell-checker */
import type dxScrollable from '@js/ui/scroll_view/ui.scrollable';
import { combined, computed, state } from '@ts/core/reactive/index';
import { OptionsController } from '@ts/grids/new/card_view/options_controller';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import { View } from '@ts/grids/new/grid_core/core/view4';
import { DataController } from '@ts/grids/new/grid_core/data_controller';
import { ErrorController } from '@ts/grids/new/grid_core/error_controller/error_controller';
import { createRef } from 'inferno';

import type { ContentViewProps } from './content_view';
import { ContentView as ContentViewComponent } from './content_view';

export class ContentView extends View<ContentViewProps> {
  private readonly isNoData = computed(
    (isLoading, items) => !isLoading && items.length === 0,
    [this.dataController.isLoading, this.dataController.items],
  );

  private readonly items = computed(
    (dataItems, columns: Column[]) => dataItems.map(
      (item) => this.columnsController.createDataRow(
        item,
        columns,
      ),
    ),
    [this.dataController.items, this.columnsController.visibleColumns],
  );

  public readonly scrollableRef = createRef<dxScrollable>();

  private readonly cardMinWidth = this.options.oneWay('cardMinWidth');

  private readonly rowHeight = state(0);

  private readonly viewportHeight = state(0);

  private readonly scrollTop = state(0);

  private readonly scrollHeight = state(0);

  private readonly width = state(0);

  private readonly cardsPerRow = computed(
    (width, cardMinWidth, items, cardsPerRowProp) => {
      if (cardsPerRowProp !== 'auto') {
        return cardsPerRowProp;
      }

      function factors(n) {
        const res: number[] = [];
        for (let i = 1; i <= n; i += 1) if (n % i === 0) res.push(i);
        return res;
      }

      const result = factors(items.length).reverse().find((cardsPerRow) => {
        const cardWidth = (width - 6 * (cardsPerRow - 1)) / cardsPerRow;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return cardMinWidth! <= cardWidth;
      });

      return result ?? 1;
    },
    [this.width, this.cardMinWidth, this.items, this.options.oneWay('cardsPerRow')],
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
    [this.items, this.scrollTop, this.viewportHeight, this.rowHeight, this.cardsPerRow],
  );

  protected override component = ContentViewComponent;

  public static dependencies = [
    DataController, OptionsController, ErrorController, ColumnsController,
  ] as const;

  constructor(
    protected readonly dataController: DataController,
    protected readonly options: OptionsController,
    protected readonly errorController: ErrorController,
    protected readonly columnsController: ColumnsController,

  ) {
    super();
  }

  protected override getProps() {
    return combined({
      loadPanelProps: combined({
        visible: this.dataController.isLoading,
      }),
      noDataTextProps: combined({
        text: this.options.oneWay('noDataText'),
        visible: this.isNoData,
      }),
      errorRowProps: combined({
        errors: this.errorController.errors,
      }),
      contentProps: combined({
        items: this.items,
        // items: computed((virtualState) => virtualState.virtualItems, [this.virtualState]),
        fieldTemplate: this.options.template('fieldTemplate'),
        cardsPerRow: this.cardsPerRow,
        onRowHeightChange: this.rowHeight.update.bind(this.rowHeight),
        onWidthChange: this.width.update.bind(this.width),
      }),
      virtualScrollingProps: combined({
        // heightUp: 0,
        heightDown: 0,
        // heightUp: computed((virtualState) => virtualState.virtualTop, [this.virtualState]),
        // heightDown: computed((virtualState) => virtualState.virtualBottom, [this.virtualState]),
      }),
      onViewportHeightChange: this.viewportHeight.update.bind(this.viewportHeight),
      scrollTop: this.scrollTop,
      onScroll: this.onScroll.bind(this),
    });
  }

  private onScroll(scrollTop: number) {
    this.scrollTop.update(scrollTop);
  }
}
