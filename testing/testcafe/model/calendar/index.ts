import { ClientFunction } from 'testcafe';
import { WidgetName } from '../../helpers/createWidget';
import Button from '../button';
import Widget from '../internal/widget';
import CalendarView from './view';

const CLASS = {
  widget: 'dx-widget',
  calendarViewsWrapper: 'dx-calendar-views-wrapper',
  footer: 'dx-calendar-footer',
  button: 'dx-button',
  todayButton: 'dx-calendar-today-button',
};

const showGestureCover = ($element: JQuery): void => {
  const offset = $element.offset();
  $element.trigger($.Event('dxpointerdown', {
    pageX: offset.left,
    pointers: [{ pointerId: 1 }],
  }));

  $element.trigger($.Event('dxpointermove', {
    pageX: offset.left + 20,
    pointers: [{ pointerId: 1 }],
  }));

  $element.trigger($.Event('mouseup', {
    pointers: [{ pointerId: 1 }],
  }));
};

const swipeStart = ($element: JQuery): void => {
  $element
    .trigger($.Event('dxswipestart', {
      pointers: [{ pointerId: 1 }],
    }));
};

const swipe = ($element: JQuery, offset: number): void => {
  $element.trigger($.Event('dxswipe', {
    offset,
    pointers: [{ pointerId: 1 }],
  }));
};

const swipeEnd = ($element: JQuery): void => {
  if ($element?.length) {
    $element.trigger($.Event('dxswipeend', {
      pointers: [{ pointerId: 1 }],
    }));
  }
};

export default class Calendar extends Widget {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxCalendar'; }

  getViewsWrapper(): Selector {
    return this.element.find(`.${CLASS.calendarViewsWrapper}`);
  }

  getView(): CalendarView {
    return new CalendarView(this.element.find(`.${CLASS.calendarViewsWrapper}`).find(`.${CLASS.widget}`).nth(0));
  }

  getTodayButton(): Button {
    return new Button(this.element.find(`.${CLASS.todayButton}`));
  }

  showGestureCover(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => {
        const instance = getInstance() as any;

        showGestureCover(instance.$element());
      },
      {
        dependencies: {
          getInstance, showGestureCover,
        },
      },
    )();
  }

  swipeStart(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => {
        const instance = getInstance() as any;

        swipeStart(instance.$element());
      },
      {
        dependencies: {
          getInstance, swipeStart,
        },
      },
    )();
  }

  swipe(offset: number): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => {
        const instance = getInstance() as any;

        swipe(instance.$element(), offset);
      },
      {
        dependencies: {
          getInstance, offset, swipe,
        },
      },
    )();
  }

  swipeEnd(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => {
        const instance = getInstance() as any;

        swipeEnd(instance.$element());
      },
      {
        dependencies: {
          getInstance, swipeEnd,
        },
      },
    )();
  }
}
