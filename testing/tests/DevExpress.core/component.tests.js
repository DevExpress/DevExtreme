import $ from "jquery";
import { noop } from "core/utils/common";
import Component from "core/component";
import { PostponedOperations } from "core/postponed_operations";
import errors from "core/errors";
import devices from "core/devices";
import config from "core/config";

const TestComponent = Component.inherit({

    ctor(options) {
        this._resetTraceLog();
        this.callBase(options);
    },

    _setOptionsByReference() {
        this.callBase();
        $.extend(this._optionsByReference, {
            byReference: true
        });
    },

    _setDeprecatedOptions() {
        this.callBase();

        $.extend(this._deprecatedOptions, {
            deprecated: { since: "15.2", alias: "deprecatedAlias" },
            deprecatedOption: { since: "14.1", message: "Use some other option instead" },
            deprecatedOptionWithSugarSyntax: { since: "14.2", alias: "deprecatedOptionAliasWithSugarSyntax" },
            "secondLevel.deprecatedOption": { since: "14.2", alias: "secondLevel.deprecatedOptionAlias" },
            "thirdLevel.option.deprecated": { since: "15.2", alias: "thirdLevel.option.deprecatedAlias" },
            "onDeprecatedEvent": { since: "20.1", message: "Use another events instead" }
        });
    },

    _setOptionAliases() {
        this.callBase();

        $.extend(this._getOptionAliases(), {
            checked: "value"
        });
    },

    _getDefaultOptions() {
        return $.extend(
            this.callBase(),
            {
                opt1: "default",
                opt2: "default",
                opt4: "default",
                opt5: {
                    subOpt1: "default",
                    subOpt2: {
                        value: ""
                    }
                },
                opt6: [{
                    subOpt: "default"
                }],
                deprecatedOption: "test",
                secondLevel: {
                    deprecatedOption: 1
                },
                thirdLevel: {
                    option: {
                        deprecatedAlias: "deprecatedValue"
                    }
                },
                funcOption() {
                    return this;
                }
            }
        );
    },

    _optionChanged(name, value, prevValue) {
        this._traceLog.push({
            method: "_optionChanged",
            arguments: $.makeArray(arguments)
        });

        this.callBase(...arguments);
    },

    _init(...args) {
        this._traceLog.push({
            method: "_init",
            arguments: $.makeArray(args)
        });

        this.callBase();
    },

    beginUpdate(...args) {
        this._traceLog.push({
            method: "beginUpdate",
            arguments: $.makeArray(args)
        });
        this.callBase();
    },

    endUpdate(...args) {
        this._traceLog.push({
            method: "endUpdate",
            arguments: $.makeArray(args)
        });
        this.callBase();
    },

    func(arg) {
        return arg;
    },

    instanceChain() {
        return this;
    },

    _getTraceLogByMethod(methodName) {
        return $.grep(this._traceLog, i => {
            return i.method === methodName;
        });
    },

    _resetTraceLog() {
        this._traceLog = [];
    }
});

