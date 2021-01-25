import {
  Component,
  ComponentBindings,
  JSXComponent,
  Template,
  OneWay,
  JSXTemplate,
} from 'devextreme-generator/component_declaration/common';
import { CellBaseProps } from '../../cell';
import { DateTimeCellTemplateProps } from '../../../types.d';
import { combineClasses } from '../../../../../../utils/combine_classes';
import { getGroupCellClasses } from '../../../utils';

export const viewFunction = ({
  restAttributes,
  classes,
  props: {
    text,
    dateCellTemplate: DateCellTemplate,
    colSpan,
    startDate,
    groups,
    groupIndex,
    index,
  },
}: DateHeaderCell): JSX.Element => (
  <th
    className={classes}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
    colSpan={colSpan}
  >
    {DateCellTemplate ? (
      <DateCellTemplate
        data={{
          date: startDate,
          text,
          groups,
          groupIndex,
        }}
        index={index}
      />
    ) : (
      text
    )}
  </th>
);

@ComponentBindings()
export class DateHeaderCellProps extends CellBaseProps {
  @OneWay() today = false;

  @Template() dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateHeaderCell extends JSXComponent(DateHeaderCellProps) {
  get classes(): string {
    const {
      today,
      className,
      isFirstGroupCell,
      isLastGroupCell,
    } = this.props;

    const cellClasses = combineClasses({
      'dx-scheduler-header-panel-cell': true,
      'dx-scheduler-cell-sizes-horizontal': true,
      'dx-scheduler-header-panel-current-time-cell': today,
      [className]: !!className,
    });

    return getGroupCellClasses(isFirstGroupCell, isLastGroupCell, cellClasses);
  }
}
