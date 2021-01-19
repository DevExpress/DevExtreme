import {
  Component, ComponentBindings, JSXComponent, JSXTemplate, OneWay, Template,
} from 'devextreme-generator/component_declaration/common';
import { combineClasses } from '../../../../../../utils/combine_classes';
import { GroupItem, ResourceCellTemplateProps } from '../../../types.d';

export const viewFunction = ({
  classes,
  restAttributes,
  props: {
    cellTemplate: CellTemplate,
    colSpan,
    data,
    id,
    color,
    text,
    index,
  },
}: GroupPanelHorizontalCell): JSX.Element => (
  <th
    className={classes}
    colSpan={colSpan}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  >
    <div className="dx-scheduler-group-header-content">
      {!!CellTemplate && (
        <CellTemplate
          data={{
            data, id, color, text,
          }}
          index={index}
        />
      )}
      {!CellTemplate && (
        <div>
          {text}
        </div>
      )}
    </div>
  </th>
);

@ComponentBindings()
export class GroupPanelHorizontalCellProps {
  @OneWay() id: string | number = 0;

  @OneWay() text?: string = '';

  @OneWay() color?: string;

  @OneWay() data: GroupItem = { id: 0 };

  @OneWay() index?: number;

  @OneWay() colSpan = 1;

  @OneWay() isFirstGroupCell = false;

  @OneWay() isLastGroupCell = false;

  @Template() cellTemplate?: JSXTemplate<ResourceCellTemplateProps>;

  @OneWay() className = '';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class GroupPanelHorizontalCell extends JSXComponent(GroupPanelHorizontalCellProps) {
  get classes(): string {
    const { isFirstGroupCell, isLastGroupCell, className } = this.props;

    return combineClasses({
      'dx-scheduler-group-header': true,
      'dx-scheduler-first-group-cell': isFirstGroupCell,
      'dx-scheduler-last-group-cell': isLastGroupCell,
      [className]: !!className,
    });
  }
}
