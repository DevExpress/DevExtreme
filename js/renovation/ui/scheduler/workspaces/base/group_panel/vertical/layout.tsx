import {
  Component, CSSAttributes, JSXComponent,
} from 'devextreme-generator/component_declaration/common';
import {
  Group,
  GroupRenderItem,
  GroupItem,
} from '../../../types.d';
import { Row } from './row';
import { addHeightToStyle } from '../../../utils';
import { GroupPanelProps } from '../group_panel_props';

const getGroupsRenderData = (groups: Group[]): GroupRenderItem[][] => {
  let repeatCount = 1;
  return groups.map((group: Group) => {
    const result = [] as GroupRenderItem[];
    const { name: resourceName, items, data } = group;

    for (let i = 0; i < repeatCount; i += 1) {
      result.push(...items.map(({ id, text, color }: GroupItem, index: number) => ({
        id,
        text,
        color,
        key: `${i}_${resourceName}_${id}`,
        resourceName,
        data: data?.[index],
      })));
    }

    repeatCount *= items.length;
    return result;
  });
};

export const viewFunction = (viewModel: GroupPanelVerticalLayout): JSX.Element => (
  <div
    className={viewModel.props.className}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    style={viewModel.style}
  >
    <div className="dx-scheduler-group-flex-container">
      {viewModel.groupsRenderData.map((group: GroupRenderItem[]) => (
        <Row
          groupItems={group}
          cellTemplate={viewModel.props.resourceCellTemplate}
          key={group[0].key}
        />
      ))}
    </div>
  </div>
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class GroupPanelVerticalLayout extends JSXComponent(GroupPanelProps) {
  get style(): CSSAttributes {
    const { height } = this.props;
    const { style } = this.restAttributes;

    return addHeightToStyle(height, style);
  }

  get groupsRenderData(): GroupRenderItem[][] {
    const { groups } = this.props;

    return getGroupsRenderData(groups);
  }
}
