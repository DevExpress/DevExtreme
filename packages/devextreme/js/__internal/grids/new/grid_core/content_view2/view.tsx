/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable spellcheck/spell-checker */
import type dxScrollable from '@js/ui/scroll_view/ui.scrollable';
import { computed } from '@ts/core/reactive/index';
import { View } from '@ts/grids/new/grid_core/core/view4';
import { createRef } from 'inferno';

import { ColumnsController } from '../columns_controller/columns_controller';
import { DataController } from '../data_controller';
import { ErrorController } from '../error_controller/error_controller';
import { OptionsController } from '../options_controller/options_controller';
import type { ContentViewProps } from './content_view';
import { ContentView as ContentViewComponent } from './content_view';

export class ContentView<TProps extends ContentViewProps = ContentViewProps> extends View<TProps> {
  private readonly isNoData = computed(
    (isLoading, items) => !isLoading && items.length === 0,
    [this.dataController.isLoading, this.dataController.items],
  );

  public readonly scrollableRef = createRef<dxScrollable>();

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
    return computed(
      (isLoading, isNoData, noDataText, errors): ContentViewProps => ({
        errorRowProps: {
          errors,
        },
        loadPanelProps: {
          visible: isLoading,
        },
        noDataTextProps: {
          visible: isNoData,
          text: noDataText,
        },
      }),
      [
        this.dataController.isLoading,
        this.isNoData,
        this.options.oneWay('noDataText'),
        this.errorController.errors,
      ],
    );
  }
}
