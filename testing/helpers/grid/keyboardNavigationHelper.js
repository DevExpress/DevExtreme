import $ from 'jquery';
import devices from 'core/devices';
import eventUtils from 'events/utils';
import {
    setupDataGridModules,
    MockDataController,
    MockColumnsController,
    MockSelectionController } from '../dataGridMocks.js';
import pointerEvents from 'events/pointer';
import DataGridWrapper from '../wrappers/dataGridWrappers.js';

export const dataGridWrapper = new DataGridWrapper('#container');

export function setupModules(that, modulesOptions, gridModules) {
    const defaultSetCellValue = function(data, value) {
        if(this.serializeValue) {
            value = this.serializeValue(value);
        }
        data[this.dataField] = value;
    };

    that.columns = that.columns || [
        { caption: 'Column 1', visible: true, allowEditing: true, dataField: 'Column1', calculateCellValue: function(data) { return data.Column1; }, setCellValue: defaultSetCellValue },
        { caption: 'Column 2', visible: true, allowEditing: true, dataField: 'Column2', setCellValue: defaultSetCellValue },
        { caption: 'Column 3', visible: true, allowEditing: true, dataField: 'Column3', setCellValue: defaultSetCellValue },
        { caption: 'Column 4', visible: true, allowEditing: true, dataField: 'Column4', setCellValue: defaultSetCellValue }
    ];

    that.options = $.extend(true, { tabIndex: 0 }, that.options, {
        keyboardNavigation: {
            enabled: true,
            enterKeyAction: 'startEdit',
            enterKeyDirection: 'none',
            editOnKeyPress: false
        },
        editing: { },
        showColumnHeaders: true
    });

    that.$element = function() {
        return $('#container');
    };
    that.selectionOptions = {};
    that.dataControllerOptions = that.dataControllerOptions || {
        store: {
            update: function() { return $.Deferred().resolve(); },
            key: $.noop
        },
        pageCount: 10,
        pageIndex: 0,
        pageSize: 6,
        items: [
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 0, data: {} },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 1 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'detail', key: 2 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 3 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 4 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 5 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'group', data: {}, key: 6 },
            { values: ['test1', 'test2', 'test3', 'test4'], summaryCells: [{}, {}, {}, {}], rowType: 'groupFooter', key: 7 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 8 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 9 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'group', data: {}, key: 10 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'detail', key: 11 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'group', data: { isContinuation: true }, key: 12 }
        ]
    };

    gridModules = (gridModules || []).concat([
        'data', 'columns', 'editorFactory',
        'gridView', 'columnHeaders', 'rows', 'grouping',
        'headerPanel', 'search', 'editing', 'keyboardNavigation',
        'summary', 'masterDetail', 'virtualScrolling'
    ]);

    setupDataGridModules(that, gridModules, modulesOptions || {
        initViews: true,
        controllers: {
            selection: new MockSelectionController(that.selectionOptions),
            columns: new MockColumnsController(that.columns),
            data: new MockDataController(that.dataControllerOptions)
        }
    });
}

export const CLICK_EVENT = eventUtils.addNamespace(pointerEvents.up, 'dxDataGridKeyboardNavigation');
const device = devices.real();
const KEYS = {
    'tab': 'Tab',
    'enter': 'Enter',
    'escape': 'Escape',
    'pageUp': 'PageUp',
    'pageDown': 'PageDown',
    'leftArrow': 'ArrowLeft',
    'upArrow': 'ArrowUp',
    'rightArrow': 'ArrowRight',
    'downArrow': 'ArrowDown',
    'space': ' ',
    'F': 'F',
    'A': 'A',
    'D': 'D',
    '1': '1',
    '2': '2',
    'F2': 'F2'
};

export function testInDesktop(name, testFunc) {
    if(device.deviceType === 'desktop') {
        QUnit.testInActiveWindow(name, testFunc);
    }
}

export function triggerKeyDown(key, ctrl, shift, target, result) {
    result = result || {
        preventDefault: false,
        stopPropagation: false
    };
    let alt = false;
    if(typeof ctrl === 'object') {
        alt = ctrl.alt;
        shift = ctrl.shift;
        ctrl = ctrl.ctrl;
    }
    this.keyboardNavigationController._keyDownProcessor.process({
        key: KEYS[key] || key,
        keyName: key,
        ctrlKey: ctrl,
        shiftKey: shift,
        altKey: alt,
        target: target && target[0] || target,
        type: 'keydown',
        preventDefault: function() {
            result.preventDefault = true;
        },
        isDefaultPrevented: function() {
            return result.preventDefault;
        },
        stopPropagation: function() {
            result.stopPropagation = true;
        }
    });

    return result;
}

export function fireKeyDown($target, key, ctrlKey) {
    $target.trigger(eventUtils.createEvent('keydown', { target: $target.get(0), key: key, ctrlKey: ctrlKey }));
}

export function focusCell(columnIndex, rowIndex) {
    const $element0 = this.rowsView.element();
    const $row = $($element0.find('.dx-row')[rowIndex]);
    $($row.find('td')[columnIndex]).trigger(CLICK_EVENT);
}

export function getTextSelection(element) {
    const startPos = element.selectionStart;
    const endPos = element.selectionEnd;
    return element.value.substring(startPos, endPos);
}

export function callViewsRenderCompleted(views) {
    $.each(views, (_, view) => view.renderCompleted.fire());
}
