import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import { createComponentVNode, createVNode, normalizeProps } from 'inferno';

import { isHorizontalGroupingApplied } from '../../utils/index';
import { DateHeaderLayout } from './m_date_header';
import { GroupPanel, GroupPanelProps } from './m_group_panel';

export const viewFunction = (_ref) => {
  const {
    isHorizontalGrouping,
    props: {
      dateCellTemplate,
      dateHeaderData,
      dateHeaderTemplate: DateHeader,
      groupByDate,
      groupOrientation,
      groupPanelData,
      groups,
      isRenderDateHeader,
      resourceCellTemplate,
      timeCellTemplate,
    },
  } = _ref;
  return createVNode(1, 'thead', null, [isHorizontalGrouping && !groupByDate && createComponentVNode(2, GroupPanel, {
    groupPanelData,
    groups,
    groupByDate,
    groupOrientation,
    resourceCellTemplate,
  }), isRenderDateHeader && DateHeader({
    groupByDate,
    dateHeaderData,
    groupOrientation,
    groups,
    dateCellTemplate,
    timeCellTemplate,
  }), groupByDate && createComponentVNode(2, GroupPanel, {
    groupPanelData,
    groups,
    groupByDate,
    groupOrientation,
    resourceCellTemplate,
  })], 0);
};
export const HeaderPanelLayoutProps = Object.create(Object.prototype, {
  ...Object.getOwnPropertyDescriptors(GroupPanelProps),
  ...Object.getOwnPropertyDescriptors({
    isRenderDateHeader: true,
    dateHeaderTemplate: DateHeaderLayout,
  }),
});

const getTemplate = (
  TemplateProp,
) => TemplateProp
  && (TemplateProp.defaultProps
    ? (props) => normalizeProps(createComponentVNode(2, TemplateProp, { ...props }))
    : TemplateProp
  );

export class HeaderPanelLayout extends InfernoWrapperComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  createEffects() {
    return [createReRenderEffect()];
  }

  get isHorizontalGrouping() {
    const {
      groupOrientation,
      groups,
    } = this.props as any;
    return isHorizontalGroupingApplied(groups, groupOrientation);
  }

  render() {
    const { props } = this;
    return viewFunction({
      props: {
        ...props,
        dateCellTemplate: getTemplate(props.dateCellTemplate),
        timeCellTemplate: getTemplate(props.timeCellTemplate),
        dateHeaderTemplate: getTemplate(props.dateHeaderTemplate),
        resourceCellTemplate: getTemplate(props.resourceCellTemplate),
      },
      isHorizontalGrouping: this.isHorizontalGrouping,
    });
  }
}

HeaderPanelLayout.defaultProps = HeaderPanelLayoutProps;
