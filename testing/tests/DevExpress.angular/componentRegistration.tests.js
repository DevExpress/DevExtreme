import $ from 'jquery';
import config from 'core/config';
import commonUtils from 'core/utils/common';
const noop = commonUtils.noop;
import domUtils from 'core/utils/dom';
import angular from 'angular';
import registerComponent from 'core/component_registrator';
import DOMComponent from 'core/dom_component';
import Widget from 'ui/widget/ui.widget';
import { NgTemplate } from 'integration/angular/template';
import CollectionWidget from 'ui/collection/ui.collection_widget.edit';

import 'integration/angular';

import 'ui/list';
import 'ui/button';

const FIXTURE_ELEMENT = () => $('#qunit-fixture');

const ignoreAngularBrowserDeferTimer = args => args.timerType === 'timeouts' && (args.callback.toString().indexOf('delete pendingDeferIds[timeoutId];') > -1 || args.callback.toString().indexOf('delete F[c];e(a)}') > -1);

QUnit.module('simple component tests', {
    beforeEach() {
        const componentRendered = $.Callbacks();
        const TestComponent = DOMComponent.inherit({
            _render(...args) {
                componentRendered.fire();
                return this.callBase(...args);
            },
            _optionChanged() {
                this._invalidate();
            },
            _getDefaultOptions() {
                return { text: '', array: [], obj: null };
            },
            _useTemplates() {
                return false;
            }
        });

        this.componentRendered = componentRendered;
        this.testApp = angular.module('testApp', ['dx']);
        this.$container = $('<div/>').appendTo(FIXTURE_ELEMENT());
        this.$controller = $('<div></div>')
            .attr('ng-controller', 'my-controller')
            .appendTo(this.$container);

        registerComponent('dxTest', TestComponent);

        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

QUnit.test('simple component init', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', '{ text: \'my text\' }')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', () => { });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTest('instance');
    const scope = $markup.scope();

    assert.equal(instance.option('text'), 'my text');

    assert.strictEqual($markup.scope(), scope);

    assert.ok(!scope.$$watchers);
});

QUnit.test('component options from scope', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', 'options')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.options = {
            text: 'my text'
        };
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTest('instance');
    const scope = $markup.scope();

    assert.equal(instance.option('text'), 'my text');

    scope.$apply(() => {
        scope.options.text = 'change1';
    });
    assert.equal(instance.option('text'), 'my text');

    instance.option('text', 'change2');
    assert.equal(scope.options.text, 'change1');

    assert.strictEqual($markup.scope(), scope);

    assert.ok(!scope.$$watchers);
});

QUnit.test('component option fields from scope', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', '{ text: vm.text }')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.vm = {
            text: 'my text'
        };
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTest('instance');
    const scope = $markup.scope();

    assert.equal(instance.option('text'), 'my text');

    scope.$apply(() => {
        scope.vm.text = 'change1';
    });
    assert.equal(instance.option('text'), 'my text');

    instance.option('text', 'change2');
    assert.equal(scope.vm.text, 'change1');

    assert.strictEqual($markup.scope(), scope);

    assert.ok(!scope.$$watchers);
});

QUnit.test('component with bindingOptions', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', '{ bindingOptions: { text: \'vm.text\' } }')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.vm = {
            text: 'my text'
        };
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTest('instance');
    const scope = $markup.scope();

    assert.equal(instance.option('text'), 'my text');

    scope.$apply(() => {
        scope.vm.text = 'change1';
    });
    assert.equal(instance.option('text'), 'change1');

    instance.option('text', 'change2');
    assert.equal(scope.vm.text, 'change2');

    assert.strictEqual($markup.scope(), scope);

    assert.equal(scope.$$watchers.length, 1);

    $markup.remove();
    assert.equal(scope.$$watchers.length, 0);
});

QUnit.test('component with bindingOptions and computed binding', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', '{ bindingOptions: { text: \'vm[field]\' } }')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.vm = {
            text: 'my text'
        };
        $scope.field = 'text';
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTest('instance');
    const scope = $markup.scope();

    assert.equal(instance.option('text'), 'my text');

    scope.$apply(() => {
        scope.vm.text = 'change1';
    });
    assert.equal(instance.option('text'), 'change1');

    instance.option('text', 'change2');
    assert.equal(scope.vm.text, 'change2');
});

QUnit.test('component with bindingOptions for nested option', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', '{ obj: { }, bindingOptions: { \'obj.text\': \'vm.caption\' } }')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.vm = {
            caption: 'my text'
        };
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTest('instance');
    const scope = $markup.scope();

    assert.equal(instance.option('obj.text'), 'my text');

    scope.$apply(() => {
        scope.vm.caption = 'change1';
    });
    assert.equal(instance.option('obj.text'), 'change1');

    instance.option('obj.text', 'change2');
    assert.equal(scope.vm.caption, 'change2');
});

QUnit.test('component with bindingOptions from scope', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', '{ bindingOptions: defs }')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.vm = {
            text: 'my text'
        };

        $scope.defs = {
            text: 'vm.text'
        };
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTest('instance');
    const scope = $markup.scope();

    assert.equal(instance.option('text'), 'my text');

    scope.$apply(() => {
        scope.vm.text = 'change1';
    });
    assert.equal(instance.option('text'), 'change1');

    instance.option('text', 'change2');
    assert.equal(scope.vm.text, 'change2');

    assert.strictEqual($markup.scope(), scope);

    assert.equal(scope.$$watchers.length, 1);

    $markup.remove();
    assert.equal(scope.$$watchers.length, 0);
});

QUnit.test('component with bindingOptions from scope inside sync action (T302197)', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', '{ onInitialized: inited, bindingOptions: defs }')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.vm = {
            text: 'my text'
        };
        $scope.inited = () => {
            $scope.vm.text = 'new text';
        };

        $scope.defs = {
            text: 'vm.text'
        };
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTest('instance');

    assert.equal(instance.option('text'), 'new text');
});

QUnit.test('component with bindingOptions from scope when invalid value for widget was set (T403775)', function(assert) {
    const TestComponent = DOMComponent.inherit({
        _optionChanged(args) {
            this._invalidate();
            if(args.name === 'width' && args.value < 0) {
                this.option('width', 0);
            }
        },
        _useTemplates() {
            return false;
        }
    });

    registerComponent('dxTestWithValidatedOption', TestComponent);

    const $markup = $('<div></div>')
        .attr('dx-test-with-validated-option', '{ bindingOptions: { width: \'width\' }}')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.width = 10;
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTestWithValidatedOption('instance');
    const scope = $markup.scope();

    assert.equal(scope.width, 10);
    assert.equal(instance.option('width'), 10);

    scope.$apply(() => {
        scope.width = -1;
    });

    assert.equal(scope.width, 0);
    assert.equal(instance.option('width'), 0);
});

QUnit.test('bindingOptions can be inherited inside options object (T426046)', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', 'config')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        function baseOption() { }

        baseOption.prototype.bindingOptions = {
            text: 'text'
        };

        $scope.config = new baseOption();
        $scope.text = 'my text';
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTest('instance');
    const scope = $markup.scope();

    assert.equal(instance.option('text'), 'my text');

    instance.option('text', 'change text');
    assert.equal(scope.text, 'change text');
});

QUnit.test('bindingOptions fields can be inherited', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', 'config')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        function baseOption() { }

        baseOption.prototype.text = 'text';

        $scope.config = {};
        $scope.config.bindingOptions = new baseOption();

        $scope.text = 'my text';
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTest('instance');
    const scope = $markup.scope();

    assert.equal(instance.option('text'), 'my text');

    instance.option('text', 'change text');
    assert.equal(scope.text, 'change text');
});

QUnit.test('repeat binding', function(assert) {
    const $markup = $('<div/>').appendTo(this.$controller);
    let scope;

    $markup.append($(
        '<div ng-repeat=\'item in vm.items\'>' +
        '   <div dx-test="{ bindingOptions: { text: \'item.text\' } }"></div>' +
        '</div>'
    ));

    this.testApp.controller('my-controller', $scope => {
        scope = $scope;

        $scope.vm = {
            items: [
                { text: '0' },
                { text: '1' }
            ]
        };
    });

    angular.bootstrap(this.$container, ['testApp']);

    assert.equal($markup.children().eq(1).children().dxTest('option', 'text'), '1');

    scope.$apply(() => {
        scope.vm.items.push({ text: '2' });
    });
    assert.equal($markup.children().eq(2).children().dxTest('option', 'text'), '2');

    scope.$apply(() => {
        scope.vm.items.splice(1, 1);
    });
    assert.equal($markup.children().length, 2);

    const $firstElement = $markup.children().eq(1).children();
    const $secondElement = $markup.children().eq(1).children();
    const firstScope = $firstElement.scope();
    const secondScope = $secondElement.scope();

    scope.$apply(() => {
        $markup.remove();
    });

    // NOTE: We can not check if scope.$$watchers.length equals 0 because of known issue with memory leaks with ng-repeat in Angular.

    assert.equal(firstScope.$$watchers.length, 0);
    assert.equal(secondScope.$$watchers.length, 0);
});

QUnit.test('DOMComponent does not control descendant bindings', function(assert) {
    const $markup = $('<div/>').appendTo(this.$controller);

    $markup.append($(
        '<div dx-test>' +
        '   <ul>' +
        '       <li ng-repeat=\'item in vm.items\' ng-bind=\'item\'></li>' +
        '   </ul>' +
        '</div>'
    ));

    this.testApp.controller('my-controller', $scope => {
        $scope.vm = {
            items: [1, 2, 3]
        };
    });

    angular.bootstrap(this.$container, ['testApp']);

    const listItems = $markup.find('ul').children();
    assert.equal(listItems.length, 3);
    assert.equal(listItems.text(), '123');
});

