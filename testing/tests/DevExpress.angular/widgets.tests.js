const $ = require('jquery');
const angular = require('angular');
const registerComponent = require('core/component_registrator');
const DOMComponent = require('core/dom_component');
const Widget = require('ui/widget/ui.widget');
const config = require('core/config');
const inflector = require('core/utils/inflector');
const fx = require('animation/fx');
const positionUtils = require('animation/position');
const ValidationGroup = require('ui/validation_group');

require('common.css!');
require('generic_light.css!');
require('integration/angular');

require('ui/accordion');
require('ui/box');
require('ui/data_grid');
require('ui/defer_rendering');
require('ui/menu');
require('ui/popup');
require('ui/popover');
require('ui/date_box');
require('ui/scheduler');
require('ui/slide_out_view');
require('ui/tabs');
require('ui/text_box');
require('ui/toolbar');

const FILTERING_TIMEOUT = 700;

fx.off = true;
const ignoreAngularBrowserDeferTimer = function(args) {
    return args.timerType === 'timeouts' && (args.callback.toString().indexOf('delete pendingDeferIds[timeoutId];') > -1 || args.callback.toString().indexOf('delete F[c];e(a)}') > -1);
};

const initMarkup = function($markup, controller, context) {
    context.testApp = angular.module('testApp', ['dx']);
    context.$fixtureElement = $('<div/>').attr('ng-app', 'testApp').appendTo('#qunit-fixture');
    context.$container = context.$fixtureElement;
    context.$controller = $('<div></div>')
        .attr('ng-controller', 'my-controller')
        .appendTo(context.$container);

    $markup.appendTo(context.$controller);
    context.testApp
        .factory('$exceptionHandler', function() {
            return function myExceptionHandler(exception, cause) {
                throw exception;
            };
        })
        .controller('my-controller', controller);

    angular.bootstrap(context.$container, ['testApp']);
};

QUnit.module('Widgets with async templates', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.originWrapActionsBeforeExecute = config().wrapActionsBeforeExecute;
        config({ wrapActionsBeforeExecute: true });
    },
    afterEach: function() {
        this.clock.restore();

        config({ wrapActionsBeforeExecute: this.originWrapActionsBeforeExecute });
    }
});

QUnit.test('dxPopup', function(assert) {
    const originalPositionSetup = positionUtils.setup;

    let contentHeight;

    positionUtils.setup = function($content, position) {
        contentHeight = $content.find('.dx-popup-content').height();

        originalPositionSetup($content, position);
    };

    const $markup = $('\
        <div dx-popup=\'popupOptions\'>\
            <div data-options=\'dxTemplate: { name: "custom" }\' style=\'line-height: 18px\'>\
                {{VeryVeryVeryLongField.value1}}\
                {{VeryVeryVeryLongField.value2}}\
            </div>\
        </div>\
    ');

    const controller = function($scope) {
        $scope.VeryVeryVeryLongField = {
            'value1': 'short',
            'value2': 'field'
        };

        $scope.popupOptions = {
            showTitle: false,
            animation: null,
            visible: true,
            contentTemplate: 'custom',
            maxWidth: 150,
            height: undefined,
            fullScreen: false,
            position: { of: window, offset: '0 0' }
        };
    };

    initMarkup($markup, controller, this);

    this.clock.tick();

    assert.roughEqual($('.dx-popup-content').height(), 18, 0.5);
    assert.equal(contentHeight, $('.dx-popup-content').height());

    positionUtils.setup = originalPositionSetup;
});

QUnit.test('dxPopover', function(assert) {
    const $markup = $('\
        <a id="link1">testLink</a>\
        <div id="popover" dx-popover=\'popoverOptions\'>\
            <div data-options=\'dxTemplate: { name: "content" }\' style=\'line-height: 18px\'>\
                {{popoverContent}} {{popoverContent}}\
            </div>\
        </div>\
    ');

    const controller = function($scope) {
        $scope.popoverOptions = {
            target: '#link1',
            animation: null,
            width: 100,
            height: undefined,
            position: { at: 'right top', my: 'left top' },
            visible: true
        };
        $scope.popoverContent = '1';
    };

    initMarkup($markup, controller, this);

    this.clock.tick();

    assert.roughEqual($('.dx-popup-content').height(), 18, 0.5);
});

