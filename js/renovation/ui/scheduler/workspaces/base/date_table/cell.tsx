import {
  Component, ComponentBindings, JSXComponent, Template,
} from 'devextreme-generator/component_declaration/common';
import { CellBase as Cell, CellBaseProps } from '../cell';
import { combineClasses } from '../../../../../utils/combine_classes';

export const viewFunction = (viewModel: DateTableCellBase): JSX.Element => {
  const DataCellTemplate = viewModel.props.dataCellTemplate;

  return (
    <Cell
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...viewModel.restAttributes}
      isFirstCell={viewModel.props.isFirstCell}
      isLastCell={viewModel.props.isLastCell}
      className={viewModel.classes}
    >
      {DataCellTemplate && (
        <DataCellTemplate
          data={{
            startDate: viewModel.props.startDate,
            endDate: viewModel.props.endDate,
            text: viewModel.props.text,
            groups: viewModel.props.groups,
            allDay: viewModel.props.allDay,
            groupIndex: viewModel.props.groupIndex,
          }}
          // index={viewModel.props.index}
        />
      )}
      {!DataCellTemplate && viewModel.props.children}
    </Cell>
  );
};

@ComponentBindings()
export class DateTableCellBaseProps extends CellBaseProps {
  @Template() dataCellTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateTableCellBase extends JSXComponent(DateTableCellBaseProps) {
  get classes(): string {
    const { className = '', allDay } = this.props;
    return combineClasses({
      'dx-scheduler-cell-sizes-horizontal': true,
      'dx-scheduler-cell-sizes-vertical': !allDay,
      'dx-scheduler-date-table-cell': !allDay,
      [className]: true,
    });
  }
}
