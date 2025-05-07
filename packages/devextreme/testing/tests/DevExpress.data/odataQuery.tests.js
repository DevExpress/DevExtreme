import $ from 'jquery';
import { EdmLiteral } from 'common/data/odata/utils';
import query from 'common/data/query';
import config from 'core/config';
import ErrorHandlingHelper from '../../helpers/data.errorHandlingHelper.js';
import ajaxMock from '../../helpers/ajaxMock.js';

import 'common/data/odata/query_adapter';

const MUST_NOT_REACH_MESSAGE = 'Shouldn\'t reach this point';

function QUERY(url, options) {
    return query(url, $.extend({ adapter: 'odata' }, options));
}

const moduleConfig = {
    afterEach: function() {
        ajaxMock.clear();
    }
};

const moduleWithMockConfig = {
    beforeEach: function() {
        ajaxMock.setup({
            url: 'odata.org',
            callback: function(bag) {
                this.responseText = { value: [bag] };
            }
        });
    },

    afterEach: function() {
        moduleConfig.afterEach.apply(this, arguments);
    }
};

QUnit.module('Common', moduleConfig);
QUnit.test('existing query string is kept', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'url?customParam=1',
        callback: function(bag) {
            this.responseText = { value: [bag] };
        }
    });

    QUERY('url?customParam=1')
        .sortBy('f')
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.ok(r[0].url.indexOf('customParam'));
        })
        .always(done);
});

QUnit.test('Custom headers, query string params, async and request timeout (beforeSend event)', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        callback: function(bag) {
            this.responseText = { value: [bag] };
        }
    });

    const beforeSend = function(options) {
        assert.equal(options.async, true);
        assert.equal(options.method, 'get');
        assert.equal(options.timeout, 30000);

        options.async = false;
        options.timeout = 1122;
        options.params.myParam = 111;
        options.headers['x-my-header'] = 222;
    };

    QUERY('odata.org', { beforeSend: beforeSend })
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.equal(r[0].async, false);
            assert.equal(r[0].timeout, 1122);
            assert.equal(r[0].data.myParam, 111);
            assert.equal(r[0].headers['x-my-header'], 222);
        })
        .always(function() {
            ajaxMock.clear();
        })
        .always(done);
});

QUnit.test('JSONP for cross-domain requests', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        callback: function(bag) {
            assert.equal(bag.dataType, 'jsonp');
            assert.equal(bag.data.$format, 'json', 'JSONPSupportBehavior requirement');

            this.responseText = { value: [1, 2, 3] };
        }
    });

    QUERY('odata.org', { jsonp: true })
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.deepEqual(r, [1, 2, 3]);
        })
        .always(function() {
            ajaxMock.clear();
        })
        .always(done);
});


QUnit.module('Query string generation', moduleWithMockConfig);
QUnit.test('sort', function(assert) {
    assert.expect(2);

    const done = assert.async();

    const check = function(desc, expectation) {
        return QUERY('odata.org')
            .sortBy('a', desc)
            .enumerate()
            .done(function(r) {
                assert.equal(r[0].data['$orderby'], expectation);
            });
    };

    $.when(check(false, 'a'), check(true, 'a desc'))
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('second sortBy overrides the first', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY('odata.org')
        .sortBy('name1')
        .sortBy('name2')
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.equal(r[0].data['$orderby'], 'name2');
        })
        .always(done);
});

QUnit.test('thenBy', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY('odata.org')
        .sortBy('name1')
        .thenBy('name2')
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.equal(r[0].data['$orderby'], 'name1,name2');
        })
        .always(done);
});

QUnit.test('sortBy nested fields', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY('odata.org')
        .sortBy('a.b.c')
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.equal(r[0].data['$orderby'], 'a/b/c');
        })
        .always(done);
});

