import $ from 'jquery';
import QUERY from 'common/data/query';
import ErrorHandlingHelper from '../../helpers/data.errorHandlingHelper.js';

QUnit.module('Misc');

QUnit.test('no operations', function(assert) {
    assert.expect(2);

    const done = assert.async();
    const q = QUERY([1, 2, 3]);

    $.when(
        q.enumerate().done(function(r) {
            assert.deepEqual(r, [1, 2, 3], 'first enumeration');
        })
    ).done(function() {
        q.enumerate().done(function(r) {
            assert.deepEqual(r, [1, 2, 3], 'second enumeration');
            done();
        });
    });
});

QUnit.test('toArray convenience method', function(assert) {
    assert.deepEqual(
        QUERY([1, 2, 3])
            .select(function(i) { return i * 2; })
            .toArray(),
        [2, 4, 6]
    );
});


QUnit.module('Sorting');

QUnit.test('basic usage', function(assert) {
    assert.expect(1);

    const done = assert.async();

    const input = [
        { name: 'alex', age: 21 },
        { name: 'bob', age: 0 },
        { name: 'alex', age: 27 }
    ];

    const output = [
        { name: 'alex', age: 27 },
        { name: 'alex', age: 21 },
        { name: 'bob', age: 0 }
    ];

    QUERY(input).sortBy('name').thenBy('age', 'desc').enumerate().done(function(r) {
        assert.deepEqual(r, output);
        done();
    });
});

QUnit.test('sort using functional getter', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const input = [2, 1, 3];
    const output = [3, 2, 1];

    QUERY(input).sortBy(function(item) { return 3 - item; }).enumerate().done(function(r) {
        assert.deepEqual(r, output);
        done();
    });
});

QUnit.test('sort using compare function', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const input = [2, 1, 3];
    const output = [3, 1, 2];

    QUERY(input).sortBy('this', false, function(x, y) {
        return output.indexOf(x) - output.indexOf(y);
    }).enumerate().done(function(r) {
        assert.deepEqual(r, output);
        done();
    });
});

QUnit.test('thenBy with compare function', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const input = [2, 1, 3];
    const output = [3, 1, 2];

    QUERY(input).sortBy('fake').thenBy('this', false, function(x, y) {
        return output.indexOf(x) - output.indexOf(y);
    }).enumerate().done(function(r) {
        assert.deepEqual(r, output);
        done();
    });
});

QUnit.test('sort using compare function and getter', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const order = [2, 1];
    const input = [{ val: 1 }, { val: 2 }];
    const output = [{ val: 2 }, { val: 1 }];

    QUERY(input).sortBy('val', false, function(x, y) {
        return order.indexOf(x) - order.indexOf(y);
    }).enumerate().done(function(r) {
        assert.deepEqual(r, output);
        done();
    });
});

QUnit.test('sort using compare function if desc is true', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const input = [2, 1, 3];
    const output = [3, 1, 2];

    QUERY(input).sortBy('this', true, function(x, y) {
        return output.indexOf(x) - output.indexOf(y);
    }).enumerate().done(function(r) {
        assert.deepEqual(r, output.slice().reverse());
        done();
    });
});

QUnit.test('compare function arguments should not be normalized via toComparable', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const input = ['A', 'a', 'B'];
    const output = ['A', 'B', 'a'];

    QUERY(input).sortBy('this', false, function(x, y) {
        if(x < y) return -1;
        if(x > y) return 1;
        return 0;
    }).enumerate().done(function(r) {
        assert.deepEqual(r, output);
        done();
    });
});

QUnit.test('sort without a getter', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY([2, 1]).sortBy().enumerate().done(function(r) {
        assert.deepEqual(r, [1, 2]);
        done();
    });
});

QUnit.test('applying sort does not modify original query', function(assert) {
    assert.expect(2);

    const done = assert.async();
    const q = QUERY([2, 1]);
    const sorted = q.sortBy();

    $.when(
        q.enumerate().done(function(r) {
            assert.deepEqual(r, [2, 1]);
        }),
        sorted.enumerate().done(function(r) {
            assert.deepEqual(r, [1, 2]);
        })
    ).done(done);
});

