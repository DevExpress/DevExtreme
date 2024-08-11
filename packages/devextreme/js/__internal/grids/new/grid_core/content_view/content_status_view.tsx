/* eslint-disable spellcheck/spell-checker */
import { computed } from '@ts/core/reactive';

import { View } from '../core/view';
import { DataController } from '../data_controller/data_controller';
import { LoadPanel } from '../inferno_wrappers/load_panel';
import { OptionsController } from '../options_controller/options_controller';
import { NoData } from './no_data';

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
