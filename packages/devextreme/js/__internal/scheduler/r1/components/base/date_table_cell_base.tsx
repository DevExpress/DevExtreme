import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import type { JSXTemplate } from '@ts/core/r1/types';
import { getTemplate } from '@ts/core/r1/utils/index';

import { combineClasses } from '../../../../core/r1/utils/render_utils';
import { renderUtils } from '../../utils/index';
import { DATE_TABLE_CELL_CLASS } from '../const';
import type { DataCellTemplateProps, DefaultProps } from '../types';
import type { CellBaseProps } from './cell';
import { CellBase, CellBaseDefaultProps } from './cell';

export interface DateTableCellBaseProps extends CellBaseProps {
  dataCellTemplate?: JSXTemplate<DataCellTemplateProps>;
  otherMonth?: boolean;
  today?: boolean;
  firstDayOfMonth?: boolean;
  isSelected: boolean;
  isFocused: boolean;
}

export const DateTableCallBaseDefaultProps: DefaultProps<DateTableCellBaseProps> = {
  ...CellBaseDefaultProps,
  otherMonth: false,
  today: false,
  firstDayOfMonth: false,
  isSelected: false,
  isFocused: false,
};

const ADD_APPOINTMENT_LABEL = 'Add appointment';

export class DateTableCellBase extends BaseInfernoComponent<DateTableCellBaseProps> {
  private dataCellTemplateProps: DataCellTemplateProps | null = null;

  private getDataCellTemplateProps(): DataCellTemplateProps {
    if (this.dataCellTemplateProps !== null) {
      return this.dataCellTemplateProps;
    }

    const {
      allDay,
      contentTemplateProps,
      endDate,
      groupIndex,
      groups,
      index,
      startDate,
    } = this.props;

    this.dataCellTemplateProps = {
      data: {
        startDate,
        endDate,
        groups,
        groupIndex: groups ? groupIndex : undefined,
        text: '',
        allDay: !!allDay || undefined,
        ...contentTemplateProps?.data,
      },
      index,
    };

    return this.dataCellTemplateProps;
  }

  componentWillUpdate(nextProps: DateTableCellBaseProps): void {
    if (this.props.allDay !== nextProps.allDay
      || this.props.contentTemplateProps !== nextProps.contentTemplateProps
      || this.props.endDate !== nextProps.endDate
      || this.props.groupIndex !== nextProps.groupIndex
      || this.props.groups !== nextProps.groups
      || this.props.index !== nextProps.index
      || this.props.startDate !== nextProps.startDate) {
      this.dataCellTemplateProps = null;
    }
  }

  render(): JSX.Element {
    const {
      viewContext,
      allDay,
      className,
      isFocused,
      isSelected,
      isFirstGroupCell,
      isLastGroupCell,
      dataCellTemplate,
      children,
    } = this.props;
    const { view: { type: viewType }, crossScrollingEnabled } = viewContext;

    const cellSizeHorizontalClass = renderUtils
      .getCellSizeHorizontalClass(viewType, crossScrollingEnabled);
    const cellSizeVerticalClass = renderUtils
      .getCellSizeVerticalClass(!!allDay);

    const classes = combineClasses({
      [cellSizeHorizontalClass]: true,
      [cellSizeVerticalClass]: true,
      [DATE_TABLE_CELL_CLASS]: !allDay,
      'dx-state-focused': isSelected,
      'dx-scheduler-focused-cell': isFocused,
      [className ?? '']: true,
    });
    const ariaLabel = isSelected ? ADD_APPOINTMENT_LABEL : undefined;
    const dataCellTemplateProps = this.getDataCellTemplateProps();
    const DataCellTemplateComponent = getTemplate(dataCellTemplate);

    return (
      // @ts-ignore
      <CellBase
        className={classes}
        viewContext={viewContext}
        isFirstGroupCell={isFirstGroupCell}
        isLastGroupCell={isLastGroupCell}
        ariaLabel={ariaLabel}
        startDate={CellBaseDefaultProps.startDate}
        endDate={CellBaseDefaultProps.endDate}
        index={CellBaseDefaultProps.index}
      >
        <>
          {
            !DataCellTemplateComponent && children
          }
          {
            !!DataCellTemplateComponent && DataCellTemplateComponent({
              index: dataCellTemplateProps.index,
              data: dataCellTemplateProps.data,
            })
          }
        </>
      </CellBase>
    );
  }
}

DateTableCellBase.defaultProps = DateTableCallBaseDefaultProps;
