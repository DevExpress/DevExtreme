import {
  Component,
  ComponentBindings,
  JSXComponent,
  Nested,
  OneWay,
  Event,
} from '@devextreme-generator/declarations';

import '../../../../ui/button_group';
import '../../../../ui/drop_down_button';

import dateUtils from '../../../../core/utils/date';

import { showCalendar, formToolbarItem } from './utils';
import {
  Toolbar,
} from '../../toolbar/toolbar';
import {
  ToolbarItem,
  ToolbarLocationType,
} from '../../toolbar/toolbar_props';
import {
  Direction,
  ItemView,
  ConfigOptionType,
  Caption,
  DefaultElement,
} from './types';
import {
  SchedulerToolbarItem,
} from './toolbar_props';
import {
  ViewType,
  ViewProps,
} from '../props';
import {
  formatViews, getCaption, getNextIntervalDate, getStep, getViewName,
} from '../../../../ui/scheduler/header/utils';

const { trimTime } = dateUtils;

function viewFunction(viewModel: SchedulerToolbar): JSX.Element {
  return (
    <Toolbar items={viewModel.items} /* {...restAttrbutes} */ />
  );
}

@ComponentBindings()
export class SchedulerToolbarProps {
  @Nested() items: SchedulerToolbarItem[] = [
    {
      defaultElement: 'dateNavigator' as DefaultElement,
      location: 'before' as ToolbarLocationType,
    },
    {
      defaultElement: 'viewSwitcher' as DefaultElement,
      location: 'after' as ToolbarLocationType,
    },
  ] as SchedulerToolbarItem[];

  @OneWay() views?: (ViewType | ViewProps)[] = ['day', 'week'];

  @OneWay() currentView: string | ViewType = 'day';

  @Event() onCurrentViewUpdate?: (view: string | ViewType) => void;

  @OneWay() currentDate: Date = new Date();

  @Event() onCurrentDateUpdate?: (date: Date) => void;

  @OneWay() min: Date = new Date(0);

  @OneWay() max: Date = new Date(2022, 0, 0);

  @OneWay() intervalCount = 1;

  @OneWay() firstDayOfWeek = 0;

  @OneWay() agendaDuration = 1;

  @OneWay() useShortDateFormat = false; // TODO devices.real().generic || devices.isSimulator()

  @OneWay() useDropDownViewSwitcher = false;

  @OneWay() customizationFunction?: (caption: Caption) => string;

  @OneWay() focusStateEnabled?: boolean;

  @OneWay() tabIndex?: number;

  // Не нужны, т.к. currentView и currentDate - TwoWay пропсы
  // @OneWay() setCurrentView?: (view: ItemView) => void;
  // @OneWay() setCurrentDate?: (date: Date) => void;
}

@Component({ view: viewFunction })
export default class SchedulerToolbar extends JSXComponent(SchedulerToolbarProps) {
  get step(): string {
    return getStep(this.props.currentView) as string;
  }

  // добавить эффект?
  get caption(): Caption {
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
    ) as Caption;
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

  // TODO check if view is copy or not
  setCurrentView(view: ItemView): void {
    // this.props.currentView = view.name;
    this.props.onCurrentViewUpdate?.(view.name);
  }

  // TODO check if it copy
  setCurrentDate(date: Date): void {
    // this.props.currentDate = date;
    this.props.onCurrentDateUpdate?.(date);
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
    const min = trimTime(new Date(this.props.min));

    const { startDate } = this.caption;

    const previousDate = this.getNextDate(-1, startDate);
    return previousDate < min;
  }

  isNextButtonDisabled(): boolean {
    const max = new Date(new Date(this.props.max).setHours(23, 59, 59));

    const { endDate } = this.caption;

    const nextDate = this.getNextDate(1, endDate);
    return nextDate > max;
  }

  get items(): ToolbarItem[] {
    const options: ConfigOptionType = {
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