QUnit.test('dxDataGrid', function(assert) {
    const $markup = $('\
        <div dx-data-grid=\'dataGridOptions\' dx-item-alias=\'alias\'></div>\
        <script id=\'gridRow\' type=\'text/html\'>\
            <tbody>\
                <tr>\
                    <td>{{alias.data.Column1}}</td>\
                    <td>{{alias.data.Column2}}</td>\
                </tr>\
            </tbody>\
        </script>\
    ');

    const controller = function($scope) {
        $scope.dataGridOptions = {
            dataSource: [{
                'Column1': 'Value1',
                'Column2': 'Value2'
            }],
            width: 200,
            rowTemplate: $('#gridRow'),
            columnAutoWidth: true,
            columns: [ 'Column1', 'Column2' ]
        };
    };

    initMarkup($markup, controller, this);

    this.clock.tick(30);

    const $cols = $('.dx-datagrid-rowsview col');
    assert.roughEqual(parseInt($cols[0].style.width), 100, 1.01);
    assert.roughEqual(parseInt($cols[1].style.width), 100, 1.01);
});

QUnit.test('dxDataGrid - search with row template should highlight data without template (T539633)', function(assert) {
    const $markup = $(
        '<div dx-data-grid="gridOptions" dx-item-alias="employee"></div>\
        <script id="gridRow" type="text/html">\
            <tbody>\
                <tr>\
                    <td class="mycell">{{employee.data.column1}}</td>\
                </tr>\
            </tbody>\
        </script>'
    );
    const controller = function($scope) {
        $scope.gridOptions = {
            dataSource: [{
                column1: 'text.1'
            }, {
                column1: 'text.2'
            }],
            rowTemplate: $('#gridRow'),
            searchPanel: { visible: true }
        };
    };

    initMarkup($markup, controller, this);
    this.clock.tick(30);

    assert.equal($($('.mycell')[0]).text(), 'text.1');

    $('.dx-datagrid-search-panel').dxTextBox('instance').option('value', '.');
    this.clock.tick(FILTERING_TIMEOUT);

    assert.equal($($('.mycell')[0]).text(), 'text.1');
});

QUnit.test('dxDataGrid - highlight timer was cleared on disposing for dataGrid with row template (T539633)', function(assert) {
    assert.expect(0);
    this.clock.restore();

    const $markup = $(
        '<div dx-data-grid="gridOptions" dx-item-alias="employee"></div>\
        <script id="gridRow" type="text/html">\
            <tbody>\
                <tr>\
                    <td class="mycell">{{employee.data.column1}}</td>\
                </tr>\
            </tbody>\
        </script>'
    );
    const controller = function($scope) {
        $scope.gridOptions = {
            dataSource: [{ column1: 'text.1' }],
            rowTemplate: $('#gridRow')
        };
    };

    initMarkup($markup, controller, this);
});

QUnit.test('dxDataGrid - search with cell template should highlight data without template (T554034)', function(assert) {
    const $markup = $(
        '<div dx-data-grid="gridOptions" dx-item-alias="item">\
            <div data-options="dxTemplate:{ name: \'cellTemplate\' }">\
                <span class="mycell">{{item.data.column1}}</span>\
            </div>\
        </div>'
    );

    const controller = function($scope) {
        $scope.gridOptions = {
            dataSource: [{
                column1: 'text1'
            }, {
                column1: 'text2'
            }],
            columns: [{
                dataField: 'column1',
                cellTemplate: 'cellTemplate'
            }],
            searchPanel: { visible: true }
        };
    };

    initMarkup($markup, controller, this);
    this.clock.tick(30);

    assert.equal($($('.mycell')[0]).text(), 'text1');

    $('.dx-datagrid-search-panel').dxTextBox('instance').option('value', 'e');
    this.clock.tick(FILTERING_TIMEOUT);

    assert.equal($($('.mycell')[0]).text(), 'text1');
});

