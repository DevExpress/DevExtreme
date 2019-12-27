const $ = require('jquery');
const noop = require('core/utils/common').noop;
const ko = require('knockout');
const registerComponent = require('core/component_registrator');
const DOMComponent = require('core/dom_component');
const Widget = require('ui/widget/ui.widget');
const KoTemplate = require('integration/knockout/template').KoTemplate;
const CollectionWidget = require('ui/collection/ui.collection_widget.edit');
const config = require('core/config');
const dataUtils = require('core/element_data');

require('ui/select_box');
require('ui/lookup');
require('integration/knockout');

const FIXTURE_ELEMENT = $('<div id=qunit-fixture></div>').appendTo('body');

const cleanComponentRegistrations = function() {
    $.each(arguments, function() {
        delete ko.bindingHandlers[this];
        delete $.fn[this];
    });
};


QUnit.module(
    'simple component tests', {
        beforeEach: function() {
            const TestComponent = DOMComponent.inherit({
                _defaultOptions: function() {
                    return {
                        text: '',
                        array: [],
                        obj: null,
                        complex: {
                            nested: ''
                        },
                        complexByReference: null
                    };
                },
                _optionChanged: function() {
                    this._invalidate();
                },
                _setOptionsByReference: function() {
                    this.callBase();

                    $.extend(this._optionsByReference, {
                        complexByReference: true
                    });
                },
                _setDeprecatedOptions: function() {
                    this.callBase();
                    $.extend(this._deprecatedOptions, {
                        'checked': { alias: 'value' }
                    });
                }
            });

            registerComponent('dxTest', TestComponent);
            this.TestComponent = TestComponent;
        },

        afterEach: function() {
            cleanComponentRegistrations('dxTest');
        }
    },
    function() {

        QUnit.test('basic binding', function(assert) {
            const markup = $('<div></div>')
                .attr('data-bind', 'dxTest: { text: text }')
                .appendTo(FIXTURE_ELEMENT);

            const vm = {
                text: ko.observable('my text')
            };

            ko.applyBindings(vm, markup[0]);

            const instance = markup.dxTest('instance');

            assert.equal(instance.option('text'), 'my text');

            vm.text('change1');
            assert.equal(instance.option('text'), 'change1');

            instance.option('text', 'change2');
            assert.equal(vm.text(), 'change2');

            assert.strictEqual(ko.dataFor(markup[0]), vm);
        });

        QUnit.test('ignore dependent option after option changed (T335759)', function(assert) {
            if(!ko.ignoreDependencies) {
                assert.expect(0);
                return;
            }
            const markup = $('<div>')
                .attr('data-bind', 'dxTest: {obj: obj, onOptionChanged: optionChangedHandler}')
                .appendTo(FIXTURE_ELEMENT);

            let count = 0;
            var vm = {
                obj: ko.observable({}),
                dependentOption: ko.observable('initial state'),
                optionChangedHandler: function() {
                    vm.dependentOption();
                    count++;
                }
            };
            ko.applyBindings(vm, markup[0]);

            vm.obj({});
            vm.dependentOption('change dependent option');

            assert.equal(count, 1, 'option changed fired once');
        });

        QUnit.test('nested option binding', function(assert) {
            const markup = $('<div></div>')
                .attr('data-bind', 'dxTest: { complex: { first: { second: value } } }')
                .appendTo(FIXTURE_ELEMENT);

            const vm = {
                value: ko.observable('test')
            };

            ko.applyBindings(vm, markup[0]);

            const instance = markup.dxTest('instance');
            assert.equal(instance.option('complex.first.second'), 'test');

            vm.value('testchanged1');
            assert.equal(instance.option('complex.first.second'), 'testchanged1');

            instance.option('complex.first.second', 'testchanged2');
            assert.equal(vm.value(), 'testchanged2');
        });

        QUnit.test('nested viewmodel value binding', function(assert) {
            const markup = $('<div></div>')
                .attr('data-bind', 'dxTest: { text: complex.nested }')
                .appendTo(FIXTURE_ELEMENT);

            const vm = {
                complex: {
                    nested: ko.observable('test')
                }
            };

            ko.applyBindings(vm, markup[0]);

            const instance = markup.dxTest('instance');
            assert.equal(instance.option('text'), 'test');

            vm.complex.nested('testchanged1');
            assert.equal(instance.option('text'), 'testchanged1');

            instance.option('text', 'testchanged2');
            assert.equal(vm.complex.nested(), 'testchanged2');
        });

        QUnit.test('nested viewmodel value and option binding', function(assert) {
            const markup = $('<div></div>')
                .attr('data-bind', 'dxTest: { complex: complex }')
                .appendTo(FIXTURE_ELEMENT);

            const vm = {
                complex: {
                    nested: ko.observable('test')
                }
            };

            ko.applyBindings(vm, markup[0]);

            const instance = markup.dxTest('instance');
            assert.equal(instance.option('complex.nested'), 'test');

            vm.complex.nested('testchanged1');
            assert.equal(instance.option('complex.nested'), 'testchanged1');

            instance.option('complex.nested', 'testchanged2');
            assert.equal(vm.complex.nested(), 'testchanged2');
        });

        QUnit.test('nested viewmodel value should be unwrapped', function(assert) {
            const markup = $('<div></div>')
                .attr('data-bind', 'dxTest: { complex: complex }')
                .appendTo(FIXTURE_ELEMENT);

            const vm = {
                complex: {
                    nested: ko.observable('test')
                }
            };

            ko.applyBindings(vm, markup[0]);

            const instance = markup.dxTest('instance');
            assert.equal(instance.option().complex.nested, 'test');
        });

        QUnit.test('nested viewModel value should not be unwrapped for reference option', function(assert) {
            const markup = $('<div></div>')
                .attr('data-bind', 'dxTest: { complexByReference: complexByReference }')
                .appendTo(FIXTURE_ELEMENT);

            const vm = {
                complexByReference: {
                    nested: ko.observable('test')
                }
            };

            ko.applyBindings(vm, markup[0]);

            const instance = markup.dxTest('instance');

            assert.equal(typeof vm.complexByReference.nested, 'function', 'variable from viewModel is function');

            assert.equal(vm.complexByReference.nested(), 'test', 'variable from viewModel is observable');

            assert.equal(typeof instance.option().complexByReference.nested, 'function', 'variable from viewModel is function');

            assert.equal(instance.option().complexByReference.nested(), 'test', 'option is observable');
        });

        QUnit.test('foreach binding', function(assert) {
            const vm = {
                items: ko.observableArray([
                    { text: ko.observable('0') },
                    { text: ko.observable('1') }
                ])
            };

            const markup = $(
                '<div>' +
                '   <!-- ko foreach: items -->' +
                '       <div data-bind=\'dxTest: { text: text }\'></div>' +
                '   <!-- /ko -->' +
                '</div>'
            ).appendTo(FIXTURE_ELEMENT);

            ko.applyBindings(vm, markup[0]);

            assert.equal(markup.children().eq(1).dxTest('option', 'text'), '1');

            vm.items.push({ text: ko.observable('2') });
            assert.equal(markup.children().eq(2).dxTest('option', 'text'), '2');

            vm.items.splice(1, 1);
            assert.equal(markup.children().length, 2);

            markup.remove();
        });

        QUnit.test('DOMComponent does not control descendant bindings', function(assert) {
            const markup = $(
                '<div data-bind=\'dxTest: { }\'>' +
                '   <ul data-bind=\'foreach: items\'>' +
                '       <li data-bind=\'text: $data\'></li>' +
                '   </ul>' +
                '</div>'
            ).appendTo(FIXTURE_ELEMENT);

            const vm = {
                items: ko.observableArray([1, 2, 3])
            };

            ko.applyBindings(vm, markup[0]);

            const listItems = markup.find('ul').children();
            assert.equal(listItems.length, 3);
            assert.equal(listItems.text(), '123');
        });

        QUnit.test('circular notifications regression', function(assert) {
            const vm = {
                scalar: ko.observable('a'),
                array: ko.observableArray()
            };

            const markup = $('<div></div>')
                .attr('data-bind', 'dxTest: { text: scalar, array: array }')
                .appendTo(FIXTURE_ELEMENT);

            ko.applyBindings(vm, markup[0]);

            let vmScalarChangeCount = 0;
            let vmArrayChangeCount = 0;

            vm.scalar.subscribe(function() { vmScalarChangeCount++; }, undefined, 'beforeChange');
            vm.array.subscribe(function() { vmArrayChangeCount++; }, undefined, 'beforeChange');

            vm.scalar('b');
            vm.array.push(1);

            assert.equal(vmScalarChangeCount, 1);
            assert.equal(vmArrayChangeCount, 1);
        });

        QUnit.test('dependency from outer observable', function(assert) {
            const markup = $('<div></div>')
                .attr('data-bind', 'dxTest: { text: a().b().c }')
                .appendTo(FIXTURE_ELEMENT);

            const vm = {
                a: ko.observable({
                    b: ko.observable({
                        c: 1
                    })
                })
            };

            ko.applyBindings(vm, markup[0]);
            const instance = markup.dxTest('instance');

            assert.equal(instance.option('text'), 1);

            vm.a().b({ c: 2 });
            assert.equal(instance.option('text'), 2);
        });

        QUnit.test('binding to the whole options bag', function(assert) {
            const vm = {
                x: ko.observable({
                    text: ko.observable('text')
                })
            };

            assert.ok('x' in vm, 'it is important that property name is so short, because of ko peculiarities');

            const markup = $('<div></div>').attr('data-bind', 'dxTest: x').appendTo(FIXTURE_ELEMENT);
            ko.applyBindings(vm, markup[0]);

            const instance = markup.dxTest('instance');

            vm.x().text('new text');
            assert.equal(instance.option('text'), 'new text');

            vm.x({ text: 'other text' });
            assert.equal(instance.option('text'), 'other text');
        });

        QUnit.test('two non-comparable properties, stack overflow regression', function(assert) {
            const vm = {
                array: ko.observableArray(),
                obj: ko.observable({})
            };

            const markup = $('<div></div>').attr('data-bind', 'dxTest: { array: array, obj: obj }').appendTo(FIXTURE_ELEMENT);
            ko.applyBindings(vm, markup[0]);
            const instance = markup.dxTest('instance');

            instance.option('obj', { a: 1 });
            assert.deepEqual(instance.option('obj'), { a: 1 });
        });

        QUnit.test('quoted names in binding, regression case', function(assert) {
            const markup = $('<div><div /><div /></div>').appendTo(FIXTURE_ELEMENT);
            const child1 = markup.children().eq(0).attr('data-bind', '"dxTest": { "text": 1}');
            const child2 = markup.children().eq(1).attr('data-bind', '\'dxTest\': { \'text\': 2}');

            ko.applyBindings({}, markup[0]);

            assert.equal(child1.dxTest('instance').option('text'), 1);
            assert.equal(child2.dxTest('instance').option('text'), 2);
        });

        QUnit.test('model property name is not necessarily equal component option name, regression case', function(assert) {
            const markup = $('<div></div>')
                .attr('data-bind', 'dxTest: { text: textInModel }')
                .appendTo(FIXTURE_ELEMENT);

            const vm = {
                textInModel: ko.observable('initial')
            };

            ko.applyBindings(vm, markup[0]);

            const instance = markup.dxTest('instance');

            instance.option('text', 'changed');
            assert.equal(vm.textInModel(), 'changed');
        });

        QUnit.test('remove from DOM, append back and apply bindings again', function(assert) {
            const markup = $('<div><div />')
                .attr('data-bind', 'dxTest: { text: text }')
                .appendTo(FIXTURE_ELEMENT);

            const vm = {
                text: ko.observable('value')
            };

            ko.applyBindings(vm, markup[0]);

            assert.equal(markup.dxTest('instance').option('text'), 'value');

            markup
                .remove()
                .appendTo(FIXTURE_ELEMENT);
            ko.applyBindings(vm, markup[0]);
            vm.text('new value');

            assert.equal(markup.dxTest('instance').option('text'), 'new value');
        });

        QUnit.test('remove all subscription after widget was removed', function(assert) {
            const markup = $('<div></div>')
                .attr('data-bind', 'dxTest: { text: text }')
                .appendTo(FIXTURE_ELEMENT);

            const vm = {
                text: ko.observable('my text')
            };

            ko.applyBindings(vm, markup[0]);
            const instance = markup.dxTest('instance');
            markup.remove();

            instance.option('text', 'new value');
            assert.expect(0);
        });

        QUnit.test('B239952 - simple case', function(assert) {
            const markup = $('<div><div />')
                .attr('data-bind', 'dxTest: { option1: field1, option2: field2 }')
                .appendTo(FIXTURE_ELEMENT);

            const vm = {
                field1: ko.observableArray([1, 2, 3])
            };

            vm.field2 = ko.computed(function() {
                return !!vm.field1().length;
            });

            ko.applyBindings(vm, markup.get(0));

            const instance = markup.dxTest('instance');
            assert.equal(instance.option('option2'), true);

            instance.option('option1', []);

            assert.equal(instance.option('option2'), false);
        });

        QUnit.test('B239952 - complex case', function(assert) {
            const markup = $('<div><div />')
                .attr('data-bind', 'dxTest: { option1: field1, option2: field2, option3: field3 }')
                .appendTo(FIXTURE_ELEMENT);

            const vm = {
                field1: ko.observableArray([1, 2, 3])
            };

            vm.field2 = ko.computed(function() {
                return !!vm.field1().length;
            });

            vm.field3 = ko.computed(function() {
                vm.field1.push(4);
                return !vm.field2();
            });

            ko.applyBindings(vm, markup.get(0));

            const instance = markup.dxTest('instance');
            assert.deepEqual(instance.option('option1'), [1, 2, 3, 4]);
            assert.equal(instance.option('option2'), true);
            assert.equal(instance.option('option3'), false);

            instance.option('option1', []);

            assert.deepEqual(instance.option('option1'), [4]);
            assert.equal(instance.option('option2'), false);
            assert.equal(instance.option('option3'), true);
        });

        QUnit.test('batch option changing involves several component re-rendering (B251357)', function(assert) {

            const markup = $('<div><div />')
                .attr('data-bind', 'dxTest: { option1: componentOptions().option1, option2: componentOptions().option1, option3: componentOptions().option1 }')
                .appendTo(FIXTURE_ELEMENT);

            const vm = {
                componentOptions: ko.observable({
                    option1: ko.observableArray([1, 2, 3]),
                    option2: ko.observable(true),
                    option3: ko.observable(0)
                })
            };

            ko.applyBindings(vm, markup.get(0));

            const component = markup.dxTest('instance');

            let renderCount = 0;
            component._render = function() {
                renderCount++;
            };

            vm.componentOptions({
                option1: ko.observableArray([1, 2, 3]),
                option2: ko.observable(true),
                option3: ko.observable(0)
            });

            assert.equal(renderCount, 1);
        });

        QUnit.test('changing an observable option must correctly notify all the option\'s alias subscribers', function(assert) {
            const markup = $('<div><div />').attr('data-bind', 'dxTest: { checked: observable }').appendTo(FIXTURE_ELEMENT);
            const vm = { observable: ko.observable(false) };
            ko.applyBindings(vm, markup.get(0));
            markup.dxTest('instance').option('value', true);
            assert.strictEqual(vm.observable(), true);
        });

        QUnit.test('KO integration don\'t breaks defaultOptions', function(assert) {
            const TestDOMComponent = DOMComponent.inherit();

            registerComponent('TestDOMComponent', TestDOMComponent);

            TestDOMComponent.defaultOptions({
                options: {
                    test: 'customValue'
                }
            });

            assert.equal(new TestDOMComponent($('<div/>')).option('test'), 'customValue', 'default option sets correctly');
        });

        QUnit.test('expression with nested observable binding (T120420)', function(assert) {
            const markup = $('<div><div />')
                .attr('data-bind', 'dxTest: { option1: point() ? point().x : 0 }')
                .appendTo(FIXTURE_ELEMENT);

            const ObservablePoint = function(x, y) {
                this.x = ko.observable(x);
                this.y = ko.observable(y);
            };

            const vm = {
                points: ko.observableArray([new ObservablePoint(1, 2), new ObservablePoint(3, 4)]),
                point: ko.observable()
            };

            ko.applyBindings(vm, markup.get(0));

            vm.point(vm.points()[0]);

            const component = markup.dxTest('instance');
            component.option('option1', 10);

            assert.equal(vm.point().x(), 10);
        });

        QUnit.test('component should works correctly if observable option changed on ctor (T179839)', function(assert) {
            assert.expect(0);

            registerComponent('dxTestWidget', Widget.inherit({
                _renderContentImpl: noop
            }));

            const markup = $('<div><div />')
                .attr('data-bind', 'dxTestWidget: { option1: myValue, onContentReady: onContentReady }')
                .appendTo(FIXTURE_ELEMENT);

            var vm = {
                onContentReady: function() {
                    vm.myValue('new value');
                },
                myValue: ko.observable('initial value')
            };

            ko.applyBindings(vm, markup.get(0));
        });

        QUnit.test('component should not fire option changed callbacks after disposing (T215559)', function(assert) {
            assert.expect(0);

            const markup = $(
                '<div data-bind=\'if: visible\'>\
                    <div data-bind=\'dxSelectBox: {\
                        items: values,\
                        value: value\
                    }\'></div>\
                </div>'
            ).appendTo(FIXTURE_ELEMENT);

            const vm = {
                values: ['1', '2'],
                value: ko.observable(null)
            };

            vm.visible = ko.computed(function() {
                return !vm.value();
            });

            ko.applyBindings(vm, markup.get(0));

            markup.find('.dx-selectbox').dxSelectBox('option', 'value', '1');
        });

        QUnit.test('\'value\' option should be updated when the valueChanged event fires (T221193)', function(assert) {
            const $lookup = $('<div data-bind=\'dxLookup: {\
                dataSource: dataSource,\
                onValueChanged: onValueChanged,\
                value: value\
            }\'></div>').appendTo(FIXTURE_ELEMENT);

            var vm = {
                dataSource: ['1', '2'],
                onValueChanged: function() {
                    assert.equal(vm.value(), '1');
                },
                value: ko.observable()
            };

            ko.applyBindings(vm, $lookup.get(0));

            const lookup = $lookup.dxLookup('instance');
            lookup.option('value', '1');
        });

        QUnit.test('component should notify view model if option changed on ctor after initialization (T219862)', function(assert) {
            const ComponentClass = this.TestComponent.inherit({
                _render: function() {
                    this.callBase();
                    this.option('a', 2);
                }
            });

            registerComponent('T219862', ComponentClass);

            const vm = {
                a: ko.observable(1)
            };

            const $component = $('<div data-bind=\'T219862: {\
                a: a\
            }\'></div>').appendTo(FIXTURE_ELEMENT);

            ko.applyBindings(vm, $component.get(0));

            assert.equal(vm.a(), 2);
        });

        QUnit.test('our component binding handler should subscribe correctly on get/set properties (T257177)', function(assert) {
            if(!Object.defineProperties) {
                assert.expect(0);
                return;
            }

            const ComponentClass = this.TestComponent.inherit({});
            const titleObservable = ko.observable('title');

            const vm = {
                options: {
                    showIcon: {
                        desktop: true,
                        tablet: false
                    }
                }
            };

            Object.defineProperty(vm.options, 'title', {
                enumerable: true,

                get: function() {
                    return titleObservable();
                },

                set: function(value) {
                    titleObservable(value);
                }
            });

            registerComponent('T257177', ComponentClass);

            const $component = $('<div data-bind=\'T257177: options\'></div>').appendTo(FIXTURE_ELEMENT);
            ko.applyBindings(vm, $component.get(0));

            const callArgs = [];
            $component.T257177('instance').on('optionChanged', function(a) { callArgs.push(a); });

            vm.options.title = 'new title';
            assert.equal(callArgs.length, 1);
            assert.equal(callArgs[0].name, 'title');
        });

        QUnit.test('unwrap 3rd level option (T504726)', function(assert) {
            const observableValue = ko.observable(true);

            const vm = {
                options: {
                    option1: {
                        option2: {
                            option3: observableValue
                        }
                    }
                }
            };

            const markup = $('<div></div>').attr('data-bind', 'dxTest: options').appendTo(FIXTURE_ELEMENT);
            ko.applyBindings(vm, markup[0]);

            assert.strictEqual(observableValue(), true);
        });

    }
);

