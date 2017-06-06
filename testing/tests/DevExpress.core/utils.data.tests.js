"use strict";

var GETTER = require("core/utils/data").compileGetter,
    SETTER = require("core/utils/data").compileSetter,
    variableWrapper = require("core/utils/variable_wrapper");

var mockVariableWrapper = {
    isWrapped: function(value) {
        return value && value.isWrapped;
    },
    wrap: function(variable) {
        var result = function(value) {
            if(value) {
                variable = value;
            }
            return variable;
        };

        result.isWrapped = true;

        return result;
    },
    unwrap: function(value) {
        if(this.isWrapped(value)) {
            return value();
        }
        return this.callBase(value);
    },
    assign: function(variable, value) {
        if(this.isWrapped(variable)) {
            return variable(value);
        }
        return this.callBase(variable, value);
    }
};

QUnit.module("getter");

QUnit.test("it works", function(assert) {
    var obj = {
        a: "a",
        b: function() { return "b()"; },
        c: {
            a: {
                a: "c.a.a"
            }
        },
        d: function() {
            return { a: "d().a" };
        },
        e: null
    };
    assert.equal(GETTER()(obj), obj);
    assert.equal(GETTER("this")(obj), obj);
    assert.equal(GETTER("a")(obj), "a");
    assert.equal(GETTER("b")(obj), "b()");
    assert.equal(GETTER("c.a.a")(obj), "c.a.a");
    assert.equal(GETTER("d.a")(obj), "d().a");
    assert.equal(GETTER("e.z")(obj), undefined);
    assert.equal(GETTER("z.z.z")(obj), undefined);
    assert.equal(GETTER("c.a.a")(obj), "c.a.a");
});


QUnit.test("complex getter", function(assert) {
    var original = {
        a: {
            a1: "a1",
            a2: "a2"
        },
        b: "b",
        c: "c"
    };

    var expectation = {
        a: {
            a1: "a1"
        },
        c: "c"
    };

    assert.deepEqual(GETTER("a.a1", "c")(original), expectation);
    assert.deepEqual(GETTER(["a.a1", "c"])(original), expectation);
    assert.deepEqual(GETTER([])(original), undefined);
});


QUnit.test("functionsAsIs option", function(assert) {
    var obj = {
        b: function() {
            return "value";
        },
        b2: function() {
            return "value2";
        }
    };

    assert.equal(GETTER("b")(obj, { functionsAsIs: true }), obj.b);
    assert.deepEqual(GETTER("b", "b2")(obj, { functionsAsIs: true }), { b: obj.b, b2: obj.b2 });
});

QUnit.test("square brackets in expr", function(assert) {
    var obj = {
        prop: {
            items: ["first", "second", "third"]
        }
    };

    assert.equal(GETTER("prop.items[1]")(obj), "second");
    assert.equal(GETTER("prop[items][1]")(obj), "second");
});


QUnit.test("empty results are the same", function(assert) {
    var monoGetter = GETTER("field1");
    var polyGetter = GETTER("field1", "field2");

    var emptyResultOfMonoGetter = monoGetter({});
    var emptyResultOfPolyGetter = polyGetter({});

    assert.strictEqual(emptyResultOfMonoGetter, undefined);
    assert.strictEqual(emptyResultOfPolyGetter, undefined);
});

QUnit.module("getter with wrapped variables", {
    beforeEach: function() {
        variableWrapper.inject(mockVariableWrapper);
    },
    afterEach: function() {
        variableWrapper.resetInjection();
    }
});

QUnit.test("wrap support", function(assert) {
    var mockWrapper = variableWrapper.wrap,
        obj = mockWrapper({
            prop: mockWrapper({
                subProp: mockWrapper(3)
            })
        });

    var getter = GETTER("prop.subProp");
    assert.equal(getter(obj, { functionsAsIs: true }), 3);
});

QUnit.test("not unwrapped when unwrapObservables = false", function(assert) {
    var mockWrapper = variableWrapper.wrap,
        obj = {
            prop: {
                subProp: mockWrapper(3)
            }
        };

    var getter = GETTER("prop.subProp");
    assert.ok(variableWrapper.isWrapped(getter(obj, { functionsAsIs: true, unwrapObservables: false })));
});

QUnit.module("setter");

QUnit.test("single-level prop", function(assert) {
    var obj = {
        name: "Alex"
    };

    SETTER("name")(obj, "Vadim");
    assert.equal(obj.name, "Vadim");

    SETTER("age")(obj, 18);
    assert.equal(obj.age, 18);
});

QUnit.test("single-level func", function(assert) {
    var date = new Date(2012, 7, 31);

    SETTER("setMonth")(date, 0);
    assert.equal(date.getMonth(), 0);
});

QUnit.test("complex values are replaced (default mode)", function(assert) {
    var obj = {
        person: {
            firstName: "John"
        }
    };

    SETTER("person")(obj, {
        lastName: "Doe"
    });

    assert.deepEqual(obj, {
        person: {
            lastName: "Doe"
        }
    });
});

