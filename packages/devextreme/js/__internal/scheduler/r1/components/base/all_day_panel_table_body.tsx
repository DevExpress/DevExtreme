import type { PropsWithClassName } from '__internal/core/r1';
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import type { JSXTemplate } from '@ts/core/r1/types';
import { getTemplate } from '@ts/core/r1/utils/index';

import { combineClasses } from '../../../../core/r1/utils/render_utils';
import type { ViewCellData } from '../../types';
import type { DataCellTemplateProps, DefaultProps, PropsWithViewContext } from '../types';
import { AllDayPanelCell } from './all_day_panel_cell';
import { Row } from './row';

export interface AllDayPanelTableBodyProps extends
  PropsWithClassName,
  PropsWithViewContext {
  viewData: ViewCellData[];
  isVerticalGroupOrientation?: boolean;
  leftVirtualCellWidth: number;
  rightVirtualCellWidth: number;
  leftVirtualCellCount?: number;
  rightVirtualCellCount?: number;
  dataCellTemplate?: JSXTemplate<DataCellTemplateProps>;
}

export const AllDayPanelTableBodyDefaultProps: DefaultProps<AllDayPanelTableBodyProps> = {
  viewData: [],
  isVerticalGroupOrientation: false,
  className: '',
  leftVirtualCellWidth: 0,
  rightVirtualCellWidth: 0,
};

export class AllDayPanelTableBody extends BaseInfernoComponent<AllDayPanelTableBodyProps> {
  render(): JSX.Element {
    const {
      className,
      viewData,
      viewContext,
      leftVirtualCellWidth,
      rightVirtualCellWidth,
      leftVirtualCellCount,
      rightVirtualCellCount,
      isVerticalGroupOrientation,
      dataCellTemplate,
    } = this.props;
    const classes = combineClasses({
      'dx-scheduler-all-day-table-row': true,
      [className ?? '']: !!className,
    });
    const DataCellTemplateComponent = getTemplate(dataCellTemplate);

    return (
      // @ts-ignore
      <Row
        leftVirtualCellWidth={leftVirtualCellWidth}
        rightVirtualCellWidth={rightVirtualCellWidth}
        leftVirtualCellCount={leftVirtualCellCount}
        rightVirtualCellCount={rightVirtualCellCount}
        className={classes}
      >
        {
          viewData.map(({
            endDate,
            groupIndex: cellGroupIndex,
            groups,
            index: cellIndex,
            isFirstGroupCell,
            isFocused,
            isLastGroupCell,
            isSelected,
            key,
            startDate,
          }) => (
            // @ts-ignore
            <AllDayPanelCell
              key={key}
              viewContext={viewContext}
              isFirstGroupCell={!isVerticalGroupOrientation && isFirstGroupCell}
              isLastGroupCell={!isVerticalGroupOrientation && isLastGroupCell}
              startDate={startDate}
              endDate={endDate}
              groups={groups}
              groupIndex={cellGroupIndex}
              index={cellIndex}
              dataCellTemplate={DataCellTemplateComponent}
              isSelected={isSelected ?? false}
              isFocused={isFocused ?? false}
            />
          ))
        }
      </Row>
    );
  }
}

AllDayPanelTableBody.defaultProps = AllDayPanelTableBodyDefaultProps;