QUnit.test('changing a field of bound object changes component option', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', '{ bindingOptions: { obj: \'obj\' } }')
        .appendTo(this.$controller);

    let optionChanged = false;

    this.testApp.controller('my-controller', $scope => {
        $scope.obj = {
            a: 42
        };
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTest('instance');
    const scope = $markup.scope();

    assert.ok(!optionChanged);

    instance.on('optionChanged', () => {
        optionChanged = true;
    });
    scope.$apply(() => {
        scope.obj.a = 43;
    });

    assert.ok(optionChanged);
});

QUnit.test('binding options with deep=true for array option', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', '{ bindingOptions: { items: { deep: true, dataPath: \'dataItems\' } } }')
        .appendTo(this.$controller);

    let optionChanged = false;

    this.testApp.controller('my-controller', $scope => {
        $scope.dataItems = [
            { value: 1 },
            { value: 2 },
            { value: 3 }
        ];
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTest('instance');
    const scope = $markup.scope();

    assert.ok(!optionChanged);

    instance.on('optionChanged', () => {
        optionChanged = true;
    });

    scope.$apply(() => {
        scope.dataItems[0].value = 42;
    });

    assert.ok(optionChanged);
    assert.equal(instance.option('items')[0].value, 42);
});

QUnit.test('binding options with deep=false for array option', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', '{ bindingOptions: { items: { deep: false, dataPath: \'dataItems\' } } }')
        .appendTo(this.$controller);

    let optionChanged = false;

    this.testApp.controller('my-controller', $scope => {
        $scope.dataItems = [
            { value: 1 },
            { value: 2 },
            { value: 3 }
        ];
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTest('instance');
    const scope = $markup.scope();

    assert.ok(!optionChanged);

    instance.on('optionChanged', () => {
        optionChanged = true;
    });

    scope.$apply(() => {
        scope.dataItems[0].value = 42;
    });

    assert.ok(!optionChanged);
    assert.equal(instance.option('items')[0].value, 42);
});

QUnit.test('binding options with deep=true for not array option', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', '{ bindingOptions: { option: { deep: true, dataPath: \'dataValue\' } } }')
        .appendTo(this.$controller);

    let optionChanged = false;

    this.testApp.controller('my-controller', $scope => {
        $scope.dataValue = { value: 1 };
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTest('instance');
    const scope = $markup.scope();

    assert.ok(!optionChanged);

    instance.on('optionChanged', () => {
        optionChanged = true;
    });

    scope.$apply(() => {
        scope.dataValue.value = 42;
    });

    assert.ok(optionChanged);
    assert.equal(instance.option('option').value, 42);
});

QUnit.test('binding options with deep=false for not array option', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', '{ bindingOptions: { text: { deep: false, dataPath: \'dataValue\' } } }')
        .appendTo(this.$controller);

    let optionChanged = false;

    this.testApp.controller('my-controller', $scope => {
        $scope.dataValue = { value: 1 };
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTest('instance');
    const scope = $markup.scope();

    instance.on('optionChanged', () => {
        optionChanged = true;
    });

    scope.$apply(() => {
        scope.dataValue.value = 42;
    });

    assert.ok(!optionChanged);
});

QUnit.test('binding should fired once when option is a plain object', function(assert) {
    if(angular.version.minor < 3) {
        assert.expect(0);
        return;
    }

    const $markup = $('<div></div>')
        .attr('dx-test', '{ bindingOptions: { testOption: \'dataValue\' }, onOptionChanged: optionChangedHandler }')
        .appendTo(this.$controller);

    const spy = sinon.spy();

    this.testApp.controller('my-controller', $scope => {
        $scope.optionChangedHandler = spy;
        $scope.dataValue = { value: 1 };
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTest('instance');

    spy.reset();
    instance.option('testOption', { value: 2 });

    assert.equal(spy.callCount, 1, 'optionChanged action fired once');
});

QUnit.test('dependence options changed when option is a plain object', function(assert) {
    if(angular.version.minor < 3) {
        assert.expect(0);
        return;
    }

    const $widget = $('<div>')
        .attr('dx-test', '{testOption: testOption, bindingOptions: {\'testOption.value\': \'testOption.value\', \'testOption.dependenceValue\': \'testOption.dependenceValue\' }}')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.testOption = {
            value: { value: 1 },
            dependenceValue: 0
        };

        $scope.$watch('testOption.value', () => {
            $scope.testOption.dependenceValue++;
        });
    });

    angular.bootstrap(this.$container, ['testApp']);

    const widget = $widget.dxTest('instance');
    widget.option('testOption.value', { value: 2 });

    assert.equal(widget.option('testOption.dependenceValue'), 2, 'dependence option was changed');
});

QUnit.test('option changed fired after value was set in the same value(plain object) then value was updated using angular', function(assert) {
    if(angular.version.minor < 3) {
        assert.expect(0);
        return;
    }

    const $markup = $('<div></div>')
        .attr('dx-test', '{ bindingOptions: { testOption: \'dataValue\' }, onOptionChanged: optionChangedHandler }')
        .appendTo(this.$controller);
    const spy = sinon.spy();
    const value = { value: 1 };
    this.testApp.controller('my-controller', $scope => {
        $scope.optionChangedHandler = spy;
        $scope.dataValue = value;
    });

    angular.bootstrap(this.$container, ['testApp']);

    const scope = $markup.scope();
    const instance = $markup.dxTest('instance');

    instance.option('testOption', value);

    spy.reset();
    scope.$apply(() => {
        scope.dataValue.value = 3;
    });

    assert.equal(spy.callCount, 1, 'optionChanged action fired once');
});

QUnit.test('Variable from scope not re-assign after change the corresponding widget options (T373260)', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', '{ bindingOptions: { option1_widget: \'option1_scope\', option2_widget: \'option2_scope\' } }')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {

        Object.defineProperty($scope, 'option1_scope', {
            get() {
                return $scope.option1;
            },
            set(value) {
                $scope.option1 = value;
                $scope.option2 = false;
            }
        });
        Object.defineProperty($scope, 'option2_scope', {
            get() {
                return $scope.option2;
            },
            set(value) {
                assert.ok(false, 'this method should not be called');
            }
        });

        $scope.option1 = 1;
        $scope.option2 = true;

    });

    angular.bootstrap(this.$container, ['testApp']);

    const scope = $markup.scope();
    const instance = $markup.dxTest('instance');

    instance.option('option1_widget', 2);

    assert.equal(scope.option2_scope, false, 'binding worked');
    assert.equal(instance.option('option2_widget'), false, 'binding worked');
});

QUnit.test('Lockers works correctly when widget options changed using action (T381596)', function(assert) {
    const MyComponent = DOMComponent.inherit({
        _getDefaultOptions() {
            return $.extend(this.callBase(), {
                onClick(e) {
                    e.component.option('testOption', false);
                }
            });
        },
        emulateAction() {
            this._createActionByOption('onClick')();
        },
        _useTemplates() {
            return false;
        }
    });
    registerComponent('dxMyComponent', MyComponent);

    const $markup = $('<div></div>')
        .attr('dx-my-component', '{ bindingOptions: { testOption: \'testOption\' } }')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.testOption = true;

        $scope.changeScopeValue = () => {
            scope.$apply(() => {
                $scope.testOption = true;
            });
        };
    });

    angular.bootstrap(this.$container, ['testApp']);

    var scope = $markup.scope();
    const instance = $markup.dxMyComponent('instance');

    assert.equal(instance.option('testOption'), true, 'binding worked');

    instance.emulateAction();
    assert.equal(instance.option('testOption'), false, 'binding worked');

    scope.changeScopeValue();
    assert.equal(instance.option('testOption'), true, 'binding worked');
});

// Note: Needed for dxFilterBuilder
QUnit.test('The component should not be rendered more times than it needed', function(assert) {
    const rendered = sinon.stub();
    const MyComponent = DOMComponent.inherit({
        _getDefaultOptions() {
            return $.extend(this.callBase(), {
                onClick(e) {
                    e.component.skipInvalidation = true;
                    e.component.option('testOption', [ 3, 2, 1 ]);
                }
            });
        },
        _optionChanged(...args) {
            if(this.skipInvalidation) {
                this.skipInvalidation = false;
            } else {
                rendered();
                return this.callBase(...args);
            }
        },
        emulateAction() {
            this._createActionByOption('onClick')();
        },
        _useTemplates() {
            return false;
        }
    });

    registerComponent('dxMyComponent', MyComponent);

    const $markup = $('<div></div>')
        .attr('dx-my-component', '{ bindingOptions: { testOption: \'testOption\' } }')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.testOption = [ 1, 2, 3 ];
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxMyComponent('instance');

    assert.equal(rendered.callCount, 1);

    instance.emulateAction();
    assert.equal(rendered.callCount, 1);
});

QUnit.test('WrappedAction should return function result (T388034)', function(assert) {
    const MyComponent = DOMComponent.inherit({
        _getDefaultOptions() {
            return $.extend(this.callBase(), {
                onTestAction(value) {
                    return value.text;
                }
            });
        },
        emulateAction() {
            const testAction = this._createActionByOption('onTestAction');
            return testAction({ text: 'testText' });
        },
        _useTemplates() {
            return false;
        }
    });
    registerComponent('dxMyComponent', MyComponent);

    const $markup = $('<div></div>')
        .attr('dx-my-component', '{ }')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', () => { });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxMyComponent('instance');

    const result = instance.emulateAction();
    assert.equal(result, 'testText', 'action return function result');
});

QUnit.test('Empty action doesn\'t call scope.$apply if config.wrapActionsBeforeExecute == true (T514528)', function(assert) {
    const originFlag = config().wrapActionsBeforeExecute;
    config({ wrapActionsBeforeExecute: true });

    const TestDOMComponent = DOMComponent.inherit({ _useTemplates() { return false; } });
    registerComponent('dxMyComponent', TestDOMComponent);

    const $markup = $('<div></div>')
        .attr('dx-my-component', '{ }')
        .appendTo(this.$controller);

    let applyCount = 0;

    this.testApp.controller('my-controller', () => { });

    angular.bootstrap(this.$container, ['testApp']);

    const scope = $markup.scope();
    const originApply = scope.$apply;

    scope.$apply = fn => {
        applyCount++;
        originApply.bind(fn, scope);
    };

    const instance = $markup.dxMyComponent('instance');
    instance._createActionByOption('onTestAction')();
    assert.equal(applyCount, 0);

    config({ wrapActionsBeforeExecute: false });

    instance._createActionByOption('onTestAction2')();
    assert.equal(applyCount, 1);

    scope.$apply = originApply;
    config({ wrapActionsBeforeExecute: originFlag });
});

QUnit.test('The option should be changed if changes occur before scope.$apply calling', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', '{ bindingOptions: { text: \'text\' } }')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.text = 'initial text';
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTest('instance');
    const scope = $markup.scope();

    assert.equal(instance.option('text'), 'initial text');
    assert.equal(scope.text, 'initial text');

    scope.text = 'change1';
    scope.$apply();
    assert.equal(instance.option('text'), 'change1');
    assert.equal(scope.text, 'change1');

    instance.option('text', 'change2');
    scope.$apply();
    assert.equal(instance.option('text'), 'change2');
    assert.equal(scope.text, 'change2');

    scope.text = 'change3';
    scope.text = 'change4';
    scope.$apply();
    assert.equal(instance.option('text'), 'change4');
    assert.equal(scope.text, 'change4');

    instance.option('text', 'change5');
    instance.option('text', 'change6');
    scope.$apply();
    assert.equal(instance.option('text'), 'change6');
    assert.equal(scope.text, 'change6');
});

QUnit.test('The \'release\' method shouldn\'t be called for an unlocked Lock object (T400093)', function(assert) {
    const MyComponent = DOMComponent.inherit({
        _getDefaultOptions() {
            return $.extend(this.callBase(), {
                onTestAction(args) {
                    args.instance.option('text', 'second');
                    args.instance.option('text', 'third');
                    args.instance.option('obj.text', 'second');
                    args.instance.option('obj.text', 'third');
                }
            });
        },
        emulateAction() {
            const testAction = this._createActionByOption('onTestAction');
            testAction({ instance: this });
        },
        _useTemplates() {
            return false;
        }
    });
    registerComponent('dxMyComponentWithWrappedAction', MyComponent);

    const $markup = $('<div></div>')
        .attr('dx-my-component-with-wrapped-action', '{ bindingOptions: { text: \'text\', obj: \'obj\' } }')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.text = 'first';
        $scope.obj = { text: 'first' };
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxMyComponentWithWrappedAction('instance');
    const scope = $markup.scope();

    try {
        instance.emulateAction();
        assert.ok(true, 'the error is not thrown');
    } catch(e) {
        assert.ok(false, 'the error is thrown (The \'release\' method was called for an unlocked Lock object)');
    }
    assert.equal(instance.option('text'), 'third');
    assert.equal(scope.text, 'third');
    assert.equal(instance.option('obj').text, 'third');
    assert.equal(scope.obj.text, 'third');
});

QUnit.test('Lockers works correctly when method _optionChangedCallbacks occur in external apply phase (T386467)', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', '{ bindingOptions: {text: \'myText\'} }')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.myText = '';
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTest('instance');
    const scope = $markup.scope();

    scope.$apply(() => {
        try {
            instance.option('text', 'testText');
            assert.ok(true, 'the error is not thrown');
        } catch(e) {
            assert.ok(false, 'the error is thrown');
        }
    });
});

QUnit.test('Lockers works correctly for composite option (T382985)', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', '{ testOption: testOption, bindingOptions: { \'testOption.text\': \'testOption.text\' } }')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.testOption = {};
    });

    angular.bootstrap(this.$container, ['testApp']);

    const scope = $markup.scope();
    const instance = $markup.dxTest('instance');

    scope.$apply(() => {
        scope.testOption.text = 'testText';
    });

    assert.equal(instance.option('testOption').text, 'testText', 'binding worked');

    scope.$apply(() => {
        scope.testOption.text = '';
    });

    assert.equal(instance.option('testOption').text, '', 'binding worked');
});

QUnit.test('Lockers works correctly for defineProperty (T396622)', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', '{ bindingOptions: { text: \'publicText\' } }')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.privateText = 'test';

        Object.defineProperty($scope, 'publicText', {
            get() {
                return $scope.privateText;
            },
            set(value) {
                $scope.privateText = 'calculatedText';
            }
        });
    });

    angular.bootstrap(this.$container, ['testApp']);

    const scope = $markup.scope();
    const instance = $markup.dxTest('instance');

    assert.equal(instance.option('text'), 'test', 'binding worked');
    assert.equal(scope.publicText, 'test', 'binding worked');

    instance.option('text', 'test2');

    assert.equal(instance.option('text'), 'calculatedText', 'binding worked');
    assert.equal(scope.publicText, 'calculatedText', 'binding worked');
});

QUnit.test('Binding works if options config object added to $scope after bootstrap (T314032)', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', 'testSettings')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.myText = 'testText';
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTest('instance');
    const scope = $markup.scope();

    scope.$apply(() => {
        scope.testSettings = {
            bindingOptions: { text: 'myText' }
        };
    });

    assert.equal(instance.option('text'), 'testText');

    instance.option('text', 'testText2');

    assert.equal(scope.myText, 'testText2');
});

QUnit.test('changing several options causes single render', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', 'testSettings')
        .appendTo(this.$controller);

    let renderedCount = 0;

    this.testApp.controller('my-controller', $scope => {
        $scope.myText = 'testText';
        $scope.myObj = { a: 1 };
        $scope.testSettings = {
            bindingOptions: { text: 'myText', obj: 'myObj' }
        };
    });

    angular.bootstrap(this.$container, ['testApp']);

    const scope = $markup.scope();

    this.componentRendered.add(() => {
        renderedCount++;
    });

    scope.$apply(() => {
        scope.myText = 'testText 2';
        scope.myObj = { b: 2 };
    });

    assert.equal(renderedCount, 1);
});

QUnit.test('beginUpdate and endUpdate must be called in pairs (T373299)', function(assert) {
    let beginWithoutEnd = 0;
    let endWithoutBegin = 0;

    const myComponent = DOMComponent.inherit({
        beginUpdate() {
            beginWithoutEnd++;
            this.callBase();
        },
        endUpdate() {
            if(beginWithoutEnd === 0) {
                endWithoutBegin++;
            } else {
                beginWithoutEnd--;
            }
            this.callBase();
        },
        _useTemplates() {
            return false;
        }
    });

    registerComponent('dxMytest', myComponent);

    const $markup = $('<div dx-mytest=\'settings\'></div>');
    $markup.appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.myText = 'testText';
    });

    angular.bootstrap(this.$container, ['testApp']);

    const scope = $markup.scope();
    scope.$apply(() => {
        scope.settings = {
            bindingOptions: {
                text: 'myText'
            }
        };
    });

    assert.equal(beginWithoutEnd, 0, 'endUpdate was not called without beginUpdate');
    assert.equal(endWithoutBegin, 0, 'beginUpdate was not called without endUpdate');
});

QUnit.test('beginUpdate and endUpdate shouldn\'t fire only once for each apply', function(assert) {
    let beginUpdate = 0;
    let endUpdate = 0;

    const myComponent = DOMComponent.inherit({
        beginUpdate() {
            beginUpdate++;
            this.callBase();
        },
        endUpdate() {
            endUpdate++;
            this.callBase();
        },
        _useTemplates() {
            return false;
        }
    });

    registerComponent('dxMytest', myComponent);

    const $markup = $('<div ng-repeat=\'item in items\'><div dx-mytest=\'settings\' ></div></div>');
    $markup.appendTo(this.$controller);

    let scope;
    this.testApp.controller('my-controller', $scope => {
        scope = $scope;
        $scope.items = [1];
    });

    angular.bootstrap(this.$container, ['testApp']);

    const expectedUpdate = 2 * beginUpdate + 1;

    scope.$apply(() => {
        scope.items.push(2);
    });

    assert.equal(beginUpdate, expectedUpdate, 'endUpdate was not called without beginUpdate');
    assert.equal(endUpdate, expectedUpdate, 'beginUpdate was not called without endUpdate');
});

QUnit.test('Angular component should have \'templatesRenderAsynchronously\' option (T351071)', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', 'options')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.options = {};
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTest('instance');

    assert.ok(instance.option('templatesRenderAsynchronously'), 'option should exist');
});

QUnit.test('Angular component should not fire \'triggerResizeEvent\' on \'contentReady\' event (T351071)', function(assert) {
    this.clock = sinon.useFakeTimers();

    const resizeEventSpy = sinon.spy(domUtils, 'triggerResizeEvent');

    const $markup = $('<div></div>')
        .attr('dx-test', 'options')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.options = {};
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTest('instance');
    instance._eventsStrategy.fireEvent('contentReady', {});

    this.clock.tick();

    assert.ok(!resizeEventSpy.called);

    this.clock.restore();
});

QUnit.test('options with undefined value should be passed correctly', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-test', 'options')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.options = {
            text: undefined
        };
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTest('instance');
    assert.equal(instance.option('text'), undefined, 'option is passed correctly');
});