QUnit.test('subsequent \'sort\' call re-sorts from scratch', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const data = [2, 1, 3];
    let q = QUERY(data);

    q = q.sortBy(function(i) { return i; });
    q = q.sortBy(function(i) { return 10 - i; });
    q.enumerate().done(function(r) {
        assert.deepEqual(r, [3, 2, 1]);
        done();
    });
});

QUnit.test('sort uses getter', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const data = [new Date(2011, 11, 22), new Date(2011, 10, 1)];
    QUERY(data).sortBy('getMonth').enumerate().done(function(r) {
        assert.equal(r[0].getMonth(), 10);
        done();
    });
});

QUnit.test('string are supported and letter case is ignored', function(assert) {
    const done = assert.async();
    const data = ['Z', 'a'];
    QUERY(data).sortBy().enumerate().done(function(r) {
        assert.deepEqual(r, ['a', 'Z']);
        done();
    });
});

QUnit.test('sort with falsy null and undefined values', function(assert) {
    // NOTE: http://www.ecma-international.org/ecma-262/6.0/#sec-sortcompare
    let data;
    const sort = function(data, desc) {
        return QUERY(data)
            .sortBy('this', desc || false)
            .toArray();
    };

    data = ['b', null, undefined, 'a', null];
    assert.deepEqual(sort(data), [null, null, 'a', 'b', undefined]);
    assert.deepEqual(sort(data, true), [undefined, 'b', 'a', null, null]);

    data = [0, 1, null, -1, undefined, null];
    assert.deepEqual(sort(data), [null, null, -1, 0, 1, undefined]);
    assert.deepEqual(sort(data, true), [undefined, 1, 0, -1, null, null]);
});

QUnit.test('sorting is stable (T123921)', function(assert) {
    const done = assert.async();

    const data = [
        { name: 0, type: 'M' },
        { name: 1, type: 'M' },
        { name: 2, type: 'M' },
        { name: 3, type: 'M' },
        { name: 4, type: 'M' },
        { name: 5, type: 'M' },
        { name: 6, type: 'M' },
        { name: 7, type: 'S' },
        { name: 9, type: 'S' },
        { name: 10, type: 'S' },
        { name: 11, type: 'S' }
    ];

    QUERY(data).sortBy('type').enumerate().done(function(r) {
        assert.deepEqual(r, data);
        done();
    });
});

QUnit.module('Filtering');

QUnit.test('filter by function', function(assert) {
    assert.expect(3);

    const done = assert.async();
    const input = [2, 0, 5];

    const q1 = QUERY(input).filter(function(i) { return i > 1; });
    const q2 = q1.filter(function(i) { return i < 5; });

    $.when(
        q1.enumerate().done(function(r) {
            assert.deepEqual(r, [2, 5]);
        })
    ).done(function() {
        $.when(
            q2.enumerate().done(function(r) {
                assert.deepEqual(r, [2]);
            }),
            q1.enumerate().done(function(r) {
                assert.deepEqual(r, [2, 5], 'prev result has not been modified');
            })
        ).done(function() {
            done();
        });
    });
});

QUnit.test('group criterion with function', function(assert) {
    assert.expect(2);

    const data = [
        { value: 0 },
        { value: 2 },
        { value: 5 }
    ];
    const functionCondition = (itemData) => itemData.value > 1;
    const arrayCondition = ['value', '<', 5];

    assert.equal(
        QUERY(data).filter([functionCondition, arrayCondition]).toArray()[0].value,
        2
    );

    assert.equal(
        QUERY(data).filter([arrayCondition, functionCondition]).toArray()[0].value,
        2
    );
});

