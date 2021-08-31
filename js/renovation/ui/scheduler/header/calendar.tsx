import {
  Component,
  ComponentBindings,
  JSXComponent,
  Ref,
  RefObject,
  Effect,
  Mutable,
  Event,
  Method,
  OneWay,
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
    onCurrentDateUpdate,
  },
  overlayRef,
  hideOverlay,
}: SchedulerCalendar): JSX.Element => {
  const OverlayType = isMobileLayout() ? Popup : Popover;

  const restAttributes: {
    fullScreen?: boolean;
    showCloseButton?: boolean;
    toolbarItems?: any; // TODO
  } = {};
  if (isMobileLayout()) {
    restAttributes.fullScreen = true;
    restAttributes.showCloseButton = true;
    restAttributes.toolbarItems = [{ shortcut: 'cancel' }];
  }

  return (
    <OverlayType
      className={CALENDAR_POPOVER_CLASS}
      ref={overlayRef}
      showTitle={false}
      closeOnOutsideClick={true}
      {...restAttributes}
    >
      <div
        className={CALENDAR_CLASS}
      >
        <Calendar
          value={currentDate}
          min={min}
          max={max}
          firstDayOfWeek={firstDayOfWeek}
          valueChange={(date: Date) => {
            onCurrentDateUpdate(date);
            hideOverlay();
          }}
          tabIndex={0}
          width="100%"
        />
      </div>
    </OverlayType>
  );
};

@ComponentBindings()
export class SchedulerCalendarProps {
  @Event() onCurrentDateUpdate!: (date: Date) => void;

  @OneWay() firstDayOfWeek!: number;

  @OneWay() currentDate!: Date;

  @OneWay() min?: string | number | Date;

  @OneWay() max?: string | number | Date;
}

@Component({ view: viewFunction })
export class SchedulerCalendar extends JSXComponent<SchedulerCalendarProps, 'currentDate' | 'min' | 'max' | 'firstDayOfWeek'>() {
  @Ref() overlayRef!: RefObject<Popup & Popover>;

  @Mutable()
  overlayInstance: any;

  @Effect()
  saveInstance(): void {
    this.overlayInstance = this.overlayRef.current;
  }

  @Method()
  show(): void {
    // TODO:
    const target = document.getElementsByClassName(CAPTION_CLASS).item(0);

    if (!isMobileLayout()) {
      this.overlayInstance.setTarget(target);
    }
    this.overlayInstance.show();
    this.overlayInstance.focus();
  }

  hideOverlay(): void {
    this.overlayInstance.hide();
  }

  @Method()
  hide(): void {
    this.overlayInstance.hide();
  }
}
