/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable spellcheck/spell-checker */
import type dxScrollable from '@js/ui/scroll_view/ui.scrollable';
import type { ScrollEventInfo } from '@js/ui/scroll_view/ui.scrollable';
import { combined, computed, state } from '@ts/core/reactive/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import { View } from '@ts/grids/new/grid_core/core/view';
import { DataController } from '@ts/grids/new/grid_core/data_controller/index';
import { ErrorController } from '@ts/grids/new/grid_core/error_controller/error_controller';
import { createRef } from 'inferno';

import { OptionsController } from '../options_controller/options_controller';

export abstract class ContentView<TProps extends {}> extends View<TProps> {
  private readonly isNoData = computed(
    (isLoading, items) => !isLoading && items.length === 0,
    [this.dataController.isLoading, this.dataController.items],
  );

  public readonly items = computed(
    (dataItems, columns: Column[]) => dataItems.map(
      (item) => this.columnsController.createDataRow(
        item,
        columns,
      ),
    ),
    [this.dataController.items, this.columnsController.visibleColumns],
  );

  public readonly scrollableRef = createRef<dxScrollable>();

  public loadingText = this.options.twoWay('loadPanel.message');

  protected readonly viewportHeight = state(0);

  protected readonly scrollTop = state(0);

  protected readonly width = state(0);

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

  protected getBaseProps() {
    return {
      loadPanelProps: computed(
        (visible, loadPanel) => ({
          ...loadPanel,
          visible,
        }),
        [
          this.dataController.isLoading,
          this.options.oneWay('loadPanel'),
        ],
      ),
      noDataTextProps: combined({
        text: this.options.oneWay('noDataText'),
        template: this.options.template('noDataTemplate'),
        visible: this.isNoData,
      }),
      errorRowProps: combined({
        enabled: this.options.oneWay('errorRowEnabled'),
        errors: this.errorController.errors,
      }),
      onWidthChange: this.width.update.bind(this.width),
      virtualScrollingProps: combined({
        heightUp: 0,
        heightDown: 0,
        // heightUp: computed((virtualState) => virtualState.virtualTop, [this.virtualState]),
        // heightDown: computed((virtualState) => virtualState.virtualBottom, [this.virtualState]),
      }),
      onViewportHeightChange: this.viewportHeight.update.bind(this.viewportHeight),
      scrollableRef: this.scrollableRef,
      scrollableProps: combined({
        onScroll: this.onScroll.bind(this),
        direction: 'both' as const,
        scrollTop: this.scrollTop,
        scrollByContent: this.options.oneWay('scrolling.scrollByContent'),
        scrollByThumb: this.options.oneWay('scrolling.scrollByThumb'),
        showScrollbar: this.options.oneWay('scrolling.showScrollbar'),
        useNative: computed(
          (useNative) => (useNative === 'auto' ? undefined : useNative),
          [this.options.oneWay('scrolling.useNative')],
        ),
      }),
    };
  }

  private onScroll(e: ScrollEventInfo<unknown>): void {
    this.scrollTop.update(e.scrollOffset.top);
  }
}
