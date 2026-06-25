import {
    compileGetter as GETTER,
    compileSetter as SETTER
} from 'core/utils/data';
import errors from 'core/errors';
import variableWrapper from 'core/utils/variable_wrapper';

const mockVariableWrapper = {
    isWrapped: (value) => {
        return value && value.isWrapped;
    },
    wrap: (variable) => {
        const result = (value) => {
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

const { test } = QUnit;

QUnit.module('getter', () => {
    test('it works', function(assert) {
        const obj = {
            a: 'a',
            b: () => { return 'b()'; },
            c: {
                a: {
                    a: 'c.a.a'
                }
            },
            d: () => {
                return { a: 'd().a' };
            },
            e: null
        };
        assert.equal(GETTER()(obj), obj);
        assert.equal(GETTER('this')(obj), obj);
        assert.equal(GETTER('a')(obj), 'a');
        assert.equal(GETTER('b')(obj), 'b()');
        assert.equal(GETTER('c.a.a')(obj), 'c.a.a');
        assert.equal(GETTER('d.a')(obj), 'd().a');
        assert.equal(GETTER('e.z')(obj), undefined);
        assert.equal(GETTER('z.z.z')(obj), undefined);
        assert.equal(GETTER('c.a.a')(obj), 'c.a.a');
    });

    test('defaultValue', function(assert) {
        const obj = {
            zero: 0,
            emptyString: '',
            innerObj: {}
        };

        const DEFAULT_VALUE = 'TEST_DEFAULT_VALUE';

        assert.equal(GETTER('any')(undefined, { defaultValue: DEFAULT_VALUE }), DEFAULT_VALUE);
        assert.equal(GETTER('any')(null, { defaultValue: DEFAULT_VALUE }), DEFAULT_VALUE);

        assert.equal(GETTER('missing')(obj, { defaultValue: DEFAULT_VALUE }), DEFAULT_VALUE);
        assert.equal(GETTER('innerObj.missing')(obj, { defaultValue: DEFAULT_VALUE }), DEFAULT_VALUE);

        assert.equal(GETTER('zero')(obj, { defaultValue: DEFAULT_VALUE }), 0);
        assert.equal(GETTER('emptyString.length')(obj, { defaultValue: DEFAULT_VALUE }), 0);

        assert.deepEqual(GETTER('phantom.missing')({}, { defaultValue: { phantom: {} } }), { phantom: {} });

        class Parent { }
        class Child extends Parent { }
        Parent.prototype['parentProp'] = 123;

        assert.equal(GETTER('missing')(new function() {}, { defaultValue: DEFAULT_VALUE }), DEFAULT_VALUE);
        assert.equal(GETTER('parentProp')(new Child, { defaultValue: DEFAULT_VALUE }), 123);
        assert.equal(GETTER('missing')(new Child, { defaultValue: DEFAULT_VALUE }), DEFAULT_VALUE);
    });

    test('complex getter', function(assert) {
        const original = {
            a: {
                a1: 'a1',
                a2: 'a2'
            },
            b: 'b',
            c: 'c'
        };

        const expectation = {
            a: {
                a1: 'a1'
            },
            c: 'c'
        };

        assert.deepEqual(GETTER('a.a1', 'c')(original), expectation);
        assert.deepEqual(GETTER(['a.a1', 'c'])(original), expectation);
        assert.deepEqual(GETTER([])(original), undefined);
    });

    test('functionsAsIs option', function(assert) {
        const obj = {
            b: () => {
                return 'value';
            },
            b2: () => {
                return 'value2';
            }
        };

        assert.equal(GETTER('b')(obj, { functionsAsIs: true }), obj.b);
        assert.deepEqual(GETTER('b', 'b2')(obj, { functionsAsIs: true }), { b: obj.b, b2: obj.b2 });
    });

    test('square brackets in expr', function(assert) {
        const obj = {
            prop: {
                items: ['first', 'second', 'third']
            }
        };

        assert.equal(GETTER('prop.items[1]')(obj), 'second');
        assert.equal(GETTER('prop[items][1]')(obj), 'second');
    });

    test('empty results are the same', function(assert) {
        const monoGetter = GETTER('field1');
        const polyGetter = GETTER('field1', 'field2');

        const emptyResultOfMonoGetter = monoGetter({});
        const emptyResultOfPolyGetter = polyGetter({});

        assert.strictEqual(emptyResultOfMonoGetter, undefined);
        assert.strictEqual(emptyResultOfPolyGetter, undefined);
    });

    test('Issue #8552', function(assert) {
        // https://github.com/DevExpress/DevExtreme/issues/8552
        const getter = GETTER([ 'B.Id', 'B.Key' ]);
        const obj = { B: { Id: 'Id', Key: 'Key' } };
        assert.deepEqual(getter(obj), obj);
    });
});


QUnit.module('getter with wrapped variables', {
    beforeEach: function() {
        variableWrapper.inject(mockVariableWrapper);
    },
    afterEach: function() {
        variableWrapper.resetInjection();
    }
}, () => {
    test('wrap support', function(assert) {
        const mockWrapper = variableWrapper.wrap;
        const obj = mockWrapper({
            prop: mockWrapper({
                subProp: mockWrapper(3)
            })
        });

        const getter = GETTER('prop.subProp');
        assert.equal(getter(obj, { functionsAsIs: true }), 3);
    });

    test('not unwrapped when unwrapObservables = false', function(assert) {
        const mockWrapper = variableWrapper.wrap;
        const obj = {
            prop: {
                subProp: mockWrapper(3)
            }
        };

        const getter = GETTER('prop.subProp');
        assert.ok(variableWrapper.isWrapped(getter(obj, { functionsAsIs: true, unwrapObservables: false })));
    });
});


QUnit.module('setter', () => {
    test('single-level prop', function(assert) {
        const obj = {
            name: 'Alex'
        };

        SETTER('name')(obj, 'Vadim');
        assert.equal(obj.name, 'Vadim');

        SETTER('age')(obj, 18);
        assert.equal(obj.age, 18);
    });

    test('single-level func', function(assert) {
        const date = new Date(2012, 7, 31);

        SETTER('setMonth')(date, 0);
        assert.equal(date.getMonth(), 0);
    });

    test('complex values are replaced (default mode)', function(assert) {
        const obj = {
            person: {
                firstName: 'John'
            }
        };

        SETTER('person')(obj, {
            lastName: 'Doe'
        });

        assert.deepEqual(obj, {
            person: {
                lastName: 'Doe'
            }
        });
    });

    test('complex values are merged (merge option)', function(assert) {
        const obj = {
            person: {
                name: {
                    first: 'John'
                }
            }
        };

        SETTER('person')(
            obj,
            {
                name: {
                    last: 'Doe'
                },
                year: 1970
            },
            { merge: true }
        );

        assert.deepEqual(obj, {
            person: {
                name: {
                    first: 'John',
                    last: 'Doe'
                },
                year: 1970
            }
        });
    });

    test('multi-level expression', function(assert) {
        const obj = {
            person: {
                firstName: 'John'
            }
        };

        SETTER('person.firstName')(obj, 'Alex');
        assert.equal(obj.person.firstName, 'Alex');

    });

    test('multi-level expression with functions', function(assert) {
        const person = {
            _firstName: 'John',
            setFirstName: function(value) {
                this._firstName = value;
            }
        };

        const obj = {
            _person: person,
            getPerson: function(value) {
                return this._person;
            }
        };

        SETTER('getPerson.setFirstName')(obj, 'Alex');
        assert.equal(obj._person._firstName, 'Alex');
    });

    test('attempt to assign scalar to self', function(assert) {
        assert.throws(() => {
            SETTER()('personName', 'Alex');
        });
        assert.throws(() => {
            SETTER('this')('personName', 'Alex');
        });
    });

    test('able to assign to self with merge', function(assert) {
        const target = { a: 1 };
        SETTER('this')(target, { b: 2 }, { merge: true });
        assert.deepEqual(target, { a: 1, b: 2 });
    });

    test('setting a function (should use functionsAsIs)', function(assert) {
        const func1 = () => { };
        const func2 = () => { };

        const obj = {
            f: func1
        };

        SETTER('f')(obj, func2, { functionsAsIs: true });
        assert.strictEqual(obj.f, func2);

        SETTER('g')(obj, func1);
        assert.strictEqual(obj.g, func1, { functionsAsIs: true });
    });

    test('square brackets in expr', function(assert) {
        const obj = {
            prop: {
                items: ['first', 'second', 'third']
            }
        };

        SETTER('prop.items[1]')(obj, '4');
        assert.equal(obj.prop.items[1], '4');

        SETTER('prop[items][0]')(obj, 'zero');
        assert.equal(obj.prop.items[0], 'zero');
    });

    test('merging sub-object to non-existent property', function(assert) {
        const obj = {
        };

        SETTER('sub')(obj, { a: 1 }, { merge: true });
        assert.deepEqual(obj, {
            sub: { a: 1 }
        });
    });

    test('prevent jQuery deep array extending (B239679)', function(assert) {
        const obj = {
            sub: {
                array: [1, 2, 3]
            }
        };

        const setter = SETTER('sub');
        setter(obj, { array: [9] }, { merge: true });

        assert.deepEqual(obj.sub.array, [9]);
    });

    test('complex values are merged only when it is plain object', function(assert) {
        const SomeClass = function(firstName, lastName) {
            this.firstName = firstName;
            this.lastName = lastName;
        };

        const obj1 = {
            sub: {
                person: new SomeClass('John', 'Smith')
            }
        };

        const obj2 = {
            person: {
                firstName: 'Doe'
            }
        };

        SETTER('sub')(
            obj1,
            obj2,
            { merge: true }
        );

        assert.equal(obj1.sub.person.firstName, 'Doe');
        assert.equal(obj1.sub.person.lastName, undefined);
    });

    test('plain objects are cloned if previous value is null (T521407)', function(assert) {
        const obj = {
            dataSource: null
        };

        const dataSource1 = {
            store: 'Store 1'
        };

        const dataSource2 = {
            store: 'Store 2'
        };

        SETTER('dataSource')(
            obj,
            dataSource1,
            { merge: true }
        );

        SETTER('dataSource')(
            obj,
            dataSource2,
            { merge: true }
        );

        assert.equal(dataSource1.store, 'Store 1');
    });

    test('non existing multi-level prop (w/ merge = false)', function(assert) {
        const obj = {};

        SETTER('prop.subProp1.subProp2')(obj, 'Nested value', { merge: false });
        assert.equal(obj.prop.subProp1.subProp2, 'Nested value');
    });

    test('non existing multi-level prop (w/ merge = true)', function(assert) {
        const obj = {};

        SETTER('prop.subProp1.subProp2')(obj, 'Nested value', { merge: true });
        assert.equal(obj.prop.subProp1.subProp2, 'Nested value');
    });

    test('multi-level prop instead of primitives', function(assert) {
        const primitives = [ false, 0, '', true, 1, 'someValue' ];

        primitives.forEach((primitive) => {
            const obj = { prop: primitive };
            try {
                SETTER('prop.subProp')(obj, 'Nested value');
            } catch(e) {
                // Ignore exceptions in strict mode
            } finally {
                assert.equal(obj.prop, primitive, 'primitive was not changed');
            }
        });
    });

    test('multi-level prop instead of function', function(assert) {
        let called = 0;

        const obj = {
            prop: () => {
                called++;
                return {
                    subProp: () => {
                        called++;
                    }
                };
            }
        };

        SETTER('prop.subProp.subProp2')(obj, () => { }, { functionsAsIs: true });
        assert.equal(called, 0);
    });

    test('not existing multi-level prop assignment', function(assert) {
        assert.expect(1);

        const obj = {
            prop: {}
        };

        Object.defineProperty(obj.prop, 'subProp', {
            set: (value) => {
                assert.equal(typeof value, 'string', 'the last-level prop should not become an empty object');
            }
        });

        SETTER('prop.subProp')(obj, 'Test value');
    });
});


QUnit.module('prototype pollution protection', {
    beforeEach: function() {
        sinon.spy(errors, 'log');
    },
    afterEach: function() {
        errors.log.restore();
        delete Object.prototype['pp_dx'];
        delete Object.prototype['pp_dx2'];
    }
}, () => {

    test('compileSetter logs error and skips assignment for __proto__ path fragment (T1330839)', function(assert) {
        const obj = {};
        SETTER('__proto__.pp_dx')(obj, 'yes', { functionsAsIs: true });

        assert.strictEqual(errors.log.calledWith('E0123', 'compileSetter', '__proto__'), true, 'should log E0123 for __proto__');
        assert.strictEqual(obj.pp_dx, undefined, 'target object must not be modified');
        assert.strictEqual(({}).pp_dx, undefined, 'Object.prototype must not be polluted');
    });

    test('compileSetter logs error and skips assignment for constructor path fragment (T1330839)', function(assert) {
        const obj = {};
        SETTER('constructor.prototype.pp_dx')(obj, 'yes', { functionsAsIs: true });

        assert.strictEqual(errors.log.calledWith('E0123', 'compileSetter', 'constructor'), true, 'should log E0123 for constructor');
        assert.strictEqual(obj.pp_dx, undefined, 'target object must not be modified');
        assert.strictEqual(({}).pp_dx, undefined, 'Object.prototype must not be polluted');
    });

    test('compileSetter logs error and skips assignment for prototype path fragment (T1330839)', function(assert) {
        const fn = function() {};
        SETTER('prototype.pp_dx')(fn, 'yes', { functionsAsIs: true });

        assert.strictEqual(errors.log.calledWith('E0123', 'compileSetter', 'prototype'), true, 'should log E0123 for prototype');
        assert.strictEqual(fn.pp_dx, undefined, 'function object must not be modified');
        assert.strictEqual(fn.prototype.pp_dx, undefined, 'function prototype must not be modified');
    });

    test('compileSetter works normally for safe paths (T1330839)', function(assert) {
        const obj = { a: { b: 1 } };
        SETTER('a.b')(obj, 42);

        assert.strictEqual(obj.a.b, 42, 'safe paths must still work');
        assert.strictEqual(errors.log.called, false, 'should not log for safe paths');
    });

    test('compileSetter allows prototype property on plain objects (T1330839)', function(assert) {
        const obj = {};
        SETTER('prototype')(obj, 'yes');

        assert.strictEqual(obj.prototype, 'yes', 'should allow setting prototype on plain objects');
        assert.strictEqual(errors.log.called, false, 'should not log error for plain objects');
    });

    test('compileSetter blocks unsafe fragment written in bracket notation (T1330839)', function(assert) {
        const obj = {};
        SETTER('a[constructor][prototype].pp_dx')(obj, 'yes', { functionsAsIs: true });

        assert.strictEqual(errors.log.calledWith('E0123', 'compileSetter', 'constructor'), true, 'should log E0123 for constructor in bracket notation');
        assert.strictEqual(({}).pp_dx, undefined, 'Object.prototype must not be polluted');
    });

    test('compileSetter blocks unsafe fragment in non-first position (T1330839)', function(assert) {
        const obj = { a: { b: {} } };
        SETTER('a.b.__proto__')(obj, { pp_dx: 'yes' }, { functionsAsIs: true });

        assert.strictEqual(errors.log.calledWith('E0123', 'compileSetter', '__proto__'), true, 'should log E0123 for __proto__ in non-first position');
        assert.strictEqual(obj.a.b.pp_dx, undefined, 'nested object must not inherit a polluted property');
        assert.strictEqual(({}).pp_dx, undefined, 'Object.prototype must not be polluted');
    });

    test('compileGetter logs error and returns undefined for __proto__ path fragent (T1330839)', function(assert) {
        const result = GETTER('__proto__.pp_dx')({});

        assert.strictEqual(errors.log.calledWith('E0123', 'compileGetter', '__proto__'), true, 'should log E0123 for __proto__');
        assert.strictEqual(result, undefined, 'getter must return undefined for __proto__');
    });

    test('compileGetter logs error and returns undefined for constructor path fragment (T1330839)', function(assert) {
        const result = GETTER('constructor.prototype')(function() {});

        assert.strictEqual(errors.log.calledWith('E0123', 'compileGetter', 'constructor'), true, 'should log E0123 for constructor');
        assert.strictEqual(result, undefined, 'getter must return undefined for constructor');
    });

    test('compileGetter logs error and returns undefined for prototype path fragment (T1330839)', function(assert) {
        const result = GETTER('prototype.pp_dx')(function() {});

        assert.strictEqual(errors.log.calledWith('E0123', 'compileGetter', 'prototype'), true, 'should log E0123 for prototype');
        assert.strictEqual(result, undefined, 'getter must return undefined for prototype');
    });

    test('compileGetter allows prototype property on plain objects (T1330839)', function(assert) {
        const obj = { prototype: 'yes' };
        const result = GETTER('prototype')(obj);

        assert.strictEqual(result, 'yes', 'should allow getting prototype on plain objects');
        assert.strictEqual(errors.log.called, false, 'should not log error for plain objects');
    });

    test('combineGetters logs error and skips __proto__ fragment, returns safe fields (T1330839)', function(assert) {
        const obj = { safe: 'value' };
        const result = GETTER(['__proto__.pp_dx', 'safe'])(obj);

        assert.strictEqual(errors.log.calledWith('E0123', 'compileGetter', '__proto__'), true, 'should log E0123 for __proto__');
        assert.strictEqual(({}).pp_dx, undefined, 'Object.prototype must not be polluted');
        assert.deepEqual(result, { safe: 'value' }, 'safe field must still be returned');
    });

    test('combineGetters logs error and skips constructor fragment, returns safe fields (T1330839)', function(assert) {
        const obj = { safe: 'value' };
        const result = GETTER(['constructor.prototype.pp_dx', 'safe'])(obj);

        assert.strictEqual(errors.log.calledWith('E0123', 'compileGetter', 'constructor'), true, 'should log E0123 for constructor');
        assert.strictEqual(({}).pp_dx, undefined, 'Object.prototype must not be polluted');
        assert.deepEqual(result, { safe: 'value' }, 'safe field must still be returned');
    });

    test('combineGetters logs error and skips unsafe paths even if intermediate values break early (with defaultValue) (T1330839)', function(assert) {
        const obj = { a: null, safe: 'value' };
        const result = GETTER(['a.constructor.prototype.pp_dx2', 'safe'])(obj, { defaultValue: 'default' });

        assert.strictEqual(errors.log.calledWith('E0123', 'compileGetter', 'constructor'), true, 'should log E0123 for constructor');
        assert.strictEqual(({}).pp_dx2, undefined, 'Object.prototype must not be polluted');
        assert.deepEqual(result, { safe: 'value' }, 'safe field must still be returned');
    });
});


QUnit.module('setter with wrapped variables', {
    beforeEach: function() {
        variableWrapper.inject(mockVariableWrapper);
    },
    afterEach: function() {
        variableWrapper.resetInjection();
    }
}, () => {
    test('wrap support', function(assert) {
        const mockWrapper = variableWrapper.wrap;
        const obj = mockWrapper({
            prop: mockWrapper({
                subProp: mockWrapper(3)
            })
        });

        const setter = SETTER('prop.subProp');
        setter(obj, 5, { functionsAsIs: true });

        assert.equal(obj().prop().subProp(), 5);
    });

    test('not unwrapped when unwrapObservables = false', function(assert) {
        const mockWrapper = variableWrapper.wrap;
        const obj = {
            prop: {
                subProp: mockWrapper(3)
            }
        };

        const setter = SETTER('prop.subProp');
        setter(obj, 5, { functionsAsIs: true, unwrapObservables: false });

        assert.equal(obj.prop.subProp, 5);
    });

    test('wrap with merge and functions unwrapping', function(assert) {
        const mockWrapper = variableWrapper.wrap;
        const obj = {
            prop: mockWrapper({ a: 1 })
        };

        const setter = SETTER('prop');
        setter(obj, { b: 2 }, { functionsAsIs: false, merge: true });

        assert.deepEqual(obj.prop(), { a: 1, b: 2 });
    });

    test('multi-level prop into the wrapped value', function(assert) {
        const mockWrapper = variableWrapper.wrap;
        const obj = mockWrapper({
            prop: mockWrapper(undefined)
        });

        const setter = SETTER('prop.subProp');
        setter(obj, 'New value');
        assert.equal(obj().prop().subProp, 'New value');
    });

    test('multi-level prop instead of wrapped value without unwrapping', function(assert) {
        assert.expect(0);
        variableWrapper.inject({
            unwrap: function() {
                assert.ok(false, '\'unwrap\' should not be called');
                return this.callBase.apply(this, arguments);
            }
        });
        const mockWrapper = variableWrapper.wrap;
        const obj = mockWrapper({
            prop: mockWrapper(undefined)
        });

        SETTER('prop.subProp')(obj, 'Nested value', { unwrapObservables: false });
    });
});
