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
    style={{ width: '100%' }} // remove after the fix https://github.com/DevExpress/devextreme-renovation/issues/883
  >
    {virtualCells.map(({ height, key }) => <td key={key} style={{ height }} />)}
  </tr>
);

@ComponentBindings()
export class VirtualRowProps {
  @OneWay()
  height = 0;

  @OneWay()
  columnCount = 0;

  @OneWay()
  rowKey = 0;
}

@Component({
  defaultOptionRules: null,
  jQuery: { register: false },
  view: viewFunction,
})
export class VirtualRow extends JSXComponent(VirtualRowProps) {
  get virtualCells(): { key: number; height: number }[] {
    const { height, columnCount } = this.props;
    return Array(columnCount).fill(height).map((item, index) => (
      {
        height: item,
        key: index,
      }
    ));
  }
}
