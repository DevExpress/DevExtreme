import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import type { JSXTemplate } from '@ts/core/r1/types';
import { getTemplate } from '@ts/core/r1/utils/index';
import { Fragment } from 'inferno';

import { combineClasses } from '../../../../core/r1/utils/render_utils';
import { DATE_TABLE_ROW_CLASS } from '../const';
import type { CellTemplateProps, DefaultProps } from '../types';
import { AllDayPanelTableBody, AllDayPanelTableBodyDefaultProps } from './all_day_panel_table_body';
import { DateTableCellBase } from './date_table_cell_base';
import type { LayoutProps } from './layout_props';
import { LayoutDefaultProps } from './layout_props';
import { Row, RowDefaultProps } from './row';

export interface DateTableBodyProps extends LayoutProps {
  cellTemplate: JSXTemplate<CellTemplateProps>;
}

export const DateTableBodyDefaultProps: DefaultProps<DateTableBodyProps> = {
  ...LayoutDefaultProps,
  cellTemplate: DateTableCellBase,
};

export class DateTableBody extends BaseInfernoComponent<DateTableBodyProps> {
  render(): JSX.Element {
    const {
      viewData,
      viewContext,
      addVerticalSizesClassToRows,
      cellTemplate,
      dataCellTemplate,
    } = this.props;
    const rowClasses = combineClasses({
      [DATE_TABLE_ROW_CLASS]: true,
      'dx-scheduler-cell-sizes-vertical': addVerticalSizesClassToRows,
    });
    const CellTemplateComponent = getTemplate(cellTemplate);
    const DataCellTemplateComponent = getTemplate(dataCellTemplate);

    return (
      <>
        {
          viewData.groupedData.map(({
            allDayPanel,
            dateTable,
            isGroupedAllDayPanel,
            key: fragmentKey,
          }) => (
              <Fragment key={fragmentKey}>
                {
                  // @ts-ignore
                  isGroupedAllDayPanel && <AllDayPanelTableBody
                    viewData={allDayPanel ?? AllDayPanelTableBodyDefaultProps.viewData}
                    viewContext={viewContext}
                    dataCellTemplate={DataCellTemplateComponent}
                    isVerticalGroupOrientation={true}
                    leftVirtualCellWidth={viewData.leftVirtualCellWidth
                      ?? AllDayPanelTableBodyDefaultProps.leftVirtualCellWidth}
                    rightVirtualCellWidth={viewData.rightVirtualCellWidth
                      ?? AllDayPanelTableBodyDefaultProps.rightVirtualCellWidth}
                    leftVirtualCellCount={viewData.leftVirtualCellCount}
                    rightVirtualCellCount={viewData.rightVirtualCellCount}
                  />
                }
                {
                  dateTable.map(({
                    cells,
                    key: rowKey,
                  }) => (
                    // @ts-ignore
                      <Row
                        key={rowKey}
                        className={rowClasses}
                        leftVirtualCellWidth={viewData.leftVirtualCellWidth
                          ?? RowDefaultProps.leftVirtualCellWidth}
                        rightVirtualCellWidth={viewData.rightVirtualCellWidth
                          ?? RowDefaultProps.rightVirtualCellWidth}
                        leftVirtualCellCount={viewData.leftVirtualCellCount}
                        rightVirtualCellCount={viewData.rightVirtualCellCount}
                      >
                        {
                          cells.map(({
                            key: cellKey,
                            endDate,
                            firstDayOfMonth,
                            groupIndex: cellGroupIndex,
                            groups,
                            index: cellIndex,
                            isFirstGroupCell,
                            isFocused,
                            isLastGroupCell,
                            isSelected,
                            otherMonth,
                            startDate,
                            text,
                            today,
                          }) => CellTemplateComponent({
                            key: cellKey,
                            viewContext,
                            isFirstGroupCell,
                            isLastGroupCell,
                            startDate,
                            endDate,
                            groups,
                            groupIndex: cellGroupIndex,
                            index: cellIndex,
                            dataCellTemplate: DataCellTemplateComponent,
                            text,
                            today,
                            otherMonth,
                            firstDayOfMonth,
                            isSelected,
                            isFocused,
                          }))
                        }
                      </Row>
                  ))
                }
              </Fragment>
          ))
        }
      </>
    );
  }
}

DateTableBody.defaultProps = DateTableBodyDefaultProps;