QUnit.test('dxDataGrid - highlight timer was cleared on disposing for dataGrid with cell template (T554034)', function(assert) {
    assert.expect(0);
    this.clock.restore();

    const $markup = $(
        '<div dx-data-grid="gridOptions" dx-item-alias="item">\
            <div data-options="dxTemplate:{ name: \'cellTemplate\' }">\
                <span class="mycell">{{item.data.column1}}</span>\
            </div>\
        </div>'
    );
    const controller = function($scope) {
        $scope.gridOptions = {
            dataSource: [{ column1: 'text1' }],
            columns: [{
                dataField: 'column1',
                cellTemplate: 'cellTemplate'
            }]
        };
    };

    initMarkup($markup, controller, this);
});

// T576310
QUnit.test('dxDataGrid - row template should rendered correctly with grouping', function(assert) {
    const $markup = $(
        '<div dx-data-grid="gridOptions" dx-item-alias="employee"></div>\
        <script id="gridRow" type="text/html">\
            <tr class="myrow">\
                <td>{{employee.data.value}}</td>\
            </tr>\
        </script>'
    );
    const controller = function($scope) {
        $scope.gridOptions = {
            dataSource: [{
                value: 'text1'
            }, {
                value: 'text2'
            }],
            columns: [{ dataField: 'value', groupIndex: 0 }],
            rowTemplate: $('#gridRow')
        };
    };

    initMarkup($markup, controller, this);
    this.clock.tick(30);

    const $rows = $('.dx-datagrid-rowsview tbody > tr');

    assert.equal($rows.length, 5);
    assert.ok($rows.eq(0).hasClass('dx-group-row'));
    assert.ok($rows.eq(1).hasClass('myrow'));
});

QUnit.test('dxTabs - navigation buttons should show/hide after showing/hiding items (T343231)', function(assert) {
    const $markup = $('<div dx-tabs=\'tabSettings\'></div>');

    const controller = function($scope) {
        $scope.tabs = [
            { text: 'item1', visible: true },
            { text: 'item2', visible: true }
        ];

        $scope.tabSettings = {
            bindingOptions: {
                dataSource: { dataPath: 'tabs', deep: true }
            },
            width: 60,
            showNavButtons: true
        };
    };

    initMarkup($markup, controller, this);

    const scope = $markup.scope();

    this.clock.tick();
    assert.equal($markup.find('.dx-tabs-nav-button').length, 2);

    scope.$apply(function() {
        scope.tabs[1].visible = false;
    });

    this.clock.tick();
    assert.equal($markup.find('.dx-tabs-nav-button').length, 0);

    scope.$apply(function() {
        scope.tabs[1].visible = true;
    });

    this.clock.tick();
    assert.equal($markup.find('.dx-tabs-nav-button').length, 2);
});


QUnit.module('dxDataGrid', {
    beforeEach: function() {
        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
        this.clock.restore();
    }
});

function calcWatchersCount(element) {
    const root = angular.element(element || document.getElementsByTagName('body'));

    const watchers = [];

    const f = function(element) {
        angular.forEach(['$scope', '$isolateScope'], function(scopeProperty) {
            const elementData = element.data();
            if(elementData && Object.prototype.hasOwnProperty.call(elementData, scopeProperty)) {
                angular.forEach(element.data()[scopeProperty].$$watchers, function(watcher) {
                    watchers.push(watcher);
                });
            }
        });

        angular.forEach(element.children(), function(childElement) {
            f(angular.element(childElement));
        });
    };

    f(root);

    return watchers.length;
}

