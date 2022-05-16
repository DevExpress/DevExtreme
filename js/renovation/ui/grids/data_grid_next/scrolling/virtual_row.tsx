import {
  Component, JSXComponent, ComponentBindings,
  OneWay,
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
  props: {
    rowKey,
  },
}: VirtualRow): JSX.Element => (
  <tr
    key={rowKey}
    className={rowClasses}
    role="presentation"
  >
    {virtualCells.map(({
      height, key, cellClass,
    }) => <td key={key} style={{ height }} className={cellClass} />)}
  </tr>
);

@ComponentBindings()
export class VirtualRowProps {
  @OneWay()
  height = 0;

  @OneWay()
  cellClasses: string[] = [];

  @OneWay()
  rowKey = 0;
}

@Component({
  defaultOptionRules: null,
  jQuery: { register: false },
  view: viewFunction,
})
export class VirtualRow extends JSXComponent(VirtualRowProps) {
  get virtualCells(): { key: number; height: number; cellClass: string }[] {
    const { height, cellClasses } = this.props;
    const cells: { key: number; height: number; cellClass: string }[] = [];

    cellClasses.forEach((c_class, index) => {
      cells.push({
        height,
        key: index,
        cellClass: c_class,
      });
    });

    return cells;
  }
}
