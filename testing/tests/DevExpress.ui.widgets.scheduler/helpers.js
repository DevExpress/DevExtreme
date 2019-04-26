import $ from "jquery";

export class SchedulerTestWrapper {
    constructor(instance) {
        this.instance = instance;

        this.tooltip = {
            getDesktopOverlayContentElement: () => $(".dx-scheduler-appointment-tooltip-wrapper .dx-overlay-content"),

            getContentElement: () => {
                return this.isAdaptivity() ? $(".dx-scheduler-overlay-panel") : $(".dx-scheduler-appointment-tooltip-wrapper.dx-overlay-wrapper .dx-list");
            },

            getItemElements: () => this.tooltip.getContentElement().find('.dx-list-item'),
            getItemElement: (index = 0) => $(this.tooltip.getItemElements().get(index)),
            checkItemElementHtml: (index = 0, template) => this.tooltip.getItemElement(index).html().indexOf(template) !== -1,
            getTitleElement: (index = 0) => this.tooltip.getItemElement(index).find('.dx-tooltip-appointment-item-content-subject'),
            getDateElement: (index = 0) => this.tooltip.getItemElement(index).find('.dx-tooltip-appointment-item-content-date'),
            getDeleteButton: (index = 0) => this.tooltip.getItemElement(index).find('.dx-tooltip-appointment-item-delete-button'),

            getMarkers: () => this.tooltip.getItemElements().find('.dx-tooltip-appointment-item-marker-body'),

            getDateText: (index = 0) => this.tooltip.getDateElement(index).text(),
            getTitleText: (index = 0) => this.tooltip.getTitleElement(index).text(),

            getItemCount: () => this.tooltip.getItemElements().length,

            clickOnDeleteButton: (index = 0) => this.tooltip.getDeleteButton(index).trigger("dxclick"),
            clickOnItem: (index = 0) => this.tooltip.getItemElement(index).trigger("dxclick"),

            hasDeleteButton: (index = 0) => this.tooltip.getDeleteButton(index).length !== 0,

            isVisible: () => {
                if(this.isAdaptivity()) {
                    const content = this.tooltip.getContentElement();
                    return content.length === 0 ? false : !content.hasClass("dx-state-invisible");
                }
                return this.tooltip.getContentElement().length > 0;
            }
        };

        this.appointments = {
            getAppointments: () => $(".dx-scheduler-appointment"),
            getAppointmentCount: () => this.appointments.getAppointments().length,
            getAppointment: (index = 0) => this.appointments.getAppointments().eq(index),
            getTitleText: (index = 0) => this.appointments.getAppointment(index).find(".dx-scheduler-appointment-title").text(),
            getAppointmentWidth: (index = 0) => this.appointments.getAppointment(index).get(0).getBoundingClientRect().width,
            getAppointmentHeight: (index = 0) => this.appointments.getAppointment(index).get(0).getBoundingClientRect().height,

            click: (index = 0) => {
                this.clock = sinon.useFakeTimers();
                this.appointments.getAppointment(index).trigger("dxclick");
                this.clock.tick(300);
                this.clock.restore();
            },

            dblclick: (index = 0) => {
                this.appointments.getAppointment(index).trigger("dxdblclick");
            },

            compact: {
                getButtons: () => $(".dx-scheduler-appointment-collector"),
                getButtonCount: () => this.appointments.compact.getButtons().length,
                getButton: (index = 0) => $(this.appointments.compact.getButtons().get(index)),
                getButtonText: (index = 0) => this.appointments.compact.getButton(index).find("span").text(),
                click: (index = 0) => this.appointments.compact.getButton(index).trigger("dxclick"),
            }
        };

        this.appointmentPopup = {
            getPopup: () => $(".dx-overlay-wrapper.dx-scheduler-appointment-popup"),
            getPopupInstance: () => $(".dx-scheduler-appointment-popup.dx-widget").dxPopup("instance"),
            isVisible: () => this.appointmentPopup.getPopup().length !== 0,
            hide: () => this.appointmentPopup.getPopup().find(".dx-closebutton.dx-button").trigger("dxclick"),
            setInitialWidth: width => {
                const popupConfig = this.instance._popupConfig;
                this.instance._popupConfig = appointmentData => {
                    const config = popupConfig.call(this.instance, appointmentData);
                    config.width = width;
                    return config;
                };
            },
            setPopupWidth: width => this.appointmentPopup.getPopupInstance().option("width", width)
        };

        this.appointmentForm = {
            getFormInstance: () => this.appointmentPopup.getPopup().find(".dx-form").dxForm("instance"),
            hasFormSingleColumn: () => this.appointmentPopup.getPopup().find(".dx-responsivebox").hasClass("dx-responsivebox-screen-xs")
        };

        this.workSpace = {
            getCells: () => $(".dx-scheduler-date-table-cell"),
            getCell: (index) => this.workSpace.getCells().eq(index),
            getAllDayCells: () => $(".dx-scheduler-all-day-table-cell"),
            getAllDayCell: (index) => this.workSpace.getAllDayCells().eq(index),
            getCellWidth: () => this.workSpace.getCells().eq(0).outerWidth(),
            getCellHeight: () => this.workSpace.getCells().eq(0).outerHeight(),
            getAllDayCellWidth: () => this.workSpace.getAllDayCells().eq(0).outerWidth(),
            getAllDayCellHeight: () => this.workSpace.getAllDayCells().eq(0).outerHeight()
        };
    }

