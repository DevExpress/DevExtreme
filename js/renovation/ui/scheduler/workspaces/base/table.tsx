import {
  Component, ComponentBindings, CSSAttributes, JSXComponent, OneWay, Slot,
} from '@devextreme-generator/declarations';
import { addHeightToStyle } from '../utils';
import { VirtualRow } from './virtual_row';

export const viewFunction = ({
  hasBottomVirtualRow,
  hasTopVirtualRow,
  style,
  restAttributes,
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
  },
}: Table): JSX.Element => (
  <table
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
    className={className}
    style={style}
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

  @OneWay() leftVirtualCellCount = 0;

  @OneWay() rightVirtualCellCount = 0;

  @OneWay() virtualCellsCount = 0;

  @OneWay() height?: number;

  @Slot() children?: JSX.Element | JSX.Element[];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Table extends JSXComponent(TableProps) {
  get style(): CSSAttributes {
    const { height } = this.props;
    const { style } = this.restAttributes;

    return addHeightToStyle(height, style);
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
