import registerComponent from 'core/component_registrator';
import config from 'core/config';
import devices from '__internal/core/m_devices';
import DOMComponent from 'core/dom_component';
import dataUtils from 'core/element_data';
import { TemplateManager } from 'core/template_manager';
import { noop } from 'core/utils/common';
import publicComponentUtils from 'core/utils/public_component';
import resizeCallbacks from 'core/utils/resize_callbacks';
import eventsEngine from 'common/core/events/core/events_engine';
import { triggerResizeEvent } from 'common/core/events/visibility_change';
import licenseModule, { setLicenseCheckSkipCondition } from '__internal/core/license/license_validation';
import $ from 'jquery';

const nameSpace = {};

QUnit.testStart(() => {
    const markup = '<div id="component"></div>' + '<div id="anotherComponent"></div>';

    $('#qunit-fixture').html(markup);
});

const RTL_CLASS = 'dx-rtl';

QUnit.module('default', {
    beforeEach: function() {
        this.TestComponentWithTemplate = DOMComponent.inherit({
            _initTemplates() {
                this.callBase();
                this._templateManager.addDefaultTemplates({
                    content: {
                        render() {
                            return 'Default content markup';
                        }
                    }
                });
            }
        });
        this.TestComponent = DOMComponent.inherit({

            ctor(element, options) {
                this._traceLog = [];
                this.callBase(element, options);
            },

            _optionsByReference() {
                return {
                    byReference: true
                };
            },

            _getDefaultOptions() {
                return $.extend(
                    this.callBase(),
                    {
                        opt1: 'default',
                        opt2: 'default'
                    }
                );
            },

            _optionChanged(name, value, prevValue) {
                this._traceLog.push({
                    method: '_optionChanged',
                    arguments: $.makeArray(arguments)
                });

                this.callBase(...arguments);
            },

            _refresh(...args) {
                this._traceLog.push({
                    method: '_refresh',
                    arguments: $.makeArray(args)
                });
                this.callBase(...args);
            },

            _init(...args) {
                this._traceLog.push({
                    method: '_init',
                    arguments: $.makeArray(args)
                });

                this.callBase();
            },

            _render(...args) {
                this._traceLog.push({
                    method: '_render',
                    arguments: $.makeArray(args)
                });

                this.callBase();
            },

            _clean(...args) {
                this._traceLog.push({
                    method: '_clean',
                    arguments: $.makeArray(args)
                });

                this.callBase();
            },

            _invalidate(...args) {
                this._traceLog.push({
                    method: '_invalidate',
                    arguments: $.makeArray(args)
                });
                this.callBase();
            },

            _dispose(...args) {
                this._traceLog.push({
                    method: '_dispose',
                    arguments: $.makeArray(args)
                });
                this.callBase();
            },

            beginUpdate(...args) {
                this._traceLog.push({
                    method: 'beginUpdate',
                    arguments: $.makeArray(args)
                });
                this.callBase();
            },

            endUpdate(...args) {
                this._traceLog.push({
                    method: 'endUpdate',
                    arguments: $.makeArray(args)
                });
                this.callBase();
            },

            func(arg) {
                return arg;
            },

            action() {

            },

            instanceChain() {
                return this;
            },

            _getTraceLogByMethod(methodName) {
                return $.grep(this._traceLog, i => {
                    return i.method === methodName;
                });
            }
        });

        registerComponent('TestComponent', nameSpace, this.TestComponent);
        registerComponent('TestComponentWithTemplate', nameSpace, this.TestComponentWithTemplate);
    },

    afterEach: function() {
        delete $.fn.TestComponent;
    }
}, () => {
    QUnit.test('component has registered', function(assert) {
        assert.strictEqual(nameSpace.TestComponent, this.TestComponent);
        assert.ok('TestComponent' in $());
        assert.equal(publicComponentUtils.name(this.TestComponent), 'TestComponent');
    });

    QUnit.test('obtaining instance from element', function(assert) {
        const element = $('#component').TestComponent();
        if(!QUnit.urlParams['nojquery']) {
            assert.ok(element.TestComponent('instance') instanceof this.TestComponent);
        }
        assert.ok(element.TestComponent('instance') instanceof this.TestComponent);
    });

    QUnit.test('method call api', function(assert) {
        const element = $('#component').TestComponent();
        assert.equal(element.TestComponent('func', 'abc'), 'abc');
        assert.strictEqual(element.TestComponent('action'), undefined);
        assert.ok(element.TestComponent('instance').instanceChain() instanceof this.TestComponent);
    });

    QUnit.test('method call made on not initialized widget throws informative exception', function(assert) {
        let message;
        try {
            $('<div></div>').TestComponent('func');
        } catch(x) {
            message = x.message;
        }
        assert.ok(message.indexOf('TestComponent') > -1);
    });

    QUnit.test('options api', function(assert) {
        const element = $('#component').TestComponent({ opt2: 'custom' });
        const instance = element.TestComponent('instance');

        assert.equal(element.TestComponent('option', 'opt1'), 'default');
        assert.equal(element.TestComponent('option', 'opt2'), 'custom');

        assert.strictEqual(element.TestComponent('option', 'opt1', 'z'), undefined);
        element.TestComponent('option', 'opt1', 'z');

        element.TestComponent('option', 'opt3', 'new');
        assert.equal(instance._getTraceLogByMethod('_optionChanged').length, 2);

        instance.option({
            opt1: 'mass1',
            opt2: 'mass2'
        });

        assert.equal(instance.option('opt1'), 'mass1');
        assert.equal(instance.option('opt2'), 'mass2');
    });

    QUnit.test('component lifecycle, changing a couple of options', function(assert) {
        const TestComponent = this.TestComponent.inherit({
            _optionChanged(args) {
                this.callBase(args);

                if($.inArray(args.name, ['a', 'b', 'c']) > -1) {
                    this._invalidate();
                }
            }
        });

        const instance = new TestComponent('#component', { a: 1 });

        instance.option({
            a: 1,
            b: 2,
            c: 3
        });

        instance.option('b', 2);

        const methodCallStack = $.map(instance._traceLog, i => {
            return i.method;
        });
        const optionChangedArgs = instance._getTraceLogByMethod('_optionChanged');

        assert.deepEqual(methodCallStack, [
            'beginUpdate', // ctor
            'beginUpdate',
            'endUpdate',

            // "beginUpdate", // optionByDevice options applying
            // "endUpdate",

            'endUpdate',
            '_init',
            '_render',

            'beginUpdate',
            '_optionChanged', '_invalidate',
            '_optionChanged', '_invalidate',
            'endUpdate',
            '_refresh',
            '_clean', '_render',

            'beginUpdate',
            'endUpdate'
        ]);

        assert.deepEqual(optionChangedArgs[0].arguments[0].name, 'b');
        assert.deepEqual(optionChangedArgs[1].arguments[0].name, 'c');
    });

    QUnit.test('mass option change', function(assert) {
        const element = $('#component').TestComponent({
            opt1: 'firstCall',
            opt2: 'firstCall'
        });

        const instance = element.TestComponent('instance');

        element.TestComponent({
            opt1: 'secondCall',
            opt3: 'secondCall'
        });

        assert.strictEqual(element.TestComponent('instance'), instance);

        assert.equal(instance.option('opt1'), 'secondCall');
        assert.equal(instance.option('opt2'), 'firstCall');
        assert.equal(instance.option('opt3'), 'secondCall');
    });

    QUnit.test('mass option change call \'refresh\' once', function(assert) {
        const TestComponent = this.TestComponent.inherit({
            _optionChanged(args) {
                this.callBase(args);
                if($.inArray(args.name, ['opt1', 'opt2']) > -1) {
                    this._invalidate();
                }
            }
        });

        const instance = new TestComponent('#component', {
            opt1: 'opt1',
            opt2: 'opt2'
        });

        assert.ok(!instance._getTraceLogByMethod('_optionChanged').length);
        assert.ok(!instance._getTraceLogByMethod('_refresh').length);

        instance.option({
            opt1: 'new opt1',
            opt2: 'new opt2'
        });

        assert.equal(instance._getTraceLogByMethod('_optionChanged').length, 2);
        assert.equal(instance._getTraceLogByMethod('_refresh').length, 1);
    });

    QUnit.test('mass option getting', function(assert) {
        const element = $('#component').TestComponent({});
        const instance = element.TestComponent('instance');
        const options = instance.option();

        assert.ok($.isPlainObject(options));
        assert.ok(options['opt1']);
        assert.ok(options['opt2']);
    });

    QUnit.test('\'option\' method invoking directly and by jQuery plugin syntax should works consistently with undefined value', function(assert) {
        const $element = $('#component');
        const instance = new this.TestComponent($element, { optionWithUndefinedValue: undefined });

        assert.strictEqual(instance.option('optionWithUndefinedValue'), undefined);
        assert.strictEqual($element.TestComponent('option', 'optionWithUndefinedValue'), undefined);
    });

    QUnit.test('mass method invoking should call method for each component (setter case)', function(assert) {
        const $firstElement = $('#component');
        const $secondElement = $('#anotherComponent');
        const $elements = $($firstElement).add($secondElement);

        registerComponent('TestComponent', this.TestComponent.inherit({
            setterReturningThis() {
                this._setterReturningThisCalled = true;
                return this;
            }
        }));

        const firstInstance = $firstElement.TestComponent().TestComponent('instance');
        const secondInstance = $secondElement.TestComponent().TestComponent('instance');

        $elements.TestComponent('setterReturningThis');

        assert.ok(firstInstance._setterReturningThisCalled);
        assert.ok(secondInstance._setterReturningThisCalled);
    });

    QUnit.test('mass method invoking should return first instance method result', function(assert) {
        const $firstElement = $('#component');
        const $secondElement = $('#anotherComponent');
        const $elements = $($firstElement).add($secondElement);

        registerComponent('TestComponent', this.TestComponent.inherit({
            setterReturningThis() {
                return this;
            }
        }));

        const firstInstance = $firstElement.TestComponent().TestComponent('instance');
        $secondElement.TestComponent().TestComponent('instance');
        const result = $elements.TestComponent('setterReturningThis');

        assert.strictEqual(firstInstance, result);
    });

    QUnit.test('jQuery instances should be compared by DOM elements set (not by reference)', function(assert) {
        const $element = $('<div>');

        const instance = $('#component').TestComponent({
            opt1: $element
        }).TestComponent('instance');

        instance.option('opt1', $element);
        assert.ok(!instance._optionChangedCalled);
    });

    QUnit.test('component should not be refreshed after unknown option changing (B251443)', function(assert) {
        const instance = new this.TestComponent('#component');
        instance.option('unknown option', 1);
        assert.equal(instance._getTraceLogByMethod('_refresh'), 0);
    });

    QUnit.test('no infinite loop during refresh()', function(assert) {
        assert.expect(0);

        const instance = new this.TestComponent('#component');
        instance.option('option2', 2);
    });

    QUnit.test('option \'disabled\' is false on init', function(assert) {
        const $element = $('#component').TestComponent();
        const instance = $element.TestComponent('instance');

        assert.strictEqual(instance.option('disabled'), false);
    });

    QUnit.test('\'disabled\' option is passed to createComponent', function(assert) {
        const $firstElement = $('#component');
        const $secondElement = $('#anotherComponent');

        registerComponent('TestComponent', this.TestComponent.inherit({
            createComponent(element, name, config) {
                return this._createComponent(element, name, config);
            }
        }));

        const firstInstance = $firstElement.TestComponent({ disabled: true }).TestComponent('instance');
        const secondInstance = firstInstance.createComponent($secondElement, 'TestComponent', {});

        assert.ok(secondInstance.option('disabled'), 'disabled state is correct');
    });

    QUnit.test('T283132 - the \'disabled\' option of inner component is changed if the \'disabled\' option of outer component is changed', function(assert) {
        const $firstElement = $('#component');
        const $secondElement = $('#anotherComponent');

        registerComponent('TestComponent', this.TestComponent.inherit({
            createComponent(element, name, config) {
                return this._createComponent(element, name, config);
            }
        }));

        const firstInstance = $firstElement.TestComponent({ disabled: true }).TestComponent('instance');
        const secondInstance = firstInstance.createComponent($secondElement, 'TestComponent', {});

        firstInstance.option('disabled', false);
        assert.ok(!secondInstance.option('disabled'), 'disabled state is correct');
    });

    QUnit.test('\'rtlEnabled\' option is passed to createComponent', function(assert) {
        const $firstElement = $('#component');
        const $secondElement = $('#anotherComponent');

        registerComponent('TestComponent', this.TestComponent.inherit({
            createComponent(element, name, config) {
                return this._createComponent(element, name, config);
            }
        }));

        const firstInstance = $firstElement.TestComponent({ rtlEnabled: true }).TestComponent('instance');
        const secondInstance = firstInstance.createComponent($secondElement, 'TestComponent', {});

        assert.ok(secondInstance.option('rtlEnabled'), true);
    });

    QUnit.test('\'templatesRenderAsynchronously\' option is passed to createComponent', function(assert) {
        const $firstElement = $('#component');
        const $secondElement = $('#anotherComponent');

        registerComponent('TestComponent', this.TestComponent.inherit({
            createComponent(element, name, config) {
                return this._createComponent(element, name, config);
            }
        }));

        const firstInstance = $firstElement.TestComponent({ templatesRenderAsynchronously: true }).TestComponent('instance');
        const secondInstance = firstInstance.createComponent($secondElement, 'TestComponent', {});

        assert.ok(secondInstance.option('templatesRenderAsynchronously'), true);
    });

    QUnit.test('custom template should not be taken from integrationOptions when it is skipped', function(assert) {
        const instance = new DOMComponent('#component', {
            template: 'customTemplate',
            integrationOptions: {
                skipTemplates: ['customTemplate'],
                createTemplate() {
                    return {
                        render() {
                            return 'Created custom template';
                        }
                    };
                },
                templates: {
                    customTemplate: {
                        render() {
                            return 'Integration content';
                        }
                    }
                }
            }
        });

        const template = instance._getTemplateByOption('template');
        assert.strictEqual(template.render(), 'Created custom template', 'name2 is found in integration options. Use it');
    });

    QUnit.test('default template should not be taken from integrationOptions when it is skipped', function(assert) {
        const instance = new this.TestComponentWithTemplate('#component', {
            integrationOptions: {
                skipTemplates: ['content'],
                templates: {
                    content: {
                        render() {
                            return 'Integration content';
                        }
                    }
                }
            }
        });

        const template = instance._getTemplate('content');
        assert.strictEqual(template.render(), 'Default content markup', 'name1 is not found in integrationOptions. Use the default');
    });

    QUnit.test('component does not use deferUpdate strategy for template rendering', function(assert) {
        const $element = $('#component').TestComponent();
        const instance = $element.TestComponent('instance');

        const useDeferUpdate = instance.option('integrationOptions.useDeferUpdateForTemplates');

        assert.strictEqual(useDeferUpdate, true);
    });

    QUnit.test('option \'rtl\'', function(assert) {
        const $element = $('#component').TestComponent();
        const instance = $element.TestComponent('instance');

        assert.ok(!$element.hasClass(RTL_CLASS));

        instance.option('rtlEnabled', true);
        assert.ok($element.hasClass(RTL_CLASS));
    });

    QUnit.test('use the TemplateManager module for templates', function(assert) {
        const $element = $('#component').TestComponent();
        const instance = $element.TestComponent('instance');

        assert.ok(instance._templateManager instanceof TemplateManager, 'create instance');

        const ComponentWithoutTemplates = DOMComponent.inherit({
            _useTemplates() {
                return false;
            }
        });
        registerComponent('ComponentWithoutTemplates', nameSpace, ComponentWithoutTemplates);

        const $element2 = $('#component').ComponentWithoutTemplates();
        const instance2 = $element2.ComponentWithoutTemplates('instance');

        assert.ok(
            typeof instance2._templateManager,
            'should not create TemplateManager module instance if template functionality is not set'
        );
    });

    QUnit.test('init option \'rtl\' is true', function(assert) {
        const $element = $('#component').TestComponent({ rtlEnabled: true });
        const instance = $element.TestComponent('instance');

        assert.ok($element.hasClass(RTL_CLASS));

        instance.option('rtlEnabled', false);
        assert.ok(!$element.hasClass(RTL_CLASS));
    });

    QUnit.test('dispose on remove from DOM', function(assert) {
        const element = $('#component').TestComponent();
        const instance = element.TestComponent('instance');
        let disposed = false;
        const disposingHandler = () => {
            disposed = true;
        };

        instance.on('disposing', disposingHandler);

        element.remove();

        assert.ok(disposed);
    });

    QUnit.test('customizing default option rules', function(assert) {
        const TestComponent = DOMComponent.inherit({
            _defaultOptionsRules() {
                return this.callBase().slice(0).concat([{
                    device: { platform: 'ios' },
                    options: {
                        test: 'value'
                    }
                }]);
            },
        });

        registerComponent('TestComponent', TestComponent);

        TestComponent.defaultOptions({
            device: { platform: 'ios' },
            options: {
                test: 'customValue'
            }
        });

        devices._currentDevice = { platform: 'ios' };
        assert.equal(new TestComponent($('<div/>')).option('test'), 'customValue', 'test option is customized for ios');

        devices._currentDevice = { platform: 'android' };
        assert.notEqual(new TestComponent($('<div/>')).option('test'), 'value', 'test option is not customized for android');
    });

    QUnit.test('customizing default option rules applies only on the target component class', function(assert) {
        const TestComponent1 = DOMComponent.inherit({
            _getDefaultOptions() {
                return $.extend(this.callBase(), {
                    test: 'Initial value 1'
                });
            }
        });

        const TestComponent2 = TestComponent1.inherit({
            _getDefaultOptions() {
                return $.extend(this.callBase(), {
                    test: 'Initial value 2'
                });
            }
        });

        registerComponent('TestComponent1', TestComponent1);
        registerComponent('TestComponent2', TestComponent2);

        TestComponent1.defaultOptions({
            device: { platform: 'ios' },
            options: {
                anotherOption: 'Another option value'
            }
        });

        TestComponent1.defaultOptions({
            device: { platform: 'ios' },
            options: {
                test: 'Custom value 1'
            }
        });

        TestComponent2.defaultOptions({
            device: { platform: 'ios' },
            options: {
                test: 'Custom value 2'
            }
        });

        devices._currentDevice = { platform: 'ios' };
        assert.equal(new TestComponent1($('<div/>')).option('test'), 'Custom value 1', 'Child rule should not affect on the parent');
        assert.equal(new TestComponent1($('<div/>')).option('anotherOption'), 'Another option value', 'Multiple calls should not clean previous rules');
    });

    QUnit.test('DevExpress.rtlEnabled proxied to DOMComponent', function(assert) {
        assert.equal(config().rtlEnabled, false, 'DevExpress.rtlEnabled equals false by default');
        assert.equal(new DOMComponent($('<div/>')).option('rtlEnabled'), false, 'false by default');

        config({ rtlEnabled: true });
        assert.equal(new DOMComponent($('<div/>')).option('rtlEnabled'), true, 'DevExpress.rtlEnabled equals true');

        config({ rtlEnabled: false });
    });

    QUnit.test('_visibilityChanged is called on dxhiding and dxshown events and special css class is attached', function(assert) {
        let hidingFired = 0;
        let shownFired = 0;

        const TestComponent = this.TestComponent.inherit({
            NAME: 'TestComponent',

            _visibilityChanged(visible) {
                if(visible) {
                    shownFired++;
                } else {
                    hidingFired++;
                }
            }
        });

        const $element = $('#component');
        new TestComponent($element);

        assert.ok($element.hasClass('dx-visibility-change-handler'), 'special css class attached');

        $element.trigger('dxhiding').hide();
        assert.equal(hidingFired, 1, 'hiding was fired');
        assert.equal(shownFired, 0, 'shown was not fired');

        $element.show().trigger('dxshown');
        assert.equal(hidingFired, 1, 'hiding was fired only once');
        assert.equal(shownFired, 1, 'shown was fired');
    });

    QUnit.test('visibility change subscriptions should not clash', function(assert) {
        let hidingFired = 0;
        let shownFired = 0;

        const visibilityChanged = visible => {
            visible ? shownFired++ : hidingFired++;
        };

        const TestComponent1 = this.TestComponent.inherit({
            NAME: 'TestComponent1',
            _visibilityChanged: visibilityChanged
        });

        const TestComponent2 = this.TestComponent.inherit({
            NAME: 'TestComponent2',
            _visibilityChanged: visibilityChanged
        });

        const $element = $('#component');
        new TestComponent1($element);
        new TestComponent2($element);

        $element.trigger('dxhiding').hide();
        $element.show().trigger('dxshown');

        assert.equal(hidingFired, 2, 'hidden fired for both components');
        assert.equal(shownFired, 2, 'shown fired for both components');
    });

    QUnit.test('visibility change handling works optimally (initially visible)', function(assert) {
        let hidingFired = 0;
        let shownFired = 0;

        const visibilityChanged = visible => {
            visible ? shownFired++ : hidingFired++;
        };

        const TestComponent = this.TestComponent.inherit({
            NAME: 'TestComponent1',
            _visibilityChanged: visibilityChanged
        });

        const $element = $('#component');
        new TestComponent($element);

        assert.equal(hidingFired, 0, 'hidden is not fired initially');
        assert.equal(shownFired, 0, 'shown is not fired initially');

        $element.show().trigger('dxshown');
        assert.equal(shownFired, 0, 'shown is not fired if element is visible');

        $element.trigger('dxhiding').hide();
        assert.equal(hidingFired, 1, 'hiding is fired for the first time');

        $element.trigger('dxhiding').hide();
        assert.equal(hidingFired, 1, 'hiding is not fired for the second time');
    });

    QUnit.test('visibility change handling works optimally (initially hidden)', function(assert) {
        let hidingFired = 0;
        let shownFired = 0;

        const visibilityChanged = visible => {
            visible ? shownFired++ : hidingFired++;
        };

        const TestComponent = this.TestComponent.inherit({
            NAME: 'TestComponent1',
            _visibilityChanged: visibilityChanged
        });

        const $element = $('#component').hide();
        new TestComponent($element);

        assert.equal(hidingFired, 0, 'hidden is not fired initially');
        assert.equal(shownFired, 0, 'shown is not fired initially');

        $element.trigger('dxhiding').hide();
        assert.equal(shownFired, 0, 'hiding is not fired if element is hidden');

        $element.show().trigger('dxshown');
        assert.equal(shownFired, 1, 'shown is fired for the first time');

        $element.show().trigger('dxshown');
        assert.equal(shownFired, 1, 'shown is not fired for the second time');
    });

    QUnit.test('visibility change handling works with hidden parent', function(assert) {
        let hidingFired = 0;
        let shownFired = 0;

        const visibilityChanged = visible => {
            visible ? shownFired++ : hidingFired++;
        };

        const TestComponent = this.TestComponent.inherit({
            NAME: 'TestComponent1',
            _visibilityChanged: visibilityChanged
        });

        const $parent = $('#component').hide();
        const $component = $('<div>').hide().appendTo($parent);

        new TestComponent($component);

        assert.equal(hidingFired, 0, 'hidden is not fired initially');
        assert.equal(shownFired, 0, 'shown is not fired initially');

        $component.show().triggerHandler('dxshown');
        assert.equal(shownFired, 0, 'shown is not fired since parent is hidden');

        $parent.show();
        $component.triggerHandler('dxshown');
        assert.equal(shownFired, 1, 'shown is fired since parent is shown');
    });

    QUnit.test('_dimensionChanged is called when window resize fired', function(assert) {
        let dimensionChanged = 0;

        const TestComponent = this.TestComponent.inherit({
            NAME: 'TestComponent',

            _dimensionChanged(visible) {
                dimensionChanged++;
            }
        });

        const $element = $('#component');
        new TestComponent($element);

        assert.equal(dimensionChanged, 0, 'no dimension change on start');

        resizeCallbacks.fire();

        assert.equal(dimensionChanged, 1, 'resize fired');
    });

    QUnit.test('_dimensionChanged is called when dxresize event fired', function(assert) {
        let dimensionChanged = 0;

        const TestComponent = this.TestComponent.inherit({
            NAME: 'TestComponent',

            _visibilityChanged: noop,

            _dimensionChanged() {
                dimensionChanged++;
            }
        });

        const $element = $('#component').addClass('dx-visibility-change-handler');
        new TestComponent($element);

        assert.equal(dimensionChanged, 0, 'no dimension change on start');

        triggerResizeEvent($element);

        assert.equal(dimensionChanged, 1, 'dimension changed fired');
    });

    QUnit.test('\'option\' method should work correctly with $.Event instance (T105184)', function(assert) {
        const component = $('#component').TestComponent({
            position: {
                of: window,
                at: ''
            }
        }).TestComponent('instance');

        component.option('event', $.Event('click'));
        assert.ok(component.option('event') instanceof $.Event);

        component.option('event', $.Event('mousedown'));
        assert.ok(component.option('event') instanceof $.Event);

        component.option('position', { of: $.Event('mousedown') });
        assert.ok(component.option('position.of') instanceof $.Event);

        component.option('position', { of: $.Event('mousedown') });
        assert.ok(component.option('position.of') instanceof $.Event);
    });

    QUnit.test('element method should return correct component element', function(assert) {
        const $element = $('#component').TestComponent();
        const instance = $element.TestComponent('instance');

        assert.strictEqual(instance.$element().get(0), $element.get(0), 'correct element present');
    });

    $.each(['onInitialized', 'onOptionChanged', 'onDisposing'], (_, action) => {
        QUnit.test('\'' + action + '\' action should be fired even in disabled & readOnly', function(assert) {
            const config = {
                value: true
            };
            config[action] = e => {
                assert.ok(true, 'action fired');
                assert.equal(e.element, e.component.element(), 'action has correct element');
            };

            const $component = $('#component');

            $component.addClass('dx-state-disabled');
            $component.addClass('dx-state-readonly');

            const component = new this.TestComponent($component, config);
            component.option('value', false);
            $component.remove();
        });
    });

    QUnit.test('\'elementAttr.class\' option should overwrite previous value', function(assert) {
        const $el = $('#component');
        const changeClass = (newClass) => {
            $el
                .TestComponent({ elementAttr: { class: 'init' } })
                .TestComponent('instance')
                .option('elementAttr', { class: newClass });

            return $el.attr('class');
        };

        assert.strictEqual(changeClass(void 0), 'init');
        assert.strictEqual(changeClass(null), '');
        assert.strictEqual(changeClass('new'), 'new');
    });

    QUnit.test('the \'elementAttr\' option should set attributes to widget element according to the object passed', function(assert) {
        const $element = $('#component').TestComponent({
            elementAttr: {
                attr1: 'widget 01'
            }
        });

        assert.equal($element.attr('attr1'), 'widget 01', 'the second attribute is set correctly');
    });

    QUnit.test('changing elementAttr option should not rerender the component', function(assert) {
        const $element = $('#component').TestComponent({ elementAttr: { attr1: 'widget 01' } });
        const instance = $element.TestComponent('instance');
        const render = sinon.spy(instance, '_render');

        instance.option('elementAttr', { attr1: 'widget 02' });

        assert.equal(render.callCount, 0, 'render should not be called');
        assert.equal($element.attr('attr1'), 'widget 02', 'attribute is correct');
    });

    QUnit.test('changing class via \'elementAttr\' option should preserve component specific classes', function(assert) {
        const SomeComponent = DOMComponent.inherit({
            _render() {
                this.$element().addClass('dx-some-class1');
                this.callBase();
                this.$element().addClass('dx-some-class2');
            }
        });

        const $element = $('#component');
        const instance = new SomeComponent($element);
        const componentClassNames = $element.attr('class').split(' ');
        const specialClass = 'special-class';

        instance.option('elementAttr', { class: specialClass });

        for(let i = 0, n = componentClassNames.length; i < n; i++) {
            assert.ok($element.hasClass(componentClassNames[i]), 'the \'' + componentClassNames[i] + '\' class is preserved');
        }

        assert.ok($element.hasClass(specialClass), 'the new class is also present');
    });

    QUnit.test('Dispose: component can be recreated after dispose', function(assert) {
        let element = $('#component').TestComponent();
        let instance = element.TestComponent('instance');

        instance.option('opt1', 'notDefault');

        assert.deepEqual(dataUtils.data(element.get(0), 'dxComponents'), ['TestComponent']);
        assert.equal(instance.option('opt1'), 'notDefault');

        instance.dispose();

        assert.notOk(dataUtils.data(element.get(0), 'TestComponent'));
        assert.notOk(dataUtils.data(element.get(0), 'dxComponents'));

        element = $('#component').TestComponent();
        instance = element.TestComponent('instance');

        assert.notEqual(instance.option('opt1'), 'notDefault');
        assert.ok(dataUtils.data(element.get(0), 'TestComponent') instanceof this.TestComponent);
        assert.ok(element.TestComponent('instance') instanceof this.TestComponent);
    });

    QUnit.test('Dispose: content of container is cleaned', function(assert) {
        const SomeComponent = DOMComponent.inherit({
            _render() {
                const p = document.createElement('p');
                p.textContent = 'Some text';
                this.$element()[0].appendChild(p);
                this.callBase();
            }
        });

        const element = $('#component');
        const instance = new SomeComponent(element);

        assert.equal(element[0].textContent, 'Some text');
        assert.equal(element[0].childElementCount, 1);

        instance.dispose();

        assert.equal(element[0].textContent, '');
        assert.equal(element[0].childElementCount, 0);
    });

    QUnit.test('Dispose: dx classes are removed', function(assert) {
        const element = $('#component').TestComponent();
        const instance = element.TestComponent('instance');

        element.addClass('dx-some-class-1');
        element.addClass('dx-some-class-2');
        element.addClass('some-class-1');
        element.addClass('some-class-2');
        element.addClass('dx-some-class-3 some-class-3');

        instance.dispose();

        assert.notOk(element.hasClass('dx-some-class-1'));
        assert.notOk(element.hasClass('dx-some-class-2'));
        assert.notOk(element.hasClass('dx-some-class-3'));
        assert.ok(element.hasClass('some-class-1'));
        assert.ok(element.hasClass('some-class-2'));
        assert.ok(element.hasClass('some-class-3'));
    });

    QUnit.test('Dispose: attributes deleted', function(assert) {
        const element = $('#component').TestComponent();
        const instance = element.TestComponent('instance');

        const attributes = [
            // setAria
            'role',
            'aria-multiselectable',
            'aria-hidden',
            'aria-autocomplete',
            'aria-label',
            'aria-selected',
            'aria-activedescendant',
            'aria-checked',
            'aria-owns',
            'aria-haspopup',
            'aria-expanded',
            'aria-invalid',
            'aria-readonly',
            'aria-describedby',
            'aria-required',
            'aria-sort',
            'aria-valuenow',
            'aria-valuemin',
            'aria-valuemax',
            'aria-pressed',
            'aria-controls',
            'aria-multiline',
            'aria-level',
            'aria-disabled',
            'data-dx-content-placeholder-name',
            'style'
        ];

        attributes.forEach(attribute => {
            element.attr(attribute, 'value');
        });

        element.attr('tabindex', 0);

        instance.dispose();

        attributes.forEach(attribute => {
            assert.equal(element.attr(attribute), undefined);
        });
        assert.equal(element.attr('data-dx-content-placeholder-name'), undefined);
        assert.equal(element.attr('style'), undefined);
        assert.equal(element.attr('tabindex'), undefined);
    });

    QUnit.test('Dispose: events are cleaned, dxremove is fired', function(assert) {

        let disposeRun = false;
        let clickRun = false;

        const SomeComponent = DOMComponent.inherit({
            _render() {
                const p = document.createElement('p');
                p.textContent = 'Some text';
                this.$element()[0].appendChild(p);
                eventsEngine.on(this.$element(), 'click', () => {
                    clickRun = true;
                });
                this.callBase();
            },
            _dispose() {
                disposeRun = true;
            }
        });

        const element = $('#component');
        const instance = new SomeComponent(element);

        instance.dispose();

        eventsEngine.trigger(element, 'click');

        assert.ok(disposeRun);
        assert.notOk(clickRun);
    });

    QUnit.test('get element', function(assert) {
        const element = $('#component').TestComponent();
        const instance = dataUtils.data(element[0], 'TestComponent');

        if(config().useJQuery) {
            assert.deepEqual(instance.element()[0], $('#component')[0]);
        } else {
            assert.equal(instance.element(), $('#component').get(0));
        }
    });

    QUnit.test('getInstance method', function(assert) {
        const $element = $('#component');
        const instance = new this.TestComponent($element);
        const AnotherComponent = DOMComponent.inherit();

        assert.equal(this.TestComponent.getInstance($element), instance);
        assert.equal(this.TestComponent.getInstance($element.get(0)), instance);

        assert.strictEqual(AnotherComponent.getInstance($element), undefined);
        assert.strictEqual(AnotherComponent.getInstance($element.get(0)), undefined);
    });

    QUnit.test('reset dimensions', function(assert) {
        const $element = $('#component').TestComponent({ width: 200, height: 100 });
        const element = $element.get(0);
        const instance = $element.TestComponent('instance');

        instance.resetOption('height');
        instance.resetOption('width');

        assert.strictEqual(instance.option('height'), undefined);
        assert.strictEqual(instance.option('width'), undefined);
        assert.equal(element.style.width, '', 'width is correct');
        assert.equal(element.style.height, '', 'height is correct');
    });

    QUnit.test('reset dimensions with custom default value', function(assert) {
        const TestComponentCustomDefault = DOMComponent.inherit({
            _getDefaultOptions() {
                return $.extend(
                    this.callBase(),
                    {
                        width: 20,
                        height: 10
                    }
                );
            },
        });

        registerComponent('TestComponentCustomDefault', nameSpace, TestComponentCustomDefault);

        const $element = $('#component').TestComponentCustomDefault({ width: 200, height: 100 });
        const element = $element.get(0);
        const instance = $element.TestComponentCustomDefault('instance');

        instance.resetOption('height');
        instance.resetOption('width');

        assert.strictEqual(instance.option('height'), 10);
        assert.strictEqual(instance.option('width'), 20);
        assert.equal(element.style.width, '20px', 'width is correct');
        assert.equal(element.style.height, '10px', 'height is correct');
    });
});

