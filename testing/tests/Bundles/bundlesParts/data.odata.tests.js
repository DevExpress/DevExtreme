const $ = require('jquery');

QUnit.test('data.odata', function(assert) {

    $.each([
        'EdmLiteral',
        'ODataStore',
        'ODataContext'
    ], function(_, namespace) {
        assert.ok(DevExpress.data[namespace], 'DevExpress.data.' + namespace + ' present');
    });

    $.each([
        'keyConverters'
    ], function(_, namespace) {
        assert.ok(DevExpress.data.utils.odata[namespace], 'DevExpress.data.utils.odata' + namespace + ' present');
    });

});
