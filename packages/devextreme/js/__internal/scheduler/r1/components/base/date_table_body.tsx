import dateLocalization from '@js/common/core/localization/date';
import dateUtils from '@js/core/utils/date';
import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/index';
import type { JSXTemplate } from '@ts/core/r1/types';
import { PublicTemplate } from '@ts/scheduler/r1/components/templates/index';
import { Fragment } from 'inferno';

import { combineClasses } from '../../../../core/r1/utils/render_utils';
import { DATE_TABLE_ROW_CLASS } from '../const';
import type { CellTemplateProps, DefaultProps } from '../types';
import { AllDayPanelTableBody, AllDayPanelTableBodyDefaultProps } from './all_day_panel_table_body';
import { DateTableCellBase } from './date_table_cell_base';
import type { LayoutProps } from './layout_props';
import { LayoutDefaultProps } from './layout_props';
import { Row, RowDefaultProps } from './row';

function getLocaleBasedRule(): string {
  return dateLocalization.firstDayOfWeekIndex() === 1 ? 'firstFourDays' : 'firstDay';
}

function resolveWeekNumber(
  date: Date,
  firstDayOfWeek: number | undefined,
  rule: string | undefined,
): number {
  const effectiveRule = !rule || rule === 'auto' ? getLocaleBasedRule() : rule;
  return dateUtils.getWeekNumber(date, firstDayOfWeek ?? 0, effectiveRule);
}

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
      showWeekNumbers,
      weekNumberRule,
      firstDayOfWeek,
    } = this.props;
    const isMonthView = viewContext.view.type === 'month';
    const rowClasses = combineClasses({
      [DATE_TABLE_ROW_CLASS]: true,
      'dx-scheduler-cell-sizes-vertical': addVerticalSizesClassToRows,
    });

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
                  isGroupedAllDayPanel && <AllDayPanelTableBody
                    viewData={allDayPanel ?? AllDayPanelTableBodyDefaultProps.viewData}
                    viewContext={viewContext}
                    dataCellTemplate={dataCellTemplate}
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
                        <>
                          {showWeekNumbers && isMonthView && cells.length > 0 && (
                            <td
                              className="dx-scheduler-week-number-cell"
                              aria-label={`Week ${resolveWeekNumber(cells[0].startDate, firstDayOfWeek, weekNumberRule)}`}
                            >
      {resolveWeekNumber(cells[0].startDate, firstDayOfWeek, weekNumberRule)}
                            </td>
                          )}
                          {cells.map(({
                            key: cellKey,
                            endDate,
                            isFirstDayMonthHighlighting,
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
                          }) => <PublicTemplate
                              template={cellTemplate}
                              templateProps={{
                                key: cellKey,
                                viewContext,
                                isFirstGroupCell,
                                isLastGroupCell,
                                startDate,
                                endDate,
                                groups,
                                groupIndex: cellGroupIndex,
                                index: cellIndex,
                                dataCellTemplate,
                                text,
                                today,
                                otherMonth,
                                isFirstDayMonthHighlighting,
                                isSelected,
                                isFocused,
                              } as CellTemplateProps} />)
                          }
                        </>
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
