import {
  Component, JSXComponent,
} from '@devextreme-generator/declarations';
import { GroupPanelHorizontalCell } from './cell';
import { GroupPanelRowProps } from '../row_props';

export const viewFunction = ({
  props: {
    className,
    groupItems,
    cellTemplate,
  },
}: Row): JSX.Element => (
  <tr
    className={`dx-scheduler-group-row ${className}`}
  >
    {groupItems.map(({
      text, id, data, key, color, colSpan, isFirstGroupCell, isLastGroupCell,
    }, index) => (
      <GroupPanelHorizontalCell
        key={key}
        text={text}
        id={id}
        data={data}
        index={index}
        color={color}
        colSpan={colSpan}
        isFirstGroupCell={!!isFirstGroupCell}
        isLastGroupCell={!!isLastGroupCell}
        cellTemplate={cellTemplate}
      />
    ))}
  </tr>
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Row extends JSXComponent(GroupPanelRowProps) {}
