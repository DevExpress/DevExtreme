import {
  Component, JSXComponent, ComponentBindings, OneWay, Fragment,
  Consumer, Effect, Ref, RefObject, Template, JSXTemplate,
} from '@devextreme-generator/declarations';
import resizeObserverSingleton from '../../../../../core/resize_observer';
import { ValueSetter } from '../../../../utils/plugin/value_setter';
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
import {
  TotalCount,
} from '../plugins';

type ScrollPositionAction = (offset: Partial<ScrollOffset>) => void;

export const TopRowPlaceholder = createPlaceholder();
export const BottomRowPlaceholder = createPlaceholder();
export const RowClick = createValue<(row: Row, e: Event) => void>();
export const RowsViewScroll = createValue<(offset: ScrollOffset) => void>();
export const RowsViewHeight = createValue<number>();
export const SetRowsViewScrollPositionAction = createValue<ScrollPositionAction>();
export const RowsViewHeightValue = createValue<number>();
export const SetRowsViewContentRenderAction = createValue<(element: HTMLElement) => void>();
export const SetRowsViewOffsetAction = createValue<(offset: Partial<ScrollOffset>) => void>();

export const viewFunction = (viewModel: TableContent): JSX.Element => (
  <div ref={viewModel.rowsViewRef} className={viewModel.classes} role="presentation">
    <Scrollable
      ref={viewModel.scrollableRef}
      onScroll={viewModel.onScrollContent}
    >
      <div ref={viewModel.divRef} className={`${CLASSES.content}`}>
        <Table columns={viewModel.props.columns}>
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
    <ValueSetter type={SetRowsViewOffsetAction} value={viewModel.scrollTo} />
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

  @Ref()
  scrollableRef!: RefObject<Scrollable>;

  @Consumer(PluginsContext)
  plugins: Plugins = new Plugins();

  @Effect()
  subscribeToRowClick(): () => void {
    const onRowClick = this.onRowClick.bind(this);
    eventsEngine.on(this.divRef.current, clickEvent, `.${CLASSES.row}`, onRowClick);
    return (): void => eventsEngine.off(this.divRef.current, clickEvent, onRowClick);
  }

  @Effect()
  calculateRowsViewHeight(): () => void {
    this.onResize(this.rowsViewRef.current);

    resizeObserverSingleton.observe(this.rowsViewRef.current, ({ target }) => {
      this.onResize(target);
    });

    return (): void => {
      resizeObserverSingleton.unobserve(this.rowsViewRef.current);
    };
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
    return this.plugins.getValue(TotalCount) === 0;
  }

  onScrollContent(e: ScrollEventArgs): void {
    this.plugins.callAction(SetRowsViewScrollPositionAction, e.scrollOffset);
  }

  scrollTo(e: Partial<ScrollOffset>): void {
    this.scrollableRef.current?.scrollTo(e);
  }

  onResize(target: HTMLDivElement | null): void {
    this.plugins.set(RowsViewHeightValue, getElementHeight(target));
  }
}
