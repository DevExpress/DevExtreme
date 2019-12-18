import $ from 'jquery';
import { extend } from 'core/utils/extend';
import devices from 'core/devices';

export const TOOLBAR_TOP_LOCATION = 'top';
export const TOOLBAR_BOTTOM_LOCATION = 'bottom';

const SCHEDULER_ID = 'scheduler';
const TEST_ROOT_ELEMENT_ID = 'qunit-fixture';

export const isDesktopEnvironment = () => devices.real().deviceType === 'desktop';

export const initTestMarkup = () => $(`#${TEST_ROOT_ELEMENT_ID}`).html(`<div id="${SCHEDULER_ID}"><div data-options="dxTemplate: { name: 'template' }">Task Template</div></div>`);

export const createWrapper = (option) => new SchedulerTestWrapper($(`#${SCHEDULER_ID}`).dxScheduler(option).dxScheduler('instance'));

export class SchedulerTestWrapper {
    constructor(instance) {
        this.instance = instance;

        this.getTimePanel = () => $('.dx-scheduler-time-panel'),

        this.tooltip = {
            getOverlayContentElement: () => {
                return this.isAdaptivity() ? this.tooltip.getContentElement().find('.dx-overlay-content') : $('.dx-scheduler-appointment-tooltip-wrapper .dx-overlay-content');
            },

            getContentElement: () => {
                return this.isAdaptivity() ? $('.dx-scheduler-overlay-panel') : $('.dx-scheduler-appointment-tooltip-wrapper.dx-overlay-wrapper .dx-list');
            },

            hasScrollbar: () => this.tooltip.getContentElement().find('.dx-scrollable-scrollbar').is(':visible'),

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

            clickOnDeleteButton: (index = 0) => this.tooltip.getDeleteButton(index).trigger('dxclick'),
            clickOnItem: (index = 0) => this.tooltip.getItemElement(index).trigger('dxclick'),

            hasDeleteButton: (index = 0) => this.tooltip.getDeleteButton(index).length !== 0,

            isVisible: () => {
                if(this.isAdaptivity()) {
                    const content = this.tooltip.getContentElement();
                    return content.length === 0 ? false : !content.hasClass('dx-state-invisible');
                }
                return this.tooltip.getContentElement().length > 0;
            }
        };

        this.appointments = {
            getAppointments: () => $('.dx-scheduler-appointment'),
            getAppointmentCount: () => this.appointments.getAppointments().length,
            getAppointment: (index = 0) => this.appointments.getAppointments().eq(index),
            getTitleText: (index = 0) => this.appointments.getAppointment(index).find('.dx-scheduler-appointment-title').text(),
            getAppointmentWidth: (index = 0) => this.appointments.getAppointment(index).get(0).getBoundingClientRect().width,
            getAppointmentHeight: (index = 0) => this.appointments.getAppointment(index).get(0).getBoundingClientRect().height,

            find: (text) => {
                return this.appointments
                    .getAppointments()
                    .filter((index, element) => $(element).find('.dx-scheduler-appointment-title').text() === text);
            },

            click: (index = 0) => {
                this.clock = sinon.useFakeTimers();
                this.appointments.getAppointment(index).trigger('dxclick');
                this.clock.tick(300);
                this.clock.restore();
            },

            dblclick: (index = 0) => {
                this.appointments.getAppointment(index).trigger('dxdblclick');
            },

            compact: {
                getButtons: () => $('.dx-scheduler-appointment-collector'),
                getButtonCount: () => this.appointments.compact.getButtons().length,
                getLastButtonIndex: () => this.appointments.compact.getButtonCount() - 1,
                getButton: (index = 0) => $(this.appointments.compact.getButtons().get(index)),
                getButtonText: (index = 0) => this.appointments.compact.getButton(index).find('span').text(),
                click: (index = 0) => this.appointments.compact.getButton(index).trigger('dxclick'),
                getButtonWidth: (index = 0) => this.appointments.compact.getButton(index).get(0).getBoundingClientRect().width,
                getButtonHeight: (index = 0) => this.appointments.compact.getButton(index).get(0).getBoundingClientRect().height,
            }
        };

        this.appointmentPopup = {
            getPopup: () => $('.dx-overlay-wrapper.dx-scheduler-appointment-popup'),
            hasVerticalScroll: () => {
                const scrollableContainer = this.appointmentPopup.getPopup().find('.dx-scrollable-container').get(0);
                return scrollableContainer.scrollHeight > scrollableContainer.clientHeight;
            },
            getPopupInstance: () => $('.dx-scheduler-appointment-popup.dx-widget').dxPopup('instance'),
            isVisible: () => this.appointmentPopup.getPopup().length !== 0,
            hide: () => this.appointmentPopup.getPopup().find('.dx-closebutton.dx-button').trigger('dxclick'),
            setInitialPopupSize: (size) => {
                const popupConfig = this.instance._popupConfig;
                this.instance._popupConfig = appointmentData => {
                    const config = popupConfig.call(this.instance, appointmentData);
                    return extend(config, size);
                };
            },
            setPopupWidth: width => this.appointmentPopup.getPopupInstance().option('width', width),
            getToolbarElementByLocation: location => {
                const toolbarName = location === TOOLBAR_TOP_LOCATION ? 'title' : TOOLBAR_BOTTOM_LOCATION;
                return this.appointmentPopup.getPopup().find(`.dx-toolbar.dx-widget.dx-popup-${toolbarName}`);
            },
            hasToolbarButtonsInSection: (toolBarLocation, sectionName, buttonNames) => {
                const $toolbar = this.appointmentPopup.getToolbarElementByLocation(toolBarLocation);
                const $buttons = $toolbar.find(`.dx-toolbar-${sectionName} .dx-button`);
                return buttonNames.every((name, index) => $buttons.eq(index).hasClass(`dx-popup-${name}`));
            },
            getDoneButton: () => this.appointmentPopup.getPopup().find('.dx-popup-done'),
            clickDoneButton: () => this.appointmentPopup.getDoneButton().trigger('dxclick')
        };

        this.appointmentForm = {
            getFormInstance: () => this.appointmentPopup.getPopup().find('.dx-form').dxForm('instance'),
            getEditor: name => this.appointmentForm.getFormInstance().getEditor(name),
            setSubject: (value) => this.appointmentForm.getEditor('text').option('value', value),

            hasFormSingleColumn: () => this.appointmentPopup.getPopup().find('.dx-responsivebox').hasClass('dx-responsivebox-screen-xs'),
            getRecurrentAppointmentFormDialogButtons: () => $('.dx-dialog-buttons .dx-button'),
            clickFormDialogButton: (index = 0) => this.appointmentForm.getRecurrentAppointmentFormDialogButtons().eq(index).trigger('dxclick'),
        };

        this.workSpace = {
            getWorkSpace: () => $('.dx-scheduler-work-space'),
            getDateTableScrollable: () => $('.dx-scheduler-date-table-scrollable'),
            getDateTable: () => $('.dx-scheduler-date-table'),
            getDateTableHeight: () => this.workSpace.getDateTable().height(),

            getRows: (index = 0) => $('.dx-scheduler-date-table-row').eq(index),
            getCells: () => $('.dx-scheduler-date-table-cell'),
            getCell: (rowIndex, cellIndex) => {
                if(cellIndex !== undefined) {
                    return $('.dx-scheduler-date-table-row').eq(rowIndex).find('.dx-scheduler-date-table-cell').eq(cellIndex);
                }
                return this.workSpace.getCells().eq(rowIndex);
            },

            getAllDayCells: () => $('.dx-scheduler-all-day-table-cell'),
            getAllDayCell: (index) => this.workSpace.getAllDayCells().eq(index),
            getCellWidth: () => this.workSpace.getCells().eq(0).outerWidth(),
            getCellHeight: () => this.workSpace.getCells().eq(0).outerHeight(),
            getAllDayCellWidth: () => this.workSpace.getAllDayCells().eq(0).outerWidth(),
            getAllDayCellHeight: () => this.workSpace.getAllDayCells().eq(0).outerHeight(),
            getCurrentTimeIndicator: () => $('.dx-scheduler-date-time-indicator'),
        };

        this.navigator = {
            getNavigator: () => $('.dx-scheduler-navigator'),
            getCaption: () => $('.dx-scheduler-navigator').find('.dx-scheduler-navigator-caption').text(),
            clickOnPrevButton: () => {
                this.navigator.getNavigator().find('.dx-scheduler-navigator-previous').trigger('dxclick');
            },
            clickOnNextButton: () => {
                this.navigator.getNavigator().find('.dx-scheduler-navigator-next').trigger('dxclick');
            }
        },

        this.header = {
            get: () => $('.dx-scheduler-header-panel')
        },

        this.grouping = {
            getGroupHeaders: () => $('.dx-scheduler-group-header'),
            getGroupHeader: (index = 0) => this.grouping.getGroupHeaders().eq(index),
            getGroupHeaderHeight: () => this.grouping.getGroupHeader(0).outerHeight(),
            getGroupTable: () => $('.dx-scheduler-group-table'),
            getGroupTableHeight: () => this.grouping.getGroupTable().height()
        };
    }

    option(name, value) {
        this.instance.option(name, value);
    }

    isAdaptivity() {
        return this.instance.option('adaptivityEnabled');
    }

    drawControl() {
        $(`#${TEST_ROOT_ELEMENT_ID}`).css('top', 0);
        $(`#${TEST_ROOT_ELEMENT_ID}`).css('left', 0);
    }
}
