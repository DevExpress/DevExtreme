import {
    compileGetter as GETTER,
    compileSetter as SETTER
} from 'core/utils/data';
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
    test('it works', (assert) => {
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

    test('defaultValue', (assert) => {
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

    test('complex getter', (assert) => {
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

    test('functionsAsIs option', (assert) => {
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

    test('square brackets in expr', (assert) => {
        const obj = {
            prop: {
                items: ['first', 'second', 'third']
            }
        };

        assert.equal(GETTER('prop.items[1]')(obj), 'second');
        assert.equal(GETTER('prop[items][1]')(obj), 'second');
    });

    test('empty results are the same', (assert) => {
        const monoGetter = GETTER('field1');
        const polyGetter = GETTER('field1', 'field2');

        const emptyResultOfMonoGetter = monoGetter({});
        const emptyResultOfPolyGetter = polyGetter({});

        assert.strictEqual(emptyResultOfMonoGetter, undefined);
        assert.strictEqual(emptyResultOfPolyGetter, undefined);
    });

    test('Issue #8552', (assert) => {
        // https://github.com/DevExpress/DevExtreme/issues/8552
        const getter = GETTER([ 'B.Id', 'B.Key' ]);
        const obj = { B: { Id: 'Id', Key: 'Key' } };
        assert.deepEqual(getter(obj), obj);
    });
});


QUnit.module('getter with wrapped variables', {
    beforeEach: () => {
        variableWrapper.inject(mockVariableWrapper);
    },
    afterEach: () => {
        variableWrapper.resetInjection();
    }
}, () => {
    test('wrap support', (assert) => {
        const mockWrapper = variableWrapper.wrap;
        const obj = mockWrapper({
            prop: mockWrapper({
                subProp: mockWrapper(3)
            })
        });

        const getter = GETTER('prop.subProp');
        assert.equal(getter(obj, { functionsAsIs: true }), 3);
    });

    test('not unwrapped when unwrapObservables = false', (assert) => {
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
    test('single-level prop', (assert) => {
        const obj = {
            name: 'Alex'
        };

        SETTER('name')(obj, 'Vadim');
        assert.equal(obj.name, 'Vadim');

        SETTER('age')(obj, 18);
        assert.equal(obj.age, 18);
    });

    test('single-level func', (assert) => {
        const date = new Date(2012, 7, 31);

        SETTER('setMonth')(date, 0);
        assert.equal(date.getMonth(), 0);
    });

    test('complex values are replaced (default mode)', (assert) => {
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

    test('complex values are merged (merge option)', (assert) => {
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

    test('multi-level expression', (assert) => {
        const obj = {
            person: {
                firstName: 'John'
            }
        };

        SETTER('person.firstName')(obj, 'Alex');
        assert.equal(obj.person.firstName, 'Alex');

    });

    test('multi-level expression with functions', (assert) => {
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

    test('attempt to assign scalar to self', (assert) => {
        assert.throws(() => {
            SETTER()('personName', 'Alex');
        });
        assert.throws(() => {
            SETTER('this')('personName', 'Alex');
        });
    });

    test('able to assign to self with merge', (assert) => {
        const target = { a: 1 };
        SETTER('this')(target, { b: 2 }, { merge: true });
        assert.deepEqual(target, { a: 1, b: 2 });
    });

    test('setting a function (should use functionsAsIs)', (assert) => {
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

    test('square brackets in expr', (assert) => {
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

    test('merging sub-object to non-existent property', (assert) => {
        const obj = {
        };

        SETTER('sub')(obj, { a: 1 }, { merge: true });
        assert.deepEqual(obj, {
            sub: { a: 1 }
        });
    });

    test('prevent jQuery deep array extending (B239679)', (assert) => {
        const obj = {
            sub: {
                array: [1, 2, 3]
            }
        };

        const setter = SETTER('sub');
        setter(obj, { array: [9] }, { merge: true });

        assert.deepEqual(obj.sub.array, [9]);
    });

    test('complex values are merged only when it is plain object', (assert) => {
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

    test('plain objects are cloned if previous value is null (T521407)', (assert) => {
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

    test('non existing multi-level prop (w/ merge = false)', (assert) => {
        const obj = {};

        SETTER('prop.subProp1.subProp2')(obj, 'Nested value', { merge: false });
        assert.equal(obj.prop.subProp1.subProp2, 'Nested value');
    });

    test('non existing multi-level prop (w/ merge = true)', (assert) => {
        const obj = {};

        SETTER('prop.subProp1.subProp2')(obj, 'Nested value', { merge: true });
        assert.equal(obj.prop.subProp1.subProp2, 'Nested value');
    });

    test('multi-level prop instead of primitives', (assert) => {
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

    test('multi-level prop instead of function', (assert) => {
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

    test('not existing multi-level prop assignment', (assert) => {
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


QUnit.module('setter with wrapped variables', {
    beforeEach: () => {
        variableWrapper.inject(mockVariableWrapper);
    },
    afterEach: () => {
        variableWrapper.resetInjection();
    }
}, () => {
    test('wrap support', (assert) => {
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

    test('not unwrapped when unwrapObservables = false', (assert) => {
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

    test('wrap with merge and functions unwrapping', (assert) => {
        const mockWrapper = variableWrapper.wrap;
        const obj = {
            prop: mockWrapper({ a: 1 })
        };

        const setter = SETTER('prop');
        setter(obj, { b: 2 }, { functionsAsIs: false, merge: true });

        assert.deepEqual(obj.prop(), { a: 1, b: 2 });
    });

    test('multi-level prop into the wrapped value', (assert) => {
        const mockWrapper = variableWrapper.wrap;
        const obj = mockWrapper({
            prop: mockWrapper(undefined)
        });

        const setter = SETTER('prop.subProp');
        setter(obj, 'New value');
        assert.equal(obj().prop().subProp, 'New value');
    });

    test('multi-level prop instead of wrapped value without unwrapping', (assert) => {
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