QUnit.module(
    'nested Widget with templates enabled',
    {
        beforeEach: function() {
            const TestContainer = Widget.inherit({

                _defaultOptions: function() {
                    return $.extend(this.callBase(), {
                        text: ''
                    });
                },

                _render: function() {
                    const content = $('<div />')
                        .addClass('dx-content')
                        .appendTo(this.$element());

                    this.option('integrationOptions.templates')['template'].render({
                        container: content
                    });

                    const text = this.option('text');
                    if(text) {
                        content.append($('<span />').text(text));
                    }
                },

                _renderContentImpl: noop,

                _clean: function() {
                    this.$element().empty();
                },

                _optionChanged: function() {
                    this._invalidate();
                }

            });

            const TestWidget = Widget.inherit({

                _defaultOptions: function() {
                    return $.extend(this.callBase(), {
                        text: ''
                    });
                },

                _render: function() {
                    this.$element().append($('<span />').text(this.option('text')));
                },

                _clean: function() {
                    this.$element().empty();
                },

                _optionChanged: function() {
                    this._invalidate();
                }
            });

            registerComponent('dxTestContainer', TestContainer);
            registerComponent('dxTestWidget', TestWidget);
        },

        afterEach: function() {
            cleanComponentRegistrations('dxTestContainer', 'dxTestWidget');
        }
    },
    function() {
        QUnit.test('two nested containers', function(assert) {
            const markup = $(
                '<div class=outerWidget data-bind=\'dxTestContainer: { }\'>' +
                '   <div data-options=\'dxTemplate: { name: "template" }\' class=outer-template>' +
                '       <span data-bind=\'text: outerText\'></span>' +
                '       <div class=innerWidget data-bind=\'dxTestContainer: { }\'>' +
                '           <div data-options=\'dxTemplate: { name: "template" }\' >' +
                '               <span data-bind=\'text: innerText\'></span>' +
                '           </div>' +
                '       </div>' +
                '   </div>' +
                '</div>'
            ).appendTo(FIXTURE_ELEMENT);

            const vm = {
                outerText: 'outer',
                innerText: 'inner'
            };

            ko.applyBindings(vm, markup[0]);

            const outerWidget = markup;
            assert.equal(outerWidget.length, 1);

            const outerContent = outerWidget.children().children().children();
            assert.equal(outerContent.length, 2);
            assert.equal(outerContent.filter('span').text(), 'outer');

            const innerWidget = outerContent.filter('.innerWidget');
            assert.equal(innerWidget.length, 1);
            assert.equal(innerWidget.find('span').text(), 'inner');
        });

        QUnit.test('B233347, B233267', function(assert) {
            const markup = $(
                '<div class=outerWidget data-bind=\'dxTestContainer: { }\'>' +
                '   <div data-options=\'dxTemplate: { name: "template" }\'>' +
                '       <span class=template-content data-bind=\'text: text\'></span>' +
                '   </div>' +
                '</div>'
            ).appendTo(FIXTURE_ELEMENT);

            const vm = {
                text: ko.observable('outer')
            };

            ko.applyBindings(vm, markup[0]);

            const templateContent = markup.find('.template-content');

            assert.equal(vm.text.getSubscriptionsCount(), 1);

            templateContent.data('dxTestKey', 123);
            dataUtils.removeData(templateContent.get(0), 'dxTestKey');

            assert.equal(vm.text.getSubscriptionsCount(), 1);
        });

        QUnit.test('widget inside two nested containers', function(assert) {
            const markup = $(
                '<div data-bind=\'dxTestContainer: { text: outerText }\'>' +
                '   <div class=middle data-bind=\'dxTestContainer: { text: middleText }\'>' +
                '       <div class=inner data-bind=\'dxTestWidget: { text: innerText }\'></div>' +
                '   </div>' +
                '</div>'
            ).appendTo(FIXTURE_ELEMENT);

            const vm = {
                outerText: ko.observable('outerText'),
                middleText: ko.observable('middleText'),
                innerText: ko.observable('innerText')
            };

            ko.applyBindings(vm, markup[0]);

            vm.outerText('new outerText');
            vm.middleText('new middleText');
            vm.innerText('new innerText');

            const outer = markup;
            assert.equal($.trim(outer.find('.dx-content:first > span').text()), 'new outerText');

            const middle = markup.find('.middle');
            assert.equal($.trim(middle.find('.dx-content:first > span').text()), 'new middleText');

            const inner = markup.find('.inner');
            assert.equal($.trim(inner.find('span').text()), 'new innerText');
        });
    }
);

