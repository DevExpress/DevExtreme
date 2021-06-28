import {
  Component, ComponentBindings, CSSAttributes, JSXComponent, JSXTemplate, OneWay,
} from '@devextreme-generator/declarations';
import { addWidthToStyle } from '../utils';
import { HeaderCell } from './header_cell';
import { CellProps, OrdinaryCell } from './ordinary_cell';

export const viewFunction = ({
  style,
  cellComponent: Cell,
  props: {
    colSpan,
  },
}: VirtualCell): JSX.Element => (
  <Cell
    className="dx-scheduler-virtual-cell"
    styles={style}
    colSpan={colSpan}
  />
);

@ComponentBindings()
export class VirtualCellProps {
  @OneWay() width = 0;

  @OneWay() colSpan?: number;

  @OneWay() isHeaderCell = false;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class VirtualCell extends JSXComponent(VirtualCellProps) {
  get style(): CSSAttributes {
    const { width } = this.props;
    const { style } = this.restAttributes;

    return addWidthToStyle(width, style);
  }

  get cellComponent(): JSXTemplate<CellProps> {
    return this.props.isHeaderCell ? HeaderCell : OrdinaryCell;
  }
}
