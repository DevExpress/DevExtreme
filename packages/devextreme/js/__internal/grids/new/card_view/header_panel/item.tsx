import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import type { ComponentType, RefObject } from 'inferno';
import { Component } from 'inferno';

import { Icon } from '../../grid_core/icon';
import type { Status } from './column_sortable';

export const CLASSES = {
  item: 'dx-cardview-header-item',
  button: 'dx-cardview-header-item-button',
  sorting: {
    container: 'dx-cardview-header-item-sorting',
    order: 'dx-cardview-header-item-sorting-order',
  },
  headerFilter: {
    iconEmpty: 'dx-header-filter-icon',
    iconFilled: 'dx-header-filter-icon--selected',
  },
};

interface SortIconProps {
  sortOrder: 'asc' | 'desc';
  sortIndex: number;
  showSortIndex: boolean;
}

function SortIcon(props: SortIconProps): JSX.Element {
  return (
    <div className={CLASSES.sorting.container}>
      {props.sortOrder === 'asc' && <Icon name='arrowsortup'/>}
      {props.sortOrder === 'desc' && <Icon name='arrowsortdown'/>}
      {
        props.showSortIndex && (
          <div className={CLASSES.sorting.order}>
            {props.sortIndex}
          </div>
        )
      }
    </div>
  );
}

export interface ItemProps {
  elementRef?: RefObject<HTMLDivElement>;
  tabIndex?: number;
  column: Column;
  status?: Status;
  showSortIndexes?: boolean;
  isDragging?: boolean;
  template?: ComponentType<{ column: Column }>;
  cssClass?: string;
  onKeyDown?: (event: KeyboardEvent) => void;
  onSortClick?: (event: MouseEvent) => void;
  onFilterClick?: (element: Element) => void;
  onContextMenu?: (event: MouseEvent) => void;
}

export class Item extends Component<ItemProps> {
  public render(): JSX.Element {
    const Template = this.props.column.headerItemTemplate ?? this.props.template;
    const cssClass = `${CLASSES.item} ${this.props.column.headerItemCssClass ?? ''} ${this.props.cssClass ?? ''}`;

    const { filterType, filterValues } = this.props.column;

    const hasHeaderFilterValue = filterType === 'exclude'
      || !!filterValues?.length;
    const headerFilterIconClass = [
      CLASSES.headerFilter.iconEmpty,
      hasHeaderFilterValue ? CLASSES.headerFilter.iconFilled : '',
    ].join(' ');

    const icon = this.props.status && {
      forbid: <Icon name='cursorprohibition'/>,
      moving: <Icon name='cursormove'/>,
      none: undefined,
    }[this.props.status];

    const showSortIcon = !this.props.isDragging && this.props.column.sortOrder !== undefined;
    const showHeaderFilterIcon = !this.props.isDragging && this.props.column?.allowHeaderFiltering;

    return (
      <div
        ref={this.props.elementRef}
        className={cssClass}
        tabIndex={this.props.tabIndex}
        onClick={this.props.onSortClick}
        onKeyDown={this.props.onKeyDown}
        onContextMenu={this.props.onContextMenu}
      >
        {icon}
        {Template && <Template column={this.props.column}/>}
        {!Template && this.props.column.caption}
        {
          showSortIcon && (
            <SortIcon
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              sortIndex={this.props.column.sortIndex! + 1}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              sortOrder={this.props.column.sortOrder!}
              showSortIndex={this.props.showSortIndexes ?? false}
            />
          )
        }
        { showHeaderFilterIcon && (
          <Icon
            name='filter'
            className={headerFilterIconClass}
            onClick={this.onFilterClickHandler}
          />
        )}
      </div>
    );
  }

  private readonly onFilterClickHandler = (event: Event): void => {
    event.stopPropagation();

    if (this.props.elementRef?.current) {
      this.props.onFilterClick?.(this.props.elementRef.current);
    }
  };
}
