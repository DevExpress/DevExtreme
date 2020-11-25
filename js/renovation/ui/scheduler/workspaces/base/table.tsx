import {
  Component, ComponentBindings, JSXComponent, OneWay, Slot,
} from 'devextreme-generator/component_declaration/common';
import { addHeightToStyle } from '../utils';
import { VirtualRow } from './virtual-row';

export const viewFunction = (viewModel: Table): JSX.Element => {
  const {
    isVirtual,
    topVirtualRowHeight,
    bottomVirtualRowHeight,
    virtualCellsCount,
    className,
    children,
  } = viewModel.props;
  const hasTopVirtualRow = isVirtual && !!topVirtualRowHeight;
  const hasBottomVirtualRow = isVirtual && !!bottomVirtualRowHeight;

  return (
    <table
        // eslint-disable-next-line react/jsx-props-no-spreading
      {...viewModel.restAttributes}
      className={className}
      style={viewModel.style}
    >
      <tbody>
        {hasTopVirtualRow && (
          <VirtualRow height={topVirtualRowHeight} cellsCount={virtualCellsCount} />
        )}
        {children}
        {hasBottomVirtualRow && (
          <VirtualRow height={bottomVirtualRowHeight} cellsCount={virtualCellsCount} />
        )}
      </tbody>
    </table>
  );
};

@ComponentBindings()
export class TableProps {
  @OneWay() className?: string = '';

  @OneWay() topVirtualRowHeight = 0;

  @OneWay() bottomVirtualRowHeight = 0;

  @OneWay() virtualCellsCount = 0;

  @OneWay() isVirtual?: boolean = false;

  @OneWay() height?: number;

  @Slot() children?: any;
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
}