QUnit.test('comparison operators', function(assert) {
    assert.expect(16);

    const done = assert.async();
    const input = [{ f: 1 }, { f: 2 }, { f: null }];

    const check = function(crit, expectation) {
        return QUERY(input).filter(crit).enumerate().done(function(r) {
            assert.deepEqual(r, expectation);
        });
    };

    $.when(
        check(['f', '=', 2], [{ f: 2 }]),
        check(['f', '<>', 2], [{ f: 1 }, { f: null }]),
        check(['f', '>', 1], [{ f: 2 }]),
        check(['f', '>=', 2], [{ f: 2 }]),
        check(['f', '<', 2], [{ f: 1 }]),
        check(['f', '<=', 1], [{ f: 1 }]),
        check(['f', '>', -1], [{ f: 1 }, { f: 2 }]),
        check(['f', '>=', -2], [{ f: 1 }, { f: 2 }]),
        check(['f', '<', -2], []),
        check(['f', '<=', -1], []),
        check(['f', '=', null], [{ f: null }]),
        check(['f', '<>', null], [{ f: 1 }, { f: 2 }]),
        check(['f', '>', null], []),
        check(['f', '>=', null], [{ f: null }]),
        check(['f', '<', null], []),
        check(['f', '<=', null], [{ f: null }]),
    ).done(function() {
        done();
    });
});

QUnit.test('filter with functional getter', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const input = [{ f: 1 }, { f: 2 }];
    const getter = function(obj) { return obj.f * 2; };

    QUERY(input).filter([getter, '=', 4]).enumerate().done(function(r) {
        assert.deepEqual(r, [{ f: 2 }]);
        done();
    });
});

QUnit.test('filter with undefined "langParams" (behaviour like collatorOptions.sensitivity set to "accent")', function(assert) {
    const input = [{ ID: 'AAA' }, { ID: 'aaa' }, { ID: 'ááá' }, { ID: 'bbb' }];
    const array = QUERY(input).filter(['ID', '=', 'aaa']).toArray();

    assert.equal(array.length, 2);
    assert.equal(array[0].ID, 'AAA');
    assert.equal(array[1].ID, 'aaa');
});

QUnit.test('filter with collatorOptions.sensitivity set to "accent"', function(assert) {
    const input = [{ ID: 'AAA' }, { ID: 'aaa' }, { ID: 'ááá' }, { ID: 'bbb' }];

    const array = QUERY(input, {
        langParams: {
            collatorOptions: {
                sensitivity: 'accent'
            }
        }
    }).filter(['ID', '=', 'aaa']).toArray();

    assert.equal(array.length, 2);
    assert.equal(array[0].ID, 'AAA');
    assert.equal(array[1].ID, 'aaa');
});

QUnit.test('filter with collatorOptions.sensitivity set to "case"', function(assert) {
    const input = [{ ID: 'AAA' }, { ID: 'aaa' }, { ID: 'ááá' }, { ID: 'bbb' }];

    const array = QUERY(input, {
        langParams: {
            collatorOptions: {
                sensitivity: 'case'
            }
        }
    }).filter(['ID', '=', 'aaa']).toArray();

    assert.equal(array.length, 2);
    assert.equal(array[0].ID, 'aaa');
    assert.equal(array[1].ID, 'ááá');
});

QUnit.test('filter with collatorOptions.sensitivity set to "variant"', function(assert) {
    const input = [{ ID: 'AAA' }, { ID: 'aaa' }, { ID: 'ááá' }, { ID: 'bbb' }];

    const array = QUERY(input, {
        langParams: {
            collatorOptions: {
                sensitivity: 'variant'
            }
        }
    }).filter(['ID', '=', 'aaa']).toArray();

    assert.equal(array.length, 1);
    assert.equal(array[0].ID, 'aaa');
});

QUnit.test('filter with collatorOptions.sensitivity set to "base"', function(assert) {
    const input = [{ ID: 'bbb', Name: 'Name 1' }, { ID: 'ááá', Name: 'Name 2' }, { ID: 'aaa', Name: 'Name 3' }];

    const array = QUERY(input, {
        langParams: {
            collatorOptions: {
                sensitivity: 'base'
            }
        }
    }).filter(['ID', '=', 'aaa']).toArray();

    assert.equal(array.length, 2);

    const containsUnwantedValue = array.some(item => item.ID === 'bbb');
    assert.false(containsUnwantedValue);
});