QUnit.module('Widget & CollectionWidget with templates enabled', function() {
    const TestContainer = Widget.inherit({
        _renderContentImpl: function() {
            if(this.option('integrationOptions.templates').template) {
                this.option('integrationOptions.templates').template.render({ container: this.$element() });
            }
        }
    });

    QUnit.test('widget should use Template, but not KoTemplate, if it created not as KO binding', function(assert) {
        registerComponent('dxTestContainer', TestContainer);
        const testContainer = $('<div></div>').appendTo(FIXTURE_ELEMENT).dxTestContainer({ myTemplate: 'item' }).dxTestContainer('instance');
        assert.ok(!(testContainer._getTemplateByOption('myTemplate') instanceof KoTemplate));
    });

    QUnit.test('default KO template is not retrieved for widgets created with knockout', function(assert) {
        registerComponent('dxTestContainer', TestContainer);

        try {
            let markup;
            let instance;
            let template;

            // knockout scenario
            markup = $('<div data-bind=\'dxTestContainer: { }\'></div>').appendTo(FIXTURE_ELEMENT);
            ko.applyBindings({}, markup.get(0));
            instance = markup.dxTestContainer('instance');
            template = instance._getTemplate('test');
            assert.ok((template instanceof KoTemplate), 'default Ko template not retrieved');

            // jquery scenario
            markup = $('<div></div>').appendTo(FIXTURE_ELEMENT)
                .dxTestContainer({});
            instance = markup.dxTestContainer('instance');
            template = instance._getTemplate('test');
            assert.ok(!(template instanceof KoTemplate), 'default Ko template is not retrieved');

        } finally {
            cleanComponentRegistrations('dxTestContainer');
        }
    });

    QUnit.test('retrieving default KO template only for collection widgets created with knockout', function(assert) {
        const TestContainer = CollectionWidget.inherit({
            _renderContentImpl: function() {
                if(this.option('integrationOptions.templates').template) {
                    this.option('integrationOptions.templates').template.render({ container: this.$element() });
                }
            }
        });

        registerComponent('dxTestContainer', TestContainer);

        try {
            let markup;
            let instance;
            let template;

            // knockout scenario
            markup = $('<div data-bind=\'dxTestContainer: { }\'></div>').appendTo(FIXTURE_ELEMENT);
            ko.applyBindings({}, markup.get(0));
            instance = markup.dxTestContainer('instance');
            template = instance._getTemplate('test');
            assert.ok(template instanceof KoTemplate, 'default Ko template retrieved');

            // jquery scenario
            markup = $('<div></div>').appendTo(FIXTURE_ELEMENT)
                .dxTestContainer({});
            instance = markup.dxTestContainer('instance');
            template = instance._getTemplate('test');
            assert.ok(!(template instanceof KoTemplate), 'default Ko template not retrieved');

        } finally {
            cleanComponentRegistrations('dxTestContainer');
        }
    });

    QUnit.test('creates default template from its contents', function(assert) {
        const TestContainer = Widget.inherit({
            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                    items: null
                });
            },

            _render: function() {
                this.option('integrationOptions.templates')['template'].render({ container: this.$element() });
            },

            _renderContentImpl: noop,

            _clean: function() {
                this.$element().empty();
            }
        });

        registerComponent('dxTestContainer', TestContainer);
        try {

            const markup = $(
                '<div data-bind=\'dxTestContainer: { items: items }\'>' +
                '   <ul data-bind=\'foreach: items\'>' +
                '       <li data-bind=\'text: $data\'></li>' +
                '   </ul>' +
                '</div>'
            ).appendTo(FIXTURE_ELEMENT);

            const vm = {
                items: ko.observableArray([1, 2, 3])
            };

            ko.applyBindings(vm, markup[0]);

            const instance = markup.dxTestContainer('instance');

            assert.ok(instance.option('integrationOptions.templates'));
            assert.ok(instance.option('integrationOptions.templates')['template']);

            const list = markup.find('ul');
            assert.equal(list.length, 1);

            const listItems = list.children();
            assert.equal(listItems.length, 3);
            assert.equal(listItems.text(), '123');

        } finally {
            cleanComponentRegistrations('dxTestContainer');
        }
    });

    QUnit.test('binding-context of KoTemplate', function(assert) {
        const TestRepeater = Widget.inherit({

            _defaultOptions: function() {
                return $.extend(this.callBase(), {
                    items: []
                });
            },

            _render: function() {
                const that = this;
                $.each(that.option('items'), function(index, item) {
                    that.option('integrationOptions.templates')['itemTemplate'].render({
                        model: item,
                        container: that.$element()
                    });
                });
            },

            _renderContentImpl: noop,

            _clean: function() {
                this.$element().empty();
            }
        });

        registerComponent('dxTestRepeater', TestRepeater);
        try {
            const markup = $(
                '<div data-bind=\'dxTestRepeater: { items: items }\'>' +
                '    <div data-options=\'dxTemplate: { name: ' + '"itemTemplate"' + '}\'>' +
                '        <div class=item data-bind=\'text: $data\'></div>' +
                '    </div>' +
                '</div>'
            ).appendTo(FIXTURE_ELEMENT);

            const vm = {
                items: [1, 2, 3]
            };

            ko.applyBindings(vm, markup[0]);

            const items = markup.find('.item');
            assert.ok(ko.contextFor(items[1]).$parent);
            assert.ok(ko.contextFor(items[1]).$parentContext);

        } finally {
            cleanComponentRegistrations('dxTestRepeater');
        }
    });
});


