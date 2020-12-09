import $ from 'jquery';
import { locate } from 'animation/translator';
import devices from 'core/devices';

import 'common.css!';
import 'generic_light.css!';
import 'ui/scheduler/ui.scheduler';

export const TOOLBAR_TOP_LOCATION = 'top';
export const TOOLBAR_BOTTOM_LOCATION = 'bottom';

const SCHEDULER_ID = 'scheduler';
const TEST_ROOT_ELEMENT_ID = 'qunit-fixture';

export const CLASSES = {
    root: '.dx-scheduler',

    header: '.dx-scheduler-header-panel',
    navigator: '.dx-scheduler-navigator',
    navigatorCaption: '.dx-scheduler-navigator-caption',
    navigatorPrevButton: '.dx-scheduler-navigator-previous',
    navigatorNextButton: '.dx-scheduler-navigator-next',
    navigatorPopover: '.dx-scheduler-navigator-calendar-popover',
    navigatorPopoverContent: '.dx-scheduler-navigator-calendar-popover > .dx-overlay-content',
    scrollableAppointmentsContainer: '.dx-scheduler-scrollable-appointments',
    schedulerSmall: '.dx-scheduler-small',

    calendar: 'dx-scheduler-navigator-calendar',
    calendarToday: '.dx-calendar-today',
    calendarSelected: '.dx-calendar-selected-date',

    dateTableCell: '.dx-scheduler-date-table-cell',
    allDayTableCell: '.dx-scheduler-all-day-table-cell',

    appointment: '.dx-scheduler-appointment',
    appointmentDragSource: '.dx-scheduler-appointment-drag-source',

    resizableHandle: {
        left: '.dx-resizable-handle-left',
        right: '.dx-resizable-handle-right'
    }
};

export const initTestMarkup = () => $(`#${TEST_ROOT_ELEMENT_ID}`).html(`<div id="${SCHEDULER_ID}"><div data-options="dxTemplate: { name: 'template' }">Task Template</div></div>`);

export const createWrapper = (option) => new SchedulerTestWrapper($(`#${SCHEDULER_ID}`).dxScheduler(option).dxScheduler('instance'));

export const isDesktopEnvironment = () => devices.real().deviceType === 'desktop';
const isMACEnvironment = () => devices.real().mac;

export const checkResultByDeviceType = (assert, callback) => {
    if(isDesktopEnvironment() && !isMACEnvironment()) {
        callback();
    } else {
        const done = assert.async();
        setTimeout(() => {
            callback();
            done();
        });
    }
};

export const asyncWrapper = (assert, callback) => {
    const done = assert.async();
    const promise = Promise.resolve();

    return callback(promise)
        .catch(e => assert.ok(false, e.stack))
        .then(done);
};

export const execAsync = (promise, beforeAsyncCallback, asyncCallback, timeout) => {
    return promise.then(() => {
        return new Promise((resolve, reject) => {
            const execCallback = func => {
                try {
                    func();
                } catch(e) {
                    reject(e);
                }
            };

            beforeAsyncCallback && execCallback(beforeAsyncCallback);

            setTimeout(() => {
                execCallback(asyncCallback);
                resolve();
            }, timeout);
        });
    });
};

export const asyncScrollTest = (promise, beforeAsyncCallback, asyncCallback) => {
    const scrollTimeout = 20;
    return execAsync(promise, beforeAsyncCallback, asyncCallback, scrollTimeout);
};

class ElementWrapper {
    constructor(selector, parent) {
        this.selector = selector;
        this.parent = parent;
    }

    getElement() {
        if(this.parent) {
            return this.parent.find(this.selector);
        }
        return $(this.selector);
    }
}

class ClickElementWrapper extends ElementWrapper {
    click() {
        this.getElement().trigger('dxclick');
    }
}

class NavigatorCaption extends ClickElementWrapper {
    constructor(parent) {
        super(CLASSES.navigatorCaption, parent);
    }

    getText() {
        return this.getElement().text();
    }
}

class CalendarCell extends ClickElementWrapper {
    get value() {
        return parseInt(this.getElement().find('span').eq(0).text());
    }
}

class Calendar extends ElementWrapper {
    constructor() {
        super(CLASSES.calendar);
    }

    get today() {
        return new CalendarCell(CLASSES.calendarToday);
    }

    get selected() {
        return new CalendarCell(CLASSES.calendarSelected);
    }
}

class NavigatorPopover extends ElementWrapper {
    get isVisible() {
        return this.content.getElement().is(':visible');
    }

