import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { createComponentVNode, createVNode, normalizeProps } from 'inferno';

import { GroupPanelCellProps } from './m_group_panel_props';

export const viewFunction = (viewModel) => {
  const CellTemplate = viewModel.props.cellTemplate;
  return createVNode(1, 'div', 'dx-scheduler-group-header '.concat(viewModel.props.className), [!!viewModel.props.cellTemplate && CellTemplate({
    data: {
      data: viewModel.props.data,
      id: viewModel.props.id,
      color: viewModel.props.color,
      text: viewModel.props.text,
    },
    index: viewModel.props.index,
  }), !viewModel.props.cellTemplate && createVNode(1, 'div', 'dx-scheduler-group-header-content', viewModel.props.text, 0)], 0);
};

const getTemplate = (
  TemplateProp,
) => TemplateProp
  && (
    TemplateProp.defaultProps
      ? (props) => normalizeProps(createComponentVNode(2, TemplateProp, { ...props }))
      : TemplateProp
  );

export class GroupPanelVerticalCell extends BaseInfernoComponent {
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

GroupPanelVerticalCell.defaultProps = GroupPanelCellProps;