QUnit.test('Binding with several nested options with same parent should work correctly', function(assert) {
    const TestComponentWithDeprecated = DOMComponent.inherit({
        _setDeprecatedOptions() {
            this.callBase();

            this._deprecatedOptions['root.deprecated'] = { alias: 'root.child1' };
        },
        _useTemplates() {
            return false;
        }
    });
    registerComponent('dxTestWithDeprecated', TestComponentWithDeprecated);

    const $markup = $('<div>')
        .attr('dx-test-with-deprecated', '{ root: { }, bindingOptions: { \'root.child1\': \'prop\', \'root.child2\': \'prop\' } }')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.prop = true;
    });

    angular.bootstrap(this.$container, ['testApp']);

    const instance = $markup.dxTestWithDeprecated('instance');
    const scope = $markup.scope();

    scope.$apply(() => {
        scope.prop = false;
    });

    assert.equal(instance.option('root.child1'), false);
    assert.equal(instance.option('root.child2'), false);
});

QUnit.test('Components should not affect on eachother lock engines', function(assert) {
    let needUpdating;
    const TestComponentWithEndUpdateAction = DOMComponent.inherit({
        endUpdate(...args) {
            if(needUpdating) {
                needUpdating = false;
                this._createActionByOption('onUpdate')();
            }
            this.callBase(...args);
        },
        _useTemplates() {
            return false;
        }
    });

    registerComponent('dxTestWithAction', TestComponentWithEndUpdateAction);

    const $testElement = $('<div>').attr('dx-test', '{ bindingOptions: { text: \'prop\' } }');
    const $badNeighbor = $('<div>').attr('dx-test-with-action', '{ onUpdate: onUpdate }');

    this.$controller.append($badNeighbor).append($testElement);

    this.testApp.controller('my-controller', $scope => {
        $scope.prop = 'value 1';
        $scope.onUpdate = () => {};
    });

    angular.bootstrap(this.$container, ['testApp']);

    const scope = this.$controller.scope();
    const instance = $testElement.dxTest('instance');

    scope.$apply(() => {
        instance.option('text', 'value 2');
        needUpdating = true;
    });

    instance.option('text', 'value 3');

    assert.equal(scope.prop, 'value 3');
});

