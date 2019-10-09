var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    registerComponent = require("core/component_registrator"),
    config = require("core/config"),
    resizeCallbacks = require("core/utils/resize_callbacks"),
    devices = require("core/devices"),
    DOMComponent = require("core/dom_component"),
    domUtils = require("core/utils/dom"),
    publicComponentUtils = require("core/utils/public_component"),
    nameSpace = {},
    coreConfig = require("core/config"),
    eventsEngine = require("events/core/events_engine"),
    dataUtils = require("core/element_data");

QUnit.testStart(function() {
    var markup = '<div id="component"></div>' + '<div id="anotherComponent"></div>';

    $("#qunit-fixture").html(markup);
});

var RTL_CLASS = "dx-rtl";

QUnit.module("default", {
    beforeEach: function(module) {
        this.TestComponent = DOMComponent.inherit({

            ctor: function(element, options) {
                this._traceLog = [];
                this.callBase(element, options);
            },

            _optionsByReference: function() {
                return {
                    byReference: true
                };
            },

            _getDefaultOptions: function() {
                return $.extend(
                    this.callBase(),
                    {
                        opt1: "default",
                        opt2: "default"
                    }
                );
            },

            _optionChanged: function(name, value, prevValue) {
                this._traceLog.push({
                    method: "_optionChanged",
                    arguments: $.makeArray(arguments)
                });

                this.callBase.apply(this, arguments);
            },

            _refresh: function() {
                this._traceLog.push({
                    method: "_refresh",
                    arguments: $.makeArray(arguments)
                });
                this.callBase.apply(this, arguments);
            },

            _init: function() {
                this._traceLog.push({
                    method: "_init",
                    arguments: $.makeArray(arguments)
                });

                this.callBase();
            },

            _render: function() {
                this._traceLog.push({
                    method: "_render",
                    arguments: $.makeArray(arguments)
                });

                this.callBase();
            },

            _clean: function() {
                this._traceLog.push({
                    method: "_clean",
                    arguments: $.makeArray(arguments)
                });

                this.callBase();
            },

            _invalidate: function() {
                this._traceLog.push({
                    method: "_invalidate",
                    arguments: $.makeArray(arguments)
                });
                this.callBase();
            },

            _dispose: function() {
                this._traceLog.push({
                    method: "_dispose",
                    arguments: $.makeArray(arguments)
                });
                this.callBase();
            },

            beginUpdate: function() {
                this._traceLog.push({
                    method: "beginUpdate",
                    arguments: $.makeArray(arguments)
                });
                this.callBase();
            },

            endUpdate: function() {
                this._traceLog.push({
                    method: "endUpdate",
                    arguments: $.makeArray(arguments)
                });
                this.callBase();
            },

            func: function(arg) {
                return arg;
            },

            action: function() {

            },

            instanceChain: function() {
                return this;
            },

            _getTraceLogByMethod: function(methodName) {
                return $.grep(this._traceLog, function(i) { return i.method === methodName; });
            }
        });

        registerComponent("TestComponent", nameSpace, this.TestComponent);
    },

    afterEach: function() {
        delete $.fn.TestComponent;
    }
});

QUnit.test("component has registered", function(assert) {
    assert.strictEqual(nameSpace.TestComponent, this.TestComponent);
    assert.ok("TestComponent" in $());
    assert.equal(publicComponentUtils.name(this.TestComponent), "TestComponent");
});

QUnit.test("obtaining instance from element", function(assert) {
    var element = $("#component").TestComponent();
    if(!QUnit.urlParams["nojquery"]) {
        assert.ok(element.TestComponent("instance") instanceof this.TestComponent);
    }
    assert.ok(element.TestComponent("instance") instanceof this.TestComponent);
});

QUnit.test("method call api", function(assert) {
    var element = $("#component").TestComponent();
    assert.equal(element.TestComponent("func", "abc"), "abc");
    assert.strictEqual(element.TestComponent("action"), undefined);
    assert.ok(element.TestComponent("instance").instanceChain() instanceof this.TestComponent);
});

QUnit.test("method call made on not initialized widget throws informative exception", function(assert) {
    var message;
    try {
        $("<div></div>").TestComponent("func");
    } catch(x) {
        message = x.message;
    }
    assert.ok(message.indexOf("TestComponent") > -1);
});

