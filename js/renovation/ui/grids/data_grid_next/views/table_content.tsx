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
import { getReactRowKey } from '../utils';
import { combineClasses } from '../../../../utils/combine_classes';
import { Placeholder } from '../../../../utils/plugin/placeholder';
import { Scrollable } from '../../../scroll_view/scrollable';
import { ScrollEventArgs, ScrollOffset } from '../../../scroll_view/common/types';

export const TopRowPlaceholder = createPlaceholder();
export const BottomRowPlaceholder = createPlaceholder();

export const viewFunction = (viewModel: TableContent): JSX.Element => (
  <div className={viewModel.classes} role="presentation">
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

export const RowClick = createValue<(row: Row, e: Event) => void>();
export const RowsViewScroll = createValue<(offset: ScrollOffset) => void>();

@ComponentBindings()
export class TableContentProps {
  @OneWay()
  dataSource: Row[] = [];

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
  divRef!: RefObject<HTMLDivElement>;

  @Consumer(PluginsContext)
  plugins: Plugins = new Plugins();

  @Effect()
  subscribeToRowClick(): () => void {
    const onRowClick = this.onRowClick.bind(this);
    eventsEngine.on(this.divRef.current, clickEvent, `.${CLASSES.row}`, onRowClick);
    return (): void => eventsEngine.off(this.divRef.current, clickEvent, onRowClick);
  }

  onRowClick(e: Event): void {
    const allRows = this.divRef.current!.getElementsByClassName(CLASSES.row);
    const index = Array.from(allRows).indexOf(e.currentTarget as Element);
    if (index >= 0) {
      this.plugins.callAction(RowClick, this.props.dataSource[index], e);
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
    return this.props.dataSource.map((row, index) => ({
      ...row,
      index,
      reactKey: getReactRowKey(row, index),
    }));
  }

  get isEmpty(): boolean {
    return this.props.dataSource.length === 0;
  }

  onScrollContent(e: ScrollEventArgs): void {
    this.plugins.callAction(RowsViewScroll, e.scrollOffset);
  }
}