QUnit.module(
    'component disposing on node removing',
    {
        beforeEach: function() {
            this.$element = $('<div>').appendTo(FIXTURE_ELEMENT);
        },
        afterEach: function() {
            this.$element.remove();
        }
    },
    function() {
        QUnit.test('ko.observable subscriptions should be disposed', function(assert) {
            const TestComponent = DOMComponent.inherit({
                _defaultOptions: function() {
                    return { text: '', array: [], obj: null };
                }
            });

            registerComponent('dxTest', TestComponent);

            let markup = $('<div></div>')
                .attr('data-bind', 'dxTest: { text: text }')
                .appendTo(FIXTURE_ELEMENT);

            let vm = {
                text: ko.observable('my text')
            };

            ko.applyBindings(vm, markup[0]);

            assert.equal(vm.text.getSubscriptionsCount(), 1);

            markup.remove();
            assert.equal(vm.text.getSubscriptionsCount(), 0);

            vm = {
                items: ko.observableArray([
                    { text: ko.observable('0') },
                    { text: ko.observable('1') }
                ])
            };

            markup = $(
                '<div>' +
                '   <!-- ko foreach: items -->' +
                '       <div data-bind=\'dxTest: { text: text }\'></div>' +
                '   <!-- /ko -->' +
                '</div>'
            ).appendTo(FIXTURE_ELEMENT);

            ko.applyBindings(vm, markup[0]);

            markup.remove();

            assert.equal(vm.items.getSubscriptionsCount(), 0);
            assert.equal(vm.items()[0].text.getSubscriptionsCount(), 0);
            assert.equal(vm.items()[1].text.getSubscriptionsCount(), 0);
        });

        QUnit.test('regressions: nested component should be disposed', function(assert) {
            const TestComponent = DOMComponent.inherit({
                NAME: 'TestComponent',
                _dispose: function() {
                    this.__disposed__ = true;
                }
            });

            registerComponent('TestComponent', TestComponent);

            const $outerComponent = this.$element;
            const $innerComponent = $('<div></div>').appendTo($outerComponent);
            const outerComponent = new TestComponent($outerComponent, {});
            const innerComponent = new TestComponent($innerComponent, {});

            $outerComponent.remove();

            assert.ok(outerComponent['__disposed__']);
            assert.ok(innerComponent['__disposed__']);
        });

        $.each({
            'KO case': function($element) { ko.removeNode($element.get(0)); },
            '$ case': function($element) { $element.remove(); }
        }, function(caseName, removeFunc) {
            QUnit.test('regression: B233447 - component disposing should be called once per component (' + caseName + ')', function(assert) {
                registerComponent(
                    'dxTestComponent',
                    DOMComponent.inherit({
                        _dispose: function() {
                            this.__disposeCount__ = this.__disposeCount__ || 0;
                            this.__disposeCount__++;
                        }
                    })
                );

                try {
                    const $component = this.$element.attr('data-bind', 'dxTestComponent:{ }');
                    const $innerComponent = $('<div data-bind="dxTestComponent:{ }"></div>').appendTo($component);

                    ko.applyBindings({}, $component.get(0));

                    const component = $component.dxTestComponent('instance');
                    const innerComponent = $innerComponent.dxTestComponent('instance');

                    removeFunc($component);

                    assert.equal(component['__disposeCount__'], 1);
                    assert.equal(innerComponent['__disposeCount__'], 1);
                } finally {
                    cleanComponentRegistrations('dxTestComponent');
                }
            });
        });

        QUnit.test('CollectionWidget clean subscriptions', function(assert) {
            const TestCollectionContainer = CollectionWidget.inherit({
                _itemClass: function() {
                    return 'dx-test-item';
                },

                _itemDataKey: function() {
                    return 'dxTestItemData';
                }
            });

            registerComponent('dxTestCollectionContainer', TestCollectionContainer);

            const vm = {
                items: ko.observableArray([
                    { text: ko.observable('0') },
                    { text: ko.observable('1') }
                ])
            };

            const markup = $(
                '<div data-bind=\'dxTestCollectionContainer: { items: items }\'>' +
                '</div>'
            ).appendTo(FIXTURE_ELEMENT);

            ko.applyBindings(vm, markup.get(0));

            assert.equal(markup.children().eq(1).text(), '1');

            vm.items.push({ text: ko.observable('2') });
            assert.equal(markup.children().eq(2).text(), '2');

            vm.items.splice(1, 1);
            assert.equal(markup.children().length, 2);

            assert.equal(vm.items.getSubscriptionsCount(), 1);
            assert.equal(vm.items()[0].text.getSubscriptionsCount(), 1);

            markup.dxTestCollectionContainer('instance')._refresh();

            assert.equal(vm.items.getSubscriptionsCount(), 1);
            assert.equal(vm.items()[0].text.getSubscriptionsCount(), 1);

            markup.remove();

            assert.equal(vm.items.getSubscriptionsCount(), 0);
            assert.equal(vm.items()[0].text.getSubscriptionsCount(), 0);
            assert.equal(vm.items()[1].text.getSubscriptionsCount(), 0);
        });

    }
);