QUnit.test("options api", function(assert) {
    var element = $("#component").TestComponent({ opt2: "custom" }),
        instance = element.TestComponent("instance");

    assert.equal(element.TestComponent("option", "opt1"), "default");
    assert.equal(element.TestComponent("option", "opt2"), "custom");

    assert.strictEqual(element.TestComponent("option", "opt1", "z"), undefined);
    element.TestComponent("option", "opt1", "z");

    element.TestComponent("option", "opt3", "new");
    assert.equal(instance._getTraceLogByMethod("_optionChanged").length, 2);

    instance.option({
        opt1: "mass1",
        opt2: "mass2"
    });

    assert.equal(instance.option("opt1"), "mass1");
    assert.equal(instance.option("opt2"), "mass2");
});

QUnit.test("component lifecycle, changing a couple of options", function(assert) {
    var TestComponent = this.TestComponent.inherit({
        _optionChanged: function(args) {
            this.callBase(args);

            if($.inArray(args.name, ["a", "b", "c"]) > -1) {
                this._invalidate();
            }
        }
    });

    var instance = new TestComponent("#component", { a: 1 });

    instance.option({
        a: 1,
        b: 2,
        c: 3
    });

    instance.option("b", 2);

    var methodCallStack = $.map(instance._traceLog, function(i) { return i.method; }),
        optionChangedArgs = instance._getTraceLogByMethod("_optionChanged");

    assert.deepEqual(methodCallStack, [
        "beginUpdate", // ctor
        "beginUpdate",
        "endUpdate",

        // "beginUpdate", // optionByDevice options applying
        // "endUpdate",

        "endUpdate",
        "_init",
        "_render",

        "beginUpdate",
        "_optionChanged", "_invalidate",
        "_optionChanged", "_invalidate",
        "endUpdate",
        "_refresh",
        "_clean", "_render",

        "beginUpdate",
        "endUpdate"
    ]);

    assert.deepEqual(optionChangedArgs[0].arguments[0].name, "b");
    assert.deepEqual(optionChangedArgs[1].arguments[0].name, "c");
});

QUnit.test("mass option change", function(assert) {
    var element = $("#component").TestComponent({
        opt1: "firstCall",
        opt2: "firstCall"
    });

    var instance = element.TestComponent("instance");

    element.TestComponent({
        opt1: "secondCall",
        opt3: "secondCall"
    });

    assert.strictEqual(element.TestComponent("instance"), instance);

    assert.equal(instance.option("opt1"), "secondCall");
    assert.equal(instance.option("opt2"), "firstCall");
    assert.equal(instance.option("opt3"), "secondCall");
});

QUnit.test("mass option change call 'refresh' once", function(assert) {
    var TestComponent = this.TestComponent.inherit({
        _optionChanged: function(args) {
            this.callBase(args);
            if($.inArray(args.name, ["opt1", "opt2"]) > -1) {
                this._invalidate();
            }
        }
    });

    var instance = new TestComponent("#component", {
        opt1: "opt1",
        opt2: "opt2"
    });

    assert.ok(!instance._getTraceLogByMethod("_optionChanged").length);
    assert.ok(!instance._getTraceLogByMethod("_refresh").length);

    instance.option({
        opt1: "new opt1",
        opt2: "new opt2"
    });

    assert.equal(instance._getTraceLogByMethod("_optionChanged").length, 2);
    assert.equal(instance._getTraceLogByMethod("_refresh").length, 1);
});

QUnit.test("mass option getting", function(assert) {
    var element = $("#component").TestComponent({}),
        instance = element.TestComponent("instance");
    var options = instance.option();

    assert.ok($.isPlainObject(options));
    assert.ok(options["opt1"]);
    assert.ok(options["opt2"]);
});

QUnit.test("'option' method invoking directly and by jQuery plugin syntax should works consistently with undefined value", function(assert) {
    var $element = $("#component"),
        instance = new this.TestComponent($element, { optionWithUndefinedValue: undefined });

    assert.strictEqual(instance.option("optionWithUndefinedValue"), undefined);
    assert.strictEqual($element.TestComponent("option", "optionWithUndefinedValue"), undefined);
});

