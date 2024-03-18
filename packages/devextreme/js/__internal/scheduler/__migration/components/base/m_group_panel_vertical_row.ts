import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { createComponentVNode, createVNode, normalizeProps } from 'inferno';

import { GroupPanelRowProps } from './m_group_panel_props';
import { GroupPanelVerticalCell } from './m_group_panel_vertical_cell';

export const viewFunction = (viewModel) => createVNode(1, 'div', 'dx-scheduler-group-row '.concat(viewModel.props.className), viewModel.props.groupItems.map((_ref, index) => {
  const {
    color,
    data,
    id,
    key,
    text,
  } = _ref;
  return createComponentVNode(2, GroupPanelVerticalCell, {
    text,
    id,
    data,
    index,
    color,
    cellTemplate: viewModel.props.cellTemplate,
  }, key);
}), 0);

const getTemplate = (
  TemplateProp,
) => TemplateProp
  && (
    TemplateProp.defaultProps
      ? (props) => normalizeProps(createComponentVNode(2, TemplateProp, { ...props }))
      : TemplateProp
  );

export class GroupPanelVerticalRow extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { props } = this;
    return viewFunction({
      props: {
        ...props,
        cellTemplate: getTemplate(props.cellTemplate),
      },
    });
  }
}

GroupPanelVerticalRow.defaultProps = GroupPanelRowProps;
