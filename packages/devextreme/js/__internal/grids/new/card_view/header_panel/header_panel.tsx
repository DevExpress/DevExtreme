/* eslint-disable
  spellcheck/spell-checker
*/
import messageLocalization from '@js/localization/message';
import { combineClasses } from '@ts/core/utils/combine_classes';
import { filterHasField } from '@ts/filter_builder/m_utils';
import type { Column, VisibleColumn } from '@ts/grids/new/grid_core/columns_controller/types';
import { Scrollable } from '@ts/grids/new/grid_core/inferno_wrappers/scrollable';
import type { NavigationStrategyBase } from '@ts/grids/new/grid_core/keyboard_navigation/index';
import { KbnNavigationContainer, withKbnNavigationItem, withKeyDownHandler } from '@ts/grids/new/grid_core/keyboard_navigation/index';
import type { ComponentType } from 'inferno';
import { Component } from 'inferno';

import { getColumnIdentifier } from '../../grid_core/filtering/header_filter/utils';
import type { FilterValue } from '../../grid_core/filtering/types';
import type { Props as ColumnSortableProps } from './column_sortable';
import { ColumnSortable } from './column_sortable';
import { Item } from './item';
import type { DraggingOptions } from './options';

export const CLASSES = {
  link: 'dx-link',
  headers: 'dx-cardview-headers',
  content: 'dx-cardview-headerpanel-content',
  contentHasHeaderItems: 'dx-cardview-headerpanel-content--with-header-items',
  contentEmpty: 'dx-cardview-headerpanel-content--empty',
  headerPanelTextEmpty: 'dx-cardview-headerpanel-text-empty',
  headerItemContainer: 'dx-cardview-header-item-container',
  sortable: 'dx-cardview-sortable',
  sortablePlaceholder: 'dx-cardview-header-item-sort-indicator',
};

const ItemWithKbn = withKbnNavigationItem(withKeyDownHandler(Item));

export interface HeaderPanelProps {
  visibleColumns: VisibleColumn[];

  kbnEnabled: boolean;

  navigationStrategy: NavigationStrategyBase;

  showSortIndexes: boolean;

  onColumnSort: (column: Column, event: KeyboardEvent | MouseEvent) => void;

  onHeaderFilterOpen?: (
    element: Element | null,
    column: Column,
    onFilterCloseCallback?: () => void,
  ) => void;

  itemTemplate?: ComponentType<{ column: Column }>;

  itemCssClass?: string;

  visible: boolean;

  draggingOptions?: DraggingOptions;

  sortableConfig: Partial<ColumnSortableProps>;

  showContextMenu: (
    event: KeyboardEvent | MouseEvent,
    column?: Column,
    columnIndex?: number,
    onMenuCloseCallback?: () => void,
  ) => void;

  openColumnChooser: () => void;

  filterSyncValue: FilterValue | null;
}

const EmptyHeaderPanelText = (props: { openColumnChooser: () => void }): JSX.Element => {
  const text = messageLocalization.format('dxCardView-emptyHeaderPanelText');
  const columnChooserText = messageLocalization.format('dxCardView-emptyHeaderPanelColumnChooserText');
  const [leftPart, rightPart] = text.split('{0}');

  return (
    <span className={CLASSES.headerPanelTextEmpty} role='menuitem'>
      {leftPart}
      <a className={CLASSES.link} onClick={props.openColumnChooser}>{columnChooserText}</a>
      {rightPart}
    </span>
  );
};

export class HeaderPanel extends Component<HeaderPanelProps> {
  public render(): JSX.Element {
    const HeaderItem = this.props.kbnEnabled
      ? ItemWithKbn
      : Item;

    if (!this.props.visible) {
      return <></>;
    }

    const { sortableConfig } = this.props;
    const hasHeaderItems = this.props.visibleColumns.length > 0;
    const contentClassNames = combineClasses({
      [CLASSES.content]: true,
      [CLASSES.contentHasHeaderItems]: hasHeaderItems,
      [CLASSES.contentEmpty]: !hasHeaderItems,
    });

    return (
      <div
        className={CLASSES.headers}
        onContextMenu={this.props.showContextMenu}
      >
        <ColumnSortable
          {...this.props.draggingOptions}
          className={CLASSES.sortable}
          source="header-panel-main"
          getColumnByIndex={(index) => this.props.visibleColumns[index]}
          visibleColumns={this.props.visibleColumns}
          allowDragging={true}
          onColumnMove={sortableConfig.onColumnMove}
          columnDragTemplate={Item}
          itemOrientation="horizontal"
          filter={`.${CLASSES.headerItemContainer}`}
          isColumnDraggable={sortableConfig.isColumnDraggable}
          showDropzone={sortableConfig.showDropzone}
          placeholderClassName={CLASSES.sortablePlaceholder}
          onPlaceholderPrepared={sortableConfig.onPlaceholderPrepared}
        >
          <Scrollable
            direction='horizontal'
            showScrollbar='never'
            useNative={false}
            scrollByContent={true}
            // @ts-expect-error private option usage
            useKeyboard={false}
          >
            <KbnNavigationContainer
              enabled={this.props.kbnEnabled}
              navigationStrategy={this.props.navigationStrategy}
            >
              <div
                className={contentClassNames}
                role="menubar"
              >
                {!hasHeaderItems && (
                  <EmptyHeaderPanelText openColumnChooser={this.props.openColumnChooser}/>
                )}
                {this.props.visibleColumns.map((column, idx) => (
                  <div className={CLASSES.headerItemContainer}>
                    <HeaderItem
                      navigationIdx={idx}
                      navigationStrategy={this.props.navigationStrategy}
                      showSortIndexes={this.props.showSortIndexes}
                      column={column}
                      template={this.props.itemTemplate}
                      cssClass={this.props.itemCssClass}
                      hasFilters={this.itemHasFilters(column, this.props.filterSyncValue)}
                      keyDownConfig={{
                        Enter: (event) => { this.props.onColumnSort(column, event); },
                        'Enter+ctrl': (event) => { this.props.onColumnSort(column, event); },
                        'Enter+shift': (event) => { this.props.onColumnSort(column, event); },
                        'ArrowDown+alt': (event, ref) => {
                          this.props.onHeaderFilterOpen?.(
                            ref.current,
                            column,
                            () => ref.current?.focus(),
                          );
                        },
                      }}
                      caughtEventPreventDefault={true}
                      onSortClick={(event): void => {
                        this.props.onColumnSort(column, event);
                      }}
                      onFilterClick={(element: Element) => {
                        this.props.onHeaderFilterOpen?.(element, column);
                      }}
                      onContextMenu={(event, ref) => {
                        this.props.showContextMenu(
                          event,
                          column,
                          idx,
                          () => ref?.focus(),
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
            </KbnNavigationContainer>
          </Scrollable>
        </ColumnSortable>
      </div>
    );
  }

  private itemHasFilters(column: VisibleColumn, filterSyncValue: unknown): boolean {
    const { filterValues } = column;

    const columnId = getColumnIdentifier(column);

    const hasHeaderFilterValue = !!filterValues?.length;
    const hasFilterSyncValue = filterHasField(filterSyncValue, columnId) as boolean;

    return hasHeaderFilterValue || hasFilterSyncValue;
  }
}
