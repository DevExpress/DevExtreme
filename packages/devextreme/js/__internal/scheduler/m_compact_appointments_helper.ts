import { locate, move } from '@js/common/core/animation/translator';
import messageLocalization from '@js/common/core/localization/message';
import $, { type dxElementWrapper } from '@js/core/renderer';
import type { FunctionTemplate as PublicFunctionTemplate } from '@js/core/templates/function_template';
import type { ClickEvent as ButtonClickEvent } from '@js/ui/button';
import Button from '@js/ui/button';
import type { ContentReadyEvent, ItemClickEvent } from '@js/ui/list';
import type { Appointment } from '@js/ui/scheduler';
import { FunctionTemplate } from '@ts/core/templates/function_template';

import { APPOINTMENT_SETTINGS_KEY, LIST_ITEM_CLASS, LIST_ITEM_DATA_KEY } from './constants';
import type Scheduler from './scheduler';
import type { AppointmentTooltipExtraOptions } from './tooltip_strategies/tooltip_strategy_base';
import type {
  AppointmentTooltipItem, CompactAppointmentOptions, SafeAppointment, TargetedAppointment,
} from './types';
import { formatImplicitSchedulerDate } from './utils/global_formats';
import type { AppointmentViewModelPlain } from './view_model/types';

const APPOINTMENT_COLLECTOR_CLASS = 'dx-scheduler-appointment-collector';
const COMPACT_APPOINTMENT_COLLECTOR_CLASS = `${APPOINTMENT_COLLECTOR_CLASS}-compact`;
const APPOINTMENT_COLLECTOR_CONTENT_CLASS = `${APPOINTMENT_COLLECTOR_CLASS}-content`;

export class CompactAppointmentsHelper {
  elements: dxElementWrapper[] = [];

  instance: Scheduler;

  constructor(instance: Scheduler) {
    this.instance = instance;
  }

  render(options: CompactAppointmentOptions): dxElementWrapper {
    const { isCompact, items } = options;

    const template = this.createTemplate(items.length, isCompact);
    const button = this.createCompactButton(template, options);
    const $button = button.$element();

    this.elements.push($button);
    $button.data('items', items);

    return $button;
  }

  clear(): void {
    this.elements.forEach((button) => {
      button.detach();
      button.remove();
    });
    this.elements = [];
  }

  private onButtonClick(e: ButtonClickEvent, options: CompactAppointmentOptions): void {
    const $button = $(e.element);
    this.instance.showAppointmentTooltipCore(
      $button,
      // @ts-expect-error
      $button.data('items'),
      this.getExtraOptionsForTooltip(options, $button),
    );
  }

  private getExtraOptionsForTooltip(
    options: CompactAppointmentOptions,
    $appointmentCollector: dxElementWrapper,
  ): AppointmentTooltipExtraOptions {
    return {
      clickEvent: this.clickEvent(options.onAppointmentClick).bind(this),
      dragBehavior: options.allowDrag
        ? this.createTooltipDragBehavior($appointmentCollector).bind(this)
        : undefined,
      isButtonClick: true,
      tabFocusLoopEnabled: true,
    };
  }

  private clickEvent(
    onAppointmentClick: CompactAppointmentOptions['onAppointmentClick'],
  ): (e: ItemClickEvent<AppointmentTooltipItem>) => void {
    return (e) => {
      const clickEventArgs = this.instance._createEventArgs(e);
      onAppointmentClick(clickEventArgs);
    };
  }

  private createTooltipDragBehavior(
    $appointmentCollector: dxElementWrapper,
  ): (e: ContentReadyEvent<AppointmentTooltipItem>) => void {
    return (e) => {
      const $element = $(e.element);
      const $schedulerElement = $(this.instance.element());
      const workSpace = this.instance.getWorkSpace();

      const getItemData = (
        itemElement: Element | dxElementWrapper,
      ): SafeAppointment | undefined => ($(itemElement)
        .data(LIST_ITEM_DATA_KEY) as unknown as { appointment?: SafeAppointment } | undefined)
        ?.appointment;
      const getItemSettings = (
        _: dxElementWrapper,
        event: Record<string, unknown>,
      ): AppointmentViewModelPlain => event.itemSettings as AppointmentViewModelPlain;
      const initialPosition = locate($appointmentCollector);

      const options = {
        filter: `.${LIST_ITEM_CLASS}`,
        isSetCursorOffset: true,
        initialPosition,
        getItemData,
        getItemSettings,
      };

      workSpace?.createDragBehaviorBase($element, $schedulerElement, options);
    };
  }

