import {
  Component, JSXComponent, ComponentBindings, OneWay, Fragment,
  Consumer, Effect, Ref, RefObject, Template, JSXTemplate,
} from '@devextreme-generator/declarations';

import { Table } from '../widgets/table';
import { DataRow } from '../widgets/data_row';
import { NoDataText } from '../widgets/no_data_text';
import { ColumnInternal, Row } from '../types';
import {
  createValue, Plugins, PluginsContext, createPlaceholder,
} from '../../../../utils/plugin/context';
import eventsEngine from '../../../../../events/core/events_engine';
import { name as clickEvent } from '../../../../../events/click';
import CLASSES from '../classes';
import { getReactRowKey, getElementHeight } from '../utils';
import { combineClasses } from '../../../../utils/combine_classes';
import { Placeholder } from '../../../../utils/plugin/placeholder';
import { Scrollable } from '../../../scroll_view/scrollable';
import { ScrollEventArgs, ScrollOffset } from '../../../scroll_view/common/types';

export const TopRowPlaceholder = createPlaceholder();
export const BottomRowPlaceholder = createPlaceholder();
export const RowClick = createValue<(row: Row, e: Event) => void>();
export const RowsViewScroll = createValue<(offset: ScrollOffset) => void>();
export const RowsViewHeight = createValue<number>();
export const SetRowsViewScrollPositionAction = createValue<(offset: ScrollOffset) => void>();
export const RowsViewHeightValue = createValue<number>();
export const SetRowsViewContentRenderAction = createValue<(element: HTMLElement) => void>();

export const viewFunction = (viewModel: TableContent): JSX.Element => (
  <div ref={viewModel.rowsViewRef} className={viewModel.classes} role="presentation">
    <Scrollable onScroll={viewModel.onScrollContent}>
      <div ref={viewModel.divRef} className={`${CLASSES.content}`}>
        <Table>
          <Fragment>
            <Placeholder type={TopRowPlaceholder} />
            {
              viewModel.rows.map((item) => (
                <DataRow
                  key={item.reactKey}
                  row={item}
                  rowIndex={item.index}
                  columns={viewModel.props.columns}
                />
              ))
            }
            <Placeholder type={BottomRowPlaceholder} />
          </Fragment>
        </Table>
      </div>
    </Scrollable>
    { viewModel.isEmpty && <NoDataText template={viewModel.props.noDataTemplate} />}
  </div>
);

@ComponentBindings()
export class TableContentProps {
  @OneWay()
  visibleRows: Row[] = [];

  @OneWay()
  columns: ColumnInternal[] = [];

  @Template()
  noDataTemplate?: JSXTemplate;
}

@Component({
  defaultOptionRules: null,
  jQuery: { register: false },
  view: viewFunction,
})
export class TableContent extends JSXComponent(TableContentProps) {
  @Ref()
  rowsViewRef!: RefObject<HTMLDivElement>;

  @Ref()
  divRef!: RefObject<HTMLDivElement>;

  @Consumer(PluginsContext)
  plugins: Plugins = new Plugins();

  @Effect()
  subscribeToRowClick(): () => void {
    const onRowClick = this.onRowClick.bind(this);
    eventsEngine.on(this.divRef.current, clickEvent, `.${CLASSES.row}`, onRowClick);
    return (): void => eventsEngine.off(this.divRef.current, clickEvent, onRowClick);
  }

  @Effect()
  calculateRowsViewHeight(): void {
    this.plugins.set(RowsViewHeightValue, getElementHeight(this.rowsViewRef.current));
  }

  @Effect({ run: 'always' })
  rowsViewContentReady(): void {
    const element = this.divRef.current;
    element && this.plugins.callAction(SetRowsViewContentRenderAction, element);
  }

  onRowClick(e: Event): void {
    const allRows = this.divRef.current!.getElementsByClassName(CLASSES.row);
    const index = Array.from(allRows).indexOf(e.currentTarget as Element);
    if (index >= 0) {
      this.plugins.callAction(RowClick, this.props.visibleRows[index], e);
    }
  }

  get classes(): string {
    return combineClasses({
      [CLASSES.rowsView]: true,
      [CLASSES.noWrap]: true,
      [CLASSES.afterHeaders]: true,
      [CLASSES.empty]: this.isEmpty,
    });
  }

  get rows(): (Row & { index: number; reactKey: string })[] {
    return this.props.visibleRows.map((row, index) => ({
      ...row,
      index,
      reactKey: getReactRowKey(row, index),
    }));
  }

  get isEmpty(): boolean {
    return this.props.visibleRows.length === 0;
  }

  onScrollContent(e: ScrollEventArgs): void {
    this.plugins.callAction(SetRowsViewScrollPositionAction, e.scrollOffset);
  }
}
