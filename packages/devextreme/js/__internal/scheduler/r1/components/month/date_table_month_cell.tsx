import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/index';

import { combineClasses } from '../../../../core/r1/utils/render_utils';
import type { DateTableCellBaseProps } from '../base/date_table_cell_base';
import { DateTableCallBaseDefaultProps, DateTableCellBase } from '../base/date_table_cell_base';
import type { ContentTemplateProps } from '../types';

export class DateTableMonthCell extends BaseInfernoComponent<DateTableCellBaseProps> {
  private contentTemplateProps: ContentTemplateProps | null = null;

  private getContentTemplateProps(): ContentTemplateProps {
    if (this.contentTemplateProps !== null) {
      return this.contentTemplateProps;
    }

    const {
      index,
      text,
    } = this.props;
    this.contentTemplateProps = {
      data: {
        text,
      },
      index,
    };

    return this.contentTemplateProps;
  }

  componentWillUpdate(nextProps: DateTableCellBaseProps): void {
    if (this.props.index !== nextProps.index || this.props.text !== nextProps.text) {
      this.contentTemplateProps = null;
    }
  }

  render(): JSX.Element {
    const {
      viewContext,
      dataCellTemplate,
      endDate,
      groupIndex,
      groups,
      index,
      isFirstGroupCell,
      isFocused,
      isLastGroupCell,
      isSelected,
      startDate,
      text,
      className,
      isFirstDayMonthHighlighting,
      otherMonth,
      today,
    } = this.props;
    const classes = combineClasses({
      'dx-scheduler-date-table-other-month': !!otherMonth,
      'dx-scheduler-date-table-current-date': !!today,
      'dx-scheduler-date-table-first-of-month': !!isFirstDayMonthHighlighting,
      [className ?? '']: !!className,
    });
    const contentTemplateProps = this.getContentTemplateProps();

    return (
      <DateTableCellBase
        className={classes}
        viewContext={viewContext}
        dataCellTemplate={dataCellTemplate}
        startDate={startDate}
        endDate={endDate}
        text={text}
        groups={groups}
        groupIndex={groupIndex}
        index={index}
        isFirstGroupCell={isFirstGroupCell}
        isLastGroupCell={isLastGroupCell}
        isSelected={isSelected}
        isFocused={isFocused}
        contentTemplateProps={contentTemplateProps}
      >
        <div className="dx-scheduler-date-table-cell-text">
          {text}
        </div>
      </DateTableCellBase>
    );
  }
}
DateTableMonthCell.defaultProps = DateTableCallBaseDefaultProps;