QUnit.test('slice', function(assert) {
    assert.expect(8);

    const done = assert.async();

    const check = function(skip, take, expectSkip) {
        return QUERY('odata.org')
            .slice(skip, take)
            .enumerate()
            .done(function(r) {
                assert.equal(r[0].data['$skip'], expectSkip);
                assert.equal(r[0].data['$top'], take);
            });
    };

    $.when(check(2, 3, 2), check(0, 2, undefined), check(2, 0, 2), check(5, undefined, 5))
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('select', function(assert) {
    const done = assert.async();

    QUERY('odata.org', { version: 2 })
        .select('a.x', 'a.y', 'b')
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.equal(r[0].data['$select'], 'a/x,a/y,b');
            assert.equal(r[0].data['$expand'], 'a');
        })
        .always(done);
});

QUnit.test('expand to third level', function(assert) {
    const done = assert.async();

    QUERY('odata.org', { version: 2 })
        .select('a.b.c')
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.equal(r[0].data['$expand'], 'a/b');
        })
        .always(done);
});

QUnit.test('select and expand in OData 4', function(assert) {
    const done = assert.async();

    const checker = function(selectClause, expandClause) {
        const options = { version: 4 };

        if(expandClause) {
            options.expand = expandClause;
        }

        let q = QUERY('odata.org', options);
        if(selectClause) {
            q = q.select(selectClause);
        }

        return q.enumerate();
    };

    const promises = [
        checker(['a.x', 'a.y.z'], null)
            .done(function(results) {
                assert.deepEqual(results[0].data, {
                    $expand: 'a($select=x;$expand=y($select=z))',
                });
            }),

        checker(null, ['a.b', 'a.b.c', 'a.b.c.d'])
            .done(function(results) {
                assert.deepEqual(results[0].data, {
                    $expand: 'a($expand=b($expand=c($expand=d)))'
                });
            }),

        checker(
            ['*'],
            ['b']
        ).done(function(results) {
            assert.deepEqual(results[0].data, {
                $expand: 'b',
                $select: '*'
            });
        }),

        checker(
            ['a'],
            ['b.c']
        ).done(function(results) {
            assert.deepEqual(results[0].data, {
                $expand: 'b($expand=c)',
                $select: 'a'
            });
        }),

        checker(
            ['a.b.c'],
            ['a.b']
        ).done(function(results) {
            assert.deepEqual(results[0].data, {
                $expand: 'a($expand=b($select=c))'
            });
        }),

        checker(
            ['a.a1.a11', 'a.a2.a21', 'a.a2.a22', 'a.a2.a23.*', 'b'],
            ['x']
        ).done(function(results) {
            assert.deepEqual(results[0].data, {
                $expand: 'x,a($expand=a1($select=a11),a2($select=a21,a22;$expand=a23($select=*)))',
                $select: 'b'
            });
        })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false);
        })
        .always(done);
});

