import {
  Component, ComponentBindings, JSXComponent, OneWay, Template,
} from 'devextreme-generator/component_declaration/common';
import { GroupPanelVerticalCell } from './cell';
import { GroupRenderItem, GroupPanelCellTemplateProps } from '../../../types.d';

export const viewFunction = (viewModel: Row): JSX.Element => (
  <div
    className={`dx-scheduler-group-row ${viewModel.props.className}`}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    {viewModel.props.groupItems.map(({
      text, id, data, key, color,
    }, index) => (
      <GroupPanelVerticalCell
        key={key}
        text={text}
        id={id}
        data={data}
        index={index}
        color={color}
        cellTemplate={viewModel.props.cellTemplate}
      />
    ))}
  </div>
);

@ComponentBindings()
export class RowProps {
  @OneWay() groupItems!: GroupRenderItem[];

  @Template() cellTemplate?: GroupPanelCellTemplateProps;

  @OneWay() className?: string = '';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Row extends JSXComponent(RowProps) {}