QUnit.test('Two-way binding', function(assert) {
    const initialWatchersCount = 1; // NOTE: One uncleared watcher created for dxDigestCallbacks service

    const $markup = $('<div dx-data-grid="gridOptions"></div>');

    const controller = function($scope) {
        $scope.gridOptions = {
            dataSource: [
                { field1: 1, field2: 2 },
                { field1: 3, field2: 4 }
            ]
        };
    };

    initMarkup($markup, controller, this);

    const scope = $markup.scope();

    this.clock.tick(30);

    let $rows = $markup.find('.dx-data-row');
    assert.equal($rows.length, 2, 'row count');
    assert.equal($rows.eq(0).children().eq(0).text(), '1');
    assert.equal($rows.eq(1).children().eq(0).text(), '3');

    // act
    scope.$apply(function() {
        scope.gridOptions.dataSource[0].field1 = 666;
    });

    // assert
    $rows = $markup.find('.dx-data-row');
    assert.equal($rows.length, 2, 'row count');
    assert.equal($rows.eq(0).children().eq(0).text(), '666');
    assert.equal($rows.eq(1).children().eq(0).text(), '3');
    assert.equal(calcWatchersCount(), initialWatchersCount + 2, 'watchers count');
});

// T285727
QUnit.test('Two-way binding when columnFixing', function(assert) {
    const initialWatchersCount = 1; // NOTE: One uncleared watcher created for dxDigestCallbacks service

    const $markup = $('<div dx-data-grid="gridOptions"></div>');
    const controller = function($scope) {
        $scope.gridOptions = {
            columns: [{ dataField: 'field1', fixed: true }, 'field2'],
            dataSource: [
                { field1: 1, field2: 2 },
                { field1: 3, field2: 4 }
            ]
        };
    };

    initMarkup($markup, controller, this);

    const scope = $markup.scope();

    this.clock.tick(30);

    let $rows = $markup.find('.dx-datagrid-content-fixed .dx-data-row');
    assert.equal($rows.length, 2, 'row count');
    assert.equal($rows.eq(0).children().eq(0).text(), '1');
    assert.equal($rows.eq(1).children().eq(0).text(), '3');

    // act
    scope.$apply(function() {
        scope.gridOptions.dataSource[0].field1 = 666;
    });

    // assert
    $rows = $markup.find('.dx-datagrid-content-fixed .dx-data-row');
    assert.equal($rows.length, 2, 'row count');
    assert.equal($rows.eq(0).children().eq(0).text(), '666');
    assert.equal($rows.eq(1).children().eq(0).text(), '3');
    assert.equal(calcWatchersCount(), initialWatchersCount + 2, 'watchers count');
});

// T352960
QUnit.test('Two-way binding does not work for inserted rows', function(assert) {
    const initialWatchersCount = 1; // NOTE: One uncleared watcher created for dxDigestCallbacks service

    const $markup = $('<div dx-data-grid="gridOptions"></div>');
    const controller = function($scope) {
        $scope.gridOptions = {
            onInitialized: function(e) {
                $scope.grid = e.component;
            },
            columns: ['field1', 'field2'],
            dataSource: [
                { field1: 1, field2: 2 },
                { field1: 3, field2: 4 }
            ]
        };
    };

    initMarkup($markup, controller, this);

    const scope = $markup.scope();

    this.clock.tick(30);

    // act
    scope.$apply(function() {
        scope.grid.addRow();
    });

    // assert
    const $rows = $markup.find('.dx-data-row');
    assert.equal($rows.length, 3, 'row count');
    assert.equal(calcWatchersCount(), initialWatchersCount + 2, 'watchers count. Inserted row is ignored');
});

// T429370
QUnit.test('Assign selectedRowKeys option via binding', function(assert) {
    const $markup = $('<div dx-data-grid="gridOptions"></div>');

    const controller = function($scope) {
        $scope.gridOptions = {
            bindingOptions: {
                'selectedRowKeys': 'selectedRowKeys'
            },
            columns: ['field1', 'field2'],
            dataSource: {
                store: {
                    type: 'array',
                    data: [
                        { field1: 1, field2: 2 },
                        { field1: 3, field2: 4 }
                    ],
                    key: ['field1', 'field2']
                }
            }
        };
    };

    initMarkup($markup, controller, this);

    const scope = $markup.scope();

    this.clock.tick(30);
    // act
    scope.$apply(function() {
        scope.selectedRowKeys = [{ field1: 1, field2: 2 }];
        scope.selectedRowKeysInstance = scope.selectedRowKeys;
    });

    // assert
    const $selectedRows = $markup.find('.dx-data-row.dx-selection');
    assert.equal($selectedRows.length, 1, 'one row is selected');
    assert.notEqual(scope.selectedRowKeysInstance, scope.selectedRowKeys, 'selectedRowKeys instance is not changed');
});

