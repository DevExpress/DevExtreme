import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  TwoWay,
  Fragment,
} from '@devextreme-generator/declarations';
import { isMobileLayout } from './utils';
import { Popup } from '../../overlays/popup';
import { Popover } from '../../overlays/popover';
import { Calendar } from '../../editors/calendar';

const CAPTION_CLASS = 'dx-scheduler-navigator-caption';
const CALENDAR_CLASS = 'dx-scheduler-navigator-calendar';
const CALENDAR_POPOVER_CLASS = 'dx-scheduler-navigator-calendar-popover';

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
}: SchedulerCalendar): JSX.Element => {
  const children = (
    <div
      className={CALENDAR_CLASS}
    >
      <Calendar
        value={currentDate}
        valueChange={updateDate}
        min={min}
        max={max}
        firstDayOfWeek={firstDayOfWeek}
        width="100%"
      />
    </div>
  );

  return (
    <Fragment>
      {isMobile
        && (
          <Popup
            className={CALENDAR_POPOVER_CLASS}
            showTitle={false}
            closeOnOutsideClick
            visible={visible}
            visibleChange={updateVisible}
            showCloseButton
            fullScreen
            toolbarItems={[{ shortcut: 'cancel' }]}
          >
            {children}
          </Popup>
        )}
      {!isMobile
        && (
          <Popover
            target={`.${CAPTION_CLASS}`}
            className={CALENDAR_POPOVER_CLASS}
            showTitle={false}
            closeOnOutsideClick
            visible={visible}
            visibleChange={updateVisible}
          >
            {children}
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