QUnit.module("default", {}, () => {
    QUnit.test("options api - 'option' method", function(assert) {
        const instance = new TestComponent({ opt2: "custom" });

        instance.option({
            opt1: "mass1",
            opt2: "mass2"
        });

        assert.equal(instance.option("opt1"), "mass1");
        assert.equal(instance.option("opt2"), "mass2");
    });

    QUnit.test("setOptionSilently method", function(assert) {
        const instance = new TestComponent({
            opt2: "custom"
        });

        instance._setOptionSilent("opt2", "new custom");

        assert.strictEqual(instance.option("opt2"), "new custom", "option has been changed");
        const log = instance._getTraceLogByMethod("_optionChanged");
        assert.strictEqual(log.length, 0, "optionChanged method has not been called");
    });

    QUnit.test("options api - 'onOptionChanged' action", function(assert) {
        const actionChangeLog = [];
        const eventChangeLog = [];

        const instance = new TestComponent({
            option1: "value1",
            option2: "value2",
            onOptionChanged(args) {
                actionChangeLog.push(args);
            }
        });

        instance.on("optionChanged", args => {
            eventChangeLog.push(args);
        });

        instance.option({
            "option1": "new value1",
            "option2": "new value2"
        });

        const expectedLog = [
            {
                name: "option1",
                fullName: "option1",
                previousValue: "value1",
                value: "new value1",
                component: instance
            },
            {
                name: "option2",
                fullName: "option2",
                previousValue: "value2",
                value: "new value2",
                component: instance
            }
        ];

        assert.deepEqual(actionChangeLog, expectedLog);
        assert.deepEqual(eventChangeLog, expectedLog);
    });

    QUnit.test("options api - 'onOptionChanged' changing", function(assert) {
        let called = null;

        const instance = new TestComponent({
            option1: "value1",
            onOptionChanged(args) {
                called = "old handler";
            }
        });

        instance.option("onOptionChanged", () => {
            called = "new handler";
        });

        instance.option("option1", "value2");

        assert.equal(called, "new handler");
    });

    QUnit.test("component should initialize PostponedOperations", function(assert) {
        const instance = new TestComponent({ a: 1 });

        assert.ok(instance.postponedOperations instanceof PostponedOperations, "Componend initialize PostponedOperations");
    });

    QUnit.test("postponed operations should be called on endUpdate", function(assert) {
        const instance = new TestComponent({ a: 1 });
        const callPostponed = sinon.stub(instance.postponedOperations, "callPostponedOperations");

        instance.endUpdate();
        assert.ok(callPostponed.calledOnce, "Postponed operations are called");
    });

    QUnit.test("postponed operations should be called correctly without promises", function(assert) {
        const instance = new TestComponent({ a: 1 });

        const postponedOperation = () => {
            return {
                done() {
                    return true;
                }
            };
        };

        instance.postponedOperations.add("_firstPostponedOperation", postponedOperation, undefined);
        delete instance.postponedOperations._postponedOperations._firstPostponedOperation.promises;
        instance.endUpdate();
        assert.ok(true, "Postponed operations are called correctly");
    });

    QUnit.test("component lifecycle, changing a couple of options", function(assert) {
        const instance = new TestComponent({ a: 1 });
        // Method is injected here (not in the TestComponent prototype) in order to not overwhelm prototype because of one test
        instance._optionChanging = function() {
            this._traceLog.push({ method: "_optionChanging" });
        };

        instance.option({
            a: 1,
            b: 2,
            c: 3
        });

        instance.option("b", 2);

        const methodCallStack = $.map(instance._traceLog, i => {
            return i.method;
        });
        const optionChangedArgs = instance._getTraceLogByMethod("_optionChanged");

        assert.deepEqual(methodCallStack, [
            "beginUpdate",
            "beginUpdate",
            "endUpdate",

            // "beginUpdate", // optionByDevice options applying
            // "endUpdate",
            "endUpdate",
            "_init",

            "beginUpdate",
            "_optionChanging",
            "_optionChanged",
            "_optionChanging",
            "_optionChanged",
            "endUpdate",

            "beginUpdate",
            "endUpdate"
        ]);

        assert.deepEqual(optionChangedArgs[0].arguments[0].name, "b");
        assert.deepEqual(optionChangedArgs[1].arguments[0].name, "c");
    });

    QUnit.test("mass option change", function(assert) {
        const instance = new TestComponent({
            opt1: "firstCall",
            opt2: "firstCall"
        });

        instance.option({
            opt1: "secondCall",
            opt3: "secondCall"
        });

        assert.equal(instance.option("opt1"), "secondCall");
        assert.equal(instance.option("opt2"), "firstCall");
        assert.equal(instance.option("opt3"), "secondCall");
    });

    QUnit.test("mass option getting", function(assert) {
        const instance = new TestComponent({
            opt1: "firstCall",
            opt2: "firstCall"
        });
        const options = instance.option();

        assert.ok($.isPlainObject(options));
        assert.ok(options["opt1"]);
        assert.ok(options["opt2"]);
    });

    QUnit.test("complex options", function(assert) {
        let component1 = Component.inherit({
            NAME: "component1",

            _getDefaultOptions() {
                return $.extend(
                    this.callBase(), {
                        plain: {
                            a: {
                                b: "b"
                            }
                        }
                    }
                );
            }
        });

        component1 = new component1({
            plain: {
                a: {
                    b1: "b1"
                },
                a1: "a1"
            }
        });

        assert.deepEqual(
            component1.option("plain"),
            {
                a: {
                    b: "b",
                    b1: "b1"
                },
                a1: "a1"
            },
            "plain objects are merged"
        );

    });

    QUnit.test("option value equality comparison", function(assert) {
        let triggered;

        const instance = new (Component.inherit({ NAME: "temp" }))({
            onOptionChanged() {
                triggered = true;
            }
        });

        const checkTriggered = (optionName, value, expectedTriggered) => {
            triggered = false;
            instance.option(optionName, value);
            assert.ok(expectedTriggered === triggered);
        };

        const plainObj = {};
        const array = [];
        const date = new Date();

        checkTriggered("obj", plainObj, true);
        checkTriggered("array", array, true);
        checkTriggered("scalar", 1, true);
        checkTriggered("func", noop, true);

        // plain objects are always treated as different
        checkTriggered("obj", plainObj, true);

        // same arrays are different
        checkTriggered("array", array, true);

        checkTriggered("scalar", 1, false);

        checkTriggered("scalar", 2, true);

        // must compare valueOf
        checkTriggered("date", date, true);

        checkTriggered("date", new Date('2012-10-30'), true);

        checkTriggered("func", noop, false);

        checkTriggered("func", () => {
        }, true);
    });

    QUnit.test("option getter by path gets value", function(assert) {
        const instance = new TestComponent({
            prop: {
                name: "John",
                items: [1, 2, 3]
            }
        });
        assert.equal(instance.option("prop.name"), "John");
        assert.equal(instance.option("prop.items.1"), 2);
    });

    QUnit.test("option setter by path sets value ", function(assert) {
        const instance = new TestComponent({
            prop: {
                name: "John",
                items: [1, 2, 3]
            }
        });

        instance.option("prop.name", "Joe");
        assert.equal(instance.option("prop.name"), "Joe");

        instance.option("prop.items.2", 10);
        assert.equal(instance.option("prop.items.2"), 10);
    });

    QUnit.test("option setter by path triggers option changed callback", function(assert) {
        const instance = new TestComponent({
            opt3: {
                subOpt: "value"
            }
        });

        assert.ok(!instance._getTraceLogByMethod("_optionChanged").length);

        instance.option("opt3.subOpt", "newValue");
        assert.equal(instance._getTraceLogByMethod("_optionChanged").length, 1);
    });

    QUnit.test("option by value", function(assert) {
        const value = {
            a: 3,
            b: 4
        };

        const instance = new TestComponent({
            byValue: value
        });
        assert.notStrictEqual(instance.option("byValue"), value, "option initialized by value");

        instance.option("byValue", value);
        assert.notStrictEqual(instance.option("byValue"), value, "option set by value");
    });

    QUnit.test("option by reference", function(assert) {
        const value = { a: 3, b: 4 };

        const instance = new TestComponent({
            byReference: value
        });

        assert.strictEqual(instance.option("byReference"), value, "option initialized by reference");

        instance.option("byReference", value);
        assert.strictEqual(instance.option("byReference"), value, "option set by reference");
    });

    QUnit.test("'option' method with undefined value", function(assert) {
        const instance = new TestComponent({ optionWithUndefinedValue: undefined });

        assert.strictEqual(instance.option("optionWithUndefinedValue"), undefined);
    });

    QUnit.test("set and get option silently", function(assert) {
        const instance = new TestComponent();
        let warningCount = 0;
        const _logDeprecatedWarningMock = option => {
            ++warningCount;
        };

        instance._logDeprecatedWarning = _logDeprecatedWarningMock;

        instance._optionSilent({
            deprecatedOption: true,
        });

        assert.equal(instance._optionSilent("deprecatedOption"), true);
        assert.equal(warningCount, 0);
    });

    QUnit.test("reading & writing a deprecated option must invoke the _logDeprecatedWarning method and pass the option name as a parameter", function(assert) {
        const instance = new TestComponent();
        const deprecatedOption = "deprecatedOption";
        const _logDeprecatedWarningMock = option => {
            assert.strictEqual(option, deprecatedOption);
        };

        instance._logDeprecatedWarning = _logDeprecatedWarningMock;
        assert.expect(3);
        instance.option(deprecatedOption);
        instance.option(deprecatedOption, true);
        instance.option({ fakeOption: true, deprecatedOption: true });
    });

    QUnit.test("writing a deprecated option must invoke optionChanged for deprecated option", function(assert) {
        const actionChangeLog = [];

        const instance = new TestComponent({
            option1: "value1",
            option2: "value2",
            deprecatedOptionAliasWithSugarSyntax: "test",
            onOptionChanged(args) {
                delete args.component;
                actionChangeLog.push(args);
            }
        });

        instance.option("deprecatedOptionWithSugarSyntax", "new test");

        const expectedLog = [
            {
                name: "deprecatedOptionAliasWithSugarSyntax",
                fullName: "deprecatedOptionAliasWithSugarSyntax",
                previousValue: "test",
                value: "new test"
            },
            {
                name: "deprecatedOptionWithSugarSyntax",
                fullName: "deprecatedOptionWithSugarSyntax",
                previousValue: "test",
                value: "new test"
            }
        ];

        assert.deepEqual(actionChangeLog, expectedLog);
        assert.deepEqual(instance.option("deprecatedOptionWithSugarSyntax"), "new test");
        assert.deepEqual(instance.option("deprecatedOptionAliasWithSugarSyntax"), "new test");
    });

    QUnit.test("reading all options should not invoke the _logDeprecatedWarning method", function(assert) {
        const instance = new TestComponent();
        let warningCount = 0;
        const _logDeprecatedWarningMock = option => {
            ++warningCount;
        };

        instance._logDeprecatedWarning = _logDeprecatedWarningMock;
        instance.option();
        assert.strictEqual(warningCount, 0);
    });

    QUnit.test("component should _suppressDeprecatedWarnings while initializing _defaultOptions in the constructor and _resumeDeprecatedWarnings afterwards", function(assert) {
        const instance = new TestComponent();
        const deprecatedOption = "deprecatedOption";
        let warningCount = 0;
        const _logDeprecatedWarningMock = option => {
            ++warningCount;
        };

        instance._logDeprecatedWarning = _logDeprecatedWarningMock;

        assert.strictEqual(warningCount, 0);
        instance.option(deprecatedOption);
        assert.strictEqual(warningCount, 1);
    });

    QUnit.test("deprecated options api syntactic sugar for options having aliases", function(assert) {
        const originalLog = errors.log;
        const log = [];

        errors.log = (...args) => {
            log.push($.makeArray(args));
        };

        try {
            const instance = new TestComponent();
            const option = "deprecatedOptionWithSugarSyntax";
            const alias = "deprecatedOptionAliasWithSugarSyntax";

            instance.option(option, true);
            assert.strictEqual(instance.option(alias), true);
            assert.strictEqual(instance.option(alias), instance.option(option));
            assert.strictEqual(instance.option()[alias], instance.option(option));
            assert.equal(log.length, 3);
            assert.deepEqual(log[0], [
                "W0001",
                instance.NAME,
                "deprecatedOptionWithSugarSyntax",
                "14.2",
                "Use the 'deprecatedOptionAliasWithSugarSyntax' option instead"
            ]);
        } finally {
            errors.log = originalLog;
        }
    });

    // T116550
    QUnit.test("deprecated options api syntactic sugar for second level options having aliases", function(assert) {
        const originalLog = errors.log;
        const log = [];

        errors.log = (...args) => {
            log.push($.makeArray(args));
        };

        try {
            const instance = new TestComponent();
            const option = "secondLevel.deprecatedOption";
            const alias = "secondLevel.deprecatedOptionAlias";

            instance.option({
                secondLevel: {
                    deprecatedOption: 'test'
                }
            });
            assert.strictEqual(instance.option(alias), 'test');
            assert.strictEqual(instance.option(alias), instance.option(option));
            assert.strictEqual(instance.option().secondLevel.deprecatedOptionAlias, 'test');
            assert.equal(log.length, 2);
            assert.deepEqual(log[0], [
                "W0001",
                instance.NAME,
                "secondLevel.deprecatedOption",
                "14.2",
                "Use the 'secondLevel.deprecatedOptionAlias' option instead"
            ]);
        } finally {
            errors.log = originalLog;
        }
    });

    QUnit.test("changing a nested options triggers only top level name option change handler", function(assert) {
        const instance = new TestComponent({
            firstLevel: {
                secondLevel: [0, 1, 2]
            }
        });

        instance.option("firstLevel.secondLevel[0]", 10);

        assert.deepEqual(
            instance._getTraceLogByMethod("_optionChanged")[0].arguments,
            [{
                name: "firstLevel",
                fullName: "firstLevel.secondLevel[0]",
                value: 10,
                previousValue: 0
            }]
        );

        instance.option("firstLevel.secondLevel", [123, 321]);
        assert.deepEqual(
            instance._getTraceLogByMethod("_optionChanged")[1].arguments,
            [{
                name: "firstLevel",
                fullName: "firstLevel.secondLevel",
                value: [
                    123,
                    321
                ],
                previousValue: [
                    10,
                    1,
                    2
                ]
            }]
        );

        instance.option("firstLevel", { secondLevel: 1 });
        assert.deepEqual(
            instance._getTraceLogByMethod("_optionChanged")[2].arguments,
            [{
                name: "firstLevel",
                fullName: "firstLevel",
                value: {
                    "secondLevel": 1
                },
                previousValue: {
                    "secondLevel": 1
                }
            }]
        );
    });

    const createDeprecatedMessageArray = (version, instanceName, deprecatedOption, aliasName) => {
        return [
            "W0001",
            instanceName,
            deprecatedOption,
            version,
            "Use the '" + aliasName + "' option instead"
        ];
    };

    QUnit.test("T320061 - the third level of nesting option deprecated message on initialize", function(assert) {
        const originalLog = errors.log;
        const log = [];

        errors.log = (...args) => {
            log.push($.makeArray(args));
        };

        try {
            const optionName = "thirdLevel.option.deprecated";
            const aliasName = "thirdLevel.option.deprecatedAlias";
            const optionValue = "thirdLevelValue";

            const instance = new TestComponent({
                thirdLevel: {
                    option: {
                        deprecated: optionValue
                    }
                }
            });

            assert.equal(log.length, 1, "deprecated warning is printed to console after initialization");
            assert.deepEqual(log[0], createDeprecatedMessageArray("15.2", instance.NAME, optionName, aliasName));

            assert.strictEqual(instance.option(aliasName), optionValue, "the alias option has correct value");
            assert.strictEqual(instance.option(aliasName), instance.option(optionName), "the alias option has set option value");
            assert.equal(log.length, 2, "deprecated warning is printed to console after the 'option' method is called with deprecated option");

            const expectedThirdLevelOptionObject = {
                option: {
                    deprecatedAlias: optionValue
                }
            };

            assert.deepEqual(instance.option().thirdLevel, expectedThirdLevelOptionObject, "option object is correct");
        } finally {
            errors.log = originalLog;
        }
    });

    QUnit.test("T320061 - third level of nesting option deprecated message on option change using object", function(assert) {
        const originalLog = errors.log;
        const log = [];

        errors.log = (...args) => {
            log.push($.makeArray(args));
        };

        try {
            const optionName = "thirdLevel.option.deprecated";
            const aliasName = "thirdLevel.option.deprecatedAlias";
            const optionValue = "thirdLevelValue";
            const instance = new TestComponent();

            instance.option({
                thirdLevel: {
                    option: {
                        deprecated: optionValue
                    }
                }
            });

            assert.strictEqual(instance.option(aliasName), optionValue);
            assert.strictEqual(instance.option(aliasName), instance.option(optionName));

            assert.deepEqual(instance.option().thirdLevel, {
                option: {
                    deprecatedAlias: optionValue
                }
            });

            assert.equal(log.length, 2);

            assert.deepEqual(log[0], createDeprecatedMessageArray("15.2", instance.NAME, optionName, aliasName));
        } finally {
            errors.log = originalLog;
        }
    });

    QUnit.test("dispose options", function(assert) {
        const component = new TestComponent();
        const callbacks = ["_deprecatedCallback"];
        const optionManagerCallbacks = ["_changedCallback", "_changingCallback"];

        callbacks.forEach((callback) => {
            assert.notEqual(component._options[callback], noop);
        });
        optionManagerCallbacks.forEach((callback) => {
            assert.notEqual(component._options._optionManager[callback], noop);
        });

        component._dispose();

        callbacks.forEach((callback) => {
            assert.equal(component._options[callback], noop);
        });
        optionManagerCallbacks.forEach((callback) => {
            assert.equal(component._options._optionManager[callback], noop);
        });
    });

    QUnit.test("T320061 - third level of nesting option deprecated message on option change using string", function(assert) {
        const originalLog = errors.log;
        const log = [];

        errors.log = (...args) => {
            log.push($.makeArray(args));
        };

        try {
            const optionName = "thirdLevel.option.deprecated";
            const aliasName = "thirdLevel.option.deprecatedAlias";
            const optionValue = "thirdLevelValue";
            const instance = new TestComponent();

            instance.option(optionName, optionValue);

            assert.strictEqual(instance.option(aliasName), optionValue);
            assert.strictEqual(instance.option(aliasName), instance.option(optionName));

            assert.deepEqual(instance.option().thirdLevel, {
                option: {
                    deprecatedAlias: optionValue
                }
            });

            assert.equal(log.length, 2);

            assert.deepEqual(log[0], createDeprecatedMessageArray("15.2", instance.NAME, optionName, aliasName));
        } finally {
            errors.log = originalLog;
        }
    });

    QUnit.test("'onDisposing' action and event should be fired on component disposing", function(assert) {
        let actionArgs = null;
        let eventArgs = null;

        const component = new TestComponent({
            onDisposing(args) {
                actionArgs = args;
            }
        });

        component.on("disposing", args => {
            eventArgs = args;
        });

        component._dispose();

        assert.ok(actionArgs);
        assert.deepEqual(actionArgs, {
            component
        });

        assert.ok(eventArgs);
        assert.deepEqual(eventArgs, {
            component
        });
    });

    QUnit.test("'onDisposing' changing", function(assert) {
        let called = null;

        const component = new TestComponent({
            onDisposing() {
                called = "old handler";
            }
        });

        component.option("onDisposing", () => {
            called = "new handler";
        });

        component._dispose();

        assert.equal(called, "new handler");
    });

    QUnit.test("'onInitialized' action should be fired on component initialized", function(assert) {
        let actionArgs = null;

        const component = new TestComponent({
            onInitialized(args) {
                actionArgs = args;
            }
        });

        assert.ok(actionArgs);
        assert.deepEqual(actionArgs, {
            component
        });
    });

    QUnit.test("'onInitialized' action should accept option changing (T313907)", function(assert) {
        let optionChangedCounter = 0;

        new TestComponent({
            onInitialized() {
                this.option("a", "new value");
            },
            onOptionChanged() {
                optionChangedCounter++;
            }
        });

        assert.equal(optionChangedCounter, 0, "if option change will fired, partial re-render lead to error");
    });

    QUnit.test("'hasActionSubscription' should be false if component doesn't have subscribe", function(assert) {
        const component = new TestComponent();

        assert.notOk(component.hasActionSubscription("onInitialized"), "component doesn't have onInitialized subscribe");
    });

    QUnit.test("'hasActionSubscription' should be true if component has subscribe via option", function(assert) {
        const component = new TestComponent({
            onInitialized() {
            }
        });

        assert.ok(component.hasActionSubscription("onInitialized"), "component has onInitialized subscribe");
    });

    QUnit.test("'hasActionSubscription' should be true if component has subscribe via event", function(assert) {
        const component = new TestComponent();

        component.on("initialized", () => {
        });

        assert.ok(component.hasActionSubscription("onInitialized"), "component has onInitialized subscribe");
    });

    QUnit.test("'hasActionSubscription' should not raise deprecation warning for event option", function(assert) {
        const instance = new TestComponent();
        const logDeprecatedWarningSpy = sinon.spy(instance, "_logDeprecatedWarning");

        try {
            instance.hasActionSubscription("onDeprecatedEvent");
            assert.ok(logDeprecatedWarningSpy.notCalled);
        } finally {
            logDeprecatedWarningSpy.restore();
        }
    });

    QUnit.test("changing value to NaN does not call optionChanged twice", function(assert) {
        let called = 0;

        const instance = new TestComponent({
            option1: 0,
            onOptionChanged(args) {
                called++;
            }
        });

        instance.option("option1", NaN);
        instance.option("option1", NaN);

        assert.equal(called, 1, "NaN handled once");
    });

    QUnit.test("DOM Element comparing by reference", function(assert) {
        let called = 0;
        const element = document.createElement("div");

        const instance = new TestComponent({
            option1: element,
            onOptionChanged(args) {
                called++;
            }
        });

        const newElement = document.createElement("div");

        instance.option("option1", element);
        instance.option("option1", newElement);

        assert.equal(called, 1, "DOM Element compared by reference");
    });

    QUnit.test("_optionChanging is called before inner _options object is changed", function(assert) {
        const instance = new TestComponent({
            option1: 1
        });
        instance._optionChanging = (name, currentValue, nextValue) => {
            assert.strictEqual(name, "option1", "name");
            assert.strictEqual(currentValue, 1, "current value");
            assert.strictEqual(nextValue, 2, "next value");
            assert.strictEqual(instance.option("option1"), 1, "instance state");
        };

        instance.option("option1", 2);
    });

    QUnit.test("T359818 - option changed should be called when deprecated option is changed", function(assert) {
        const instance = new TestComponent();
        const value = 5;

        instance._resetTraceLog();
        instance.option("deprecated", value);

        const logRecord = instance._getTraceLogByMethod("_optionChanged");

        assert.equal(logRecord[0].arguments[0].name, "deprecatedAlias", "the 'optionChanged' method option name is correct");
        assert.equal(logRecord[0].arguments[0].value, value, "the 'optionChanged' method option value is correct");

        assert.equal(logRecord[1].arguments[0].name, "deprecated", "the 'optionChanged' method option name is correct");
        assert.equal(logRecord[1].arguments[0].value, value, "the 'optionChanged' method option value is correct");
    });

    QUnit.test("T359818 - option changed should be called when the second level deprecated option is changed", function(assert) {
        const instance = new TestComponent();
        const value = 5;

        instance._resetTraceLog();
        instance.option("secondLevel.deprecatedOption", value);

        const logRecord = instance._getTraceLogByMethod("_optionChanged");

        assert.equal(logRecord[0].arguments[0].fullName, "secondLevel.deprecatedOptionAlias", "the 'optionChanged' method option name is correct");
        assert.equal(logRecord[0].arguments[0].value, value, "the 'optionChanged' method option value is correct");

        assert.equal(logRecord[1].arguments[0].fullName, "secondLevel.deprecatedOption", "the 'optionChanged' method option name is correct");
        assert.equal(logRecord[1].arguments[0].value, value, "the 'optionChanged' method option value is correct");
    });

    QUnit.test("T359818 - option changed should be called when deprecated option is changed", function(assert) {
        const instance = new TestComponent();
        const value = 5;

        instance._resetTraceLog();
        instance.option("deprecated", value);

        const logRecord = instance._getTraceLogByMethod("_optionChanged");

        assert.equal(logRecord[0].arguments[0].name, "deprecatedAlias", "the 'optionChanged' method option name is correct");
        assert.equal(logRecord[0].arguments[0].value, value, "the 'optionChanged' method option value is correct");

        assert.equal(logRecord[1].arguments[0].name, "deprecated", "the 'optionChanged' method option name is correct");
        assert.equal(logRecord[1].arguments[0].value, value, "the 'optionChanged' method option value is correct");
    });

    QUnit.test("T359818 - option changed should be called when the second level deprecated option is changed", function(assert) {
        const instance = new TestComponent();
        const value = 5;

        instance._resetTraceLog();
        instance.option("secondLevel.deprecatedOption", value);

        const logRecord = instance._getTraceLogByMethod("_optionChanged");

        assert.equal(logRecord[0].arguments[0].fullName, "secondLevel.deprecatedOptionAlias", "the 'optionChanged' method option name is correct");
        assert.equal(logRecord[0].arguments[0].value, value, "the 'optionChanged' method option value is correct");

        assert.equal(logRecord[1].arguments[0].fullName, "secondLevel.deprecatedOption", "the 'optionChanged' method option name is correct");
        assert.equal(logRecord[1].arguments[0].value, value, "the 'optionChanged' method option value is correct");
    });

    QUnit.test("T359818 - deprecated option changed should be called when alias option is changed", function(assert) {
        const instance = new TestComponent();
        const value = 5;

        instance._resetTraceLog();
        instance.option("deprecatedAlias", value);

        const logRecord = instance._getTraceLogByMethod("_optionChanged");

        assert.equal(logRecord[0].arguments[0].name, "deprecatedAlias", "the 'optionChanged' method option name is correct");
        assert.equal(logRecord[0].arguments[0].value, value, "the 'optionChanged' method option value is correct");

        assert.equal(logRecord[1].arguments[0].name, "deprecated", "the 'optionChanged' method option name is correct");
        assert.equal(logRecord[1].arguments[0].value, value, "the 'optionChanged' method option value is correct");
    });

    QUnit.test("the isOptionDeprecated method", function(assert) {
        const instance = new TestComponent();
        assert.ok(instance.isOptionDeprecated("deprecated"), "it is correct for deprecated option");
        assert.ok(!instance.isOptionDeprecated("opt1"), "it is correct for an ordinary option");
    });

    QUnit.test("the _getOptionValue method sets the context for function option (T577942)", function(assert) {
        const instance = new TestComponent();
        const context = { contextField: 1 };

        const value = instance._getOptionValue("funcOption", context);
        assert.deepEqual(value, context, "context is correct");
    });
});