QUnit.module('nested Widget with templates enabled', {
    beforeEach() {
        const TestContainer = Widget.inherit({

            _getDefaultOptions() {
                return $.extend(this.callBase(), {
                    text: ''
                });
            },

            _render() {
                const content = $('<div />')
                    .addClass('dx-content')
                    .appendTo(this.$element());

                this.option('integrationOptions.templates')['template'].render({
                    container: content
                });

                const text = this.option('text');
                if(text) {
                    content.append($('<span />').addClass('text-by-option').text(text));
                }
            },

            _renderContentImpl: noop,

            _clean() {
                this.$element().empty();
            },

            _optionChanged() {
                this._invalidate();
            }

        });

        const TestWidget = Widget.inherit({

            _getDefaultOptions() {
                return $.extend(this.callBase(), {
                    text: ''
                });
            },

            _render() {
                this.$element().append($('<span />').text(this.option('text')));
            },

            _renderContentImpl: noop,

            _clean() {
                this.$element().empty();
            },

            _optionChanged() {
                this._invalidate();
            }
        });

        this.testApp = angular.module('testApp', ['dx']);

        this.$container = $('<div/>').appendTo(FIXTURE_ELEMENT());
        this.$controller = $('<div></div>')
            .attr('ng-controller', 'my-controller')
            .appendTo(this.$container);

        registerComponent('dxTestContainer', TestContainer);
        registerComponent('dxTestWidget', TestWidget);

        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

QUnit.test('two nested containers', function(assert) {
    const $markup = $(
        '<div class=\'outerWidget\' dx-test-container>' +
            '   <div data-options=\'dxTemplate: { name: "template" }\' class=\'outer-template\'>' +
            '       <span ng-bind=\'vm.outerText\'></span>' +
            '       <div class=\'innerWidget\' dx-test-container>' +
            '           <div data-options=\'dxTemplate: { name: "template" }\' >' +
            '               <span ng-bind=\'vm.innerText\'></span>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>'
    ).appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.vm = {
            outerText: 'outer',
            innerText: 'inner'
        };
    });

    angular.bootstrap(this.$container, ['testApp']);

    const outerWidget = $markup;
    assert.equal(outerWidget.length, 1);

    const outerContent = outerWidget.children().children().children();
    assert.equal(outerContent.length, 2);
    assert.equal(outerContent.filter('span').text(), 'outer');

    const innerWidget = outerContent.filter('.innerWidget');
    assert.equal(innerWidget.length, 1);
    assert.equal(innerWidget.find('span').text(), 'inner');
});

QUnit.test('Dispose nested containers', function(assert) {
    const $markup = $(
        '<div class=\'container\'>' +
                '<div class=\'outer\' dx-test-container>' +
                    '<div data-options=\'dxTemplate: { name: "template" }\'>' +
                        '<div class=\'inner\' dx-test-container>123</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
    ).appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => { });

    angular.bootstrap(this.$container, ['testApp']);

    const outer = $markup.find('.outer').dxTestContainer('instance');
    const inner = $markup.find('.inner').dxTestContainer('instance');
    let outerDisposed = false;
    let innerDisposed = false;

    outer.on('disposing', () => {
        outerDisposed = true;
    });

    inner.on('disposing', () => {
        innerDisposed = true;
    });

    outer.$element().remove();
    assert.ok(outerDisposed);
    assert.ok(innerDisposed);
});


QUnit.test('widget inside two nested containers', function(assert) {
    const $markup = $(
        '<div dx-test-container=\'{ bindingOptions: { text: "vm.outerText" } }\'>' +
            '   <div class=\'middle\' dx-test-container=\'{ bindingOptions: { text: "vm.middleText" } }\'>' +
            '       <div class=\'inner\' dx-test-widget=\'{ bindingOptions: { text: "vm.innerText" } }\'></div>' +
            '   </div>' +
            '</div>'
    ).appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.vm = {
            outerText: 'outerText',
            middleText: 'middleText',
            innerText: 'innerText'
        };
    });

    angular.bootstrap(this.$container, ['testApp']);

    const scope = $markup.scope();

    scope.$apply(() => {
        scope.vm.outerText = 'new outerText';
        scope.vm.middleText = 'new middleText';
        scope.vm.innerText = 'new innerText';
    });

    const outer = $markup;
    assert.equal($.trim(outer.find('.dx-content:first > span').text()), 'new outerText');

    const middle = $markup.find('.middle');
    assert.equal($.trim(middle.find('.dx-content:first > span').text()), 'new middleText');

    const inner = $markup.find('.inner');
    assert.equal($.trim(inner.find('span').text()), 'new innerText');
});

QUnit.test('angular integration don\'t breaks defaultOptions', function(assert) {
    const TestDOMComponent = DOMComponent.inherit({
        _useTemplates() {
            return false;
        }
    });

    registerComponent('dxTestDOMComponent', TestDOMComponent);

    TestDOMComponent.defaultOptions({
        options: {
            test: 'customValue'
        }
    });

    assert.equal(new TestDOMComponent($('<div/>')).option('test'), 'customValue', 'default option sets correctly');
});

QUnit.test('dynamic templates should be supported by angular', function(assert) {
    const TestContainer = Widget.inherit({
        _renderContentImpl(template) {
            this._getTemplateByOption('template').render({
                container: this.$element()
            });
        }
    });

    registerComponent('dxTestContainerEmpty', TestContainer);

    const $markup = $('<div dx-test-container-empty=\'{ bindingOptions: { template: "vm.template" } }\'></div>').appendTo(this.$controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.text = 'Test';
        $scope.vm = {
            template() {
                return $('<script type="text/html" id="scriptTemplate"><div>{{text}}</div></script>');
            }
        };
    });

    angular.bootstrap(this.$container, ['testApp']);
    assert.equal($.trim($markup.text()), 'Test');
});

QUnit.test('Transclude inside dxComponent template (T318690). Since angularjs 1.3', function(assert) {
    assert.expect(1);
    this.testApp.directive('testDirective', () => ({
        restrict: 'E',
        transclude: true,

        template: '<div dx-test-container>' +
                '<div data-options=\'dxTemplate: { name: "template" }\'>' +
                    '<div ng-transclude></div>' +
                '</div>' +
            '</div>'
    }));

    const $container = $('<div/>').appendTo(FIXTURE_ELEMENT());
    const $markup = $('<test-directive><div class=\'transcluded-content\'></div></test-directive>').appendTo($container);

    angular.bootstrap($container, ['testApp']);

    assert.equal($markup.children('[dx-test-container]').find('.transcluded-content').length, 1);
});

