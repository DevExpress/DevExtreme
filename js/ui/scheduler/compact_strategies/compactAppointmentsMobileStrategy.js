import { CompactAppointmentsStrategyBase } from "./compactAppointmentsStrategyBase";
import $ from "../../../core/renderer";

const appointmentClassName = "dx-scheduler-appointment-collector dx-scheduler-appointment-collector-compact";

export class CompactAppointmentsMobileStrategy extends CompactAppointmentsStrategyBase {
    renderCore(options) {
        const compactAppointment = $("<div>").addClass(appointmentClassName).html(options.items.data.length).appendTo(options.$container);
        this.setPosition(compactAppointment, options.coordinates);

        compactAppointment.click(() => {
            const dataItems = options.items.data.map(data => {
                return {
                    data: data,
                    currentData: data,
                    $appointment: null
                };
            });
            this.instance._appointmentTooltip.show(dataItems);
        });

        return compactAppointment;
    }
}
