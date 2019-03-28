import $ from "jquery";

export const tooltipHelper = {
    getContentElement: () => $(".dx-scheduler-appointment-tooltip-wrapper.dx-overlay-wrapper .dx-list"),
    getItemElement: (index = 0) => $(tooltipHelper.getContentElement().find('.dx-list-item').get(index)),
    getTitleElement: (index = 0) => tooltipHelper.getItemElement(index).find('.dx-tooltip-appointment-item-content-subject'),
    getDateElement: (index = 0) => tooltipHelper.getItemElement(index).find('.dx-tooltip-appointment-item-content-date'),
    getDeleteButton: (index = 0) => tooltipHelper.getItemElement(index).find('.dx-tooltip-appointment-item-delete-button'),

    getDateText: (index = 0) => tooltipHelper.getDateElement(index).text(),
    getTitleText: (index = 0) => tooltipHelper.getTitleElement(index).text(),

    clickOnDeleteButton: (index = 0) => tooltipHelper.getDeleteButton(index).trigger("dxclick"),
    clickOnItem: (index = 0) => tooltipHelper.getItemElement(index).trigger("dxclick"),

    hasDeleteButton: (index = 0) => tooltipHelper.getDeleteButton(index).length !== 0,

    isVisible: () => tooltipHelper.getContentElement().length > 0
};

export const appointmentsHelper = {
    getCompactAppointmentButton: (index = 0) => $($(".dx-scheduler-dropdown-appointments").get(index)),
    getAppointmentElement: (index = 0) => $(".dx-scheduler-appointment").eq(index),

    click: (index = 0) => appointmentsHelper.getAppointmentElement(index).trigger("dxclick"),
    clickOnCompactAppointment: (index = 0) => appointmentsHelper.getCompactAppointmentButton(index).trigger("dxclick")
};
