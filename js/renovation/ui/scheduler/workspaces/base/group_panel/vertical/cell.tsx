import {
  Component, JSXComponent,
} from '@devextreme-generator/declarations';
import { GroupPanelCellProps } from '../cell_props';

export const viewFunction = (viewModel: GroupPanelVerticalCell): JSX.Element => {
  const CellTemplate = viewModel.props.cellTemplate;

  return (
    <div
      className={`dx-scheduler-group-header ${viewModel.props.className}`}
    >
      {!!CellTemplate && (
        <CellTemplate
          data={{
            data: viewModel.props.data,
            id: viewModel.props.id,
            color: viewModel.props.color,
            text: viewModel.props.text,
          }}
          index={viewModel.props.index}
        />
      )}
      {!CellTemplate && (
        <div className="dx-scheduler-group-header-content">
          {viewModel.props.text}
        </div>
      )}
    </div>
  );
};

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class GroupPanelVerticalCell extends JSXComponent(GroupPanelCellProps) {}
