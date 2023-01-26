import {
  Component, ComponentBindings, ForwardRef, JSXComponent, RefObject, Slot,
} from '@devextreme-generator/declarations';
import { AppointmentLayout } from '../../../../appointment/layout';
import { LayoutProps } from '../../layout_props';
import { AllDayTable } from './table';

export const viewFunction = ({
  props: {
    tableRef,
    viewData,
    dataCellTemplate,
    width,
  },
}: AllDayPanelLayout): JSX.Element => (
  <div
    className="dx-scheduler-all-day-panel"
  >
    <AppointmentLayout isAllDay />
    <AllDayTable
      tableRef={tableRef}
      viewData={viewData}
      dataCellTemplate={dataCellTemplate}
      width={width}
    />
  </div>
);

@ComponentBindings()
export class AllDayPanelLayoutProps extends LayoutProps {
  @ForwardRef() tableRef?: RefObject<HTMLTableElement>;

  @Slot() allDayAppointments?: JSX.Element;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AllDayPanelLayout extends JSXComponent(AllDayPanelLayoutProps) {}