  private setPosition(element: dxElementWrapper, position: { top: number; left: number }): void {
    move(element, {
      top: position.top,
      left: position.left,
    });
  }

  private createCompactButton(
    template: PublicFunctionTemplate,
    options: CompactAppointmentOptions,
  ): Button {
    const $button = this.createCompactButtonElement(options);

    return this.instance._createComponent($button, Button, {
      type: 'default',
      width: options.width,
      height: options.height,
      onClick: (e) => this.onButtonClick(e, options),
      template: this.renderTemplate(template, options.items, options.isCompact),
    });
  }

  static measureCollectorDimensions(
    $container: dxElementWrapper | null,
    isCompact: boolean,
  ): Record<'width' | 'height' | 'marginLeft' | 'marginRight' | 'marginTop' | 'marginBottom', string> {
    const $collector = $('<div>')
      .addClass(APPOINTMENT_COLLECTOR_CLASS)
      .toggleClass(COMPACT_APPOINTMENT_COLLECTOR_CLASS, isCompact)
      // @ts-expect-error the all-day container is null only when the all-day panel is not rendered
      .appendTo($container);
    const styles = getComputedStyle($collector.get(0));
    const geometry = {
      width: styles.width,
      height: styles.height,
      marginLeft: styles.marginLeft,
      marginRight: styles.marginRight,
      marginTop: styles.marginTop,
      marginBottom: styles.marginBottom,
    };
    $collector.detach();
    $collector.remove();
    return geometry;
  }

  private createCompactButtonElement({
    isCompact, $container, coordinates, sortedIndex, items,
  }: CompactAppointmentOptions): dxElementWrapper {
    const appointmentDate = this.getDateText(
      items[0].appointment,
      items[0].targetedAppointment,
    );
    const result = $('<div>')
      .addClass(APPOINTMENT_COLLECTOR_CLASS)
      .attr('aria-roledescription', appointmentDate)
      .toggleClass(COMPACT_APPOINTMENT_COLLECTOR_CLASS, isCompact)
      .appendTo($container);

    result.data(APPOINTMENT_SETTINGS_KEY, { sortedIndex });

    this.setPosition(result, coordinates);

    return result;
  }

  private renderTemplate(
    template: PublicFunctionTemplate,
    items: AppointmentTooltipItem[],
    isCompact: boolean,
  ): FunctionTemplate {
    return new FunctionTemplate((options) => template.render({
      model: {
        appointmentCount: items.length,
        items: items.map((item) => item.appointment),
        isCompact,
      },
      container: options.container,
    }));
  }

  private createTemplate(count: number, isCompact: boolean): PublicFunctionTemplate {
    this.initButtonTemplate(count, isCompact);
    return this.instance.getAppointmentTemplate('appointmentCollectorTemplate');
  }

  private initButtonTemplate(count: number, isCompact: boolean): void {
    this.instance._templateManager.addDefaultTemplates({
      appointmentCollector: new FunctionTemplate(
        (options) => this.createButtonTemplate(count, $(options.container), isCompact),
      ),
    });
  }

  private createButtonTemplate(
    appointmentCount: number,
    element: dxElementWrapper,
    isCompact: boolean,
  ): dxElementWrapper {
    const text = isCompact
      ? appointmentCount
      // @ts-expect-error the formatter takes the count, the d.ts declares no arguments
      : messageLocalization.getFormatter('dxScheduler-moreAppointments')(appointmentCount);

    return element
      .append($('<span>').text(text))
      .addClass(APPOINTMENT_COLLECTOR_CONTENT_CLASS);
  }

  private localizeDate(date: Date): string {
    return formatImplicitSchedulerDate(date);
  }

  private getDateText(
    appointment: Appointment,
    targetedAppointment: Appointment | TargetedAppointment | undefined,
  ): string {
    const startDate = targetedAppointment?.displayStartDate ?? appointment.startDate;
    const endDate = targetedAppointment?.displayEndDate ?? appointment.endDate;

    const startDateText = this.localizeDate(startDate);
    const endDateText = this.localizeDate(endDate);

    return startDateText === endDateText
      ? startDateText
      : `${startDateText} - ${endDateText}`;
  }
}
