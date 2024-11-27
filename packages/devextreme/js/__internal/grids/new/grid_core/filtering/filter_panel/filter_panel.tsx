/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable max-classes-per-file */
import $ from '@js/core/renderer';
import { computed } from '@ts/core/reactive/index';
import { FilterBuilderView as OldFilterBuilderView } from '@ts/grids/grid_core/filter/m_filter_builder';
import { FilterPanelView as OldFilterPanelView } from '@ts/grids/grid_core/filter/m_filter_panel';
import { Component, createRef } from 'inferno';

import { View } from '../../core/view';
import { OptionsController } from '../../options_controller/options_controller';
import { WidgetMock } from '../../widget_mock';

export class FilterPanelView extends View {
  private readonly oldFilterPanelView = new OldFilterPanelView(this.widget);

  private readonly oldFilterBuilderView = new OldFilterBuilderView(this.widget);

  public vdom = computed(
    (filterPanelVisible) => filterPanelVisible && (
      <FilterPanelComponent
        oldFilterBuilderView={this.oldFilterBuilderView}
        oldFilterPanelView={this.oldFilterPanelView}
      />
    ),
    [
      this.options.oneWay('filterPanel.visible'),
      this.options.oneWay('filterValue'),
      this.options.oneWay('filterBuilderPopup.visible'),
    ],
  );

  public static dependencies = [OptionsController, WidgetMock] as const;

  constructor(
    private readonly options: OptionsController,
    private readonly widget: WidgetMock,
  ) {
    super();

    this.oldFilterPanelView.init();
    this.oldFilterBuilderView.init();
  }
}

interface FilterPanelComponentProps {
  oldFilterPanelView: OldFilterPanelView;

  oldFilterBuilderView: OldFilterBuilderView;
}

class FilterPanelComponent extends Component<FilterPanelComponentProps> {
  private readonly filterPanelRef = createRef<HTMLDivElement>();
  private readonly filterBuilderRef = createRef<HTMLDivElement>();

  render() {
    return <>
      <div ref={this.filterPanelRef}></div>
      <div ref={this.filterBuilderRef}></div>
    </>;
  }

  componentDidMount(): void {
    this.props.oldFilterPanelView.render($(this.filterPanelRef.current!));
    this.props.oldFilterBuilderView.render($(this.filterBuilderRef.current!));
  }
  componentDidUpdate(): void {
    this.props.oldFilterPanelView.render($(this.filterPanelRef.current!));
    this.props.oldFilterBuilderView.render($(this.filterBuilderRef.current!));
  }
}