QUnit.module('Dates transformation', moduleConfig);
QUnit.test('works', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        responseText: { d: { results: [] } },
        callback: function(bag) {
            const expected = [
                '(date eq datetime\'1996-07-04T01:01:01.001\')',
                '(date eq datetime\'1996-07-04T01:01:01.010\')',
                '(date eq datetime\'1996-07-04T01:01:01.100\')',
                '(date eq datetime\'1996-07-04T01:01:01.123\')'
            ].join(' and ');

            assert.equal(bag.data.$filter, expected, 'second version should transform date to datetime\'yyyy-mm-ddThh:mm[:ss[.fffffff]]\' format');
        }
    });

    ajaxMock.setup({
        url: 'odata4.org',
        responseText: { d: { results: [] } },
        callback: function(bag) {
            const expected = [
                '(date eq 1996-07-04T01:01:01.001Z)',
                '(date eq 1996-07-04T01:01:01.010Z)',
                '(date eq 1996-07-04T01:01:01.100Z)',
                '(date eq 1996-07-04T01:01:01.123Z)'
            ].join(' and ');

            assert.equal(bag.data.$filter, expected, 'fourth version should transform date to ISO8601 like format');
        }
    });

    const promises = [
        QUERY('odata.org', { version: 2 })
            .filter([
                ['date', new Date(1996, 6, 4, 1, 1, 1, 1)],
                ['date', new Date(1996, 6, 4, 1, 1, 1, 10)],
                ['date', new Date(1996, 6, 4, 1, 1, 1, 100)],
                ['date', new Date(1996, 6, 4, 1, 1, 1, 123)]
            ])
            .enumerate(),

        QUERY('odata4.org')
            .filter([
                ['date', new Date(1996, 6, 4, 1, 1, 1, 1)],
                ['date', new Date(1996, 6, 4, 1, 1, 1, 10)],
                ['date', new Date(1996, 6, 4, 1, 1, 1, 100)],
                ['date', new Date(1996, 6, 4, 1, 1, 1, 123)]
            ])
            .enumerate()
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.module('Criteria transformation', moduleWithMockConfig);
QUnit.test('comparison operators', function(assert) {
    assert.expect(6);

    const done = assert.async();

    const check = function(criteria, expectation) {
        return QUERY('odata.org')
            .filter(criteria)
            .enumerate()
            .done(function(r) {
                assert.equal(r[0].data['$filter'], expectation);
            });
    };

    const promises = [
        check(['f', '=', 2], 'f eq 2'),
        check(['f', '<>', 2], 'f ne 2'),
        check(['f', '>', 2], 'f gt 2'),
        check(['f', '>=', 2], 'f ge 2'),
        check(['f', '<', 2], 'f lt 2'),
        check(['f', '<=', 2], 'f le 2')
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('unknown filter operation', function(assert) {
    QUERY('odata.org')
        .filter('a', 'nonsense', 'b')
        .enumerate()
        .fail(function(error) {
            assert.ok(/unknown filter/i.test(error.message));
        })
        .done(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        });
});

QUnit.test('mixin and/or conditions inside a single group throws', function(assert) {
    assert.expect(4);

    const mustNotReach = function() {
        assert.ok(false, 'Shouldn\'t reach this point');
    };

    QUERY('odata.org')
        .filter([
            ['foo'],
            ['bar'],
            'or',
            ['foobar']
        ])
        .enumerate()
        .done(mustNotReach)
        .fail(function() {
            assert.ok(true);
        });

    QUERY('odata.org')
        .filter([
            ['foo'],
            '&&',
            ['bar'],
            '||',
            ['foobar']
        ])
        .enumerate()
        .done(mustNotReach)
        .fail(function() {
            assert.ok(true);
        });

    QUERY('odata.org')
        .filter([
            ['foo'],
            'or',
            ['bar'],
            ['foobar']
        ])
        .enumerate()
        .done(mustNotReach)
        .fail(function() {
            assert.ok(true);
        });

    QUERY('odata.org')
        .filter([
            ['foo'],
            'or',
            ['bar'],
            'and',
            ['foobar']
        ])
        .enumerate()
        .done(mustNotReach)
        .fail(function() {
            assert.ok(true);
        });
});

QUnit.test('OR', function(assert) {
    assert.expect(2);

    const done = assert.async();

    const check = function(criteria) {
        return QUERY('odata.org')
            .filter(criteria)
            .enumerate()
            .done(function(r) {
                assert.equal(r[0].data['$filter'], '(f eq 2) or (k ge 4)');
            });
    };

    $.when(check([['f', '=', 2], 'or', ['k', '>=', 4]]), check([['f', '=', 2], '||', ['k', '>=', 4]]))
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('AND', function(assert) {
    assert.expect(2);

    const done = assert.async();

    const check = function(criteria) {
        return QUERY('odata.org')
            .filter(criteria)
            .enumerate()
            .done(function(r) {
                assert.equal(r[0].data['$filter'], '(f eq 2) and (k ge 4)');
            });
    };

    $.when(check([['f', '=', 2], 'and', ['k', '>=', 4]]), check([['f', '=', 2], '&&', ['k', '>=', 4]]))
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('chain produces AND', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY('odata.org')
        .filter(['f', '=', 2])
        .filter(['k', '>=', 4])
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.equal(r[0].data['$filter'], '(f eq 2) and (k ge 4)');
        })
        .always(done);
});

QUnit.test('NOT with binary operation', function(assert) {
    const done = assert.async();

    const check = function(criteria) {
        return QUERY('odata.org')
            .filter(criteria)
            .enumerate()
            .done(function(r) {
                assert.equal(r[0].data['$filter'], 'not (f gt 2)');
            });
    };

    $.when(
        check(['!', ['f', '>', 2]]))
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('NOT with group operation', function(assert) {
    const done = assert.async();

    const check = function(criteria) {
        return QUERY('odata.org')
            .filter(criteria)
            .enumerate()
            .done(function(r) {
                assert.equal(r[0].data['$filter'], 'not ((f gt 2) and (k ne \'ab\'))');
            });
    };

    $.when(
        check(['!', [['f', '>', 2], '&&', ['k', '<>', 'ab']]]))
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('string values', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY('odata.org')
        .filter(['f', '=', 'a\'b<a'])
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.equal(r[0].data['$filter'], 'f eq \'a\'\'b<a\'');
        })
        .always(done);
});

QUnit.test('child field', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY('odata.org')
        .filter('a.b')
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.equal(r[0].data['$filter'], 'a/b eq true');
        })
        .always(done);
});

QUnit.test('missing operation means equal', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY('odata.org')
        .filter(['f', 2])
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.equal(r[0].data['$filter'], 'f eq 2');
        })
        .always(done);
});

