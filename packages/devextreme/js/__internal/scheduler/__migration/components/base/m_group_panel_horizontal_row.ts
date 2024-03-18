import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { createComponentVNode, createVNode, normalizeProps } from 'inferno';

import { GroupPanelHorizontalCell } from './m_group_panel_horizontal_cell';
import { GroupPanelRowProps } from './m_group_panel_props';

export const viewFunction = (_ref) => {
  const {
    props: {
      cellTemplate,
      className,
      groupItems,
    },
  } = _ref;
  return createVNode(1, 'tr', 'dx-scheduler-group-row '.concat(className), groupItems.map((_ref2, index) => {
    const {
      colSpan,
      color,
      data,
      id,
      isFirstGroupCell,
      isLastGroupCell,
      key,
      text,
    } = _ref2;
    return createComponentVNode(2, GroupPanelHorizontalCell, {
      text,
      id,
      data,
      index,
      color,
      colSpan,
      isFirstGroupCell: !!isFirstGroupCell,
      isLastGroupCell: !!isLastGroupCell,
      cellTemplate,
    }, key);
  }), 0);
};
const getTemplate = (
  TemplateProp,
) => TemplateProp
  && (
    TemplateProp.defaultProps
      ? (props) => normalizeProps(createComponentVNode(2, TemplateProp, { ...props }))
      : TemplateProp
  );

export class GroupPanelHorizontalRow extends BaseInfernoComponent {
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

GroupPanelHorizontalRow.defaultProps = GroupPanelRowProps;
