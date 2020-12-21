import {
  Component, ComponentBindings, JSXComponent, OneWay, Slot,
} from 'devextreme-generator/component_declaration/common';
import { Style } from '../../types.d';
import { addHeightToStyle } from '../utils';
import { VirtualRow } from './virtual-row';

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
        />
      )}
      {children}
      {hasBottomVirtualRow && (
        <VirtualRow
          height={bottomVirtualRowHeight}
          cellsCount={virtualCellsCount}
          leftVirtualCellWidth={leftVirtualCellWidth}
          rightVirtualCellWidth={rightVirtualCellWidth}
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

  @OneWay() virtualCellsCount = 0;

  @OneWay() isVirtual?: boolean = false;

  @OneWay() height?: number;

  @Slot() children?: JSX.Element | JSX.Element[];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Table extends JSXComponent(TableProps) {
  get style(): Style {
    const { height } = this.props;
    const { style } = this.restAttributes;

    return addHeightToStyle(height, style);
  }

  get hasTopVirtualRow(): boolean {
    const { isVirtual, topVirtualRowHeight } = this.props;

    return !!isVirtual && !!topVirtualRowHeight;
  }

  get hasBottomVirtualRow(): boolean {
    const { isVirtual, bottomVirtualRowHeight } = this.props;

    return !!isVirtual && !!bottomVirtualRowHeight;
  }
}
