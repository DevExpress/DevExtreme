import {
  Component, ComponentBindings, JSXComponent, Template,
} from 'devextreme-generator/component_declaration/common';
import { CellBase as Cell, CellBaseProps } from '../cell';

export const viewFunction = (viewModel: TimePanelCell): JSX.Element => {
  const TimeCellTemplate = viewModel.props.timeCellTemplate;

  return (
    <Cell
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...viewModel.restAttributes}
      isFirstCell={viewModel.props.isFirstCell}
      isLastCell={viewModel.props.isLastCell}
      className={`dx-scheduler-time-panel-cell dx-scheduler-cell-sizes-vertical ${viewModel.props.className}`}
    >
      {TimeCellTemplate && (
        <TimeCellTemplate
          data={{
            text: viewModel.props.text,
            date: viewModel.props.startDate,
            groups: viewModel.props.groups,
            groupIndex: viewModel.props.groupIndex,
          }}
          index={viewModel.props.index}
        />
      )}
      {!TimeCellTemplate && (
        <div>
          {viewModel.props.text}
        </div>
      )}
    </Cell>
  );
};

@ComponentBindings()
export class TimePanelCellProps extends CellBaseProps {
  @Template() timeCellTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class TimePanelCell extends JSXComponent(TimePanelCellProps) {}
