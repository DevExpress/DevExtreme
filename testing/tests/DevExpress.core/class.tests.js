import Class from 'core/class';

QUnit.module("inheritance");

var A = Class.inherit({
    ctor: function() {
        this.p1 = "p1";
    },

    m1: function() {
        return "m1";
    },

    m2: function() {
        return "a";
    },

    m3: function() {
        return "a";
    }
});

var B = A.inherit({
    m2: function() {
        return this.callBase() + "b";
    }
});

var C = B.inherit({
    ctor: function() {
        this.callBase();
        this.p2 = "p2";
    },

    m2: function() {
        return this.callBase() + "c";
    },

    m3: function() {
        return this.callBase() + "c";
    }
});

var a = new A();
var b = new B();
var c = new C();

B.redefine({
    m3: function() {
        return this.callBase() + "b";
    }
});


QUnit.test("instanceof on ctor-less class", function(assert) {
    var class1 = Class.inherit({});
    var obj1 = new class1();
    assert.ok(obj1 instanceof class1);
});

QUnit.test("instanceof", function(assert) {
    assert.ok(a instanceof Class);
    assert.ok(a instanceof A);
    assert.ok(!(a instanceof B));
    assert.ok(!(a instanceof C));

    assert.ok(b instanceof Class);
    assert.ok(b instanceof A);
    assert.ok(b instanceof B);
    assert.ok(!(b instanceof C));

    assert.ok(c instanceof Class);
    assert.ok(c instanceof A);
    assert.ok(c instanceof B);
    assert.ok(c instanceof C);
});

QUnit.test("constructor property", function(assert) {
    assert.ok(a.constructor === A);
    assert.ok(b.constructor === B);
    assert.ok(c.constructor === C);
});

QUnit.test("parent property", function(assert) {
    assert.ok(A.parent === Class);
    assert.ok(B.parent === A);
    assert.ok(C.parent === B);
});

QUnit.test("method inheritance", function(assert) {
    assert.ok("m1" === a.m1());
    assert.ok("m1" === b.m1());
    assert.ok("m1" === c.m1());
});

QUnit.test("property inheritance", function(assert) {
    assert.ok("p1" === a.p1);
    assert.ok("p1" === b.p1);
    assert.ok("p1" === c.p1);
});

QUnit.test("overridden method", function(assert) {
    assert.ok("a" === a.m2());
    assert.ok("ab" === b.m2());
    assert.ok("abc" === c.m2());
});

QUnit.test("overridden ctor", function(assert) {
    assert.ok("p2" === c.p2);
});

QUnit.test("redefine", function(assert) {
    assert.ok("a" === a.m3());
    assert.ok("ab" === b.m3());
    assert.ok("abc" === c.m3());
});

QUnit.test("no redefine in root Class", function(assert) {
    assert.ok(!Class.redefine);
});

QUnit.test("check for 'new'", function(assert) {
    var check = function(action) {
        var error;
        try {
            action();
        } catch(caught) {
            error = caught;
        }
        assert.ok(error && error.message.indexOf("'new'") > -1);
    };

    check(function() {
        A();
    });

    // Conflict with TypeScript inheritance
    // check(function() {
    //    A.call({});
    // });

    // check(function() {
    //    var container = {
    //        A: A
    //    };
    //    container.A();
    // });
});


QUnit.module("mixins");

QUnit.test("no include in root Class", function(assert) {
    var child = Class.inherit({});
    assert.ok(!Class.include);
    assert.ok(!!child.include);
});

QUnit.test("two includes with ctor", function(assert) {

    var Sortable = {

        ctor: function() {
            this.sortable = true;
        },

        sort: function() {
            return "sorted";
        }

    };

    var Draggable = {

        ctor: function() {
            this.draggable = true;
        },

        drag: function() {
            return "drop me pls";
        }

    };


    var myClass = Class.inherit({

        ctor: function() {
            this.isMyClass = true;
        },

        myClassMethod: function() {
            return "myClassMethod";
        }

    });

    myClass.include(Sortable, Draggable);

    var obj = new myClass();

    assert.ok(obj instanceof myClass);
    assert.ok(obj.isMyClass);
    assert.ok(obj.draggable);
    assert.ok(obj.sortable);
    assert.equal(obj.sort(), "sorted");
    assert.equal(obj.drag(), "drop me pls");
});

QUnit.test("two dependent includes with ctor", function(assert) {

    var Sortable = {

        ctor: function() {
            this.sortable = true;
        },

        postCtor: function() {
            this.mixinDragged = this.drag();
        },

        sort: function() {
            return "sorted";
        }

    };

    var Draggable = {

        ctor: function() {
            this.draggable = true;
        },

        postCtor: function() {
            this.mixinSorted = this.sort();
        },

        drag: function() {
            return "drop me pls";
        }

    };


    var myClass = Class.inherit({

        ctor: function() {
            this.isMyClass = true;
            assert.ok(this.draggable);
            assert.ok(this.sortable);
            this.sorted = this.sort();
            this.dragged = this.drag();
        },

        myClassMethod: function() {
            return "myClassMethod";
        }

    });

    myClass.include(Sortable, Draggable);

    var obj = new myClass();

    assert.ok(obj instanceof myClass);
    assert.ok(obj.isMyClass);
    assert.ok(obj.draggable);
    assert.ok(obj.sortable);
    assert.equal(obj.sort(), "sorted");
    assert.equal(obj.sorted, "sorted");
    assert.equal(obj.mixinSorted, "sorted");
    assert.equal(obj.drag(), "drop me pls");
    assert.equal(obj.dragged, "drop me pls");
    assert.equal(obj.mixinDragged, "drop me pls");
});

