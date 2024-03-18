import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import {
  createComponentVNode,
  createFragment,
  createVNode,
  normalizeProps,
} from 'inferno';

import { renderUtils } from '../../utils/index';
import { CellBaseProps } from './m_cell';
import { DateHeaderText } from './m_date_header_text';

export const viewFunction = (_ref) => {
  const {
    classes,
    props: {
      colSpan,
      dateCellTemplate: DateCellTemplate,
      groupIndex,
      groups,
      index,
      isTimeCellTemplate,
      splitText,
      startDate,
      text,
      timeCellTemplate: TimeCellTemplate,
    },
    useTemplate,
  } = _ref;
  return createVNode(1, 'th', classes, useTemplate ? createFragment([isTimeCellTemplate && TimeCellTemplate && TimeCellTemplate({
    data: {
      date: startDate,
      text,
      groups,
      groupIndex,
    },
    index,
  }), !isTimeCellTemplate && DateCellTemplate && DateCellTemplate({
    data: {
      date: startDate,
      text,
      groups,
      groupIndex,
    },
    index,
  })], 0) : createComponentVNode(2, DateHeaderText, {
    splitText,
    text,
  }), 0, {
    colSpan,
    title: text,
  });
};
export const DateHeaderCellProps = Object.create(Object.prototype, {
  ...Object.getOwnPropertyDescriptors(CellBaseProps),
  ...Object.getOwnPropertyDescriptors({
    today: false,
    colSpan: 1,
    isWeekDayCell: false,
    splitText: false,
    isTimeCellTemplate: false,
  }),
});
const getTemplate = (
  TemplateProp,
) => TemplateProp
  && (
    TemplateProp.defaultProps
      ? (props) => normalizeProps(createComponentVNode(2, TemplateProp, { ...props }))
      : TemplateProp
  );
export class DateHeaderCell extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  get classes() {
    const {
      className,
      isFirstGroupCell,
      isLastGroupCell,
      isWeekDayCell,
      today,
    } = this.props as any;
    const cellClasses = renderUtils.combineClasses({
      'dx-scheduler-header-panel-cell': true,
      'dx-scheduler-cell-sizes-horizontal': true,
      'dx-scheduler-header-panel-current-time-cell': today,
      'dx-scheduler-header-panel-week-cell': isWeekDayCell,
      [className]: !!className,
    });
    return renderUtils.getGroupCellClasses(isFirstGroupCell, isLastGroupCell, cellClasses);
  }

  get useTemplate() {
    const {
      dateCellTemplate,
      isTimeCellTemplate,
      timeCellTemplate,
    } = this.props;
    return !isTimeCellTemplate && !!dateCellTemplate || isTimeCellTemplate && !!timeCellTemplate;
  }

  render() {
    const { props } = this;
    return viewFunction({
      props: {
        ...props,
        timeCellTemplate: getTemplate(props.timeCellTemplate),
        dateCellTemplate: getTemplate(props.dateCellTemplate),
      },
      classes: this.classes,
      useTemplate: this.useTemplate,
    });
  }
}
DateHeaderCell.defaultProps = DateHeaderCellProps;
