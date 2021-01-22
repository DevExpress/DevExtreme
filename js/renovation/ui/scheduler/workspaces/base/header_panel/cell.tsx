import {
  Component,
  ComponentBindings,
  JSXComponent,
  Template,
  OneWay,
  JSXTemplate,
} from 'devextreme-generator/component_declaration/common';
import { CellBase, CellBaseProps } from '../cell';
import { DateTimeCellTemplateProps } from '../../types.d';
import { combineClasses } from '../../../../../utils/combine_classes';

export const viewFunction = ({
  restAttributes,
  classes,
  dateCellTemplateProps,
  props: {
    text,
    dateCellTemplate,
    isFirstGroupCell,
    isLastGroupCell,
    colSpan,
  },
}: HeaderPanelCell): JSX.Element => (
  <CellBase
    className={classes}
    isFirstGroupCell={isFirstGroupCell}
    isLastGroupCell={isLastGroupCell}
    contentTemplate={dateCellTemplate}
    contentTemplateProps={dateCellTemplateProps}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
    colSpan={colSpan}
  >
    <div>
      {text}
    </div>
  </CellBase>
);

@ComponentBindings()
export class HeaderPanelCellProps extends CellBaseProps {
  @OneWay() today = false;

  @Template() dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;
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

  get dateCellTemplateProps(): DateTimeCellTemplateProps {
    const {
      startDate,
      text,
      groups,
      groupIndex,
      index,
    } = this.props;

    return {
      data: {
        date: startDate,
        text,
        groups,
        groupIndex,
      },
      index,
    };
  }
}