    isAdaptivity() {
        return this.instance.option("adaptivityEnabled");
    }
}

export const tooltipHelper = {
    getContentElement: () => $(".dx-scheduler-appointment-tooltip-wrapper.dx-overlay-wrapper .dx-list"),
    getItemElements: () => tooltipHelper.getContentElement().find('.dx-list-item'),
    getItemElement: (index = 0) => $(tooltipHelper.getItemElements().get(index)),
    getTitleElement: (index = 0) => tooltipHelper.getItemElement(index).find('.dx-tooltip-appointment-item-content-subject'),
    getDateElement: (index = 0) => tooltipHelper.getItemElement(index).find('.dx-tooltip-appointment-item-content-date'),
    getDeleteButton: (index = 0) => tooltipHelper.getItemElement(index).find('.dx-tooltip-appointment-item-delete-button'),

    getMarkers: () => tooltipHelper.getItemElements().find('.dx-tooltip-appointment-item-marker-body'),

    getDateText: (index = 0) => tooltipHelper.getDateElement(index).text(),
    getTitleText: (index = 0) => tooltipHelper.getTitleElement(index).text(),

    getItemCount: () => tooltipHelper.getItemElements().length,

    clickOnDeleteButton: (index = 0) => tooltipHelper.getDeleteButton(index).trigger("dxclick"),
    clickOnItem: (index = 0) => tooltipHelper.getItemElement(index).trigger("dxclick"),

    hasDeleteButton: (index = 0) => tooltipHelper.getDeleteButton(index).length !== 0,

    isVisible: () => tooltipHelper.getContentElement().length > 0
};

export const appointmentsHelper = {
    getAppointments: () => $(".dx-scheduler-appointment"),
    getAppointmentCount: () => appointmentsHelper.getAppointments().length,
    getAppointment: (index = 0) => appointmentsHelper.getAppointments().eq(index),
    getTitleText: (index = 0) => appointmentsHelper.getAppointment(index).find(".dx-scheduler-appointment-title").text(),

    click: (index = 0) => {
        this.clock = sinon.useFakeTimers();
        appointmentsHelper.getAppointment(index).trigger("dxclick");
        this.clock.tick(300);
        this.clock.restore();
    },

    compact: {
        getButtons: () => $(".dx-scheduler-appointment-collector"),
        getButtonCount: () => appointmentsHelper.compact.getButtons().length,
        getButton: (index = 0) => $(appointmentsHelper.compact.getButtons().get(index)),
        getButtonText: (index = 0) => appointmentsHelper.compact.getButton(index).find("span").text(),
        click: (index = 0) => appointmentsHelper.compact.getButton(index).trigger("dxclick"),
    }
};
// TODO: Don't use
export const appointmentPopupHelper = {
    getPopup: () => $(".dx-overlay-wrapper.dx-scheduler-appointment-popup"),
    hide: () => appointmentPopupHelper.getPopup().find(".dx-closebutton.dx-button").trigger("dxclick")
};
