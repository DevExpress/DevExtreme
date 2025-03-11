/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable max-classes-per-file */

import { combined, computed, Subscription, SubsGets } from '@ts/core/reactive/index';

import { View } from '../../core/view';
import { OptionsController } from '../../options_controller/options_controller';
import { FilterPanelComponent, FilterPanelProps } from './filter_panel';
import { WidgetMock } from '../../widget_mock';

import { FilterBuilderView as OldFilterBuilderView } from '@ts/grids/grid_core/filter/m_filter_builder';
import { FilterPanelView as OldFilterPanelView } from '@ts/grids/grid_core/filter/m_filter_panel';


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
    });
  }
}
