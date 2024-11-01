import $ from 'jquery';
import { locate } from 'common/core/animation/translator';
import devices from '__internal/core/m_devices';
import pointerMock from '../../helpers/pointerMock.js';
import dataUtils from 'core/element_data';
import Color from 'color';

import 'generic_light.css!';
import '__internal/scheduler/m_scheduler';
import 'ui/drop_down_button';

export const TOOLBAR_TOP_LOCATION = 'top';
export const TOOLBAR_BOTTOM_LOCATION = 'bottom';

const SCHEDULER_ID = 'scheduler';
const TEST_ROOT_ELEMENT_ID = 'qunit-fixture';

export const CLASSES = {
    root: '.dx-scheduler',

    button: '.dx-button',
    selected: '.dx-item-selected',

    header: '.dx-scheduler-header-panel',
    navigator: '.dx-scheduler-navigator',
    navigatorCaption: '.dx-scheduler-navigator-caption',
    navigatorPrevButton: '.dx-scheduler-navigator-previous',
    navigatorNextButton: '.dx-scheduler-navigator-next',
    navigatorPopover: '.dx-scheduler-navigator-calendar-popover',
    scrollableAppointmentsContainer: '.dx-scheduler-scrollable-appointments',
    schedulerSmall: '.dx-scheduler-small',
    viewSwitcher: '.dx-scheduler-view-switcher',
    viewSwitcherDropDownButton: '.dx-scheduler-view-switcher-dropdown-button',
    viewSwitcherDropDownButtonContent: '.dx-scheduler-view-switcher-dropdown-button-content',

    calendar: '.dx-scheduler-navigator-calendar',
    calendarToday: '.dx-calendar-today',
    calendarSelected: '.dx-calendar-selected-date',

    dateTableCell: '.dx-scheduler-date-table-cell',
    allDayTableCell: '.dx-scheduler-all-day-table-cell',
    timePanelCell: '.dx-scheduler-time-panel-cell',
    headerPanelCell: '.dx-scheduler-header-panel-cell',
    weekHeaderPanelCell: '.dx-scheduler-header-panel-week-cell',
    currentTimeCell: '.dx-scheduler-time-panel-current-time-cell',
    headerPanelCurrentTimeCell: '.dx-scheduler-header-panel-current-time-cell',
    selectedCell: '.dx-state-focused',
    focusedCell: '.dx-scheduler-focused-cell',
    virtualCell: '.dx-scheduler-virtual-cell',

    allDayTitle: '.dx-scheduler-all-day-title',
    verticalGroupPanel: '.dx-scheduler-work-space-vertical-group-table',

    shader: '.dx-scheduler-date-time-shader',

    appointment: '.dx-scheduler-appointment',
    appointmentDate: '.dx-scheduler-appointment-content-date',
    appointmentDragSource: '.dx-scheduler-appointment-drag-source',

    appointmentTitle: '.dx-scheduler-appointment-title',

    appointmentMarker: '.dx-scheduler-agenda-appointment-marker',

    resizableHandle: {
        left: '.dx-resizable-handle-left',
        right: '.dx-resizable-handle-right'
    },

    dialog: '.dx-dialog',
    popup: '.dx-popup',
};

export const supportedScrollingModes = ['standard', 'virtual'];

