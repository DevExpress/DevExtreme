import $ from "jquery";
import { extend } from "core/utils/extend";
import translator from "animation/translator";
import devices from "core/devices";
import pointerMock from "../../helpers/pointerMock.js";
import "ui/scheduler/ui.scheduler";

export const TOOLBAR_TOP_LOCATION = "top";
export const TOOLBAR_BOTTOM_LOCATION = "bottom";

const CLASSES = {
    appointment: ".dx-scheduler-appointment",
    appointmentTitle: ".dx-scheduler-appointment-title",

    appointmentResizeTopHandle: ".dx-resizable-handle-top",
    appointmentResizeBottomHandle: ".dx-resizable-handle-bottom",
    appointmentResizeLeftHandle: ".dx-resizable-handle-left",
    appointmentResizeRightHandle: ".dx-resizable-handle-right"
};

const SCHEDULER_ID = "scheduler";
const TEST_ROOT_ELEMENT_ID = "qunit-fixture";

export const initTestMarkup = () => $(`#${TEST_ROOT_ELEMENT_ID}`).html(`<div id="${SCHEDULER_ID}"><div data-options="dxTemplate: { name: 'template' }">Task Template</div></div>`);

export const createWrapper = (option) => new SchedulerTestWrapper($(`#${SCHEDULER_ID}`).dxScheduler(option).dxScheduler("instance"));

export const isDesktopEnvironment = () => devices.real().deviceType === "desktop";

class Appointment {
    constructor(element) {
        this.element = $(element);

        this.resizeTopHandle = this.element.find(CLASSES.appointmentResizeTopHandle);
        this.resizeBottomHandle = this.element.find(CLASSES.appointmentResizeBottomHandle);
        this.resizeLeftHandle = this.element.find(CLASSES.appointmentResizeLeftHandle);
        this.resizeRightHandle = this.element.find(CLASSES.appointmentResizeRightHandle);

        this.isHorizontalResize = this.resizeLeftHandle.length > 0;
    }

    getPosition() {
        return translator.locate(this.element);
    }

    getSize() {
        return {
            width: this.element.width(),
            height: this.element.height()
        };
    }

    resizeTo(direction, value) {
        let element = null;
        const position = { x: 0, y: 0 };

        switch(direction) {
            case "top":
                element = this.resizeTopHandle;
                position.y = value;
                break;
            case "bottom":
                element = this.resizeBottomHandle;
                position.y = value;
                break;
            case "left":
                element = this.resizeLeftHandle;
                position.x = value;
                break;
            case "right":
                element = this.resizeRightHandle;
                position.x = value;
                break;
        }

        pointerMock(element)
            .start()
            .down()
            .move(position.x, position.y)
            .up();
    }
}

export class SchedulerTestWrapper {
    constructor(instance) {
        this.instance = instance;

        this.getTimePanel = () => $(".dx-scheduler-time-panel"),

        this.tooltip = {
            getOverlayContentElement: () => {
                return this.isAdaptivity() ? this.tooltip.getContentElement().find(".dx-overlay-content") : $(".dx-scheduler-appointment-tooltip-wrapper .dx-overlay-content");
            },

            getContentElement: () => {
                return this.isAdaptivity() ? $(".dx-scheduler-overlay-panel") : $(".dx-scheduler-appointment-tooltip-wrapper.dx-overlay-wrapper .dx-list");
            },

            hasScrollbar: () => this.tooltip.getContentElement().find(".dx-scrollable-scrollbar").is(':visible'),

            getItemElements: () => this.tooltip.getContentElement().find('.dx-list-item'),
            getItemElement: (index = 0) => $(this.tooltip.getItemElements().get(index)),
            checkItemElementHtml: (index = 0, template) => this.tooltip.getItemElement(index).html().indexOf(template) !== -1,
            getTitleElement: (index = 0) => this.tooltip.getItemElement(index).find('.dx-tooltip-appointment-item-content-subject'),
            getDateElement: (index = 0) => this.tooltip.getItemElement(index).find('.dx-tooltip-appointment-item-content-date'),
            getDeleteButton: (index = 0) => this.tooltip.getItemElement(index).find('.dx-tooltip-appointment-item-delete-button'),

            getMarkers: () => this.tooltip.getItemElements().find('.dx-tooltip-appointment-item-marker-body'),

            getMarker: () => this.tooltip.getMarkers().first(),

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
            getAppointments: () => $(CLASSES.appointment),
            getAppointmentCount: () => this.appointments.getAppointments().length,
            getAppointment: (index = 0) => this.appointments.getAppointments().eq(index),
            getTitleText: (index = 0) => this.appointments.getAppointment(index).find(".dx-scheduler-appointment-title").text(),
            getAppointmentWidth: (index = 0) => this.appointments.getAppointment(index).get(0).getBoundingClientRect().width,
            getAppointmentHeight: (index = 0) => this.appointments.getAppointment(index).get(0).getBoundingClientRect().height,
            getAppointmentPosition: (index = 0) => translator.locate($(this.appointments.getAppointment(index))),

            find: (text) => {
                return this.appointments
                    .getAppointments()
                    .filter((index, element) => $(element).find(CLASSES.appointmentTitle).text() === text)
                    .toArray()
                    .map(element => new Appointment(element));
            },

            findFirst: (text) => {
                return this.appointments.find(text)[0];
            },

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
                getLastButtonIndex: () => this.appointments.compact.getButtonCount() - 1,

                getButton: (index = 0) => $(this.appointments.compact.getButtons().get(index)),
                getButtonText: (index = 0) => this.appointments.compact.getButton(index).find("span").text(),
                getButtonWidth: (index = 0) => this.appointments.compact.getButton(index).get(0).getBoundingClientRect().width,
                getButtonHeight: (index = 0) => this.appointments.compact.getButton(index).get(0).getBoundingClientRect().height,

                click: (index = 0) => this.appointments.compact.getButton(index).trigger("dxclick"),

                getAppointment: (index = 0) => $(".dx-list-item").eq(index),

                getFakeAppointment: () => $(".dx-scheduler-fixed-appointments .dx-scheduler-appointment")
            }
        };

