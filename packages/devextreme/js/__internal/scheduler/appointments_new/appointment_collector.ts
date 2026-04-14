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
import type { SafeAppointment, TargetedAppointment } from '@ts/scheduler/types';

import { APPOINTMENT_COLLECTOR_CLASSES } from './const';

export interface AppointmentCollectorProperties
  extends DOMComponentProperties<AppointmentCollector> {
  appointmentsData: SafeAppointment[];
  isCompact: boolean;
  geometry: {
    height: number;
    width: number;
    top: number;
    left: number;
  };
  targetedAppointmentData: TargetedAppointment;
  appointmentCollectorTemplate: TemplateBase;
}

export class AppointmentCollector
  extends DOMComponent<AppointmentCollector, AppointmentCollectorProperties> {
  private defaultAppointmentCollectorTemplate!: FunctionTemplate;

  private buttonInstance?: Button;

  private get appointmentsCount(): number {
    return this.option().appointmentsData.length;
  }

  override _init(): void {
    super._init();

    this.defaultAppointmentCollectorTemplate = new FunctionTemplate((options) => {
      this.defaultAppointmentCollectorContent($(options.container));
    });
  }

  override _initMarkup(): void {
    super._initMarkup();

    this.resize();
    this.applyElementClasses();
    this.applyElementAria();
    this.renderContentTemplate();
  }

  public resize(
    geometry?: { height: number, width: number, top: number, left: number },
  ): void {
    const newGeometry = geometry ?? this.option().geometry;
    const {
      top, left, width, height,
    } = newGeometry;

    this.$element().css({ top, left });

    this.buttonInstance?.option({ width, height });
  }

  private applyElementClasses(): void {
    this.$element()
      .addClass(APPOINTMENT_COLLECTOR_CLASSES.CONTAINER)
      .toggleClass(APPOINTMENT_COLLECTOR_CLASSES.COMPACT, this.option().isCompact);
  }

  private applyElementAria(): void {
    const localizeDate = (date: Date): string =>
      // eslint-disable-next-line @stylistic/implicit-arrow-linebreak
      `${dateLocalization.format(date, 'monthAndDay')}, ${dateLocalization.format(date, 'year')}`;

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

    this.buttonInstance = this._createComponent(this.$element(), Button, {
      type: 'default',
      width: this.option().geometry.width,
      height: this.option().geometry.height,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      template: new FunctionTemplate((e) => template.render({
        container: e.container,
        model: {
          appointmentCount: this.appointmentsCount,
          isCompact: this.option().isCompact,
          items: this.option().appointmentsData,
        },
      })),
    });
  }

  private defaultAppointmentCollectorContent(
    $container: dxElementWrapper,
  ): dxElementWrapper {
    const count = this.appointmentsCount;
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