QUnit.test('filtering use correct case insensitivity equal', function(assert) {
    const input = [{ ID: 1, Name: 'AΙΤΗΣ' }, { ID: 2, Name: 'aιτης' }, { ID: 3, Name: 'abcde' }];

    const array = QUERY(input, {
        langParams: {
            locale: 'el-GR'
        }
    }).filter(['Name', '=', 'AΙΤΗΣ']).toArray();

    assert.equal(array.length, 2);

    const containsUnwantedValue = array.some(item => item.ID === 3);
    assert.false(containsUnwantedValue);
});

QUnit.test('filtering use correct case insensitivity search', function(assert) {
    const input = [
        { ID: 1, Name: 'AΙΤΗΣ' },
        { ID: 2, Name: 'aιτης' },
        { ID: 3, Name: 'aιτησa' },
        { ID: 4, Name: 'AΙΤΗΣΗ' },
        { ID: 5, Name: 'ΑBΤΗΣΗ' },
        { ID: 6, Name: 'BΑΙΤΗΣΗ' },
        { ID: 7, Name: 'baιτησa' },
    ];

    const query = QUERY(input, {
        langParams: {
            locale: 'el-GR'
        }
    });

    const arrayStartsWith = query.filter(['Name', 'startswith', 'AΙΤΗΣ']).toArray();

    const arrayEndsWith = query.filter(['Name', 'endswith', 'ΙΤΗΣ']).toArray();

    const arrayContains = query.filter(['Name', 'contains', 'ΙΤΗΣ']).toArray();

    assert.equal(arrayStartsWith.length, 4);
    assert.equal(arrayEndsWith.length, 2);
    assert.equal(arrayContains.length, 6);

    const containsUnwantedValue = arrayStartsWith.some(item => [5, 6, 7].includes(item.ID))
        || arrayEndsWith.some(item => [5, 4, 3, 6, 7].includes(item.ID))
        || arrayContains.some(item => [5].includes(item.ID));
    assert.false(containsUnwantedValue);
});

QUnit.test('filtering use correct case insensitivity search for Armenian locale', function(assert) {
    const input = [
        { ID: 1, Name: 'ԵՐԵՒԱՆ' },
        { ID: 2, Name: 'Երևան' },
    ];

    const arrayStartsWith = QUERY(input, {
        langParams: {
            locale: 'hy'
        }
    }).filter(['Name', 'startswith', 'Երև']).toArray();

    assert.equal(arrayStartsWith.length, 2);
});

QUnit.test('missing operation means equal', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const input = [{ f: 42 }];


    QUERY(input).filter(['f', 42]).enumerate().done(function(r) {
        assert.deepEqual(r, input);
        done();
    });
});

QUnit.test('missing value means true', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const input = [{ f: true }];

    QUERY(input).filter(['f']).enumerate().done(function(r) {
        assert.deepEqual(r, input);
        done();
    });
});

QUnit.test('skip null and undefined values for string field', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const input = [{ f: null }, { f: undefined }, { f: 'abc' }];

    QUERY(input).filter(['f', 'contains', 'b']).enumerate().done(function(r) {
        assert.deepEqual(r, [{ f: 'abc' }]);
        done();
    });
});

QUnit.test('when arguments are not array', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const input = [{ f: 42 }];

    QUERY(input).filter('f', 42).enumerate().done(function(r) {
        assert.deepEqual(r, input);
        done();
    });
});

QUnit.test('AND', function(assert) {
    assert.expect(4);

    const done = assert.async();
    const input = [{ f: 1 }, { f: 2 }, { f: 3 }];
    const cond1 = ['f', '>', 1];
    const cond2 = ['f', '<', 3];

    const check = function(op) {
        return QUERY(input)
            .filter([cond1, op, cond2])
            .enumerate()
            .fail(function() {
                assert.ok(false, 'Shouldn\'t reach this point');
            })
            .done(function(r) {
                assert.deepEqual(r, [{ f: 2 }]);
            });
    };

    $.when(
        check('and'),
        check('AND'),
        check('&'),
        check('&&')
    ).done(function() {
        done();
    }).fail(function() {
        assert.ok(false, 'Shouldn\'t reach this point');
    });
});

