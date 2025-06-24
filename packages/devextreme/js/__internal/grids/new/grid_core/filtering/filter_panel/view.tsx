import { computed, type ReadonlySignal } from '@ts/core/reactive/index';
import { FilterBuilderView as OldFilterBuilderView } from '@ts/grids/grid_core/filter/m_filter_builder';
import { FilterPanelView as OldFilterPanelView } from '@ts/grids/grid_core/filter/m_filter_panel';

import { View } from '../../core/view';
import { WidgetMock } from '../../widget_mock';
import { FilterController } from '../filter_controller';
import type { FilterPanelProps } from './filter_panel';
import { FilterPanelComponent } from './filter_panel';

export class FilterPanelView extends View<FilterPanelProps> {
  protected component = FilterPanelComponent;

  private readonly oldFilterPanelView = new OldFilterPanelView(this.widget);

  private readonly oldFilterBuilderView = new OldFilterBuilderView(this.widget);

  public static dependencies = [
    FilterController,
    WidgetMock,
  ] as const;

  constructor(
    private readonly filterController: FilterController,
    private readonly widget: WidgetMock,
  ) {
    super();

    this.oldFilterPanelView.init();
    this.oldFilterBuilderView.init();
  }

  protected override getProps(): ReadonlySignal<FilterPanelProps> {
    return computed(() => ({
      oldFilterBuilderView: this.oldFilterBuilderView,
      oldFilterPanelView: this.oldFilterPanelView,

      filterValue: this.filterController.filterValueOption.value,
      filterPanel: this.filterController.filterPanelOptions.value,
      filterBuilder: this.filterController.filterBuilderOptions.value,
      filterBuilderPopup: this.filterController.filterBuilderPopupOptions.value,
    }));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public optionChanged(args): void {
    this.oldFilterBuilderView.optionChanged(args);
    this.oldFilterPanelView.optionChanged(args);
  }

  public isCompatibilityMode(): boolean {
    return true;
  }
}
