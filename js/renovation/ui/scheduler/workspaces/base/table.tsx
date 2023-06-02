import {
  Component,
  ComponentBindings,
  CSSAttributes,
  ForwardRef,
  JSXComponent,
  OneWay,
  Ref,
  RefObject,
  Slot,
} from '@devextreme-generator/declarations';
import { addHeightToStyle, addWidthToStyle } from '../utils';
import { VirtualRow } from './virtual_row';

export const viewFunction = ({
  hasBottomVirtualRow,
  hasTopVirtualRow,
  style,
  props: {
    virtualCellsCount,
    className,
    children,
    topVirtualRowHeight,
    bottomVirtualRowHeight,
    leftVirtualCellWidth,
    rightVirtualCellWidth,
    leftVirtualCellCount,
    rightVirtualCellCount,
    tableRef,
  },
}: Table): JSX.Element => (
  <table
    className={className}
    style={style}
    ref={tableRef}
  >
    <tbody>
      {hasTopVirtualRow && (
        <VirtualRow
          height={topVirtualRowHeight}
          cellsCount={virtualCellsCount}
          leftVirtualCellWidth={leftVirtualCellWidth}
          rightVirtualCellWidth={rightVirtualCellWidth}
          leftVirtualCellCount={leftVirtualCellCount}
          rightVirtualCellCount={rightVirtualCellCount}
        />
      )}
      {children}
      {hasBottomVirtualRow && (
        <VirtualRow
          height={bottomVirtualRowHeight}
          cellsCount={virtualCellsCount}
          leftVirtualCellWidth={leftVirtualCellWidth}
          rightVirtualCellWidth={rightVirtualCellWidth}
          leftVirtualCellCount={leftVirtualCellCount}
          rightVirtualCellCount={rightVirtualCellCount}
        />
      )}
    </tbody>
  </table>
);

@ComponentBindings()
export class TableProps {
  @OneWay() className?: string = '';

  @OneWay() topVirtualRowHeight = 0;

  @OneWay() bottomVirtualRowHeight = 0;

  @OneWay() leftVirtualCellWidth = 0;

  @OneWay() rightVirtualCellWidth = 0;

  @OneWay() leftVirtualCellCount?: number;

  @OneWay() rightVirtualCellCount?: number;

  @OneWay() virtualCellsCount = 0;

  @OneWay() height?: number;

  @OneWay() width?: number;

  @Slot() children?: JSX.Element | JSX.Element[];

  @ForwardRef() tableRef?: RefObject<HTMLTableElement>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Table extends JSXComponent(TableProps) {
  @Ref()
  elementRef!: RefObject<HTMLTableElement>;

  get style(): CSSAttributes {
    const { height, width } = this.props;
    const { style } = this.restAttributes;

    const heightAdded = addHeightToStyle(height, style);

    return addWidthToStyle(width, heightAdded);
  }

  get hasTopVirtualRow(): boolean {
    const { topVirtualRowHeight } = this.props;

    return !!topVirtualRowHeight;
  }

  get hasBottomVirtualRow(): boolean {
    const { bottomVirtualRowHeight } = this.props;

    return !!bottomVirtualRowHeight;
  }
}