QUnit.module(
    'component action context',
    {
        beforeEach: function() {
            registerComponent('dxTest', DOMComponent.inherit({
                _defaultOptions: function() {
                    return $.extend(this.callBase(), {
                        onHandler: noop
                    });
                },

                trigger: function(e) {
                    this._createActionByOption('onHandler')(e);
                }
            }));

            $(
                '<div id=\'aggregatedModelComponentActionContext\'>' +
                    '<!-- ko with: subVM -->' +
                    '<div class=\'test\' data-bind=\'dxTest: { onHandler: handler }\'></div>' +
                    '<!-- /ko -->' +
                '</div>'
            ).appendTo(FIXTURE_ELEMENT);
        }
    },
    function() {
        QUnit.test('component action context is component', function(assert) {
            let context;
            const handler = function(e) {
                context = this;
            };

            const markup = $('<div></div>').appendTo(FIXTURE_ELEMENT);
            markup.dxTest({ onHandler: handler });

            const component = markup.dxTest('instance');
            component.trigger();

            assert.equal(context, component);
        });

        QUnit.test('component action context is model', function(assert) {
            const markup = $('<div></div>').attr('data-bind', 'dxTest: { onHandler: handler }').appendTo(FIXTURE_ELEMENT);
            let context;
            const vm = {
                handler: function(e) {
                    context = this;
                }
            };

            ko.applyBindings(vm, markup[0]);

            markup.dxTest('instance').trigger();

            assert.equal(context, vm);
        });

        QUnit.test('component action context is aggregated model', function(assert) {
            let context;

            const subVM = {
                handler: function(e) {
                    context = this;
                }
            };

            const vm = {
                subVM: subVM
            };

            ko.applyBindings(vm, $('#aggregatedModelComponentActionContext').get(0));

            dataUtils.data($('#aggregatedModelComponentActionContext .test').get(0), 'dxTest').trigger();

            assert.equal(context, subVM);
        });
    }
);


