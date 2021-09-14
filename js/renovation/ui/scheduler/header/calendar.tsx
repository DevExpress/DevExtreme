import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  TwoWay,
  Fragment,
  RefObject,
  Ref,
} from '@devextreme-generator/declarations';
import { isMobileLayout } from './utils';
import { Popup } from '../../overlays/popup';
import { Popover } from '../../overlays/popover';
import { Calendar } from '../../editors/calendar';

export const viewFunction = ({
  props: {
    currentDate,
    min,
    max,
    firstDayOfWeek,
    visible,
  },
  updateDate,
  updateVisible,
  isMobile,
  calendarRef,
}: SchedulerCalendar): JSX.Element => {
  const calendar = (
    <div
      className="dx-scheduler-navigator-calendar"
    >
      <Calendar
        value={currentDate}
        valueChange={updateDate}
        min={min}
        max={max}
        firstDayOfWeek={firstDayOfWeek}
        width="100%"
        focusStateEnabled
        skipFocusCheck
        ref={calendarRef}
      />
    </div>
  );

  return (
    <Fragment>
      {isMobile
        ? (
          <Popup
            className="dx-scheduler-navigator-calendar-popup"
            showTitle={false}
            closeOnOutsideClick
            visible={visible}
            visibleChange={updateVisible}
            showCloseButton
            fullScreen
            toolbarItems={[{ shortcut: 'cancel' }]}
            onShown={(): void => calendarRef.current?.focus()}
          >
            {calendar}
          </Popup>
        )
        : (
          <Popover
            target=".dx-scheduler-navigator-caption"
            className="dx-scheduler-navigator-calendar-popover"
            showTitle={false}
            closeOnOutsideClick
            visible={visible}
            visibleChange={updateVisible}
            onShown={(): void => calendarRef.current?.focus()}
          >
            {calendar}
          </Popover>
        )}
    </Fragment>
  );
};

@ComponentBindings()
export class SchedulerCalendarProps {
  @TwoWay() currentDate!: Date;

  @OneWay() firstDayOfWeek!: number;

  @TwoWay() visible!: boolean;

  @OneWay() min?: string | number | Date;

  @OneWay() max?: string | number | Date;

  @OneWay() isMobileLayout = isMobileLayout();
}

@Component({ view: viewFunction })
export class SchedulerCalendar extends JSXComponent<SchedulerCalendarProps, 'currentDate' | 'firstDayOfWeek' | 'visible'>() {
  @Ref() calendarRef!: RefObject<Calendar>;

  get isMobile(): boolean {
    return this.props.isMobileLayout;
  }

  updateVisible(visible: boolean): void {
    this.props.visible = visible;
  }

  updateDate(date: Date): void {
    this.props.currentDate = date;
  }
}