QUnit.module("defaultOptions", {
    beforeEach: function() {
        this.originalDevice = devices.current();
        this.createClass = defaultOptionsRules => {
            return Component.inherit({
                _defaultOptionsRules() {
                    return this.callBase().slice(0).concat(defaultOptionsRules);
                }
            });
        };
    },
    afterEach: function() {
        devices.current(this.originalDevice);
    }
}, () => {
    QUnit.test("set default option for specific component", function(assert) {
        const TestComponent = this.createClass([{
            options: {
                test: "value"
            }
        }]);

        assert.equal(new TestComponent().option("test"), "value", "test option is configured");
    });

    QUnit.test("set default options for specific device platform", function(assert) {
        const TestComponent = this.createClass([{
            device: { platform: "ios" },
            options: {
                test: "value"
            }
        }]);

        devices._currentDevice = { platform: "ios" };
        assert.equal(new TestComponent().option("test"), "value", "test option is configured for ios");

        devices._currentDevice = { platform: "android" };
        assert.notEqual(new TestComponent().option("test"), "value", "test option is not configured for android");
    });

    QUnit.test("set default options for specific device type", function(assert) {
        const TestComponent = this.createClass([{
            device: { deviceType: "phone" },
            options: {
                test: "value"
            }
        }]);

        devices._currentDevice = { deviceType: "tablet" };
        assert.notEqual(new TestComponent().option("test"), "value", "test option is not configured for tablet");

        devices._currentDevice = { deviceType: "phone" };
        assert.equal(new TestComponent().option("test"), "value", "test option is configured for phone");
    });

    QUnit.test("set default options for device filter flags", function(assert) {
        const TestComponent = this.createClass([{
            device: { ios: true, phone: true },
            options: {
                test: "value"
            }
        }]);

        devices.current("iPad");
        assert.notEqual(new TestComponent().option("test"), "value", "test option is not configured for iPad");

        devices.current("iPhone");
        assert.equal(new TestComponent().option("test"), "value", "test option is configured for iPhone");
    });

    QUnit.test("set default options for several devices at once", function(assert) {
        const TestComponent = this.createClass([{
            device: [
                { platform: "android" },
                { platform: "ios" }
            ],
            options: {
                test: "value"
            }
        }]);

        devices._currentDevice = { platform: "android" };
        assert.equal(new TestComponent().option("test"), "value", "test option is configured for android");

        devices._currentDevice = { platform: "ios" };
        assert.equal(new TestComponent().option("test"), "value", "test option is configured for ios");
    });

    QUnit.test("set default options for filtering device with custom function", function(assert) {
        const TestComponent = this.createClass([{
            device(device) {
                return device.platform !== "android";
            },
            options: {
                test: "value"
            }
        }]);

        devices._currentDevice = { platform: "android" };
        assert.notEqual(new TestComponent().option("test"), "value", "test option is not configured for android");

        devices._currentDevice = { platform: "ios" };
        assert.equal(new TestComponent().option("test"), "value", "test option is configured for ios");
    });

    QUnit.test("options configuration inheritance", function(assert) {
        const TestComponent = this.createClass([{
            options: {
                test: "value"
            }
        }]);
        const ChildComponent = TestComponent.inherit();

        assert.equal(new ChildComponent().option("test"), "value", "test option is configured for child component");
    });

    QUnit.test("default options of child overrides default options of parent", function(assert) {
        const TestComponent = this.createClass([{
            options: {
                test: "parent"
            }
        }]);
        const ChildComponent = TestComponent.inherit({
            _defaultOptionsRules() {
                return this.callBase().slice(0).concat([{
                    options: {
                        test: "child"
                    }
                }]);
            }
        });

        assert.equal(new ChildComponent().option("test"), "child", "test option configured with child component defaults");
    });

    QUnit.test("rules priority", function(assert) {
        const TestComponent = this.createClass([{
            options: {
                test: "parent"
            }
        }]);
        const ChildComponent = TestComponent.inherit({
            _defaultOptions() {
                return $.extend(this.callBase(), {
                    test: "default"
                });
            },
            _defaultOptionsRules() {
                return this.callBase().slice(0).concat([{
                    options: {
                        test: "byRule"
                    }
                }]);
            }
        });

        assert.equal(new ChildComponent().option("test"), "byRule", "test option configured with child component defaults");
    });

    QUnit.test("initial option test", function(assert) {
        const TestComponent = Component.inherit({
            _getDefaultOptions() {
                return {
                    test: "parent"
                };
            }
        });
        const ChildComponent = TestComponent.inherit({
            _getDefaultOptions() {
                return $.extend(
                    this.callBase(),
                    {
                        anotherTest: "default",
                        test: "initial"
                    }
                );
            },
            _defaultOptionsRules() {
                return this.callBase().slice(0).concat([{
                    options: {
                        anotherTest: "byRule"
                    }
                }]);
            }
        });

        assert.equal(new ChildComponent().initialOption("test"), "initial", "test initial option configured with component defaults");
        assert.equal(new ChildComponent().initialOption("anotherTest"), "byRule", "test initial option configured with child component defaults rules");
    });

    QUnit.test("Checking current option value with initial option value (option value as function)", function(assert) {
        const TestComponent = Component.inherit({
            _getDefaultOptions() {
                return {
                    test() {
                        return "test1";
                    }
                };
            }
        });

        assert.ok(new TestComponent()._isInitialOptionValue("test"), "current value equal initial value");
        assert.notOk(new TestComponent({
            test() {
                return "test2";
            }
        })._isInitialOptionValue("test"), "current value not equal initial value");
    });

    QUnit.test("Checking current option value with initial option value (option value as object)", function(assert) {
        const TestComponent = Component.inherit({
            _getDefaultOptions() {
                return {
                    test: {
                        prop1: "test1"
                    }
                };
            }
        });

        assert.ok(new TestComponent()._isInitialOptionValue("test"), "current value equal initial value");
        assert.notOk(new TestComponent({
            test: {
                prop1: "test2",
                prop2: "test3"
            }
        })._isInitialOptionValue("test"), "current value not equal initial value");
    });

    QUnit.test("'defaultOptionRules' option", function(assert) {
        const TestComponent = Component.inherit({
            _defaultOptionsRules() {
                return this.callBase().slice(0).concat([{
                    options: {
                        a: 1,
                        b: 2
                    }
                }]);
            }
        });

        const options = new TestComponent({
            defaultOptionsRules: [{
                options: {
                    a: 2,
                    c: 3
                }
            }]
        }).option();

        assert.equal(options.a, 2);
        assert.equal(options.b, 2);
        assert.equal(options.c, 3);
    });

    QUnit.test("reset option", function(assert) {
        const instance = new TestComponent();

        instance.option({
            opt4: "someValue",
            "opt5.subOpt1": "someValue",
            "opt5.subOpt2": {
                value: "someValue",
                opt: "someValue"
            },
            "opt5.subOpt3": "someValue",
            "opt6[0].subOpt": "someValue"
        });

        assert.equal(instance.option("opt4"), "someValue");
        assert.equal(instance.option("opt5.subOpt1"), "someValue");
        assert.deepEqual(instance.option("opt5.subOpt2"), {
            value: "someValue",
            opt: "someValue"
        });
        assert.equal(instance.option("opt5.subOpt3"), "someValue");
        assert.equal(instance.option("opt6[0].subOpt"), "someValue");

        instance.resetOption("opt4");
        instance.resetOption("opt5.subOpt1");
        instance.resetOption("opt5.subOpt2");
        instance.resetOption("opt5.subOpt3");
        instance.resetOption("opt6[0].subOpt");

        assert.equal(instance.option("opt4"), "default");
        assert.equal(instance.option("opt5.subOpt1"), "default");
        assert.deepEqual(instance.option("opt5.subOpt2"), {
            value: ""
        });
        assert.equal(instance.option("opt5.subOpt3"), undefined);
        assert.equal(instance.option("opt6[0].subOpt"), "default");
    });

    QUnit.test("reset option with empty option name", function(assert) {
        const instance = new TestComponent();
        let error = false;

        try {
            instance.resetOption('');
        } catch(e) {
            error = true;
        } finally {
            assert.equal(error, false);
        }
    });

    QUnit.test("reset option after setting initialOption", function(assert) {
        const instance = new TestComponent();

        instance.resetOption("opt5.subOpt2");

        instance.option({
            "opt5.subOpt2": {
                value: "someValue",
                opt: "someValue"
            },
            opt4: "someValue",
        });

        instance.resetOption("opt5.subOpt2");
        instance.resetOption("opt4");

        assert.equal(instance.option("opt4"), "default");
        assert.deepEqual(instance.option("opt5.subOpt2"), {
            value: ""
        });
    });
});

