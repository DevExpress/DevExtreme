/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable max-classes-per-file */
import $ from '@js/core/renderer';
import { computed } from '@ts/core/reactive';
import { FilterPanelView as OldFilterPanelView } from '@ts/grids/grid_core/filter/m_filter_panel';
import { Component, createRef } from 'inferno';

import { View } from '../../core/view';
import { OptionsController } from '../../options_controller/options_controller';

export class FilterPanelView extends View {
  public vdom = computed(
    (filterPanelVisible) => filterPanelVisible && <FilterPanelComponent/>,
    [
      this.options.oneWay('filterPanelVisible'),
    ],
  );

  public static dependencies = [OptionsController] as const;

  constructor(
    private readonly options: OptionsController,
  ) {
    super();
  }
}

class WidgetMock {
  option(name) {
    if (name === 'filterPanel.visible') {
      return true;
    }

    return undefined;
  }

  NAME = 'dxDataGrid';

  _createActionByOption() {
    return () => {};
  }

  _controllers = {
    columns: {
      getColumns() {
        return [1];
      },
      getFilteringColumns() {
        return [];
      },
    },
    data: {
      dataSourceChanged: {
        add() {},
      },
      dataSource() {
        return {

        };
      },
    },
    filterSync: {
      getCustomFilterOperations() {
        return [];
      },
    },
  };
}

class FilterPanelComponent extends Component {
  private readonly oldFilterPanelView: OldFilterPanelView;

  private readonly ref = createRef<HTMLDivElement>();

  constructor() {
    super();
    this.oldFilterPanelView = new class extends OldFilterPanelView {

    }(new WidgetMock());
    this.oldFilterPanelView.init();
  }

  render() {
    return <div ref={this.ref}>filterPanel</div>;
  }

  componentDidMount(): void {
    this.oldFilterPanelView.render($(this.ref.current!));
  }
}
