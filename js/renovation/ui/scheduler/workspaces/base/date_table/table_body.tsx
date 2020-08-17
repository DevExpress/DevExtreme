import {
  Component, ComponentBindings, JSXComponent, Fragment, Template,
} from 'devextreme-generator/component_declaration/common';
import { DateTableRow } from './row';
import { ViewCellData } from '../../types.d';
import {
  getKeyByGroup,
  getKeyByDateAndGroup,
  getIsGroupedAllDayPanel,
} from '../../utils';
import { LayoutProps } from '../layout_props';
import { AllDayPanelTableBody } from './all_day_panel/table_body';

// interface CellTemplateProps extends ViewCellData {
//   key: string;
// }

export const viewFunction = (viewModel: DateTableBody): JSX.Element => (
  <Fragment>
    {
    viewModel.props.viewData
      .groupedData.map(({ dateTable, allDayPanel }, groupIndex) => (
        <Fragment key={getKeyByGroup(groupIndex)}>
          {
            getIsGroupedAllDayPanel(viewModel.props.viewData, groupIndex)
              && <AllDayPanelTableBody viewData={allDayPanel} />
          }
          { dateTable.map((cellsRow, index) => (
            <DateTableRow
              key={getKeyByDateAndGroup(cellsRow[0].startDate, cellsRow[0].groups)}
            >
              {cellsRow.map(({
                startDate,
                endDate,
                groups,
              }: ViewCellData) => (
                <viewModel.props.cellTemplate
                  isFirstCell={index === 0}
                  isLastCell={index === dateTable.length - 1}
                  startDate={startDate}
                  endDate={endDate}
                  groups={groups}
                  key={getKeyByDateAndGroup(startDate, groups)}
                />
              ))}
            </DateTableRow>
          ))}
        </Fragment>
      ))
    }
  </Fragment>
);

@ComponentBindings()
export class DateTableBodyProps extends LayoutProps {
  @Template() cellTemplate!: (props: any) => JSX.Element;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateTableBody extends JSXComponent(DateTableBodyProps) {
}
