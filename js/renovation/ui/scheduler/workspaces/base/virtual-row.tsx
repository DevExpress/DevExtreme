import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { addHeightToStyle } from '../utils';
import { RowProps, Row } from './row';
import { VirtualCell } from './virtual-cell';

export const viewFunction = (viewModel: VirtualRow): JSX.Element => (
  <Row
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    style={viewModel.style}
    className={viewModel.classes}
  >
    {viewModel.virtualCells.map((_, index) => (
      <VirtualCell key={index.toString()} />
    ))}
  </Row>
);

@ComponentBindings()
export class VirtualRowProps extends RowProps {
  @OneWay() height?: number;

  @OneWay() cellsCount = 1;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class VirtualRow extends JSXComponent(VirtualRowProps) {
  get style(): { [key: string]: string | number | undefined } {
    const { height } = this.props;
    const { style } = this.restAttributes;

    return addHeightToStyle(height, style);
  }

  get classes(): string {
    const { className } = this.props;

    return `dx-scheduler-virtual-row ${className}`;
  }

  get virtualCells(): unknown[] {
    const { cellsCount } = this.props;

    return [...Array(cellsCount)];
  }
}
