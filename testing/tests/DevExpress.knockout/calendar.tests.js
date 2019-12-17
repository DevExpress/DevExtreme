var $ = require('jquery'),
    ko = require('knockout');

require('integration/knockout');
require('ui/calendar');

QUnit.testStart(function() {
    var markup =
        '<div id="T354951" data-bind="dxCalendar: {}">\
            <div data-options="dxTemplate: { name: \'cell\' }">\
                <div class="root-model-data" data-bind="text: $root.text"></div>\
                <div class="model-data" data-bind="text: text"></div>\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});


QUnit.test('cellTemplate should have access to a $root model', function(assert) {
    var viewModel = {
        calendarConfig: {},
        text: ko.observable('rootModelData')
    };
    var $calendar = $('#T354951');
    ko.applyBindings(viewModel, $calendar.get(0));

    assert.equal($.trim($calendar.find('.root-model-data').first().text()), 'rootModelData', 'cellTemplate get access to $root model');
    assert.notEqual($.trim($calendar.find('.model-data').first().text()), 'rootModelData', 'cellTemplate get access to model');
});
