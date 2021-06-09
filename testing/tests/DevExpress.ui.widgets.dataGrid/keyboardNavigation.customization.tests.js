QUnit.testStart(function() {
    const markup = `
        <div>
            <div id="container" class="dx-datagrid"></div>
        </div>`;

    $('#qunit-fixture').html(markup);
});

import $ from 'jquery';

import 'generic_light.css!';

import 'ui/data_grid/ui.data_grid';

import browser from 'core/utils/browser';
import { setupDataGridModules } from '../../helpers/dataGridMocks.js';
import keyboardMock from '../../helpers/keyboardMock.js';
import {
    testInDesktop,
    triggerKeyDown,
    fireKeyDown,
    focusCell,
    dataGridWrapper,
    getTextSelection } from '../../helpers/grid/keyboardNavigationHelper.js';

QUnit.module('Customize keyboard navigation', {
    setupModule: function() {
        this.$element = () => $('#container');
        this.renderGridView = () => this.gridView.render($('#container'));
        this.triggerKeyDown = triggerKeyDown;
        this.focusCell = focusCell;
        this.focusFirstCell = () => this.focusCell(0, 0);

        this.data = this.data || [
            { name: 'Alex', date: '01/02/2003', room: 0, phone: 555555 },
            { name: 'Dan1', date: '04/05/2006', room: 1, phone: 666666 },
            { name: 'Dan2', date: '07/08/2009', room: 2, phone: 777777 },
            { name: 'Dan3', date: '10/11/2012', room: 3, phone: 888888 }
        ];
        this.columns = this.columns || [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            { dataField: 'room', dataType: 'number' },
            { dataField: 'phone', dataType: 'number' }
        ];
        this.options = $.extend(true, {
            keyboardNavigation: {
                enabled: true,
                enterKeyAction: 'startEdit',
                enterKeyDirection: 'none',
                editOnKeyPress: false
            },
            commonColumnSettings: {
                allowEditing: true
            },
            columns: this.columns,
            dataSource: this.data,
            editing: {
                allowUpdating: true
            }
        }, this.options);

        setupDataGridModules(this,
            ['data', 'columns', 'columnHeaders', 'rows', 'editorFactory', 'gridView', 'editing', 'editingRowBased', 'editingFormBased', 'editingCellBased', 'keyboardNavigation', 'validating', 'masterDetail', 'summary'],
            { initViews: true }
        );
    },
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.dispose && this.dispose();
        this.clock.restore();
    }
}, function() {
    testInDesktop('Editing navigation mode - arrow keys should operate with drop down if it is expanded', function(assert) {
        // arrange
        const rooms = [
            { id: 0, name: 'room0' },
            { id: 1, name: 'room1' },
            { id: 2, name: 'room2' },
            { id: 3, name: 'room3' },
            { id: 222, name: 'room222' }
        ];

        this.options = {
            editing: {
                mode: 'batch'
            },
            keyboardNavigation: {
                enterKeyDirection: 'column',
                editOnKeyPress: true
            }
        };
        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            {
                dataField: 'room',
                dataType: 'number',
                lookup: {
                    dataSource: rooms,
                    valueExpr: 'id',
                    displayExpr: 'name',
                    searchExpr: 'id'
                }
            },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.renderGridView();

        // assert
        assert.equal($('.dx-selectbox-popup').length, 0, 'no drop down');

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown('2');
        this.clock.tick(525);
        keyboardMock($(':focus')[0]).keyDown('downArrow');
        this.clock.tick();
        // assert
        assert.equal($('.dx-selectbox-popup').length, 1, 'drop down created');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, 'focusedCellPosition');
        keyboardMock($(':focus')[0]).keyDown('enter');

        this.triggerKeyDown('enter');
        this.clock.tick();

        let $input = $('.dx-row .dx-texteditor-container input').eq(0);
        assert.equal($input.length, 0, 'input');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 2 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '04/05/2006', room: 222, phone: 666666 }, 'row 1 data');

        // act
        this.triggerKeyDown('1');
        this.clock.tick(525);
        keyboardMock($(':focus')[0]).keyDown('downArrow');
        this.clock.tick();
        keyboardMock($(':focus')[0]).keyDown('enter');
        this.clock.tick();
        this.triggerKeyDown('upArrow');
        this.clock.tick();

        // arrange, assert
        $input = $('.dx-row .dx-texteditor-container input').eq(0);
        assert.equal($input.length, 0, 'input');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[2].data, { name: 'Dan2', date: '07/08/2009', room: 1, phone: 777777 }, 'row 2 data');
    });

    testInDesktop('Editing by char for not editable column', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'batch',
                fastEditingMode: true
            }
        };

        this.columns = [
            'name',
            {
                dataField: 'date',
                allowEditing: false
            },
            'room'
        ];

        this.setupModule();
        this.gridView.render($('#container'));

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown('1');
        this.clock.tick();

        // assert
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is editing by char key');
    });

    testInDesktop('Enter key if \'enterKeyAction\' is \'moveFocus\'', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell',
            },
            keyboardNavigation: {
                enterKeyAction: 'moveFocus'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'row is not in editing mode');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
    });

    testInDesktop('Enter key if \'enterKeyDirection\' is \'column\' and cell edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                enterKeyDirection: 'column'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'row is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, 'editing is completed');
    });

    testInDesktop('Enter+Shift key if \'enterKeyDirection\' is \'column\' and cell edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                enterKeyDirection: 'column'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick();
        this.triggerKeyDown('enter');
        this.clock.tick();
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 1, 'row is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');

        // act
        this.triggerKeyDown('enter', undefined, true);
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, 'editing is completed');
    });

    testInDesktop('Enter key if \'enterKeyDirection\' is row and cell edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                enterKeyDirection: 'row'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'row is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, 'editing is completed');
    });

    testInDesktop('Enter key if \'enterKeyDirection\' is row, rtlEnabled and cell edit mode', function(assert) {
        // arrange
        this.options = {
            rtlEnabled: true,
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                enterKeyDirection: 'row'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'row is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, 'editing is completed');
    });

    testInDesktop('Enter+Shift key if \'enterKeyDirection\' is row and cell edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell',
            },
            keyboardNavigation: {
                enterKeyDirection: 'row'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick();
        this.triggerKeyDown('enter');
        this.clock.tick();
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'row is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'focusedCellPosition');

        // act
        this.triggerKeyDown('enter', undefined, true);
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, 'editing is completed');
    });

    testInDesktop('Enter+Shift key if \'enterKeyDirection\' is row, rtlEnabled and cell edit mode', function(assert) {
        // arrange
        this.options = {
            rtlEnabled: true,
            editing: {
                mode: 'cell',
            },
            keyboardNavigation: {
                enterKeyDirection: 'row'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick();
        this.triggerKeyDown('enter');
        this.clock.tick();
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'row is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'focusedCellPosition');

        // act
        this.triggerKeyDown('enter', undefined, true);
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, 'editing is completed');
    });

    testInDesktop('Enter key if \'enterKeyDirection\' is \'column\' and batch edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'batch'
            },
            keyboardNavigation: {
                enterKeyDirection: 'column'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'row is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, 'editing is completed');
    });

    // T741572
    testInDesktop('Enter key if \'enterKeyDirection\' is \'column\' and batch edit mode if recalculateWhileEditing is enabled', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'batch'
            },
            keyboardNavigation: {
                enterKeyDirection: 'column'
            },
            summary: {
                recalculateWhileEditing: true
            },
            loadingTimeout: 0
        };
        this.setupModule();
        this.renderGridView();


        this.clock.tick();
        // act
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.$element().find('.dx-texteditor').dxTextBox('instance').option('value', 'test');

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'row is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');


        const changedSpy = sinon.spy();
        this.dataController.changed.add(changedSpy);

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(changedSpy.callCount, 2, 'changed count');
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
    });

    testInDesktop('Enter+Shift key if \'enterKeyDirection\' is \'column\' and batch edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'batch'
            },
            keyboardNavigation: {
                enterKeyDirection: 'column'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick();
        this.triggerKeyDown('enter');
        this.clock.tick();
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 1, 'row is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');

        // act
        this.triggerKeyDown('enter', undefined, true);
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, 'editing is completed');
    });

    testInDesktop('Enter key if \'enterKeyDirection\' is row and batch edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'batch'
            },
            keyboardNavigation: {
                enterKeyDirection: 'row'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'row is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, 'editing is completed');
    });

    testInDesktop('Enter+Shift key if \'enterKeyDirection\' is row and batch edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'batch',
            },
            keyboardNavigation: {
                enterKeyDirection: 'row'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick();
        this.triggerKeyDown('enter');
        this.clock.tick();
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'row is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'focusedCellPosition');

        // act
        this.triggerKeyDown('enter', undefined, true);
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, 'editing is completed');
    });

    testInDesktop('Enter key for not changed editing cell if \'editOnKeyPress\' and cell edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        this.focusFirstCell();
        this.editCell(0, 0);

        // assert
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is editing began by char key');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is editing began by char key');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
    });

    testInDesktop('Enter key for not changed editing cell if \'editOnKeyPress\' and batch edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'batch',
                allowUpdating: true
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        this.focusFirstCell();
        this.editCell(0, 0);

        // assert
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is editing began by char key');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is editing began by char key');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
    });

    testInDesktop('Enter key for changed editing cell if \'editOnKeyPress\' and cell edit mode', function(assert) {
        // arrange

        this.options = {
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.editCell(0, 0);

        // assert
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Editing navigation mode');

        const $input = $('.dx-row .dx-texteditor-input').eq(0);
        $input.val('Test');
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Editing navigation mode');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
    });

    testInDesktop('Enter key for changed editing cell if \'editOnKeyPress\' and batch edit mode', function(assert) {
        // arrange

        this.options = {
            editing: {
                mode: 'batch',
                allowUpdating: true,
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.editCell(0, 0);

        // assert
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Editing navigation mode');

        const $input = $('.dx-row .dx-texteditor-input').eq(0);
        $input.val('Test');
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Editing navigation mode');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
    });

    testInDesktop('F2 key and cell edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('F2');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is editing by char key');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');

        // act
        this.triggerKeyDown('F2');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is editing by char key');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
    });

    testInDesktop('F2 key and batch edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'batch'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('F2');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is editing by char key');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');

        // act
        this.triggerKeyDown('F2');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is editing by char key');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
    });

    testInDesktop('Press DELETE key if \'editOnKeyPress: true\', \'enterKeyDirection: column\' and cell edit mode', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyDirection: 'column',
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');

        // act
        this.triggerKeyDown('Delete');
        this.clock.tick(25);
        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'Alex', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Alex', 'editor value');
        assert.strictEqual($editor.find('.dx-texteditor-input').val(), '', 'input value');

        // act
        fireKeyDown($editor.find('.dx-texteditor-input'), 'Enter');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: '', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
    });

    testInDesktop('Press DELETE key if \'editOnKeyPress: true\', \'enterKeyDirection: column\' and batch edit mode', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'batch',
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyDirection: 'column',
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');

        // act
        this.triggerKeyDown('Delete');
        this.clock.tick(25);
        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'Alex', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Alex', 'editor value');
        assert.strictEqual($editor.find('.dx-texteditor-input').val(), '', 'input value');

        // act
        fireKeyDown($editor.find('.dx-texteditor-input'), 'Enter');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: '', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
    });

    testInDesktop('Press BACKSPACE key if \'editOnKeyPress: true\', \'enterKeyDirection: column\' and cell edit mode', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyDirection: 'column',
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');

        // act
        this.triggerKeyDown('Backspace');
        this.clock.tick(25);
        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'Alex', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Alex', 'editor value');
        assert.strictEqual($editor.find('.dx-texteditor-input').val(), '', 'input value');

        // act
        fireKeyDown($editor.find('.dx-texteditor-input'), 'Enter');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: '', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
    });

    testInDesktop('Press BACKSPACE key if \'editOnKeyPress: true\', \'enterKeyDirection: column\' and batch edit mode', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'batch',
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyDirection: 'column',
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');

        // act
        this.triggerKeyDown('Backspace');
        this.clock.tick(25);
        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'Alex', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Alex', 'editor value');
        assert.strictEqual($editor.find('.dx-texteditor-input').val(), '', 'input value');

        // act
        fireKeyDown($editor.find('.dx-texteditor-input'), 'Enter');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: '', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
    });

    testInDesktop('\'editOnKeyPress\', \'enterKeyDirection\' is column and cell edit mode', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyDirection: 'column',
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');

        // act
        this.triggerKeyDown('D');
        this.clock.tick(25);
        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'Alex', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Alex', 'editor value');
        assert.equal($editor.find('.dx-texteditor-input').val(), 'D', 'input value');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'D', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
    });

    testInDesktop('\'editOnKeyPress\', \'enterKeyDirection\' is row and cell edit mode', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                enterKeyDirection: 'row',
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');

        // act
        this.triggerKeyDown('D');
        this.clock.tick(25);
        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'Alex', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Alex', 'editor value');
        assert.equal($editor.find('.dx-texteditor-input').val(), 'D', 'input value');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'D', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
    });

    testInDesktop('\'editOnKeyPress\', \'enterKeyDirection\' is column and batch edit mode', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'batch',
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyDirection: 'column',
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');

        // act
        this.triggerKeyDown('D');
        this.clock.tick(25);
        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'Alex', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Alex', 'editor value');
        assert.equal($editor.find('.dx-texteditor-input').val(), 'D', 'input value');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'D', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
    });

    testInDesktop('\'editOnKeyPress\', \'enterKeyDirection\' is \'row\' and batch edit mode', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                enterKeyDirection: 'row',
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');

        // act
        this.triggerKeyDown('D');
        this.clock.tick(25);
        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'Alex', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Alex', 'editor value');
        assert.equal($editor.find('.dx-texteditor-input').val(), 'D', 'input value');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'D', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
    });

    testInDesktop('\'editOnKeyPress\', \'enterKeyDirection\' is row, \'rtlEnabled\' and cell edit mode', function(assert) {
        // arrange
        let $editor;

        this.options = {
            rtlEnabled: true,
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                enterKeyDirection: 'row',
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');

        // act
        this.triggerKeyDown('D');
        this.clock.tick(25);
        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'Alex', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Alex', 'editor value');
        assert.equal($editor.find('.dx-texteditor-input').val(), 'D', 'input value');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'D', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
    });

    testInDesktop('Do not begin editing by char key if \'editOnKeyPress\' is false', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');

        // act
        this.triggerKeyDown('D');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Editing navigation mode');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
    });

    testInDesktop('RightArrow key if \'keyboardNavigation.editOnKeyPress\' and editing has began by key press', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');

        // act
        this.triggerKeyDown('D');
        this.clock.tick(25);

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'Alex', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Alex', 'editor value');
        assert.equal($editor.find('.dx-texteditor-input').val(), 'D', 'input value');

        // act
        this.triggerKeyDown('rightArrow');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Editing navigation mode');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'D', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
    });

    testInDesktop('LeftArrow key if \'keyboardNavigation.editOnKeyPress\' and editing has began by key press', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(2, 1);

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');

        // act
        this.triggerKeyDown('2');
        this.clock.tick(25);

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '04/05/2006', room: 1, phone: 666666 }, 'data');
        assert.equal($editor.dxNumberBox('instance').option('value'), '1', 'editor value');
        assert.equal($editor.find('.dx-texteditor-input').val(), '2', 'input value');

        // act
        this.triggerKeyDown('leftArrow');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '04/05/2006', room: 2, phone: 666666 }, 'cell value');
    });

    testInDesktop('UpArrow key if \'keyboardNavigation.editOnKeyPress\' and editing has began by key press', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(0, 1);

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');

        // act
        this.triggerKeyDown('D');
        this.clock.tick(25);

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '04/05/2006', room: 1, phone: 666666 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Dan1', 'editor value');
        assert.equal($editor.find('.dx-texteditor-input').val(), 'D', 'input value');

        // act
        this.triggerKeyDown('upArrow');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'D', date: '04/05/2006', room: 1, phone: 666666 }, 'cell value');
    });

    testInDesktop('DownArrow key if \'keyboardNavigation.editOnKeyPress\' and editing has began by key press', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(0, 1);

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');

        // act
        this.triggerKeyDown('D');
        this.clock.tick(25);

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '04/05/2006', room: 1, phone: 666666 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Dan1', 'editor value');
        assert.equal($editor.find('.dx-texteditor-input').val(), 'D', 'input value');

        // act
        this.triggerKeyDown('downArrow');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 2 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'D', date: '04/05/2006', room: 1, phone: 666666 }, 'cell value');
    });

    testInDesktop('DownArrow key if \'keyboardNavigation.editOnKeyPress\' and editing began 2nd time by the key press', function(assert) {
        // arrange
        let $editor;

        // act
        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(0, 1);

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'cell is editing');

        // act
        this.triggerKeyDown('D');
        this.clock.tick(25);

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');

        // act
        this.triggerKeyDown('downArrow');
        this.clock.tick();
        this.triggerKeyDown('A');
        this.clock.tick(25);

        // arrange, assert
        $editor = $('.dx-texteditor').eq(0);
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._getVisibleEditRowIndex(), 2, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 2 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');

        this.triggerKeyDown('downArrow');
        this.clock.tick();

        // arrange, assert
        $editor = $('.dx-texteditor').eq(0);
        assert.equal($editor.length, 0, 'no editor');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 3 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');

        assert.deepEqual(this.getController('data').items()[1].data, { name: 'D', date: '04/05/2006', room: 1, phone: 666666 }, 'row 1 data');
        assert.deepEqual(this.getController('data').items()[2].data, { name: 'A', date: '07/08/2009', room: 2, phone: 777777 }, 'row 2 data');
    });

    testInDesktop('Editing navigation mode for a number cell if \'keyboardNavigation.editOnKeyPress\' and Up/Down arrow keys', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown('2');
        this.clock.tick(25);

        // arrange, assert
        let $input = $('.dx-row .dx-texteditor-input').eq(0);
        assert.equal(this.editingController._getVisibleEditRowIndex(), 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '04/05/2006', room: 1, phone: 666666 }, 'row 1 data');
        assert.deepEqual(this.getController('data').items()[2].data, { name: 'Dan2', date: '07/08/2009', room: 2, phone: 777777 }, 'row 2 data');
        assert.equal($input.val(), '2', 'input value');

        // act
        this.triggerKeyDown('downArrow');
        this.clock.tick();
        this.triggerKeyDown('1');
        this.clock.tick(25);

        // // arrange, assert
        $input = $('.dx-row .dx-texteditor-input').eq(0);
        assert.equal(this.editingController._getVisibleEditRowIndex(), 2, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 2 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '04/05/2006', room: 2, phone: 666666 }, 'row 1 data');
        assert.equal($input.val(), '1', 'input value');

        this.triggerKeyDown('upArrow');
        this.clock.tick();

        // arrange, assert
        $input = $('.dx-row .dx-texteditor-input').eq(0);
        assert.equal($input.length, 0, 'input');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[2].data, { name: 'Dan2', date: '07/08/2009', room: 1, phone: 777777 }, 'row 2 data');
    });

    // T742967
    testInDesktop('Editing start for a number cell with format if \'keyboardNavigation.editOnKeyPress\'', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };

        this.columns = [
            { dataField: 'name' },
            { dataField: 'room', dataType: 'number', editorOptions: { format: '$#0.00' } }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown('2');
        this.clock.tick(300);

        // arrange, assert
        const $input = $('.dx-row .dx-texteditor-input').eq(0);
        assert.equal($input.val(), '$2.00', 'input value');
        assert.equal($input.get(0).selectionStart, 2, 'caret start position');
        assert.equal($input.get(0).selectionEnd, 2, 'caret end position');
    });

    testInDesktop('Editing navigation mode for a number cell if \'keyboardNavigation.editOnKeyPress\' and Left/Right arrow keys exit', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown('2');
        this.clock.tick(25);

        // arrange, assert
        let $input = $('.dx-row .dx-texteditor-container input').eq(0);
        assert.equal(this.editingController._getVisibleEditRowIndex(), 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.equal($input.val(), '2', 'input value');

        // act
        this.triggerKeyDown('rightArrow');
        this.clock.tick();
        this.triggerKeyDown('1');
        this.clock.tick(25);

        // // arrange, assert
        $input = $('.dx-row .dx-texteditor-container input').eq(0);
        assert.equal(this.editingController._getVisibleEditRowIndex(), 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 3, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.equal($input.val(), '1', 'input value');

        this.triggerKeyDown('leftArrow');
        this.clock.tick();

        // arrange, assert
        $input = $('.dx-row .dx-texteditor-container input').eq(0);
        assert.equal($input.length, 0, 'input');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
    });

    testInDesktop('Editing navigation mode for a date cell if \'keyboardNavigation.editOnKeyPress\' and Up/Down arrow keys', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown('2');
        this.clock.tick(25);

        // arrange, assert
        let $input = $('.dx-texteditor-input').eq(0);
        assert.equal(this.editingController._getVisibleEditRowIndex(), 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.equal($input.val(), '2', 'input value');

        // act
        this.triggerKeyDown('downArrow');
        this.clock.tick();
        this.triggerKeyDown('1');
        this.clock.tick(25);

        // arrange, assert
        $input = $('.dx-texteditor-input').eq(0);
        assert.equal(this.editingController._getVisibleEditRowIndex(), 2, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 2 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.equal($input.val(), '1', 'input value');

        // act
        this.triggerKeyDown('upArrow');
        this.clock.tick();

        // arrange, assert
        $input = $('.dx-row .dx-numberbox .dx-texteditor-container input').eq(0);
        assert.equal($input.length, 0, 'input');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
    });

    testInDesktop('Editing navigation mode for a date cell if \'keyboardNavigation.editOnKeyPress\' and Left/Right arrow keys exit', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };

        this.setupModule();
        this.gridView.render($('#container'));

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown('2');
        this.clock.tick(25);

        // arrange, assert
        let $input = $('.dx-row .dx-texteditor-input').eq(0);
        assert.equal(this.editingController._getVisibleEditRowIndex(), 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.equal($input.val(), '2', 'input value');

        // act
        this.triggerKeyDown('rightArrow');
        this.clock.tick();
        this.triggerKeyDown('1');
        this.clock.tick(25);

        // // arrange, assert
        $input = $('.dx-row .dx-texteditor-input').eq(0);
        assert.equal(this.editingController._getVisibleEditRowIndex(), 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.equal($input.val(), '1', 'input value');

        this.triggerKeyDown('leftArrow');
        this.clock.tick();

        // arrange, assert
        $input = $('.dx-row .dx-texteditor-input').eq(0);
        assert.equal($input.length, 0, 'input');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
    });

    testInDesktop('Editing navigation mode for a date cell if \'useMaskBehavior\', \'keyboardNavigation.editOnKeyPress\' are set and \'cell\' edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                enterKeyDirection: 'column',
                editOnKeyPress: true
            }
        };

        this.columns = [
            { dataField: 'name' },
            {
                dataField: 'date',
                dataType: 'date',
                editorOptions: {
                    useMaskBehavior: true
                }
            },
            { dataField: 'room', dataType: 'number' },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.gridView.render($('#container'));

        // act
        this.focusCell(1, 1);
        assert.ok(true);

        this.triggerKeyDown('1');
        this.clock.tick();

        // arrange, assert
        let $input = $('.dx-texteditor-input').eq(0);
        assert.equal(this.editingController._getVisibleEditRowIndex(), 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.equal($input.val(), '1/5/2006', 'input value');

        // act
        fireKeyDown($input, 'Enter');
        this.clock.tick();

        // arrange, assert
        $input = $('.dx-texteditor-input').eq(0);
        assert.equal($input.length, 0, 'input');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 2 }, 'focusedCellPosition');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '2006/01/05', room: 1, phone: 666666 }, 'row 1 data');

        // act
        this.triggerKeyDown('2');
        this.clock.tick();
        $input = $('.dx-texteditor-input').eq(0);
        fireKeyDown($input, 'ArrowUp');
        this.clock.tick();

        $input = $('.dx-texteditor-input').eq(0);
        assert.equal($input.length, 0, 'input');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, 'focusedCellPosition');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '2006/01/05', room: 1, phone: 666666 }, 'row 1 data');
        assert.deepEqual(this.getController('data').items()[2].data, { name: 'Dan2', date: '2009/02/08', room: 2, phone: 777777 }, 'row 2 data');
    });

    testInDesktop('Editing navigation mode for a date cell if \'useMaskBehavior\', \'keyboardNavigation.editOnKeyPress\' are set and \'batch\' edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'batch'
            },
            keyboardNavigation: {
                enterKeyDirection: 'column',
                editOnKeyPress: true
            }
        };

        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date',
                editorOptions: {
                    useMaskBehavior: true
                }
            },
            { dataField: 'room', dataType: 'number' },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.gridView.render($('#container'));

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown('1');
        this.clock.tick();

        // arrange, assert
        let $input = $('.dx-texteditor-input').eq(0);
        assert.equal(this.editingController._getVisibleEditRowIndex(), 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.equal($input.val(), '1/5/2006', 'input value');

        // act
        fireKeyDown($input, 'Enter');
        this.clock.tick();

        // arrange, assert
        $input = $('.dx-texteditor-input').eq(0);
        assert.equal($input.length, 0, 'input');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 2 }, 'focusedCellPosition');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '2006/01/05', room: 1, phone: 666666 }, 'row 1 data');

        // act
        this.triggerKeyDown('2');
        this.clock.tick();
        $input = $('.dx-texteditor-input').eq(0);
        fireKeyDown($input, 'ArrowUp');
        this.clock.tick();

        $input = $('.dx-texteditor-input').eq(0);
        assert.equal($input.length, 0, 'input');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, 'focusedCellPosition');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '2006/01/05', room: 1, phone: 666666 }, 'row 1 data');
        assert.deepEqual(this.getController('data').items()[2].data, { name: 'Dan2', date: '2009/02/08', room: 2, phone: 777777 }, 'row 2 data');
    });

    testInDesktop('Editing navigation mode for a number cell if \'format\', \'keyboardNavigation.editOnKeyPress\' are set and \'cell\' edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                enterKeyDirection: 'column',
                editOnKeyPress: true
            }
        };
        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            {
                dataField: 'room',
                dataType: 'number',
                editorOptions: { format: '#_0.00' }
            },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown('2');
        this.clock.tick(25);

        // arrange, assert
        let $input = $('.dx-row .dx-texteditor-container input').eq(0);
        assert.equal(this.editingController._getVisibleEditRowIndex(), 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.equal($input.val(), '#_2.00', 'input value');

        // act
        this.triggerKeyDown('downArrow');
        this.clock.tick();
        this.triggerKeyDown('1');
        this.clock.tick(25);

        // // arrange, assert
        $input = $('.dx-row .dx-texteditor-container input').eq(0);
        assert.equal(this.editingController._getVisibleEditRowIndex(), 2, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 2 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.equal($input.val(), '#_1.00', 'input value');

        this.triggerKeyDown('upArrow');
        this.clock.tick();
        this.triggerKeyDown('upArrow');
        this.clock.tick();
        this.triggerKeyDown('1');
        this.clock.tick(25);

        // // arrange, assert
        $input = $('.dx-row .dx-texteditor-container input').eq(0);
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 0 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.equal($input.val(), '#_1.00', 'input value');

        this.triggerKeyDown('enter');
        this.clock.tick();

        // arrange, assert
        $input = $('.dx-row .dx-texteditor-container input').eq(0);
        assert.equal($input.length, 0, 'input');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'Alex', date: '01/02/2003', room: 1, phone: 555555 }, 'row 0 data');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '04/05/2006', room: 2, phone: 666666 }, 'row 1 data');
        assert.deepEqual(this.getController('data').items()[2].data, { name: 'Dan2', date: '07/08/2009', room: 1, phone: 777777 }, 'row 2 data');
    });

    testInDesktop('Input should have a correct value in fast editing mode in Microsoft Edge Browser (T808348)', function(assert) {
        // arrange
        const rowsViewWrapper = dataGridWrapper.rowsView;

        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.columns = [
            { dataField: 'name' }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(0, 0);
        this.triggerKeyDown('1');

        // arrange, assert
        const editor = rowsViewWrapper.getCell(0, 0).getEditor();
        const $input = editor.getInputElement();
        assert.equal($input.val(), 'Alex', 'input value has not changed');

        this.clock.tick(25);

        assert.equal($input.val(), '1', 'input value has changed after timeout');
    });

    testInDesktop('Select all text if editing mode is batch', function(assert) {
        // arrange
        const rooms = [
            { id: 0, name: 'room0' },
            { id: 1, name: 'room1' },
            { id: 2, name: 'room2' },
            { id: 3, name: 'room3' },
            { id: 222, name: 'room222' }
        ];
        let input;

        this.options = {
            editing: {
                mode: 'batch',
                selectTextOnEditStart: true
            }
        };
        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            {
                dataField: 'room',
                dataType: 'number',
                lookup: {
                    dataSource: rooms,
                    valueExpr: 'id',
                    displayExpr: 'name',
                    searchExpr: 'id'
                }
            },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(0, 1);
        this.triggerKeyDown('Enter');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Escape');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.notOk(input, 'Editor input');

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown('F2');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Escape');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.notOk(input, 'Editor input');

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown('F2');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');
    });

    // T744711
    testInDesktop('Select all text for editor with remote data source', function(assert) {
        // arrange
        const rooms = [
            { id: 0, name: 'room0' },
            { id: 1, name: 'room1' },
            { id: 2, name: 'room2' },
            { id: 3, name: 'room3' }
        ];

        this.options = {
            editing: {
                mode: 'batch',
                selectTextOnEditStart: true
            }
        };
        this.columns = [
            { dataField: 'name' },
            {
                dataField: 'room',
                lookup: {
                    dataSource: {
                        load: function() {
                            return rooms;
                        },
                        byKey: function(key) {
                            const d = $.Deferred();

                            setTimeout(function() {
                                d.resolve(rooms.filter(room => room.id === key)[0]);
                            }, 100);

                            return d.promise();
                        }
                    },
                    valueExpr: 'id',
                    displayExpr: 'name'
                }
            }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        $(this.getCellElement(0, 1)).focus().trigger('dxclick');

        // assert
        const input = $('.dx-texteditor-input').get(0);
        assert.equal(input.value, '', 'editor input value is empty');

        // act
        this.clock.tick(100);

        // assert
        assert.equal(input.value, 'room0', 'editor input value is not empty');
        assert.equal(getTextSelection(input), input.value, 'input value is selected');
    });

    // T916569
    testInDesktop('Not select all text if input is readonly', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'batch',
                selectTextOnEditStart: true
            }
        };
        this.columns = [{
            dataField: 'name',
            editorOptions: {
                readOnly: true
            }
        }];

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(0, 1);
        this.triggerKeyDown('Enter');
        this.clock.tick();

        // assert
        const $input = $('.dx-texteditor-input');

        assert.equal($input.length, 1, 'editor input');
        assert.ok($input.prop('readonly'), 'input is readonly');
        assert.equal(getTextSelection($input.get(0)), '', 'no selection');
    });

    testInDesktop('Not select all text if editing mode is batch', function(assert) {
        // arrange
        const rooms = [
            { id: 0, name: 'room0' },
            { id: 1, name: 'room1' },
            { id: 2, name: 'room2' },
            { id: 3, name: 'room3' },
            { id: 222, name: 'room222' }
        ];
        let input;

        this.options = {
            editing: {
                mode: 'batch'
            }
        };
        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            {
                dataField: 'room',
                dataType: 'number',
                lookup: {
                    dataSource: rooms,
                    valueExpr: 'id',
                    displayExpr: 'name',
                    searchExpr: 'id'
                }
            },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.renderGridView();

        // assert
        assert.equal($('.dx-selectbox-popup').length, 0, 'no drop down');

        // act
        this.focusCell(0, 1);
        this.triggerKeyDown('Enter');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Escape');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.notOk(input, 'Editor input');

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown('F2');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Escape');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.notOk(input, 'Editor input');

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown('F2');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');
    });

    testInDesktop('Select all text if editing mode is cell', function(assert) {
        // arrange
        const rooms = [
            { id: 0, name: 'room0' },
            { id: 1, name: 'room1' },
            { id: 2, name: 'room2' },
            { id: 3, name: 'room3' },
            { id: 222, name: 'room222' }
        ];
        let input;

        this.options = {
            editing: {
                mode: 'cell',
                selectTextOnEditStart: true
            }
        };
        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            {
                dataField: 'room',
                dataType: 'number',
                lookup: {
                    dataSource: rooms,
                    valueExpr: 'id',
                    displayExpr: 'name',
                    searchExpr: 'id'
                }
            },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.renderGridView();

        // assert
        assert.equal($('.dx-selectbox-popup').length, 0, 'no drop down');

        // act
        this.focusCell(0, 1);
        this.triggerKeyDown('Enter');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Escape');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.notOk(input, 'Editor input');

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown('F2');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Escape');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.notOk(input, 'Editor input');

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown('F2');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');
    });

    testInDesktop('Not select all text if editing mode is cell', function(assert) {
        // arrange
        const rooms = [
            { id: 0, name: 'room0' },
            { id: 1, name: 'room1' },
            { id: 2, name: 'room2' },
            { id: 3, name: 'room3' },
            { id: 222, name: 'room222' }
        ];
        let input;

        this.options = {
            editing: {
                mode: 'cell'
            }
        };
        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            {
                dataField: 'room',
                dataType: 'number',
                lookup: {
                    dataSource: rooms,
                    valueExpr: 'id',
                    displayExpr: 'name',
                    searchExpr: 'id'
                }
            },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.renderGridView();

        // assert
        assert.equal($('.dx-selectbox-popup').length, 0, 'no drop down');

        // act
        this.focusCell(0, 1);
        this.triggerKeyDown('Enter');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Escape');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.notOk(input, 'Editor input');

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown('F2');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Escape');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.notOk(input, 'Editor input');

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown('F2');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');
    });

    testInDesktop('Select all text if editing mode is form', function(assert) {
        // arrange
        const rooms = [
            { id: 0, name: 'room0' },
            { id: 1, name: 'room1' },
            { id: 2, name: 'room2' },
            { id: 3, name: 'room3' },
            { id: 222, name: 'room222' }
        ];
        let input;

        this.options = {
            editing: {
                mode: 'form',
                selectTextOnEditStart: true
            }
        };
        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            {
                dataField: 'room',
                dataType: 'number',
                lookup: {
                    dataSource: rooms,
                    valueExpr: 'id',
                    displayExpr: 'name',
                    searchExpr: 'id'
                }
            },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.renderGridView();
        this.keyboardNavigationController._focusedView = this.rowsView;

        // act
        this.editRow(1);
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');

        // act
        input = $('.dx-texteditor-input').get(1);
        $(input).focus();
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), '', 'Selection');

        // act
        this.triggerKeyDown('Tab', false, false, $(input).parent());
        input = $('.dx-texteditor-input').get(1);
        this.getController('editing')._focusEditingCell(null, $(input).parent());
        this.clock.tick();
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');

        // act
        input = $('.dx-texteditor-input').get(2);
        $(input).focus();
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), '', 'Selection');
    });

    testInDesktop('Not select all text if editing mode is form', function(assert) {
        // arrange
        const rooms = [
            { id: 0, name: 'room0' },
            { id: 1, name: 'room1' },
            { id: 2, name: 'room2' },
            { id: 3, name: 'room3' },
            { id: 222, name: 'room222' }
        ];
        let input;

        this.options = {
            editing: {
                mode: 'form'
            }
        };
        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            {
                dataField: 'room',
                dataType: 'number',
                lookup: {
                    dataSource: rooms,
                    valueExpr: 'id',
                    displayExpr: 'name',
                    searchExpr: 'id'
                }
            },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        this.editRow(1);
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');

        // act
        input = $('.dx-texteditor-input').get(1);
        $(input).focus();
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Tab', false, false, $(input).parent());
        input = $('.dx-texteditor-input').get(1);
        this.getController('editing')._focusEditingCell(null, $(input).parent());
        this.clock.tick();
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');

        // act
        input = $('.dx-texteditor-input').get(2);
        $(input).focus();
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');
    });

    testInDesktop('Select all text if editing mode is popup', function(assert) {
        // arrange
        const rooms = [
            { id: 0, name: 'room0' },
            { id: 1, name: 'room1' },
            { id: 2, name: 'room2' },
            { id: 3, name: 'room3' },
            { id: 222, name: 'room222' }
        ];
        let input;

        this.options = {
            editing: {
                mode: 'form',
                selectTextOnEditStart: true
            }
        };
        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            {
                dataField: 'room',
                dataType: 'number',
                lookup: {
                    dataSource: rooms,
                    valueExpr: 'id',
                    displayExpr: 'name',
                    searchExpr: 'id'
                }
            },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.renderGridView();
        this.keyboardNavigationController._focusedView = this.rowsView;

        // act
        this.editRow(1);
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');

        // act
        input = $('.dx-texteditor-input').get(1);
        $(input).focus();
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), '', 'Selection');

        // act
        this.triggerKeyDown('Tab', false, false, $(input).parent());
        input = $('.dx-texteditor-input').get(1);
        this.getController('editing')._focusEditingCell(null, $(input).parent());
        this.clock.tick();
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');

        // act
        input = $('.dx-texteditor-input').get(2);
        $(input).focus();
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), '', 'Selection');
    });

    testInDesktop('Not select all text if editing mode is popup', function(assert) {
        // arrange
        const rooms = [
            { id: 0, name: 'room0' },
            { id: 1, name: 'room1' },
            { id: 2, name: 'room2' },
            { id: 3, name: 'room3' },
            { id: 222, name: 'room222' }
        ];
        let input;

        this.options = {
            editing: {
                mode: 'form'
            }
        };
        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            {
                dataField: 'room',
                dataType: 'number',
                lookup: {
                    dataSource: rooms,
                    valueExpr: 'id',
                    displayExpr: 'name',
                    searchExpr: 'id'
                }
            },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        this.editRow(1);
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');

        // act
        input = $('.dx-texteditor-input').get(1);
        $(input).focus();
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Tab', false, false, $(input).parent());
        input = $('.dx-texteditor-input').get(1);
        this.getController('editing')._focusEditingCell(null, $(input).parent());
        this.clock.tick();
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');

        // act
        input = $('.dx-texteditor-input').get(2);
        $(input).focus();
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');
    });

    testInDesktop('Select all text if editOnKeyPress is true', function(assert) {
        // arrange
        const rooms = [
            { id: 0, name: 'room0' },
            { id: 1, name: 'room1' },
            { id: 2, name: 'room2' },
            { id: 3, name: 'room3' },
            { id: 222, name: 'room222' }
        ];
        let input;

        this.options = {
            editing: {
                mode: 'batch',
                selectTextOnEditStart: true
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            {
                dataField: 'room',
                dataType: 'number',
                lookup: {
                    dataSource: rooms,
                    valueExpr: 'id',
                    displayExpr: 'name',
                    searchExpr: 'id'
                }
            },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(0, 1);
        this.triggerKeyDown('A');
        this.clock.tick(100);
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Escape');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.notOk(input, 'Editor input');

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown('Enter');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Escape');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.notOk(input, 'Editor input');

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown('F2');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');
    });

    ['Batch', 'Cell'].forEach(mode => {
        testInDesktop(`${mode} - A cell should display only a single typed character (T882996)`, function(assert) {
            // arrange
            this.options = {
                keyboardNavigation: {
                    editOnKeyPress: true
                },
                editing: {
                    mode: mode.toLowerCase(),
                    allowUpdating: true,
                    startEditAction: 'dblClick'
                }
            };
            this.columns = ['name'];

            this.setupModule();
            this.renderGridView();

            // act
            this.focusCell(0, 0);
            this.triggerKeyDown('a');
            this.clock.tick();
            const $input = $('.dx-texteditor-input');

            // assert
            assert.equal($input.length, 1, 'Editor is rendered');

            // NOTE:
            // This is a hack to fix the issue, because Firefox triggers keypress, keyup and input events
            // even if an input is focused with a delay using a zero timeout.
            // That is why it is necessary to increase a timeout to 25 for Firefox
            if(browser.mozilla) {
                assert.notEqual($input.val(), 'a', 'entered value is not modified');

                this.clock.tick(25);
            }

            assert.strictEqual($input.val(), 'a', 'entered value is correct');
        });

        // T998365
        testInDesktop(`${mode} - Input value should not be duplicated for a number column with format when editOnKeyPress is enabled'`, function(assert) {
            // arrange
            this.options = {
                editing: {
                    mode: mode.toLowerCase(),
                    allowUpdating: true
                },
                keyboardNavigation: {
                    editOnKeyPress: true
                }
            };

            this.data = [{ name: 'Alex', room: 5 }];

            this.columns = [
                { dataField: 'name' },
                {
                    dataField: 'room',
                    dataType: 'number',
                    editorOptions: {
                        type: 'number',
                        format: {
                            precision: 1
                        }
                    }
                }
            ];

            this.setupModule();
            this.renderGridView();

            // act
            this.focusCell(1, 0);
            this.triggerKeyDown('5');
            this.clock.tick(300);

            // assert
            const $input = $('.dx-row .dx-texteditor-input').eq(0);
            assert.equal($input.val(), '5', 'input value');
        });
    });
});
