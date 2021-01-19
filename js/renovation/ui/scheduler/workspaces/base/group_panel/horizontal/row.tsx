import {
  Component, ComponentBindings, JSXComponent, JSXTemplate, OneWay, Template,
} from 'devextreme-generator/component_declaration/common';
import { GroupPanelHorizontalCell } from './cell';
import { GroupRenderItem, ResourceCellTemplateProps } from '../../../types.d';

export const viewFunction = ({
  restAttributes,
  props: {
    className,
    groupItems,
    cellTemplate,
  },
}: Row): JSX.Element => (
  <tr
    className={`dx-scheduler-group-row ${className}`}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  >
    {groupItems.map(({
      text, id, data, key, color, colSpan, isFirstGroupCell, isLastGroupCell,
    }, index) => (
      <GroupPanelHorizontalCell
        key={key}
        text={text}
        id={id}
        data={data}
        index={index}
        color={color}
        colSpan={colSpan}
        isFirstGroupCell={!!isFirstGroupCell}
        isLastGroupCell={!!isLastGroupCell}
        cellTemplate={cellTemplate}
      />
    ))}
  </tr>
);

@ComponentBindings()
export class RowProps {
  @OneWay() groupItems: GroupRenderItem[] = [];

  @Template() cellTemplate?: JSXTemplate<ResourceCellTemplateProps>;

  @OneWay() className?: string = '';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Row extends JSXComponent(RowProps) {}
