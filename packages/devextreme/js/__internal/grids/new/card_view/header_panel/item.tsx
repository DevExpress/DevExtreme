import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import { MultipleKeyDownHandler } from '@ts/grids/new/grid_core/keyboard_navigation/index';
import type { ComponentType } from 'inferno';
import { Component, createRef } from 'inferno';

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
  column: Column;
  status?: Status;
  showSortIndexes?: boolean;
  template?: ComponentType<{ column: Column }>;
  cssClass?: string;
  onSortClick?: (e: MouseEvent) => void;
  onFilterClick?: (
    element: Element,
    onFilterCloseCallback?: () => void,
  ) => void;
  onContextMenu?: (e: MouseEvent) => void;
}

export class Item extends Component<ItemProps> {
  private readonly containerRef = createRef<HTMLDivElement>();

  private readonly keyboardHandler = new MultipleKeyDownHandler(['alt', 'arrowdown']);

  public render(): JSX.Element {
    const Template = this.props.column.headerItemTemplate ?? this.props.template;
    const cssClass = `${CLASSES.item} ${this.props.column.headerItemCssClass ?? ''} ${this.props.cssClass ?? ''}`;

    const { headerFilter } = this.props.column;

    const hasHeaderFilterValue = headerFilter?.filterType === 'exclude'
      || !!headerFilter?.values?.length;
    const headerFilterIconClass = [
      CLASSES.headerFilter.iconEmpty,
      hasHeaderFilterValue ? CLASSES.headerFilter.iconFilled : '',
    ].join(' ');

    const icon = this.props.status && {
      forbid: <Icon name='cursorprohibition'/>,
      moving: <Icon name='cursormove'/>,
      none: undefined,
    }[this.props.status];

    return (
      <div
        ref={this.containerRef}
        className={cssClass}
        tabIndex={0}
        onClick={this.props.onSortClick}
        onKeyDown={(event) => this.keyboardHandler.onKeyDownHandler(
          event,
          this.onFilterKeyPressHandler,
        )}
        onKeyUp={this.keyboardHandler.onKeyUpHandler}
        onContextMenu={this.props.onContextMenu}
      >
        {icon}
        {Template && <Template column={this.props.column}/>}
        {!Template && this.props.column.caption}
        {
          this.props.column.sortOrder !== undefined && (
            <SortIcon
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              sortIndex={this.props.column.sortIndex! + 1}
              sortOrder={this.props.column.sortOrder}
              showSortIndex={this.props.showSortIndexes ?? false}
            />
          )
        }
        { this.props.column?.allowHeaderFiltering && (
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

    if (this.containerRef.current) {
      this.props.onFilterClick?.(this.containerRef.current);
    }
  };

  private readonly onFilterKeyPressHandler = (event: KeyboardEvent): void => {
    event.preventDefault();

    if (this.containerRef.current) {
      this.props.onFilterClick?.(this.containerRef.current, this.focusItem);
    }
  };

  private readonly focusItem = (): void => {
    this.containerRef?.current?.focus();
  };
}
