import { locate, move } from '@js/common/core/animation/translator';
import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import $, { type dxElementWrapper } from '@js/core/renderer';
import { FunctionTemplate } from '@js/core/templates/function_template';
import Button from '@js/ui/button';
import type { Appointment } from '@js/ui/scheduler';

import { APPOINTMENT_SETTINGS_KEY, LIST_ITEM_CLASS, LIST_ITEM_DATA_KEY } from './constants';
import type Scheduler from './m_scheduler';
import type { AppointmentTooltipItem, CompactAppointmentOptions, TargetedAppointment } from './types';

const APPOINTMENT_COLLECTOR_CLASS = 'dx-scheduler-appointment-collector';
const COMPACT_APPOINTMENT_COLLECTOR_CLASS = `${APPOINTMENT_COLLECTOR_CLASS}-compact`;
const APPOINTMENT_COLLECTOR_CONTENT_CLASS = `${APPOINTMENT_COLLECTOR_CLASS}-content`;

export class CompactAppointmentsHelper {
  elements: any[] = [];

  instance: Scheduler;

  constructor(instance: Scheduler) {
    this.instance = instance;
  }

  render(options: CompactAppointmentOptions): dxElementWrapper {
    const { isCompact, items } = options;

    const template = this._createTemplate(items.length, isCompact);
    const button = this._createCompactButton(template, options);
    const $button = button.$element();

    this.elements.push($button);
    $button.data('items', items);

    return $button;
  }

  clear() {
    this.elements.forEach((button) => {
      button.detach();
      button.remove();
    });
    this.elements = [];
  }

  _onButtonClick(e, options: CompactAppointmentOptions) {
    const $button = $(e.element);
    this.instance.showAppointmentTooltipCore(
      $button,
      // @ts-expect-error
      $button.data('items'),
      this._getExtraOptionsForTooltip(options, $button),
    );
  }

  _getExtraOptionsForTooltip(options: CompactAppointmentOptions, $appointmentCollector) {
    return {
      clickEvent: this._clickEvent(options.onAppointmentClick).bind(this),
      dragBehavior: options.allowDrag && this._createTooltipDragBehavior($appointmentCollector).bind(this),
      dropDownAppointmentTemplate: this.instance.option().dropDownAppointmentTemplate, // TODO deprecated option
      isButtonClick: true,
      _loopFocus: true,
    };
  }

  _clickEvent(onAppointmentClick) {
    return (e) => {
      const clickEventArgs = this.instance._createEventArgs(e);
      onAppointmentClick(clickEventArgs);
    };
  }

  _createTooltipDragBehavior($appointmentCollector) {
    return (e) => {
      const $element = $(e.element);
      const $schedulerElement = $(this.instance.element());
      const workSpace = this.instance.getWorkSpace();

      const getItemData = (itemElement) => ($(itemElement) as any).data(LIST_ITEM_DATA_KEY)?.appointment;
      const getItemSettings = (_, event) => event.itemSettings;
      const initialPosition = locate($appointmentCollector);

      const options = {
        filter: `.${LIST_ITEM_CLASS}`,
        isSetCursorOffset: true,
        initialPosition,
        getItemData,
        getItemSettings,
      };

      workSpace.createDragBehaviorBase($element, $schedulerElement, options);
    };
  }

  _setPosition(element, position) {
    move(element, {
      top: position.top,
      left: position.left,
    });
  }

  _createCompactButton(template, options: CompactAppointmentOptions) {
    const $button = this._createCompactButtonElement(options);

    // @ts-expect-error
    return this.instance._createComponent($button, Button, {
      type: 'default',
      width: options.width,
      height: options.height,
      onClick: (e) => this._onButtonClick(e, options),
      template: this._renderTemplate(template, options.items, options.isCompact),
    });
  }

  _createCompactButtonElement({
    isCompact, $container, coordinates, sortedIndex, items,
  }: CompactAppointmentOptions) {
    const appointmentDate = this._getDateText(
      items[0].appointment,
      items[0].targetedAppointment,
    );
    const result = $('<div>')
      .addClass(APPOINTMENT_COLLECTOR_CLASS)
      .attr('aria-roledescription', appointmentDate)
      .toggleClass(COMPACT_APPOINTMENT_COLLECTOR_CLASS, isCompact)
      .appendTo($container);

    result.data(APPOINTMENT_SETTINGS_KEY, { sortedIndex });

    this._setPosition(result, coordinates);

    return result;
  }

  _renderTemplate(template, items: AppointmentTooltipItem[], isCompact) {
    return new (FunctionTemplate as any)((options) => template.render({
      model: {
        appointmentCount: items.length,
        items: items.map((item) => item.appointment),
        isCompact,
      },
      container: options.container,
    }));
  }

  _createTemplate(count, isCompact) {
    this._initButtonTemplate(count, isCompact);
    return this.instance._getAppointmentTemplate('appointmentCollectorTemplate');
  }

  _initButtonTemplate(count, isCompact) {
    this.instance._templateManager.addDefaultTemplates({
      appointmentCollector: new (FunctionTemplate as any)((options) => this._createButtonTemplate(count, $(options.container), isCompact)),
    });
  }

  _createButtonTemplate(appointmentCount, element, isCompact) {
    const text = isCompact
      ? appointmentCount
      : (messageLocalization.getFormatter('dxScheduler-moreAppointments') as any)(appointmentCount);

    return element
      .append($('<span>').text(text))
      .addClass(APPOINTMENT_COLLECTOR_CONTENT_CLASS);
  }

  _localizeDate(date) {
    return `${dateLocalization.format(date, 'monthAndDay')}, ${dateLocalization.format(date, 'year')}`;
  }

  _getDateText(
    appointment: Appointment,
    targetedAppointment: Appointment | TargetedAppointment | undefined,
  ): string {
    const startDate = targetedAppointment?.displayStartDate ?? appointment.startDate;
    const endDate = targetedAppointment?.displayEndDate ?? appointment.endDate;

    const startDateText = this._localizeDate(startDate);
    const endDateText = this._localizeDate(endDate);

    return startDateText === endDateText
      ? startDateText
      : `${startDateText} - ${endDateText}`;
  }
}
