import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '@ts/core/r1/utils/index';
import type { VNode } from 'inferno';
import { createComponentVNode, createVNode } from 'inferno';

import { renderUtils } from '../../utils/index';
import type { DateTableCellBaseProps } from '../base/date_table_cell_base';
import { DateTableCallBaseDefaultProps, DateTableCellBase } from '../base/date_table_cell_base';
import type { ContentTemplateProps } from '../types';

export class DateTableMonthCell extends BaseInfernoComponent<DateTableCellBaseProps> {
  private contentTemplateProps: ContentTemplateProps | null = null;

  getContentTemplateProps(): ContentTemplateProps {
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

  render(): VNode {
    const {
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
      firstDayOfMonth,
      otherMonth,
      today,
    } = this.props;
    const classes = renderUtils.combineClasses({
      'dx-scheduler-date-table-other-month': !!otherMonth,
      'dx-scheduler-date-table-current-date': !!today,
      'dx-scheduler-date-table-first-of-month': !!firstDayOfMonth,
      [className]: !!className,
    });
    const contentTemplateProps = this.getContentTemplateProps();
    const dataCellTemplateComponent = getTemplate(dataCellTemplate);

    return createComponentVNode(2, DateTableCellBase, {
      className: classes,
      dataCellTemplate: dataCellTemplateComponent,
      startDate,
      endDate,
      text,
      groups,
      groupIndex,
      index,
      isFirstGroupCell,
      isLastGroupCell,
      isSelected,
      isFocused,
      contentTemplateProps,
      children: createVNode(1, 'div', 'dx-scheduler-date-table-cell-text', text, 0),
    });
  }
}
DateTableMonthCell.defaultProps = DateTableCallBaseDefaultProps;
