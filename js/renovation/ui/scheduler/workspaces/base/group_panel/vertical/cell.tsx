import {
  Component, ComponentBindings, JSXComponent, JSXTemplate, OneWay, Template,
} from 'devextreme-generator/component_declaration/common';
import { GroupItem, ResourceCellTemplateProps } from '../../../types.d';

export const viewFunction = (viewModel: GroupPanelVerticalCell) => {
  const CellTemplate = viewModel.props.cellTemplate;

  return (
    <div
      className={`dx-scheduler-group-header ${viewModel.props.className}`}
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
          {viewModel.props.text}
        </div>
      )}
    </div>
  );
};

@ComponentBindings()
export class GroupPanelVerticalCellProps {
  @OneWay() id: string | number = 0;

  @OneWay() text?: string = '';

  @OneWay() color?: string;

  @OneWay() data: GroupItem = { id: 0 };

  @OneWay() index?: number;

  @Template() cellTemplate?: JSXTemplate<ResourceCellTemplateProps>;

  @OneWay() className?: string ='';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class GroupPanelVerticalCell extends JSXComponent(GroupPanelVerticalCellProps) {}
