import 'integration/knockout';

import $ from 'jquery';
import ko from 'knockout';
import dataUtils from 'core/element_data';

import 'ui/defer_rendering';

QUnit.testStart(function() {
    const markup =
        '<div id="renderDelegateWithWithBinding">\
            <div data-bind="dxDeferRendering: {}">\
                <!-- ko with: innerObject -->\
                <div class="item1" data-bind="text: message">initial</div>\
                <!-- /ko -->\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});


QUnit.module('dxDeferRendering');

QUnit.test('render with the \'with\' binding', function(assert) {
    const done = assert.async();
    const vm = {
        innerObject: {
            message: 'content'
        }
    };
    const $test = $('#renderDelegateWithWithBinding');

    ko.applyBindings(vm, $test.get(0));

    assert.equal($test.find('.item1').text(), 'initial');
    const render = dataUtils.data($test.find('.dx-pending-rendering').get(0), 'dx-render-delegate');
    render().done(function() {
        assert.equal($test.find('.item1').text(), 'content');
        done();
    });
});
