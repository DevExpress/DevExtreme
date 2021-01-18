import {
  Component, ComponentBindings, JSXComponent, JSXTemplate, OneWay, Template,
} from 'devextreme-generator/component_declaration/common';
import { GroupItem, ResourceCellTemplateProps } from '../../../types.d';

export const viewFunction = (viewModel: GroupPanelHorizontalCell): JSX.Element => {
  const CellTemplate = viewModel.props.cellTemplate;

  return (
    <th
      className={`dx-scheduler-group-header ${viewModel.props.className}`}
      colSpan={viewModel.props.colSpan}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...viewModel.restAttributes}
    >
      {!!CellTemplate && (
        <CellTemplate
          data={{
            data: viewModel.props.data,
            id: viewModel.props.id,
            color: viewModel.props.color,
            text: viewModel.props.text,
          }}
          index={viewModel.props.index}
        />
      )}
      {!CellTemplate && (
        <div className="dx-scheduler-group-header-content">
          <div>
            {viewModel.props.text}
          </div>
        </div>
      )}
    </th>
  );
};

@ComponentBindings()
export class GroupPanelHorizontalCellProps {
  @OneWay() id: string | number = 0;

  @OneWay() text?: string = '';

  @OneWay() color?: string;

  @OneWay() data: GroupItem = { id: 0 };

  @OneWay() index?: number;

  @OneWay() colSpan = 1;

  @Template() cellTemplate?: JSXTemplate<ResourceCellTemplateProps>;

  @OneWay() className?: string ='';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class GroupPanelHorizontalCell extends JSXComponent(GroupPanelHorizontalCellProps) {}
