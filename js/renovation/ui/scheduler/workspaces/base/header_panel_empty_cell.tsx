import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from '@devextreme-generator/declarations';
import { AllDayPanelTitle } from './date_table/all_day_panel/title';

export const viewFunction = ({
  props: {
    isRenderAllDayTitle,
    width,
  },
}: HeaderPanelEmptyCell): JSX.Element => (
  <div
    className="dx-scheduler-header-panel-empty-cell"
    style={{ width }}
  >
    {isRenderAllDayTitle && (
      <AllDayPanelTitle />
    )}
  </div>
);

@ComponentBindings()
export class HeaderPanelEmptyCellProps {
  @OneWay() width?: number;

  @OneWay() isRenderAllDayTitle = false;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class HeaderPanelEmptyCell extends JSXComponent(HeaderPanelEmptyCellProps) {}