QUnit.module('Template w/o ko scenario', function() {

    QUnit.test('widget with templates enabled', function(assert) {
        const TestContainer = Widget.inherit({
            _renderContentImpl: function() {
                if(this.option('integrationOptions.templates').template) {
                    this.option('integrationOptions.templates').template.render({ container: this.$element() });
                }
            },
            _optionChanged: function() {
                this._invalidate();
            }
        });

        registerComponent('dxTestContainer', TestContainer);

        try {
            const $markup = $(
                '<div data-bind=\'dxTestContainer: { }\'>' +
                '    <div class=\'content\'>Test</div>' +
                '</div>'
            ).appendTo(FIXTURE_ELEMENT);

            $markup.dxTestContainer();
            assert.equal($markup.find('.content').length, 1, 'template rendered');
            assert.equal($.trim($markup.text()), 'Test', 'template rendered correctly');
        } finally {
            cleanComponentRegistrations('dxTestContainer');
        }
    });

    QUnit.test('collection container widget', function(assert) {
        const TestCollectionContainer = CollectionWidget.inherit({
            _itemClass: function() {
                return 'dx-test-item';
            },

            _itemDataKey: function() {
                return 'dxTestItemData';
            }
        });

        registerComponent('dxTestCollectionContainer', TestCollectionContainer);

        try {
            const $markup = $(
                '<div data-bind=\'dxTestCollectionContainer: { items: items }\'>' +
                '    <div data-options=\'dxTemplate: {name: "item"}\'>' +
                '        <div>Test</div>' +
                '    </div>' +
                '</div>'
            ).appendTo(FIXTURE_ELEMENT);

            $markup.dxTestCollectionContainer({
                items: ['item1', 'item2', 'item3']
            });

            assert.equal($markup.find('.dx-test-item').length, 3, 'required amount of items rendered');
            assert.equal($markup.text().replace(/ /g, ''), 'TestTestTest', 'items content rendered');

        } finally {
            cleanComponentRegistrations('dxTestContainer');
        }
    });
});

