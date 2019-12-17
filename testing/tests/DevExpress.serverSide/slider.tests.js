var $ = require('jquery');

require('common.css!');


var SLIDER_HANDLE_CLASS = 'dx-slider-handle',
    TOOLTIP_CLASS = 'dx-tooltip';

QUnit.testStart(function() {
    var markup = '<div id="texteditor"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.test('there is no tooltip in markup on server', function(assert) {
    var $slider = $('#slider').dxSlider({
            tooltip: {
                enabled: true,
                showMode: 'always'
            },
            useInkRipple: false
        }),

        $handle = $slider.find('.' + SLIDER_HANDLE_CLASS),
        $tooltip = $handle.find('.' + TOOLTIP_CLASS);

    assert.notOk($tooltip.length);
});

require('../DevExpress.ui.widgets.editors/slider.markup.tests.js');

