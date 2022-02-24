import {
  Component, JSXComponent, ComponentBindings,
  OneWay, Fragment,
} from '@devextreme-generator/declarations';
import CLASSES from '../classes';
import { combineClasses } from '../../../../utils/combine_classes';

const rowClasses = combineClasses({
  [CLASSES.row]: true,
  [CLASSES.columnLines]: true,
  [CLASSES.virtualRow]: true,
});

export const viewFunction = ({
  virtualCells,
}: VirtualRow): JSX.Element => (
  <Fragment>
    <tr
      className={rowClasses}
      role="presentation"
    >
      {virtualCells.map((height) => <td style={{ height }} />)}
    </tr>
  </Fragment>
);

@ComponentBindings()
export class VirtualRowProps {
  @OneWay()
  height = 0;

  @OneWay()
  columnCount = 0;
}

@Component({
  defaultOptionRules: null,
  jQuery: { register: false },
  view: viewFunction,
})
export class VirtualRow extends JSXComponent(VirtualRowProps) {
  get virtualCells(): number[] {
    return Array(this.props.columnCount).fill(this.props.height) as number[];
  }
}
