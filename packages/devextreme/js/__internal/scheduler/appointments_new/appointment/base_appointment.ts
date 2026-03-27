import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import type { DxElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { when } from '@js/core/utils/deferred';
import { getPublicElement } from '@ts/core/m_element';
import { EmptyTemplate } from '@ts/core/templates/m_empty_template';
import { FunctionTemplate } from '@ts/core/templates/m_function_template';
import type { TemplateBase } from '@ts/core/templates/m_template_base';
import type { DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';
import type { SafeAppointment, TargetedAppointment } from '@ts/scheduler/types';
import type { AppointmentDataAccessor } from '@ts/scheduler/utils/data_accessor/appointment_data_accessor';

import { APPOINTMENT_CLASSES, APPOINTMENT_TYPE_CLASSES } from '../const';
import { DateFormatType, getDateTextFromTargetAppointment } from '../utils/get_date_text';

export interface BaseAppointmentProperties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extends DOMComponentProperties<BaseAppointment<any>>
{
  appointmentData: SafeAppointment;
  targetedAppointmentData: TargetedAppointment;
  appointmentTemplate: TemplateBase;

  onAppointmentRendered: (e: {
    element: DxElement,
    appointmentData: SafeAppointment;
    targetedAppointmentData: TargetedAppointment;
  }) => void;

  getDataAccessor: () => AppointmentDataAccessor;
  getResourceColor: () => Promise<string | undefined>;
}

export class BaseAppointment<
  TProperties extends BaseAppointmentProperties = BaseAppointmentProperties,
> extends DOMComponent<BaseAppointment<TProperties>, TProperties> {
  protected get targetedAppointmentData(): TargetedAppointment {
    return this.option().targetedAppointmentData;
  }

  protected get appointmentData(): SafeAppointment {
    return this.option().appointmentData;
  }

  private defaultAppointmentTemplate!: FunctionTemplate;

  override _init(): void {
    super._init();

    this.defaultAppointmentTemplate = new FunctionTemplate((options) => {
      this.defaultAppointmentContent($(options.container));
    });
  }

  override _initMarkup(): void {
    super._initMarkup();

    this.resize();
    this.applyElementClasses();
    this.applyAria();
    this.renderContentTemplate();
  }

  public resize(): void { }

  protected applyElementClasses(): void {
    this.$element()
      .addClass(APPOINTMENT_CLASSES.CONTAINER)
      .toggleClass(APPOINTMENT_TYPE_CLASSES.RECURRING, this.isRecurring())
      .toggleClass(APPOINTMENT_TYPE_CLASSES.ALL_DAY, this.isAllDay());
  }

  protected applyAria(): void {
    this.$element()
      .attr('role', 'button');
  }

  protected getTitleText(): string {
    const dataAccessor = this.option().getDataAccessor();
    const titleText = dataAccessor.get('text', this.targetedAppointmentData);

    if (!titleText) {
      return messageLocalization.format('dxScheduler-noSubject');
    }

    return titleText;
  }

  protected getDateText(): string {
    const dateText = getDateTextFromTargetAppointment(
      this.targetedAppointmentData,
      this.isAllDay() ? DateFormatType.DATE : DateFormatType.TIME,
    );

    return dateText;
  }

  protected isRecurring(): boolean {
    const dataAccessor = this.option().getDataAccessor();
    const recurrenceRule = dataAccessor.get('recurrenceRule', this.targetedAppointmentData);

    return Boolean(recurrenceRule);
  }

  protected isAllDay(): boolean {
    const dataAccessor = this.option().getDataAccessor();
    const allDay = dataAccessor.get('allDay', this.targetedAppointmentData);

    return Boolean(allDay);
  }

  private renderContentTemplate(): void {
    const $content = $('<div>')
      .addClass(APPOINTMENT_CLASSES.CONTENT)
      .appendTo(this.$element());

    const template = this.option().appointmentTemplate instanceof EmptyTemplate
      ? this.defaultAppointmentTemplate
      : this.option().appointmentTemplate;

    const $renderPromise = template.render({
      container: getPublicElement($content),
      model: {
        appointmentData: this.appointmentData,
        targetedAppointmentData: this.targetedAppointmentData,
      },
    });

    when($renderPromise).done(() => {
      this.option().onAppointmentRendered({
        element: getPublicElement(this.$element()),
        appointmentData: this.appointmentData,
        targetedAppointmentData: this.targetedAppointmentData,
      });
    });
  }

  protected defaultAppointmentContent($container: dxElementWrapper): dxElementWrapper {
    return $container;
  }
}

// TODO<Appointments>: rename to dxSchedulerAppointment when old impl is removed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
registerComponent('dxSchedulerNewAppointment', BaseAppointment as any);
