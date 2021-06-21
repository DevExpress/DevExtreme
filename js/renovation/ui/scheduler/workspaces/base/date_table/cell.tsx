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

const ADD_APPOINTMENT_LABEL = 'Add appointment';

export const viewFunction = ({
  props: {
    isFirstGroupCell,
    isLastGroupCell,
    dataCellTemplate,
    children,
  },
  classes,
  dataCellTemplateProps,
  ariaLabel,
}: DateTableCellBase): JSX.Element => (
  <Cell
    isFirstGroupCell={isFirstGroupCell}
    isLastGroupCell={isLastGroupCell}
    contentTemplate={dataCellTemplate}
    contentTemplateProps={dataCellTemplateProps}
    className={classes}
    ariaLabel={ariaLabel}
  >
    {children}
  </Cell>
);

@ComponentBindings()
export class DateTableCellBaseProps extends CellBaseProps {
  @Template() dataCellTemplate?: JSXTemplate<DataCellTemplateProps>;

  @OneWay() otherMonth?: boolean = false;

  @OneWay() today?: boolean = false;

  @OneWay() firstDayOfMonth?: boolean = false;

  @OneWay() isSelected = false;

  @OneWay() isFocused = false;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateTableCellBase extends JSXComponent(DateTableCellBaseProps) {
  get classes(): string {
    const {
      className = '',
      allDay,
      isSelected,
      isFocused,
    } = this.props;
    return combineClasses({
      'dx-scheduler-cell-sizes-horizontal': true,
      'dx-scheduler-cell-sizes-vertical': !allDay,
      'dx-scheduler-date-table-cell': !allDay,
      'dx-state-focused': isSelected,
      'dx-scheduler-focused-cell': isFocused,
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

  get ariaLabel(): string | undefined {
    return this.props.isSelected ? ADD_APPOINTMENT_LABEL : undefined;
  }
}
