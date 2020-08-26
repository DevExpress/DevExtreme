import {
  Component, ComponentBindings, JSXComponent, Fragment, Template,
} from 'devextreme-generator/component_declaration/common';
import { DateTableRow } from './row';
import { ViewCellData } from '../../types.d';
import {
  getKeyByGroup,
  getKeyByDateAndGroup,
  getIsAllDayPanelInsideDateTable,
} from '../../utils';
import { LayoutProps } from '../layout_props';
import { AllDayPanelTableBody } from './all_day_panel/table_body';

export const viewFunction = (viewModel: DateTableBody): JSX.Element => (
  <Fragment>
    {viewModel.props.viewData!
      .groupedData.map(({ dateTable, allDayPanel }, groupIndex) => (
        <Fragment key={getKeyByGroup(groupIndex)}>
          {getIsAllDayPanelInsideDateTable(viewModel.props.viewData!, groupIndex) && (
            <AllDayPanelTableBody
              viewData={allDayPanel}
              dataCellTemplate={viewModel.props.dataCellTemplate}
            />
          )}
          {dateTable.map((cellsRow, rowIndex) => (
            <DateTableRow
              key={getKeyByDateAndGroup(cellsRow[0].startDate, cellsRow[0].groups)}
            >
              {cellsRow.map(({
                startDate,
                endDate,
                groups,
                groupIndex: cellGroupIndex,
                index,
              }: ViewCellData) => (
                <viewModel.props.cellTemplate
                  isFirstCell={rowIndex === 0}
                  isLastCell={rowIndex === dateTable.length - 1}
                  startDate={startDate}
                  endDate={endDate}
                  groups={groups}
                  groupIndex={cellGroupIndex}
                  index={index}
                  dataCellTemplate={viewModel.props.dataCellTemplate}
                  key={getKeyByDateAndGroup(startDate, groups)}
                />
              ))}
            </DateTableRow>
          ))}
        </Fragment>
      ))}
  </Fragment>
);

@ComponentBindings()
export class DateTableBodyProps extends LayoutProps {
  @Template() cellTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateTableBody extends JSXComponent(DateTableBodyProps) {
}
