import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';

import {
  ALL_DAY_TEXT, APPOINTMENT_CLASSES, APPOINTMENT_TYPE_CLASSES, RECURRING_LABEL,
} from '../const';
import type { BaseAppointmentViewProperties } from './base_appointment';
import { BaseAppointmentView } from './base_appointment';

export interface GridAppointmentViewProperties extends BaseAppointmentViewProperties {
  geometry: {
    height: number;
    width: number;
    top: number;
    left: number;
  };
  modifiers: {
    empty: boolean;
  };
}

export class GridAppointmentView extends BaseAppointmentView<GridAppointmentViewProperties> {
  override _initMarkup(): void {
    super._initMarkup();

    // eslint-disable-next-line no-void
    void this.applyElementColor();
  }

  public override resize(
    geometry?: { height: number; width: number; top: number; left: number },
  ): void {
    const newGeometry = geometry ?? this.option().geometry;
    const {
      top, left, width, height,
    } = newGeometry;

    this.$element().css({
      height, width, top, left,
    });
  }

  protected override applyElementClasses(): void {
    super.applyElementClasses();

    this.$element()
      .toggleClass(APPOINTMENT_TYPE_CLASSES.EMPTY, this.option().modifiers.empty);
  }

  protected override defaultAppointmentContent(
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

  private async applyElementColor(): Promise<void> {
    const color = await this.option().getResourceColor();

    if (color) {
      this.$element().addClass(APPOINTMENT_TYPE_CLASSES.HAS_RESOURCE);
      this.$element().css('backgroundColor', color);
    }
  }
}
