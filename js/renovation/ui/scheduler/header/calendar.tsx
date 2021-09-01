import {
  Component,
  ComponentBindings,
  JSXComponent,
  Event,
  OneWay,
  TwoWay,
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
  overlayProps,
  overlay: Overlay,
}: SchedulerCalendar): JSX.Element => (
  <Overlay
    target={`.${CAPTION_CLASS}`}
    className={CALENDAR_POPOVER_CLASS}
    showTitle={false}
    closeOnOutsideClick={true}
    visible={visible}
    {...overlayProps}
  >
    <div
      className={CALENDAR_CLASS}
    >
      <Calendar
        value={currentDate}
        min={min}
        max={max}
        firstDayOfWeek={firstDayOfWeek}
        valueChange={updateDate}
        width="100%"
      />
    </div>
  </Overlay>
);

@ComponentBindings()
export class SchedulerCalendarProps {
  @Event() onCurrentDateUpdate!: (date: Date) => void;

  @OneWay() currentDate!: Date;

  @OneWay() firstDayOfWeek!: number;

  @TwoWay() visible!: boolean;

  @OneWay() min?: string | number | Date;

  @OneWay() max?: string | number | Date;

  @OneWay() isMobileLayout = isMobileLayout();
}

@Component({ view: viewFunction })
export class SchedulerCalendar extends JSXComponent<SchedulerCalendarProps, 'currentDate' | 'firstDayOfWeek' | 'visible'>() {
  get overlay(): typeof Popup | typeof Popover {
    return this.props.isMobileLayout ? Popup : Popover;
  }

  get overlayProps(): {
    fullScreen?: boolean;
    showCloseButton?: boolean;
    toolbarItems?: any;
  } {
    return this.props.isMobileLayout
      ? {
        showCloseButton: true,
        fullScreen: true,
        toolbarItems: [{ shortcut: 'cancel' }],
      }
      : {};
  }

  updateDate(date: Date): void {
    this.props.onCurrentDateUpdate(date);
    this.props.visible = false;
  }
}