QUnit.test("mass method invoking should call method for each component (setter case)", function(assert) {
    var $firstElement = $("#component"),
        $secondElement = $("#anotherComponent"),

        $elements = $($firstElement).add($secondElement);

    registerComponent("TestComponent", this.TestComponent.inherit({
        setterReturningThis: function() {
            this._setterReturningThisCalled = true;
            return this;
        }
    })
    );

    var firstInstance = $firstElement.TestComponent().TestComponent("instance"),
        secondInstance = $secondElement.TestComponent().TestComponent("instance");

    $elements.TestComponent("setterReturningThis");

    assert.ok(firstInstance._setterReturningThisCalled);
    assert.ok(secondInstance._setterReturningThisCalled);
});

QUnit.test("mass method invoking should return first instance method result", function(assert) {
    var $firstElement = $("#component"),
        $secondElement = $("#anotherComponent"),
        $elements = $($firstElement).add($secondElement),
        firstInstance,
        result;

    registerComponent("TestComponent", this.TestComponent.inherit({
        setterReturningThis: function() {
            return this;
        }
    }));

    firstInstance = $firstElement.TestComponent().TestComponent("instance");
    $secondElement.TestComponent().TestComponent("instance");
    result = $elements.TestComponent("setterReturningThis");

    assert.strictEqual(firstInstance, result);
});

QUnit.test("jQuery instances should be compared by DOM elements set (not by reference)", function(assert) {
    var $element = $("<div>"),
        instance = $("#component").TestComponent({
            opt1: $element
        }).TestComponent("instance");

    instance.option("opt1", $element);
    assert.ok(!instance._optionChangedCalled);
});

QUnit.test("component should not be refreshed after unknown option changing (B251443)", function(assert) {
    var instance = new this.TestComponent("#component");
    instance.option("unknown option", 1);
    assert.equal(instance._getTraceLogByMethod("_refresh"), 0);
});

QUnit.test("no infinite loop during refresh()", function(assert) {
    assert.expect(0);

    var instance = new this.TestComponent("#component");
    instance.option("option2", 2);
});

QUnit.test("option 'disabled' is false on init", function(assert) {
    var $element = $("#component").TestComponent(),
        instance = $element.TestComponent("instance");

    assert.strictEqual(instance.option("disabled"), false);
});

QUnit.test("'disabled' option is passed to createComponent", function(assert) {
    var $firstElement = $("#component"),
        $secondElement = $("#anotherComponent");

    registerComponent("TestComponent", this.TestComponent.inherit({
        createComponent: function(element, name, config) {
            return this._createComponent(element, name, config);
        }
    })
    );

    var firstInstance = $firstElement.TestComponent({ disabled: true }).TestComponent("instance"),
        secondInstance = firstInstance.createComponent($secondElement, "TestComponent", {});

    assert.ok(secondInstance.option("disabled"), "disabled state is correct");
});

QUnit.test("T283132 - the 'disabled' option of inner component is changed if the 'disabled' option of outer component is changed", function(assert) {
    var $firstElement = $("#component"),
        $secondElement = $("#anotherComponent");

    registerComponent("TestComponent", this.TestComponent.inherit({
        createComponent: function(element, name, config) {
            return this._createComponent(element, name, config);
        }
    }));

    var firstInstance = $firstElement.TestComponent({ disabled: true }).TestComponent("instance"),
        secondInstance = firstInstance.createComponent($secondElement, "TestComponent", {});

    firstInstance.option("disabled", false);
    assert.ok(!secondInstance.option("disabled"), "disabled state is correct");
});

QUnit.test("'rtlEnabled' option is passed to createComponent", function(assert) {
    var $firstElement = $("#component"),
        $secondElement = $("#anotherComponent");

    registerComponent("TestComponent", this.TestComponent.inherit({
        createComponent: function(element, name, config) {
            return this._createComponent(element, name, config);
        }
    })
    );

    var firstInstance = $firstElement.TestComponent({ rtlEnabled: true }).TestComponent("instance"),
        secondInstance = firstInstance.createComponent($secondElement, "TestComponent", {});

    assert.ok(secondInstance.option("rtlEnabled"), true);
});

QUnit.test("'templatesRenderAsynchronously' option is passed to createComponent", function(assert) {
    var $firstElement = $("#component"),
        $secondElement = $("#anotherComponent");

    registerComponent("TestComponent", this.TestComponent.inherit({
        createComponent: function(element, name, config) {
            return this._createComponent(element, name, config);
        }
    })
    );

    var firstInstance = $firstElement.TestComponent({ templatesRenderAsynchronously: true }).TestComponent("instance"),
        secondInstance = firstInstance.createComponent($secondElement, "TestComponent", {});

    assert.ok(secondInstance.option("templatesRenderAsynchronously"), true);
});

