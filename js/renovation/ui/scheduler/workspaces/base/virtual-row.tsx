import {
  Component, ComponentBindings, CSSAttributes, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { addHeightToStyle } from '../utils';
import { RowProps, Row } from './row';
import { VirtualCell } from './virtual-cell';

export const viewFunction = ({
  props: {
    leftVirtualCellWidth,
    rightVirtualCellWidth,
  },
  classes,
  style,
  virtualCells,
  restAttributes,
}: VirtualRow): JSX.Element => (

  <Row
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
    style={style}
    className={classes}
    leftVirtualCellWidth={leftVirtualCellWidth}
    rightVirtualCellWidth={rightVirtualCellWidth}
  >
    {virtualCells.map((_, index) => (
      <VirtualCell key={index.toString()} />
    ))}
  </Row>
);

@ComponentBindings()
export class VirtualRowProps extends RowProps {
  @OneWay() height?: number;

  @OneWay() leftVirtualCellWidth = 0;

  @OneWay() rightVirtualCellWidth = 0;

  @OneWay() cellsCount = 1;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class VirtualRow extends JSXComponent(VirtualRowProps) {
  get style(): CSSAttributes {
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