QUnit.test('OR', function(assert) {
    assert.expect(4);

    const done = assert.async();
    const input = [{ f: 1 }, { f: 2 }, { f: 3 }];
    const cond1 = ['f', 1];
    const cond2 = ['f', 3];

    const check = function(op) {
        return QUERY(input).filter([cond1, op, cond2]).enumerate().done(function(r) {
            assert.deepEqual(r, [{ f: 1 }, { f: 3 }]);
        });
    };

    $.when(
        check('or'),
        check('OR'),
        check('|'),
        check('||')
    ).done(function() {
        done();
    });
});

QUnit.test('missing logic operator means AND', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const input = [{ f: 1 }, { f: 2 }, { f: 3 }];
    const crit = [
        ['f', '>', 1],
        ['f', '<', 3]
    ];

    QUERY(input).filter(crit).enumerate().done(function(r) {
        assert.deepEqual(r, [{ f: 2 }]);
        done();
    });
});

QUnit.test('conditions are not checked if it\'s not necessary', function(assert) {
    assert.expect(2);

    const done = assert.async();

    const check = function(op) {
        let callCount = 0;

        return QUERY([{ f: 1 }, { f: 2 }])
            .filter([['f', '>', 1], op, function() {
                callCount++;
            }])
            .enumerate()
            .done(function(r) {
                assert.equal(callCount, 1);
            });
    };

    $.when(
        check('and'),
        check('or')
    ).done(done);
});

QUnit.test('string functions', function(assert) {
    assert.expect(4);

    const done = assert.async();
    const input = [{ f: 'a' }, { f: 'ab' }, { f: 'abc' }];


    const check = function(crit, expectation) {
        return QUERY(input).filter(crit).enumerate().done(function(r) {
            assert.deepEqual(r, expectation);
        });
    };

    $.when(
        check(['f', 'startsWith', 'ab'], [{ f: 'ab' }, { f: 'abc' }]),
        check(['f', 'endsWith', 'b'], [{ f: 'ab' }]),
        check(['f', 'contains', 'b'], [{ f: 'ab' }, { f: 'abc' }]),
        check(['f', 'notContains', 'b'], [{ f: 'a' }])
    ).done(done);
});

QUnit.test('operator names are case insensitive', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const input = [{ f: 'abc' }];

    QUERY(input).filter('f', 'CoNtAiNs', 'b').enumerate().done(function(r) {
        assert.deepEqual(r, input);
        done();
    });
});

QUnit.test('letter case in string values does not matter', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const input = [{ f: 'Abc' }];

    QUERY(input).filter(['f', 'aBc']).enumerate().done(function(r) {
        assert.deepEqual(r, input);
        done();
    });
});

QUnit.test('date', function(assert) {
    assert.expect(1);

    const done = assert.async();

    const ms = new Date().valueOf();
    const input = [
        { d: new Date(ms) },
        { d: new Date(ms + 5) }
    ];

    QUERY(input).filter(['d', new Date(ms)]).enumerate().done(function(r) {
        assert.deepEqual(r, [{ d: new Date(ms) }]);
        done();
    });
});

QUnit.test('filter uses getter', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const data = [new Date(2011, 11, 22), new Date(2011, 10, 1)];

    QUERY(data).filter('getMonth', 10).enumerate().done(function(r) {
        assert.equal(r[0].getMonth(), 10);
        done();
    });
});

QUnit.test('filter array and func regression', function(assert) {
    const done = assert.async();

    QUERY([1, 2, 3])
        .filter([
            ['this', '>', 1],
            function(i) { return i < 3; }
        ])
        .enumerate()
        .done(function(r) {
            assert.deepEqual(r, [2]);
            done();
        });
});

