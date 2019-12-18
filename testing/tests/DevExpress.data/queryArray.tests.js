import $ from 'jquery';
import QUERY from 'data/query';
import ErrorHandlingHelper from '../../helpers/data.errorHandlingHelper.js';

QUnit.module('Misc');

QUnit.test('no operations', function(assert) {
    assert.expect(2);

    var done = assert.async(),
        q = QUERY([1, 2, 3]);

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

    var done = assert.async();

    var input = [
        { name: 'alex', age: 21 },
        { name: 'bob', age: 0 },
        { name: 'alex', age: 27 }
    ];

    var output = [
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

    var done = assert.async(),
        input = [2, 1, 3],
        output = [3, 2, 1];

    QUERY(input).sortBy(function(item) { return 3 - item; }).enumerate().done(function(r) {
        assert.deepEqual(r, output);
        done();
    });
});

QUnit.test('sort using compare function', function(assert) {
    assert.expect(1);

    var done = assert.async(),
        input = [2, 1, 3],
        output = [3, 1, 2];

    QUERY(input).sortBy('this', false, function(x, y) {
        return output.indexOf(x) - output.indexOf(y);
    }).enumerate().done(function(r) {
        assert.deepEqual(r, output);
        done();
    });
});

QUnit.test('thenBy with compare function', function(assert) {
    assert.expect(1);

    var done = assert.async(),
        input = [2, 1, 3],
        output = [3, 1, 2];

    QUERY(input).sortBy('fake').thenBy('this', false, function(x, y) {
        return output.indexOf(x) - output.indexOf(y);
    }).enumerate().done(function(r) {
        assert.deepEqual(r, output);
        done();
    });
});

QUnit.test('sort using compare function and getter', function(assert) {
    assert.expect(1);

    var done = assert.async(),
        order = [2, 1],
        input = [{ val: 1 }, { val: 2 }],
        output = [{ val: 2 }, { val: 1 }];

    QUERY(input).sortBy('val', false, function(x, y) {
        return order.indexOf(x) - order.indexOf(y);
    }).enumerate().done(function(r) {
        assert.deepEqual(r, output);
        done();
    });
});

QUnit.test('sort using compare function if desc is true', function(assert) {
    assert.expect(1);

    var done = assert.async(),
        input = [2, 1, 3],
        output = [3, 1, 2];

    QUERY(input).sortBy('this', true, function(x, y) {
        return output.indexOf(x) - output.indexOf(y);
    }).enumerate().done(function(r) {
        assert.deepEqual(r, output.slice().reverse());
        done();
    });
});

QUnit.test('compare function arguments should not be normalized via toComparable', function(assert) {
    assert.expect(1);

    var done = assert.async(),
        input = ['A', 'a', 'B'],
        output = ['A', 'B', 'a'];

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

    var done = assert.async();

    QUERY([2, 1]).sortBy().enumerate().done(function(r) {
        assert.deepEqual(r, [1, 2]);
        done();
    });
});

QUnit.test('applying sort does not modify original query', function(assert) {
    assert.expect(2);

    var done = assert.async(),
        q = QUERY([2, 1]),
        sorted = q.sortBy();

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

    var done = assert.async(),
        data = [2, 1, 3],
        q = QUERY(data);

    q = q.sortBy(function(i) { return i; });
    q = q.sortBy(function(i) { return 10 - i; });
    q.enumerate().done(function(r) {
        assert.deepEqual(r, [3, 2, 1]);
        done();
    });
});

QUnit.test('sort uses getter', function(assert) {
    assert.expect(1);

    var done = assert.async(),
        data = [new Date(2011, 11, 22), new Date(2011, 10, 1)];
    QUERY(data).sortBy('getMonth').enumerate().done(function(r) {
        assert.equal(r[0].getMonth(), 10);
        done();
    });
});

QUnit.test('string are supported and letter case is ignored', function(assert) {
    var done = assert.async(),
        data = ['Z', 'a'];
    QUERY(data).sortBy().enumerate().done(function(r) {
        assert.deepEqual(r, ['a', 'Z']);
        done();
    });
});

QUnit.test('sort with falsy null and undefined values', function(assert) {
    // NOTE: http://www.ecma-international.org/ecma-262/6.0/#sec-sortcompare
    var data;
    var sort = function(data, desc) {
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
    var done = assert.async();

    var data = [
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

    var done = assert.async(),
        input = [2, 0, 5];

    var q1 = QUERY(input).filter(function(i) { return i > 1; }),
        q2 = q1.filter(function(i) { return i < 5; });

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
    assert.expect(6);

    var done = assert.async(),
        input = [{ f: 1 }, { f: 2 }];

    var check = function(crit, expectation) {
        return QUERY(input).filter(crit).enumerate().done(function(r) {
            assert.deepEqual(r, expectation);
        });
    };

    $.when(
        check(['f', '=', 2], [{ f: 2 }]),
        check(['f', '<>', 2], [{ f: 1 }]),
        check(['f', '>', 1], [{ f: 2 }]),
        check(['f', '>=', 2], [{ f: 2 }]),
        check(['f', '<', 2], [{ f: 1 }]),
        check(['f', '<=', 1], [{ f: 1 }])
    ).done(function() {
        done();
    });
});

QUnit.test('filter with functional getter', function(assert) {
    assert.expect(1);

    var done = assert.async(),
        input = [{ f: 1 }, { f: 2 }],
        getter = function(obj) { return obj.f * 2; };

    QUERY(input).filter([getter, '=', 4]).enumerate().done(function(r) {
        assert.deepEqual(r, [{ f: 2 }]);
        done();
    });
});

QUnit.test('missing operation means equal', function(assert) {
    assert.expect(1);

    var done = assert.async(),
        input = [{ f: 42 }];


    QUERY(input).filter(['f', 42]).enumerate().done(function(r) {
        assert.deepEqual(r, input);
        done();
    });
});

QUnit.test('missing value means true', function(assert) {
    assert.expect(1);

    var done = assert.async(),
        input = [{ f: true }];

    QUERY(input).filter(['f']).enumerate().done(function(r) {
        assert.deepEqual(r, input);
        done();
    });
});

QUnit.test('skip null and undefined values for string field', function(assert) {
    assert.expect(1);

    var done = assert.async(),
        input = [{ f: null }, { f: undefined }, { f: 'abc' }];

    QUERY(input).filter(['f', 'contains', 'b']).enumerate().done(function(r) {
        assert.deepEqual(r, [{ f: 'abc' }]);
        done();
    });
});

QUnit.test('when arguments are not array', function(assert) {
    assert.expect(1);

    var done = assert.async(),
        input = [{ f: 42 }];

    QUERY(input).filter('f', 42).enumerate().done(function(r) {
        assert.deepEqual(r, input);
        done();
    });
});

QUnit.test('AND', function(assert) {
    assert.expect(4);

    var done = assert.async(),
        input = [{ f: 1 }, { f: 2 }, { f: 3 }],
        cond1 = ['f', '>', 1],
        cond2 = ['f', '<', 3];

    var check = function(op) {
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

    var done = assert.async(),
        input = [{ f: 1 }, { f: 2 }, { f: 3 }],
        cond1 = ['f', 1],
        cond2 = ['f', 3];

    var check = function(op) {
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

    var done = assert.async(),
        input = [{ f: 1 }, { f: 2 }, { f: 3 }],
        crit = [
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

    var done = assert.async();

    var check = function(op) {
        var callCount = 0;

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

    var done = assert.async(),
        input = [{ f: 'a' }, { f: 'ab' }, { f: 'abc' }];


    var check = function(crit, expectation) {
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

    var done = assert.async(),
        input = [{ f: 'abc' }];

    QUERY(input).filter('f', 'CoNtAiNs', 'b').enumerate().done(function(r) {
        assert.deepEqual(r, input);
        done();
    });
});

QUnit.test('letter case in string values does not matter', function(assert) {
    assert.expect(1);

    var done = assert.async(),
        input = [{ f: 'Abc' }];

    QUERY(input).filter(['f', 'aBc']).enumerate().done(function(r) {
        assert.deepEqual(r, input);
        done();
    });
});

QUnit.test('date', function(assert) {
    assert.expect(1);

    var done = assert.async();

    var ms = new Date().valueOf(),
        input = [
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

    var done = assert.async(),
        data = [new Date(2011, 11, 22), new Date(2011, 10, 1)];

    QUERY(data).filter('getMonth', 10).enumerate().done(function(r) {
        assert.equal(r[0].getMonth(), 10);
        done();
    });
});

QUnit.test('filter array and func regression', function(assert) {
    var done = assert.async();

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
    var done = assert.async();

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

    var done = assert.async(),
        input = [{ f: 'a' }, { f: 'ab' }, { f: 'abc' }],
        cond = ['f', 'startswith', 'ab'];

    var check = function(op) {
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

    var done = assert.async(),
        input = [{ f: 1 }, { f: 2 }, { f: 3 }],
        cond1 = ['f', '>=', 2],
        cond2 = ['f', '<>', 3];

    var check = function(op) {
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

QUnit.module('Grouping');

QUnit.test('basic usage', function(assert) {
    var done = assert.async();

    var input = [
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

    var done = assert.async(),
        data = [new Date(2011, 10, 1)];

    QUERY(data).groupBy('getMonth').enumerate().done(function(groups) {
        assert.equal(groups[0].key, 10);
        done();
    });
});

QUnit.test('T348632: Rows in a group with an undefined group value are not sorted', function(assert) {

    var data = [
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

    var done = assert.async();

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

    var done = assert.async();
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

    var done = assert.async(),
        q = QUERY([{ f: 1 }, { f: 3 }]);

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
    var done = assert.async(),
        q = QUERY([]);

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

    var done = assert.async();

    QUERY([42])
        .select(function(obj) { return obj - 41; })
        .enumerate()
        .done(function(r) {
            assert.deepEqual(r, [1]);
            done();
        });
});

QUnit.test('select with prop name list', function(assert) {
    var done = assert.async();

    var data = [
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
    var done = assert.async(),
        data = [{ a: 'A' }];

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

    var done = assert.async(),
        q = QUERY([1, 2, 3]);

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

    var done = assert.async(),
        q = QUERY([1, 2, 3]).slice(1, 1);

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
    var helper = new ErrorHandlingHelper();

    helper.run(function() {
        return QUERY([1], { errorHandler: helper.optionalHandler })
            .select(function() { throw Error('test'); })
            .enumerate();
    }, assert.async(), assert);
});

QUnit.test('error handlers (aggregate)', function(assert) {
    var helper = new ErrorHandlingHelper();

    helper.run(function() {
        return QUERY([1, 2, 3], { errorHandler: helper.optionalHandler })
            .aggregate(function() { throw Error('test'); });
    }, assert.async(), assert);
});

QUnit.module('Regression tests');

QUnit.test('re-enumeration of changed data (sorting)', function(assert) {
    var done = assert.async(),
        data = [2, 1],
        q = QUERY(data).sortBy();

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
    var done = assert.async(),
        data = [1, 2, 3],
        q = QUERY(data).groupBy();

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
    var done = assert.async(),
        data = ['', 0, false, undefined, null],
        query = QUERY(data);

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
