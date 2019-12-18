var $ = require('jquery');

QUnit.test('data', function(assert) {

    $.each([
        'Guid',
        'base64_encode',
        'query',
        'Store',
        'ArrayStore',
        'CustomStore',
        'LocalStore',
        'DataSource'
    ], function(_, namespace) {
        assert.ok(DevExpress.data[namespace], 'DevExpress.data.' + namespace + ' present');
    });

});