QUnit.test('missing value means true', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY('odata.org')
        .filter(['f'])
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.equal(r[0].data['$filter'], 'f eq true');
        })
        .always(done);
});

QUnit.test('missing logic operator means AND', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY('odata.org')
        .filter([['f', '=', 1], ['k', '>', 2]])
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.equal(r[0].data['$filter'], '(f eq 1) and (k gt 2)');
        })
        .always(done);
});

QUnit.test('when arguments are not array', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY('odata.org')
        .filter('f', '=', 1)
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.equal(r[0].data['$filter'], 'f eq 1');
        })
        .always(done);
});

QUnit.test('string functions', function(assert) {
    assert.expect(4);

    const done = assert.async();

    const check = function(operation, expectation) {
        return QUERY('odata.org', { version: 2 })
            .filter('f.p', operation, 'Ab')
            .enumerate()
            .done(function(r) {
                assert.equal(r[0].data['$filter'], expectation);
            });
    };

    const promises = [
        check('startsWith', 'startswith(tolower(f/p),\'ab\')'),
        check('endsWith', 'endswith(tolower(f/p),\'ab\')'),
        check('contains', 'substringof(\'ab\',tolower(f/p))'),
        check('notContains', 'not substringof(\'ab\',tolower(f/p))')
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('string functions with filterToLower equal false', function(assert) {
    assert.expect(4);

    const done = assert.async();

    const check = function(operation, expectation) {
        return QUERY('odata.org', { filterToLower: false, version: 2 })
            .filter('f.p', operation, 'Ab')
            .enumerate()
            .done(function(r) {
                assert.equal(r[0].data['$filter'], expectation);
            });
    };

    const promises = [
        check('startsWith', 'startswith(f/p,\'Ab\')'),
        check('endsWith', 'endswith(f/p,\'Ab\')'),
        check('contains', 'substringof(\'Ab\',f/p)'),
        check('notContains', 'not substringof(\'Ab\',f/p)')
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('string functions with global filterToLower equal false', function(assert) {
    assert.expect(4);

    const done = assert.async();

    config({ oDataFilterToLower: false });

    const check = function(operation, expectation) {
        return QUERY('odata.org', { version: 2 })
            .filter('f.p', operation, 'Ab')
            .enumerate()
            .done(function(r) {
                assert.equal(r[0].data['$filter'], expectation);
            });
    };

    const promises = [
        check('startsWith', 'startswith(f/p,\'Ab\')'),
        check('endsWith', 'endswith(f/p,\'Ab\')'),
        check('contains', 'substringof(\'Ab\',f/p)'),
        check('notContains', 'not substringof(\'Ab\',f/p)')
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(() => {
            config({ oDataFilterToLower: true });
            done();
        });
});

QUnit.test('string functions (v4)', function(assert) {
    assert.expect(4);

    const done = assert.async();

    const check = function(operation, expectation) {
        return QUERY('odata.org', { version: 4 })
            .filter('f.p', operation, 'Ab')
            .enumerate()
            .done(function(r) {
                assert.equal(r[0].data['$filter'], expectation);
            });
    };

    const promises = [
        check('startsWith', 'startswith(tolower(f/p),\'ab\')'),
        check('endsWith', 'endswith(tolower(f/p),\'ab\')'),
        check('contains', 'contains(tolower(f/p),\'ab\')'),
        check('notContains', 'not contains(tolower(f/p),\'ab\')')
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('string functions (v4) with filterToLower equal false', function(assert) {
    assert.expect(4);

    const done = assert.async();

    const check = function(operation, expectation) {
        return QUERY('odata.org', { version: 4, filterToLower: false })
            .filter('f.p', operation, 'Ab')
            .enumerate()
            .done(function(r) {
                assert.equal(r[0].data['$filter'], expectation);
            });
    };

    const promises = [
        check('startsWith', 'startswith(f/p,\'Ab\')'),
        check('endsWith', 'endswith(f/p,\'Ab\')'),
        check('contains', 'contains(f/p,\'Ab\')'),
        check('notContains', 'not contains(f/p,\'Ab\')')
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('string functions (v4) with global filterToLower equal false', function(assert) {
    assert.expect(4);

    const done = assert.async();

    config({ oDataFilterToLower: false });

    const check = function(operation, expectation) {
        return QUERY('odata.org', { version: 4 })
            .filter('f.p', operation, 'Ab')
            .enumerate()
            .done(function(r) {
                assert.equal(r[0].data['$filter'], expectation);
            });
    };

    const promises = [
        check('startsWith', 'startswith(f/p,\'Ab\')'),
        check('endsWith', 'endswith(f/p,\'Ab\')'),
        check('contains', 'contains(f/p,\'Ab\')'),
        check('notContains', 'not contains(f/p,\'Ab\')')
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(() => {
            config({ oDataFilterToLower: true });
            done();
        });
});

QUnit.test('Explicit Edm literals (Q441230 case)', function(assert) {
    const done = assert.async();

    QUERY('odata.org')
        .filter('x', new EdmLiteral('123M'))
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.equal(r[0].data.$filter, 'x eq 123M');
        })
        .always(done);
});

QUnit.test('Edm literals for case conversion (Q522002)', function(assert) {
    const done = assert.async();

    QUERY('odata.org', { version: 2 })
        .filter(new EdmLiteral('tolower(Name)'), 'contains', new EdmLiteral('tolower(\'abc\')'))
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.equal(r[0].data.$filter, 'substringof(tolower(\'abc\'),tolower(Name))');
        })
        .always(done);
});

QUnit.test('Values are converted according to \'fieldTypes\' property', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY('odata.org', {
        fieldTypes: {
            id1: 'Int64',
            name: 'String',
            total: 'Decimal' // T566307
        }
    })
        .filter([['id1', '=', 123], 'and', ['id2', '=', 456], 'and', ['name', '=', 789], 'and', ['total', '=', null]])
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.equal(r[0].data['$filter'], '(id1 eq 123L) and (id2 eq 456) and (name eq \'789\') and (total eq null)');
        })
        .always(done);
});

QUnit.module('Server side capabilities', moduleConfig);
QUnit.test('can be done on server: any number of sort and filter before slice, first select, first slice', function(assert) {
    assert.expect(2 * 5);

    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        callback: function(bag) {
            this.responseText = { value: [bag] };
        }
    });

    const assertFunc = function(r) {
        const d = r[0].data;

        assert.equal(d['$orderby'], 'a');
        assert.equal(d['$filter'], '(a gt 1) and (a lt 2)');
        assert.equal(d['$skip'], 3);
        assert.equal(d['$top'], 4);
        assert.equal(d['$select'], 'a');
    };

    const promises = [
        QUERY('odata.org')
            .sortBy('phantom')
            .filter(['a', '>', 1])
            .sortBy('a')
            .filter(['a', '<', 2])
            .slice(3, 4)
            .select('a')
            .enumerate()
            .done(assertFunc),

        QUERY('odata.org')
            .filter(['a', '>', 1])
            .select('a')
            .sortBy('a')
            .filter(['a', '<', 2])
            .slice(3, 4)
            .enumerate()
            .done(assertFunc)
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('count on server', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata2.org',
        responseText: { d: { __count: 123 } }
    });

    ajaxMock.setup({
        url: 'odata4.org',
        responseText: { '@odata.count': 321 }
    });

    const promises = [
        QUERY('odata2.org')
            .sortBy('x')
            .filter(['y', '=', 1])
            .slice(1, 2)
            .select('z')
            .count()
            .done(function(count) {
                assert.equal(count, 123);
            }),

        QUERY('odata4.org', { version: 4 })
            .sortBy('x')
            .filter(['y', '=', 1])
            .slice(1, 2)
            .select('z')
            .count()
            .done(function(count) {
                assert.equal(count, 321);
            })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('count rejects in case of non-number result', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata2.org',
        responseText: { d: { __count: undefined } }
    });

    ajaxMock.setup({
        url: 'odata4.org',
        responseText: { '@odata.count': undefined }
    });

    const assertFunc = function(err) {
        assert.ok(true);
        assert.equal(err.__id, 'E4018');
    };

    const promises = $.map([
        QUERY('odata2.org')
            .count()
            .fail(assertFunc),

        QUERY('odata4.org')
            .count()
            .fail(assertFunc)

    ], function(promise) {
        const d = $.Deferred();

        // NOTE: Reverse because of $.when
        promise.fail(d.resolve);
        promise.done(d.fail);

        return d.promise();
    });

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('enumerate with/without requireTotalCount', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        responseText: { d: { results: [] } },
        callback: function(bag) {
            assert.ok(!bag['$inlinecount']);
        }
    });

    ajaxMock.setup({
        url: 'odata.org/count',
        responseText: { d: { results: [], __count: 123 } },
        callback: function(bag) {
            assert.equal(bag.data['$inlinecount'], 'allpages');
        }
    });

    const promises = [
        QUERY('odata.org', { version: 2 })
            .enumerate()
            .done(function(r, extra) {
                assert.ok(!extra);
            }),

        QUERY('odata.org/count', { requireTotalCount: true, version: 2 })
            .enumerate()
            .done(function(r, extra) {
                assert.equal(extra.totalCount, 123);
            })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('$skiptoken support', function(assert) {
    assert.expect(2);

    const done = assert.async();

    // v2
    ajaxMock.setup({
        url: 'http://odata.org/DataSet',
        responseText: { d: { results: [1], __next: 'DataSet?$skipToken=1' } }
    });

    ajaxMock.setup({
        url: 'http://odata.org/DataSet?$skipToken=1',
        responseText: { d: { results: [2], __next: 'http://odata.org/DataSet?$skipToken=2' } }
    });

    ajaxMock.setup({
        url: 'http://odata.org/DataSet?$skipToken=2',
        responseText: { d: { results: [3] } }
    });

    // v4
    ajaxMock.setup({
        url: 'http://odata4.org/DataSet',
        responseText: { value: ['a'], '@odata.nextLink': 'DataSet?$skipToken=1' }
    });

    ajaxMock.setup({
        url: 'http://odata4.org/DataSet?$skipToken=1',
        responseText: { value: ['b'], '@odata.nextLink': 'http://odata4.org/DataSet?$skipToken=2' }
    });

    ajaxMock.setup({
        url: 'http://odata4.org/DataSet?$skipToken=2',
        responseText: { value: ['c'] }
    });

    const promises = [
        QUERY('http://odata.org/DataSet')
            .enumerate()
            .done(function(r) {
                assert.deepEqual(r, [1, 2, 3]);
            }),

        QUERY('http://odata4.org/DataSet')
            .enumerate()
            .done(function(r) {
                assert.deepEqual(r, ['a', 'b', 'c']);
            })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('T560045 - ignore next link when $top is specified', function(assert) {
    const done = assert.async();
    const urlPrefix = 'https://graph.microsoft.com/v1.0/me/messages';

    ajaxMock.setup({
        url: urlPrefix,
        callback: function(bag) {
            this.responseText = {
                '@odata.nextLink': urlPrefix + '?$top=1&$skip=' + (bag.data.$top + bag.data.$skip),
                'value': [ 1 ]
            };
        }
    });

    QUERY(urlPrefix)
        .slice(400, 1)
        .enumerate()
        .done(function(r) {
            assert.equal(r.length, 1);
            done();
        });
});

QUnit.test('Lift functional select after slice', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: '/',
        callback: function(bag) {
            assert.equal(bag.data.$top, 20);
            this.responseText = [];
        }
    });

    QUERY('/')
        .select(function(i) { return 2 * i; })
        .slice(0, 20)
        .enumerate()
        .done(done);
});

QUnit.module('Switching to array mode', moduleWithMockConfig);
QUnit.test('sort by function', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY('odata.org')
        .sortBy(function() { return 0; })
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.ok(!r[0].data['$orderby']);
        })
        .always(done);
});

QUnit.test('filter by function', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY('odata.org')
        .filter(function() { return true; })
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.ok(!r[0].data['$filter']);
        })
        .always(done);
});

QUnit.test('filter where getter is function', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY('odata.org')
        .filter([['url', 'odata.org'], 'and', [function(obj) { return true; }, true]])
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.ok(!r[0].data['$filter']);
        })
        .always(done);
});