export const supportedViews = ['day', 'week', 'workWeek', 'month', 'timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];

export const initTestMarkup = () => $(`#${TEST_ROOT_ELEMENT_ID}`).html(`<div id="${SCHEDULER_ID}"><div data-options="dxTemplate: { name: 'template' }">Task Template</div></div>`);

export const createWrapper = (option, clock) => new SchedulerTestWrapper($(`#${SCHEDULER_ID}`).dxScheduler(option).dxScheduler('instance'), clock);

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

export const execAsync = (assert, promise, beforeAssertCallback, assertCallback, timeout) => {
    let timerId;

    return promise.then(() => {

        return new Promise((resolve, reject) => {

            const execCallback = (func) => {
                try {
                    func();
                } catch(e) {
                    assert.ok(false, e.message);
                    reject();
                }
            };

            beforeAssertCallback && execCallback(beforeAssertCallback);

            timerId = setTimeout(() => {
                execCallback(assertCallback);
                resolve();
            }, timeout);
        });
    }).catch(() => {
        clearTimeout(timerId);
    });
};

export const asyncScrollTest = (assert, promise, assertCallback, scrollable, offset, scrollTimeout = 100) => {
    const wrapper = () => {
        return execAsync(
            assert,
            promise,
            () => scrollable.scrollTo(offset),
            assertCallback,
            scrollTimeout
        ).catch(() => wrapper());
    };

    return wrapper();
};

export const asyncAssert = (assert, assertCallback, timeout) => {
    return asyncWrapper(assert, promise => {

        execAsync(assert, promise, null, assertCallback, timeout); // TODO shoud return promise from the execAsync

        return promise;
    });
};

class ElementWrapper {
    constructor(selector, parent, index = 0) {
        this.selector = selector;
        this.parent = parent;
        this.index = index;
    }

    getElement() {
        if(this.parent) {
            return this.parent.find(this.selector).eq(this.index);
        }
        return $(this.selector).eq(this.index);
    }

    getText() {
        return this.getElement().text();
    }

    hasClass(className) {
        return this.getElement().hasClass(className);
    }
}
class ClickElementWrapper extends ElementWrapper {
    click() {
        this.getElement().trigger('dxclick');
    }

    isDisabled() {
        return this.hasClass('dx-state-disabled');
    }
}

class AppointmentTitle extends ElementWrapper {
    constructor(parent) {
        super(CLASSES.appointmentTitle, parent, 0);
    }

    get text() {
        return this.getElement().text();
    }
}

class AppointmentMarker extends ElementWrapper {
    constructor(parent) {
        super(CLASSES.appointmentMarker, parent, 0);
    }

    get color() {
        return new Color(this.getElement().css('backgroundColor')).toHex();
    }
}

class Appointment extends ClickElementWrapper {
    constructor(parent, index, clock) {
        super(CLASSES.appointment, parent, index);
        this.clock = clock;
    }

    get rectangle() {
        const elementRect = this.getElement().get(0).getBoundingClientRect();

        return {
            x: elementRect.left,
            y: elementRect.top
        };
    }

    get position() {
        return this.getElement().position();
    }

    get date() { // TODO
        return this.getElement().find(CLASSES.appointmentDate).text();
    }

    get title() {
        return new AppointmentTitle(this.getElement());
    }

    get backgroundColor() {
        return new Color(this.getElement().css('backgroundColor')).toHex();
    }

    get marker() {
        return new AppointmentMarker(this.getElement());
    }

    get data() {
        const currentAppointment = this.getElement().get(0);
        return dataUtils.data(currentAppointment, 'dxItemData');
    }

    get drag() {
        return {
            toCell: cellNumber => {
                const cell = $(CLASSES.dateTableCell).eq(cellNumber).get(0);
                const cellRect = cell.getBoundingClientRect();
                const elementRect = this.getElement().get(0).getBoundingClientRect();

                const appointmentPos = {
                    x: elementRect.left + elementRect.width / 2,
                    y: elementRect.top + elementRect.height / 2
                };

                const cellPos = {
                    x: cellRect.left + cellRect.width / 2,
                    y: cellRect.top + cellRect.height / 2
                };

                const pointer = pointerMock(this.getElement()).start();
                pointer.down(appointmentPos.x, appointmentPos.y)
                    .move(cellPos.x - appointmentPos.x, cellPos.y - appointmentPos.y);
                pointer.up();
            }
        };
    }

    click() {
        this.getElement().trigger('dxclick');
        this.clock && this.clock.tick(300);
    }

    dbClick() {
        // const clock = sinon.useFakeTimers();
        this.getElement().trigger('dxdblclick');
        // clock.tick(300);
        // clock.restore();
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
        return this.getElement().is(':visible');
    }

    get calendar() {
        return new Calendar();
    }

    get hasScroll() {
        return $('.dx-scrollable').find('.dx-scheduler-navigator-calendar').length > 0;
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

    get calendarButton() {
        return new ClickElementWrapper(CLASSES.navigatorCaption);
    }

    get nextButton() {
        return new ClickElementWrapper(CLASSES.navigatorNextButton);
    }

    get popover() {
        return new NavigatorPopover(CLASSES.navigatorPopover);
    }
}

class ViewSwitcherWrapper extends ElementWrapper {
    constructor() {
        super(CLASSES.viewSwitcher);
    }

    get dropDownButton() {
        const dropDown = new ClickElementWrapper(CLASSES.viewSwitcherDropDownButton);

        return new ClickElementWrapper(CLASSES.button, dropDown.getElement());
    }

    get selectedButton() {
        return new ClickElementWrapper(CLASSES.selected);
    }

    click(name) {
        this.getButton(name).click();
    }

    getButton(name) {
        const parent = this.getElement();

        const buttons = parent.find('.dx-button');

        let result;
        buttons.each((index, button) => {
            if($(button).text() === name) {
                result = new ClickElementWrapper(CLASSES.button, parent, index);
                return false;
            }
        });

        return result;
    }
}

class HeaderWrapper extends ElementWrapper {
    constructor() {
        super(CLASSES.header);
    }

    get navigator() {
        return new NavigatorWrapper();
    }

    get viewSwitcher() {
        return new ViewSwitcherWrapper();
    }
}

export class SchedulerTestWrapper extends ElementWrapper {
    constructor(instance, clock) {
        super(`#${SCHEDULER_ID}`);
        this.instance = instance;
        this.clock = clock;

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

            click: (index = 0, isAsync = false) => {
                const click = () => this.appointments.getAppointment(index).trigger('dxclick');

                if(isAsync) {
                    click();
                } else {
                    click();

                    this.clock && this.clock.tick(300);
                }
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
                clickEditSeries: () => $(CLASSES.dialog).find('.dx-dialog-button').eq(0).trigger('dxclick'),
                clickEditAppointment: () => $(CLASSES.dialog).find('.dx-dialog-button').eq(1).trigger('dxclick'),
                hide: () => $(CLASSES.dialog).find('.dx-closebutton.dx-button').trigger('dxclick')
            },

            getPopup: () => $('.dx-overlay-wrapper.dx-scheduler-appointment-popup'),
            getRecurrenceDialog: () => $(`${CLASSES.dialog}${CLASSES.popup}`),
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
            saveAppointmentData: () => this.instance._appointmentPopup.saveEditDataAsync.call(this.instance._appointmentPopup),

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
            getSelectedCells: () => this.workSpace.getCells().filter(CLASSES.selectedCell),
            getFocusedCell: () => this.workSpace.getCells().filter(CLASSES.focusedCell),
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

                if(this.instance.currentView === 'month') {
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
            getTimePanelCells: () => $(CLASSES.timePanelCell),
            getVirtualCells: () => $(CLASSES.virtualCell),
            getOrdinaryHeaderPanelCells: () => $(`${CLASSES.headerPanelCell}:not(${CLASSES.weekHeaderPanelCell})`),
            getWeekDayHeaderPanelCells: () => $(`${CLASSES.weekHeaderPanelCell}`),
            getTimePanelCurrentTimeCells: () => $(CLASSES.currentTimeCell),
            getHeaderPanelCurrentTimeCells: () => $(CLASSES.headerPanelCurrentTimeCell),
            getCellWidth: () => this.workSpace.getCells().eq(0).outerWidth(),
            getCellHeight: () => this.workSpace.getCells().eq(0).outerHeight(),
            getAllDayCellWidth: () => this.workSpace.getAllDayCells().eq(0).outerWidth(),
            getAllDayCellHeight: () => this.workSpace.getAllDayCells().eq(0).outerHeight(),
            getCurrentTimeIndicator: () => $('.dx-scheduler-date-time-indicator'),
            getCurrentTimeIndicatorCount: () => this.workSpace.getCurrentTimeIndicator().length,
            getAllDayPanel: () => $('.dx-scheduler-all-day-panel'),
            getAllDayTitle: () => $(CLASSES.allDayTitle),

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
                getVerticalGroupPanel: () => $(CLASSES.verticalGroupPanel),
            },
            clickCell: (rowIndex, cellIndex) => this.workSpace.getCell(rowIndex, cellIndex).trigger('dxclick'),

            selectCells: (firstCellIndex, lastCellIndex) => {
                const firstCell = this.workSpace.getCell(firstCellIndex);
                const secondCell = this.workSpace.getCell(lastCellIndex);

                const { x: firstCellLeft, y: firstCellTop } = firstCell.offset();
                const { x: secondCellLeft, y: secondCellTop } = secondCell.offset();

                pointerMock(firstCell)
                    .start()
                    .down(firstCellLeft, firstCellTop);
                pointerMock(secondCell)
                    .move(secondCellLeft - firstCellLeft, secondCellTop - firstCellTop)
                    .up();
            },

            getShader: () => $(CLASSES.shader),
        };

        this.viewSwitcher = {
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

    get appointmentList() {
        const result = [];
        const length = this.getElement().find(CLASSES.appointment).length;

        for(let i = 0; i < length; i++) {
            result.push(new Appointment(this.getElement(), i, this.clock));
        }

        return result;
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
