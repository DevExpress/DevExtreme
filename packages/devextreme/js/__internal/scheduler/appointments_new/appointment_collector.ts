import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as SchedulerProperties } from '@js/ui/scheduler';
import { FunctionTemplate } from '@ts/core/templates/m_function_template';
import type { DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';
import type { TargetedAppointment } from '@ts/scheduler/types';
import type { AppointmentDataAccessor } from '@ts/scheduler/utils/data_accessor/appointment_data_accessor';
import { getTargetedAppointment } from '@ts/scheduler/utils/get_targeted_appointment';
import type { ResourceManager } from '@ts/scheduler/utils/resource_manager/resource_manager';
import type { AppointmentCollectorViewModel, AppointmentItemViewModel } from '@ts/scheduler/view_model/types';
import Button from '@ts/ui/button';

import { APPOINTMENT_COLLECTOR_CLASSES } from './const';

export interface AppointmentCollectorProperties
  extends DOMComponentProperties<AppointmentCollector>
{
  viewModel: AppointmentCollectorViewModel;
  appointmentCollectorTemplate: SchedulerProperties['appointmentCollectorTemplate'];

  getResourceManager: () => ResourceManager;
  getDataAccessor: () => AppointmentDataAccessor;
}

export class AppointmentCollector
  extends DOMComponent<AppointmentCollector, AppointmentCollectorProperties> {
  private targetedAppointmentsData!: TargetedAppointment[];

  override _init(): void {
    super._init();

    const { viewModel } = this.option();
    this.targetedAppointmentsData = viewModel.items.map((item: AppointmentItemViewModel) => (
      getTargetedAppointment(
        item.itemData,
        item,
        this.option().getDataAccessor(),
        this.option().getResourceManager(),
      )
    ));

    this._templateManager.addDefaultTemplates({
      appointmentCollector: new FunctionTemplate((options) => {
        this.defaultAppointmentCollectorTemplate($(options.container));
      }),
    });
  }

  override _initMarkup(): void {
    super._initMarkup();

    this.applyElementClasses();
    this.applyElementAria();
    this.resize();
    this.renderContentTemplate();
  }

  override dispose(): void {
    super.dispose();
  }

  public resize(): void {
    this.$element().css({
      top: this.option().viewModel.top,
      left: this.option().viewModel.left,
    });
  }

  private applyElementClasses(): void {
    this.$element()
      .addClass(APPOINTMENT_COLLECTOR_CLASSES.CONTAINER)
      .toggleClass(APPOINTMENT_COLLECTOR_CLASSES.COMPACT, this.option().viewModel.isCompact);
  }

  private applyElementAria(): void {
    const localizeDate = (date: Date): string => (
      `${dateLocalization.format(date, 'monthAndDay')}, ${dateLocalization.format(date, 'year')}`
    );

    const startDateText = localizeDate(this.targetedAppointmentsData[0].displayStartDate);
    const endDateText = localizeDate(this.targetedAppointmentsData[0].displayEndDate);

    const dateText = startDateText === endDateText
      ? startDateText
      : `${startDateText} - ${endDateText}`;

    this.$element()
      .attr('aria-roledescription', dateText);
  }

  private renderContentTemplate(): void {
    const template = this._getTemplateByOption('appointmentCollectorTemplate');

    this._createComponent(this.$element(), Button, {
      type: 'default',
      width: this.option().viewModel.width,
      height: this.option().viewModel.height,
      template,
      onClick: () => {
        // TODO: show tooltip
      },
    });
  }

  private defaultAppointmentCollectorTemplate(
    $container: dxElementWrapper,
  ): dxElementWrapper {
    const { viewModel } = this.option();
    const count = viewModel.items.length;
    const text = viewModel.isCompact
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
registerComponent('dxSchedulerAppointmentCollector', AppointmentCollector as any);