QUnit.module('predicate for manual option binding control', {
    beforeEach: function() {
        config({
            knockout: {
                isBindingPropertyPredicateName: 'isBindingProperty'
            }
        });

        registerComponent('dxTest', DOMComponent.inherit());

        this.$component = $('<div></div>')
            .attr('data-bind', 'dxTest: $data')
            .appendTo(FIXTURE_ELEMENT);
    },
    afterEach: function() {
        delete config().knockout;
        cleanComponentRegistrations('dxTest');
    }
}, function() {

    QUnit.test('returns false - observable property value should not be unwrapped', function(assert) {
        const vm = {
            isBindingProperty: function(propertyPath, propertyName, model) {
                return propertyPath !== 'bindingProperty';
            },

            bindingProperty: ko.observable()
        };

        ko.applyBindings(vm, this.$component[0]);

        assert.equal(vm.bindingProperty.getSubscriptionsCount(), 0);
    });

    QUnit.test('returns false - nested observable property value should not be unwrapped', function(assert) {
        const vm = {
            isBindingProperty: function(propertyPath, propertyName, model) {
                return propertyPath.indexOf('objectProperty') < 0;
            },
            objectProperty: {
                nestedProperty: ko.observable()
            }
        };

        ko.applyBindings(vm, this.$component[0]);

        assert.equal(vm.objectProperty.nestedProperty.getSubscriptionsCount(), 0);
    });

    QUnit.test('returns true - observable property value should be unwrapped', function(assert) {
        const vm = {
            isBindingProperty: function(propertyPath, propertyName, model) {
                return propertyPath === 'bindingProperty';
            },
            bindingProperty: ko.observable()
        };

        ko.applyBindings(vm, this.$component[0]);

        assert.equal(vm.bindingProperty.getSubscriptionsCount(), 1);
    });

    QUnit.test('returns true - nested observable property value should be unwrapped', function(assert) {
        const vm = {
            isBindingProperty: function(propertyPath, propertyName, model) {
                return propertyPath.indexOf('objectProperty') === 0;
            },
            objectProperty: {
                nestedProperty: ko.observable()
            }
        };

        ko.applyBindings(vm, this.$component[0]);

        assert.equal(vm.objectProperty.nestedProperty.getSubscriptionsCount(), 1);
    });

    QUnit.test('returns undefined = returns false', function(assert) {
        const vm = {
            isBindingProperty: noop,
            bindingProperty: ko.observable('value')
        };

        ko.applyBindings(vm, this.$component[0]);

        assert.equal(vm.bindingProperty.getSubscriptionsCount(), 0);
    });

    QUnit.test('despite the return value, property value should be passed to component', function(assert) {
        const bindingPropertyValue = '1';
        const nonBindingPropertyValue = '2';
        const primitiveProperty = '3';

        const vm = {
            isBindingProperty: function(propertyPath, propertyName, model) {
                switch(propertyPath) {
                    case 'bindingProperty':
                        return true;
                    case 'nonBindingProperty':
                        return false;
                    default:
                        return undefined;
                }
            },
            bindingProperty: ko.observable(bindingPropertyValue),
            nonBindingProperty: ko.observable(nonBindingPropertyValue),
            primitiveProperty: primitiveProperty
        };

        ko.applyBindings(vm, this.$component[0]);

        assert.equal(this.$component.dxTest('option', 'bindingProperty'), bindingPropertyValue);
        assert.equal(this.$component.dxTest('option', 'nonBindingProperty'), nonBindingPropertyValue);
        assert.equal(this.$component.dxTest('option', 'primitiveProperty'), primitiveProperty);
    });

    QUnit.test('should be taken in account only at the first viewmodel level', function(assert) {
        const vm = {
            objectOption: {
                isBindingProperty: sinon.spy()
            },

            bindingProperty: ko.observable('value')
        };

        ko.applyBindings(vm, this.$component[0]);

        assert.ok(!vm.objectOption.isBindingProperty.called);
    });

    QUnit.test('should not be called for itself', function(assert) {
        const vm = {
            isBindingProperty: sinon.spy()
        };

        ko.applyBindings(vm, this.$component[0]);

        assert.ok(!vm.isBindingProperty.called);
    });

    QUnit.test('should not be unwrapped and passed to component', function(assert) {
        const vm = {
            isBindingProperty: ko.observable(true)
        };

        ko.applyBindings(vm, this.$component[0]);

        assert.equal(vm.isBindingProperty.getSubscriptionsCount(), 0);
        assert.strictEqual(this.$component.dxTest('option', 'isBindingProperty'), undefined);
    });

    QUnit.test('arguments are \'propertyPath\', \'propertyName\', \'currentModel\'', function(assert) {
        const vm = {
            isBindingProperty: sinon.spy(function() { return true; }),

            objectProperty: {
                nestedProperty: 'value'
            }
        };

        ko.applyBindings(vm, this.$component[0]);

        assert.deepEqual(vm.isBindingProperty.args, [
            [ 'objectProperty', 'objectProperty', vm ],
            [ 'objectProperty.nestedProperty', 'nestedProperty', vm.objectProperty ]
        ]);
    });

    QUnit.test('options changing after component created', function(assert) {
        const isBindingProperty = function() {
            return false;
        };

        const vm = {
            options: ko.observable({
                isBindingProperty: isBindingProperty,
                option1: true
            })
        };

        const markup = $('<div></div>').attr('data-bind', 'dxTest: $data').appendTo(FIXTURE_ELEMENT);
        ko.applyBindings(vm.options, markup[0]);

        vm.options({
            isBindingProperty: isBindingProperty,
            option1: false
        });

        assert.equal(markup.dxTest('option', 'option1'), false);
    });
});