        this.appointmentPopup = {
            form: {
                getSubjectTextBox: () => {
                    const subjectElement = this.appointmentPopup.getPopup().find(".dx-textbox").eq(0);
                    return subjectElement.dxTextBox("instance");
                },
                setSubject: (text) => {
                    const textBox = this.appointmentPopup.form.getSubjectTextBox();
                    textBox.option("value", text);
                },
                getSubject: () => {
                    const textBox = this.appointmentPopup.form.getSubjectTextBox();
                    return textBox.option("value");
                },
                isRecurrenceEditorVisible: () => $(".dx-recurrence-editor-container").is(":visible")
            },

            dialog: {
                clickEditSeries: () => $(".dx-dialog").find(".dx-dialog-button").eq(0).trigger("dxclick"),
                clickEditAppointment: () => $(".dx-dialog").find(".dx-dialog-button").eq(1).trigger("dxclick"),
                hide: () => $(".dx-dialog").find(".dx-closebutton.dx-button").trigger("dxclick")
            },

            getPopup: () => $(".dx-overlay-wrapper.dx-scheduler-appointment-popup"),
            hasVerticalScroll: () => {
                const scrollableContainer = this.appointmentPopup.getPopup().find(".dx-scrollable-container").get(0);
                return scrollableContainer.scrollHeight > scrollableContainer.clientHeight;
            },
            getPopupInstance: () => $(".dx-scheduler-appointment-popup.dx-widget").dxPopup("instance"),
            isVisible: () => this.appointmentPopup.getPopup().length !== 0,
            hide: () => this.appointmentPopup.getPopup().find(".dx-closebutton.dx-button").trigger("dxclick"),
            setInitialPopupSize: size => {
                const _createPopupConfig = this.instance._appointmentPopup._createPopupConfig;
                this.instance._appointmentPopup._createPopupConfig = () => {
                    const config = _createPopupConfig.call(this.instance._appointmentPopup);
                    return extend(config, size);
                };
            },
            setPopupWidth: width => this.appointmentPopup.getPopupInstance().option("width", width),
            getToolbarElementByLocation: location => {
                const toolbarName = location === TOOLBAR_TOP_LOCATION ? "title" : TOOLBAR_BOTTOM_LOCATION;
                return this.appointmentPopup.getPopup().find(`.dx-toolbar.dx-widget.dx-popup-${toolbarName}`);
            },
            hasToolbarButtonsInSection: (toolBarLocation, sectionName, buttonNames) => {
                const $toolbar = this.appointmentPopup.getToolbarElementByLocation(toolBarLocation);
                const $buttons = $toolbar.find(`.dx-toolbar-${sectionName} .dx-button`);
                return buttonNames.every((name, index) => $buttons.eq(index).hasClass(`dx-popup-${name}`));
            },

            getDoneButton: () => this.appointmentPopup.getPopup().find(".dx-popup-done"),
            clickDoneButton: () => this.appointmentPopup.getDoneButton().trigger("dxclick"),

            getCancelButton: () => this.appointmentPopup.getPopup().find(".dx-popup-cancel"),
            clickCancelButton: () => this.appointmentPopup.getCancelButton().trigger("dxclick"),
            saveAppointmentData: () => this.instance._appointmentPopup.saveEditData.call(this.instance._appointmentPopup),
        };

