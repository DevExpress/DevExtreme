import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import LayoutBase from '../base/layout';
import HeaderPanelLayout, { HeaderPanelLayoutProps } from '../base/header-panel/layout';
import HeaderPanelCell from './header-panel/cell';
import DateTable from './date-table/layout';
import { ViewCellData } from '../types';

export const viewFunction = (viewModel: MonthLayout) => (
  <LayoutBase
    viewCellsData={viewModel.props.viewCellsData}
    headerPanelTemplate={({ viewCellsData }: HeaderPanelLayoutProps) => (
      <HeaderPanelLayout
        cellTemplate={HeaderPanelCell}
        viewCellsData={viewCellsData}
      />
    )}
    dateTableTemplate={DateTable}
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  />
);

@ComponentBindings()
export class MonthLayoutProps {
  @OneWay() viewCellsData?: ViewCellData[][];
}

@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})
export default class MonthLayout extends JSXComponent(MonthLayoutProps) {}