QUnit.module("event API", {
    beforeEach: function() {
        this.component = new Component();
    }
}, () => {
    QUnit.test("on", function(assert) {
        let triggered = false;

        this.component.on("event", () => {
            triggered = true;
        });
        this.component._eventsStrategy.fireEvent("event");

        assert.ok(triggered);
    });

    QUnit.test("hasEvent", function(assert) {
        assert.ok(!this.component._eventsStrategy.hasEvent("event"));
        this.component.on("event", noop);
        assert.ok(this.component._eventsStrategy.hasEvent("event"));
        this.component.off("event", noop);
        assert.ok(!this.component._eventsStrategy.hasEvent("event"));
    });

    QUnit.test("fire context and args", function(assert) {
        assert.expect(2);

        const component = this.component;
        component.on("event", function(e) {
            assert.strictEqual(this, component);
            assert.equal(e, "OK");
        });
        component._eventsStrategy.fireEvent("event", ["OK"]);
    });

    QUnit.test("off", function(assert) {
        const component = this.component;

        let count = 0;
        const h1 = () => {
            count++;
        };
        const h2 = () => {
            count++;
        };

        component.on("event", h1);
        component.on("event", h2);

        component._eventsStrategy.fireEvent("event");
        assert.equal(count, 2);

        component.on("event", h1);
        component.off("event");
        component._eventsStrategy.fireEvent("event");
        assert.equal(count, 2);
    });

    QUnit.test("on with hash", function(assert) {
        const component = this.component;
        let count = 0;
        const h1 = () => {
            count++;
        };
        const h2 = () => {
            count += 2;
        };

        component.on({
            event1: h1,
            event2: h2
        });

        component._eventsStrategy.fireEvent("event1");
        assert.equal(count, 1);

        component._eventsStrategy.fireEvent("event2");
        assert.equal(count, 3);
    });

    QUnit.test("methods are chainable", function(assert) {
        assert.strictEqual(this.component.on(), this.component);
        assert.strictEqual(this.component.off(), this.component);
        assert.strictEqual(this.component._eventsStrategy.fireEvent(), this.component);
    });

    QUnit.test("event callbacks should be disposed on component disposing", function(assert) {
        assert.expect(0);

        this.component.on("event", () => {
            assert.ok(false);
        });
        this.component._dispose();
        this.component._eventsStrategy.fireEvent("event");
    });
});