QUnit.test('sort after slice', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY('odata.org')
        .slice(0, 10)
        .sortBy('a')
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.ok(!r[0].data['$orderby']);
        })
        .always(done);
});

QUnit.test('filter after slice', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY('odata.org')
        .slice(0, 10)
        .filter(['a', '<>', ''])
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.ok(!r[0].data['$filter']);
        })
        .always(done);
});

QUnit.test('select after select', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY('odata.org')
        .select('data', 'server')
        .select('data', 'client')
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.equal(r[0].data['$select'], 'data,server');
        })
        .always(done);
});

QUnit.test('select by function', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY('odata.org')
        .select(function(obj) { return obj; })
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.ok(!r[0].data['$select']);
        })
        .always(done);
});

QUnit.test('slice after slice', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY('odata.org')
        .slice(0, 20)
        .slice(0, 3)
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.equal(r[0].data['$top'], 20);
        })
        .always(done);
});

QUnit.module('Client side fallbacks', {
    beforeEach: function() {
        ajaxMock.setup({
            url: 'odata.org',
            responseText: {
                value: [
                    { id: 3, name: 'name1', group: 'a', bool: true },
                    { id: 2, name: 'name2', group: 'a', bool: false },
                    { id: 5, name: 'name3', group: 'b', bool: true },
                    { id: 1, name: 'name4', group: 'c', bool: false },
                    { id: 4, name: 'name5', group: 'c', bool: true }
                ]
            }
        });
    },
    afterEach: function() {
        moduleConfig.afterEach.apply(this, arguments);
    }
});

