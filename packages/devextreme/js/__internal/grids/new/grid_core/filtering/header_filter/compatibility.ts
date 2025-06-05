import type { Column } from '../../columns_controller/types';
import { DataController } from '../../data_controller/index';
import { OptionsController } from '../../options_controller/options_controller';
import { FilterController } from '../filter_controller';
import { getDataSourceOptions } from './legacy_header_filter';
import { HeaderFilterViewController } from './view_controller';

export class CompatibilityHeaderFilterController {
  public static dependencies = [
    FilterController,
    HeaderFilterViewController,
    DataController,
    OptionsController,
  ] as const;

  constructor(
    private readonly realFilterController: FilterController,
    private readonly realHeaderFilterViewController: HeaderFilterViewController,
    private readonly realDataController: DataController,
    private readonly options: OptionsController,
  ) {
    this.realFilterController.headerFilterCompatibilityController = this;
  }

  public getCustomFilterOperations(): unknown[] {
    return this.realFilterController.customOperations.peek();
  }

  public showHeaderFilterMenuBase(args: {
    columnElement: Element;
    column: Column;
    onHidden?: () => void;
    customApply?: (filterValues) => void;
    isFilterBuilder?: boolean;
  }): void {
    this.realHeaderFilterViewController.openPopup(
      args.columnElement,
      args.column,
      args.onHidden,
      args.customApply,
      args.isFilterBuilder,
    );
  }

  public hideHeaderFilterMenu(): void {
    this.realHeaderFilterViewController.closePopup();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getDataSource(column: Column): any {
    const adapter = this.realDataController.getStoreLoadAdapter();
    const popupOptions = {
      column: { ...column },
      filterType: column.filterType,
      filterValues: column.filterValues,
    };
    /*
      Note: Root headerFilter options are used because the legacy code handles retrieving
      options for specific columns on its own
    */
    const rootHeaderFilterOptions = this.options.oneWay('headerFilter').peek();

    return getDataSourceOptions(adapter, popupOptions, rootHeaderFilterOptions, null);
  }
}
