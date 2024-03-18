import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import {
  createComponentVNode,
  createFragment,
  normalizeProps,
} from 'inferno';

import { GroupPanelHorizontalRow } from './m_group_panel_horizontal_row';
import { GroupPanelBaseProps } from './m_group_panel_props';

export const viewFunction = (_ref) => {
  const {
    groupPanelItems,
    props: {
      resourceCellTemplate,
    },
  } = _ref;
  return createFragment(groupPanelItems.map((group) => createComponentVNode(2, GroupPanelHorizontalRow, {
    groupItems: group,
    cellTemplate: resourceCellTemplate,
  }, group[0].key)), 0);
};

export const HorizontalGroupPanelLayoutProps = GroupPanelBaseProps;

const getTemplate = (
  TemplateProp,
) => TemplateProp
  && (TemplateProp.defaultProps
    ? (props) => normalizeProps(createComponentVNode(2, TemplateProp, { ...props }))
    : TemplateProp
  );

export class GroupPanelHorizontalLayout extends BaseInfernoComponent {
  private readonly __getterCache: any;

  constructor(props) {
    super(props);
    this.state = {};
    this.__getterCache = {};
  }

  get groupPanelItems() {
    if (this.__getterCache.groupPanelItems !== undefined) {
      return this.__getterCache.groupPanelItems;
    }
    // eslint-disable-next-line no-return-assign
    return this.__getterCache.groupPanelItems = (() => {
      const {
        groupPanelData,
      } = this.props as any;
      const {
        baseColSpan,
        groupPanelItems,
      } = groupPanelData;
      const colSpans = groupPanelItems.reduceRight((currentColSpans, groupsRow, index) => {
        const nextColSpans = currentColSpans;
        const currentLevelGroupCount = groupsRow.length;
        const previousColSpan = index === groupPanelItems.length - 1 ? baseColSpan : currentColSpans[index + 1];
        const previousLevelGroupCount = index === groupPanelItems.length - 1 ? currentLevelGroupCount : groupPanelItems[index + 1].length;
        const groupCountDiff = previousLevelGroupCount / currentLevelGroupCount;
        nextColSpans[index] = groupCountDiff * previousColSpan;
        return nextColSpans;
      }, [...new Array(groupPanelItems.length)]);
      return groupPanelItems.map((groupsRenderRow, index) => {
        const colSpan = colSpans[index];
        return groupsRenderRow.map((groupItem) => ({
          ...groupItem,
          colSpan,
        }));
      });
    })();
  }

  componentWillUpdate(nextProps) {
    if (this.props.groupPanelData !== nextProps.groupPanelData) {
      this.__getterCache.groupPanelItems = undefined;
    }
  }

  render() {
    const { props } = this;
    return viewFunction({
      props: {
        ...props,
        resourceCellTemplate: getTemplate(props.resourceCellTemplate),
      },
      groupPanelItems: this.groupPanelItems,
    });
  }
}

GroupPanelHorizontalLayout.defaultProps = HorizontalGroupPanelLayoutProps;