// T427432
QUnit.test('Change selection.mode option via binding and refresh', function(assert) {
    const $markup = $('<div id="grid" dx-data-grid="gridOptions"></div>');
    const controller = function($scope) {
        $scope.gridOptions = {
            onInitialized: function(e) {
                $scope.grid = e.component;
            },
            dataSource: [
                { value: 1, text: 'A' },
                { value: 2, text: 'B' },
                { value: 3, text: 'C' }
            ],
            loadingTimeout: undefined,
            bindingOptions: {
                'selection.mode': 'mode'
            },
            loadPanel: { showPane: false, enabled: false },
        };

        $scope.mode = 'multiple';
    };

    initMarkup($markup, controller, this);

    const scope = $markup.scope();

    this.clock.tick(30);


    // act
    $($markup.find('.dx-data-row').eq(0).children().first()).trigger('dxclick');

    this.clock.tick(30);


    scope.$apply(function() {
        scope.mode = 'single';
        scope.grid.option('selection.mode', 'single');
        scope.grid.refresh();
    });

    this.clock.tick(30);


    // assert
    assert.equal($markup.find('.dx-header-row').eq(0).children().length, 2, 'two cells in header row');
    assert.equal($markup.find('.dx-data-row').eq(0).children().length, 2, 'two cells in data row');
});


QUnit.test('Scope refreshing count on init', function(assert) {
    const $markup = $('<div dx-data-grid="gridOptions"></div> <div>{{ calculateValue() }}</div>');

    let refreshingCount = 0;
    const controller = function($scope) {
        $scope.gridOptions = {
            dataSource: [
                { field1: 1 },
                { field1: 2 },
                { field1: 3 },
                { field1: 4 }
            ]
        };
        $scope.calculateValue = function() {
            refreshingCount++;
            return 'Test value';
        };
    };

    initMarkup($markup, controller, this);

    this.clock.tick(30);

    assert.equal(refreshingCount, 4);
});

