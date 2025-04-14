/* eslint-disable spellcheck/spell-checker */
/* eslint-disable max-classes-per-file */
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { SubsGets } from '@ts/core/reactive';
import { combined, effect, state } from '@ts/core/reactive';
import { removeFieldConditionsFromFilter } from '@ts/filter_builder/m_utils';
import { HeaderFilterView as OldHeaderFilterPopup } from '@ts/grids/grid_core/header_filter/m_header_filter_core';
import { View } from '@ts/grids/new/grid_core/core/view';
import { WidgetMock } from '@ts/grids/new/grid_core/widget_mock';
import { Component, createRef } from 'inferno';

import { ColumnsController } from '../../columns_controller';
import type { Column } from '../../columns_controller/types';
import { getColumnIndexByName } from '../../columns_controller/utils';
import { CLASSES } from '../../const';
import { OptionsController } from '../../options_controller/options_controller';
import { SharedController } from '../../shared/controller';
import type { PopupState } from './controller';
import { getDataSourceOptions, getFilterType } from './legacy_header_filter';
import { getColumnIdentifier } from './utils';

export interface OldHeaderFilterPopupInterface {
  render: (dxWrapper: dxElementWrapper) => void;
  dispose: () => void;
}

export interface HeaderFilterPopupComponentProps {
  oldHeaderFilterPopup: OldHeaderFilterPopupInterface;
}

export class HeaderFilterView {
  private readonly popupState = state<PopupState>(null);

  public readonly popupState$: SubsGets<PopupState> = this.popupState;

  public static dependencies = [
    OptionsController,
    SharedController,
    ColumnsController,
  ] as const;

  constructor(
    private readonly options: OptionsController,
    private readonly sharedController: SharedController,
    private readonly columnsController: ColumnsController,
  ) { }

  public openPopup(
    element: Element,
    column: Column,
    onFilterCloseCallback?: () => void,
  ): void {
    const rootDataSource = this.sharedController.dataSource.unreactive_get();
    const rootHeaderFilterOptions = this.options.oneWay('headerFilter').unreactive_get();
    const displayFilter = this.sharedController.appliedFilters.unreactive_get();
    const columnId = getColumnIdentifier(column);
    const actualFilter = removeFieldConditionsFromFilter(displayFilter, columnId);

    const filterDataSourceOptions = getDataSourceOptions(
      rootDataSource,
      {
        ...column,
        filterType: column.filterType,
        filterValues: column.headerFilter?.values,
      },
      // NOTE: Only text used from root options
      {
        texts: rootHeaderFilterOptions.texts,
      },
      actualFilter,
    );

    const type = getFilterType(column);
    const colsController = this.columnsController;

    this.popupState.update({
      element,
      options: {
        type,
        headerFilter: { ...column.headerFilter },
        dataSource: filterDataSourceOptions,
        filterType: column.filterType,
        // NOTE: Copy array because of mutations in legacy code
        filterValues: Array.isArray(column.headerFilter?.values)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ? [...column.headerFilter!.values]
          : column.headerFilter?.values,
        apply() {
          // NOTE: Copy array because of mutations in legacy code
          const values = Array.isArray(this.filterValues)
            ? [...this.filterValues]
            : this.filterValues;
          const { filterType } = this;
          colsController.updateColumns(
            (columns) => {
              const index = getColumnIndexByName(columns, column.name);
              const newColumns = [...columns];

              newColumns[index] = {
                ...newColumns[index],
                headerFilter: {
                  ...newColumns[index].headerFilter,
                  values,
                },
                filterType,
              };
              return newColumns;
            },
          );

          onFilterCloseCallback?.();
        },
        hidePopupCallback: () => {
          this.popupState.update(null);
          onFilterCloseCallback?.();
        },
      },
    });
  }
}

export class HeaderFilterPopupComponent extends Component<HeaderFilterPopupComponentProps> {
  private readonly containerRef = createRef<HTMLDivElement>();

  public render(): JSX.Element {
    return (
      <div className={CLASSES.excludeFlexBox} ref={this.containerRef}></div>
    );
  }

  public componentDidMount(): void {
    this.props.oldHeaderFilterPopup.render($(this.containerRef.current ?? undefined));
  }

  public componentDidUpdate(): void {
    this.props.oldHeaderFilterPopup.render($(this.containerRef.current ?? undefined));
  }

  public componentWillUnmount(): void {
    this.props.oldHeaderFilterPopup.dispose();
  }
}

export class HeaderFilterPopupView extends View<{}> {
  private readonly oldHeaderFilterPopup: OldHeaderFilterPopup;

  protected component = HeaderFilterPopupComponent;

  public static dependencies = [
    WidgetMock,
    HeaderFilterView,
  ] as const;

  constructor(
    private readonly widget: WidgetMock,
    private readonly headerFilterView: HeaderFilterView,
  ) {
    super();
    this.oldHeaderFilterPopup = new OldHeaderFilterPopup(this.widget);
    this.oldHeaderFilterPopup.init();

    effect(
      (popupState) => {
        if (!popupState) {
          return;
        }

        this.oldHeaderFilterPopup.showHeaderFilterMenu($(popupState.element), popupState.options);
      },
      [this.headerFilterView.popupState$],
    );
  }

  protected getProps(): SubsGets<{}> {
    return combined({
      oldHeaderFilterPopup: this.oldHeaderFilterPopup,
    });
  }
}
