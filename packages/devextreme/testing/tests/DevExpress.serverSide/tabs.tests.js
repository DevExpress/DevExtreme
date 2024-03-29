import '../DevExpress.ui.widgets/tabs.markup.tests.js';

import $ from 'jquery';
import 'ui/tabs';


QUnit.testStart(() => {
    const markup =
        '<div id="tabs"></div>\
        <div id="widget"></div>\
        <div id="widthRootStyle"></div>';

    $('#qunit-fixture').html(markup);
    $('#widthRootStyle').css('width', '300px');
});

QUnit.test('tabs should have overflow-hidden class on server', function(assert) {
    const $tabsElement = $('#tabs').dxTabs({
        items: ['1', '2', '3']
    });

    assert.ok($tabsElement.hasClass('dx-overflow-hidden'), 'tabs has correct class');
});
