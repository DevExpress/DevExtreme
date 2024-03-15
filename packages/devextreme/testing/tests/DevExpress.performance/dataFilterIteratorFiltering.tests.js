import QUERY from 'data/query';

QUnit.module('Filtering');

QUnit.test('execute quickly if criteria is huge sequence of ["prop", "=", value] filters are grouped by OR (T1217184)', function(assert) {
    const done = assert.async();
    const input = [...new Array(20000)].map((_, index) => ({ id: index }));
    const filters = [...new Array(5000)]
        .flatMap((_, index) => [['id', '=', index], 'or']);

    filters.pop();
    const startTime = Date.now();
    QUERY(input).filter(filters).enumerate().done((r) => {
        const executionTime = Date.now() - startTime;
        assert.ok(executionTime < 100, `Execution time is ${executionTime}. It must be less than 200ms`);
        assert.equal(r.length, 5000);

        done();
    });
});
