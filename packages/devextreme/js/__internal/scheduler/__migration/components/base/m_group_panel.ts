import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import { createComponentVNode, normalizeProps } from 'inferno';

import { VERTICAL_GROUP_ORIENTATION } from '../../const';
import { isVerticalGroupingApplied } from '../../utils/index';
import { GroupPanelHorizontalLayout } from './m_group_panel_horizontal';
import { GroupPanelBaseProps } from './m_group_panel_props';
import { GroupPanelVerticalLayout } from './m_group_panel_vertical';

export const viewFunction = (_ref) => {
  const {
    isVerticalLayout,
    props: {
      className,
      elementRef,
      groupPanelData,
      height,
      resourceCellTemplate,
    },
    restAttributes,
  } = _ref;
  return isVerticalLayout ? createComponentVNode(2, GroupPanelVerticalLayout, {
    height,
    resourceCellTemplate,
    className,
    groupPanelData,
    elementRef,
    styles: restAttributes.style,
  }) : createComponentVNode(2, GroupPanelHorizontalLayout, {
    height,
    resourceCellTemplate,
    className,
    groupPanelData,
    elementRef,
    styles: restAttributes.style,
  });
};

export const GroupPanelProps = Object.create(Object.prototype, {
  ...Object.getOwnPropertyDescriptors(GroupPanelBaseProps),
  ...Object.getOwnPropertyDescriptors({
    groups: Object.freeze([]),
    groupOrientation: VERTICAL_GROUP_ORIENTATION,
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

export class GroupPanel extends InfernoWrapperComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  createEffects() {
    return [createReRenderEffect()];
  }

  get isVerticalLayout() {
    const {
      groupOrientation,
      groups,
    } = this.props as any;
    return isVerticalGroupingApplied(groups, groupOrientation);
  }

  render() {
    const { props } = this;

    return viewFunction({
      props: {
        ...props,
        resourceCellTemplate: getTemplate(props.resourceCellTemplate),
      },
      isVerticalLayout: this.isVerticalLayout,
      restAttributes: { ...props },
    });
  }
}
GroupPanel.defaultProps = GroupPanelProps;