QUnit.test('T141181: Filtering with \'endswith\' operation is not working properly in some cases', function(assert) {
    const done = assert.async();

    QUERY(['bar'])
        .filter(['this', 'endswith', 'fooo'])
        .enumerate()
        .done(function(r) {
            assert.deepEqual(r, []);
            done();
        });
});

QUnit.test('unknown filter operation', function(assert) {
    try {
        QUERY([1]).filter('a', 'nonsense', 'b');
        assert.ok(false);
    } catch(x) {
        assert.ok(/unknown filter/i.test(x.message));
    }
});

QUnit.test('NOT with binary operators', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const input = [{ f: 'a' }, { f: 'ab' }, { f: 'abc' }];
    const cond = ['f', 'startswith', 'ab'];

    const check = function(op) {
        return QUERY(input)
            .filter([op, cond])
            .enumerate()
            .fail(function() {
                assert.ok(false, 'Shouldn\'t reach this point');
            })
            .done(function(r) {
                assert.deepEqual(r, [{ f: 'a' }]);
            });
    };

    $.when(
        check('!')
    ).done(function() {
        done();
    }).fail(function() {
        assert.ok(false, 'Shouldn\'t reach this point');
    });
});

QUnit.test('NOT with group operation', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const input = [{ f: 1 }, { f: 2 }, { f: 3 }];
    const cond1 = ['f', '>=', 2];
    const cond2 = ['f', '<>', 3];

    const check = function(op) {
        return QUERY(input)
            .filter([op, [cond1, 'and', cond2]])
            .enumerate()
            .fail(function() {
                assert.ok(false, 'Shouldn\'t reach this point');
            })
            .done(function(r) {
                assert.deepEqual(r, [{ f: 1 }, { f: 3 }]);
            });
    };

    $.when(
        check('!')
    ).done(function() {
        done();
    }).fail(function() {
        assert.ok(false, 'Shouldn\'t reach this point');
    });
});

QUnit.test('mixin and/or conditions inside a single group throws', function(assert) {
    assert.expect(4);

    function createFn(crit) {
        return function() {
            QUERY([{ foo: true, bar: true, foobar: true }])
                .filter(crit)
                .enumerate();
        };
    }

    assert.throws(createFn([
        ['foo'],
        ['bar'],
        'or',
        ['foobar']
    ]));

    assert.throws(createFn([
        ['foo'],
        '&&',
        ['bar'],
        '||',
        ['foobar']
    ]));

    assert.throws(createFn([
        ['foo'],
        'or',
        ['bar'],
        ['foobar']
    ]));

    assert.throws(createFn([
        ['foo'],
        'or',
        ['bar'],
        'and',
        ['foobar']
    ]));
});

QUnit.module('Filtering performance');

QUnit.test('execute quickly if criteria is huge sequence of ["prop", "=", value] filters are grouped by OR (T1217184)', function(assert) {
    const done = assert.async();
    const input = [...new Array(20000)].map((_, index) => ({ id: index }));
    const filters = [...new Array(5000)]
        .flatMap((_, index) => [['id', '=', index], 'or']);

    filters.pop();

    const filtersNotUniform = filters.map((f, i) => (i % 2 ? 'or' : [...f]));

    filtersNotUniform.at(-1)[1] = '<>';

    let bestTime = 1000;
    let notUniformTime = 1000;

    const arrayQuery = QUERY(input);

    [1].forEach(() => {
        const startTime = Date.now();

        arrayQuery.filter(filtersNotUniform).toArray();
        notUniformTime = Date.now() - startTime;
    });

    [1, 2, 3].forEach(() => {
        const startTime = Date.now();
        const r = arrayQuery.filter(filters).toArray();

        bestTime = Math.min(Date.now() - startTime, bestTime);
        assert.equal(r.length, 5000);
    });

    assert.ok(bestTime * 2 < notUniformTime, `Execution time is ${bestTime}. It must be less than ${Math.floor(notUniformTime / 2)}ms`);

    done();
});

QUnit.module('Grouping');

