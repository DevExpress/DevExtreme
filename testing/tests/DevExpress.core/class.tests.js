import Class from 'core/class';

QUnit.module('inheritance');

const A = Class.inherit({
    ctor: function() {
        this.p1 = 'p1';
    },

    m1: function() {
        return 'm1';
    },

    m2: function() {
        return 'a';
    },

    m3: function() {
        return 'a';
    }
});

const B = A.inherit({
    m2: function() {
        return this.callBase() + 'b';
    }
});

const C = B.inherit({
    ctor: function() {
        this.callBase();
        this.p2 = 'p2';
    },

    m2: function() {
        return this.callBase() + 'c';
    },

    m3: function() {
        return this.callBase() + 'c';
    }
});

const a = new A();
const b = new B();
const c = new C();

B.redefine({
    m3: function() {
        return this.callBase() + 'b';
    }
});


QUnit.test('instanceof on ctor-less class', function(assert) {
    const class1 = Class.inherit({});
    const obj1 = new class1();
    assert.ok(obj1 instanceof class1);
});

QUnit.test('instanceof', function(assert) {
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

QUnit.test('constructor property', function(assert) {
    assert.strictEqual(a.constructor, A);
    assert.strictEqual(b.constructor, B);
    assert.strictEqual(c.constructor, C);
});

QUnit.test('parent property', function(assert) {
    assert.strictEqual(A.parent, Class);
    assert.strictEqual(B.parent, A);
    assert.strictEqual(C.parent, B);
});

QUnit.test('method inheritance', function(assert) {
    assert.strictEqual(a.m1(), 'm1');
    assert.strictEqual(b.m1(), 'm1');
    assert.strictEqual(c.m1(), 'm1');
});

QUnit.test('property inheritance', function(assert) {
    assert.strictEqual(a.p1, 'p1');
    assert.strictEqual(b.p1, 'p1');
    assert.strictEqual(c.p1, 'p1');
});

QUnit.test('overridden method', function(assert) {
    assert.strictEqual(a.m2(), 'a');
    assert.strictEqual(b.m2(), 'ab');
    assert.strictEqual(c.m2(), 'abc');
});

QUnit.test('overridden ctor', function(assert) {
    assert.strictEqual(c.p2, 'p2');
});

QUnit.test('redefine', function(assert) {
    assert.strictEqual(a.m3(), 'a');
    assert.strictEqual(b.m3(), 'ab');
    assert.strictEqual(c.m3(), 'abc');
});

QUnit.test('no redefine in root Class', function(assert) {
    assert.ok(!Class.redefine);
});

QUnit.test('check for \'new\'', function(assert) {
    const check = function(action) {
        let error;
        try {
            action();
        } catch(caught) {
            error = caught;
        }
        assert.ok(error && error.message.indexOf('\'new\'') > -1);
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


QUnit.module('mixins');

QUnit.test('no include in root Class', function(assert) {
    const child = Class.inherit({});
    assert.ok(!Class.include);
    assert.ok(!!child.include);
});

QUnit.test('two includes with ctor', function(assert) {

    const Sortable = {

        ctor: function() {
            this.sortable = true;
        },

        sort: function() {
            return 'sorted';
        }

    };

    const Draggable = {

        ctor: function() {
            this.draggable = true;
        },

        drag: function() {
            return 'drop me pls';
        }

    };


    const myClass = Class.inherit({

        ctor: function() {
            this.isMyClass = true;
        },

        myClassMethod: function() {
            return 'myClassMethod';
        }

    });

    myClass.include(Sortable, Draggable);

    const obj = new myClass();

    assert.ok(obj instanceof myClass);
    assert.ok(obj.isMyClass);
    assert.ok(obj.draggable);
    assert.ok(obj.sortable);
    assert.equal(obj.sort(), 'sorted');
    assert.equal(obj.drag(), 'drop me pls');
});

QUnit.test('two dependent includes with ctor', function(assert) {

    const Sortable = {

        ctor: function() {
            this.sortable = true;
        },

        postCtor: function() {
            this.mixinDragged = this.drag();
        },

        sort: function() {
            return 'sorted';
        }

    };

    const Draggable = {

        ctor: function() {
            this.draggable = true;
        },

        postCtor: function() {
            this.mixinSorted = this.sort();
        },

        drag: function() {
            return 'drop me pls';
        }

    };


    const myClass = Class.inherit({

        ctor: function() {
            this.isMyClass = true;
            assert.ok(this.draggable);
            assert.ok(this.sortable);
            this.sorted = this.sort();
            this.dragged = this.drag();
        },

        myClassMethod: function() {
            return 'myClassMethod';
        }

    });

    myClass.include(Sortable, Draggable);

    const obj = new myClass();

    assert.ok(obj instanceof myClass);
    assert.ok(obj.isMyClass);
    assert.ok(obj.draggable);
    assert.ok(obj.sortable);
    assert.equal(obj.sort(), 'sorted');
    assert.equal(obj.sorted, 'sorted');
    assert.equal(obj.mixinSorted, 'sorted');
    assert.equal(obj.drag(), 'drop me pls');
    assert.equal(obj.dragged, 'drop me pls');
    assert.equal(obj.mixinDragged, 'drop me pls');
});

QUnit.test('method name collision', function(assert) {
    const myClass = Class.inherit({
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

QUnit.test('mixins are reusable (regression)', function(assert) {
    const mixin = {
        ctor: function() {
            this.mixed = true;
        }
    };

    const class1 = Class.inherit({}).include(mixin);
    const class2 = Class.inherit({}).include(mixin);

    const obj1 = new class1();
    const obj2 = new class2();

    assert.ok(obj1.mixed);
    assert.ok(obj2.mixed);
});

QUnit.test('ctor of mixin included to parent class is invoked for descendants', function(assert) {
    const Mixin = {
        ctor: function() {
            this.mixed = true;
        }
    };

    const Parent = Class.inherit({}).include(Mixin);
    const Child = Parent.inherit({});

    const o = new Child();
    assert.ok(o.mixed);
});


QUnit.module('Static');

QUnit.test('static methods should be inherited', function(assert) {
    const A = Class.inherit({
        callFoo: function() {
            return this.constructor.foo();
        }
    });
    A.foo = function() { return 'foo'; };
    const B = A.inherit({});
    const C = B.inherit({});
    C.foo = function() { return A.foo() + 'bar'; };

    assert.equal(A.foo(), 'foo');
    assert.equal(B.foo(), 'foo');
    assert.equal(C.foo(), 'foobar');

    assert.equal((new A()).callFoo(), 'foo');
    assert.equal((new B()).callFoo(), 'foo');
    assert.equal((new C()).callFoo(), 'foobar');
});


QUnit.module('API');


QUnit.test('subclassOf method for es6 inheritors', function(assert) {
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

QUnit.test('subclassOf method', function(assert) {
    const A = Class.inherit({ });
    const B = A.inherit({ });
    const C = Class.inherit({ });

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


QUnit.module('regressions');

QUnit.test('callBase regression', function(assert) {
    const log = [];

    const Parent = Class.inherit({
        ctor: function() {
            log.push('Parent.ctor');
            this.method();
        },

        method: function() {
            log.push('Parent.method');
            this.subMethod();
        },

        subMethod: function() {
            log.push('Parent.subMethod');
        }
    });

    const Child = Parent.inherit({
        method: function() {
            log.push('Child.method');
            this.subMethod();
            this.callBase();
        },

        subMethod: function() {
            log.push('Child.subMethod');
            this.callBase();
        }
    });

    new Child();

    assert.deepEqual(log, [
        'Parent.ctor',
        'Child.method',
        'Child.subMethod',
        'Parent.subMethod',
        'Parent.method',
        'Child.subMethod',
        'Parent.subMethod'
    ]);
});

QUnit.test('TypeScript inheritance', function(assert) {
    const __extends = function(d, b) {
        for(const p in b) if(Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        function __() { this.constructor = d; }
        __.prototype = b.prototype;
        d.prototype = new __();
    };

    const Base = Class.inherit({});

    const Child = (function(_super) {
        __extends(Child, _super);
        function Child() {
            _super.apply(this, arguments);
        }
        return Child;
    })(Base);

    assert.expect(0);
    new Child();
});

QUnit.test('Abstract method causes readable exception', function(assert) {
    assert.throws(
        function() {
            Class.abstract();
        },
        function(e) {
            return /E0001/.test(e.message);
        },
        'Exception messages should be readable'
    );
    assert.throws(
        function() {
            Class.inherit({}).abstract();
        },
        function(e) {
            return /E0001/.test(e.message);
        },
        'Exception messages should be readable in subclass'
    );
});
