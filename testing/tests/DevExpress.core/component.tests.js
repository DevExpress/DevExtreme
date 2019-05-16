var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    Component = require("core/component"),
    PostponedOperations = require("core/component").PostponedOperations,
    errors = require("core/errors"),
    devices = require("core/devices"),
    config = require("core/config");


var TestComponent = Component.inherit({

    ctor: function(options) {
        this._resetTraceLog();
        this.callBase(options);
    },

    _setOptionsByReference: function() {
        this.callBase();
        $.extend(this._optionsByReference, {
            byReference: true
        });
    },

    _setDeprecatedOptions: function() {
        this.callBase();

        $.extend(this._deprecatedOptions, {
            deprecated: { since: "15.2", alias: "deprecatedAlias" },
            deprecatedOption: { since: "14.1", message: "Use some other option instead" },
            deprecatedOptionWithSugarSyntax: { since: "14.2", alias: "deprecatedOptionAliasWithSugarSyntax" },
            "secondLevel.deprecatedOption": { since: "14.2", alias: "secondLevel.deprecatedOptionAlias" },
            "thirdLevel.option.deprecated": { since: "15.2", alias: "thirdLevel.option.deprecatedAlias" }
        });
    },

    _setOptionAliases: function() {
        this.callBase();

        $.extend(this._getOptionAliases(), {
            checked: "value"
        });
    },

    _setDefaultOptions: function() {
        this.callBase();
        this.option({
            opt1: "default",
            opt2: "default",
            deprecatedOption: "test",
            secondLevel: {
                deprecatedOption: 1
            },
            thirdLevel: {
                option: {
                    deprecatedAlias: "deprecatedValue"
                }
            },
            funcOption: function() {
                return this;
            }
        });
    },

    _optionChanged: function(name, value, prevValue) {
        this._traceLog.push({
            method: "_optionChanged",
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

    instanceChain: function() {
        return this;
    },

    _getTraceLogByMethod: function(methodName) {
        return $.grep(this._traceLog, function(i) { return i.method === methodName; });
    },

    _resetTraceLog: function() {
        this._traceLog = [];
    }
});


QUnit.module("default");

QUnit.test("options api - 'option' method", function(assert) {
    var instance = new TestComponent({ opt2: "custom" });

    instance.option({
        opt1: "mass1",
        opt2: "mass2"
    });

    assert.equal(instance.option("opt1"), "mass1");
    assert.equal(instance.option("opt2"), "mass2");
});

QUnit.test("options api - 'onOptionChanged' action", function(assert) {
    var actionChangeLog = [],
        eventChangeLog = [],
        instance = new TestComponent({
            option1: "value1",
            option2: "value2",
            onOptionChanged: function(args) {
                actionChangeLog.push(args);
            }
        });

    instance.on("optionChanged", function(args) {
        eventChangeLog.push(args);
    });

    instance.option({
        "option1": "new value1",
        "option2": "new value2"
    });

    var expectedLog = [
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
    var called = null,
        instance = new TestComponent({
            option1: "value1",
            onOptionChanged: function(args) {
                called = "old handler";
            }
        });

    instance.option("onOptionChanged", function() {
        called = "new handler";
    });

    instance.option("option1", "value2");

    assert.equal(called, "new handler");
});

QUnit.test("component should initialize PostponedOperations", function(assert) {
    var instance = new TestComponent({ a: 1 });

    assert.ok(instance.postponedOperations instanceof PostponedOperations, "Componend initialize PostponedOperations");
});

QUnit.test("postponed operations should be called on endUpdate", function(assert) {
    var instance = new TestComponent({ a: 1 }),
        callPostponed = sinon.stub(instance.postponedOperations, "callPostponedOperations");

    instance.endUpdate();
    assert.ok(callPostponed.calledOnce, "Postponed operations are called");
});

QUnit.test("postponed operations should be called correctly without promises", function(assert) {
    var instance = new TestComponent({ a: 1 });

    var postponedOperation = function() {
        return {
            done: function() {
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
    var instance = new TestComponent({ a: 1 });
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

    var methodCallStack = $.map(instance._traceLog, function(i) { return i.method; }),
        optionChangedArgs = instance._getTraceLogByMethod("_optionChanged");

    assert.deepEqual(methodCallStack, [
        "beginUpdate",
        "beginUpdate",
        "endUpdate",

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
    var instance = new TestComponent({
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
    var instance = new TestComponent({
        opt1: "firstCall",
        opt2: "firstCall"
    });
    var options = instance.option();

    assert.ok($.isPlainObject(options));
    assert.ok(options["opt1"]);
    assert.ok(options["opt2"]);
});

QUnit.test("complex options", function(assert) {
    var component1 = Component.inherit({
        NAME: "component1",

        _setDefaultOptions: function() {
            this.callBase();

            this.option({
                plain: {
                    a: {
                        b: "b"
                    }
                }
            });
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
    var triggered,
        instance = new (Component.inherit({ NAME: "temp" }))({
            onOptionChanged: function() {
                triggered = true;
            }
        });

    var checkTriggered = function(optionName, value, expectedTriggered) {
        triggered = false;
        instance.option(optionName, value);
        assert.ok(expectedTriggered === triggered);
    };

    var plainObj = {},
        array = [],
        date = new Date();

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

    checkTriggered("func", function() { }, true);
});

QUnit.test("option getter by path gets value", function(assert) {
    var instance = new TestComponent({
        prop: {
            name: "John",
            items: [1, 2, 3]
        }
    });
    assert.equal(instance.option("prop.name"), "John");
    assert.equal(instance.option("prop.items.1"), 2);
});

QUnit.test("option setter by path sets value ", function(assert) {
    var instance = new TestComponent({
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
    var instance = new TestComponent({
        opt3: {
            subOpt: "value"
        }
    });

    assert.ok(!instance._getTraceLogByMethod("_optionChanged").length);

    instance.option("opt3.subOpt", "newValue");
    assert.equal(instance._getTraceLogByMethod("_optionChanged").length, 1);
});

QUnit.test("option by value", function(assert) {
    var value = {
        a: 3,
        b: 4
    };

    var instance = new TestComponent({
        byValue: value
    });
    assert.notStrictEqual(instance.option("byValue"), value, "option initialized by value");

    instance.option("byValue", value);
    assert.notStrictEqual(instance.option("byValue"), value, "option set by value");
});

QUnit.test("option by reference", function(assert) {
    var value = { a: 3, b: 4 },
        instance = new TestComponent({
            byReference: value
        });
    assert.strictEqual(instance.option("byReference"), value, "option initialized by reference");

    instance.option("byReference", value);
    assert.strictEqual(instance.option("byReference"), value, "option set by reference");
});

QUnit.test("'option' method with undefined value", function(assert) {
    var instance = new TestComponent({ optionWithUndefinedValue: undefined });

    assert.strictEqual(instance.option("optionWithUndefinedValue"), undefined);
});

QUnit.test("reading & writing a deprecated option must invoke the _logDeprecatedWarning method and pass the option name as a parameter", function(assert) {
    var instance = new TestComponent(),
        deprecatedOption = "deprecatedOption",
        _logDeprecatedWarningMock = function(option) { assert.strictEqual(option, deprecatedOption); };

    instance._logDeprecatedWarning = _logDeprecatedWarningMock;
    assert.expect(3);
    instance.option(deprecatedOption);
    instance.option(deprecatedOption, true);
    instance.option({ fakeOption: true, deprecatedOption: true });
});

QUnit.test("writing a deprecated option must invoke optionChanged for deprecated option", function(assert) {
    var actionChangeLog = [],
        instance = new TestComponent({
            option1: "value1",
            option2: "value2",
            deprecatedOptionAliasWithSugarSyntax: "test",
            onOptionChanged: function(args) {
                delete args.component;
                actionChangeLog.push(args);
            }
        });

    instance.option("deprecatedOptionWithSugarSyntax", "new test");

    var expectedLog = [
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
    var instance = new TestComponent(),
        warningCount = 0,
        _logDeprecatedWarningMock = function(option) { ++warningCount; };

    instance._logDeprecatedWarning = _logDeprecatedWarningMock;
    instance.option();
    assert.strictEqual(warningCount, 0);
});

QUnit.test("_suppressDeprecatedWarnings should suppress the _logDeprecatedWarning method call", function(assert) {
    var instance = new TestComponent(),
        deprecatedOption = "deprecatedOption";

    instance._suppressDeprecatedWarnings();
    instance.option(deprecatedOption);
    assert.strictEqual(instance._logDeprecatedWarningCount, 0);
});

QUnit.test("_resumeDeprecatedWarnings should restore the _logDeprecatedWarning method calling", function(assert) {
    var instance = new TestComponent(),
        deprecatedOption = "deprecatedOption";

    instance._suppressDeprecatedWarnings();
    instance._resumeDeprecatedWarnings();
    instance.option(deprecatedOption);
    assert.strictEqual(instance._logDeprecatedWarningCount, 1);
});

QUnit.test("component should _suppressDeprecatedWarnings while initializing _defaultOptions in the constructor and _resumeDeprecatedWarnings afterwards", function(assert) {
    var instance = new TestComponent(),
        deprecatedOption = "deprecatedOption";

    assert.strictEqual(instance._logDeprecatedWarningCount, 0);
    instance.option(deprecatedOption);
    assert.strictEqual(instance._logDeprecatedWarningCount, 1);
});

/* QUnit.test("changing an option alias should change the option value", function(assert) {
    var instance = new TestComponent(),
        option = "value",
        alias = "checked";

    instance.option(alias, true);
    assert.strictEqual(instance.option(option), true);
    assert.strictEqual(instance.option(option), instance.option(alias));
    assert.strictEqual(instance.option()[option], instance.option(alias));
});

QUnit.test("reading an option alias should return the option value", function(assert) {
    var instance = new TestComponent(),
        option = "value",
        alias = "checked";

    instance.option(option, true);
    assert.strictEqual(instance.option(alias), true);
    assert.strictEqual(instance.option(alias), instance.option(option));
}); */

QUnit.test("deprecated options api syntactic sugar for options having aliases", function(assert) {
    var originalLog = errors.log,
        log = [];

    errors.log = function() {
        log.push($.makeArray(arguments));
    };

    try {
        var instance = new TestComponent(),
            option = "deprecatedOptionWithSugarSyntax",
            alias = "deprecatedOptionAliasWithSugarSyntax";

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
    var originalLog = errors.log,
        log = [];

    errors.log = function() {
        log.push($.makeArray(arguments));
    };

    try {
        var instance = new TestComponent(),
            option = "secondLevel.deprecatedOption",
            alias = "secondLevel.deprecatedOptionAlias";

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
    var instance = new TestComponent({
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

var createDeprecatedMessageArray = function(version, instanceName, deprecatedOption, aliasName) {
    return [
        "W0001",
        instanceName,
        deprecatedOption,
        version,
        "Use the '" + aliasName + "' option instead"
    ];
};

QUnit.test("T320061 - the third level of nesting option deprecated message on initialize", function(assert) {
    var originalLog = errors.log,
        log = [];

    errors.log = function() {
        log.push($.makeArray(arguments));
    };

    try {
        var optionName = "thirdLevel.option.deprecated",
            aliasName = "thirdLevel.option.deprecatedAlias",
            optionValue = "thirdLevelValue";

        var instance = new TestComponent({
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

        var expectedThirdLevelOptionObject = {
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
    var originalLog = errors.log,
        log = [];

    errors.log = function() {
        log.push($.makeArray(arguments));
    };

    try {
        var optionName = "thirdLevel.option.deprecated",
            aliasName = "thirdLevel.option.deprecatedAlias",
            optionValue = "thirdLevelValue",
            instance = new TestComponent();

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

QUnit.test("T320061 - third level of nesting option deprecated message on option change using string", function(assert) {
    var originalLog = errors.log,
        log = [];

    errors.log = function() {
        log.push($.makeArray(arguments));
    };

    try {
        var optionName = "thirdLevel.option.deprecated",
            aliasName = "thirdLevel.option.deprecatedAlias",
            optionValue = "thirdLevelValue",
            instance = new TestComponent();

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

QUnit.test("option overriding to undefined value (T115847)", function(assert) {
    var inheritor = TestComponent.inherit({
            _setDefaultOptions: function() {
                this.callBase();
                this.option({
                    opt1: undefined
                });
            }
        }),
        inheritorInstance = new inheritor();
    assert.strictEqual(inheritorInstance.option("opt1"), undefined);
});

QUnit.test("'onDisposing' action and event should be fired on component disposing", function(assert) {
    var actionArgs = null,
        eventArgs = null,
        component = new TestComponent({
            onDisposing: function(args) {
                actionArgs = args;
            }
        });

    component.on("disposing", function(args) {
        eventArgs = args;
    });

    component._dispose();

    assert.ok(actionArgs);
    assert.deepEqual(actionArgs, {
        component: component
    });

    assert.ok(eventArgs);
    assert.deepEqual(eventArgs, {
        component: component
    });
});

QUnit.test("'onDisposing' changing", function(assert) {
    var called = null,
        component = new TestComponent({
            onDisposing: function() {
                called = "old handler";
            }
        });

    component.option("onDisposing", function() {
        called = "new handler";
    });

    component._dispose();

    assert.equal(called, "new handler");
});

QUnit.test("'onInitialized' action should be fired on component initialized", function(assert) {
    var actionArgs = null,
        component = new TestComponent({
            onInitialized: function(args) {
                actionArgs = args;
            }
        });

    assert.ok(actionArgs);
    assert.deepEqual(actionArgs, {
        component: component
    });
});

QUnit.test("'onInitialized' action should accept option changing (T313907)", function(assert) {
    var optionChangedCounter = 0;

    new TestComponent({
        onInitialized: function() {
            this.option("a", "new value");
        },
        onOptionChanged: function() {
            optionChangedCounter++;
        }
    });

    assert.equal(optionChangedCounter, 0, "if option change will fired, partial re-render lead to error");
});

QUnit.test("'hasActionSubscription' should be false if component doesn't have subscribe", function(assert) {
    var component = new TestComponent();

    assert.notOk(component.hasActionSubscription("onInitialized"), "component doesn't have onInitialized subscribe");
});

QUnit.test("'hasActionSubscription' should be true if component has subscribe via option", function(assert) {
    var component = new TestComponent({
        onInitialized: function() {}
    });

    assert.ok(component.hasActionSubscription("onInitialized"), "component has onInitialized subscribe");
});

QUnit.test("'hasActionSubscription' should be true if component has subscribe via event", function(assert) {
    var component = new TestComponent();

    component.on("initialized", function() {});

    assert.ok(component.hasActionSubscription("onInitialized"), "component has onInitialized subscribe");
});

QUnit.test("changing value to NaN does not call optionChanged twice", function(assert) {
    var called = 0,
        instance = new TestComponent({
            option1: 0,
            onOptionChanged: function(args) {
                called++;
            }
        });

    instance.option("option1", NaN);
    instance.option("option1", NaN);

    assert.equal(called, 1, "NaN handled once");
});

QUnit.test("DOM Element comparing by reference", function(assert) {
    var called = 0,
        element = document.createElement("div"),
        instance = new TestComponent({
            option1: element,
            onOptionChanged: function(args) {
                called++;
            }
        }),
        newElement = document.createElement("div");

    instance.option("option1", element);
    instance.option("option1", newElement);

    assert.equal(called, 1, "DOM Element compared by reference");
});

QUnit.test("_optionChanging is called before inner _options object is changed", function(assert) {
    var instance = new TestComponent({
        option1: 1
    });
    instance._optionChanging = function(name, currentValue, nextValue) {
        assert.strictEqual(name, "option1", "name");
        assert.strictEqual(currentValue, 1, "current value");
        assert.strictEqual(nextValue, 2, "next value");
        assert.strictEqual(instance.option("option1"), 1, "instance state");
    };

    instance.option("option1", 2);
});

QUnit.test("T359818 - option changed should be called when deprecated option is changed", function(assert) {
    var instance = new TestComponent(),
        value = 5;

    instance._resetTraceLog();
    instance.option("deprecated", value);

    var logRecord = instance._getTraceLogByMethod("_optionChanged");

    assert.equal(logRecord[0].arguments[0].name, "deprecatedAlias", "the 'optionChanged' method option name is correct");
    assert.equal(logRecord[0].arguments[0].value, value, "the 'optionChanged' method option value is correct");

    assert.equal(logRecord[1].arguments[0].name, "deprecated", "the 'optionChanged' method option name is correct");
    assert.equal(logRecord[1].arguments[0].value, value, "the 'optionChanged' method option value is correct");
});

QUnit.test("T359818 - option changed should be called when the second level deprecated option is changed", function(assert) {
    var instance = new TestComponent(),
        value = 5;

    instance._resetTraceLog();
    instance.option("secondLevel.deprecatedOption", value);

    var logRecord = instance._getTraceLogByMethod("_optionChanged");

    assert.equal(logRecord[0].arguments[0].fullName, "secondLevel.deprecatedOptionAlias", "the 'optionChanged' method option name is correct");
    assert.equal(logRecord[0].arguments[0].value, value, "the 'optionChanged' method option value is correct");

    assert.equal(logRecord[1].arguments[0].fullName, "secondLevel.deprecatedOption", "the 'optionChanged' method option name is correct");
    assert.equal(logRecord[1].arguments[0].value, value, "the 'optionChanged' method option value is correct");
});

QUnit.test("T359818 - option changed should be called when deprecated option is changed", function(assert) {
    var instance = new TestComponent(),
        value = 5;

    instance._resetTraceLog();
    instance.option("deprecated", value);

    var logRecord = instance._getTraceLogByMethod("_optionChanged");

    assert.equal(logRecord[0].arguments[0].name, "deprecatedAlias", "the 'optionChanged' method option name is correct");
    assert.equal(logRecord[0].arguments[0].value, value, "the 'optionChanged' method option value is correct");

    assert.equal(logRecord[1].arguments[0].name, "deprecated", "the 'optionChanged' method option name is correct");
    assert.equal(logRecord[1].arguments[0].value, value, "the 'optionChanged' method option value is correct");
});

QUnit.test("T359818 - option changed should be called when the second level deprecated option is changed", function(assert) {
    var instance = new TestComponent(),
        value = 5;

    instance._resetTraceLog();
    instance.option("secondLevel.deprecatedOption", value);

    var logRecord = instance._getTraceLogByMethod("_optionChanged");

    assert.equal(logRecord[0].arguments[0].fullName, "secondLevel.deprecatedOptionAlias", "the 'optionChanged' method option name is correct");
    assert.equal(logRecord[0].arguments[0].value, value, "the 'optionChanged' method option value is correct");

    assert.equal(logRecord[1].arguments[0].fullName, "secondLevel.deprecatedOption", "the 'optionChanged' method option name is correct");
    assert.equal(logRecord[1].arguments[0].value, value, "the 'optionChanged' method option value is correct");
});

QUnit.test("T359818 - deprecated option changed should be called when alias option is changed", function(assert) {
    var instance = new TestComponent(),
        value = 5;

    instance._resetTraceLog();
    instance.option("deprecatedAlias", value);

    var logRecord = instance._getTraceLogByMethod("_optionChanged");

    assert.equal(logRecord[0].arguments[0].name, "deprecatedAlias", "the 'optionChanged' method option name is correct");
    assert.equal(logRecord[0].arguments[0].value, value, "the 'optionChanged' method option value is correct");

    assert.equal(logRecord[1].arguments[0].name, "deprecated", "the 'optionChanged' method option name is correct");
    assert.equal(logRecord[1].arguments[0].value, value, "the 'optionChanged' method option value is correct");
});

QUnit.test("the isOptionDeprecated method", function(assert) {
    var instance = new TestComponent();
    assert.ok(instance.isOptionDeprecated("deprecated"), "it is correct for deprecated option");
    assert.ok(!instance.isOptionDeprecated("opt1"), "it is correct for an ordinary option");
});

QUnit.test("the _getOptionValue method sets the context for function option (T577942)", function(assert) {
    var instance = new TestComponent();
    var context = { contextField: 1 };

    var value = instance._getOptionValue("funcOption", context);
    assert.deepEqual(value, context, "context is correct");
});


QUnit.module("defaultOptions", {
    beforeEach: function() {
        this.originalDevice = devices.current();
        this.createClass = function(defaultOptionsRules) {
            return Component.inherit({
                _defaultOptionsRules: function() {
                    return this.callBase().slice(0).concat(defaultOptionsRules);
                }
            });
        };
    },
    afterEach: function() {
        devices.current(this.originalDevice);
    }
});

QUnit.test("set default option for specific component", function(assert) {
    var TestComponent = this.createClass([{
        options: {
            test: "value"
        }
    }]);

    assert.equal(new TestComponent().option("test"), "value", "test option is configured");
});

QUnit.test("set default options for specific device platform", function(assert) {
    var TestComponent = this.createClass([{
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
    var TestComponent = this.createClass([{
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
    var TestComponent = this.createClass([{
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
    var TestComponent = this.createClass([{
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
    var TestComponent = this.createClass([{
        device: function(device) {
            return device.platform !== "win";
        },
        options: {
            test: "value"
        }
    }]);

    devices._currentDevice = { platform: "win" };
    assert.notEqual(new TestComponent().option("test"), "value", "test option is not configured for win8");

    devices._currentDevice = { platform: "ios" };
    assert.equal(new TestComponent().option("test"), "value", "test option is configured for ios");
});

QUnit.test("options configuration inheritance", function(assert) {
    var TestComponent = this.createClass([{
        options: {
            test: "value"
        }
    }]);
    var ChildComponent = TestComponent.inherit();

    assert.equal(new ChildComponent().option("test"), "value", "test option is configured for child component");
});

QUnit.test("default options of child overrides default options of parent", function(assert) {
    var TestComponent = this.createClass([{
        options: {
            test: "parent"
        }
    }]);
    var ChildComponent = TestComponent.inherit({
        _defaultOptionsRules: function() {
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
    var TestComponent = this.createClass([{
        options: {
            test: "parent"
        }
    }]);
    var ChildComponent = TestComponent.inherit({
        _defaultOptions: function() {
            return $.extend(this.callBase(), {
                test: "default"
            });
        },
        _defaultOptionsRules: function() {
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
    var TestComponent = Component.inherit({
        _setDefaultOptions: function() {
            return {
                test: "parent"
            };
        }
    });
    var ChildComponent = TestComponent.inherit({
        _setDefaultOptions: function() {
            this.callBase();
            this.option({
                anotherTest: "default",
                test: "initial"
            });
        },
        _defaultOptionsRules: function() {
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
    var TestComponent = Component.inherit({
        _getDefaultOptions: function() {
            return {
                test: function() { return "test1"; }
            };
        }
    });

    assert.ok(new TestComponent()._isInitialOptionValue("test"), "current value equal initial value");
    assert.notOk(new TestComponent({ test: function() { return "test2"; } })._isInitialOptionValue("test"), "current value not equal initial value");
});

QUnit.test("Checking current option value with initial option value (option value as object)", function(assert) {
    var TestComponent = Component.inherit({
        _getDefaultOptions: function() {
            return {
                test: {
                    prop1: "test1"
                }
            };
        }
    });

    assert.ok(new TestComponent()._isInitialOptionValue("test"), "current value equal initial value");
    assert.notOk(new TestComponent({ test: { prop1: "test2", prop2: "test3" } })._isInitialOptionValue("test"), "current value not equal initial value");
});

QUnit.test("'defaultOptionRules' option", function(assert) {
    var TestComponent = Component.inherit({
        _defaultOptionsRules: function() {
            return this.callBase().slice(0).concat([{
                options: {
                    a: 1,
                    b: 2
                }
            }]);
        }
    });

    var options = new TestComponent({
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

QUnit.module("event API", {
    beforeEach: function() {
        this.component = new Component();
    }
});

QUnit.test("on", function(assert) {
    var triggered = false;

    this.component.on("event", function() {
        triggered = true;
    });
    this.component.fireEvent("event");

    assert.ok(triggered);
});

QUnit.test("hasEvent", function(assert) {
    assert.ok(!this.component.hasEvent("event"));
    this.component.on("event", noop);
    assert.ok(this.component.hasEvent("event"));
    this.component.off("event", noop);
    assert.ok(!this.component.hasEvent("event"));
});

QUnit.test("fire context and args", function(assert) {
    assert.expect(2);

    var component = this.component;
    component.on("event", function(e) {
        assert.strictEqual(this, component);
        assert.equal(e, "OK");
    });
    component.fireEvent("event", ["OK"]);
});

QUnit.test("off", function(assert) {
    var component = this.component;

    var count = 0;
    var h1 = function() { count++; },
        h2 = function() { count++; };

    component.on("event", h1);
    component.on("event", h2);

    component.fireEvent("event");
    assert.equal(count, 2);

    component.on("event", h1);
    component.off("event");
    component.fireEvent("event");
    assert.equal(count, 2);
});

QUnit.test("on with hash", function(assert) {
    var component = this.component,
        count = 0,
        h1 = function() { count++; },
        h2 = function() { count += 2; };

    component.on({
        event1: h1,
        event2: h2
    });

    component.fireEvent("event1");
    assert.equal(count, 1);

    component.fireEvent("event2");
    assert.equal(count, 3);
});

QUnit.test("methods are chainable", function(assert) {
    assert.strictEqual(this.component.on(), this.component);
    assert.strictEqual(this.component.off(), this.component);
    assert.strictEqual(this.component.fireEvent(), this.component);
});

QUnit.test("event callbacks should be disposed on component disposing", function(assert) {
    assert.expect(0);

    this.component.on("event", function() {
        assert.ok(false);
    });
    this.component._dispose();
    this.component.fireEvent("event");
});

QUnit.module("action API");

QUnit.test("_createAction function makes wrong arguments if called w/o config", function(assert) {
    var instance = new TestComponent();

    instance._createAction(function(e) {
        assert.ok(e);
        assert.ok(!("actionValue" in e));
    })();
});

QUnit.test("_createActionByOption should call _suppressDeprecatedWarnings before reading the action option value and then call _resumeDeprecatedWarnings", function(assert) {
    var instance = new TestComponent(),
        deprecatedOption = "deprecatedOption";
    instance._createActionByOption(deprecatedOption, {});
    assert.strictEqual(instance._logDeprecatedWarningCount, 0);
    instance.option(deprecatedOption);
    assert.strictEqual(instance._logDeprecatedWarningCount, 1);
});

QUnit.test("action executing should fire event handlers with same arguments and context", function(assert) {
    var actionArguments = null,
        actionContext = null,
        eventArguments = null,
        eventContext = null;

    var instance = new TestComponent({
        onTestEvent: function(args) {
            actionArguments = args;
            actionContext = this;
        }
    });

    var executeAction = instance._createActionByOption("onTestEvent", { testProp1: "testProp1" });

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
    var eventArguments = null,
        eventContext = null;

    var instance = new TestComponent({
        onTestEvent: null
    });

    var executeAction = instance._createActionByOption("onTestEvent", { testProp1: "testProp1" });

    instance.on("testEvent", function(args) {
        eventArguments = args;
        eventContext = this;
    });

    executeAction({ testProp2: "testProp2" });

    assert.deepEqual(eventArguments, { component: instance, testProp2: "testProp2" }, "event arguments");
    assert.strictEqual(eventContext, instance, "event context");
});

QUnit.test("_createActionByOption should run 'beforeExecute' before the action handler when event was subscribed with 'on' method", function(assert) {
    var value = "";

    var instance = new TestComponent();

    instance.on("testEvent", function() {
        value = "value from 'onTestEvent'";
    });

    var executeAction = instance._createActionByOption("onTestEvent", {
        beforeExecute: function() {
            value = "value from 'beforeExecute'";
        }
    });

    executeAction({ });

    assert.equal(value, "value from 'onTestEvent'", "action value was not overwritten by the 'beforeExecute' method");
});

QUnit.test("_createActionByOption should not override user 'afterExecute' option", function(assert) {
    assert.expect(1);

    var instance = new TestComponent({
        onTestEvent: noop
    });

    var executeAction = instance._createActionByOption("onTestEvent", {
        afterExecute: function() {
            assert.ok(true);
        }
    });

    executeAction({ });
});

QUnit.test("action should be wrapped only once (T611040)", function(assert) {
    var originFlag = config().wrapActionsBeforeExecute;
    config({ wrapActionsBeforeExecute: true });

    var instance = new TestComponent({
        onTestEvent: noop
    });
    var count = 0;

    instance.option("beforeActionExecute", function(component, action, config) {
        return function() {
            count++;
            return action.apply(this, arguments);
        };
    });

    var executeAction = instance._createActionByOption("onTestEvent");

    executeAction();
    executeAction();
    assert.equal(count, 2);


    config({ wrapActionsBeforeExecute: originFlag });
});
