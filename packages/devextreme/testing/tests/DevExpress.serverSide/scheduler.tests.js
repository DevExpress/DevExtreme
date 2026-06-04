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

import '../DevExpress.ui.widgets.scheduler/workSpace.markup-0.tests.js';
import '../DevExpress.ui.widgets.scheduler/workSpace.markup-1.tests.js';
import '../DevExpress.ui.widgets.scheduler/common.markup.tests.js';
import '../DevExpress.ui.widgets.scheduler/timeline.markup.tests.js';
