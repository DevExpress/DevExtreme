import type { PropsWithClassName } from '__internal/core/r1';
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import type { JSXTemplate } from '@devextreme-generator/declarations';
import { getTemplate } from '@ts/core/r1/utils/index';

import type { ViewCellData } from '../../types';
import { renderUtils } from '../../utils/index';
import type { DataCellTemplateProps } from '../types';
import { AllDayPanelCell } from './all_day_panel_cell';
import { Row } from './row';

export interface AllDayPanelTableBodyProps extends PropsWithClassName {
  viewData: ViewCellData[];
  isVerticalGroupOrientation?: boolean;
  leftVirtualCellWidth: number;
  rightVirtualCellWidth: number;
  leftVirtualCellCount?: number;
  rightVirtualCellCount?: number;
  dataCellTemplate?: JSXTemplate<DataCellTemplateProps>;
}

export const AllDayPanelTableBodyDefaultProps: AllDayPanelTableBodyProps = {
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
      leftVirtualCellWidth,
      rightVirtualCellWidth,
      leftVirtualCellCount,
      rightVirtualCellCount,
      viewData,
      isVerticalGroupOrientation,
      dataCellTemplate,
    } = this.props;
    const classes = renderUtils.combineClasses({
      'dx-scheduler-all-day-table-row': true,
      [className ?? '']: !!className,
    });
    const DataCellTemplateComponent = getTemplate(dataCellTemplate);

    return (
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
            <AllDayPanelCell
              key={key}
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
