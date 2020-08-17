import {
  Component, ComponentBindings, JSXComponent, OneWay, Template,
} from 'devextreme-generator/component_declaration/common';
import { Group, GroupRenderItem, GroupItem } from '../../../types.d';
import { Row } from './row';
import { addHeightToStyle } from '../../../utils';

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
        data: data[index],
      })));
    }

    repeatCount *= items.length;
    return result;
  });
};

export const viewFunction = (viewModel: GroupPanelVerticalLayout): JSX.Element => (
  <div
    className={`dx-scheduler-work-space-vertical-group-table ${viewModel.props.className}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    style={viewModel.style}
  >
    <div className="dx-scheduler-group-flex-container">
      {viewModel.groupsRenderData.map((group: GroupRenderItem[]) => (
        <Row
          groupItems={group}
          cellTemplate={viewModel.props.cellTemplate}
          key={group[0].key}
        />
      ))}
    </div>
  </div>
);

@ComponentBindings()
export class GroupPanelVerticalLayoutProps {
  @OneWay() groups: Group[] = [];

  @OneWay() height?: number;

  @Template() cellTemplate!: (props: {
    data: {
      data?: GroupItem;
      id?: string | number;
      color?: string;
      text?: string;
    };
    index?: number;
  }) => JSX.Element;

  @OneWay() className?: string = '';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class GroupPanelVerticalLayout extends JSXComponent(GroupPanelVerticalLayoutProps) {
  get style(): { [key: string]: string | number | undefined } {
    const { height } = this.props;
    const { style } = this.restAttributes;

    return addHeightToStyle(height, style);
  }

  get groupsRenderData(): GroupRenderItem[][] {
    const { groups } = this.props;

    return getGroupsRenderData(groups);
  }
}
