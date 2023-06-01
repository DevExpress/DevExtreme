import {
  Component, JSXComponent,
} from '@devextreme-generator/declarations';
import { GroupPanelVerticalCell } from './cell';
import { GroupPanelRowProps } from '../row_props';

export const viewFunction = (viewModel: Row): JSX.Element => (
  <div
    className={`dx-scheduler-group-row ${viewModel.props.className}`}
  >
    {viewModel.props.groupItems.map(({
      text, id, data, key, color,
    }, index) => (
      <GroupPanelVerticalCell
        key={key}
        text={text}
        id={id}
        data={data}
        index={index}
        color={color}
        cellTemplate={viewModel.props.cellTemplate}
      />
    ))}
  </div>
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Row extends JSXComponent(GroupPanelRowProps) {}