QUnit.test("complex values are merged (merge option)", function(assert) {
    var obj = {
        person: {
            name: {
                first: "John"
            }
        }
    };

    SETTER("person")(
        obj,
        {
            name: {
                last: "Doe"
            },
            year: 1970
        },
        { merge: true }
    );

    assert.deepEqual(obj, {
        person: {
            name: {
                first: "John",
                last: "Doe"
            },
            year: 1970
        }
    });
});

QUnit.test("multi-level expression", function(assert) {
    var obj = {
        person: {
            firstName: "John"
        }
    };

    SETTER("person.firstName")(obj, "Alex");
    assert.equal(obj.person.firstName, "Alex");

});

QUnit.test("multi-level expression with functions", function(assert) {
    var person = {
        _firstName: "John",
        setFirstName: function(value) {
            this._firstName = value;
        }
    };

    var obj = {
        _person: person,
        getPerson: function(value) {
            return this._person;
        }
    };

    SETTER("getPerson.setFirstName")(obj, "Alex");
    assert.equal(obj._person._firstName, "Alex");
});

QUnit.test("attempt to assign scalar to self", function(assert) {
    assert.throws(function() {
        SETTER()("personName", "Alex");
    });
    assert.throws(function() {
        SETTER("this")("personName", "Alex");
    });
});

QUnit.test("able to assign to self with merge", function(assert) {
    var target = { a: 1 };
    SETTER("this")(target, { b: 2 }, { merge: true });
    assert.deepEqual(target, { a: 1, b: 2 });
});

QUnit.test("setting a function (should use functionsAsIs)", function(assert) {
    var func1 = function() { },
        func2 = function() { };

    var obj = {
        f: func1
    };

    SETTER("f")(obj, func2, { functionsAsIs: true });
    assert.strictEqual(obj.f, func2);

    SETTER("g")(obj, func1);
    assert.strictEqual(obj.g, func1, { functionsAsIs: true });
});

QUnit.test("square brackets in expr", function(assert) {
    var obj = {
        prop: {
            items: ["first", "second", "third"]
        }
    };

    SETTER("prop.items[1]")(obj, "4");
    assert.equal(obj.prop.items[1], "4");

    SETTER("prop[items][0]")(obj, "zero");
    assert.equal(obj.prop.items[0], "zero");
});

QUnit.test("merging sub-object to non-existent property", function(assert) {
    var obj = {
    };

    SETTER("sub")(obj, { a: 1 }, { merge: true });
    assert.deepEqual(obj, {
        sub: { a: 1 }
    });
});

QUnit.test("prevent jQuery deep array extending (B239679)", function(assert) {
    var obj = {
        sub: {
            array: [1, 2, 3]
        }
    };

    var setter = SETTER("sub");
    setter(obj, { array: [9] }, { merge: true });

    assert.deepEqual(obj.sub.array, [9]);
});

QUnit.test("complex values are merged only when it is plain object", function(assert) {
    var SomeClass = function(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    };

    var obj1 = {
        sub: {
            person: new SomeClass("John", "Smith")
        }
    };

    var obj2 = {
        person: {
            firstName: "Doe"
        }
    };

    SETTER("sub")(
        obj1,
        obj2,
        { merge: true }
    );

    assert.equal(obj1.sub.person.firstName, "Doe");
    assert.equal(obj1.sub.person.lastName, undefined);
});

QUnit.test("plain objects are cloned if previous value is null (T521407)", function(assert) {
    var obj = {
        dataSource: null
    };

    var dataSource1 = {
        store: "Store 1"
    };

    var dataSource2 = {
        store: "Store 2"
    };

    SETTER("dataSource")(
        obj,
        dataSource1,
        { merge: true }
    );

    SETTER("dataSource")(
        obj,
        dataSource2,
        { merge: true }
    );

    assert.equal(dataSource1.store, "Store 1");
});

QUnit.module("setter with wrapped variables", {
    beforeEach: function() {
        variableWrapper.inject(mockVariableWrapper);
    },
    afterEach: function() {
        variableWrapper.resetInjection();
    }
});

QUnit.test("wrap support", function(assert) {
    var mockWrapper = variableWrapper.wrap,
        obj = mockWrapper({
            prop: mockWrapper({
                subProp: mockWrapper(3)
            })
        });

    var setter = SETTER("prop.subProp");
    setter(obj, 5, { functionsAsIs: true });

    assert.equal(obj().prop().subProp(), 5);
});

QUnit.test("not unwrapped when unwrapObservables = false", function(assert) {
    var mockWrapper = variableWrapper.wrap,
        obj = {
            prop: {
                subProp: mockWrapper(3)
            }
        };

    var setter = SETTER("prop.subProp");
    setter(obj, 5, { functionsAsIs: true, unwrapObservables: false });

    assert.equal(obj.prop.subProp, 5);
});

QUnit.test("wrap with merge and functions unwrapping", function(assert) {
    var mockWrapper = variableWrapper.wrap,
        obj = {
            prop: mockWrapper({ a: 1 })
        };

    var setter = SETTER("prop");
    setter(obj, { b: 2 }, { functionsAsIs: false, merge: true });

    assert.deepEqual(obj.prop(), { a: 1, b: 2 });
});