QUnit.module('Adaptive menu', {
    beforeEach: function() {
        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach: function() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

QUnit.test('Adaptive menu should support angular integration', function(assert) {
    const $markup = $('\
        <div dx-menu="menuOptions"></div>\
        <div id="testDiv" ng-bind="test"></div>\
    ');

    const controller = function($scope) {
        $scope.test = 'Test text 1';

        $scope.menuOptions = {
            adaptivityEnabled: true,
            items: [{ text: 'item 1' }],
            onItemClick: function() {
                $scope.test = 'Test text 2';
            }
        };
        assert.strictEqual($scope.selectedRowKeysInstance, $scope.selectedRowKeys, 'selectedRowKeys instance is not changed');
    };

    initMarkup($markup, controller, this);

    const scope = $markup.scope();

    const $treeViewItem = $markup.find('.dx-treeview-item').eq(0);

    $($treeViewItem).trigger('dxclick');

    assert.equal(scope.test, 'Test text 2', 'scope value is updated');
    assert.equal($('#testDiv').text(), 'Test text 2', 'test div is updated');
});

QUnit.test('Component can change itself options on init (T446364)', function(assert) {
    const data = ['Peter', 'Mary', 'John', 'Sam', 'Betty', 'Joyce'];

    const $markup = $('<div dx-list="listOptions"></div>');
    const controller = function($scope) {
        $scope.listOptions = {
            bindingOptions: {
                dataSource: 'vm.myData',
                selectedItems: 'vm.MyRows'
            },
            selectionMode: 'single'
        };

        const Test = (function() {
            function Test() {
                this.myRows = [];
                this.myData = [];
            }
            Object.defineProperty(Test.prototype, 'MyRows', {
                get: function() { return this.myRows; },
                set: function(value) {
                    if(value && value.length > 0) {
                        this.myRows = value;
                    }
                },
                enumerable: true,
                configurable: true
            });
            return Test;
        }());

        $scope.vm = new Test();
        $scope.vm.myData = data;
    };

    initMarkup($markup, controller, this);

    const scope = $markup.scope();

    $markup.dxList('option', 'selectedItems', [ 'Betty' ]);

    assert.equal(scope.vm.MyRows[0], 'Betty');
});

QUnit.test('The hamburger button should be visible on small screen (T377800)', function(assert) {
    const $markup = $('\
        <div style=\'width: 100px\'>\
            <div dx-menu=\'menu\'></div>\
        </div>'
    );

    const controller = function($scope) {
        $scope.menu = {
            adaptivityEnabled: true,
            items: [{ text: 'menuItem1' }, { text: 'menuItem2' }, { text: 'menuItem3' }]
        };
    };

    initMarkup($markup, controller, this);

    assert.ok(!$markup.find('.dx-menu-items-container').is(':visible'));
    assert.ok($markup.find('.dx-menu-hamburger-button').is(':visible'));
});


QUnit.module('toolbar', {
    beforeEach: function() {
        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach: function() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

QUnit.test('polymorph widget correctly renders nested widgets', function(assert) {
    const $markup = $('\
        <div dx-toolbar="{ items: items }"></div>\
        <div ng-bind="test"></div>\
    ');

    const controller = function($scope) {
        scope = $scope;

        $scope.disabled = false;

        $scope.items = [{
            widget: 'dxButton',
            options: {
                bindingOptions: {
                    disabled: '$parent.disabled'
                }
            }
        }];
    };

    initMarkup($markup, controller, this);

    let scope = $markup.scope();

    scope.$apply(function() {
        scope.disabled = true;
    });
    assert.equal($markup.find('.dx-state-disabled').length, 1);
});

QUnit.test('dxPopup - bindingOptions for a title property should be worked', function(assert) {
    const $markup = $('\
        <div dx-popup="popupOptions"></div>\
        <div ng-bind="test"></div>\
    ');

    const controller = function($scope) {
        scope = $scope;
        $scope.titlePopup = 'title';

        $scope.popupOptions = {
            visible: true,
            showTitle: true,
            bindingOptions: {
                title: 'titlePopup'
            }
        };
    };

    initMarkup($markup, controller, this);

    let scope = $markup.scope();

    const done = assert.async();
    setTimeout(function() {
        scope.$apply(function() {
            scope.titlePopup = 'new title';
        });

        assert.equal($.trim($('.dx-popup-title').text()), 'new title');
        done();
    }, 0);
});


QUnit.module('accordion');

QUnit.test('item height is correct in animation config (T520346)', function(assert) {
    assert.expect(1);
    const done = assert.async();
    this.clock = sinon.useFakeTimers();

    const originalAnimate = fx.animate;

    const $markup = $(
        '<div dx-accordion="accordionOptions" dx-item-alias="veryVeryVeryLongAlias">\
            <div data-options="dxTemplate : { name: \'item\' } " style=\'line-height: 18px\'>\
                {{veryVeryVeryLongAlias.Value}} {{veryVeryVeryLongAlias.Value}}\
            </div>\
        </div>'
    );

    const controller = function($scope) {
        $scope.accordionOptions = {
            dataSource: [{ 'Value': '1' }],
            width: 150,
            collapsible: true,
            selectedItems: []
        };
    };

    initMarkup($markup, controller, this);

    this.clock.tick();

    fx.animate = function($element, config) {
        assert.roughEqual(config.to.height, 68, 0.5);

        return originalAnimate($element, config);
    };

    const $titles = $markup.find('.dx-accordion-item-title');
    $($titles.eq(0)).trigger('dxclick');

    this.clock.tick();

    this.clock.restore();
    fx.animate = originalAnimate;
    done();
});

QUnit.test('title height is correct if the title is customized using ng-class (T444379)', function(assert) {
    this.clock = sinon.useFakeTimers();

    const $markup = $(
        '<style>.test-class { height: 100px; }</style>\
        <div dx-accordion="accordionOptions" dx-item-alias="item">\
            <div data-options="dxTemplate : { name: \'title\' } ">\
                <div ng-class="getClass()">{{item.Value}}</div>\
            </div>\
        </div>'
    );

    const controller = function($scope) {
        $scope.accordionOptions = {
            dataSource: [{ 'Value': '1' }],
            collapsible: true,
            selectedItems: []
        };
        $scope.getClass = function() {
            return 'test-class';
        };
    };

    initMarkup($markup, controller, this);

    this.clock.tick();

    const $titles = $markup.find('.dx-accordion-item');
    assert.equal($titles.children().height(), 100);

    this.clock.restore();
});

QUnit.test('not cleared timers not detected', function(assert) {
    assert.expect(0);

    const $markup = $('<div dx-accordion="{}"></div>');
    initMarkup($markup, function() {}, this);

    $markup.remove();
});


QUnit.module('box', {
    beforeEach: function() {
        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach: function() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

QUnit.test('innerBox with nested box item', function(assert) {
    const $markup = $('\
        <div dx-box="{}">\
            <div data-options="dxItem: {baseSize: 272, ratio: 0, box: {direction: \'col\'}}">\
                <div data-options="dxItem: {baseSize: \'auto\', ratio: 0}"><h2>Box1</h2></div>\
            </div>\
        </div>\
    ');

    initMarkup($markup, function() {}, this);

    assert.equal($.trim($markup.text()), 'Box1', 'inner box rendered');
});

QUnit.module('date box', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

// T533858
QUnit.test('dxDateBox with list strategy automatically scrolls to selected item on opening', function(assert) {
    const $markup = $('\
        <div dx-date-box="{\
            type: \'time\',\
            value: \'2017/07/01 08:30\',\
            pickerType: \'list\',\
            opened: true\
        }">\
        </div>\
    ');

    initMarkup($markup, function() {}, this);

    this.clock.tick();

    const $popupContent = $('.dx-popup-content');
    const $selectedItem = $popupContent.find('.dx-list-item-selected');

    assert.equal($selectedItem.length, 1, 'one item is selected');
    assert.ok($popupContent.offset().top + $popupContent.height() > $selectedItem.offset().top, 'selected item is visible');
});

QUnit.module('tree view', {
    beforeEach: function() {
        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach: function() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

QUnit.test('tree view should not crash with complex ids', function(assert) {
    assert.expect(0);

    const $markup = $('\
        <div dx-tree-view=\'options\' dx-item-alias=\'item\'>\
            <div data-options=\'dxTemplate: { name: "item" }\'>{{item.title}}</div>\
        </div>\
    ');

    const controller = function($scope) {
        $scope.data = [{
            uid: '33ad',
            title: 'title',
            uidParent: null
        }];

        $scope.options = {
            keyExpr: 'uid',
            parentIdExpr: 'uidParent',
            dataStructure: 'plain',
            bindingOptions: {
                items: 'data'
            }
        };
    };

    initMarkup($markup, controller, this);
});


QUnit.module('dxScheduler', {
    beforeEach: function() {
        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
        this.clock.restore();
    }
});

QUnit.test('Custom store with ISO8601 dates', function(assert) {
    const $markup = $('<div dx-scheduler="schedulerOptions"></div>');

    const controller = function($scope) {
        $scope.schedulerOptions = {
            dataSource: {
                load: function() {
                    const d = $.Deferred();

                    setTimeout(function() {
                        d.resolve([{
                            'text': 'Approve Personal Computer Upgrade Plan',
                            'startDate': '2015-05-26T18:30:00+01:00',
                            'endDate': '2015-05-26T18:30:00+01:00'
                        }]);
                    });
                    return d.promise();
                }
            },
            timeZone: 'America/Los_Angeles',
            views: ['workWeek'],
            currentView: 'workWeek',
            currentDate: new Date(2015, 4, 25)
        };
    };

    initMarkup($markup, controller, this);

    // act
    this.clock.tick(0);

    assert.equal($markup.find('.dx-scheduler-appointment').length, 1, 'appointment count');
});


QUnit.module('Widgets without model for template', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach: function() {
        this.clock.restore();
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

const noModelWidgets = [
    {
        name: 'dxDeferRendering',
        options: { renderWhen: $.Deferred().resolve().promise() }
    },
    {
        name: 'dxPopup',
        options: { visible: true }
    },
    {
        name: 'dxSlideOutView',
        options: {}
    }
];

noModelWidgets.forEach(function(widget) {
    QUnit.test(widget.name, function(assert) {
        const TestComponent = DOMComponent.inherit({
            _render: function() {
                return this.callBase.apply(this, arguments);
            },
            _optionChanged: function() {
                this._invalidate();
            },
            _getDefaultOptions: function() {
                return { text: '', array: [], obj: null };
            },
            _useTemplates() {
                return false;
            }
        });

        registerComponent('dxTest', TestComponent);

        const $markup = $('<div/>')
            .attr(inflector.dasherize(widget.name), 'widgetOptions');

        // TODO: ng-bind?
        $('<div>')
            .attr('dx-test', 'innerOptions')
            .addClass('inner-widget')
            .appendTo($markup);

        const controller = function($scope) {
            scope = $scope;

            $scope.modelIsReady = $.Deferred().resolve().promise();

            $scope.test = 'Test text 1';

            $scope.widgetOptions = widget.options;
            $scope.innerOptions = {
                bindingOptions: {
                    text: 'test'
                }
            };
        };

        initMarkup($markup, controller, this);

        let scope = $markup.scope();
        this.clock.tick(300);

        const instance = $('.inner-widget').dxTest('instance');

        instance.option('text', 'Test text 2');

        assert.equal(scope.test, 'Test text 2', 'scope value is updated');
    });
});

QUnit.test('Scope for template with \'noModel\' option is not destroyed after clean (T427115)', function(assert) {
    const TestContainer = Widget.inherit({
        _render: function() {
            const content = $('<div />')
                .addClass('dx-content')
                .appendTo(this.$element());

            this.option('integrationOptions.templates')['template'].render({
                container: content,
                noModel: true
            });
        }
    });

    registerComponent('dxTestContainerNoModel', TestContainer);

    const $markup = $('\
        <div dx-test-container-no-model>\
            <div data-options=\'dxTemplate: { name: "template" }\' class=\'outer-template\'>\
            </div>\
        </div>\
    ');

    initMarkup($markup, function() {}, this);

    const instance = $markup.dxTestContainerNoModel('instance');
    const scope = $markup.scope();

    assert.ok(scope.$root);

    instance.repaint();

    assert.ok(scope.$root);
});


QUnit.module('dxValidator', {
    beforeEach: function() {
        this.testApp = angular.module('testApp', ['dx']);
        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach: function() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

QUnit.test('T183342 dxValidator should be created after any editors', function(assert) {
    const dxApp = angular.module('dx');
    const validatorDirective = $.grep(dxApp._invokeQueue, function(configObj) {
        return (configObj[1] === 'directive') && (configObj[2][0] === 'dxValidator');
    })[0];
    const editorDirective = $.grep(dxApp._invokeQueue, function(configObj) {
        return (configObj[1] === 'directive') && (configObj[2][0] === 'dxTextBox');
    })[0];
    const getPriority = function(configObj) {
        return configObj[2][1][3]().priority;
    };

    assert.ok(validatorDirective, 'Validator directive should be registered');
    assert.ok(editorDirective, 'Editor directive should be registered');
    assert.ok(getPriority(validatorDirective) > getPriority(editorDirective), 'Validator\'s priority should be greater than Editor\'s priority (as they are executed in a reversed order');
});

QUnit.test('T228219 dxValidationSummary should be disposed properly', function(assert) {
    const $markup = $('\
        <div id=\'testGroup\' dx-validation-group=\'{}\'>\
            <div class=\'dx-field\'>\
                <div class=\'dx-field-value\'>\
                    <div dx-text-box=\'{ bindingOptions: { value: "name" } }\'\
                        dx-validator=\'{ validationRules: [{ type: "required" }] }\'>\
                    </div>\
                </div>\
            </div>\
            <div id=\'valSumm\' dx-validation-summary=\'{ }\'></div>\
        </div>\
    ');

    initMarkup($markup, function() {}, this);

    assert.ok(new ValidationGroup($markup));

    $markup.remove();

    assert.ok(true, 'We should not fall on previous statement');
});
