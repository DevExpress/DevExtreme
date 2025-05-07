import $ from 'jquery';
import config from 'core/config';
import typeUtils from 'core/utils/type';
import 'generic_light.css!';
import 'ui/drawer';

const DRAWER_CLASS = 'dx-drawer';
const DRAWER_WRAPPER_CLASS = 'dx-drawer-wrapper';
const DRAWER_PANEL_CONTENT_CLASS = 'dx-drawer-panel-content';
const DRAWER_PANEL_CONTENT_HIDDEN_CLASS = 'dx-drawer-panel-content-hidden';
const DRAWER_VIEW_CONTENT_CLASS = 'dx-drawer-content';
const DRAWER_SHADER_CLASS = 'dx-drawer-shader';
const OPENED_STATE_CLASS = 'dx-drawer-opened';


QUnit.testStart(() => {
    const markup = '\
    <style nonce="qunit-test">\
        .dx-drawer-panel-content {\
            width: 200px;\
        }\
    </style>\
    \
    <div id="drawer">\
        Test Content\
    </div>\
    <div id="contentTemplate">\
        <div data-options="dxTemplate: { name: \'customPanel\' }">\
            Test panel Template\
        </div>\
            <div data-options="dxTemplate: { name: \'customContent\' }">\
            Test Content Template\
        </div>\
    </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('rendering', () => {
    QUnit.test('render drawer', function(assert) {
        const $element = $('#drawer').dxDrawer({});

        assert.ok($element.hasClass(DRAWER_CLASS), 'drawer rendered');
        assert.equal($element.find('.' + DRAWER_WRAPPER_CLASS).length, 1, 'drawer has wrapper');
        assert.equal($element.find('.' + DRAWER_PANEL_CONTENT_CLASS).length, 1, 'drawer has panel container');
        assert.equal($element.find('.' + DRAWER_VIEW_CONTENT_CLASS).length, 1, 'drawer has content');
    });

    QUnit.test('drawer should have correct mode class by default', function(assert) {
        const $element = $('#drawer').dxDrawer();

        assert.ok($element.hasClass(DRAWER_CLASS + '-shrink'), 'drawer class is correct');
    });

    QUnit.test('drawer should have correct revealMode class by default', function(assert) {
        const $element = $('#drawer').dxDrawer();

        assert.ok($element.hasClass(DRAWER_CLASS + '-slide'), 'drawer class is correct');
    });

    QUnit.test('drawer panel should not have dx-drawer-panel-content-hidden class if drawer is closed', function(assert) {
        const $element = $('#drawer').dxDrawer();
        const $panel = $element.find(`.${DRAWER_PANEL_CONTENT_CLASS}`);

        assert.strictEqual($panel.hasClass(DRAWER_PANEL_CONTENT_HIDDEN_CLASS), true, 'dx-drawer-panel-content-hidden is set');
    });

    QUnit.test('drawer panel should not have dx-drawer-panel-content-hidden class if drawer is opened', function(assert) {
        const $element = $('#drawer').dxDrawer({ opened: true });
        const $panel = $element.find(`.${DRAWER_PANEL_CONTENT_CLASS}`);

        assert.strictEqual($panel.hasClass(DRAWER_PANEL_CONTENT_HIDDEN_CLASS), false, 'dx-drawer-panel-content-hidden is not set');
    });

    QUnit.test('drawer panel should not have dx-drawer-panel-content-hidden class if minSize is set', function(assert) {
        const $element = $('#drawer').dxDrawer({ minSize: 1 });
        const $panel = $element.find(`.${DRAWER_PANEL_CONTENT_CLASS}`);

        assert.strictEqual($panel.hasClass(DRAWER_PANEL_CONTENT_HIDDEN_CLASS), false, 'dx-drawer-panel-content-hidden is not set');
    });

    QUnit.test('drawer panel should not have dx-drawer-panel-content-hidden class if minSize was changed in runtime', function(assert) {
        const $element = $('#drawer').dxDrawer({ minSize: 1 });
        const instance = $element.dxDrawer('instance');
        const $panel = $element.find(`.${DRAWER_PANEL_CONTENT_CLASS}`);

        assert.strictEqual($panel.hasClass(DRAWER_PANEL_CONTENT_HIDDEN_CLASS), false, 'dx-drawer-panel-content-hidden is not set');

        instance.option({ minSize: null });

        assert.strictEqual($panel.hasClass(DRAWER_PANEL_CONTENT_HIDDEN_CLASS), true, 'dx-drawer-panel-content-hidden is set');

        instance.option({ minSize: 1 });

        assert.strictEqual($panel.hasClass(DRAWER_PANEL_CONTENT_HIDDEN_CLASS), false, 'dx-drawer-panel-content-hidden is not set');
    });

    QUnit.test('drawer panel should have visibility: hidden if drawer is closed', function(assert) {
        const $element = $('#drawer').dxDrawer({ opened: false });
        const instance = $element.dxDrawer('instance');
        const $panel = $element.find(`.${DRAWER_PANEL_CONTENT_CLASS}`);

        assert.strictEqual($panel.css('visibility') === 'hidden', true, 'visibility: hidden is set');

        instance.option({ opened: true });

        assert.strictEqual($panel.css('visibility') === 'hidden', false, 'visibility: hidden is not set');
    });

    QUnit.test('render drawer content', function(assert) {
        const $element = $('#drawer').dxDrawer({});
        const $content = $element.find('.' + DRAWER_VIEW_CONTENT_CLASS);

        assert.equal($content.text().trim(), 'Test Content', 'drawer content was rendered');
    });


    QUnit.test('opened class should be applied correctly', function(assert) {
        const $element = $('#drawer').dxDrawer({
            opened: true
        });

        const instance = $element.dxDrawer('instance');

        assert.ok($element.hasClass(OPENED_STATE_CLASS), 'drawer has opened class');

        instance.option('opened', false);

        assert.notOk($element.hasClass(OPENED_STATE_CLASS), 'drawer hasn\'t opened class');
    });

    QUnit.test('custom template for panel should be rendered correctly', function(assert) {
        const $element = $('#contentTemplate').dxDrawer({
            template: 'customPanel'
        });

        const $panel = $($element.dxDrawer('instance').content());

        assert.equal($panel.text().trim(), 'Test panel Template', 'panel content text is correct');
    });

    QUnit.test('templates should be dom nodes without jQuery', function(assert) {
        assert.expect(2);
        $('#contentTemplate').dxDrawer({
            template(element) {
                assert.equal(typeUtils.isRenderer(element), !!config().useJQuery, 'element is correct');
            },
            contentTemplate(element) {
                assert.equal(typeUtils.isRenderer(element), !!config().useJQuery, 'element is correct');
            }
        });
    });

    QUnit.test('custom content template for content should be rendered correctly', function(assert) {
        const $element = $('#contentTemplate').dxDrawer({
            contentTemplate: 'customContent'
        });

        const $content = $($element.dxDrawer('instance').viewContent());

        assert.equal($content.text().trim(), 'Test Content Template', 'content text is correct');
    });

    QUnit.test('render panel positions', function(assert) {
        const $element = $('#contentTemplate').dxDrawer({
            position: 'right',
            openedStateMode: 'shrink',
            opened: true
        });
        const instance = $element.dxDrawer('instance');

        assert.notOk($element.hasClass(DRAWER_CLASS + '-left'), 'there is no left panel position class');
        assert.ok($element.hasClass(DRAWER_CLASS + '-right'), 'right panel position class added');

        instance.option('position', 'top');

        assert.notOk($element.hasClass(DRAWER_CLASS + '-right'), 'right panel position class has been removed');
        assert.notOk($element.hasClass(DRAWER_CLASS + '-left'), 'right panel position class has been removed');
        assert.ok($element.hasClass(DRAWER_CLASS + '-top'), 'top panel position class added');
    });

    [true, false].forEach((rtlEnabled) => {
        const panelPositions = ['top', 'bottom', 'left', 'right', 'before', 'after'];

        const configs = [
            { panelPosition: 'top', expectedClass: `${DRAWER_CLASS}-top` },
            { panelPosition: 'bottom', expectedClass: `${DRAWER_CLASS}-bottom` },
            { panelPosition: 'left', expectedClass: `${DRAWER_CLASS}-left` },
            { panelPosition: 'right', expectedClass: `${DRAWER_CLASS}-right` },
            { panelPosition: 'before', expectedClass: rtlEnabled ? `${DRAWER_CLASS}-right` : `${DRAWER_CLASS}-left` },
            { panelPosition: 'after', expectedClass: rtlEnabled ? `${DRAWER_CLASS}-left` : `${DRAWER_CLASS}-right` },
        ];

        configs.forEach(({ panelPosition, expectedClass }) => {
            QUnit.test(`drawer should have ${expectedClass} class on initialization if panel position is set to ${panelPosition}, rtlEnabled=${rtlEnabled}`, function(assert) {
                assert.expect(6);

                const $element = $('#contentTemplate').dxDrawer({
                    position: panelPosition,
                    opened: true,
                    rtlEnabled,
                });

                assert.strictEqual($element.hasClass(expectedClass), true, `class ${expectedClass} is added correctly`);

                panelPositions
                    .filter((position) => `${DRAWER_CLASS}-${position}` !== expectedClass)
                    .map((position) => {
                        assert.strictEqual($element.hasClass(`${DRAWER_CLASS}-${position}`), false, `class ${DRAWER_CLASS}-${position} is not set`);
                    });
            });

            configs.forEach(({ panelPosition: newPanelPosition, expectedClass: expectedClassAfterChange }) => {
                QUnit.test(`ddrawer should have ${expectedClassAfterChange} class after changing position from ${panelPosition} to ${newPanelPosition}, rtlEnabled=${rtlEnabled}`, function(assert) {
                    const drawer = $('#contentTemplate').dxDrawer({
                        position: panelPosition,
                        opened: true,
                        rtlEnabled,
                    }).dxDrawer('instance');

                    const $element = drawer.$element();

                    drawer.option('position', newPanelPosition);

                    assert.strictEqual($element.hasClass(expectedClassAfterChange), true, `class ${expectedClassAfterChange} is added correctly`);

                    panelPositions
                        .filter((position) => `${DRAWER_CLASS}-${position}` !== expectedClassAfterChange)
                        .map((position) => {
                            assert.strictEqual($element.hasClass(`${DRAWER_CLASS}-${position}`), false, `class ${DRAWER_CLASS}-${position} is not set`);
                        });
                });
            });
        });
    });

    QUnit.test('shader should be rendered by default if panel is visible', function(assert) {
        const $element = $('#drawer').dxDrawer({
            opened: true
        });

        assert.equal($element.find('.' + DRAWER_SHADER_CLASS).length, 1, 'drawer has shader');
    });

    QUnit.test('shader should not be rendered if shading = false', function(assert) {
        const $element = $('#drawer').dxDrawer({
            opened: true,
            shading: false
        });

        assert.equal($element.find('.' + DRAWER_SHADER_CLASS).length, 1, 'drawer has shader');
    });
});

QUnit.module('push mode', () => {
    QUnit.test('drawer should have correct class depending on mode', function(assert) {
        const $element = $('#drawer').dxDrawer({
            openedStateMode: 'push'
        });

        assert.ok($element.hasClass(DRAWER_CLASS + '-push'), 'drawer class is correct');
    });
});

QUnit.module('overlap mode', () => {
    QUnit.test('drawer should have correct class depending on mode', function(assert) {
        const $element = $('#drawer').dxDrawer({
            openedStateMode: 'overlap'
        });

        assert.ok($element.hasClass(DRAWER_CLASS + '-overlap'), 'drawer class is correct');
    });

    QUnit.test('drawer panel should be overlay in overlap mode', function(assert) {
        const drawer = $('#drawer').dxDrawer({
            openedStateMode: 'overlap'
        }).dxDrawer('instance');

        const $panel = drawer.content();
        assert.ok($($panel).hasClass('dx-overlay'), 'drawer panel is overlay');
    });
});

