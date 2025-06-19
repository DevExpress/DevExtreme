import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import type { ComponentType, RefObject } from 'inferno';
import { Component } from 'inferno';

import { Icon } from '../../grid_core/icon';
import { getHeaderItemA11yLabel } from './a11y/index';
import type { Status } from './column_sortable';

export const CLASSES = {
  item: 'dx-cardview-header-item',
  button: 'dx-cardview-header-item-button',
  sorting: {
    container: 'dx-cardview-header-item-sorting',
    order: 'dx-cardview-header-item-sorting-order',
  },
  headerFilter: {
    icon: 'dx-header-filter-icon',
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
  hasFilters?: boolean;
  onKeyDown?: (event: KeyboardEvent) => void;
  onSortClick?: (event: MouseEvent) => void;
  onFilterClick?: (element: Element) => void;
  onContextMenu?: (event: MouseEvent, ref: HTMLDivElement) => void;
}

export class Item extends Component<ItemProps> {
  public render(): JSX.Element {
    const { column } = this.props;

    const Template = column.headerItemTemplate ?? this.props.template;
    const cssClass = `${CLASSES.item} ${column.headerItemCssClass ?? ''} ${this.props.cssClass ?? ''}`;

    const headerFilterIconClass = [
      CLASSES.headerFilter.icon,
      this.props.hasFilters ? CLASSES.headerFilter.iconFilled : '',
    ].join(' ');

    const icon = this.props.status && {
      forbid: <Icon name='cursorprohibition'/>,
      moving: <Icon name='cursormove'/>,
      none: undefined,
    }[this.props.status];

    const showSortIcon = !this.props.isDragging && column.sortOrder !== undefined;
    const showHeaderFilterIcon = !this.props.isDragging && column?.allowHeaderFiltering;

    const ariaLabel = getHeaderItemA11yLabel(
      column.caption,
      {
        hasHeaderFilterValue: this.props.hasFilters,
        sortOrder: column.sortOrder,
        sortIndex: column.sortIndex,
      },
    );

    return (
      <div
        ref={this.props.elementRef}
        className={cssClass}
        tabIndex={this.props.tabIndex}
        role={this.props.isDragging ? undefined : 'menuitem'}
        aria-label={ariaLabel}
        onClick={this.props.onSortClick}
        onKeyDown={this.props.onKeyDown}
        onContextMenu={this.onContextMenuHandler}
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

  private readonly onContextMenuHandler = (event: MouseEvent): void => {
    if (this.props.elementRef?.current) {
      this.props.onContextMenu?.(event, this.props.elementRef.current);
    }
  };
}