    get calendar() {
        return new Calendar();
    }

    get content() {
        return new ElementWrapper(CLASSES.navigatorPopoverContent);
    }

    get hasScroll() {
        return this.content.getElement().find('.dx-scrollable').length > 0;
    }
}

class NavigatorWrapper extends ElementWrapper {
    constructor() {
        super(CLASSES.navigator);
    }

    get caption() {
        return new NavigatorCaption(this.getElement());
    }

    get prevButton() {
        return new ClickElementWrapper(CLASSES.navigatorPrevButton);
    }

    get nextButton() {
        return new ClickElementWrapper(CLASSES.navigatorNextButton);
    }

    get popover() {
        return new NavigatorPopover(CLASSES.navigatorPopover);
    }
}

class HeaderWrapper extends ElementWrapper {
    constructor() {
        super(CLASSES.header);
    }

    get navigator() {
        return new NavigatorWrapper();
    }
}

export class SchedulerTestWrapper extends ElementWrapper {
    constructor(instance) {
        super(`#${SCHEDULER_ID}`);
        this.instance = instance;

        this.timePanel = {
            getElement: () => {
                return $('.dx-scheduler-time-panel');
            },
            getTimeValues: () => {
                const cellClassName = this.instance.option('currentView').indexOf('timeline') > -1 ?
                    '.dx-scheduler-header-panel-cell' : '.dx-scheduler-time-panel-cell > div';

                return $(cellClassName).not('.dx-scheduler-header-panel-week-cell').map((i, el) => $(el).text());
            }
        },

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
            getDateText: (index = 0) => {
                let result = '';

                const appointment = this.appointments.getAppointment(index);
                appointment.find('.dx-scheduler-appointment-content-date').each((index, element) => {
                    result += element.innerHTML;
                });

                return result;
            },
            getAppointmentWidth: (index = 0) => this.appointments.getAppointment(index).get(0).getBoundingClientRect().width,
            getAppointmentHeight: (index = 0) => this.appointments.getAppointment(index).get(0).getBoundingClientRect().height,
            getAppointmentPosition: (index = 0) => locate($(this.appointments.getAppointment(index))),

            getDragSource: () => this.appointments
                .getAppointments()
                .filter(CLASSES.appointmentDragSource),

            getFakeAppointment: () => $('.dx-scheduler-fixed-appointments .dx-scheduler-appointment'),
            getFakeAppointmentWrapper: () => this.appointments.getFakeAppointment().parent(),

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
                getButtonWidth: (index = 0) => this.appointments.compact.getButton(index).get(0).getBoundingClientRect().width,
                getButtonHeight: (index = 0) => this.appointments.compact.getButton(index).get(0).getBoundingClientRect().height,

                click: (index = 0) => this.appointments.compact.getButton(index).trigger('dxclick'),

                getAppointment: (index = 0) => $('.dx-list-item').eq(index),
            },
        };

        this.appointmentPopup = {
            form: {
                getSubjectTextBox: () => {
                    const subjectElement = this.appointmentPopup.getPopup().find('.dx-textbox').eq(0);
                    return subjectElement.dxTextBox('instance');
                },
                setSubject: (text) => {
                    const textBox = this.appointmentPopup.form.getSubjectTextBox();
                    textBox.option('value', text);
                },
                getSubject: () => {
                    const textBox = this.appointmentPopup.form.getSubjectTextBox();
                    return textBox.option('value');
                },
                isRecurrenceEditorVisible: () => $('.dx-recurrence-editor-container').is(':visible')
            },

            dialog: {
                clickEditSeries: () => $('.dx-dialog').find('.dx-dialog-button').eq(0).trigger('dxclick'),
                clickEditAppointment: () => $('.dx-dialog').find('.dx-dialog-button').eq(1).trigger('dxclick'),
                hide: () => $('.dx-dialog').find('.dx-closebutton.dx-button').trigger('dxclick')
            },

            getPopup: () => $('.dx-overlay-wrapper.dx-scheduler-appointment-popup'),
            getPopupTitleElement: () => this.appointmentPopup.getPopup().find('.dx-popup-title'),
            hasVerticalScroll: () => {
                const scrollableContainer = this.appointmentPopup.getPopup().find('.dx-scrollable-container').get(0);
                return scrollableContainer.scrollHeight > scrollableContainer.clientHeight;
            },
            getPopupInstance: () => $('.dx-scheduler-appointment-popup.dx-widget').dxPopup('instance'),
            isVisible: () => this.appointmentPopup.getPopup().length !== 0,
            setPopupHeight: height => this.appointmentPopup.getPopupInstance().option('height', height),
            getToolbarElementByLocation: location => {
                const toolbarName = location === TOOLBAR_TOP_LOCATION ? 'title' : TOOLBAR_BOTTOM_LOCATION;
                return this.appointmentPopup.getPopup().find(`.dx-toolbar.dx-widget.dx-popup-${toolbarName}`);
            },
            hasToolbarButtonsInSection: (toolBarLocation, sectionName, buttonNames) => {
                const $toolbar = this.appointmentPopup.getToolbarElementByLocation(toolBarLocation);
                const $buttons = $toolbar.find(`.dx-toolbar-${sectionName} .dx-button`);
                return buttonNames.every((name, index) => $buttons.eq(index).hasClass(`dx-popup-${name}`));
            },

            getDoneButton: () => this.appointmentPopup.getPopup().find('.dx-button.dx-popup-done'),
            clickDoneButton: () => this.appointmentPopup.getDoneButton().trigger('dxclick'),

            getCancelButton: () => this.appointmentPopup.getPopup().find('.dx-popup-cancel'),
            clickCancelButton: () => this.appointmentPopup.getCancelButton().trigger('dxclick'),
            saveAppointmentData: () => this.instance._appointmentPopup.saveEditData.call(this.instance._appointmentPopup),

            hasLoadPanel: () => this.appointmentPopup.getPopup().find('.dx-loadpanel').length !== 0,

            getInstance: () => this.instance._appointmentPopup
        };

        this.appointmentForm = {
            getFormInstance: () => this.appointmentPopup.getPopup().find('.dx-form').dxForm('instance'),
            getEditor: name => this.appointmentForm.getFormInstance().getEditor(name),
            setSubject: (value, fieldName = 'text') => this.appointmentForm.getEditor(fieldName).option('value', value),
            setStartDate: (value) => this.appointmentForm.getEditor('startDate').option('value', value),
            setEndDate: (value) => this.appointmentForm.getEditor('endDate').option('value', value),

            hasFormSingleColumn: () => $('.dx-responsivebox').first().hasClass('dx-responsivebox-screen-xs'),
            getRecurrentAppointmentFormDialogButtons: () => $('.dx-dialog-buttons .dx-button'),
            clickFormDialogButton: (index = 0) => this.appointmentForm.getRecurrentAppointmentFormDialogButtons().eq(index).trigger('dxclick'),
            getPendingEditorsCount: () => $(this.appointmentForm.getFormInstance().element()).find('.dx-validation-pending').length,
            getInvalidEditorsCount: () => $(this.appointmentForm.getFormInstance().element()).find('.dx-invalid').length
        };

        this.workSpace = {
            getWorkSpace: () => $('.dx-scheduler-work-space'),

            getMonthCurrentDay: () => parseInt($('.dx-scheduler-date-table-current-date > div').text()),
            getWeekCurrentDay: () => {
                const value = $('.dx-scheduler-header-panel-current-time-cell').text();
                return parseInt(value.replace(/^\D+/g, ''));
            },

            getDateTableScrollable: () => $('.dx-scheduler-date-table-scrollable'),
            getHeaderScrollable: () => $('.dx-scheduler-header-scrollable'),
            getSideBarScrollable: () => $('.dx-scheduler-sidebar-scrollable'),

            getDateTable: () => $('.dx-scheduler-date-table'),
            getDateTableHeight: () => this.workSpace.getDateTable().height(),

            getRowCount: () => $('.dx-scheduler-date-table-row').length,
            getRows: (index = 0) => $('.dx-scheduler-date-table-row').eq(index),
            getCells: () => $(CLASSES.dateTableCell),
            getSelectedCells: () => this.workSpace.getCells().filter('.dx-state-focused'),
            getFocusedCell: () => this.workSpace.getCells().filter('.dx-scheduler-focused-cell'),
            getCell: (rowIndex, cellIndex) => {
                if(cellIndex !== undefined) {
                    return $('.dx-scheduler-date-table-row').eq(rowIndex).find(CLASSES.dateTableCell).eq(cellIndex);
                }
                return this.workSpace.getCells().eq(rowIndex);
            },
            getCellPosition: (rowIndex, cellIndex) => this.workSpace.getCell(rowIndex, cellIndex).position(),
            getCellWorkspaceRect: (rowIndex, cellIndex) => {
                const cell = this.workSpace.getCell(rowIndex, cellIndex);
                const cellPosition = cell.position();
                const rect = { };

                rect.top = cellPosition.top;
                rect.left = cellPosition.left;
                rect.height = cell.outerHeight();
                rect.width = cell.outerWidth();

                if(this.instance.option('currentView') === 'month') {
                    const monthNum = cell.find('div').eq(0);
                    if(monthNum.length > 0) {
                        rect.top += monthNum.outerHeight();
                        rect.height -= monthNum.outerHeight();
                    }
                }

                return rect;
            },
            getAllDayCells: () => $('.dx-scheduler-all-day-table-cell'),
            getAllDayCell: (index) => this.workSpace.getAllDayCells().eq(index),
            getCellWidth: () => this.workSpace.getCells().eq(0).outerWidth(),
            getCellHeight: () => this.workSpace.getCells().eq(0).outerHeight(),
            getAllDayCellWidth: () => this.workSpace.getAllDayCells().eq(0).outerWidth(),
            getAllDayCellHeight: () => this.workSpace.getAllDayCells().eq(0).outerHeight(),
            getCurrentTimeIndicator: () => $('.dx-scheduler-date-time-indicator'),
            getAllDayPanel: () => $('.dx-scheduler-all-day-panel'),

            getDataTableScrollableContainer: () => this.workSpace.getDateTableScrollable().find('.dx-scrollable-container'),
            getScrollPosition: () => {
                const element = this.workSpace.getDataTableScrollableContainer();
                return { left: element.scrollLeft(), top: element.scrollTop() };
            },
            getScrollable: () => $('.dx-scheduler-date-table-scrollable').dxScrollable('instance'),
            groups: {
                getGroupsContainer: () => $('.dx-scheduler-group-flex-container'),
                getGroup: (index = 0) => $('.dx-scheduler-group-row').eq(index),
                getGroupHeaders: (index) => this.workSpace.groups.getGroup(index).find('.dx-scheduler-group-header'),
                getGroupHeader: (index, groupRow = 0) => this.workSpace.groups.getGroupHeaders(groupRow).eq(index),
            },
            clickCell: (rowIndex, cellIndex) => this.workSpace.getCell(rowIndex, cellIndex).trigger('dxclick')
        };

        this.viewSwitcher = {
            getElement: () => $('.dx-dropdownmenu-popup-wrapper.dx-position-bottom'),
            show: () => {
                $('.dx-scheduler-view-switcher').trigger('dxclick');
            },
            click: (name) => {
                this.viewSwitcher.getElement().find('.dx-list-item').filter((index, element) => {
                    return $(element).find('.dx-dropdownmenu-item-text').text() === name;
                }).trigger('dxclick');
            },
            getSelectedViewName: () => {
                return this.viewSwitcher.getElement().find('.dx-list-item-selected .dx-dropdownmenu-item-text').text();
            },
            getLabel: () => $('.dx-scheduler-view-switcher-label')
        },

        this.grouping = {
            getGroupHeaders: () => $('.dx-scheduler-group-header'),
            getGroupHeader: (index = 0) => this.grouping.getGroupHeaders().eq(index),
            getGroupHeaderHeight: () => this.grouping.getGroupHeader(0).outerHeight(),
            getGroupHeaderContents: () => $('.dx-scheduler-group-header-content'),
            getGroupHeaderContentCount: () => this.grouping.getGroupHeaderContents().length,
            getGroupHeaderContent: (index = 0) => this.grouping.getGroupHeaderContents().eq(index),
            getGroupHeaderContentHeight: (index = 0) => this.grouping.getGroupHeaderContent(index).outerHeight(),
            getGroupTable: () => $('.dx-scheduler-group-table'),
            getGroupTableHeight: () => this.grouping.getGroupTable().height()
        };
    }

    get header() {
        return new HeaderWrapper();
    }

    option(name, value) {
        if(value === undefined) {
            return this.instance.option(name);
        }
        this.instance.option(name, value);
    }

    isAdaptivity() {
        return this.instance.option('adaptivityEnabled');
    }

    drawControl() {
        $(`#${TEST_ROOT_ELEMENT_ID}`).css('top', 0);
        $(`#${TEST_ROOT_ELEMENT_ID}`).css('left', 0);
    }

    hideControl() {
        $(`#${TEST_ROOT_ELEMENT_ID}`).css('top', '');
        $(`#${TEST_ROOT_ELEMENT_ID}`).css('left', '');
    }

    get isDesktop() {
        return isDesktopEnvironment();
    }
}
