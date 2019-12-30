const $ = require('jquery');

QUnit.test('core', function(assert) {

    $.each([
        'hideTopOverlay',
        'devices',
        'registerComponent'
    ], function(_, namespace) {
        assert.ok(DevExpress[namespace], 'DevExpress.' + namespace + ' present');
    });

});
