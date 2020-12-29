import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Fragment,
  Template,
  JSXTemplate,
} from 'devextreme-generator/component_declaration/common';
import { Row } from '../row';
import { TimePanelCell as Cell } from './cell';
import { CellBase } from '../cell';
import {
  getKeyByGroup,
  getIsGroupedAllDayPanel,
  isVerticalGroupOrientation,
} from '../../utils';
import { Table } from '../table';
import { LayoutProps } from '../layout_props';
import { AllDayPanelTitle } from '../date_table/all_day_panel/title';
import { DateTimeCellTemplateProps } from '../../types.d';

export const viewFunction = ({
  props,
  topVirtualRowHeight,
  bottomVirtualRowHeight,
  isVerticalGroupOrientation: isVerticalGrouping,
  restAttributes,
}: TimePanelTableLayout): JSX.Element => {
  const { viewData, timeCellTemplate } = props;

  return (
    <Table
    // eslint-disable-next-line react/jsx-props-no-spreading
      {...restAttributes}
      topVirtualRowHeight={topVirtualRowHeight}
      bottomVirtualRowHeight={bottomVirtualRowHeight}
      virtualCellsCount={1}
      className="dx-scheduler-time-panel"
    >
      {viewData
        .groupedData.map(({ dateTable, groupIndex }, index) => (
          <Fragment key={getKeyByGroup(groupIndex)}>
            {getIsGroupedAllDayPanel(viewData, index) && (
              <Row>
                <CellBase className="dx-scheduler-time-panel-title-cell">
                  <AllDayPanelTitle />
                </CellBase>
              </Row>
            )}
            {dateTable.map((cellsRow) => {
              const { cellCountInGroupRow } = viewData;
              const {
                groups,
                startDate,
                text,
                index: cellIndex,
                isFirstGroupCell,
                isLastGroupCell,
                key,
              } = cellsRow[0];

              return (
                <Row
                  className="dx-scheduler-time-panel-row"
                  key={key}
                >
                  <Cell
                    startDate={startDate}
                    text={text}
                    groups={isVerticalGrouping ? groups : undefined}
                    groupIndex={isVerticalGrouping ? groupIndex : undefined}
                    isFirstGroupCell={isVerticalGrouping && isFirstGroupCell}
                    isLastGroupCell={isVerticalGrouping && isLastGroupCell}
                    index={Math.floor(cellIndex / cellCountInGroupRow)}
                    timeCellTemplate={timeCellTemplate}
                  />
                </Row>
              );
            })}
          </Fragment>
        ))}
    </Table>
  );
};

@ComponentBindings()
export class TimePanelTableLayoutProps extends LayoutProps {
  @OneWay() className? = '';

  @OneWay() allDayPanelVisible? = false;

  @Template() timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: {
    register: true,
  },
})
export class TimePanelTableLayout extends JSXComponent(TimePanelTableLayoutProps) {
  get topVirtualRowHeight(): number {
    return this.props.viewData.topVirtualRowHeight || 0;
  }

  get bottomVirtualRowHeight(): number {
    return this.props.viewData.bottomVirtualRowHeight || 0;
  }

  get isVerticalGroupOrientation(): boolean {
    const { groupOrientation } = this.props;

    return isVerticalGroupOrientation(groupOrientation);
  }
}
