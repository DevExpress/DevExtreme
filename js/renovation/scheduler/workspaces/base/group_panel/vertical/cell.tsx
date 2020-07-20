import {
  Component, ComponentBindings, JSXComponent, OneWay, Template,
} from 'devextreme-generator/component_declaration/common';
import { GroupItem } from '../../../types';

export const viewFunction = (viewModel: GroupPanelVerticalCell) => {
  const useTemplate = !!viewModel.props.cellTemplate;

  return (
    <div
      className={`dx-scheduler-group-header ${viewModel.props.className}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...viewModel.restAttributes}
    >
      {useTemplate && (
        <viewModel.props.cellTemplate
          data={{
            data: viewModel.props.data,
            id: viewModel.props.id,
            color: viewModel.props.color,
            text: viewModel.props.text,
          }}
          index={viewModel.props.index}
        />
      )}
      {!useTemplate && (
        <div className="dx-scheduler-group-header-content">
          {viewModel.props.text}
        </div>
      )}
    </div>
  );
};

@ComponentBindings()
export class GroupPanelVerticalCellProps {
  @OneWay() id?: string | number;

  @OneWay() text?: string = '';

  @OneWay() color?: string;

  @OneWay() data?: GroupItem;

  @OneWay() index?: number;

  @Template() cellTemplate?: any;

  @OneWay() className?: string ='';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class GroupPanelVerticalCell extends JSXComponent(GroupPanelVerticalCellProps) {}
