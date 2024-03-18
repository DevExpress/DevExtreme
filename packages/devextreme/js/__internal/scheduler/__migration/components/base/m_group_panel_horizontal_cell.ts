import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { createComponentVNode, createVNode, normalizeProps } from 'inferno';

import { renderUtils } from '../../utils/index';
import { GroupPanelCellProps } from './m_group_panel_props';

export const viewFunction = (_ref) => {
  const {
    classes,
    props: {
      cellTemplate: CellTemplate,
      colSpan,
      color,
      data,
      id,
      index,
      text,
    },
  } = _ref;
  return createVNode(1, 'th', classes, createVNode(1, 'div', 'dx-scheduler-group-header-content', [!!CellTemplate && CellTemplate({
    data: {
      data,
      id,
      color,
      text,
    },
    index,
  }), !CellTemplate && createVNode(1, 'div', null, text, 0)], 0), 2, {
    colSpan,
  });
};
export const GroupPanelHorizontalCellProps = Object.create(Object.prototype, {
  ...Object.getOwnPropertyDescriptors(GroupPanelCellProps),
  ...Object.getOwnPropertyDescriptors({
    isFirstGroupCell: false,
    isLastGroupCell: false,
    colSpan: 1,
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

export class GroupPanelHorizontalCell extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  get classes() {
    const {
      className,
      isFirstGroupCell,
      isLastGroupCell,
    } = this.props as any;

    return renderUtils.combineClasses({
      'dx-scheduler-group-header': true,
      'dx-scheduler-first-group-cell': isFirstGroupCell,
      'dx-scheduler-last-group-cell': isLastGroupCell,
      [className]: !!className,
    });
  }

  render() {
    const { props } = this;
    return viewFunction({
      props: {
        ...props,
        cellTemplate: getTemplate(props.cellTemplate),
      },
      classes: this.classes,
    });
  }
}
GroupPanelHorizontalCell.defaultProps = GroupPanelHorizontalCellProps;
