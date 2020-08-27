import {
  Component, ComponentBindings, JSXComponent, Template,
} from 'devextreme-generator/component_declaration/common';
import { CellBase as Cell, CellBaseProps } from '../cell';
import { combineClasses } from '../../../../../utils/combine_classes';
import { ContentTemplateProps } from '../../types.d';

export const viewFunction = (viewModel: DateTableCellBase): JSX.Element => (
  <Cell
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    isFirstCell={viewModel.props.isFirstCell}
    isLastCell={viewModel.props.isLastCell}
    contentTemplate={viewModel.props.dataCellTemplate}
    contentTemplateProps={viewModel.dataCellTemplateProps}
    className={viewModel.classes}
  >
    {viewModel.props.children}
  </Cell>
);

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

  get dataCellTemplateProps(): ContentTemplateProps {
    const {
      index, startDate, endDate, groups, groupIndex, text, allDay,
    } = this.props;

    return {
      data: {
        startDate, endDate, groups, groupIndex, text: text || '', allDay,
      },
      index,
    };
  }
}
