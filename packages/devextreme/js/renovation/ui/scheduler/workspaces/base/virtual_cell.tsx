import {
  Component, ComponentBindings, CSSAttributes, JSXComponent, OneWay,
} from '@devextreme-generator/declarations';
import { renderUtils } from '../../../../../__internal/scheduler/__migration/utils/index';
import { HeaderCell } from './header_cell';
import { OrdinaryCell } from './ordinary_cell';

export const viewFunction = ({
  style,
  props: {
    colSpan,
    isHeaderCell,
  },
}: VirtualCell): JSX.Element => {
  const Cell = isHeaderCell ? HeaderCell : OrdinaryCell;

  return (
    <Cell
      className="dx-scheduler-virtual-cell"
      styles={style}
      colSpan={colSpan}
    />
  );
};

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

    return renderUtils.addWidthToStyle(width, style);
  }
}
