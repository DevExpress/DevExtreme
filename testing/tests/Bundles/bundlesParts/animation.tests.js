var $ = require('jquery');

QUnit.test('animation', function(assert) {

    $.each([
        'fx',
        'animationPresets',
        'TransitionExecutor'
    ], function(_, namespace) {
        assert.ok(DevExpress[namespace], 'DevExpress.' + namespace + ' present');
    });

});
