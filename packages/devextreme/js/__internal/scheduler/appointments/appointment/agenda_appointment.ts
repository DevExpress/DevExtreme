import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { ResourceProcessor } from '@ts/scheduler/resources/resource_processor';

import {
  APPOINTMENT_CONTENT_CLASSES,
} from '../../m_classes';
import { Appointment } from './m_appointment';

export class AgendaAppointment extends Appointment {
  get coloredElement(): dxElementWrapper {
    return this.$element().find(`.${APPOINTMENT_CONTENT_CLASSES.AGENDA_MARKER}`);
  }

  get resourceProcessor(): ResourceProcessor {
    const getResourceProcessor = this.option('getResourceProcessor') as () => ResourceProcessor;
    return getResourceProcessor();
  }

  _renderResourceList(): void {
    // eslint-disable-next-line no-void
    void this.resourceProcessor
      .getAppointmentResourcesValues(this.rawAppointment)
      .then((list) => {
        const parent = this.$element().find(`.${APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_CONTENT_DETAILS}`);
        const container = $('<div>')
          .addClass(APPOINTMENT_CONTENT_CLASSES.AGENDA_RESOURCE_LIST)
          .appendTo(parent);

        list.forEach((item) => {
          const itemContainer = $('<div>')
            .addClass(APPOINTMENT_CONTENT_CLASSES.AGENDA_RESOURCE_LIST_ITEM)
            .appendTo(container);

          $('<div>')
            .text(`${item.label}:`)
            .appendTo(itemContainer);

          $('<div>')
            .addClass(APPOINTMENT_CONTENT_CLASSES.AGENDA_RESOURCE_LIST_ITEM_VALUE)
            .text(item.values.join(', '))
            .appendTo(itemContainer);
        });
      });
  }

  _render(): void {
    super._render();
    this._renderResourceList();
  }
}
