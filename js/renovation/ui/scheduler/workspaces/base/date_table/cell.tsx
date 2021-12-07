import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  Template,
  OneWay,
  Slot,
} from '@devextreme-generator/declarations';
import { CellBase as Cell, CellBaseProps } from '../cell';
import { combineClasses } from '../../../../../utils/combine_classes';
import { DataCellTemplateProps } from '../../types';
import { DATE_TABLE_CELL_CLASS } from '../../const';

const ADD_APPOINTMENT_LABEL = 'Add appointment';

export const viewFunction = ({
  props: {
    isFirstGroupCell,
    isLastGroupCell,
    dataCellTemplate: DataCellTemplate,
    children,
  },
  classes,
  dataCellTemplateProps,
  ariaLabel,
}: DateTableCellBase): JSX.Element => (
  <Cell
    isFirstGroupCell={isFirstGroupCell}
    isLastGroupCell={isLastGroupCell}
    className={classes}
    ariaLabel={ariaLabel}
  >
    {!DataCellTemplate && children}
    {!!DataCellTemplate && (
      <DataCellTemplate
        index={dataCellTemplateProps.index}
        data={dataCellTemplateProps.data}
      />
    )}
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

  @Slot() children?: JSX.Element;
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
      [DATE_TABLE_CELL_CLASS]: !allDay,
      'dx-state-focused': isSelected,
      'dx-scheduler-focused-cell': isFocused,
      [className]: true,
    });
  }

  get dataCellTemplateProps(): DataCellTemplateProps {
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
