import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  Template,
} from '@devextreme-generator/declarations';
import { CellBase as Cell, CellBaseProps } from '../cell';
import { DateTimeCellTemplateProps } from '../../types';

export const viewFunction = ({
  props: {
    text,
    isFirstGroupCell,
    isLastGroupCell,
    className,
    timeCellTemplate: TimeCellTemplate,
  },
  timeCellTemplateProps,
}: TimePanelCell): JSX.Element => (
  <Cell
    isFirstGroupCell={isFirstGroupCell}
    isLastGroupCell={isLastGroupCell}
    className={`dx-scheduler-time-panel-cell dx-scheduler-cell-sizes-vertical ${className}`}
  >

    {!TimeCellTemplate && (
      <div>
        {text}
      </div>
    )}
    {!!TimeCellTemplate && (
      <TimeCellTemplate
        index={timeCellTemplateProps.index}
        data={timeCellTemplateProps.data}
      />
    )}
  </Cell>
);

@ComponentBindings()
export class TimePanelCellProps extends CellBaseProps {
  @Template() timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class TimePanelCell extends JSXComponent(TimePanelCellProps) {
  get timeCellTemplateProps(): DateTimeCellTemplateProps {
    const {
      index, startDate, groups, groupIndex, text,
    } = this.props;
    return {
      data: {
        date: startDate, groups, groupIndex, text,
      },
      index,
    };
  }
}
