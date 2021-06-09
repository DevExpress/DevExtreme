import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  Template,
  OneWay,
} from '@devextreme-generator/declarations';
import { CellBase as Cell, CellBaseProps } from '../cell';
import { combineClasses } from '../../../../../utils/combine_classes';
import { ContentTemplateProps, DataCellTemplateProps } from '../../types.d';

export const viewFunction = (viewModel: DateTableCellBase): JSX.Element => (
  <Cell
    isFirstGroupCell={viewModel.props.isFirstGroupCell}
    isLastGroupCell={viewModel.props.isLastGroupCell}
    contentTemplate={viewModel.props.dataCellTemplate}
    contentTemplateProps={viewModel.dataCellTemplateProps}
    className={viewModel.classes}
  >
    {viewModel.props.children}
  </Cell>
);

@ComponentBindings()
export class DateTableCellBaseProps extends CellBaseProps {
  @Template() dataCellTemplate?: JSXTemplate<DataCellTemplateProps>;

  @OneWay() otherMonth?: boolean = false;

  @OneWay() today?: boolean = false;

  @OneWay() firstDayOfMonth?: boolean = false;
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
      index, startDate, endDate, groups, groupIndex, allDay, contentTemplateProps,
    } = this.props;

    return {
      data: {
        startDate,
        endDate,
        groups,
        groupIndex: groups ? groupIndex : undefined,
        text: '',
        allDay: !!allDay || undefined,
        ...contentTemplateProps.data,
      },
      index,
    };
  }
}
