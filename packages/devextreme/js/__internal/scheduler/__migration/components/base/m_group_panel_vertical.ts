import { BaseInfernoComponent, normalizeStyles } from '@devextreme/runtime/inferno';
import { createComponentVNode, createVNode, normalizeProps } from 'inferno';

import { renderUtils } from '../../utils/index';
import { GroupPanelBaseProps } from './m_group_panel_props';
import { GroupPanelVerticalRow } from './m_group_panel_vertical_row';

export const viewFunction = (_ref) => {
  const {
    props: {
      className,
      elementRef,
      groupPanelData,
      resourceCellTemplate,
    },
    style,
  } = _ref;
  return createVNode(1, 'div', className, createVNode(1, 'div', 'dx-scheduler-group-flex-container', groupPanelData.groupPanelItems.map((group) => createComponentVNode(2, GroupPanelVerticalRow, {
    groupItems: group,
    cellTemplate: resourceCellTemplate,
  }, group[0].key)), 0), 2, {
    style: normalizeStyles(style),
  }, null, elementRef);
};

export const VerticalGroupPanelLayoutProps = GroupPanelBaseProps;

const getTemplate = (
  TemplateProp,
) => TemplateProp
  && (
    TemplateProp.defaultProps
      ? (props) => normalizeProps(createComponentVNode(2, TemplateProp, { ...props }))
      : TemplateProp
  );

export class GroupPanelVerticalLayout extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  get style() {
    const {
      height,
      styles,
    } = this.props as any;
    return renderUtils.addHeightToStyle(height, styles);
  }

  render() {
    const { props } = this;
    return viewFunction({
      props: {
        ...props,
        resourceCellTemplate: getTemplate(props.resourceCellTemplate),
      },
      style: this.style,
    });
  }
}

GroupPanelVerticalLayout.defaultProps = VerticalGroupPanelLayoutProps;