QUnit.test('basic usage', function(assert) {
    const done = assert.async();

    const input = [
        { a: 2 },
        { a: 1 },
        { a: 2 }
    ];

    QUERY(input).groupBy('a').enumerate().done(function(groups) {
        assert.deepEqual(groups, [
            {
                key: 2,
                items: [{ a: 2 }, { a: 2 }]
            },
            {
                key: 1,
                items: [{ a: 1 }]
            }
        ]);
        done();
    });

});

QUnit.test('group uses getter', function(assert) {
    assert.expect(1);

    const done = assert.async();
    const data = [new Date(2011, 10, 1)];

    QUERY(data).groupBy('getMonth').enumerate().done(function(groups) {
        assert.equal(groups[0].key, 10);
        done();
    });
});

QUnit.test('T348632: Rows in a group with an undefined group value are not sorted', function(assert) {

    const data = [
        { foo: undefined, bar: 1 },
        { foo: undefined, bar: 2 },
        { foo: null, bar: 1 },
        { foo: null, bar: 2 },
        { foo: 'a', bar: 1 },
        { foo: 'a', bar: 2 }
    ];

    assert.deepEqual(
        QUERY(data).sortBy('foo').thenBy('bar', true).toArray(),
        [
            { foo: null, bar: 2 },
            { foo: null, bar: 1 },
            { foo: 'a', bar: 2 },
            { foo: 'a', bar: 1 },
            { foo: undefined, bar: 2 },
            { foo: undefined, bar: 1 }
        ]
    );
});

QUnit.module('Aggregates');

QUnit.test('custom aggregate with 3 args', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY([{ f: 1 }, { f: 2 }]).aggregate(
        0,
        function(accumulator, obj) { return accumulator += obj.f; },
        function(accumulator) { return accumulator * 2; }
    ).done(function(r) {
        assert.equal(r, 6);
        done();
    });
});

QUnit.test('custom aggregate with 1 args', function(assert) {
    assert.expect(1);

    const done = assert.async();
    QUERY([1, 2])
        .aggregate(function(accumulator, obj) {
            return accumulator += obj;
        })
        .done(function(r) {
            assert.equal(r, 3);
            done();
        });
});

QUnit.test('standard aggregate functions', function(assert) {
    assert.expect(6);

    const done = assert.async();
    const q = QUERY([{ f: 1 }, { f: 3 }]);

    $.when(
        q.count().done(function(r) {
            assert.equal(r, 2, 'countable count');
        }),

        q.filter(function(i) { return i.f < 2; })
            .count()
            .done(function(r) {
                assert.equal(r, 1, 'non-countable count');
            }),

        q.sum('f').done(function(r) {
            assert.equal(r, 4);
        }),

        q.min('f').done(function(r) {
            assert.equal(r, 1);
        }),

        q.max('f').done(function(r) {
            assert.equal(r, 3);
        }),

        q.avg('f').done(function(r) {
            assert.equal(r, 2);
        })
    ).done(function() {
        done();
    });
});

QUnit.test('standard aggregate functions on empty collections', function(assert) {
    const done = assert.async();
    const q = QUERY([]);

    $.when(

        q.count().done(function(r) {
            assert.strictEqual(r, 0);
        }),

        q.filter(function() { return true; }).count().done(function(r) {
            assert.strictEqual(r, 0);
        }),

        q.sum().done(function(r) {
            assert.strictEqual(r, 0);
        }),

        q.min().done(function(r) {
            assert.deepEqual(r, NaN);
        }),

        q.max().done(function(r) {
            assert.deepEqual(r, NaN);
        }),

        q.avg().done(function(r) {
            assert.deepEqual(r, NaN);
        })

    ).done(done);
});

QUnit.module('Select');

QUnit.test('select', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY([42])
        .select(function(obj) { return obj - 41; })
        .enumerate()
        .done(function(r) {
            assert.deepEqual(r, [1]);
            done();
        });
});

QUnit.test('select with prop name list', function(assert) {
    const done = assert.async();

    const data = [
        { a: 'A', b: 'B', c: 'C' }
    ];

    $.when(

        QUERY(data).select('a', 'c', 'missing').enumerate().done(function(r) {
            assert.deepEqual(r, [{ a: 'A', c: 'C' }]);
        }),

        QUERY(data).select(['a', 'c']).enumerate().done(function(r) {
            assert.deepEqual(r, [{ a: 'A', c: 'C' }]);
        })

    ).done(done);
});