QUnit.test("option 'rtl'", function(assert) {
    var $element = $("#component").TestComponent(),
        instance = $element.TestComponent("instance");

    assert.ok(!$element.hasClass(RTL_CLASS));

    instance.option("rtlEnabled", true);
    assert.ok($element.hasClass(RTL_CLASS));
});

QUnit.test("init option 'rtl' is true", function(assert) {
    var $element = $("#component").TestComponent({ rtlEnabled: true }),
        instance = $element.TestComponent("instance");

    assert.ok($element.hasClass(RTL_CLASS));

    instance.option("rtlEnabled", false);
    assert.ok(!$element.hasClass(RTL_CLASS));
});

QUnit.test("dispose on remove from DOM", function(assert) {
    var element = $("#component").TestComponent(),
        instance = element.TestComponent("instance");

    var disposed = false,
        disposingHandler = function() { disposed = true; };

    instance.on("disposing", disposingHandler);

    element.remove();

    assert.ok(disposed);
});

QUnit.test("customizing default option rules", function(assert) {
    var TestComponent = DOMComponent.inherit({
        _defaultOptionsRules: function() {
            return this.callBase().slice(0).concat([{
                device: { platform: "ios" },
                options: {
                    test: "value"
                }
            }]);
        },
    });

    registerComponent("TestComponent", TestComponent);

    TestComponent.defaultOptions({
        device: { platform: "ios" },
        options: {
            test: "customValue"
        }
    });

    devices._currentDevice = { platform: "ios" };
    assert.equal(new TestComponent($("<div/>")).option("test"), "customValue", "test option is customized for ios");

    devices._currentDevice = { platform: "android" };
    assert.notEqual(new TestComponent($("<div/>")).option("test"), "value", "test option is not customized for android");
});

QUnit.test("customizing default option rules applies only on the target component class", function(assert) {
    var TestComponent1 = DOMComponent.inherit({
        _getDefaultOptions: function() {
            return $.extend(this.callBase(), {
                test: "Initial value 1"
            });
        }
    });

    var TestComponent2 = TestComponent1.inherit({
        _getDefaultOptions: function() {
            return $.extend(this.callBase(), {
                test: "Initial value 2"
            });
        }
    });

    registerComponent("TestComponent1", TestComponent1);
    registerComponent("TestComponent2", TestComponent2);

    TestComponent1.defaultOptions({
        device: { platform: "ios" },
        options: {
            anotherOption: "Another option value"
        }
    });

    TestComponent1.defaultOptions({
        device: { platform: "ios" },
        options: {
            test: "Custom value 1"
        }
    });

    TestComponent2.defaultOptions({
        device: { platform: "ios" },
        options: {
            test: "Custom value 2"
        }
    });

    devices._currentDevice = { platform: "ios" };
    assert.equal(new TestComponent1($("<div/>")).option("test"), "Custom value 1", "Child rule should not affect on the parent");
    assert.equal(new TestComponent1($("<div/>")).option("anotherOption"), "Another option value", "Multiple calls should not clean previous rules");
});

QUnit.test("DevExpress.rtlEnabled proxied to DOMComponent", function(assert) {
    assert.equal(coreConfig().rtlEnabled, false, "DevExpress.rtlEnabled equals false by default");
    assert.equal(new DOMComponent($("<div/>")).option("rtlEnabled"), false, "false by default");

    coreConfig({ rtlEnabled: true });
    assert.equal(new DOMComponent($("<div/>")).option("rtlEnabled"), true, "DevExpress.rtlEnabled equals true");

    coreConfig({ rtlEnabled: false });
});

QUnit.test("_visibilityChanged is called on dxhiding and dxshown events and special css class is attached", function(assert) {
    var hidingFired = 0;
    var shownFired = 0;

    var TestComponent = this.TestComponent.inherit({
        NAME: "TestComponent",

        _visibilityChanged: function(visible) {
            if(visible) {
                shownFired++;
            } else {
                hidingFired++;
            }
        }
    });

    var $element = $("#component");
    new TestComponent($element);

    assert.ok($element.hasClass("dx-visibility-change-handler"), "special css class attached");

    $element.trigger("dxhiding").hide();
    assert.equal(hidingFired, 1, "hiding was fired");
    assert.equal(shownFired, 0, "shown was not fired");

    $element.show().trigger("dxshown");
    assert.equal(hidingFired, 1, "hiding was fired only once");
    assert.equal(shownFired, 1, "shown was fired");
});