QUnit.test('Multi-slot transclusion should work with dx temapltes', function(assert) {
    const TestContainer = Widget.inherit({
        _renderContentImpl(template) {
            template = template || this.option('integrationOptions.templates').template;
            if(template) {
                template.render({
                    container: this.$element()
                });
            }
        }
    });

    registerComponent('dxTestTranscluded', TestContainer);
    this.testApp.directive('testMultiTransclude', () => ({
        restrict: 'E',
        transclude: {
            'content': '?content',
        },
        template: `<div dx-test-transcluded="{}">
                    <div data-options="dxTemplate: { name: 'template'}">
                        <div ng-transclude="content"></div>
                    </div>
                </div>`
    }));

    const $container = $('<div/>').appendTo(FIXTURE_ELEMENT());
    $(`<test-multi-transclude>
        <content>Test content</content>
    </test-multi-transclude>`).appendTo($container);

    angular.bootstrap($container, ['testApp']);

    assert.equal($container.find('[dx-test-transcluded] content').text(), 'Test content');
});

QUnit.module('Widget & CollectionWidget with templates enabled', {
    beforeEach() {
        this.testApp = angular.module('testApp', ['dx']);

        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

QUnit.test('default NG template is not retrieved for widgets created with angular', function(assert) {
    const TestContainer = Widget.inherit({
        _renderContentImpl(template) {
            template = template || this.option('integrationOptions.templates').template;
            if(template) {
                template.render({
                    container: this.$element()
                });
            }
        }
    });

    registerComponent('dxTestContainerEmpty', TestContainer);

    let $markup;
    let instance;
    let template;
    const $container = $('<div/>').appendTo(FIXTURE_ELEMENT());

    // angular scenario
    $markup = $('<div dx-test-container-empty></div>').appendTo($container);
    angular.bootstrap($container, ['testApp']);

    instance = $markup.dxTestContainerEmpty('instance');
    template = instance._getTemplate('test');
    assert.ok((template instanceof NgTemplate), 'default NG template is not retrieved');

    // jquery scenario
    $markup = $('<div></div>')
        .appendTo($container)
        .dxTestContainerEmpty({});
    instance = $markup.dxTestContainerEmpty('instance');
    template = instance._getTemplate('test');
    assert.ok(!(template instanceof NgTemplate), 'default NG template not retrieved');
});

QUnit.test('retrieving default NG template for collection widgets created with angular', function(assert) {
    const TestContainer = CollectionWidget.inherit({
        _renderContentImpl(template) {
            template = template || this.option('integrationOptions.templates').template;
            if(template) {
                template.render({
                    container: this.$element()
                });
            }
        }
    });

    registerComponent('dxTestContainerEmpty', TestContainer);

    let $markup;
    let instance;
    let template;
    const $container = $('<div/>').appendTo(FIXTURE_ELEMENT());

    // angular scenario
    $markup = $('<div dx-test-container-empty></div>').appendTo($container);
    angular.bootstrap($container, ['testApp']);

    instance = $markup.dxTestContainerEmpty('instance');
    template = instance._getTemplate('test');
    assert.ok((template instanceof NgTemplate), 'default NG template is not retrieved');

    // jquery scenario
    $markup = $('<div></div>')
        .appendTo($container)
        .dxTestContainerEmpty({});
    instance = $markup.dxTestContainerEmpty('instance');
    template = instance._getTemplate('test');
    assert.ok(!(template instanceof NgTemplate), 'default NG template not retrieved');
});

QUnit.test('creates anonymous template from its contents', function(assert) {
    const TestContainer = DOMComponent.inherit({
        _getDefaultOptions() {
            return $.extend(this.callBase(), {
                items: null
            });
        },

        _render() {
            this.option('integrationOptions.templates')['template'].render({
                container: this.$element()
            });
        },

        _renderContentImpl: noop,

        _clean() {
            this.$element().empty();
        }
    });

    registerComponent('dxTestContainerAnonymousTemplate', TestContainer);

    const $container = $('<div/>').appendTo(FIXTURE_ELEMENT());

    const $controller = $('<div/>')
        .attr('ng-controller', 'my-controller')
        .appendTo($container);

    const $markup = $(
        '<div dx-test-container-anonymous-template=\'{ bindingOptions: { items: "vm.items" } }\'>' +
        '   <ul>' +
        '       <li ng-repeat=\'item in vm.items\' ng-bind=\'item\'></li>' +
        '   </ul>' +
        '</div>'
    ).appendTo($controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.vm = {
            items: [1, 2, 3]
        };
    });

    angular.bootstrap($container, ['testApp']);

    const instance = $markup.dxTestContainerAnonymousTemplate('instance');

    assert.ok(instance.option('integrationOptions.templates'));
    assert.ok(instance.option('integrationOptions.templates')['template']);

    const list = $markup.find('ul');
    assert.equal(list.length, 1);

    const listItems = list.children();
    assert.equal(listItems.length, 3);
    assert.equal(listItems.text(), '123');
});


QUnit.test('correct scope as model for template', function(assert) {
    const TestContainer = Widget.inherit({
        _getDefaultOptions() {
            return $.extend(this.callBase(), {
                items: null
            });
        },

        _render() {
            this.option('integrationOptions.templates')['template'].render({
                container: this.$element()
            });
        },

        _renderContentImpl: noop,

        _clean() {
            this.$element().empty();
        }
    });

    registerComponent('dxTestContainerDataTemplate', TestContainer);

    const $container = $('<div/>').appendTo(FIXTURE_ELEMENT());

    const $controller = $('<div/>')
        .attr('ng-controller', 'my-controller')
        .appendTo($container);

    const $markup = $(
        '<div dx-test-container-data-template>' +
        '   <div>{{vm.text}}</div>' +
        '</div>'
    ).appendTo($controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.vm = {
            text: 'My text'
        };
    });

    angular.bootstrap($container, ['testApp']);

    assert.equal($.trim($markup.text()), 'My text');

    const parentScope = $markup.scope();
    const childScope = $markup.children().scope();

    parentScope.$apply(() => {
        parentScope.vm.text = 'New text';
    });

    assert.equal(childScope.vm.text, 'New text');
    assert.equal($.trim($markup.text()), 'New text');

    childScope.$apply(() => {
        childScope.vm.text = 'New text 2';
    });

    assert.equal(parentScope.vm.text, 'New text 2');
});

QUnit.test('two-way binding works correct for inner component (T577900)', function(assert) {
    const MyComponent = DOMComponent.inherit({
        emulateAction() {
            this._createActionByOption('onClick')();
        },
        _useTemplates() {
            return false;
        }
    });
    registerComponent('dxComponentWithInnerComponent', MyComponent);

    const $container = $('<div/>').appendTo(FIXTURE_ELEMENT());

    const $controller = $('<div/>')
        .attr('ng-controller', 'my-controller as $ctrl')
        .appendTo($container);

    $('<inner-component></inner-component>').appendTo($controller);

    this.testApp.controller('my-controller', () => {});

    angular.module('testApp').component('innerComponent', {
        controller() {
            this.widgetSettings = {
                onClick(args) {
                    const prevText = args.component.option('text');
                    args.component.option('text', prevText + '1');
                },
                bindingOptions: {
                    text: '$ctrl.text'
                }
            };
        },
        template:
            '<div id=\'test\'>{{$ctrl.text}}</div>' +
            '<div id=\'widget\' dx-component-with-inner-component=\'$ctrl.widgetSettings\'></div>'
    });

    angular.bootstrap($container, ['testApp']);

    const testField = $('#test');
    const instance = $('#widget').dxComponentWithInnerComponent('instance');

    assert.equal(testField.text(), '');
    assert.equal(instance.option('text'), undefined);

    instance.emulateAction();

    assert.equal(testField.text(), 'undefined1');
    assert.equal(instance.option('text'), 'undefined1');

    instance.emulateAction();

    assert.equal(testField.text(), 'undefined11');
    assert.equal(instance.option('text'), 'undefined11');
});

QUnit.test('Directive is in DOM on linking (T306481)', function(assert) {
    assert.expect(1);
    const TestContainer = Widget.inherit({
        _render() {
            this.option('integrationOptions.templates')['template'].render({
                container: this.$element()
            });
        },
        _renderContentImpl: noop,
        _clean() {
            this.$element().empty();
        }
    });

    registerComponent('dxTestContainerWidget', TestContainer);

    this.testApp.directive('customDirective', () => ({
        restrict: 'E',
        replace: true,
        template: '<div>InnerContent</div>',

        link(scope, element) {
            assert.equal($(element).parent().length, 1, 'T306481');
        }
    }));

    const $container = $('<div/>').appendTo(FIXTURE_ELEMENT());

    $(
        '<div dx-test-container-widget=\'{}\'>' +
        '   <custom-directive/>' +
        '</div>'
    ).appendTo($container);

    angular.bootstrap($container, ['testApp']);
});

QUnit.test('Widget options does not override scope properties', function(assert) {
    const TestContainer = Widget.inherit({
        _renderContentImpl(template) {
            template = template || this.option('integrationOptions.templates').template;
            if(template) {
                template.render({
                    model: { text: 'Widget model' },
                    container: this.$element()
                });
            }
        }
    });

    registerComponent('dxTestContainer1', TestContainer);


    const $container = $('<div/>').appendTo(FIXTURE_ELEMENT());

    const $controller = $('<div/>')
        .attr('ng-controller', 'my-controller')
        .appendTo($container);

    const $markup = $(
        '<div dx-test-container1=\'{ }\'>' +
        '   <div>{{text}}</div>' +
        '</div>'
    ).appendTo($controller);

    this.testApp.controller('my-controller', $scope => {
        $scope.text = 'Controller model';
    });

    angular.bootstrap($container, ['testApp']);

    assert.equal($.trim($markup.text()), 'Controller model');
});

QUnit.module('ui.collectionWidget', {
    beforeEach() {
        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

const initMarkup = ($markup, controller) => {
    const TestCollectionContainer = CollectionWidget.inherit({
        _itemClass() {
            return 'dx-test-item';
        },

        _itemDataKey() {
            return 'dxTestItemData';
        }
    });

    const TestWidget = Widget.inherit({
        _getDefaultOptions() {
            return $.extend(this.callBase(), {
                text: ''
            });
        },

        _render() {
            this.$element().append($('<span />').text(this.option('text')));
        },

        _clean() {
            this.$element().empty();
        }
    });

    registerComponent('dxTestCollectionContainer', TestCollectionContainer);
    registerComponent('dxTestWidget', TestWidget);

    const $container = $('<div/>').appendTo(FIXTURE_ELEMENT());

    $('<div/>')
        .attr('ng-controller', 'my-controller')
        .appendTo($container)
        .append($markup);

    angular.module('testApp', ['dx']).controller('my-controller', controller);

    angular.bootstrap($container, ['testApp']);

    return $markup;
};

QUnit.test('collection container item value escalates to scope', function(assert) {
    const controller = $scope => {
        $scope.collection = [
            { widgetText: 'my text' }
        ];
    };

    const $markup = initMarkup($(
        '<div dx-test-collection-container="{ bindingOptions: { items: \'collection\' } }" dx-item-alias="item">' +
        '   <div data-options=\'dxTemplate: { name: "item" }\' dx-test-widget=\'{ bindingOptions: { text: "item.widgetText" } }\'>' +
        '   </div>' +
        '</div>'
    ), controller);

    const scope = $markup.scope();

    const $item = $markup.children().children().eq(0);
    assert.equal($item.dxTestWidget('instance').option('text'), 'my text');

    scope.$apply(() => {
        scope.collection[0].widgetText = 'new text';
    });
    assert.equal($item.dxTestWidget('instance').option('text'), 'new text');

    $item.dxTestWidget('instance').option('text', 'own text');

    assert.equal(scope.collection[0].widgetText, 'own text');
});

QUnit.test('collection container primitive item value escalates to scope', function(assert) {
    const controller = $scope => {
        $scope.collection = ['my text'];
    };

    const $markup = initMarkup($(
        '<div dx-test-collection-container="{ bindingOptions: { items: \'collection\' } }" dx-item-alias="item">' +
        '   <div data-options=\'dxTemplate: { name: "item" }\' dx-test-widget=\'{ bindingOptions: { text: "item" } }\'>' +
        '   </div>' +
        '</div>'
    ), controller);

    const scope = $markup.scope();

    let $item = $markup.children().children().eq(0);
    assert.equal($item.dxTestWidget('instance').option('text'), 'my text');

    scope.$apply(() => {
        scope.collection[0] = 'new text';
    });
    $item = $markup.children().children().eq(0);
    assert.equal($item.dxTestWidget('instance').option('text'), 'new text');

    $item.dxTestWidget('instance').option('text', 'own text');

    assert.equal(scope.collection[0], 'own text');
});

QUnit.test('collection container item value escalates to scope: complex paths', function(assert) {
    const controller = $scope => {
        $scope.vm = {
            collection: [
                { data: { widgetText: 'my text' } }
            ]
        };
    };

    const $markup = initMarkup($(
        '<div dx-test-collection-container="{ bindingOptions: { items: \'vm.collection\' } }" dx-item-alias="item">' +
        '   <div data-options=\'dxTemplate: { name: "item" }\' dx-test-widget=\'{ bindingOptions: { text: "item.data.widgetText" } }\'>' +
        '   </div>' +
        '</div>'
    ), controller);

    const scope = $markup.scope();

    const $item = $markup.children().children().eq(0);
    assert.equal($item.dxTestWidget('instance').option('text'), 'my text');

    scope.$apply(() => {
        scope.vm.collection[0].data.widgetText = 'new text';
    });
    assert.equal($item.dxTestWidget('instance').option('text'), 'new text');

    $item.dxTestWidget('instance').option('text', 'own text');

    assert.equal(scope.vm.collection[0].data.widgetText, 'own text');
});

QUnit.test('Bootstrap should not fail if container component changes element markup on init (Problem after updating Angular to 1.2.16)', function(assert) {
    const controller = $scope => {
        $scope.vm = {
            items: [
                { text: '0' },
                { text: '1' }
            ]
        };

        $scope.listOptions = {
            data: 'vm',
            bindingOptions: {
                items: 'items'
            }
        };
    };

    initMarkup($(
        '<div dx-list=\'listOptions\'>' +
            '<div data-options="dxTemplate: { name: \'item\' } " dx-button="{ bindingOptions: { text: text } }">' +
            '</div>' +
        '</div>'
    ), controller);

    assert.ok(true, 'no fails on bootstrap');
});

QUnit.test('Global scope properties are accessible from item template', function(assert) {
    this.clock = sinon.useFakeTimers();

    const controller = $scope => {
        $scope.collection = [
            { itemText: 'Item text' }
        ];

        $scope.globalText = 'Global text';
    };

    const $markup = initMarkup($(
        '<div dx-test-collection-container="{ bindingOptions: { items: \'collection\' } }" dx-item-alias="item">' +
        '   <div data-options=\'dxTemplate: { name: "item" }\'>' +
        '       <div ng-bind=\'item.itemText\' class=\'item-text\'>' +
        '       </div>' +
        '       <div ng-bind=\'globalText\' class=\'global-text\'>' +
        '       </div>' +
        '   </div>' +
        '</div>'
    ), controller);

    this.clock.tick();

    assert.equal($('.item-text', $markup).text(), 'Item text');
    assert.equal($('.global-text', $markup).text(), 'Global text');

    this.clock.restore();
});

QUnit.test('binding to circular data (T144697)', function(assert) {
    const controller = $scope => {
        $scope.collection = [];
        $scope.collection.push({
            text: 'Item text',
            parent: $scope.collection
        });
    };

    const $markup = initMarkup($(
        '<div dx-test-collection-container="{ bindingOptions: { items: \'collection\' } }"></div>'
    ), controller);

    const scope = $markup.scope();

    assert.equal($.trim($markup.text()), 'Item text');

    scope.$apply(() => {
        scope.collection[0].text = 'New text';
    });

    assert.equal($.trim($markup.text()), 'New text');
});

QUnit.test('watcher type changed (T145604)', function(assert) {
    const data = [];

    const controller = $scope => {
        $scope.collection = undefined;// Important!!!
    };

    const $markup = initMarkup($(
        '<div dx-test-collection-container="{ bindingOptions: { items: \'collection\' } }"></div>'
    ), controller);

    const scope = $markup.scope();


    for(let i = 0; i < 100; i++) {
        data.push({
            text: 'Item text ' + i
        });
    }

    // render items can take some time
    scope.$apply(() => {
        scope.collection = data;
    });

    // change item's property shouldn't recompare the whole collection
    const $watchOld = scope['$watch'];

    const watchLog = [];

    scope['$watch'] = function(...args) {
        watchLog.push(args);
        return $watchOld.apply(args, this);
    };
    scope.$apply(() => {
        scope.collection[0].text = 'New text';
    });
    assert.equal(watchLog.length, 0, '$watch shouldn\'t be used');
});

QUnit.test('Defining item data alias by \'itemAlias\' with custom template for all items', function(assert) {
    const controller = $scope => {
        $scope.collection = [1, 2, 3];
    };

    const $markup = initMarkup($(
        '<div dx-test-collection-container="{ bindingOptions: { items: \'collection\' } }" dx-item-alias="item">' +
        '   <div data-options=\'dxTemplate: { name: "item" }\'>' +
        '       <div dx-test-widget="{ bindingOptions: { text: \'item\' } }" class="test-widget"></div>' +
        '   </div>' +
        '</div>'
    ), controller);

    const scope = $markup.scope();

    let $item = $markup.find('.test-widget').eq(0);
    assert.equal($item.dxTestWidget('option', 'text'), '1');

    scope.$apply(() => {
        scope.collection[0] = 'new text';
    });

    $item = $markup.find('.test-widget').eq(0);
    assert.equal($item.dxTestWidget('option', 'text'), 'new text');

    $item.dxTestWidget('option', 'text', 'widget text');
    assert.equal(scope.collection[0], 'widget text');
});

QUnit.test('Defining item data alias by \'itemAlias\' with custom template for some items', function(assert) {
    this.clock = sinon.useFakeTimers();

    const controller = $scope => {
        $scope.collection = [{ name: '0', template: 'customWidget' }, { name: '1', template: 'custom' }, { text: '2' }, '3'];
    };

    const $markup = initMarkup($(
        '<div dx-test-collection-container="{ bindingOptions: { items: \'collection\' } }" dx-item-alias="user">' +
        '   <div data-options=\'dxTemplate: { name: "customWidget" }\'>' +
        '       <div dx-test-widget="{ bindingOptions: { text: \'user.name\' } }" class="test-widget"></div>' +
        '   </div>' +
        '   <div data-options=\'dxTemplate: { name: "custom" }\'>' +
        '       {{user.name}}' +
        '   </div>' +
        '</div>'
    ), controller);

    const scope = $markup.scope();

    this.clock.tick();

    let $items = $markup.children();
    assert.equal($items.eq(0).find('.test-widget').dxTestWidget('option', 'text'), '0');
    assert.equal($.trim($items.eq(1).text()), '1');
    assert.equal($.trim($items.eq(2).text()), '2');
    assert.equal($.trim($items.eq(3).text()), '3');

    scope.$apply(() => {
        scope.collection[0].name = 'new text 0';
        scope.collection[1].name = 'new text 1';
        scope.collection[2].text = 'new text 2';
        scope.collection[3] = 'new text 3';
    });

    this.clock.tick();

    $items = $markup.children();
    assert.equal($items.eq(0).find('.test-widget').dxTestWidget('option', 'text'), 'new text 0');
    assert.equal($.trim($items.eq(1).text()), 'new text 1');
    assert.equal($.trim($items.eq(2).text()), 'new text 2');
    assert.equal($.trim($items.eq(3).text()), 'new text 3');

    $items.eq(0).find('.test-widget').dxTestWidget('option', 'text', 'widget text');
    assert.equal(scope.collection[0].name, 'widget text');

    this.clock.restore();
});

QUnit.test('$index is available in markup (T542335)', function(assert) {
    const controller = $scope => {
        $scope.items = [
            { text: 'text1' },
            { text: 'text2' }
        ];
    };

    const $markup = initMarkup($(
        '<div dx-test-collection-container="{ bindingOptions: { items: \'items\' } }" dx-item-alias="item">' +
        '   <div data-options=\'dxTemplate: { name: "item" }\'>' +
        '       <div dx-test-widget="{ bindingOptions: { text: \'$index\' } }" class="test-widget"></div>' +
        '   </div>' +
        '</div>'
    ), controller);

    const $items = $markup.find('.test-widget');

    assert.equal($items.eq(0).dxTestWidget('option', 'text'), '0');
    assert.equal($items.eq(1).dxTestWidget('option', 'text'), '1');
});

QUnit.test('$id in item model not caused exception', function(assert) {
    const controller = $scope => {
        $scope.collection = [
            { text: 'my text', $id: 1 }
        ];
    };

    const $markup = initMarkup($(
        '<div dx-test-collection-container="{ items: collection }">' +
        '</div>'
    ), controller);

    assert.equal($markup.text(), 'my text');
});

QUnit.module('misc and regressions', {
    beforeEach() {
        this.testApp = angular.module('testApp', ['dx']);
        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

QUnit.test('template.render() - data parameter is Scope', function(assert) {
    const TestContainer = Widget.inherit({

        _getDefaultOptions() {
            return $.extend(this.callBase(), {
                text: 'default'
            });
        },

        _init(...args) {
            this.callBase(...args);

            const element = this.$element().get(0);
            this.scope = angular.element(element).scope().$new();
            this.scope.text = this.option('text');
        },

        _render() {
            const content = $('<div />')
                .addClass('dx-content')
                .appendTo(this.$element());

            this.option('integrationOptions.templates')['template'].render({
                model: this.scope,
                container: content
            });
        },

        _renderContentImpl: noop,

        _optionChanged(args) {
            if(args.name === 'text') {
                const that = this;

                that.scope.$apply(() => {
                    that.scope.text = args.value;
                });
            } else {
                this.callBase(args);
            }
        }

    });

    registerComponent('dxTestContainerScope', TestContainer);

    const $container = $('<div/>').appendTo(FIXTURE_ELEMENT());

    const $markup = $(
        '<div dx-test-container-scope=\'{ text: "my text" }\'>' +
        '   <div class=\'text\' ng-bind=\'text\'></div>' +
        '</div>'
    ).appendTo($container);


    angular.bootstrap($container, ['testApp']);

    assert.equal($markup.find('.text').text(), 'my text');
    const instance = $markup.dxTestContainerScope('instance');

    instance.option('text', 'new text');
    assert.equal($markup.find('.text').text(), 'new text');
});

QUnit.test('binding for item of array option', function(assert) {
    const TestCollectionContainer = CollectionWidget.inherit({
        _itemClass() {
            return 'dx-test-item';
        },

        _itemDataKey() {
            return 'dxTestItemData';
        }
    });

    registerComponent('dxTestCollectionContainer', TestCollectionContainer);

    const $container = $('<div/>').appendTo(FIXTURE_ELEMENT());

    const $controller = $('<div/>')
        .attr('ng-controller', 'my-controller')
        .appendTo($container);

    const $markup = $(
        '<div dx-test-collection-container="{ items: [ { text: \'value 1\'}, { }, { } ], bindingOptions: { \'items[1].text\': \'item2\', \'items[2].text\': \'vm.item3\' } }">' +
                '</div>'
    ).appendTo($controller);

    let scope;

    this.testApp.controller('my-controller', $scope => {
        scope = $scope;

        $scope.item2 = 'value 2';
        $scope.vm = {
            item3: 'value 3'
        };
    });

    angular.bootstrap($container, ['testApp']);

    assert.equal($markup.children().eq(1).text(), 'value 2');

    scope.$apply(() => {
        scope.item2 = 'new value 2';
        scope.vm.item3 = 'new value 3';
    });
    assert.equal($markup.children().eq(1).text(), 'new value 2');
    assert.equal($markup.children().eq(2).text(), 'new value 3');

    const instance = $markup.dxTestCollectionContainer('instance');
    instance.option('items', [{ text: 'value 4' }, { text: 'value 5' }, { text: 'value 6' }]);

    assert.equal(scope.item2, 'value 5');
    assert.equal(scope.vm.item3, 'value 6');
});

QUnit.test('all values should be correct displayed in collection widget (T425426)', function(assert) {
    registerComponent('dxTestCollection', CollectionWidget);

    const $container = $('<div/>').appendTo(FIXTURE_ELEMENT());

    const $controller = $('<div/>')
        .attr('ng-controller', 'my-controller')
        .appendTo($container);

    const $markup = $('<div dx-test-collection="{ items: [ 0, 1, null, \'\', undefined, {}, false ] }"></div>').appendTo($controller);

    this.testApp.controller('my-controller', () => { });

    angular.bootstrap($container, ['testApp']);

    assert.equal($markup.children().eq(0).text(), '0');
    assert.equal($markup.children().eq(1).text(), '1');
    assert.equal($markup.children().eq(2).text(), '');
    assert.equal($markup.children().eq(3).text(), '');
    assert.equal($markup.children().eq(4).text(), '');
    assert.equal($markup.children().eq(5).text(), '');
    assert.equal($markup.children().eq(6).text(), 'false');
});

QUnit.test('child collection widget should be rendered correctly when template provider is specified', function(assert) {
    const ChildWidget = Widget.inherit({
        _render() {
            this.callBase();
            this.$element().addClass('child-widget');
        }
    });

    registerComponent('dxChildWidget', ChildWidget);

    const ParentWidget = Widget.inherit({
        _render() {
            this.callBase();
            const $childWidget = $('<div>').appendTo(this.$element());
            this._createComponent($childWidget, 'dxChildWidget');
        }
    });

    registerComponent('dxParentWidget', ParentWidget);

    const $container = $('<div>').appendTo(FIXTURE_ELEMENT());
    const $markup = $('<div dx-parent-widget=\'{}\'></div>')
        .appendTo($container);

    angular.bootstrap($container, ['testApp']);

    assert.equal($markup.dxParentWidget('option', 'templatesRenderAsynchronously'), FIXTURE_ELEMENT().find('.child-widget').dxChildWidget('option', 'templatesRenderAsynchronously'), 'templatesRenderAsynchronously provided');
});


QUnit.test('memory leaks in CollectionWidget', function(assert) {
    const TestCollectionContainer = CollectionWidget.inherit({
        _itemClass() {
            return 'dx-test-item';
        },

        _itemDataKey() {
            return 'dxTestItemData';
        }
    });

    registerComponent('dxLeakTestCollectionContainer', TestCollectionContainer);

    const $container = $('<div/>').appendTo(FIXTURE_ELEMENT());

    const $controller = $('<div/>')
        .attr('ng-controller', 'my-controller')
        .appendTo($container);

    let scope;

    $('<div dx-leak-test-collection-container="{ bindingOptions: { items: \'items\' } }" dx-item-alias="item"><span></span></div>')
        .appendTo($controller);

    this.testApp.controller('my-controller', $scope => {
        scope = $scope;

        $scope.items = [
            { text: 'my text 1' },
            { text: 'my text 2' }
        ];
    });

    angular.bootstrap($container, ['testApp']);

    const calcSiblings = sibling => {
        let result = 0;

        while(sibling) {
            result++;
            sibling = sibling.$$nextSibling;
        }

        return result;
    };

    assert.equal(calcSiblings(scope.$$childHead), 2);

    scope.$apply(() => {
        scope.items.pop();
    });

    assert.equal(calcSiblings(scope.$$childHead), 1);
});

QUnit.test('binding inside ng-repeat (T137200)', function(assert) {
    const TestComponent = DOMComponent.inherit({
        _getDefaultOptions() {
            return { text: '', array: [], obj: null };
        },
        _useTemplates() {
            return false;
        }
    });

    registerComponent('dxRepeatTest', TestComponent);

    const $container = $('<div/>').appendTo(FIXTURE_ELEMENT());

    const $controller = $('<div></div>')
        .attr('ng-controller', 'my-controller')
        .appendTo($container);

    let scope;

    $('<div ng-repeat="vm in items">'
        + '    <div dx-repeat-test="{ bindingOptions: { text: \'vm.text\' } }"></div>'
        + '</div>')
        .appendTo($controller);

    this.testApp.controller('my-controller', $scope => {
        scope = $scope;

        $scope.items = [
            { text: 'my text 1' },
            { text: 'my text 2' },
            { text: 'my text 3' }
        ];
    });

    angular.bootstrap($container, ['testApp']);

    scope.$apply(() => {
        scope.items[0].text = 'new text';
    });

    const $elements = $('[dx-repeat-test]', $container);

    assert.equal($elements.first().dxRepeatTest('option', 'text'), 'new text');
    assert.equal($elements.last().dxRepeatTest('option', 'text'), 'my text 3');
});

QUnit.test('component should notify view model if option changed on ctor after initialization (T219862)', function(assert) {
    const ComponentClass = DOMComponent.inherit({
        _render() {
            this.callBase();
            this.option('a', 2);
        },
        _useTemplates() {
            return false;
        }
    });

    registerComponent('test', ComponentClass);

    const $container = $('<div/>').appendTo(FIXTURE_ELEMENT());

    const $controller = $('<div></div>')
        .attr('ng-controller', 'my-controller')
        .appendTo($container);

    let scope;

    $('<div test="{ bindingOptions: { a: \'a\'} }"></div>').appendTo($controller);

    this.testApp.controller('my-controller', $scope => {
        scope = $scope;
        $scope.a = 1;
    });

    angular.bootstrap($container, ['testApp']);

    assert.equal(scope.a, 2);
});

QUnit.test('Watchers executed after component initialization (T334273)', function(assert) {
    let exceptionFired = false;

    const app = angular.module('app', ['ng', 'dx']).factory('$exceptionHandler', () => (exception, cause) => {
        exceptionFired = true;
    });

    const TestComponent = DOMComponent.inherit({
        _useTemplates() {
            return false;
        }
    });

    registerComponent('dxTest', TestComponent);

    app.directive('customDirective', [
        () => ({
            restrict: 'A',

            template: '<div>' +
                            '<div dx-test="{ bindingOptions: { width: \'w\' }, height: \'0\' }"></div>' +
                        '</div>',

            replace: true,

            compile(tElem, tAttrs) {
                return {
                    'pre': function(scope, iElem, iAttrs, controller) {
                        scope.w = 0;
                    }
                };
            }
        })]);

    const element = $('<div custom-directive></div>').appendTo(FIXTURE_ELEMENT());


    angular.injector(['app']).invoke(($rootScope, $compile) => {
        $compile(element)($rootScope);
    });

    assert.ok(!exceptionFired, 'There is no any exceptions');
});

QUnit.module('component action context', {
    beforeEach() {
        const TestComponent = DOMComponent.inherit({
            _getDefaultOptions() {
                return $.extend(this.callBase(), {
                    onHandler: noop,
                    value: null
                });
            },

            trigger(e) {
                this._createAction(this.option('onHandler'))(e);
            },
            triggerByOption(e) {
                this._createActionByOption('onHandler')(e);
            },
            triggerByOptionCategoryRendering(e) {
                this._createActionByOption('onHandler', { category: 'rendering' })(e);
            },
            _useTemplates() {
                return false;
            }
        });

        this.testApp = angular.module('testApp', ['dx']);
        this.$container = $('<div/>').appendTo(FIXTURE_ELEMENT());
        this.$controller = $('<div></div>')
            .attr('ng-controller', 'my-controller')
            .appendTo(this.$container);

        registerComponent('dxActionTest', TestComponent);

        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

QUnit.test('component action created by option calls scope.$apply', function(assert) {
    const $markup = $('<div dx-action-test=\'{ onHandler: vm.handler }\'></div>')
        .appendTo(this.$controller);

    let valueChanged = false;

    this.testApp.controller('my-controller', $scope => {
        $scope.vm = {
            handler(e) {
                $scope.vm.value = 'new value';
            },
            value: 'old value'
        };

        $scope.$watch('vm.value', (newValue, oldValue) => {
            if(newValue !== oldValue) {
                valueChanged = true;
            }
        });
    });

    angular.bootstrap(this.$container, ['testApp']);

    $markup.dxActionTest('instance').triggerByOption();

    assert.ok(valueChanged);
});

QUnit.test('component internal action does not calls scope.$apply', function(assert) {
    const $markup = $('<div dx-action-test=\'{ onHandler: vm.handler }\'></div>')
        .appendTo(this.$controller);

    let valueChanged = false;

    this.testApp.controller('my-controller', $scope => {
        $scope.vm = {
            handler(e) {
                $scope.vm.value = 'new value';
            },
            value: 'old value'
        };

        $scope.$watch('vm.value', (newValue, oldValue) => {
            if(newValue !== oldValue) {
                valueChanged = true;
            }
        });
    });

    angular.bootstrap(this.$container, ['testApp']);

    $markup.dxActionTest('instance').trigger();

    assert.ok(!valueChanged);
});

QUnit.test('component created by option with category \'rendering\' does not calls scope.$apply', function(assert) {
    const $markup = $('<div dx-action-test=\'{ onHandler: vm.handler }\'></div>')
        .appendTo(this.$controller);

    let valueChanged = false;

    this.testApp.controller('my-controller', $scope => {
        $scope.vm = {
            handler(e) {
                $scope.vm.value = 'new value';
            },
            value: 'old value'
        };

        $scope.$watch('vm.value', (newValue, oldValue) => {
            if(newValue !== oldValue) {
                valueChanged = true;
            }
        });
    });

    angular.bootstrap(this.$container, ['testApp']);

    $markup.dxActionTest('instance').triggerByOptionCategoryRendering();

    assert.ok(!valueChanged);
});

// related with Q566857
QUnit.test('change option in component action handler (phase $apply) ', function(assert) {
    const $markup = $('<div dx-action-test="{ onHandler: vm.handler,  bindingOptions: { value: \'vm.value\' }}"></div>')
        .appendTo(this.$controller);

    let scope;


    this.testApp.controller('my-controller', $scope => {
        scope = $scope;
        $scope.vm = {
            handler(e) {
                $markup.dxActionTest('option', 'value', 'new value');
            },
            value: 'old value'
        };
    });

    angular.bootstrap(this.$container, ['testApp']);

    $markup.dxActionTest('instance').triggerByOption();

    assert.equal(scope.vm.value, 'new value');
});

QUnit.test('component action context is component', function(assert) {
    let context;
    const handler = function(e) {
        context = this;
    };

    const $markup = $('<div></div>').appendTo(this.$container);
    $markup.dxActionTest({ onHandler: handler });

    const component = $markup.dxActionTest('instance');
    component.triggerByOption();

    assert.equal(context, component);
});

QUnit.test('Using ng-expressions in dx syntax', function(assert) {
    const $markup = $('<div/>')
        .attr('dx-action-test', '{ onHandler: \'vm.value = "new value"\' }')
        .appendTo(this.$controller);

    let scope;

    this.testApp.controller('my-controller', $scope => {
        scope = $scope;
        $scope.vm = {
            value: 'old value'
        };
    });

    angular.bootstrap(this.$container, ['testApp']);

    $markup.dxActionTest('instance').triggerByOption();

    assert.equal(scope.vm.value, 'new value');
});

QUnit.module('dxComponent as a template', {
    beforeEach() {
        const TemplateComponent = Widget.inherit({});

        this.testApp = angular.module('testApp', ['dx']);
        this.$container = $('<div/>').appendTo(FIXTURE_ELEMENT());

        registerComponent('dxTemplateComponent', TemplateComponent);

        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

QUnit.test('Parent directive scope value goes to template component option object', function(assert) {
    let initialWatchersCount;

    $('<custom-directive/>').appendTo(this.$container);

    this.testApp.directive('customDirective', () => ({
        restrict: 'E',
        replace: true,
        template: '<div dx-template-component="config"></div>',

        link(scope) {
            // NOTE: One uncleared watcher created for dxDigestCallbacks service
            initialWatchersCount = scope.$$watchers.length;

            scope.boundOption = 'default value';
            scope.config = {
                text: 'my text',
                bindingOptions: {
                    boundOption: 'boundOption'
                }
            };
        }
    }));

    angular.bootstrap(this.$container, ['testApp']);

    const $markup = this.$container.children();
    const instance = $markup.dxTemplateComponent('instance');
    const scope = $markup.scope();

    assert.equal(instance.option('text'), 'my text');

    scope.$apply(() => {
        scope.boundOption = 'new value';
    });

    assert.equal(instance.option('boundOption'), 'new value');
    assert.equal(scope.$$watchers.length, initialWatchersCount);
});

QUnit.test('No watchers on disposing', function(assert) {
    $('<custom-directive/>').appendTo(this.$container);

    this.testApp.directive('customDirective', () => ({
        restrict: 'E',
        replace: true,
        template: '<div dx-template-component="config"></div>',
        link(scope) { }
    }));

    angular.bootstrap(this.$container, ['testApp']);

    const $markup = this.$container.children();
    const instance = $markup.dxTemplateComponent('instance');
    const scope = $markup.scope();

    $markup.remove();

    assert.equal(scope.$$watchers.length, 1);// NOTE: One uncleared watcher created for dxDigestCallbacks service
    assert.ok(!!instance);
});


QUnit.test('Component shouldn\'t watch digest callback after dispose', function(assert) {
    let beginCounter = 0;
    let endCounter = 0;

    const TestComponent = DOMComponent.inherit({
        beginUpdate(args) {
            beginCounter++;
            this.callBase(...arguments);
        },
        endUpdate(...args) {
            endCounter++;
            this.callBase(...args);
        },
        _useTemplates() {
            return false;
        }
    });

    registerComponent('dxTestWidget', TestComponent);

    const $markup = $('<div></div>')
        .attr('dx-test-widget', '{}')
        .appendTo(this.$container);

    angular.bootstrap(this.$container, ['testApp']);

    const scope = $markup.scope();
    $markup.remove();

    beginCounter = 0;
    endCounter = 0;
    scope.$apply(() => {});

    assert.equal(beginCounter, 0);
    assert.equal(endCounter, 0);
});
