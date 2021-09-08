import $ from 'jquery';
import { createWrapper } from '../../helpers/scheduler/helpers.js';

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

QUnit.test('View switcher tabs should be expanded on server', function(assert) {
    const scheduler = $('#scheduler').dxScheduler().dxScheduler('instance');
    const $switcher = scheduler.$element().find('.dx-tabs.dx-scheduler-view-switcher');

    assert.ok($switcher.hasClass('dx-tabs-expanded'), 'Tabs is expanded');
});

QUnit.test('RenovateRender in workspace should be false on server', function(assert) {
    const scheduler = createWrapper({
        renovateRender: true,
    });

    const workSpace = scheduler.instance.getWorkSpace();

    assert.notOk(workSpace.option('renovateRender', false));
});

import '../DevExpress.ui.widgets.scheduler/workSpace.markup.tests.js';
import '../DevExpress.ui.widgets.scheduler/common.markup.tests.js';
import '../DevExpress.ui.widgets.scheduler/navigator.markup.tests.js';
import '../DevExpress.ui.widgets.scheduler/timeline.markup.tests.js';
