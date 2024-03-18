import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import {
  createComponentVNode,
  createFragment,
  normalizeProps,
} from 'inferno';

import { isHorizontalGroupingApplied, themeUtils } from '../../utils/index';
import { DateHeaderCell } from './m_date_header_cell';
import { Row } from './m_row';

const {
  isMaterialBased,
} = themeUtils.getThemeType();

export const viewFunction = (_ref) => {
  const {
    isHorizontalGrouping,
    props: {
      dateCellTemplate,
      dateHeaderData,
    },
  } = _ref;
  const {
    dataMap,
    leftVirtualCellCount,
    leftVirtualCellWidth,
    rightVirtualCellCount,
    rightVirtualCellWidth,
  } = dateHeaderData;
  return createFragment(dataMap.map((dateHeaderRow, rowIndex) => createComponentVNode(2, Row, {
    className: 'dx-scheduler-header-row',
    leftVirtualCellWidth,
    leftVirtualCellCount,
    rightVirtualCellWidth,
    rightVirtualCellCount,
    isHeaderRow: true,
    children: dateHeaderRow.map((_ref2) => {
      const {
        colSpan,
        endDate,
        groupIndex,
        groups: cellGroups,
        index,
        isFirstGroupCell,
        isLastGroupCell,
        key,
        startDate,
        text,
        today,
      } = _ref2;
      return createComponentVNode(2, DateHeaderCell, {
        startDate,
        endDate,
        groups: isHorizontalGrouping ? cellGroups : undefined,
        groupIndex: isHorizontalGrouping ? groupIndex : undefined,
        today,
        index,
        text,
        isFirstGroupCell,
        isLastGroupCell,
        dateCellTemplate,
        colSpan,
        splitText: isMaterialBased,
      }, key);
    }),
  }, rowIndex.toString())), 0);
};
export const DateHeaderLayoutProps = {
  groupOrientation: 'horizontal',
  groupByDate: false,
  groups: Object.freeze([]),
};
const getTemplate = (
  TemplateProp,
) => TemplateProp
  && (TemplateProp.defaultProps
    ? (props) => normalizeProps(createComponentVNode(2, TemplateProp, { ...props }))
    : TemplateProp);

export class DateHeaderLayout extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  get isHorizontalGrouping() {
    const {
      groupByDate,
      groupOrientation,
      groups,
    } = this.props;
    // @ts-expect-error
    return isHorizontalGroupingApplied(groups, groupOrientation) && !groupByDate;
  }

  render() {
    const { props } = this;
    return viewFunction({
      props: {
        ...props,
        dateCellTemplate: getTemplate(props.dateCellTemplate),
        timeCellTemplate: getTemplate(props.timeCellTemplate),
      },
      isHorizontalGrouping: this.isHorizontalGrouping,
    });
  }
}
DateHeaderLayout.defaultProps = DateHeaderLayoutProps;