QUnit.module('License check', {
    beforeEach: function() {
        this.TestComponent = DOMComponent.inherit();
        sinon.spy(licenseModule, 'validateLicense');
        setLicenseCheckSkipCondition(false);
    },
    afterEach: function() {
        licenseModule.validateLicense.restore();
    }
}, () => {
    QUnit.test('validateLicense() method should be called once', function(assert) {
        new this.TestComponent('#component');

        assert.ok(licenseModule.validateLicense.calledOnce);
    });

    QUnit.test('validateLicense() method should be called with license from config', function(assert) {
        try {
            const licenseKey = 'license key';
            config({ licenseKey });

            new this.TestComponent('#component');

            assert.ok(licenseModule.validateLicense.calledWith(licenseKey));
        } finally {
            config({ licenseKey: null });
        }
    });

    QUnit.test('license should be removed from config after validateLicense() executed', function(assert) {
        try {
            const licenseKey = 'license key';
            config({ licenseKey });
            new this.TestComponent('#component');

            assert.strictEqual(config().licenseKey, '');
        } finally {
            config({ licenseKey: null });
        }
    });

    QUnit.test('license should be removed from config once', function(assert) {
        try {
            const licenseKey = 'license key';

            new this.TestComponent('#component');
            config({ licenseKey });
            new this.TestComponent('#component');

            assert.strictEqual(config().licenseKey, licenseKey);
        } finally {
            config({ licenseKey: null });
        }
    });
});