QUnit.module("action API", {}, () => {
    QUnit.test("_createAction function makes wrong arguments if called w/o config", function(assert) {
        const instance = new TestComponent();

        instance._createAction(e => {
            assert.ok(e);
            assert.ok(!("actionValue" in e));
        })();
    });

    QUnit.test("_createActionByOption should call _suppressDeprecatedWarnings before reading the action option value and then call _resumeDeprecatedWarnings", function(assert) {
        const instance = new TestComponent();
        const deprecatedOption = "deprecatedOption";
        let warningCount = 0;
        const _logDeprecatedWarningMock = option => {
            ++warningCount;
        };

        instance._logDeprecatedWarning = _logDeprecatedWarningMock;
        instance._createActionByOption(deprecatedOption, {});
        assert.strictEqual(warningCount, 0);
        instance.option(deprecatedOption);
        assert.strictEqual(warningCount, 1);
    });

    QUnit.test("action executing should fire event handlers with same arguments and context", function(assert) {
        let actionArguments = null;
        let actionContext = null;
        let eventArguments = null;
        let eventContext = null;

        const instance = new TestComponent({
            onTestEvent(args) {
                actionArguments = args;
                actionContext = this;
            }
        });

        const executeAction = instance._createActionByOption("onTestEvent", { testProp1: "testProp1" });

        instance.on("testEvent", function(args) {
            eventArguments = args;
            eventContext = this;
        });

        executeAction({ testProp2: "testProp2" });

        assert.ok(eventArguments);
        assert.deepEqual(eventArguments, actionArguments);
        assert.strictEqual(eventContext, actionContext);
    });

    QUnit.test("action executing should fire event handlers when not exists option and exists subscriptions", function(assert) {
        let eventArguments = null;
        let eventContext = null;

        const instance = new TestComponent({
            onTestEvent: null
        });

        const executeAction = instance._createActionByOption("onTestEvent", { testProp1: "testProp1" });

        instance.on("testEvent", function(args) {
            eventArguments = args;
            eventContext = this;
        });

        executeAction({ testProp2: "testProp2" });

        assert.deepEqual(eventArguments, { component: instance, testProp2: "testProp2" }, "event arguments");
        assert.strictEqual(eventContext, instance, "event context");
    });

    QUnit.test("_createActionByOption should run 'beforeExecute' before the action handler when event was subscribed with 'on' method", function(assert) {
        let value = "";

        const instance = new TestComponent();

        instance.on("testEvent", () => {
            value = "value from 'onTestEvent'";
        });

        const executeAction = instance._createActionByOption("onTestEvent", {
            beforeExecute() {
                value = "value from 'beforeExecute'";
            }
        });

        executeAction({});

        assert.equal(value, "value from 'onTestEvent'", "action value was not overwritten by the 'beforeExecute' method");
    });

    QUnit.test("_createActionByOption should not override user 'afterExecute' option", function(assert) {
        assert.expect(1);

        const instance = new TestComponent({
            onTestEvent: noop
        });

        const executeAction = instance._createActionByOption("onTestEvent", {
            afterExecute() {
                assert.ok(true);
            }
        });

        executeAction({});
    });

    QUnit.test("action should be wrapped only once (T611040)", function(assert) {
        const originFlag = config().wrapActionsBeforeExecute;
        config({ wrapActionsBeforeExecute: true });

        const instance = new TestComponent({
            onTestEvent: noop
        });
        let count = 0;

        instance.option("beforeActionExecute", (component, action, config) => {
            return (...args) => {
                count++;
                return action.apply(this, args);
            };
        });

        const executeAction = instance._createActionByOption("onTestEvent");

        executeAction();
        executeAction();
        assert.equal(count, 2);

        config({ wrapActionsBeforeExecute: originFlag });
    });
});
