"use strict";

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    angular = require("angular"),
    registerComponent = require("core/component_registrator"),
    DOMComponent = require("core/dom_component"),
    Widget = require("ui/widget/ui.widget"),
    NgTemplate = require("integration/angular/template"),
    ValidationGroup = require("ui/validation_group"),
    CollectionWidget = require("ui/collection/ui.collection_widget.edit"),
    inflector = require("core/utils/inflector");

require("ui/defer_rendering");
require("ui/popup");
require("ui/slide_out_view");
require("ui/pivot");
require("ui/data_grid");
require("ui/toolbar");
require("ui/box");
require("ui/scheduler");

require("integration/angular");
require("angular-route");

var FIXTURE_ELEMENT = function() { return $("#qunit-fixture").attr("ng-app", "testApp"); };

var ignoreAngularBrowserDeferTimer = function(args) {
    return args.timerType === "timeouts" && (args.callback.toString().indexOf("delete pendingDeferIds[timeoutId];") > -1 || args.callback.toString().indexOf("delete F[c];e(a)}") > -1);
};

QUnit.module("simple component tests", {
    beforeEach: function() {
        var componentRendered = $.Callbacks();
        var TestComponent = DOMComponent.inherit({
            _render: function() {
                componentRendered.fire();
                return this.callBase.apply(this, arguments);
            },
            _optionChanged: function() {
                this._invalidate();
            },
            _getDefaultOptions: function() {
                return { text: "", array: [], obj: null };
            }
        });

        this.componentRendered = componentRendered;
        this.testApp = angular.module("testApp", ["dx"]);
        this.$container = $("<div/>").appendTo(FIXTURE_ELEMENT());
        this.$controller = $("<div></div>")
            .attr("ng-controller", "my-controller")
            .appendTo(this.$container);

        registerComponent("dxTest", TestComponent);

        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach: function() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

QUnit.test("simple component init", function(assert) {
    var $markup = $("<div></div>")
        .attr("dx-test", "{ text: 'my text' }")
        .appendTo(this.$controller);

    this.testApp.controller("my-controller", function() { });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.data("dxTest"),
        scope = $markup.scope();

    assert.equal(instance.option("text"), "my text");

    assert.strictEqual($markup.scope(), scope);

    assert.ok(!scope.$$watchers);
});

QUnit.test("component options from scope", function(assert) {
    var $markup = $("<div></div>")
            .attr("dx-test", "options")
            .appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        $scope.options = {
            text: "my text"
        };
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.data("dxTest"),
        scope = $markup.scope();

    assert.equal(instance.option("text"), "my text");

    scope.$apply(function() {
        scope.options.text = "change1";
    });
    assert.equal(instance.option("text"), "my text");

    instance.option("text", "change2");
    assert.equal(scope.options.text, "change1");

    assert.strictEqual($markup.scope(), scope);

    assert.ok(!scope.$$watchers);
});

QUnit.test("component option fields from scope", function(assert) {
    var $markup = $("<div></div>")
            .attr("dx-test", "{ text: vm.text }")
            .appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        $scope.vm = {
            text: "my text"
        };
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.data("dxTest"),
        scope = $markup.scope();

    assert.equal(instance.option("text"), "my text");

    scope.$apply(function() {
        scope.vm.text = "change1";
    });
    assert.equal(instance.option("text"), "my text");

    instance.option("text", "change2");
    assert.equal(scope.vm.text, "change1");

    assert.strictEqual($markup.scope(), scope);

    assert.ok(!scope.$$watchers);
});

QUnit.test("component with bindingOptions", function(assert) {
    var $markup = $("<div></div>")
            .attr("dx-test", "{ bindingOptions: { text: 'vm.text' } }")
            .appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        $scope.vm = {
            text: "my text"
        };
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.data("dxTest"),
        scope = $markup.scope();

    assert.equal(instance.option("text"), "my text");

    scope.$apply(function() {
        scope.vm.text = "change1";
    });
    assert.equal(instance.option("text"), "change1");

    instance.option("text", "change2");
    assert.equal(scope.vm.text, "change2");

    assert.strictEqual($markup.scope(), scope);

    assert.equal(scope.$$watchers.length, 1);

    $markup.remove();
    assert.equal(scope.$$watchers.length, 0);
});

QUnit.test("component with bindingOptions and computed binding", function(assert) {
    var $markup = $("<div></div>")
            .attr("dx-test", "{ bindingOptions: { text: 'vm[field]' } }")
            .appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        $scope.vm = {
            text: "my text"
        };
        $scope.field = "text";
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.data("dxTest"),
        scope = $markup.scope();

    assert.equal(instance.option("text"), "my text");

    scope.$apply(function() {
        scope.vm.text = "change1";
    });
    assert.equal(instance.option("text"), "change1");

    instance.option("text", "change2");
    assert.equal(scope.vm.text, "change2");
});

QUnit.test("component with bindingOptions for nested option", function(assert) {
    var $markup = $("<div></div>")
            .attr("dx-test", "{ obj: { }, bindingOptions: { 'obj.text': 'vm.caption' } }")
            .appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        $scope.vm = {
            caption: "my text"
        };
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.data("dxTest"),
        scope = $markup.scope();

    assert.equal(instance.option("obj.text"), "my text");

    scope.$apply(function() {
        scope.vm.caption = "change1";
    });
    assert.equal(instance.option("obj.text"), "change1");

    instance.option("obj.text", "change2");
    assert.equal(scope.vm.caption, "change2");
});

QUnit.test("component with bindingOptions from scope", function(assert) {
    var $markup = $("<div></div>")
            .attr("dx-test", "{ bindingOptions: defs }")
            .appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        $scope.vm = {
            text: "my text"
        };

        $scope.defs = {
            text: "vm.text"
        };
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.data("dxTest"),
        scope = $markup.scope();

    assert.equal(instance.option("text"), "my text");

    scope.$apply(function() {
        scope.vm.text = "change1";
    });
    assert.equal(instance.option("text"), "change1");

    instance.option("text", "change2");
    assert.equal(scope.vm.text, "change2");

    assert.strictEqual($markup.scope(), scope);

    assert.equal(scope.$$watchers.length, 1);

    $markup.remove();
    assert.equal(scope.$$watchers.length, 0);
});

QUnit.test("component with bindingOptions from scope inside sync action (T302197)", function(assert) {
    var $markup = $("<div></div>")
            .attr("dx-test", "{ onInitialized: inited, bindingOptions: defs }")
            .appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        $scope.vm = {
            text: "my text"
        };
        $scope.inited = function() {
            $scope.vm.text = "new text";
        };

        $scope.defs = {
            text: "vm.text"
        };
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.data("dxTest");

    assert.equal(instance.option("text"), "new text");
});

QUnit.test("component with bindingOptions from scope when invalid value for widget was set (T403775)", function(assert) {
    var TestComponent = DOMComponent.inherit({
        _optionChanged: function(args) {
            this._invalidate();
            if(args.name === "width" && args.value < 0) {
                this.option("width", 0);
            }
        }
    });

    registerComponent("dxTestWithValidatedOption", TestComponent);

    var $markup = $("<div></div>")
            .attr("dx-test-with-validated-option", "{ bindingOptions: { width: 'width' }}")
            .appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        $scope.width = 10;
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.data("dxTestWithValidatedOption"),
        scope = $markup.scope();

    assert.equal(scope.width, 10);
    assert.equal(instance.option("width"), 10);

    scope.$apply(function() {
        scope.width = -1;
    });

    assert.equal(scope.width, 0);
    assert.equal(instance.option("width"), 0);
});

QUnit.test("bindingOptions can be inherited inside options object (T426046)", function(assert) {
    var $markup = $("<div></div>")
            .attr("dx-test", "config")
            .appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        function baseOption() { }

        baseOption.prototype.bindingOptions = {
            text: 'text'
        };

        $scope.config = new baseOption();
        $scope.text = "my text";
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.data("dxTest"),
        scope = $markup.scope();

    assert.equal(instance.option("text"), "my text");

    instance.option("text", "change text");
    assert.equal(scope.text, "change text");
});

QUnit.test("bindingOptions fields can be inherited", function(assert) {
    var $markup = $("<div></div>")
            .attr("dx-test", "config")
            .appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        function baseOption() { }

        baseOption.prototype.text = 'text';

        $scope.config = {};
        $scope.config.bindingOptions = new baseOption();

        $scope.text = "my text";
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.data("dxTest"),
        scope = $markup.scope();

    assert.equal(instance.option("text"), "my text");

    instance.option("text", "change text");
    assert.equal(scope.text, "change text");
});

QUnit.test("repeat binding", function(assert) {
    var $markup = $("<div/>").appendTo(this.$controller),
        scope;

    $markup.append($(
        "<div ng-repeat='item in vm.items'>" +
        "   <div dx-test=\"{ bindingOptions: { text: 'item.text' } }\"></div>" +
        "</div>"
    ));

    this.testApp.controller("my-controller", function($scope) {
        scope = $scope;

        $scope.vm = {
            items: [
                { text: "0" },
                { text: "1" }
            ]
        };
    });

    angular.bootstrap(this.$container, ["testApp"]);

    assert.equal($markup.children().eq(1).children().dxTest("option", "text"), "1");

    scope.$apply(function() {
        scope.vm.items.push({ text: "2" });
    });
    assert.equal($markup.children().eq(2).children().dxTest("option", "text"), "2");

    scope.$apply(function() {
        scope.vm.items.splice(1, 1);
    });
    assert.equal($markup.children().length, 2);

    var $firstElement = $markup.children().eq(1).children(),
        $secondElement = $markup.children().eq(1).children(),
        firstScope = $firstElement.scope(),
        secondScope = $secondElement.scope();

    scope.$apply(function() {
        $markup.remove();
    });

    // NOTE: We can not check if scope.$$watchers.length equals 0 because of known issue with memory leaks with ng-repeat in Angular.

    assert.equal(firstScope.$$watchers.length, 0);
    assert.equal(secondScope.$$watchers.length, 0);
});

QUnit.test("DOMComponent does not control descendant bindings", function(assert) {
    var $markup = $("<div/>").appendTo(this.$controller);

    $markup.append($(
        "<div dx-test>" +
        "   <ul>" +
        "       <li ng-repeat='item in vm.items' ng-bind='item'></li>" +
        "   </ul>" +
        "</div>"
    ));

    this.testApp.controller("my-controller", function($scope) {
        $scope.vm = {
            items: [1, 2, 3]
        };
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var listItems = $markup.find("ul").children();
    assert.equal(listItems.length, 3);
    assert.equal(listItems.text(), "123");
});

QUnit.test("changing a field of bound object changes component option", function(assert) {
    var $markup = $("<div></div>")
            .attr("dx-test", "{ bindingOptions: { obj: 'obj' } }")
            .appendTo(this.$controller),
        optionChanged = false;

    this.testApp.controller("my-controller", function($scope) {
        $scope.obj = {
            a: 42
        };
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.data("dxTest"),
        scope = $markup.scope();

    assert.ok(!optionChanged);

    instance.on("optionChanged", function() {
        optionChanged = true;
    });
    scope.$apply(function() {
        scope.obj.a = 43;
    });

    assert.ok(optionChanged);
});

QUnit.test("binding options with deep=true for array option", function(assert) {
    var $markup = $("<div></div>")
            .attr("dx-test", "{ bindingOptions: { items: { deep: true, dataPath: 'dataItems' } } }")
            .appendTo(this.$controller),
        optionChanged = false;

    this.testApp.controller("my-controller", function($scope) {
        $scope.dataItems = [
            { value: 1 },
            { value: 2 },
            { value: 3 }
        ];
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.data("dxTest"),
        scope = $markup.scope();

    assert.ok(!optionChanged);

    instance.on("optionChanged", function() {
        optionChanged = true;
    });

    scope.$apply(function() {
        scope.dataItems[0].value = 42;
    });

    assert.ok(optionChanged);
    assert.equal(instance.option('items')[0].value, 42);
});

QUnit.test("binding options with deep=false for array option", function(assert) {
    var $markup = $("<div></div>")
            .attr("dx-test", "{ bindingOptions: { items: { deep: false, dataPath: 'dataItems' } } }")
            .appendTo(this.$controller),
        optionChanged = false;

    this.testApp.controller("my-controller", function($scope) {
        $scope.dataItems = [
            { value: 1 },
            { value: 2 },
            { value: 3 }
        ];
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.data("dxTest"),
        scope = $markup.scope();

    assert.ok(!optionChanged);

    instance.on("optionChanged", function() {
        optionChanged = true;
    });

    scope.$apply(function() {
        scope.dataItems[0].value = 42;
    });

    assert.ok(!optionChanged);
    assert.equal(instance.option('items')[0].value, 42);
});

QUnit.test("binding options with deep=true for not array option", function(assert) {
    var $markup = $("<div></div>")
            .attr("dx-test", "{ bindingOptions: { option: { deep: true, dataPath: 'dataValue' } } }")
            .appendTo(this.$controller),
        optionChanged = false;

    this.testApp.controller("my-controller", function($scope) {
        $scope.dataValue = { value: 1 };
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.data("dxTest"),
        scope = $markup.scope();

    assert.ok(!optionChanged);

    instance.on("optionChanged", function() {
        optionChanged = true;
    });

    scope.$apply(function() {
        scope.dataValue.value = 42;
    });

    assert.ok(optionChanged);
    assert.equal(instance.option('option').value, 42);
});

QUnit.test("binding options with deep=false for not array option", function(assert) {
    var $markup = $("<div></div>")
            .attr("dx-test", "{ bindingOptions: { text: { deep: false, dataPath: 'dataValue' } } }")
            .appendTo(this.$controller),
        optionChanged = false;

    this.testApp.controller("my-controller", function($scope) {
        $scope.dataValue = { value: 1 };
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.data("dxTest"),
        scope = $markup.scope();

    instance.on("optionChanged", function() {
        optionChanged = true;
    });

    scope.$apply(function() {
        scope.dataValue.value = 42;
    });

    assert.ok(!optionChanged);
});

QUnit.test("binding should fired once when option is a plain object", function(assert) {
    if(angular.version.minor < 3) {
        assert.expect(0);
        return;
    }

    var $markup = $("<div></div>")
            .attr("dx-test", "{ bindingOptions: { testOption: 'dataValue' }, onOptionChanged: optionChangedHandler }")
            .appendTo(this.$controller);

    var spy = sinon.spy();

    this.testApp.controller("my-controller", function($scope) {
        $scope.optionChangedHandler = spy;
        $scope.dataValue = { value: 1 };
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.data("dxTest");

    spy.reset();
    instance.option("testOption", { value: 2 });

    assert.equal(spy.callCount, 1, "optionChanged action fired once");
});

QUnit.test("dependence options changed when option is a plain object", function(assert) {
    if(angular.version.minor < 3) {
        assert.expect(0);
        return;
    }

    var $widget = $("<div>")
            .attr("dx-test", "{testOption: testOption, bindingOptions: {'testOption.value': 'testOption.value', 'testOption.dependenceValue': 'testOption.dependenceValue' }}")
            .appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        $scope.testOption = {
            value: { value: 1 },
            dependenceValue: 0
        };

        $scope.$watch("testOption.value", function() {
            $scope.testOption.dependenceValue++;
        });
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var widget = $widget.data("dxTest");
    widget.option("testOption.value", { value: 2 });

    assert.equal(widget.option("testOption.dependenceValue"), 2, "dependence option was changed");
});

QUnit.test("option changed fired after value was set in the same value(plain object) then value was updated using angular", function(assert) {
    if(angular.version.minor < 3) {
        assert.expect(0);
        return;
    }

    var $markup = $("<div></div>")
            .attr("dx-test", "{ bindingOptions: { testOption: 'dataValue' }, onOptionChanged: optionChangedHandler }")
            .appendTo(this.$controller);
    var spy = sinon.spy();
    var value = { value: 1 };
    this.testApp.controller("my-controller", function($scope) {
        $scope.optionChangedHandler = spy;
        $scope.dataValue = value;
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var scope = $markup.scope();
    var instance = $markup.data("dxTest");

    instance.option("testOption", value);

    spy.reset();
    scope.$apply(function() {
        scope.dataValue.value = 3;
    });

    assert.equal(spy.callCount, 1, "optionChanged action fired once");
});

QUnit.test("Variable from scope not re-assign after change the corresponding widget options (T373260)", function(assert) {
    var $markup = $("<div></div>")
            .attr("dx-test", "{ bindingOptions: { option1_widget: 'option1_scope', option2_widget: 'option2_scope' } }")
            .appendTo(this.$controller);

    this.testApp.controller('my-controller', function($scope) {

        Object.defineProperty($scope, "option1_scope", {
            get: function() {
                return $scope.option1;
            },
            set: function(value) {
                $scope.option1 = value;
                $scope.option2 = false;
            }
        });
        Object.defineProperty($scope, "option2_scope", {
            get: function() {
                return $scope.option2;
            },
            set: function(value) {
                assert.ok(false, "this method should not be called");
            }
        });

        $scope.option1 = 1;
        $scope.option2 = true;

    });

    angular.bootstrap(this.$container, ["testApp"]);

    var scope = $markup.scope();
    var instance = $markup.data("dxTest");

    instance.option("option1_widget", 2);

    assert.equal(scope.option2_scope, false, "binding worked");
    assert.equal(instance.option("option2_widget"), false, "binding worked");
});

QUnit.test("Lockers works correctly when widget options changed using action (T381596)", function(assert) {
    var MyComponent = DOMComponent.inherit({
        _getDefaultOptions: function() {
            return $.extend(this.callBase(), {
                onClick: function(e) {
                    e.component.option("testOption", false);
                }
            });
        },
        emulateAction: function() {
            this._createActionByOption("onClick")();
        }
    });
    registerComponent("dxMyComponent", MyComponent);

    var $markup = $("<div></div>")
            .attr("dx-my-component", "{ bindingOptions: { testOption: 'testOption' } }")
            .appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        $scope.testOption = true;

        $scope.changeScopeValue = function() {
            scope.$apply(function() {
                $scope.testOption = true;
            });
        };
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var scope = $markup.scope();
    var instance = $markup.data("dxMyComponent");

    assert.equal(instance.option("testOption"), true, "binding worked");

    instance.emulateAction();
    assert.equal(instance.option("testOption"), false, "binding worked");

    scope.changeScopeValue();
    assert.equal(instance.option("testOption"), true, "binding worked");
});

QUnit.test("WrappedAction should return function result (T388034)", function(assert) {
    var MyComponent = DOMComponent.inherit({
        _getDefaultOptions: function() {
            return $.extend(this.callBase(), {
                onTestAction: function(value) {
                    return value.text;
                }
            });
        },
        emulateAction: function() {
            var testAction = this._createActionByOption("onTestAction");
            return testAction({ text: "testText" });
        }
    });
    registerComponent("dxMyComponent", MyComponent);

    var $markup = $("<div></div>")
            .attr("dx-my-component", "{ }")
            .appendTo(this.$controller);

    this.testApp.controller("my-controller", function() { });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.data("dxMyComponent");

    var result = instance.emulateAction();
    assert.equal(result, "testText", "action return function result");
});

QUnit.test("The 'release' method shouldn't be called for an unlocked Lock object (T400093)", function(assert) {
    var MyComponent = DOMComponent.inherit({
        _getDefaultOptions: function() {
            return $.extend(this.callBase(), {
                onTestAction: function(args) {
                    args.instance.option("text", "second");
                    args.instance.option("text", "third");
                    args.instance.option("obj.text", "second");
                    args.instance.option("obj.text", "third");
                }
            });
        },
        emulateAction: function() {
            var testAction = this._createActionByOption("onTestAction");
            testAction({ instance: this });
        }
    });
    registerComponent("dxMyComponentWithWrappedAction", MyComponent);

    var $markup = $("<div></div>")
            .attr("dx-my-component-with-wrapped-action", "{ bindingOptions: { text: 'text', obj: 'obj' } }")
            .appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        $scope.text = "first";
        $scope.obj = { text: "first" };
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.data("dxMyComponentWithWrappedAction"),
        scope = $markup.scope();

    try {
        instance.emulateAction();
        assert.ok(true, "the error is not thrown");
    } catch(e) {
        assert.ok(false, "the error is thrown (The 'release' method was called for an unlocked Lock object)");
    }
    assert.equal(instance.option("text"), "third");
    assert.equal(scope.text, "third");
    assert.equal(instance.option("obj").text, "third");
    assert.equal(scope.obj.text, "third");
});

QUnit.test("Lockers works correctly when method _optionChangedCallbacks occur in external apply phase (T386467)", function(assert) {
    var $markup = $("<div></div>")
        .attr("dx-test", "{ bindingOptions: {text: 'myText'} }")
        .appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        $scope.myText = "";
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.dxTest("instance"),
        scope = $markup.scope();

    scope.$apply(function() {
        try {
            instance.option("text", "testText");
            assert.ok(true, "the error is not thrown");
        } catch(e) {
            assert.ok(false, "the error is thrown");
        }
    });
});

QUnit.test("Lockers works correctly for composite option (T382985)", function(assert) {
    var $markup = $("<div></div>")
            .attr("dx-test", "{ testOption: testOption, bindingOptions: { 'testOption.text': 'testOption.text' } }")
            .appendTo(this.$controller);

    this.testApp.controller('my-controller', function($scope) {
        $scope.testOption = {};
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var scope = $markup.scope();
    var instance = $markup.data("dxTest");

    scope.$apply(function() {
        scope.testOption.text = "testText";
    });

    assert.equal(instance.option("testOption").text, "testText", "binding worked");

    scope.$apply(function() {
        scope.testOption.text = "";
    });

    assert.equal(instance.option("testOption").text, "", "binding worked");
});

QUnit.test("Lockers works correctly for defineProperty (T396622)", function(assert) {
    var $markup = $("<div></div>")
            .attr("dx-test", "{ bindingOptions: { text: 'publicText' } }")
            .appendTo(this.$controller);

    this.testApp.controller('my-controller', function($scope) {
        $scope.privateText = "test";

        Object.defineProperty($scope, "publicText", {
            get: function() {
                return $scope.privateText;
            },
            set: function(value) {
                $scope.privateText = "calculatedText";
            }
        });
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var scope = $markup.scope();
    var instance = $markup.data("dxTest");

    assert.equal(instance.option("text"), "test", "binding worked");
    assert.equal(scope.publicText, "test", "binding worked");

    instance.option("text", "test2");

    assert.equal(instance.option("text"), "calculatedText", "binding worked");
    assert.equal(scope.publicText, "calculatedText", "binding worked");
});

QUnit.test("Binding works if options config object added to $scope after bootstrap (T314032)", function(assert) {
    var $markup = $("<div></div>")
        .attr("dx-test", "testSettings")
        .appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        $scope.myText = "testText";
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.dxTest("instance"),
        scope = $markup.scope();

    scope.$apply(function() {
        scope.testSettings = {
            bindingOptions: { text: "myText" }
        };
    });

    assert.equal(instance.option("text"), "testText");

    instance.option("text", "testText2");

    assert.equal(scope.myText, "testText2");
});

QUnit.test("changing several options causes single render", function(assert) {
    var $markup = $("<div></div>")
            .attr("dx-test", "testSettings")
            .appendTo(this.$controller),
        renderedCount = 0;

    this.testApp.controller("my-controller", function($scope) {
        $scope.myText = "testText";
        $scope.myObj = { a: 1 };
        $scope.testSettings = {
            bindingOptions: { text: "myText", obj: "myObj" }
        };
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var scope = $markup.scope();

    this.componentRendered.add(function() {
        renderedCount++;
    });

    scope.$apply(function() {
        scope.myText = "testText 2";
        scope.myObj = { b: 2 };
    });

    assert.equal(renderedCount, 1);
});

QUnit.test("beginUpdate and endUpdate must be called in pairs (T373299)", function(assert) {
    var beginWithoutEnd = 0,
        endWithoutBegin = 0;

    var myComponent = DOMComponent.inherit({
        beginUpdate: function() {
            beginWithoutEnd++;
            this.callBase();
        },
        endUpdate: function() {
            if(beginWithoutEnd === 0) {
                endWithoutBegin++;
            } else {
                beginWithoutEnd--;
            }
            this.callBase();
        }
    });

    registerComponent("dxMytest", myComponent);

    var $markup = $("<div dx-mytest='settings'></div>");
    $markup.appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        $scope.myText = "testText";
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var scope = $markup.scope();
    scope.$apply(function() {
        scope.settings = {
            bindingOptions: {
                text: 'myText'
            }
        };
    });

    assert.equal(beginWithoutEnd, 0, "endUpdate was not called without beginUpdate");
    assert.equal(endWithoutBegin, 0, "beginUpdate was not called without endUpdate");
});

QUnit.test("beginUpdate and endUpdate shouldn't fire only once for each apply", function(assert) {
    var beginUpdate = 0,
        endUpdate = 0;

    var myComponent = DOMComponent.inherit({
        beginUpdate: function() {
            beginUpdate++;
            this.callBase();
        },
        endUpdate: function() {
            endUpdate++;
            this.callBase();
        }
    });

    registerComponent("dxMytest", myComponent);

    var $markup = $("<div ng-repeat='item in items'><div dx-mytest='settings' ></div></div>");
    $markup.appendTo(this.$controller);

    var scope;
    this.testApp.controller("my-controller", function($scope) {
        scope = $scope;
        $scope.items = [1];
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var expectedUpdate = 2 * beginUpdate + 1;

    scope.$apply(function() {
        scope.items.push(2);
    });

    assert.equal(beginUpdate, expectedUpdate, "endUpdate was not called without beginUpdate");
    assert.equal(endUpdate, expectedUpdate, "beginUpdate was not called without endUpdate");
});

QUnit.test("Angular component should have 'templatesRenderAsynchronously' option (T351071)", function(assert) {
    var $markup = $("<div></div>")
            .attr("dx-test", "options")
            .appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        $scope.options = {};
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.data("dxTest");

    assert.ok(instance.option("templatesRenderAsynchronously"), "option should exist");
});

QUnit.test("options with undefined value should be passed correctly", function(assert) {
    var $markup = $("<div></div>")
        .attr("dx-test", "options")
        .appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        $scope.options = {
            text: undefined
        };
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.data("dxTest");
    assert.equal(instance.option("text"), undefined, "option is passed correctly");
});

QUnit.test("Binding with several nested options with same parent should work correctly", function(assert) {
    var TestComponentWithDeprecated = DOMComponent.inherit({
        _setDeprecatedOptions: function() {
            this.callBase();

            this._deprecatedOptions['root.deprecated'] = { alias: 'root.child1' };
        }
    });
    registerComponent("dxTestWithDeprecated", TestComponentWithDeprecated);

    var $markup = $("<div>")
        .attr("dx-test-with-deprecated", "{ root: { }, bindingOptions: { 'root.child1': 'prop', 'root.child2': 'prop' } }")
        .appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        $scope.prop = true;
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.data("dxTestWithDeprecated"),
        scope = $markup.scope();

    scope.$apply(function() {
        scope.prop = false;
    });

    assert.equal(instance.option("root.child1"), false);
    assert.equal(instance.option("root.child2"), false);
});

QUnit.module("nested Widget with templates enabled", {
    beforeEach: function() {
        var TestContainer = Widget.inherit({

            _getDefaultOptions: function() {
                return $.extend(this.callBase(), {
                    text: ""
                });
            },

            _render: function() {
                var content = $("<div />")
                        .addClass("dx-content")
                        .appendTo(this.element());

                this.option("integrationOptions.templates")["template"].render({
                    container: content
                });

                var text = this.option("text");
                if(text) {
                    content.append($("<span />").addClass("text-by-option").text(text));
                }
            },

            _renderContentImpl: noop,

            _clean: function() {
                this.element().empty();
            },

            _optionChanged: function() {
                this._invalidate();
            }

        });

        var TestWidget = Widget.inherit({

            _getDefaultOptions: function() {
                return $.extend(this.callBase(), {
                    text: ""
                });
            },

            _render: function() {
                this.element().append($("<span />").text(this.option("text")));
            },

            _renderContentImpl: noop,

            _clean: function() {
                this.element().empty();
            },

            _optionChanged: function() {
                this._invalidate();
            }
        });

        this.testApp = angular.module("testApp", ["dx"]);

        this.$container = $("<div/>").appendTo(FIXTURE_ELEMENT());
        this.$controller = $("<div></div>")
                .attr("ng-controller", "my-controller")
                .appendTo(this.$container);

        registerComponent("dxTestContainer", TestContainer);
        registerComponent("dxTestWidget", TestWidget);

        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach: function() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

QUnit.test("two nested containers", function(assert) {
    var $markup = $(
        "<div class='outerWidget' dx-test-container>" +
            "   <div data-options='dxTemplate: { name: \"template\" }' class='outer-template'>" +
            "       <span ng-bind='vm.outerText'></span>" +
            "       <div class='innerWidget' dx-test-container>" +
            "           <div data-options='dxTemplate: { name: \"template\" }' >" +
            "               <span ng-bind='vm.innerText'></span>" +
            "           </div>" +
            "       </div>" +
            "   </div>" +
            "</div>"
    ).appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        $scope.vm = {
            outerText: "outer",
            innerText: "inner"
        };
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var outerWidget = $markup;
    assert.equal(outerWidget.length, 1);

    var outerContent = outerWidget.children().children().children();
    assert.equal(outerContent.length, 2);
    assert.equal(outerContent.filter("span").text(), "outer");

    var innerWidget = outerContent.filter(".innerWidget");
    assert.equal(innerWidget.length, 1);
    assert.equal(innerWidget.find("span").text(), "inner");
});

QUnit.test("Dispose nested containers", function(assert) {
    var $markup = $(
        "<div class='container'>" +
                "<div class='outer' dx-test-container>" +
                    "<div data-options='dxTemplate: { name: \"template\" }'>" +
                        "<div class='inner' dx-test-container>123</div>" +
                    "</div>" +
                "</div>" +
            "</div>"
        ).appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) { });

    angular.bootstrap(this.$container, ["testApp"]);

    var outer = $markup.find(".outer").data("dxTestContainer"),
        inner = $markup.find(".inner").data("dxTestContainer");

    var outerDisposed = false,
        innerDisposed = false;

    outer.on("disposing", function() {
        outerDisposed = true;
    });

    inner.on("disposing", function() {
        innerDisposed = true;
    });

    outer.element().remove();
    assert.ok(outerDisposed);
    assert.ok(innerDisposed);
});


QUnit.test("widget inside two nested containers", function(assert) {
    var $markup = $(
        "<div dx-test-container='{ bindingOptions: { text: \"vm.outerText\" } }'>" +
            "   <div class='middle' dx-test-container='{ bindingOptions: { text: \"vm.middleText\" } }'>" +
            "       <div class='inner' dx-test-widget='{ bindingOptions: { text: \"vm.innerText\" } }'></div>" +
            "   </div>" +
            "</div>"
        ).appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        $scope.vm = {
            outerText: "outerText",
            middleText: "middleText",
            innerText: "innerText"
        };
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var scope = $markup.scope();

    scope.$apply(function() {
        scope.vm.outerText = "new outerText";
        scope.vm.middleText = "new middleText";
        scope.vm.innerText = "new innerText";
    });

    var outer = $markup;
    assert.equal($.trim(outer.find(".dx-content:first > span").text()), "new outerText");

    var middle = $markup.find(".middle");
    assert.equal($.trim(middle.find(".dx-content:first > span").text()), "new middleText");

    var inner = $markup.find(".inner");
    assert.equal($.trim(inner.find("span").text()), "new innerText");
});

QUnit.test("angular integration don't breaks defaultOptions", function(assert) {
    var TestDOMComponent = DOMComponent.inherit();

    registerComponent("dxTestDOMComponent", TestDOMComponent);

    TestDOMComponent.defaultOptions({
        options: {
            test: "customValue"
        }
    });

    assert.equal(new TestDOMComponent($("<div/>")).option("test"), "customValue", "default option sets correctly");
});

QUnit.test("dynamic templates should be supported by angular", function(assert) {
    var TestContainer = Widget.inherit({
        _renderContentImpl: function(template) {
            this._getTemplateByOption("template").render({
                container: this.element()
            });
        }
    });

    registerComponent("dxTestContainerEmpty", TestContainer);

    var $markup = $("<div dx-test-container-empty='{ bindingOptions: { template: \"vm.template\" } }'></div>").appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        $scope.text = "Test";
        $scope.vm = {
            template: function() {
                return $("<script type=\"text/html\" id=\"scriptTemplate\"><div>{{text}}</div><\/script>");
            }
        };
    });

    angular.bootstrap(this.$container, ["testApp"]);
    assert.equal($.trim($markup.text()), "Test");
});

if(angular.version.minor > 2) {
    QUnit.test("Transclude inside dxComponent template (T318690). Since angularjs 1.3", function(assert) {
        assert.expect(1);
        this.testApp.directive('testDirective', function() {
            return {
                restrict: 'E',
                transclude: true,
                template: "<div dx-test-container>" +
                        "<div data-options='dxTemplate: { name: \"template\" }'>" +
                            "<div ng-transclude></div>" +
                        "</div>" +
                    "</div>"
            };
        });

        var $container = $("<div/>").appendTo(FIXTURE_ELEMENT()),
            $markup = $("<test-directive><div class='transcluded-content'></div></test-directive>").appendTo($container);

        angular.bootstrap($container, ["testApp"]);

        assert.equal($markup.children('[dx-test-container]').find(".transcluded-content").length, 1);
    });
}

QUnit.module("Widget & CollectionWidget with templates enabled", {
    beforeEach: function() {
        this.testApp = angular.module("testApp", ["dx"]);

        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach: function() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

QUnit.test("default NG template is not retrieved for widgets created with angular", function(assert) {
    var TestContainer = Widget.inherit({
        _renderContentImpl: function(template) {
            template = template || this.option("integrationOptions.templates").template;
            if(template) {
                template.render({
                    container: this.element()
                });
            }
        }
    });

    registerComponent("dxTestContainerEmpty", TestContainer);

    var $markup,
        instance,
        template,
        $container = $("<div/>").appendTo(FIXTURE_ELEMENT());

    // angular scenario
    $markup = $("<div dx-test-container-empty></div>").appendTo($container);
    angular.bootstrap($container, ["testApp"]);

    instance = $markup.data("dxTestContainerEmpty");
    template = instance._getTemplate("test");
    assert.ok((template instanceof NgTemplate), "default NG template is not retrieved");

    // jquery scenario
    $markup = $("<div></div>")
        .appendTo($container)
        .dxTestContainerEmpty({});
    instance = $markup.data("dxTestContainerEmpty");
    template = instance._getTemplate("test");
    assert.ok(!(template instanceof NgTemplate), "default NG template not retrieved");
});

QUnit.test("retrieving default NG template for collection widgets created with angular", function(assert) {
    var TestContainer = CollectionWidget.inherit({
        _renderContentImpl: function(template) {
            template = template || this.option("integrationOptions.templates").template;
            if(template) {
                template.render({
                    container: this.element()
                });
            }
        }
    });

    registerComponent("dxTestContainerEmpty", TestContainer);

    var $markup,
        instance,
        template,
        $container = $("<div/>").appendTo(FIXTURE_ELEMENT());

    // angular scenario
    $markup = $("<div dx-test-container-empty></div>").appendTo($container);
    angular.bootstrap($container, ["testApp"]);

    instance = $markup.data("dxTestContainerEmpty");
    template = instance._getTemplate("test");
    assert.ok((template instanceof NgTemplate), "default NG template is not retrieved");

    // jquery scenario
    $markup = $("<div></div>")
        .appendTo($container)
        .dxTestContainerEmpty({});
    instance = $markup.data("dxTestContainerEmpty");
    template = instance._getTemplate("test");
    assert.ok(!(template instanceof NgTemplate), "default NG template not retrieved");
});

QUnit.test("creates anonymous template from its contents", function(assert) {
    var TestContainer = Widget.inherit({
        _getDefaultOptions: function() {
            return $.extend(this.callBase(), {
                items: null
            });
        },

        _render: function() {
            this.option("integrationOptions.templates")["template"].render({
                container: this.element()
            });
        },

        _renderContentImpl: noop,

        _clean: function() {
            this.element().empty();
        }
    });

    registerComponent("dxTestContainerAnonymousTemplate", TestContainer);

    var $container = $("<div/>").appendTo(FIXTURE_ELEMENT()),
        $controller = $("<div/>")
            .attr("ng-controller", "my-controller")
            .appendTo($container),
        $markup = $(
            "<div dx-test-container-anonymous-template='{ bindingOptions: { items: \"vm.items\" } }'>" +
            "   <ul>" +
            "       <li ng-repeat='item in vm.items' ng-bind='item'></li>" +
            "   </ul>" +
            "</div>"
        ).appendTo($controller);

    this.testApp.controller("my-controller", function($scope) {
        $scope.vm = {
            items: [1, 2, 3]
        };
    });

    angular.bootstrap($container, ["testApp"]);

    var instance = $markup.data("dxTestContainerAnonymousTemplate");

    assert.ok(instance.option("integrationOptions.templates"));
    assert.ok(instance.option("integrationOptions.templates")["template"]);

    var list = $markup.find("ul");
    assert.equal(list.length, 1);

    var listItems = list.children();
    assert.equal(listItems.length, 3);
    assert.equal(listItems.text(), "123");
});


QUnit.test("correct scope as model for template", function(assert) {
    var TestContainer = Widget.inherit({
        _getDefaultOptions: function() {
            return $.extend(this.callBase(), {
                items: null
            });
        },

        _render: function() {
            this.option("integrationOptions.templates")["template"].render({
                container: this.element()
            });
        },

        _renderContentImpl: noop,

        _clean: function() {
            this.element().empty();
        }
    });

    registerComponent("dxTestContainerDataTemplate", TestContainer);

    var $container = $("<div/>").appendTo(FIXTURE_ELEMENT()),
        $controller = $("<div/>")
            .attr("ng-controller", "my-controller")
            .appendTo($container),
        $markup = $(
            "<div dx-test-container-data-template>" +
            "   <div>{{vm.text}}</div>" +
            "</div>"
        ).appendTo($controller);

    this.testApp.controller("my-controller", function($scope) {
        $scope.vm = {
            text: "My text"
        };
    });

    angular.bootstrap($container, ["testApp"]);

    assert.equal($.trim($markup.text()), "My text");

    var parentScope = $markup.scope(),
        childScope = $markup.children().scope();

    parentScope.$apply(function() {
        parentScope.vm.text = "New text";
    });

    assert.equal(childScope.vm.text, "New text");
    assert.equal($.trim($markup.text()), "New text");

    childScope.$apply(function() {
        childScope.vm.text = "New text 2";
    });

    assert.equal(parentScope.vm.text, "New text 2");
});

QUnit.test("Directive is in DOM on linking (T306481)", function(assert) {
    assert.expect(1);
    var TestContainer = Widget.inherit({
        _render: function() {
            this.option("integrationOptions.templates")["template"].render({
                container: this.element()
            });
        },
        _renderContentImpl: noop,
        _clean: function() {
            this.element().empty();
        }
    });

    registerComponent("dxTestContainerWidget", TestContainer);

    this.testApp.directive('customDirective', function() {
        return {
            restrict: 'E',
            replace: true,
            template: '<div>InnerContent</div>',
            link: function(scope, element) {
                assert.equal($(element).parent().length, 1, "T306481");
            }
        };
    });

    var $container = $("<div/>").appendTo(FIXTURE_ELEMENT());

    $(
        "<div dx-test-container-widget='{}'>" +
        "   <custom-directive/>" +
        "</div>"
    ).appendTo($container);

    angular.bootstrap($container, ["testApp"]);
});

QUnit.test("Widget options does not override scope properties", function(assert) {
    var TestContainer = Widget.inherit({
        _renderContentImpl: function(template) {
            template = template || this.option("integrationOptions.templates").template;
            if(template) {
                template.render({
                    model: { text: "Widget model" },
                    container: this.element()
                });
            }
        }
    });

    registerComponent("dxTestContainer1", TestContainer);


    var $container = $("<div/>").appendTo(FIXTURE_ELEMENT()),
        $controller = $("<div/>")
            .attr("ng-controller", "my-controller")
            .appendTo($container),
        $markup = $(
            "<div dx-test-container1='{ }'>" +
            "   <div>{{text}}</div>" +
            "</div>"
        ).appendTo($controller);

    this.testApp.controller("my-controller", function($scope) {
        $scope.text = "Controller model";
    });

    angular.bootstrap($container, ["testApp"]);

    assert.equal($.trim($markup.text()), "Controller model");
});

QUnit.module("ui.collectionWidget", {
    beforeEach: function() {
        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach: function() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

var initMarkup = function($markup, controller) {
    var TestCollectionContainer = CollectionWidget.inherit({
        _itemClass: function() {
            return "dx-test-item";
        },

        _itemDataKey: function() {
            return "dxTestItemData";
        }
    });

    var TestWidget = Widget.inherit({
        _getDefaultOptions: function() {
            return $.extend(this.callBase(), {
                text: ""
            });
        },

        _render: function() {
            this.element().append($("<span />").text(this.option("text")));
        },

        _clean: function() {
            this.element().empty();
        }
    });

    registerComponent("dxTestCollectionContainer", TestCollectionContainer);
    registerComponent("dxTestWidget", TestWidget);

    var $container = $("<div/>").appendTo(FIXTURE_ELEMENT());

    $("<div/>")
        .attr("ng-controller", "my-controller")
        .appendTo($container)
        .append($markup);

    angular.module("testApp", ["dx"]).controller("my-controller", controller);

    angular.bootstrap($container, ["testApp"]);

    return $markup;
};

QUnit.test("collection container item value escalates to scope", function(assert) {
    var controller = function($scope) {
            $scope.collection = [
            { widgetText: "my text" }
            ];
        },
        $markup = initMarkup($(
            "<div dx-test-collection-container=\"{ bindingOptions: { items: 'collection' } }\" dx-item-alias=\"item\">" +
            "   <div data-options='dxTemplate: { name: \"item\" }' dx-test-widget='{ bindingOptions: { text: \"item.widgetText\" } }'>" +
            "   </div>" +
            "</div>"
        ), controller),
        scope = $markup.scope();

    var $item = $markup.children().children().eq(0);
    assert.equal($item.dxTestWidget("instance").option("text"), "my text");

    scope.$apply(function() {
        scope.collection[0].widgetText = "new text";
    });
    assert.equal($item.dxTestWidget("instance").option("text"), "new text");

    $item.dxTestWidget("instance").option("text", "own text");

    assert.equal(scope.collection[0].widgetText, "own text");
});

QUnit.test("collection container primitive item value escalates to scope", function(assert) {
    var controller = function($scope) {
            $scope.collection = ["my text"];
        },
        $markup = initMarkup($(
            "<div dx-test-collection-container=\"{ bindingOptions: { items: 'collection' } }\" dx-item-alias=\"item\">" +
            "   <div data-options='dxTemplate: { name: \"item\" }' dx-test-widget='{ bindingOptions: { text: \"item\" } }'>" +
            "   </div>" +
            "</div>"
        ), controller),
        scope = $markup.scope();

    var $item = $markup.children().children().eq(0);
    assert.equal($item.dxTestWidget("instance").option("text"), "my text");

    scope.$apply(function() {
        scope.collection[0] = "new text";
    });
    $item = $markup.children().children().eq(0);
    assert.equal($item.dxTestWidget("instance").option("text"), "new text");

    $item.dxTestWidget("instance").option("text", "own text");

    assert.equal(scope.collection[0], "own text");
});

QUnit.test("collection container item value escalates to scope: complex paths", function(assert) {
    var controller = function($scope) {
            $scope.vm = {
                collection: [
                { data: { widgetText: "my text" } }
                ]
            };
        },
        $markup = initMarkup($(
            "<div dx-test-collection-container=\"{ bindingOptions: { items: 'vm.collection' } }\" dx-item-alias=\"item\">" +
            "   <div data-options='dxTemplate: { name: \"item\" }' dx-test-widget='{ bindingOptions: { text: \"item.data.widgetText\" } }'>" +
            "   </div>" +
            "</div>"
        ), controller),
        scope = $markup.scope();

    var $item = $markup.children().children().eq(0);
    assert.equal($item.dxTestWidget("instance").option("text"), "my text");

    scope.$apply(function() {
        scope.vm.collection[0].data.widgetText = "new text";
    });
    assert.equal($item.dxTestWidget("instance").option("text"), "new text");

    $item.dxTestWidget("instance").option("text", "own text");

    assert.equal(scope.vm.collection[0].data.widgetText, "own text");
});

QUnit.test("Bootstrap should not fail if container component changes element markup on init (Problem after updating Angular to 1.2.16)", function(assert) {
    var controller = function($scope) {
        $scope.vm = {
            items: [
                { text: "0" },
                { text: "1" }
            ]
        };

        $scope.listOptions = {
            data: "vm",
            bindingOptions: {
                items: "items"
            }
        };
    };

    initMarkup($(
        "<div dx-list='listOptions'>" +
            "<div data-options=\"dxTemplate: { name: 'item' } \" dx-button=\"{ bindingOptions: { text: text } }\">" +
            "</div>" +
        "</div>"
    ), controller);

    assert.ok(true, "no fails on bootstrap");
});

QUnit.test("Global scope properties are accessible from item template", function(assert) {
    var controller = function($scope) {
            $scope.collection = [
            { itemText: "Item text" }
            ];

            $scope.globalText = "Global text";
        },
        $markup = initMarkup($(
            "<div dx-test-collection-container=\"{ bindingOptions: { items: 'collection' } }\" dx-item-alias=\"item\">" +
            "   <div data-options='dxTemplate: { name: \"item\" }'>" +
            "       <div ng-bind='item.itemText' class='item-text'>" +
            "       </div>" +
            "       <div ng-bind='globalText' class='global-text'>" +
            "       </div>" +
            "   </div>" +
            "</div>"
        ), controller);

    assert.equal($(".item-text", $markup).text(), "Item text");
    assert.equal($(".global-text", $markup).text(), "Global text");
});

QUnit.test("binding to circular data (T144697)", function(assert) {
    var controller = function($scope) {
            $scope.collection = [];
            $scope.collection.push({
                text: "Item text",
                parent: $scope.collection
            });
        },
        $markup = initMarkup($(
            "<div dx-test-collection-container=\"{ bindingOptions: { items: 'collection' } }\"></div>"
        ), controller),
        scope = $markup.scope();

    assert.equal($.trim($markup.text()), "Item text");

    scope.$apply(function() {
        scope.collection[0].text = "New text";
    });

    assert.equal($.trim($markup.text()), "New text");
});

QUnit.test("watcher type changed (T145604)", function(assert) {
    var data = [],
        controller = function($scope) {
            $scope.collection = undefined;//Important!!!
        },
        $markup = initMarkup($(
            "<div dx-test-collection-container=\"{ bindingOptions: { items: 'collection' } }\"></div>"
        ), controller),
        scope = $markup.scope();


    for(var i = 0; i < 100; i++) {
        data.push({
            text: "Item text " + i
        });
    }

    //render items can take some time
    scope.$apply(function() {
        scope.collection = data;
    });

    //change item's property shouldn't recompare the whole collection
    var $watchOld = scope["$watch"],
        watchLog = [];

    scope["$watch"] = function() {
        watchLog.push(arguments);
        return $watchOld.apply(arguments, this);
    };
    scope.$apply(function() {
        scope.collection[0].text = "New text";
    });
    assert.equal(watchLog.length, 0, "$watch shouldn't be used");

});

QUnit.test("Defining item data alias by 'itemAlias' with custom template for all items", function(assert) {
    var controller = function($scope) {
            $scope.collection = [1, 2, 3];
        },
        $markup = initMarkup($(
            "<div dx-test-collection-container=\"{ bindingOptions: { items: 'collection' } }\" dx-item-alias=\"item\">" +
            "   <div data-options='dxTemplate: { name: \"item\" }'>" +
            "       <div dx-test-widget=\"{ bindingOptions: { text: 'item' } }\" class=\"test-widget\"></div>" +
            "   </div>" +
            "</div>"
        ), controller),
        scope = $markup.scope();

    var $item = $markup.find(".test-widget").eq(0);
    assert.equal($item.dxTestWidget("option", "text"), "1");

    scope.$apply(function() {
        scope.collection[0] = "new text";
    });

    $item = $markup.find(".test-widget").eq(0);
    assert.equal($item.dxTestWidget("option", "text"), "new text");

    $item.dxTestWidget("option", "text", "widget text");
    assert.equal(scope.collection[0], "widget text");
});

QUnit.test("Defining item data alias by 'itemAlias' with custom template for some items", function(assert) {
    var controller = function($scope) {
            $scope.collection = [{ name: "0", template: "customWidget" }, { name: "1", template: "custom" }, { text: "2" }, "3"];
        },
        $markup = initMarkup($(
            "<div dx-test-collection-container=\"{ bindingOptions: { items: 'collection' } }\" dx-item-alias=\"user\">" +
            "   <div data-options='dxTemplate: { name: \"customWidget\" }'>" +
            "       <div dx-test-widget=\"{ bindingOptions: { text: 'user.name' } }\" class=\"test-widget\"></div>" +
            "   </div>" +
            "   <div data-options='dxTemplate: { name: \"custom\" }'>" +
            "       {{user.name}}" +
            "   </div>" +
            "</div>"
        ), controller),
        scope = $markup.scope();

    var $items = $markup.children();
    assert.equal($items.eq(0).find(".test-widget").dxTestWidget("option", "text"), "0");
    assert.equal($.trim($items.eq(1).text()), "1");
    assert.equal($.trim($items.eq(2).text()), "2");
    assert.equal($.trim($items.eq(3).text()), "3");

    scope.$apply(function() {
        scope.collection[0].name = "new text 0";
        scope.collection[1].name = "new text 1";
        scope.collection[2].text = "new text 2";
        scope.collection[3] = "new text 3";
    });

    $items = $markup.children();
    assert.equal($items.eq(0).find(".test-widget").dxTestWidget("option", "text"), "new text 0");
    assert.equal($.trim($items.eq(1).text()), "new text 1");
    assert.equal($.trim($items.eq(2).text()), "new text 2");
    assert.equal($.trim($items.eq(3).text()), "new text 3");

    $items.eq(0).find(".test-widget").dxTestWidget("option", "text", "widget text");
    assert.equal(scope.collection[0].name, "widget text");
});

QUnit.test("$id in item model not caused exception", function(assert) {
    var controller = function($scope) {
            $scope.collection = [
                { text: "my text", $id: 1 }
            ];
        },
        $markup = initMarkup($(
            "<div dx-test-collection-container=\"{ items: collection }\">" +
            "</div>"
        ), controller);

    assert.equal($markup.text(), "my text");
});

QUnit.module("misc and regressions", {
    beforeEach: function() {
        this.testApp = angular.module("testApp", ["dx"]);
        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach: function() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

QUnit.test("template.render() - data parameter is Scope", function(assert) {
    var TestContainer = Widget.inherit({

        _getDefaultOptions: function() {
            return $.extend(this.callBase(), {
                text: "default"
            });
        },

        _init: function() {
            this.callBase.apply(this, arguments);

            this.scope = this.element().scope().$new();
            this.scope.text = this.option("text");
        },

        _render: function() {
            var content = $("<div />")
                    .addClass("dx-content")
                    .appendTo(this.element());

            this.option("integrationOptions.templates")["template"].render({
                model: this.scope,
                container: content
            });
        },

        _renderContentImpl: noop,

        _optionChanged: function(args) {
            if(args.name === "text") {
                var that = this;

                that.scope.$apply(function() {
                    that.scope.text = args.value;
                });
            } else {
                this.callBase(args);
            }
        }

    });

    registerComponent("dxTestContainerScope", TestContainer);

    var $container = $("<div/>").appendTo(FIXTURE_ELEMENT()),
        $markup = $(
            "<div dx-test-container-scope='{ text: \"my text\" }'>" +
            "   <div class='text' ng-bind='text'></div>" +
            "</div>"
        ).appendTo($container);


    angular.bootstrap($container, ["testApp"]);

    assert.equal($markup.find(".text").text(), "my text");
    var instance = $markup.data("dxTestContainerScope");

    instance.option("text", "new text");
    assert.equal($markup.find(".text").text(), "new text");
});

QUnit.test("binding for item of array option", function(assert) {
    var TestCollectionContainer = CollectionWidget.inherit({
        _itemClass: function() {
            return "dx-test-item";
        },

        _itemDataKey: function() {
            return "dxTestItemData";
        }
    });

    registerComponent("dxTestCollectionContainer", TestCollectionContainer);

    var $container = $("<div/>").appendTo(FIXTURE_ELEMENT()),
        $controller = $("<div/>")
                    .attr("ng-controller", "my-controller")
                    .appendTo($container),
        $markup = $(
            "<div dx-test-collection-container=\"{ items: [ { text: 'value 1'}, { }, { } ], bindingOptions: { 'items[1].text': 'item2', 'items[2].text': 'vm.item3' } }\">" +
                    "</div>"
            ).appendTo($controller),
        scope;

    this.testApp.controller("my-controller", function($scope) {
        scope = $scope;

        $scope.item2 = "value 2";
        $scope.vm = {
            item3: "value 3"
        };
    });

    angular.bootstrap($container, ["testApp"]);

    assert.equal($markup.children().eq(1).text(), "value 2");

    scope.$apply(function() {
        scope.item2 = "new value 2";
        scope.vm.item3 = "new value 3";
    });
    assert.equal($markup.children().eq(1).text(), "new value 2");
    assert.equal($markup.children().eq(2).text(), "new value 3");

    var instance = $markup.dxTestCollectionContainer("instance");
    instance.option("items", [{ text: 'value 4' }, { text: 'value 5' }, { text: 'value 6' }]);

    assert.equal(scope.item2, "value 5");
    assert.equal(scope.vm.item3, "value 6");
});

QUnit.test("all values should be correct displayed in collection widget (T425426)", function(assert) {
    registerComponent("dxTestCollection", CollectionWidget);

    var $container = $("<div/>").appendTo(FIXTURE_ELEMENT()),
        $controller = $("<div/>")
                .attr("ng-controller", "my-controller")
                .appendTo($container),
        $markup = $("<div dx-test-collection=\"{ items: [ 0, 1, null, '', undefined, {} ] }\"></div>").appendTo($controller);

    this.testApp.controller("my-controller", function() { });

    angular.bootstrap($container, ["testApp"]);

    assert.equal($markup.children().eq(0).text(), "0");
    assert.equal($markup.children().eq(1).text(), "1");
    assert.equal($markup.children().eq(2).text(), "null");
    assert.equal($markup.children().eq(3).text(), "");
    assert.equal($markup.children().eq(4).text(), "undefined");
    assert.equal($markup.children().eq(5).text(), "");
});

QUnit.test("child collection widget should be rendered correctly when template provider is specified", function(assert) {
    var ChildWidget = Widget.inherit({
        _render: function() {
            this.callBase();
            this.element().addClass("child-widget");
        }
    });

    registerComponent("dxChildWidget", ChildWidget);

    var ParentWidget = Widget.inherit({
        _render: function() {
            this.callBase();
            var $childWidget = $("<div>").appendTo(this.element());
            this._createComponent($childWidget, "dxChildWidget");
        }
    });

    registerComponent("dxParentWidget", ParentWidget);

    var $container = $("<div>").appendTo(FIXTURE_ELEMENT());
    var $markup = $("<div dx-parent-widget='{}'></div>")
        .appendTo($container);

    angular.bootstrap($container, ["testApp"]);

    assert.equal($markup.dxParentWidget("option", "templatesRenderAsynchronously"), FIXTURE_ELEMENT().find(".child-widget").dxChildWidget("option", "templatesRenderAsynchronously"), "templatesRenderAsynchronously provided");
});


QUnit.test("memory leaks in CollectionWidget", function(assert) {
    var TestCollectionContainer = CollectionWidget.inherit({
        _itemClass: function() {
            return "dx-test-item";
        },

        _itemDataKey: function() {
            return "dxTestItemData";
        }
    });

    registerComponent("dxLeakTestCollectionContainer", TestCollectionContainer);

    var $container = $("<div/>").appendTo(FIXTURE_ELEMENT()),
        $controller = $("<div/>")
            .attr("ng-controller", "my-controller")
            .appendTo($container),
        scope;

    $("<div dx-leak-test-collection-container=\"{ bindingOptions: { items: 'items' } }\" dx-item-alias=\"item\"><span></span></div>")
        .appendTo($controller);

    this.testApp.controller("my-controller", function($scope) {
        scope = $scope;

        $scope.items = [
            { text: "my text 1" },
            { text: "my text 2" }
        ];
    });

    angular.bootstrap($container, ["testApp"]);

    var calcSiblings = function(sibling) {
        var result = 0;

        while(sibling) {
            result++;
            sibling = sibling.$$nextSibling;
        }

        return result;
    };

    assert.equal(calcSiblings(scope.$$childHead), 2);

    scope.$apply(function() {
        scope.items.pop();
    });

    assert.equal(calcSiblings(scope.$$childHead), 1);
});

QUnit.test("binding inside ng-repeat (T137200)", function(assert) {
    var TestComponent = DOMComponent.inherit({
        _getDefaultOptions: function() {
            return { text: "", array: [], obj: null };
        }
    });

    registerComponent("dxRepeatTest", TestComponent);

    var $container = $("<div/>").appendTo(FIXTURE_ELEMENT()),
        $controller = $("<div></div>")
            .attr("ng-controller", "my-controller")
            .appendTo($container),
        scope;

    $("<div ng-repeat=\"vm in items\">"
        + "    <div dx-repeat-test=\"{ bindingOptions: { text: 'vm.text' } }\"></div>"
        + "</div>")
        .appendTo($controller);

    this.testApp.controller("my-controller", function($scope) {
        scope = $scope;

        $scope.items = [
            { text: "my text 1" },
            { text: "my text 2" },
            { text: "my text 3" }
        ];
    });

    angular.bootstrap($container, ["testApp"]);

    scope.$apply(function() {
        scope.items[0].text = "new text";
    });

    var $elements = $("[dx-repeat-test]", $container);

    assert.equal($elements.first().dxRepeatTest("option", "text"), "new text");
    assert.equal($elements.last().dxRepeatTest("option", "text"), "my text 3");
});


QUnit.test("T183342 dxValidator should be created after any editors", function(assert) {
    var dxApp = angular.module('dx'),
        validatorDirective = $.grep(dxApp._invokeQueue, function(configObj) {
            return (configObj[1] === "directive") && (configObj[2][0] === "dxValidator");
        })[0],
        editorDirective = $.grep(dxApp._invokeQueue, function(configObj) {
            return (configObj[1] === "directive") && (configObj[2][0] === "dxTextBox");
        })[0],
        getPriority = function(configObj) {
            return configObj[2][1][3]().priority;
        };

    assert.ok(validatorDirective, "Validator directive should be registered");
    assert.ok(editorDirective, "Editor directive should be registered");
    assert.ok(getPriority(validatorDirective) > getPriority(editorDirective), "Validator's priority should be greater than Editor's priority (as they are executed in a reversed order");
});

QUnit.test("T228219 dxValidationSummary should be disposed properly", function(assert) {
    var $container = $("<div/>").appendTo(FIXTURE_ELEMENT()),
        $controller = $("<div></div>")
            .attr("ng-controller", "my-controller")
            .appendTo($container),
        $markup = $(
            "<div id='testGroup' dx-validation-group='{}'>" +
            "<div class='dx-field'>" +
            "<div class='dx-field-value'>" +
            "<div dx-text-box='{ bindingOptions: { value: \"name\" } }'" +
            "dx-validator='{ validationRules: [{ type: \"required\" }] }'>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<div id='valSumm' dx-validation-summary='{ }'></div>" +
            "</div>")
            .appendTo($controller);

    this.testApp.controller("my-controller", function() {
    });

    angular.bootstrap($container, ["testApp"]);

    assert.ok(new ValidationGroup($markup));

    $markup.remove();

    assert.ok(true, "We should not fall on previous statement");
});

QUnit.test("component should notify view model if option changed on ctor after initialization (T219862)", function(assert) {
    var ComponentClass = DOMComponent.inherit({
        _render: function() {
            this.callBase();
            this.option("a", 2);
        }
    });

    registerComponent("test", ComponentClass);

    var $container = $("<div/>").appendTo(FIXTURE_ELEMENT()),
        $controller = $("<div></div>")
            .attr("ng-controller", "my-controller")
            .appendTo($container),
        scope;

    $("<div test=\"{ bindingOptions: { a: 'a'} }\"></div>").appendTo($controller);

    this.testApp.controller("my-controller", function($scope) {
        scope = $scope;
        $scope.a = 1;
    });

    angular.bootstrap($container, ["testApp"]);

    assert.equal(scope.a, 2);
});

QUnit.test("Watchers executed after component initialization (T334273)", function(assert) {
    var exceptionFired = false,
        app = angular.module('app', ["ng", 'dx']).factory('$exceptionHandler', function() {
            return function(exception, cause) {
                exceptionFired = true;
            };
        });

    var TestComponent = DOMComponent.inherit({});

    registerComponent("dxTest", TestComponent);

    app.directive('customDirective', [
        function() {
            return {
                restrict: 'A',
                template: '<div>' +
                                '<div dx-test="{ bindingOptions: { width: \'w\' }, height: \'0\' }"></div>' +
                            '</div>',
                replace: true,
                compile: function(tElem, tAttrs) {
                    return {
                        "pre": function(scope, iElem, iAttrs, controller) {
                            scope.w = 0;
                        }
                    };
                }
            };
        }]);

    var element = $('<div custom-directive></div>').appendTo(FIXTURE_ELEMENT());


    angular.injector(['app']).invoke(function($rootScope, $compile) {
        $compile(element)($rootScope);
    });

    assert.ok(!exceptionFired, "There is no any exceptions");
});

QUnit.module("component action context", {
    beforeEach: function() {
        var TestComponent = DOMComponent.inherit({
            _getDefaultOptions: function() {
                return $.extend(this.callBase(), {
                    onHandler: noop,
                    value: null
                });
            },

            trigger: function(e) {
                this._createAction(this.option("onHandler"))(e);
            },
            triggerByOption: function(e) {
                this._createActionByOption("onHandler")(e);
            },
            triggerByOptionCategoryRendering: function(e) {
                this._createActionByOption("onHandler", { category: "rendering" })(e);
            }
        });

        this.testApp = angular.module("testApp", ["dx"]);
        this.$container = $("<div/>").appendTo(FIXTURE_ELEMENT());
        this.$controller = $("<div></div>")
            .attr("ng-controller", "my-controller")
            .appendTo(this.$container);

        registerComponent("dxActionTest", TestComponent);

        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach: function() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

QUnit.test("component action created by option calls scope.$apply", function(assert) {
    var $markup = $("<div dx-action-test='{ onHandler: vm.handler }'></div>")
            .appendTo(this.$controller),
        valueChanged = false;

    this.testApp.controller("my-controller", function($scope) {
        $scope.vm = {
            handler: function(e) {
                $scope.vm.value = "new value";
            },
            value: "old value"
        };

        $scope.$watch("vm.value", function(newValue, oldValue) {
            if(newValue !== oldValue) {
                valueChanged = true;
            }
        });
    });

    angular.bootstrap(this.$container, ["testApp"]);

    $markup.data("dxActionTest").triggerByOption();

    assert.ok(valueChanged);
});

QUnit.test("component internal action does not calls scope.$apply", function(assert) {
    var $markup = $("<div dx-action-test='{ onHandler: vm.handler }'></div>")
            .appendTo(this.$controller),
        valueChanged = false;

    this.testApp.controller("my-controller", function($scope) {
        $scope.vm = {
            handler: function(e) {
                $scope.vm.value = "new value";
            },
            value: "old value"
        };

        $scope.$watch("vm.value", function(newValue, oldValue) {
            if(newValue !== oldValue) {
                valueChanged = true;
            }
        });
    });

    angular.bootstrap(this.$container, ["testApp"]);

    $markup.data("dxActionTest").trigger();

    assert.ok(!valueChanged);
});

QUnit.test("component created by option with category 'rendering' does not calls scope.$apply", function(assert) {
    var $markup = $("<div dx-action-test='{ onHandler: vm.handler }'></div>")
            .appendTo(this.$controller),
        valueChanged = false;

    this.testApp.controller("my-controller", function($scope) {
        $scope.vm = {
            handler: function(e) {
                $scope.vm.value = "new value";
            },
            value: "old value"
        };

        $scope.$watch("vm.value", function(newValue, oldValue) {
            if(newValue !== oldValue) {
                valueChanged = true;
            }
        });
    });

    angular.bootstrap(this.$container, ["testApp"]);

    $markup.data("dxActionTest").triggerByOptionCategoryRendering();

    assert.ok(!valueChanged);
});

//related with Q566857
QUnit.test("change option in component action handler (phase $apply) ", function(assert) {
    var $markup = $("<div dx-action-test=\"{ onHandler: vm.handler,  bindingOptions: { value: 'vm.value' }}\"></div>")
            .appendTo(this.$controller),
        scope;


    this.testApp.controller("my-controller", function($scope) {
        scope = $scope;
        $scope.vm = {
            handler: function(e) {
                $markup.dxActionTest("option", "value", "new value");
            },
            value: "old value"
        };
    });

    angular.bootstrap(this.$container, ["testApp"]);

    $markup.data("dxActionTest").triggerByOption();

    assert.equal(scope.vm.value, "new value");
});

QUnit.test("component action context is component", function(assert) {
    var context;
    var handler = function(e) {
        context = this;
    };

    var $markup = $("<div></div>").appendTo(this.$container);
    $markup.dxActionTest({ onHandler: handler });

    var component = $markup.data("dxActionTest");
    component.triggerByOption();

    assert.equal(context, component);
});

QUnit.test("Using ng-expressions in dx syntax", function(assert) {
    var $markup = $("<div/>")
            .attr("dx-action-test", "{ onHandler: 'vm.value = \"new value\"' }")
            .appendTo(this.$controller),
        scope;

    this.testApp.controller("my-controller", function($scope) {
        scope = $scope;
        $scope.vm = {
            value: "old value"
        };
    });

    angular.bootstrap(this.$container, ["testApp"]);

    $markup.data("dxActionTest").triggerByOption();

    assert.equal(scope.vm.value, "new value");
});

QUnit.module("dxComponent as a template", {
    beforeEach: function() {
        var TemplateComponent = Widget.inherit({});

        this.testApp = angular.module("testApp", ["dx"]);
        this.$container = $("<div/>").appendTo(FIXTURE_ELEMENT());

        registerComponent("dxTemplateComponent", TemplateComponent);

        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach: function() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

QUnit.test("Parent directive scope value goes to template component option object", function(assert) {
    var initialWatchersCount;

    $("<custom-directive/>").appendTo(this.$container);

    this.testApp.directive('customDirective', function() {
        return {
            restrict: 'E',
            replace: true,
            template: '<div dx-template-component="config"></div>',
            link: function(scope) {
                // NOTE: One uncleared watcher created for dxDigestCallbacks service
                initialWatchersCount = scope.$$watchers.length;

                scope.boundOption = 'default value';
                scope.config = {
                    text: "my text",
                    bindingOptions: {
                        boundOption: 'boundOption'
                    }
                };
            }
        };
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var $markup = this.$container.children(),
        instance = $markup.data("dxTemplateComponent"),
        scope = $markup.scope();

    assert.equal(instance.option("text"), "my text");

    scope.$apply(function() {
        scope.boundOption = "new value";
    });

    assert.equal(instance.option("boundOption"), "new value");
    assert.equal(scope.$$watchers.length, initialWatchersCount);
});

QUnit.test("No watchers on disposing", function(assert) {
    $("<custom-directive/>").appendTo(this.$container);

    this.testApp.directive('customDirective', function() {

        return {
            restrict: 'E',
            replace: true,
            template: '<div dx-template-component="config"></div>',
            link: function(scope) { }
        };
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var $markup = this.$container.children(),
        instance = $markup.data("dxTemplateComponent"),
        scope = $markup.scope();

    $markup.remove();

    assert.equal(scope.$$watchers.length, 1);// NOTE: One uncleared watcher created for dxDigestCallbacks service
    assert.ok(!!instance);
});

QUnit.module("dxDataGrid", {
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
    var root = angular.element(element || document.getElementsByTagName('body'));

    var watchers = [];

    var f = function(element) {
        angular.forEach(['$scope', '$isolateScope'], function(scopeProperty) {
            if(element.data() && element.data().hasOwnProperty(scopeProperty)) {
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

QUnit.test("Two-way binding", function(assert) {
    var initialWatchersCount = 1, // NOTE: One uncleared watcher created for dxDigestCallbacks service
        controller = function($scope) {
            $scope.gridOptions = {
                dataSource: [
                    { field1: 1, field2: 2 },
                    { field1: 3, field2: 4 }
                ]
            };
        },
        $markup = initMarkup($(
            "<div dx-data-grid=\"gridOptions\"></div>"
        ), controller),
        scope = $markup.scope();

    this.clock.tick(30);

    var $rows = $markup.find(".dx-data-row");
    assert.equal($rows.length, 2, "row count");
    assert.equal($rows.eq(0).children().eq(0).text(), "1");
    assert.equal($rows.eq(1).children().eq(0).text(), "3");

    //act
    scope.$apply(function() {
        scope.gridOptions.dataSource[0].field1 = 666;
    });

    //assert
    $rows = $markup.find(".dx-data-row");
    assert.equal($rows.length, 2, "row count");
    assert.equal($rows.eq(0).children().eq(0).text(), "666");
    assert.equal($rows.eq(1).children().eq(0).text(), "3");
    assert.equal(calcWatchersCount(), initialWatchersCount + 2, "watchers count");
});

//T285727
QUnit.test("Two-way binding when columnFixing", function(assert) {
    var initialWatchersCount = 1, // NOTE: One uncleared watcher created for dxDigestCallbacks service
        controller = function($scope) {
            $scope.gridOptions = {
                columns: [{ dataField: "field1", fixed: true }, "field2"],
                dataSource: [
                    { field1: 1, field2: 2 },
                    { field1: 3, field2: 4 }
                ]
            };
        },
        $markup = initMarkup($(
            "<div dx-data-grid=\"gridOptions\"></div>"
        ), controller),
        scope = $markup.scope();

    this.clock.tick(30);

    var $rows = $markup.find(".dx-datagrid-content-fixed .dx-data-row");
    assert.equal($rows.length, 2, "row count");
    assert.equal($rows.eq(0).children().eq(0).text(), "1");
    assert.equal($rows.eq(1).children().eq(0).text(), "3");

    //act
    scope.$apply(function() {
        scope.gridOptions.dataSource[0].field1 = 666;
    });

    //assert
    $rows = $markup.find(".dx-datagrid-content-fixed .dx-data-row");
    assert.equal($rows.length, 2, "row count");
    assert.equal($rows.eq(0).children().eq(0).text(), "666");
    assert.equal($rows.eq(1).children().eq(0).text(), "3");
    assert.equal(calcWatchersCount(), initialWatchersCount + 2, "watchers count");
});

//T352960
QUnit.test("Two-way binding does not work for inserted rows", function(assert) {
    var initialWatchersCount = 1, // NOTE: One uncleared watcher created for dxDigestCallbacks service
        controller = function($scope) {
            $scope.gridOptions = {
                onInitialized: function(e) {
                    $scope.grid = e.component;
                },
                columns: ["field1", "field2"],
                dataSource: [
                    { field1: 1, field2: 2 },
                    { field1: 3, field2: 4 }
                ]
            };
        },
        $markup = initMarkup($(
            "<div dx-data-grid=\"gridOptions\"></div>"
        ), controller),
        scope = $markup.scope();

    this.clock.tick(30);

    //act
    scope.$apply(function() {
        scope.grid.addRow();
    });

    //assert
    var $rows = $markup.find(".dx-data-row");
    assert.equal($rows.length, 3, "row count");
    assert.equal(calcWatchersCount(), initialWatchersCount + 2, "watchers count. Inserted row is ignored");
});

    //T429370
QUnit.test("Assign selectedRowKeys option via binding", function(assert) {
    var controller = function($scope) {
            $scope.gridOptions = {
                bindingOptions: {
                    "selectedRowKeys": "selectedRowKeys"
                },
                columns: ["field1", "field2"],
                dataSource: {
                    store: {
                        type: "array",
                        data: [
                        { field1: 1, field2: 2 },
                        { field1: 3, field2: 4 }
                        ],
                        key: ["field1", "field2"]
                    }
                }
            };
        },
        $markup = initMarkup($(
            "<div dx-data-grid=\"gridOptions\"></div>"
        ), controller),
        scope = $markup.scope();

    this.clock.tick(30);
    //act
    scope.$apply(function() {
        scope.selectedRowKeys = [{ field1: 1, field2: 2 }];
        scope.selectedRowKeysInstance = scope.selectedRowKeys;
    });

    //assert
    var $selectedRows = $markup.find(".dx-data-row.dx-selection");
    assert.equal($selectedRows.length, 1, "one row is selected");
    assert.notEqual(scope.selectedRowKeysInstance, scope.selectedRowKeys, "selectedRowKeys instance is not changed");
});

//T427432
QUnit.test("Change selection.mode option via binding and refresh", function(assert) {
    var controller = function($scope) {
            $scope.gridOptions = {
                onInitialized: function(e) {
                    $scope.grid = e.component;
                },
                dataSource: [
                       { value: 1, text: "A" },
                       { value: 2, text: "B" },
                       { value: 3, text: "C" }
                ],
                loadingTimeout: undefined,
                bindingOptions: {
                    'selection.mode': 'mode'
                },
                loadPanel: { showPane: false, enabled: false },
            };

            $scope.mode = 'multiple';
        },
        $markup = initMarkup($(
            "<div id=\"grid\" dx-data-grid=\"gridOptions\"></div>"
        ), controller),
        scope = $markup.scope();

    this.clock.tick(30);


    //act
    $markup.find(".dx-data-row").eq(0).children().first().trigger("dxclick");

    this.clock.tick(30);


    scope.$apply(function() {
        scope.mode = "single";
        scope.grid.option("selection.mode", "single");
        scope.grid.refresh();
    });

    this.clock.tick(30);


    //assert
    assert.equal($markup.find(".dx-header-row").eq(0).children().length, 2, "two cells in header row");
    assert.equal($markup.find(".dx-data-row").eq(0).children().length, 2, "two cells in data row");
});



QUnit.module("Adaptive menu", {
    beforeEach: function() {
        this.testApp = angular.module("testApp", ["dx"]);
        this.$container = $("<div/>").appendTo(FIXTURE_ELEMENT());
        this.$controller = $("<div></div>")
            .attr("ng-controller", "my-controller")
            .appendTo(this.$container);

        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach: function() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

QUnit.test("Adaptive menu should support angular integration", function(assert) {
    var $markup = $("<div/>")
            .attr("dx-menu", "menuOptions")
            .appendTo(this.$controller),
        $testDiv = $("<div>").attr("ng-bind", "test")
            .appendTo(this.$controller),
        scope;

    this.testApp.controller("my-controller", function($scope) {
        scope = $scope;

        $scope.test = "Test text 1";

        $scope.menuOptions = {
            adaptivityEnabled: true,
            items: [{ text: "item 1" }],
            onItemClick: function() {
                $scope.test = "Test text 2";
            }
        };
        assert.strictEqual(scope.selectedRowKeysInstance, scope.selectedRowKeys, "selectedRowKeys instance is not changed");
    });

    angular.bootstrap(this.$container, ["testApp"]);

    var $treeViewItem = $markup.find(".dx-treeview-item").eq(0);

    $treeViewItem.trigger("dxclick");

    assert.equal(scope.test, "Test text 2", "scope value is updated");
    assert.equal($testDiv.text(), "Test text 2", "test div is updated");
});

QUnit.test("Component can change itself options on init (T446364)", function(assert) {
    var $markup = $("<div/>")
            .attr("dx-list", "listOptions")
            .appendTo(this.$controller),
        data = ["Peter", "Mary", "John", "Sam", "Betty", "Joyce"],
        scope;

    this.testApp.controller("my-controller", function($scope) {
        scope = $scope;

        $scope.listOptions = {
            bindingOptions: {
                dataSource: 'vm.myData',
                selectedItems: 'vm.MyRows'
            },
            selectionMode: 'single'
        };

        var Test = (function() {
            function Test() {
                this.myRows = [];
                this.myData = [];
            }
            Object.defineProperty(Test.prototype, "MyRows", {
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
    });

    angular.bootstrap(this.$container, ["testApp"]);

    $markup.dxList("option", "selectedItems", [ "Betty" ]);

    assert.equal(scope.vm.MyRows[0], "Betty");
});

QUnit.module("Widgets without model for template", {
    beforeEach: function() {
        var TestComponent = DOMComponent.inherit({
            _render: function() {
                return this.callBase.apply(this, arguments);
            },
            _optionChanged: function() {
                this._invalidate();
            },
            _getDefaultOptions: function() {
                return { text: "", array: [], obj: null };
            }
        });

        this.testApp = angular.module("testApp", ["dx"]);
        this.$container = $("<div/>").appendTo(FIXTURE_ELEMENT());
        this.$controller = $("<div></div>")
            .attr("ng-controller", "my-controller")
            .appendTo(this.$container);

        registerComponent("dxTest", TestComponent);

        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach: function() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

var noModelWidgets = [
    {
        name: "dxDeferRendering",
        options: { renderWhen: $.Deferred().resolve().promise() }
    },
    {
        name: "dxPopup",
        options: { visible: true }
    },
    {
        name: "dxSlideOutView",
        options: {}
    }
];

noModelWidgets.forEach(function(widget) {
    QUnit.test(widget.name, function(assert) {
        var $markup = $("<div/>")
                .attr(inflector.dasherize(widget.name), "widgetOptions")
                .appendTo(this.$controller),
            clock = sinon.useFakeTimers(),
            scope;

        // TODO: ng-bind?
        $("<div>")
            .attr("dx-test", "innerOptions")
            .addClass("inner-widget")
            .appendTo($markup);

        this.testApp.controller("my-controller", function($scope) {
            scope = $scope;

            $scope.modelIsReady = $.Deferred().resolve().promise();

            $scope.test = "Test text 1";

            $scope.widgetOptions = widget.options;
            $scope.innerOptions = {
                bindingOptions: {
                    text: "test"
                }
            };
        });

        angular.bootstrap(this.$container, ["testApp"]);

        clock.tick(300);

        var instance = $(".inner-widget").dxTest("instance");

        instance.option("text", "Test text 2");

        assert.equal(scope.test, "Test text 2", "scope value is updated");

        clock.restore();
    });
});

QUnit.test("Scope for template with 'noModel' option is not destroyed after clean (T427115)", function(assert) {
    var TestContainer = Widget.inherit({
        _render: function() {
            var content = $("<div />")
                    .addClass("dx-content")
                    .appendTo(this.element());

            this.option("integrationOptions.templates")["template"].render({
                container: content,
                noModel: true
            });
        }
    });

    registerComponent("dxTestContainerNoModel", TestContainer);

    var $markup = $(
        "<div dx-test-container-no-model>"
            + "    <div data-options='dxTemplate: { name: \"template\" }' class='outer-template'>"
            + "    </div>"
            + "</div>"
        ).appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) { });

    angular.bootstrap(this.$container, ["testApp"]);

    var instance = $markup.data("dxTestContainerNoModel"),
        scope = $markup.scope();

    assert.ok(scope.$root);

    instance.repaint();

    assert.ok(scope.$root);
});


QUnit.module("toolbar", {
    beforeEach: function() {
        this.testApp = angular.module("testApp", ["dx"]);
        this.$container = $("<div/>").appendTo(FIXTURE_ELEMENT());
        this.$controller = $("<div></div>")
            .attr("ng-controller", "my-controller")
            .appendTo(this.$container);

        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach: function() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

QUnit.test("polymorph widget correctly renders nested widgets", function(assert) {
    var $markup = $("<div/>")
            .attr("dx-toolbar", "{ items: items }")
            .appendTo(this.$controller),
        scope;

    $("<div>").attr("ng-bind", "test")
        .appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        scope = $scope;

        $scope.disabled = false;

        $scope.items = [{
            widget: "dxButton",
            options: {
                bindingOptions: {
                    disabled: '$parent.disabled'
                }
            }
        }];
    });

    angular.bootstrap(this.$container, ["testApp"]);

    scope.$apply(function() {
        scope.disabled = true;
    });
    assert.equal($markup.find(".dx-state-disabled").length, 1);
});

QUnit.test("dxPopup - bindingOptions for a title property should be worked", function(assert) {
    $("<div/>")
        .attr("dx-popup", "popupOptions")
        .appendTo(this.$controller);

    var scope;

    $("<div>").attr("ng-bind", "test")
        .appendTo(this.$controller);

    this.testApp.controller("my-controller", function($scope) {
        scope = $scope;
        $scope.titlePopup = "title";

        $scope.popupOptions = {
            visible: true,
            showTitle: true,
            bindingOptions: {
                title: "titlePopup"
            }
        };
    });

    angular.bootstrap(this.$container, ["testApp"]);
    var done = assert.async();
    setTimeout(function() {
        scope.$apply(function() {
            scope.titlePopup = "new title";
        });

        assert.equal($.trim($(".dx-popup-title").text()), "new title");
        done();
    }, 0);
});


QUnit.module("box", {
    beforeEach: function() {
        this.testApp = angular.module("testApp", ["dx"]);
        this.$container = $("<div/>").appendTo(FIXTURE_ELEMENT());
        this.$controller = $("<div></div>")
            .attr("ng-controller", "my-controller")
            .appendTo(this.$container);

        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach: function() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

QUnit.test("innerBox with nested box item", function(assert) {
    var $markup = $("<div/>")
            .attr("dx-box", "{}")
            .append(
        '<div data-options="dxItem: {baseSize: 272, ratio: 0, box: {direction: \'col\'}}">\
                    <div data-options="dxItem: {baseSize: \'auto\', ratio: 0}"><h2>Box1</h2></div>\
                </div>'
            )
            .appendTo(this.$controller),
        scope;

    this.testApp.controller("my-controller", function($scope) {
        scope = $scope;
    });

    angular.bootstrap(this.$container, ["testApp"]);

    assert.equal($.trim($markup.text()), "Box1", "inner box rendered");
});


QUnit.module("tree view", {
    beforeEach: function() {
        this.testApp = angular.module("testApp", ["dx"]);
        this.$container = $("<div/>").appendTo(FIXTURE_ELEMENT());
        this.$controller = $("<div></div>")
            .attr("ng-controller", "my-controller")
            .appendTo(this.$container);

        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach: function() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

QUnit.test("tree view should not crash with complex ids", function(assert) {
    assert.expect(0);

    $("<div dx-tree-view='options' dx-item-alias='item'>" +
      "  <div data-options='dxTemplate: { name: \"item\" }'>{{item.title}}</div>" +
      "</div>")
        .appendTo(this.$controller);

    var scope;
    this.testApp
        .factory('$exceptionHandler', function() {
            return function myExceptionHandler(exception, cause) {
                throw exception;
            };
        })
        .controller("my-controller", function($scope) {
            scope = $scope;

            $scope.data = [{
                uid: "33ad",
                title: "title",
                uidParent: null
            }];

            $scope.options = {
                keyExpr: "uid",
                parentIdExpr: "uidParent",
                dataStructure: "plain",
                bindingOptions: {
                    items: "data"
                }
            };
        });

    angular.bootstrap(this.$container, ["testApp"]);
});

QUnit.module("dxScheduler", {
    beforeEach: function() {
        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
        this.clock.restore();
    }
});

QUnit.test("Custom store with ISO8601 dates", function(assert) {
    var controller = function($scope) {
            $scope.schedulerOptions = {
                dataSource: {
                    load: function() {
                        var d = $.Deferred();

                        setTimeout(function() {
                            d.resolve([{
                                "text": "Approve Personal Computer Upgrade Plan",
                                "startDate": "2015-05-26T18:30:00+01:00",
                                "endDate": "2015-05-26T18:30:00+01:00"
                            }]);
                        });
                        return d.promise();
                    }
                },
                timeZone: "America/Los_Angeles",
                views: ['workWeek'],
                currentView: 'workWeek',
                currentDate: new Date(2015, 4, 25)
            };
        },
        $markup = initMarkup($(
            "<div dx-scheduler=\"schedulerOptions\"></div>"
        ), controller);

    //act
    this.clock.tick(0);

    assert.equal($markup.find(".dx-scheduler-appointment").length, 1, "appointment count");
});
