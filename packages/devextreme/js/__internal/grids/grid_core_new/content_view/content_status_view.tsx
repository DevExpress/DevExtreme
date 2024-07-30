/* eslint-disable spellcheck/spell-checker */
import dxLoadPanel from '@js/ui/load_panel';
import { computed } from '@ts/core/reactive';

import { View } from '../core/view';
import { createWidgetWrapper } from '../core/widget_wrapper';
import { DataController } from '../data_controller/data_controller';
import { OptionsController } from '../options_controller/options_controller';
import { NoData } from './no_data';

const LoadPanel = createWidgetWrapper(dxLoadPanel);

export class ContentStatusView extends View {
  private readonly isNoData = computed(
    (isLoading, items) => !isLoading && items.length === 0,
    [this.dataController.isLoading, this.dataController.items],
  );

  public vdom = computed(
    (isLoading, isNoData, noDataText) => (
      <>
        { isLoading && <LoadPanel visible={true} /> }
        { isNoData && <NoData text={noDataText} /> }
      </>
    ),
    [
      this.dataController.isLoading,
      this.isNoData,
      this.options.oneWay('noDataText'),
    ],
  );

  static dependencies = [DataController, OptionsController] as const;

  constructor(
    private readonly dataController: DataController,
    private readonly options: OptionsController,
  ) {
    super();
  }
}
