/* eslint-disable react/prop-types */
import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  RefObject,
  Ref,
} from '@devextreme-generator/declarations';
import { isMobileLayout } from './utils';
import { Popup } from '../../overlays/popup';
import { Popover } from '../../overlays/popover';
import { Calendar } from '../../editors/calendar';

export const viewFunction = (viewModel: SchedulerCalendar): JSX.Element => {
  const {
    props,
    updateDate,
    updateVisible,
    isMobile,
    calendarRef,
    focusCalendar,
  } = viewModel;
  const {
    currentDate,
    min,
    max,
    firstDayOfWeek,
    visible,
  } = props;

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

  return isMobile
    ? (
      <Popup
        className="dx-scheduler-navigator-calendar-popup"
        showTitle={false}
        hideOnOutsideClick
        visible={visible}
        visibleChange={updateVisible}
        showCloseButton
        fullScreen
        toolbarItems={[{ shortcut: 'cancel' }]}
        onShown={focusCalendar}
      >
        {calendar}
      </Popup>
    )
    : (
      <Popover
        target=".dx-scheduler-navigator-caption"
        className="dx-scheduler-navigator-calendar-popover"
        showTitle={false}
        hideOnOutsideClick
        visible={visible}
        visibleChange={updateVisible}
        onShown={focusCalendar}
      >
        {calendar}
      </Popover>
    );
};

@ComponentBindings()
export class SchedulerCalendarProps {
  @OneWay() currentDate!: Date;

  @OneWay() onCurrentDateUpdate!: (date: Date) => void;

  @OneWay() firstDayOfWeek!: number;

  @OneWay() visible!: boolean;

  @OneWay() onVisibleUpdate!: (visible: boolean) => void;

  @OneWay() min?: string | number | Date;

  @OneWay() max?: string | number | Date;

  @OneWay() isMobileLayout = isMobileLayout();
}

@Component({ view: viewFunction })
export class SchedulerCalendar extends JSXComponent<
SchedulerCalendarProps,
'currentDate' | 'onCurrentDateUpdate' | 'firstDayOfWeek' | 'visible' | 'onVisibleUpdate'
>() {
  @Ref() calendarRef!: RefObject<Calendar>;

  get isMobile(): boolean {
    return this.props.isMobileLayout;
  }

  focusCalendar(): void {
    this.calendarRef.current?.focus();
  }

  updateVisible(visible: boolean): void {
    this.props.onVisibleUpdate(visible);
  }

  updateDate(date: Date): void {
    this.props.onCurrentDateUpdate(date);
  }
}
