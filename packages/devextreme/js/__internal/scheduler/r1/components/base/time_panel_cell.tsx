import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import type { JSXTemplate } from '@devextreme-generator/declarations';
import { getTemplate } from '@ts/core/r1/utils/index';

import { renderUtils } from '../../utils/index';
import type { DateTimeCellTemplateProps } from '../types';
import type { CellBaseProps } from './cell';
import { CellBase, CellBaseDefaultProps } from './cell';

export interface TimePanelCellProps extends CellBaseProps {
  highlighted?: boolean;
  timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;
}

export class TimePanelCell extends BaseInfernoComponent<TimePanelCellProps> {
  private timeCellTemplateProps: DateTimeCellTemplateProps | null = null;

  getTimeCellTemplateProps(): DateTimeCellTemplateProps {
    if (this.timeCellTemplateProps !== null) {
      return this.timeCellTemplateProps;
    }

    const {
      groupIndex,
      groups,
      index,
      startDate,
      text,
    } = this.props;
    this.timeCellTemplateProps = {
      data: {
        date: startDate,
        groups,
        groupIndex,
        text,
      },
      index,
    };

    return this.timeCellTemplateProps;
  }

  componentWillUpdate(nextProps: CellBaseProps): void {
    if (this.props.groupIndex !== nextProps.groupIndex
      || this.props.groups !== nextProps.groups
      || this.props.index !== nextProps.index
      || this.props.startDate !== nextProps.startDate
      || this.props.text !== nextProps.text) {
      this.timeCellTemplateProps = null;
    }
  }

  render(): JSX.Element {
    const {
      className,
      viewContext,
      highlighted,
      isFirstGroupCell,
      isLastGroupCell,
      text,
      timeCellTemplate,
    } = this.props;

    const cellSizeVerticalClass = renderUtils
      .getCellSizeVerticalClass(false);
    const classes = renderUtils.combineClasses({
      'dx-scheduler-time-panel-cell': true,
      [cellSizeVerticalClass]: true,
      'dx-scheduler-time-panel-current-time-cell': !!highlighted,
      [className ?? '']: true,
    });
    const timeCellTemplateProps = this.getTimeCellTemplateProps();
    const TimeCellTemplateComponent = getTemplate(timeCellTemplate);

    return (
      <CellBase
        className={classes}
        viewContext={viewContext}
        isFirstGroupCell={isFirstGroupCell}
        isLastGroupCell={isLastGroupCell}
        startDate={CellBaseDefaultProps.startDate}
        endDate={CellBaseDefaultProps.endDate}
        index={CellBaseDefaultProps.index}
      >
        {
          TimeCellTemplateComponent
            ? TimeCellTemplateComponent({
              index: timeCellTemplateProps.index,
              data: timeCellTemplateProps.data,
            })
            : (
              <div>
                {text}
              </div>
            )
        }
      </CellBase>
    );
  }
}

TimePanelCell.defaultProps = CellBaseDefaultProps;
