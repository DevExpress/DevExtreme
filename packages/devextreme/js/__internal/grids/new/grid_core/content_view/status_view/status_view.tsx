/* eslint-disable spellcheck/spell-checker */
import { computed } from '@ts/core/reactive/index';

import { View } from '../../core/view';
import { DataController } from '../../data_controller/data_controller';
import { ErrorController } from '../../error_controller/error_controller';
import { OptionsController } from '../../options_controller/options_controller';
import { ErrorRow } from './error_row';
import { LoadPanel } from './load_panel';
import { NoData } from './no_data';

/**
 * Shows content status:
 * - if not loaded yet, shows Load Panel
 * - if loaded, but no records to show, shows No Data Panel
 */
export class StatusView extends View {
  private readonly isNoData = computed(
    (isLoading, items) => !isLoading && items.length === 0,
    [this.dataController.isLoading, this.dataController.items],
  );

  public vdom = computed(
    (isLoading, isNoData, noDataText, error) => (
      <>
        { isLoading && <LoadPanel visible={true} /> }
        { isNoData && <NoData text={noDataText} /> }
        { !!error.length && (
          <ErrorRow
            errors={error}
            onRemoveButtonClicked={this.errorController.removeError.bind(this.errorController)}
          />
        )}
      </>
    ),
    [
      this.dataController.isLoading,
      this.isNoData,
      this.options.oneWay('noDataText'),
      this.errorController.errors,
    ],
  );

  public static dependencies = [DataController, OptionsController, ErrorController] as const;

  constructor(
    private readonly dataController: DataController,
    private readonly options: OptionsController,
    private readonly errorController: ErrorController,
  ) {
    super();
  }
}
