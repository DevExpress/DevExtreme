import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { AppointmentAgendaViewModel } from '@ts/scheduler/view_model/types';

import {
  AGENDA_APPOINTMENT_CLASSES, ALL_DAY_TEXT, APPOINTMENT_CLASSES, RECURRING_LABEL,
} from '../const';
import type { BaseAppointmentProperties } from './base_appointment';
import { BaseAppointment } from './base_appointment';

export interface AgendaAppointmentProperties extends BaseAppointmentProperties {
  viewModel: AppointmentAgendaViewModel;
}

export class AgendaAppointment extends BaseAppointment<AgendaAppointmentProperties> {
  protected override applyElementClasses(): void {
    super.applyElementClasses();

    this.$element()
      .toggleClass(AGENDA_APPOINTMENT_CLASSES.LAST_IN_DATE, this.option().viewModel.isLastInGroup);
  }

  protected override defaultAppointmentTemplate(
    $container: dxElementWrapper,
  ): dxElementWrapper {
    this.renderMarker($container);
    this.renderInfo($container);

    return $container;
  }

  private renderMarker($container: dxElementWrapper): void {
    const $leftContainer = $('<div>')
      .addClass('dx-scheduler-agenda-appointment-left-layout')
      .appendTo($container);

    const $marker = $('<div>')
      .addClass(AGENDA_APPOINTMENT_CLASSES.MARKER)
      .appendTo($leftContainer);

    // eslint-disable-next-line no-void
    void super.getResourceColor().then((color) => {
      if (color) {
        $marker.css('backgroundColor', color);
      }
    });

    if (this.isRecurring()) {
      $('<span>')
        .addClass(`${APPOINTMENT_CLASSES.RECURRENCE_ICON} dx-icon-repeat`)
        .attr('aria-label', RECURRING_LABEL)
        .appendTo($marker);
    }
  }

  private renderInfo($container: dxElementWrapper): void {
    const $rightContainer = $('<div>')
      .addClass('dx-scheduler-agenda-appointment-right-layout')
      .appendTo($container);

    $('<div>')
      .addClass(APPOINTMENT_CLASSES.TITLE)
      .text(this.getTitleText())
      .appendTo($rightContainer);

    const $contentDetails = $('<div>')
      .addClass(APPOINTMENT_CLASSES.DETAILS)
      .appendTo($rightContainer);

    $('<div>')
      .addClass(APPOINTMENT_CLASSES.DATE)
      .text(this.getDateText())
      .appendTo($contentDetails);

    if (this.isAllDay()) {
      $('<div>')
        .text(ALL_DAY_TEXT)
        .addClass(APPOINTMENT_CLASSES.ALL_DAY_TEXT)
        .prependTo($contentDetails);
    }

    this.renderResourceList($contentDetails);
  }

  private renderResourceList($contentDetails: dxElementWrapper): void {
    const resourceManager = this.option().getResourceManager();

    // eslint-disable-next-line no-void
    void resourceManager
      .getAppointmentResourcesValues(this.targetedAppointmentData)
      .then((resources) => {
        const container = $('<div>')
          .addClass(AGENDA_APPOINTMENT_CLASSES.RESOURCE_LIST)
          .appendTo($contentDetails);

        resources.forEach((resource) => {
          const itemContainer = $('<div>')
            .addClass(AGENDA_APPOINTMENT_CLASSES.RESOURCE_ITEM)
            .appendTo(container);

          $('<div>')
            .text(`${resource.label}:`)
            .appendTo(itemContainer);

          $('<div>')
            .addClass(AGENDA_APPOINTMENT_CLASSES.RESOURCE_ITEM_VALUE)
            .text(resource.values.join(', '))
            .appendTo(itemContainer);
        });
      });
  }
}
