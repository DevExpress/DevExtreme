const $ = require('jquery');

const SLIDER_HANDLE_CLASS = 'dx-slider-handle';
const TOOLTIP_CLASS = 'dx-tooltip';

QUnit.testStart(function() {
    const markup = `
        <div id="slider"></div>
        <div id="widget"></div>
        <div id="widthRootStyle"></div>`;

    $('#qunit-fixture').html(markup);
    $('#widthRootStyle').css('width', '300px');
});

QUnit.test('there is no tooltip in markup on server', function(assert) {
    const $slider = $('#slider').dxSlider({
        tooltip: {
            enabled: true,
            showMode: 'always'
        }
    });

    const $handle = $slider.find('.' + SLIDER_HANDLE_CLASS);
    const $tooltip = $handle.find('.' + TOOLTIP_CLASS);

    assert.notOk($tooltip.length);
});

require('../DevExpress.ui.widgets.editors/slider.markup.tests.js');