QUnit.test('groupBy', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY('odata.org')
        .groupBy('group')
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.equal(r.length, 3);
        })
        .always(done);
});

QUnit.test('sort by function', function(assert) {
    assert.expect(1);

    const done = assert.async();

    QUERY('odata.org')
        .sortBy(function(i) { return -i.id; })
        .select(function(i) { return i.id; })
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.deepEqual(r, [5, 4, 3, 2, 1]);
        })
        .always(done);
});

QUnit.test('aggregates', function(assert) {
    const done = assert.async();

    const promises = [
        QUERY('odata.org')
            .max('id')
            .done(function(max) {
                assert.equal(max, 5);
            }),

        QUERY('odata.org')
            .min('id')
            .done(function(min) {
                assert.equal(min, 1);
            }),

        QUERY('odata.org')
            .sum('id')
            .done(function(sum) {
                assert.equal(sum, 15);
            }),

        QUERY('odata.org')
            .avg('id')
            .done(function(avg) {
                assert.equal(avg, 3);
            }),

        QUERY('odata.org').aggregate(
            '<',
            function(accumulator, i) { return accumulator + i.id; },
            function(accumulator) { return accumulator + '>'; }
        ).done(function(r) {
            assert.equal(r, '<32514>');
        })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});


QUnit.module('Error handling', moduleConfig);
QUnit.test('generic HTTP error', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        status: 404,
        statusText: 'Not Found',
        responseText: 'Expected 404'
    });

    QUERY('odata.org')
        .enumerate()
        .fail(function(error) {
            assert.equal(error.message, 'Not Found');
        })
        .done(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('OData service error', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata2.org',
        responseText: { error: { message: 'expected message' } }
    });

    ajaxMock.setup({
        url: 'odata3.org',
        // In case of WCF implementation, the "error" key would be prefixed by "odata."
        responseText: { 'odata.error': { message: 'expected message' } }
    });

    ajaxMock.setup({
        url: 'odata4.org',
        responseText: { '@odata.error': { message: 'expected message' } }
    });

    function onDone() {
        assert.ok(false, MUST_NOT_REACH_MESSAGE);
    }

    function onFail(error) {
        assert.equal(error.message, 'expected message');
    }

    QUERY('odata2.org')
        .enumerate()
        .done(onDone)
        .fail(onFail)
        .fail(function() {

            QUERY('odata3.org')
                .enumerate()
                .done(onDone)
                .fail(onFail)
                .fail(function() {

                    QUERY('odata4.org')
                        .enumerate()
                        .done(onDone)
                        .fail(onFail)
                        .always(done);
                });
        });
});

