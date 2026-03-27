import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { when } from '@js/core/utils/deferred';
import type { Properties as SchedulerProperties } from '@js/ui/scheduler';
import { getPublicElement } from '@ts/core/m_element';
import { FunctionTemplate } from '@ts/core/templates/m_function_template';
import type { DefaultActionArgs } from '@ts/core/widget/component';
import type { DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';
import { createFormattedDateText, DateFormatType } from '@ts/scheduler/appointments/m_text_utils';
import type { SafeAppointment, TargetedAppointment } from '@ts/scheduler/types';
import type { AppointmentDataAccessor } from '@ts/scheduler/utils/data_accessor/appointment_data_accessor';
import { getTargetedAppointment } from '@ts/scheduler/utils/get_targeted_appointment';
import type { ResourceManager } from '@ts/scheduler/utils/resource_manager/resource_manager';
import type { AppointmentAgendaViewModel, AppointmentItemViewModel } from '@ts/scheduler/view_model/types';

import { APPOINTMENT_CLASSES } from '../const';

export interface AppointmentRenderedEvent extends DefaultActionArgs<BaseAppointment> {
  appointmentData: SafeAppointment;
  targetedAppointmentData: TargetedAppointment;
}

export interface BaseAppointmentProperties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extends DOMComponentProperties<BaseAppointment<any>>
{
  viewModel: AppointmentItemViewModel | AppointmentAgendaViewModel;
  appointmentTemplate: SchedulerProperties['appointmentTemplate'];

  onAppointmentRendered: (e: AppointmentRenderedEvent) => void;

  getResourceManager: () => ResourceManager;
  getDataAccessor: () => AppointmentDataAccessor;
}

export class BaseAppointment<
  TProperties extends BaseAppointmentProperties = BaseAppointmentProperties,
> extends DOMComponent<BaseAppointment<TProperties>, TProperties> {
  protected targetedAppointmentData!: TargetedAppointment;

  private appointmentRenderedAction!: BaseAppointmentProperties['onAppointmentRendered'];

  override _init(): void {
    super._init();

    const { viewModel } = this.option();
    this.targetedAppointmentData = getTargetedAppointment(
      viewModel.itemData,
      viewModel,
      this.option().getDataAccessor(),
      this.option().getResourceManager(),
    );

    this._templateManager.addDefaultTemplates({
      appointment: new FunctionTemplate((options) => {
        this.defaultAppointmentTemplate($(options.container));
      }),
    });

    this.appointmentRenderedAction = this._createActionByOption('onAppointmentRendered', {
      excludeValidators: ['disabled', 'readOnly'],
    });
  }

  override _initMarkup(): void {
    super._initMarkup();

    this.resize();
    this.applyElementClasses();
    this.renderContentTemplate();
  }

  public resize(): void { }

  protected applyElementClasses(): void {
    this.$element()
      .addClass(APPOINTMENT_CLASSES.CONTAINER)
      .toggleClass(APPOINTMENT_CLASSES.RECURRING, this.isRecurring());
  }

  protected async getColor(): Promise<string | undefined> {
    const { viewModel } = this.option();
    const resourceManager = this.option().getResourceManager();

    const color = await resourceManager.getAppointmentColor({
      itemData: viewModel.itemData,
      groupIndex: viewModel.groupIndex,
    });

    return color;
  }

  protected getTitleText(): string {
    const dataAccessor = this.option().getDataAccessor();
    const titleText = dataAccessor.get('text', this.targetedAppointmentData) ?? messageLocalization.format('dxScheduler-noSubject');

    return titleText;
  }

  protected getDateText(): string {
    const dataAccessor = this.option().getDataAccessor();
    const allDay = dataAccessor.get('allDay', this.targetedAppointmentData);

    const dateText = createFormattedDateText(
      this.targetedAppointmentData,
      allDay ? DateFormatType.DATE : DateFormatType.TIME,
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

    const template = this._getTemplateByOption('appointmentTemplate');
    const { viewModel } = this.option();

    const $renderPromise = template.render({
      container: getPublicElement($content),
      model: {
        appointmentData: viewModel.itemData,
        targetedAppointmentData: this.targetedAppointmentData,
      },
    });

    when($renderPromise).done(() => {
      // @ts-expect-error 'component' property is set by the action
      this.appointmentRenderedAction({
        appointmentData: viewModel.itemData,
        targetedAppointmentData: this.targetedAppointmentData,
      });
    });
  }

  protected defaultAppointmentTemplate($container: dxElementWrapper): dxElementWrapper {
    return $container;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
registerComponent('dxSchedulerAppointment', BaseAppointment as any);
