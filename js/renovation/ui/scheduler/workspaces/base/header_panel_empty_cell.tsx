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
    isSetAllDayTitleClass,
    width,
  },
}: HeaderPanelEmptyCell): JSX.Element => (
  <div
    className="dx-scheduler-header-panel-empty-cell"
    style={{ width }}
  >
    {isRenderAllDayTitle && (
      <AllDayPanelTitle
        isSetTitleClass={isSetAllDayTitleClass}
      />
    )}
  </div>
);

@ComponentBindings()
export class HeaderPanelEmptyCellProps {
  @OneWay() width?: number;

  @OneWay() isRenderAllDayTitle = false;

  @OneWay() isSetAllDayTitleClass = true;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class HeaderPanelEmptyCell extends JSXComponent(HeaderPanelEmptyCellProps) {}
