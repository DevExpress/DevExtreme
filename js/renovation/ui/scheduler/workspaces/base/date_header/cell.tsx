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
import { combineClasses } from '../../../../../utils/combine_classes';

export const viewFunction = ({
  restAttributes,
  classes,
  props: {
    startDate,
    text,
    groups,
    groupIndex,
    index,
    dateCellTemplate: DateCellTemplate,
  },
}: HeaderPanelCell): JSX.Element => (
  <th
    className={classes}
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

  @OneWay() today = false;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class HeaderPanelCell extends JSXComponent(HeaderPanelCellProps) {
  get classes(): string {
    const { today, className } = this.props;

    return combineClasses({
      'dx-scheduler-header-panel-cell': true,
      'dx-scheduler-cell-sizes-horizontal': true,
      'dx-scheduler-header-panel-current-time-cell': today,
      [className]: !!className,
    });
  }
}
