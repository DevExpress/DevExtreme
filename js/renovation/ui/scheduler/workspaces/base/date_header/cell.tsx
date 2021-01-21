import {
  Component,
  ComponentBindings,
  JSXComponent,
  Template,
  OneWay,
  JSXTemplate,
} from 'devextreme-generator/component_declaration/common';
import { CellBaseProps } from '../cell';
import { DateTimeCellTemplateProps } from '../../types.d';

export const viewFunction = ({
  restAttributes,
  props: {
    className,
    startDate,
    text,
    groups,
    groupIndex,
    index,
    dateCellTemplate: DateCellTemplate,
  },
}: HeaderPanelCell): JSX.Element => (
  <th
    className={
      `dx-scheduler-header-panel-cell dx-scheduler-cell-sizes-horizontal ${className}`
    }
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  >
    {DateCellTemplate && (
      <DateCellTemplate
        data={{
          date: startDate,
          text,
          groups,
          groupIndex,
        }}
        index={index}
      />
    )}
    {!DateCellTemplate && (
      <div>
        {text}
      </div>
    )}
  </th>
);

@ComponentBindings()
export class HeaderPanelCellProps extends CellBaseProps {
  @Template() dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @OneWay() today?: boolean = false;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class HeaderPanelCell extends JSXComponent(HeaderPanelCellProps) {}
