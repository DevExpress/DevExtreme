import {
  Component, ComponentBindings, JSXComponent, Template,
} from 'devextreme-generator/component_declaration/common';
import dateLocalization from '../../../../../../localization/date';
import { CellBaseProps } from '../../base/cell';

export const viewFunction = (viewModel: MonthHeaderPanelCell): JSX.Element => {
  const DateCellTemplate = viewModel.props.dateCellTemplate;

  return (
    <th
      className={
      `dx-scheduler-header-panel-cell dx-scheduler-cell-sizes-horizontal ${viewModel.props.className}`
    }
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...viewModel.restAttributes}
    >
      {DateCellTemplate && (
        <DateCellTemplate
          data={{
            date: viewModel.props.startDate,
            text: viewModel.props.text,
            groups: viewModel.props.groups,
            groupIndex: viewModel.props.groupIndex,
          }}
          index={viewModel.props.index}
        />
      )}
      {!DateCellTemplate && (
        <div>
          {viewModel.weekDay}
        </div>
      )}
    </th>
  );
};

@ComponentBindings()
export class MonthHeaderPanelCellProps extends CellBaseProps {
  @Template() dateCellTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class MonthHeaderPanelCell extends JSXComponent(MonthHeaderPanelCellProps) {
  get weekDay(): string {
    const { startDate } = this.props;

    return dateLocalization.getDayNames('abbreviated')[startDate!.getDay()];
  }
}
