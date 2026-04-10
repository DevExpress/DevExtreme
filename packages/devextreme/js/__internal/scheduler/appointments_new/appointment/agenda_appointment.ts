import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { SafeAppointment } from '@ts/scheduler/types';
import type { AppointmentResource } from '@ts/scheduler/utils/resource_manager/appointment_groups_utils';

import {
  AGENDA_APPOINTMENT_CLASSES, ALL_DAY_TEXT, APPOINTMENT_CLASSES, RECURRING_LABEL,
} from '../const';
import type { BaseAppointmentViewProperties } from './base_appointment';
import { BaseAppointmentView } from './base_appointment';

export interface AgendaAppointmentViewProperties extends BaseAppointmentViewProperties {
  modifiers: {
    isLastInGroup: boolean;
  };

  geometry: {
    height: number;
    width: string;
  };

  getResourcesValues: (
    appointmentData: SafeAppointment,
  ) => Promise<AppointmentResource[]>;
}

export class AgendaAppointmentView extends BaseAppointmentView<AgendaAppointmentViewProperties> {
  protected override applyElementClasses(): void {
    super.applyElementClasses();

    this.$element()
      .toggleClass(AGENDA_APPOINTMENT_CLASSES.LAST_IN_DATE, this.option().modifiers.isLastInGroup);
  }

  public override resize(): void {
    this.$element().css({
      height: this.option().geometry.height,
      width: this.option().geometry.width,
    });
  }

  protected override defaultAppointmentContent(
    $container: dxElementWrapper,
  ): dxElementWrapper {
    this.renderMarker($container);
    this.renderInfo($container);

    return $container;
  }

  private renderMarker($container: dxElementWrapper): void {
    const $leftContainer = $('<div>')
      .addClass(AGENDA_APPOINTMENT_CLASSES.LEFT_LAYOUT)
      .appendTo($container);

    const $marker = $('<div>')
      .addClass(AGENDA_APPOINTMENT_CLASSES.MARKER)
      .appendTo($leftContainer);

    // eslint-disable-next-line no-void
    void this.option().getResourceColor().then((color) => {
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
      .addClass(AGENDA_APPOINTMENT_CLASSES.RIGHT_LAYOUT)
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
    // eslint-disable-next-line no-void
    void this.option().getResourcesValues(this.appointmentData).then((resources) => {
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