QUnit.test("visibility change subscriptions should not clash", function(assert) {
    var hidingFired = 0;
    var shownFired = 0;

    var visibilityChanged = function(visible) {
        visible ? shownFired++ : hidingFired++;
    };

    var TestComponent1 = this.TestComponent.inherit({
        NAME: "TestComponent1",
        _visibilityChanged: visibilityChanged
    });

    var TestComponent2 = this.TestComponent.inherit({
        NAME: "TestComponent2",
        _visibilityChanged: visibilityChanged
    });

    var $element = $("#component");
    new TestComponent1($element);
    new TestComponent2($element);

    $element.trigger("dxhiding").hide();
    $element.show().trigger("dxshown");

    assert.equal(hidingFired, 2, "hidden fired for both components");
    assert.equal(shownFired, 2, "shown fired for both components");
});

QUnit.test("visibility change handling works optimally (initially visible)", function(assert) {
    var hidingFired = 0;
    var shownFired = 0;

    var visibilityChanged = function(visible) {
        visible ? shownFired++ : hidingFired++;
    };

    var TestComponent = this.TestComponent.inherit({
        NAME: "TestComponent1",
        _visibilityChanged: visibilityChanged
    });

    var $element = $("#component");
    new TestComponent($element);

    assert.equal(hidingFired, 0, "hidden is not fired initially");
    assert.equal(shownFired, 0, "shown is not fired initially");

    $element.show().trigger("dxshown");
    assert.equal(shownFired, 0, "shown is not fired if element is visible");

    $element.trigger("dxhiding").hide();
    assert.equal(hidingFired, 1, "hiding is fired for the first time");

    $element.trigger("dxhiding").hide();
    assert.equal(hidingFired, 1, "hiding is not fired for the second time");
});

QUnit.test("visibility change handling works optimally (initially hidden)", function(assert) {
    var hidingFired = 0;
    var shownFired = 0;

    var visibilityChanged = function(visible) {
        visible ? shownFired++ : hidingFired++;
    };

    var TestComponent = this.TestComponent.inherit({
        NAME: "TestComponent1",
        _visibilityChanged: visibilityChanged
    });

    var $element = $("#component").hide();
    new TestComponent($element);

    assert.equal(hidingFired, 0, "hidden is not fired initially");
    assert.equal(shownFired, 0, "shown is not fired initially");

    $element.trigger("dxhiding").hide();
    assert.equal(shownFired, 0, "hiding is not fired if element is hidden");

    $element.show().trigger("dxshown");
    assert.equal(shownFired, 1, "shown is fired for the first time");

    $element.show().trigger("dxshown");
    assert.equal(shownFired, 1, "shown is not fired for the second time");
});

QUnit.test("visibility change handling works with hidden parent", function(assert) {
    var hidingFired = 0;
    var shownFired = 0;

    var visibilityChanged = function(visible) {
        visible ? shownFired++ : hidingFired++;
    };

    var TestComponent = this.TestComponent.inherit({
        NAME: "TestComponent1",
        _visibilityChanged: visibilityChanged
    });

    var $parent = $("#component").hide(),
        $component = $("<div>").hide().appendTo($parent);

    new TestComponent($component);

    assert.equal(hidingFired, 0, "hidden is not fired initially");
    assert.equal(shownFired, 0, "shown is not fired initially");

    $component.show().triggerHandler("dxshown");
    assert.equal(shownFired, 0, "shown is not fired since parent is hidden");

    $parent.show();
    $component.triggerHandler("dxshown");
    assert.equal(shownFired, 1, "shown is fired since parent is shown");
});

QUnit.test("_dimensionChanged is called when window resize fired", function(assert) {
    var dimensionChanged = 0;

    var TestComponent = this.TestComponent.inherit({
        NAME: "TestComponent",

        _dimensionChanged: function(visible) {
            dimensionChanged++;
        }
    });

    var $element = $("#component");
    new TestComponent($element);

    assert.equal(dimensionChanged, 0, "no dimension change on start");

    resizeCallbacks.fire();

    assert.equal(dimensionChanged, 1, "resize fired");
});

