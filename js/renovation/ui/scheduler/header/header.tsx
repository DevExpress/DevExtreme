import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Event,
} from '@devextreme-generator/declarations';

import devices from '../../../../core/devices';

import { Toolbar } from '../../toolbar/toolbar';

import '../../../../ui/button_group';
import '../../../../ui/drop_down_button';

import dateUtils from '../../../../core/utils/date';
import {
  formatViews, getCaption,
  getStep, getViewName,
  getNextIntervalDate,
} from '../../../../ui/scheduler/header/utils';
import { showCalendar, formToolbarItem } from './utils';

import type { DateNavigatorTextInfo } from '../../../../ui/scheduler';
import {
  ItemOptions, Direction,
  ItemView, DefaultElement,
  SchedulerToolbarItem,
} from './types';
import { View } from '../types.d';

import { ViewProps } from '../props';
import { ToolbarItem, ToolbarLocationType } from '../../toolbar/toolbar_props';

const { trimTime } = dateUtils;

function viewFunction(viewModel: SchedulerToolbar): JSX.Element {
  return (
    <Toolbar items={viewModel.items} />
  );
}

@ComponentBindings()
export class SchedulerToolbarProps {
  @OneWay() items: SchedulerToolbarItem[] = [
    {
      defaultElement: 'dateNavigator' as DefaultElement,
      location: 'before' as ToolbarLocationType,
    },
    {
      defaultElement: 'viewSwitcher' as DefaultElement,
      location: 'after' as ToolbarLocationType,
    },
  ] as SchedulerToolbarItem[];

  @OneWay() views: (View | ViewProps)[] = ['day', 'week'];

  @OneWay() currentView: string | View = 'day';

  @Event() onCurrentViewUpdate?: (view: string | View) => void;

  @OneWay() currentDate: Date = new Date();

  @Event() onCurrentDateUpdate?: (date: Date) => void;

  @OneWay() min?: Date;

  @OneWay() max?: Date;

  @OneWay() intervalCount = 1;

  @OneWay() firstDayOfWeek = 0;

  @OneWay() agendaDuration = 1;

  @OneWay() useShortDateFormat = !devices.real().generic || devices.isSimulator();

  @OneWay() useDropDownViewSwitcher = false;

  @OneWay() customizationFunction?: (caption: DateNavigatorTextInfo) => string;
}

@Component({ view: viewFunction })
export default class SchedulerToolbar extends JSXComponent(SchedulerToolbarProps) {
  get step(): string {
    return getStep(this.props.currentView) as string;
  }

  get caption(): DateNavigatorTextInfo {
    const options = {
      step: this.step,
      intervalCount: this.props.intervalCount,
      firstDayOfWeek: this.props.firstDayOfWeek,
      agendaDuration: this.props.agendaDuration,
      date: this.props.currentDate,
    };

    return getCaption(
      options,
      this.props.useShortDateFormat,
      this.props.customizationFunction,
    ) as DateNavigatorTextInfo;
  }

  get captionText(): string {
    return this.caption.text;
  }

  get views(): ItemView[] {
    return formatViews(this.props.views) as ItemView[];
  }

  get selectedView(): string {
    return getViewName(this.props.currentView) as string;
  }

  setCurrentView(view: ItemView): void {
    this.props.onCurrentViewUpdate?.(view.name);
  }

  setCurrentDate(date: Date): void {
    this.props.onCurrentDateUpdate?.(new Date(date));
  }

  get intervalOptions(): {
    step: string;
    intervalCount: number;
    firstDayOfWeek: number;
    agendaDuration: number;
  } {
    return {
      step: this.step,
      intervalCount: this.props.intervalCount,
      firstDayOfWeek: this.props.firstDayOfWeek,
      agendaDuration: this.props.agendaDuration,
    };
  }

  getNextDate(direction: Direction, initialDate: Date | null = null): Date {
    const date = initialDate ?? this.props.currentDate;

    const options = { ...this.intervalOptions, date };

    return getNextIntervalDate(options, direction);
  }

  updateDateByDirection(direction: Direction): void {
    const date = this.getNextDate(direction);

    this.setCurrentDate(date);
  }

  isPreviousButtonDisabled(): boolean {
    if (this.props.min === undefined) {
      return false;
    }

    const min = trimTime(new Date(this.props.min));

    const { startDate } = this.caption;

    const previousDate = this.getNextDate(-1, startDate);
    return previousDate < min;
  }

  isNextButtonDisabled(): boolean {
    if (this.props.max === undefined) {
      return false;
    }

    const max = new Date(new Date(this.props.max).setHours(23, 59, 59));

    const { endDate } = this.caption;

    const nextDate = this.getNextDate(1, endDate);
    return nextDate > max;
  }

  get items(): ToolbarItem[] {
    const options: ItemOptions = {
      useDropDownViewSwitcher: this.props.useDropDownViewSwitcher,
      selectedView: this.selectedView,
      views: this.views,
      setCurrentView: this.setCurrentView,
      showCalendar,
      captionText: this.captionText,
      updateDateByDirection: this.updateDateByDirection,
      isPreviousButtonDisabled: this.isPreviousButtonDisabled(),
      isNextButtonDisabled: this.isNextButtonDisabled(),
    };

    return this.props.items
      .map((item) => formToolbarItem(item, options));
  }
}