        this.appointmentForm = {
            getFormInstance: () => this.appointmentPopup.getPopup().find(".dx-form").dxForm("instance"),
            getEditor: name => this.appointmentForm.getFormInstance().getEditor(name),
            setSubject: (value) => this.appointmentForm.getEditor("text").option("value", value),

            hasFormSingleColumn: () => this.appointmentPopup.getPopup().find(".dx-responsivebox").hasClass("dx-responsivebox-screen-xs"),
            getRecurrentAppointmentFormDialogButtons: () => $(".dx-dialog-buttons .dx-button"),
            clickFormDialogButton: (index = 0) => this.appointmentForm.getRecurrentAppointmentFormDialogButtons().eq(index).trigger("dxclick"),
            getPendingEditorsCount: () => $(this.appointmentForm.getFormInstance().element()).find(".dx-validation-pending").length,
            getInvalidEditorsCount: () => $(this.appointmentForm.getFormInstance().element()).find(".dx-invalid").length
        };

        this.workSpace = {
            getWorkSpace: () => $(".dx-scheduler-work-space"),

            getDateTableScrollable: () => $(".dx-scheduler-date-table-scrollable"),
            getHeaderScrollable: () => $(".dx-scheduler-header-scrollable"),

            getDateTable: () => $(".dx-scheduler-date-table"),
            getDateTableHeight: () => this.workSpace.getDateTable().height(),

            getRows: (index = 0) => $(".dx-scheduler-date-table-row").eq(index),
            getCells: () => $(".dx-scheduler-date-table-cell"),
            getCell: (rowIndex, cellIndex) => {
                if(cellIndex !== undefined) {
                    return $(".dx-scheduler-date-table-row").eq(rowIndex).find(".dx-scheduler-date-table-cell").eq(cellIndex);
                }
                return this.workSpace.getCells().eq(rowIndex);
            },

            getAllDayCells: () => $(".dx-scheduler-all-day-table-cell"),
            getAllDayCell: (index) => this.workSpace.getAllDayCells().eq(index),
            getCellWidth: () => this.workSpace.getCells().eq(0).outerWidth(),
            getCellHeight: () => this.workSpace.getCells().eq(0).outerHeight(),
            getAllDayCellWidth: () => this.workSpace.getAllDayCells().eq(0).outerWidth(),
            getAllDayCellHeight: () => this.workSpace.getAllDayCells().eq(0).outerHeight(),
            getCurrentTimeIndicator: () => $(".dx-scheduler-date-time-indicator"),

            getDataTableScrollableContainer: () => this.workSpace.getDateTableScrollable().find(".dx-scrollable-container"),
            getScrollPosition: () => {
                const element = this.workSpace.getDataTableScrollableContainer();
                return { left: element.scrollLeft(), top: element.scrollTop() };
            },
            groups: {
                getGroupsContainer: () => $(".dx-scheduler-group-flex-container"),
                getGroup: (index = 0) => $(".dx-scheduler-group-row").eq(index),
                getGroupHeaders: (index) => this.workSpace.groups.getGroup(index).find(".dx-scheduler-group-header"),
                getGroupHeader: (index, groupRow = 0) => this.workSpace.groups.getGroupHeaders(groupRow).eq(index),
            },
        };

        this.navigator = {
            getNavigator: () => $(".dx-scheduler-navigator"),
            getCaption: () => $(".dx-scheduler-navigator").find(".dx-scheduler-navigator-caption").text(),
            clickOnPrevButton: () => {
                this.navigator.getNavigator().find(".dx-scheduler-navigator-previous").trigger("dxclick");
            },
            clickOnNextButton: () => {
                this.navigator.getNavigator().find(".dx-scheduler-navigator-next").trigger("dxclick");
            }
        },

        this.header = {
            get: () => $(".dx-scheduler-header-panel")
        },

        this.grouping = {
            getGroupHeaders: () => $(".dx-scheduler-group-header"),
            getGroupHeader: (index = 0) => this.grouping.getGroupHeaders().eq(index),
            getGroupHeaderHeight: () => this.grouping.getGroupHeader(0).outerHeight(),
            getGroupTable: () => $(".dx-scheduler-group-table"),
            getGroupTableHeight: () => this.grouping.getGroupTable().height()
        };
    }

    option(name, value) {
        if(value === undefined) {
            return this.instance.option(name);
        }
        this.instance.option(name, value);
    }

    isAdaptivity() {
        return this.instance.option("adaptivityEnabled");
    }

    drawControl() {
        $(`#${TEST_ROOT_ELEMENT_ID}`).css("top", 0);
        $(`#${TEST_ROOT_ELEMENT_ID}`).css("left", 0);
    }
}