QUnit.test("_dimensionChanged is called when dxresize event fired", function(assert) {
    var dimensionChanged = 0;

    var TestComponent = this.TestComponent.inherit({
        NAME: "TestComponent",

        _visibilityChanged: noop,

        _dimensionChanged: function() {
            dimensionChanged++;
        }
    });

    var $element = $("#component").addClass("dx-visibility-change-handler");
    new TestComponent($element);

    assert.equal(dimensionChanged, 0, "no dimension change on start");

    domUtils.triggerResizeEvent($element);

    assert.equal(dimensionChanged, 1, "dimension changed fired");
});

QUnit.test("'option' method should work correctly with $.Event instance (T105184)", function(assert) {
    var component = $("#component").TestComponent({
        position: {
            of: window,
            at: ""
        }
    }).TestComponent("instance");

    component.option("event", $.Event('click'));
    assert.ok(component.option("event") instanceof $.Event);

    component.option("event", $.Event('mousedown'));
    assert.ok(component.option("event") instanceof $.Event);

    component.option("position", { of: $.Event('mousedown') });
    assert.ok(component.option("position.of") instanceof $.Event);

    component.option("position", { of: $.Event('mousedown') });
    assert.ok(component.option("position.of") instanceof $.Event);
});

QUnit.test("element method should return correct component element", function(assert) {
    var $element = $("#component").TestComponent();
    var instance = $element.TestComponent("instance");

    assert.strictEqual(instance.$element().get(0), $element.get(0), "correct element present");
});

$.each(["onInitialized", "onOptionChanged", "onDisposing"], function(_, action) {
    QUnit.test("'" + action + "' action should be fired even in disabled & readOnly", function(assert) {
        var config = {
            value: true
        };
        config[action] = function(e) {
            assert.ok(true, "action fired");
            assert.equal(e.element, e.component.element(), "action has correct element");
        };

        var $component = $("#component");

        $component.addClass("dx-state-disabled");
        $component.addClass("dx-state-readonly");

        var component = new this.TestComponent($component, config);
        component.option("value", false);
        $component.remove();
    });
});

QUnit.test("the 'elementAttr' option should set attributes to widget element according to the object passed", function(assert) {
    var $element = $("#component").TestComponent({
        elementAttr: {
            attr1: "widget 01"
        }
    });

    assert.equal($element.attr("attr1"), "widget 01", "the second attribute is set correctly");
});

QUnit.test("changing elementAttr option should not rerender the component", function(assert) {
    var $element = $("#component").TestComponent({ elementAttr: { attr1: "widget 01" } }),
        instance = $element.TestComponent("instance"),
        render = sinon.spy(instance, "_render");

    instance.option("elementAttr", { attr1: "widget 02" });

    assert.equal(render.callCount, 0, "render should not be called");
    assert.equal($element.attr("attr1"), "widget 02", "attribute is correct");
});

QUnit.test("changing class via 'elementAttr' option should preserve component specific classes", function(assert) {
    var SomeComponent = DOMComponent.inherit({
        _render: function() {
            this.$element().addClass("dx-some-class1");
            this.callBase();
            this.$element().addClass("dx-some-class2");
        }
    });

    var $element = $("#component"),
        instance = new SomeComponent($element),
        componentClassNames = $element.attr("class").split(" "),
        specialClass = "special-class";

    instance.option("elementAttr", { class: specialClass });

    for(var i = 0, n = componentClassNames.length; i < n; i++) {
        assert.ok($element.hasClass(componentClassNames[i]), "the '" + componentClassNames[i] + "' class is preserved");
    }

    assert.ok($element.hasClass(specialClass), "the new class is also present");
});

QUnit.test("Dispose: component can be recreated after dispose", function(assert) {
    var element = $("#component").TestComponent(),
        instance = element.TestComponent("instance");

    instance.option("opt1", "notDefault");

    assert.deepEqual(dataUtils.data(element.get(0), "dxComponents"), ["TestComponent"]);
    assert.equal(instance.option("opt1"), "notDefault");

    instance.dispose();

    assert.notOk(dataUtils.data(element.get(0), "TestComponent"));
    assert.notOk(dataUtils.data(element.get(0), "dxComponents"));

    element = $("#component").TestComponent();
    instance = element.TestComponent("instance");

    assert.notEqual(instance.option("opt1"), "notDefault");
    assert.ok(dataUtils.data(element.get(0), "TestComponent") instanceof this.TestComponent);
    assert.ok(element.TestComponent("instance") instanceof this.TestComponent);
});

