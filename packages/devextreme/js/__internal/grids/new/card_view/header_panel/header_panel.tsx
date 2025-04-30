/* eslint-disable
  spellcheck/spell-checker
*/
import type { Column, VisibleColumn } from '@ts/grids/new/grid_core/columns_controller/types';
import { Scrollable } from '@ts/grids/new/grid_core/inferno_wrappers/scrollable';
import type { NavigationStrategyBase } from '@ts/grids/new/grid_core/keyboard_navigation/index';
import { KbnNavigationContainer, withKbnNavigationItem, withKeyDownHandler } from '@ts/grids/new/grid_core/keyboard_navigation/index';
import type { ComponentType } from 'inferno';
import { Component } from 'inferno';

import type { Props as ColumnSortableProps } from './column_sortable';
import { ColumnSortable } from './column_sortable';
import { CLASSES as itemClasses, Item } from './item';
import type { DraggingOptions } from './options';

export const CLASSES = {
  headers: 'dx-cardview-headers',
  content: 'dx-cardview-headerpanel-content',
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
}

export class HeaderPanel extends Component<HeaderPanelProps> {
  public render(): JSX.Element {
    const HeaderItem = this.props.kbnEnabled
      ? ItemWithKbn
      : Item;

    if (!this.props.visible) {
      return <></>;
    }

    const { sortableConfig } = this.props;

    return (
      <div
        className={CLASSES.headers}
        onContextMenu={this.props.showContextMenu}
      >
        <ColumnSortable
          {...this.props.draggingOptions}
          source="header-panel-main"
          getColumnByIndex={(index) => this.props.visibleColumns[index]}
          visibleColumns={this.props.visibleColumns}
          allowDragging={sortableConfig.allowDragging}
          onColumnMove={sortableConfig.onColumnMove}
          columnDragTemplate={Item}
          itemOrientation="horizontal"
          filter={`.${itemClasses.item}`}
          isColumnDraggable={sortableConfig.isColumnDraggable}
          showDropzone={sortableConfig.showDropzone}
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
              <div className={CLASSES.content}>
                {this.props.visibleColumns.map((column, idx) => (
                  <HeaderItem
                    navigationIdx={idx}
                    navigationStrategy={this.props.navigationStrategy}
                    showSortIndexes={this.props.showSortIndexes}
                    column={column}
                    template={this.props.itemTemplate}
                    cssClass={this.props.itemCssClass}
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
                      'F10+shift': (event, ref) => {
                        this.props.showContextMenu(
                          event,
                          column,
                          idx,
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
                    onContextMenu={(event) => {
                      this.props.showContextMenu(event, column, idx);
                    }}
                  />
                ))}
              </div>
            </KbnNavigationContainer>
          </Scrollable>
        </ColumnSortable>
      </div>
    );
  }
}
