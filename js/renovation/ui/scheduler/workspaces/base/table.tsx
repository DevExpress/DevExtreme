import {
  Component, ComponentBindings, JSXComponent, OneWay, Slot, Fragment,
} from 'devextreme-generator/component_declaration/common';
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
  },
}: Table): JSX.Element => (
  <table
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
    className={className}
    style={style}
  >
    <tbody>
      {/*
        This is a workaround for https://github.com/preactjs/preact/issues/2987
        TODO: remove once we start using inferno
      */}
      {hasTopVirtualRow && hasBottomVirtualRow && (
        <Fragment>
          <VirtualRow
            height={topVirtualRowHeight}
            cellsCount={virtualCellsCount}
          />
          {children}
          <VirtualRow
            height={bottomVirtualRowHeight}
            cellsCount={virtualCellsCount}
          />
        </Fragment>
      )}
      {hasTopVirtualRow && !hasBottomVirtualRow && (
        <Fragment>
          <VirtualRow
            height={topVirtualRowHeight}
            cellsCount={virtualCellsCount}
          />
          {children}
        </Fragment>
      )}
      {!hasTopVirtualRow && hasBottomVirtualRow && (
        <Fragment>
          {children}
          <VirtualRow
            height={bottomVirtualRowHeight}
            cellsCount={virtualCellsCount}
          />
        </Fragment>
      )}
      {!hasTopVirtualRow && !hasBottomVirtualRow && (
        <Fragment>
          {children}
        </Fragment>
      )}

      {/* {hasTopVirtualRow && (
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
      )} */}
    </tbody>
  </table>
);

@ComponentBindings()
export class TableProps {
  @OneWay() className?: string = '';

  @OneWay() topVirtualRowHeight = 0;

  @OneWay() bottomVirtualRowHeight = 0;

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
  get style(): { [key: string]: string | number | undefined } {
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