QUnit.test("Dispose: content of container is cleaned", function(assert) {
    var SomeComponent = DOMComponent.inherit({
        _render: function() {
            var p = document.createElement("p");
            p.textContent = "Some text";
            this.$element()[0].appendChild(p);
            this.callBase();
        }
    });

    var element = $("#component"),
        instance = new SomeComponent(element);

    assert.equal(element[0].textContent, "Some text");
    assert.equal(element[0].childElementCount, 1);

    instance.dispose();

    assert.equal(element[0].textContent, "");
    assert.equal(element[0].childElementCount, 0);

});

QUnit.test("Dispose: dx classes are removed", function(assert) {
    var element = $("#component").TestComponent(),
        instance = element.TestComponent("instance");

    element.addClass("dx-some-class-1");
    element.addClass("dx-some-class-2");
    element.addClass("some-class-1");
    element.addClass("some-class-2");
    element.addClass("dx-some-class-3 some-class-3");

    instance.dispose();

    assert.notOk(element.hasClass("dx-some-class-1"));
    assert.notOk(element.hasClass("dx-some-class-2"));
    assert.notOk(element.hasClass("dx-some-class-3"));
    assert.ok(element.hasClass("some-class-1"));
    assert.ok(element.hasClass("some-class-2"));
    assert.ok(element.hasClass("some-class-3"));
});

QUnit.test("Dispose: attributes deleted", function(assert) {
    var element = $("#component").TestComponent(),
        instance = element.TestComponent("instance"),
        attributes = [
            // setAria
            "role",
            "aria-multiselectable",
            "aria-hidden",
            "aria-autocomplete",
            "aria-label",
            "aria-selected",
            "aria-activedescendant",
            "aria-checked",
            "aria-owns",
            "aria-haspopup",
            "aria-expanded",
            "aria-invalid",
            "aria-readonly",
            "aria-describedby",
            "aria-required",
            "aria-sort",
            "aria-valuenow",
            "aria-valuemin",
            "aria-valuemax",
            "aria-pressed",
            "aria-controls",
            "aria-multiline",
            "aria-level",
            "aria-disabled",
            "data-dx-content-placeholder-name",
            "style"
        ];

    attributes.forEach(function(attribute) {
        element.attr(attribute, "value");
    });

    element.attr("tabindex", 0);

    instance.dispose();

    attributes.forEach(function(attribute) {
        assert.equal(element.attr(attribute), undefined);
    });
    assert.equal(element.attr("data-dx-content-placeholder-name"), undefined);
    assert.equal(element.attr("style"), undefined);
    assert.equal(element.attr("tabindex"), undefined);

});

QUnit.test("Dispose: events are cleaned, dxremove is fired", function(assert) {

    var disposeRun = false;
    var clickRun = false;

    var SomeComponent = DOMComponent.inherit({
        _render: function() {
            var p = document.createElement("p");
            p.textContent = "Some text";
            this.$element()[0].appendChild(p);
            eventsEngine.on(this.$element(), "click", function() {
                clickRun = true;
            });
            this.callBase();
        },
        _dispose: function() {
            disposeRun = true;
        }
    });

    var element = $("#component");
    var instance = new SomeComponent(element);

    instance.dispose();

    eventsEngine.trigger(element, "click");

    assert.ok(disposeRun);
    assert.notOk(clickRun);
});


QUnit.test("get element", function(assert) {
    var element = $("#component").TestComponent(),
        instance = dataUtils.data(element[0], "TestComponent");

    if(config().useJQuery) {
        assert.deepEqual(instance.element()[0], $("#component")[0]);
    } else {
        assert.equal(instance.element(), $("#component").get(0));
    }
});

QUnit.test("getInstance method", function(assert) {
    var $element = $("#component");
    var instance = new this.TestComponent($element);
    var AnotherComponent = DOMComponent.inherit();

    assert.equal(this.TestComponent.getInstance($element), instance);
    assert.equal(this.TestComponent.getInstance($element.get(0)), instance);

    assert.strictEqual(AnotherComponent.getInstance($element), undefined);
    assert.strictEqual(AnotherComponent.getInstance($element.get(0)), undefined);
});