QUnit.test('OData service error with details (UseVerboseErrors = true)', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        responseText: {
            error: { 'innererror': { message: 'expected inner message' } }
        }
    });

    QUERY('odata.org')
        .enumerate()
        .fail(function(error) {
            assert.equal(error.message, 'expected inner message');
        })
        .done(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('unexpected server response with 200 status', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        status: 200,
        jQueryTextStatus: 'parsererror',
        responseText: 'Server gone crazy'
    });

    QUERY('odata.org')
        .enumerate()
        .fail(function(error) {
            assert.ok('message' in error);
        })
        .done(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('server error via JSONP with 200 status', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        responseText: {
            error: {
                message: 'error via jsonp',
                code: 456
            }
        }
    });

    QUERY('odata.org', { jsonp: true })
        .enumerate()
        .fail(function(error) {
            assert.equal(error.message, 'error via jsonp');
            assert.equal(error.httpStatus, 456);
        })
        .done(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(function() {
            ajaxMock.clear();
        })
        .always(done);
});

QUnit.test('client error: before ajax', function(assert) {
    assert.expect(1);

    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        callback: function() { assert.ok(false, MUST_NOT_REACH_MESSAGE); }
    });

    QUERY('odata.org', { adapter: 'wrong adapter' })
        .enumerate()
        .fail(function(error) {
            assert.ok('message' in error);
        })
        .done(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('client error: after ajax', function(assert) {
    assert.expect(1);

    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        responseText: { value: [{}] }
    });

    QUERY('odata.org')
        .select(function(i) { return i.wrong.property; })
        .enumerate()
        .fail(function(error) {
            assert.ok('message' in error);
        })
        .done(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('error handlers: server-side error', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        status: 404,
        statusText: 'Not Found',
        responseText: 'Expected 404'
    });

    const helper = new ErrorHandlingHelper();
    helper.extraChecker = function(error) {
        assert.equal(error.message, 'Not Found');
    };

    helper.run(
        function() {
            return QUERY('odata.org', { errorHandler: helper.optionalHandler }).enumerate();
        },
        done,
        assert
    );
});

QUnit.test('error handlers: client-side error', function(assert) {
    const done = assert.async();

    ajaxMock.setup({ url: 'odata.org' });

    const helper = new ErrorHandlingHelper();
    helper.run(
        function() {
            return QUERY('odata.org', { errorHandler: helper.optionalHandler })
                .sortBy(function() { window.MISSING_GLOABAL_NAME; })
                .enumerate();
        },
        done,
        assert
    );
});

QUnit.module('T174721', moduleConfig);
QUnit.test('sortBy(str), thenBy(func)', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        responseText: {
            value: [{ str: 2, func: 'a' }, { str: 1, func: 'z' }, { str: 1, func: 'a' }]
        }
    });

    QUERY('odata.org')
        .sortBy('str')
        .thenBy(function(i) { return i.func; })
        .enumerate()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.deepEqual(r, [
                {
                    str: 1,
                    func: 'a'
                },
                {
                    str: 1,
                    func: 'z'
                },
                {
                    str: 2,
                    func: 'a'
                }
            ]);
        })
        .always(done);
});