QUnit.test("method name collision", function(assert) {
    var myClass = Class.inherit({
        m: function() { }
    });

    assert.throws(function() {
        myClass.include({
            m: function() { }
        });
    });

    assert.throws(function() {
        myClass.include({
            x: function() { }
        });
        myClass.include({
            x: function() { }
        });
    });
});

QUnit.test("mixins are reusable (regression)", function(assert) {
    var mixin = {
        ctor: function() {
            this.mixed = true;
        }
    };

    var class1 = Class.inherit({}).include(mixin),
        class2 = Class.inherit({}).include(mixin);

    var obj1 = new class1(),
        obj2 = new class2();

    assert.ok(obj1.mixed);
    assert.ok(obj2.mixed);
});

QUnit.test("ctor of mixin included to parent class is invoked for descendants", function(assert) {
    var Mixin = {
        ctor: function() {
            this.mixed = true;
        }
    };

    var Parent = Class.inherit({}).include(Mixin),
        Child = Parent.inherit({});

    var o = new Child();
    assert.ok(o.mixed);
});


QUnit.module("Static");

QUnit.test("static methods should be inherited", function(assert) {
    var A = Class.inherit({
        callFoo: function() {
            return this.constructor.foo();
        }
    });
    A.foo = function() { return "foo"; };
    var B = A.inherit({});
    var C = B.inherit({});
    C.foo = function() { return A.foo() + "bar"; };

    assert.equal(A.foo(), "foo");
    assert.equal(B.foo(), "foo");
    assert.equal(C.foo(), "foobar");

    assert.equal((new A()).callFoo(), "foo");
    assert.equal((new B()).callFoo(), "foo");
    assert.equal((new C()).callFoo(), "foobar");
});


QUnit.module("API");


QUnit.test('subclassOf method for es6 inheritors', assert => {
    const Base = Class.inherit({});

    class ES6Inheritor extends Base {}
    class ES6InheritorInheritor extends ES6Inheritor {}

    assert.ok(ES6Inheritor.subclassOf(Class));
    assert.ok(ES6Inheritor.subclassOf(Base));
    assert.notOk(ES6Inheritor.subclassOf(ES6Inheritor));
    assert.ok(ES6InheritorInheritor.subclassOf(Class));
    assert.ok(ES6InheritorInheritor.subclassOf(Base));
    assert.ok(ES6InheritorInheritor.subclassOf(ES6Inheritor));
    assert.notOk(ES6InheritorInheritor.subclassOf(ES6InheritorInheritor));
});

QUnit.test("subclassOf method", function(assert) {
    var A = Class.inherit({ }),
        B = A.inherit({ }),
        C = Class.inherit({ });

    assert.ok(!Class.subclassOf);
    assert.ok(A.subclassOf);
    assert.ok(B.subclassOf);
    assert.ok(C.subclassOf);

    assert.ok(!A.subclassOf(A));
    assert.ok(A.subclassOf(Class));

    assert.ok(!B.subclassOf(B));
    assert.ok(B.subclassOf(Class));
    assert.ok(B.subclassOf(A));

    assert.ok(!C.subclassOf(C));
    assert.ok(C.subclassOf(Class));

    assert.ok(!A.subclassOf(B));
    assert.ok(!A.subclassOf(C));

    assert.ok(!C.subclassOf(B));
    assert.ok(!C.subclassOf(A));

    assert.ok(!B.subclassOf(C));
});


QUnit.module("regressions");

QUnit.test("callBase regression", function(assert) {
    var log = [];

    var Parent = Class.inherit({
        ctor: function() {
            log.push("Parent.ctor");
            this.method();
        },

        method: function() {
            log.push("Parent.method");
            this.subMethod();
        },

        subMethod: function() {
            log.push("Parent.subMethod");
        }
    });

    var Child = Parent.inherit({
        method: function() {
            log.push("Child.method");
            this.subMethod();
            this.callBase();
        },

        subMethod: function() {
            log.push("Child.subMethod");
            this.callBase();
        }
    });

    new Child();

    assert.deepEqual(log, [
        "Parent.ctor",
        "Child.method",
        "Child.subMethod",
        "Parent.subMethod",
        "Parent.method",
        "Child.subMethod",
        "Parent.subMethod"
    ]);
});

QUnit.test("TypeScript inheritance", function(assert) {
    var __extends = function(d, b) {
        for(var p in b) if(Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        function __() { this.constructor = d; }
        __.prototype = b.prototype;
        d.prototype = new __();
    };

    var Base = Class.inherit({});

    var Child = (function(_super) {
        __extends(Child, _super);
        function Child() {
            _super.apply(this, arguments);
        }
        return Child;
    })(Base);

    assert.expect(0);
    new Child();
});

QUnit.test("Abstract method causes readable exception", function(assert) {
    assert.throws(
        function() {
            Class.abstract();
        },
        function(e) {
            return /E0001/.test(e.message);
        },
        "Exception messages should be readable"
    );
    assert.throws(
        function() {
            Class.inherit({}).abstract();
        },
        function(e) {
            return /E0001/.test(e.message);
        },
        "Exception messages should be readable in subclass"
    );
});
