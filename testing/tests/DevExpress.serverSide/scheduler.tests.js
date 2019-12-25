import $ from 'jquery';

QUnit.testStart(() => {
    const markup =
        '<div id="scheduler"> </div>\
        <div id="scheduler-work-space"> </div>\
        <div id="scheduler-timeline"> </div>\
        <div id="scheduler-work-space-grouped">\
        <div id="navigator"> </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('View switcher server markup');

QUnit.test('View switcher tabs should be expanded on server', (assert) => {
    var scheduler = $('#scheduler').dxScheduler().dxScheduler('instance');
    var $switcher = scheduler.$element().find('.dx-tabs.dx-scheduler-view-switcher');

    assert.ok($switcher.hasClass('dx-tabs-expanded'), 'Tabs is expanded');
});

import '../DevExpress.ui.widgets.scheduler/workSpace.markup.tests.js';
import '../DevExpress.ui.widgets.scheduler/common.markup.tests.js';
import '../DevExpress.ui.widgets.scheduler/navigator.markup.tests.js';
import '../DevExpress.ui.widgets.scheduler/timeline.markup.tests.js';
