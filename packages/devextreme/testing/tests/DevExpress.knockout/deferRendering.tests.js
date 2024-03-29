require('integration/knockout');

const $ = require('jquery');
const ko = require('knockout');
const dataUtils = require('core/element_data');

require('ui/defer_rendering');

const moduleWithoutCsp = QUnit.urlParams['nocsp'] ? QUnit.module : QUnit.module.skip;

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


moduleWithoutCsp('dxDeferRendering');

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
