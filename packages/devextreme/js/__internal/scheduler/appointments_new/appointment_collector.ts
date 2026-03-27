import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { EmptyTemplate } from '@js/core/templates/empty_template';
import Button from '@js/ui/button';
import { FunctionTemplate } from '@ts/core/templates/m_function_template';
import type { TemplateBase } from '@ts/core/templates/m_template_base';
import type { DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';
import type { TargetedAppointment } from '@ts/scheduler/types';

import { APPOINTMENT_COLLECTOR_CLASSES } from './const';

export interface AppointmentCollectorProperties
  extends DOMComponentProperties<AppointmentCollector>
{
  appointmentsCount: number;
  isCompact: boolean;
  geometry: {
    height: number;
    width: number;
    top: number;
    left: number;
  },
  targetedAppointmentData: TargetedAppointment;
  appointmentCollectorTemplate: TemplateBase;
}

export class AppointmentCollector
  extends DOMComponent<AppointmentCollector, AppointmentCollectorProperties> {
  private defaultAppointmentCollectorTemplate!: FunctionTemplate;

  override _init(): void {
    super._init();

    this.defaultAppointmentCollectorTemplate = new FunctionTemplate((options) => {
      this.defaultAppointmentCollectorContent($(options.container));
    });
  }

  override _initMarkup(): void {
    super._initMarkup();

    this.applyElementClasses();
    this.applyElementAria();
    this.resize();
    this.renderContentTemplate();
  }

  public resize(): void {
    this.$element().css({
      top: this.option().geometry.top,
      left: this.option().geometry.left,
    });
  }

  private applyElementClasses(): void {
    this.$element()
      .addClass(APPOINTMENT_COLLECTOR_CLASSES.CONTAINER)
      .toggleClass(APPOINTMENT_COLLECTOR_CLASSES.COMPACT, this.option().isCompact);
  }

  private applyElementAria(): void {
    const localizeDate = (date: Date): string => (
      `${dateLocalization.format(date, 'monthAndDay')}, ${dateLocalization.format(date, 'year')}`
    );

    const { targetedAppointmentData } = this.option();

    const startDateText = localizeDate(targetedAppointmentData.displayStartDate);
    const endDateText = localizeDate(targetedAppointmentData.displayEndDate);

    const dateText = startDateText === endDateText
      ? startDateText
      : `${startDateText} - ${endDateText}`;

    this.$element()
      .attr('aria-roledescription', dateText);
  }

  private renderContentTemplate(): void {
    const template = this.option().appointmentCollectorTemplate instanceof EmptyTemplate
      ? this.defaultAppointmentCollectorTemplate
      : this.option().appointmentCollectorTemplate;

    this._createComponent(this.$element(), Button, {
      type: 'default',
      width: this.option().geometry.width,
      height: this.option().geometry.height,
      template,
    });
  }

  private defaultAppointmentCollectorContent(
    $container: dxElementWrapper,
  ): dxElementWrapper {
    const count = this.option().appointmentsCount;
    const text = this.option().isCompact
      ? count
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      : (messageLocalization.getFormatter('dxScheduler-moreAppointments') as any)(count);

    $('<span>')
      .text(text)
      .appendTo($container);

    $container.addClass(APPOINTMENT_COLLECTOR_CLASSES.CONTENT);

    return $container;
  }
}

// eslint-disable-next-line
registerComponent('dxSchedulerNewAppointmentCollector', AppointmentCollector as any);
