import type { SubsGets } from '@ts/core/reactive/index';
import { combined } from '@ts/core/reactive/index';
import { FilterBuilderView as OldFilterBuilderView } from '@ts/grids/grid_core/filter/m_filter_builder';
import { FilterPanelView as OldFilterPanelView } from '@ts/grids/grid_core/filter/m_filter_panel';

import { View } from '../../core/view';
import { OptionsController } from '../../options_controller/options_controller';
import { WidgetMock } from '../../widget_mock';
import type { FilterPanelProps } from './filter_panel';
import { FilterPanelComponent } from './filter_panel';

export class FilterPanelView extends View<FilterPanelProps> {
  protected component = FilterPanelComponent;

  private readonly oldFilterPanelView = new OldFilterPanelView(this.widget);

  private readonly oldFilterBuilderView = new OldFilterBuilderView(this.widget);

  public static dependencies = [OptionsController, WidgetMock] as const;

  constructor(
    private readonly options: OptionsController,
    private readonly widget: WidgetMock,
  ) {
    super();

    this.oldFilterPanelView.init();
    this.oldFilterBuilderView.init();
  }

  protected override getProps(): SubsGets<FilterPanelProps> {
    return combined({
      oldFilterBuilderView: this.oldFilterBuilderView,
      oldFilterPanelView: this.oldFilterPanelView,

      visible: this.options.oneWay('filterPanel.visible'),
      filterValue: this.options.oneWay('filterValue'),
      popupVisible: this.options.oneWay('filterBuilderPopup.visible'),
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public optionChanged(args): void {
    this.oldFilterBuilderView.optionChanged(args);
    this.oldFilterPanelView.optionChanged(args);
  }
}