QUnit.test('select single property returns object', function(assert) {
    const done = assert.async();
    const data = [{ a: 'A' }];

    QUERY(data)
        .select('a')
        .enumerate()
        .done(function(r) {
            assert.deepEqual(r, data);
            done();
        });
});

QUnit.module('Slice');

QUnit.test('slice', function(assert) {
    assert.expect(3);

    const done = assert.async();
    const q = QUERY([1, 2, 3]);

    $.when(

        q.slice(-1, 1).enumerate().done(function(r) {
            assert.deepEqual(r, [1]);
        }),

        q.slice(2).enumerate().done(function(r) {
            assert.deepEqual(r, [3]);
        }),

        q.slice(1, 100).enumerate().done(function(r) {
            assert.deepEqual(r, [2, 3]);
        })

    ).done(done);
});

QUnit.test('slice reset method', function(assert) {
    assert.expect(2);

    const done = assert.async();
    const q = QUERY([1, 2, 3]).slice(1, 1);

    $.when(
        q.enumerate().done(function(r) {
            assert.deepEqual(r, [2]);
        })
    ).done(function() {
        q.enumerate().done(function(r) {
            assert.deepEqual(r, [2], 'reset iterator');
            done();
        });
    });
});

QUnit.module('Error handling');

QUnit.test('error handlers (enumerate)', function(assert) {
    const helper = new ErrorHandlingHelper();

    helper.run(function() {
        return QUERY([1], { errorHandler: helper.optionalHandler })
            .select(function() { throw Error('test'); })
            .enumerate();
    }, assert.async(), assert);
});

QUnit.test('error handlers (aggregate)', function(assert) {
    const helper = new ErrorHandlingHelper();

    helper.run(function() {
        return QUERY([1, 2, 3], { errorHandler: helper.optionalHandler })
            .aggregate(function() { throw Error('test'); });
    }, assert.async(), assert);
});

QUnit.module('Regression tests');

QUnit.test('re-enumeration of changed data (sorting)', function(assert) {
    const done = assert.async();
    const data = [2, 1];
    const q = QUERY(data).sortBy();

    $.when(
        q.enumerate()
    ).done(function() {
        data.splice(0, Number.MAX_VALUE, 5, 3);
        q.enumerate().done(function(r) {
            assert.deepEqual(r, [3, 5]);
            done();
        });
    });
});

QUnit.test('re-enumeration of changed data (grouping)', function(assert) {
    const done = assert.async();
    const data = [1, 2, 3];
    const q = QUERY(data).groupBy();

    $.when(
        q.enumerate()
    ).done(function() {
        data.splice(0, Number.MAX_VALUE, 9, 9);
        q.enumerate().done(function(g) {
            assert.equal(g.length, 1);
            assert.equal(g[0].key, 9);
            done();
        });
    });
});

QUnit.test('special for javascript cases (filtering)', function(assert) {
    const done = assert.async();
    const data = ['', 0, false, undefined, null];
    const query = QUERY(data);

    $.when(
        query.filter(['this', 0]).enumerate().done(function(r) {
            assert.equal(r.length, 1);
            assert.equal(r[0], 0);
        }),

        query.filter(['this', '']).enumerate().done(function(r) {
            assert.equal(r.length, 1);
            assert.equal(r[0], '');
        }),

        query.filter(['this', false]).enumerate().done(function(r) {
            assert.equal(r.length, 1);
            assert.equal(r[0], false);
        }),

        query.filter(['this', null]).enumerate().done(function(r) {
            assert.equal(r.length, 2);
            assert.equal(r[0], null);
        }),

        query.filter(['this', undefined]).enumerate().done(function(r) {
            assert.equal(r.length, 2);
            assert.equal(r[0], undefined);
        })
    ).done(function() {
        done();
    });
});
