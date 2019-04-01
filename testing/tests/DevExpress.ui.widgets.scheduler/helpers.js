import $ from "jquery";

export const tooltipHelper = {
    getContentElement: () => $(".dx-scheduler-appointment-tooltip-wrapper.dx-overlay-wrapper .dx-list"),
    getItemElements: () => tooltipHelper.getContentElement().find('.dx-list-item'),
    getItemElement: (index = 0) => $(tooltipHelper.getItemElements().get(index)),
    getTitleElement: (index = 0) => tooltipHelper.getItemElement(index).find('.dx-tooltip-appointment-item-content-subject'),
    getDateElement: (index = 0) => tooltipHelper.getItemElement(index).find('.dx-tooltip-appointment-item-content-date'),
    getDeleteButton: (index = 0) => tooltipHelper.getItemElement(index).find('.dx-tooltip-appointment-item-delete-button'),

    getMarkers: () => tooltipHelper.getItemElements().find('.dx-tooltip-appointment-item-marker-body'),
    // getMarker: (index = 0) => $(tooltipHelper.getItemElement(index).find('.dx-tooltip-appointment-item-marker-body').get(0)),

    getDateText: (index = 0) => tooltipHelper.getDateElement(index).text(),
    getTitleText: (index = 0) => tooltipHelper.getTitleElement(index).text(),

    getItemCount: () => tooltipHelper.getItemElements().length,

    clickOnDeleteButton: (index = 0) => tooltipHelper.getDeleteButton(index).trigger("dxclick"),
    clickOnItem: (index = 0) => tooltipHelper.getItemElement(index).trigger("dxclick"),

    hasDeleteButton: (index = 0) => tooltipHelper.getDeleteButton(index).length !== 0,

    isVisible: () => tooltipHelper.getContentElement().length > 0
};

export const appointmentsHelper = {
    getAppointmentElement: (index = 0) => $(".dx-scheduler-appointment").eq(index),
    click: (index = 0) => appointmentsHelper.getAppointmentElement(index).trigger("dxclick"),

    compact: {
        getButtons: () => $(".dx-scheduler-dropdown-appointments"),
        getButton: (index = 0) => $(appointmentsHelper.compact.getButtons().get(index)),
        getButtonCount: () => appointmentsHelper.compact.getButtons().length,
        getButtonText: (index = 0) => appointmentsHelper.compact.getButton(index).find("span").text(),
        click: (index = 0) => appointmentsHelper.compact.getButton(index).trigger("dxclick"),
    }
};
