import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';

import type { AppointmentItemViewModel } from '../../view_model/types';
import { ALL_DAY_TEXT, APPOINTMENT_CLASSES, RECURRING_LABEL } from '../const';
import type { BaseAppointmentProperties } from './base_appointment';
import { BaseAppointment } from './base_appointment';

export interface GridAppointmentProperties extends BaseAppointmentProperties {
  viewModel: AppointmentItemViewModel;
}

export class GridAppointment extends BaseAppointment<GridAppointmentProperties> {
  override _initMarkup(): void {
    super._initMarkup();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.applyElementColor();
  }

  public resize(): void {
    this.$element().css({
      height: this.option().viewModel.height,
      width: this.option().viewModel.width,
      top: this.option().viewModel.top,
      left: this.option().viewModel.left,
    });
  }

  private async applyElementColor(): Promise<void> {
    const color = await super.getColor();

    if (color) {
      this.$element().css('backgroundColor', color);
    }
  }

  protected override defaultAppointmentTemplate(
    $container: dxElementWrapper,
  ): dxElementWrapper {
    $('<div>')
      .text(this.getTitleText())
      .addClass(APPOINTMENT_CLASSES.TITLE)
      .appendTo($container);

    if (this.isRecurring()) {
      $('<span>')
        .addClass(`${APPOINTMENT_CLASSES.RECURRENCE_ICON} dx-icon-repeat`)
        .attr('aria-label', RECURRING_LABEL)
        .attr('role', 'img')
        .appendTo($container);
    }

    const $contentDetails = $('<div>')
      .addClass(APPOINTMENT_CLASSES.DETAILS)
      .appendTo($container);

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

    return $container;
  }
}
