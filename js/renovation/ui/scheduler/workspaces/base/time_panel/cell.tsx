import {
  Component, ComponentBindings, JSXComponent, Template,
} from 'devextreme-generator/component_declaration/common';
import { CellBase as Cell, CellBaseProps } from '../cell';
import { ContentTemplateProps } from '../../types.d';

export const viewFunction = (viewModel: TimePanelCell): JSX.Element => (
  <Cell
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    isFirstGroupCell={viewModel.props.isFirstGroupCell}
    isLastGroupCell={viewModel.props.isLastGroupCell}
    contentTemplate={viewModel.props.timeCellTemplate}
    contentTemplateProps={viewModel.timeCellTemplateProps}
    className={`dx-scheduler-time-panel-cell dx-scheduler-cell-sizes-vertical ${viewModel.props.className}`}
  >
    <div>
      {viewModel.props.text}
    </div>
  </Cell>
);

@ComponentBindings()
export class TimePanelCellProps extends CellBaseProps {
  @Template() timeCellTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class TimePanelCell extends JSXComponent(TimePanelCellProps) {
  get timeCellTemplateProps(): ContentTemplateProps {
    const {
      index, startDate, groups, groupIndex, text,
    } = this.props;
    return {
      data: {
        date: startDate, groups, groupIndex, text,
      },
      index,
    };
  }
}
