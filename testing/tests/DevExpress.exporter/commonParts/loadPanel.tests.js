import $ from 'core/renderer';
import localization from 'localization';
import ja from 'localization/messages/ja.json!';
import messageLocalization from 'localization/message';
import { setWindow, getWindow } from 'core/utils/window';

const LOAD_PANEL_CLASS = 'dx-loadpanel';

const LoadPanelTests = {
    runTests(moduleConfig, exportFunc, getComponent, document) {
        QUnit.module('LoadPanel', moduleConfig, () => {
            [undefined,
                { enabled: true },
                { enabled: true, text: 'Export to .Extention...' },
                { animation:
                    {
                        easing: 'linear',
                        duration: 500
                    },
                height: 50,
                width: 100,
                showIndicator: false,
                showPane: false,
                }
            ].forEach((loadPanelConfig) => {
                QUnit.test(`loadPanel: ${JSON.stringify(loadPanelConfig)}`, function(assert) {
                    const done = assert.async();
                    const component = getComponent();

                    const {
                        animation = null,
                        enabled = true,
                        height = 90,
                        indicatorSrc = '',
                        showIndicator = true,
                        showPane = true,
                        text = 'Exporting...',
                        width = 200,
                    } = loadPanelConfig = {};

                    const expectedOptions = { message: text, animation, enabled, height, indicatorSrc, showIndicator, showPane, text, width };

                    let isFirstCall = true;
                    let loadPanel;

                    exportFunc({ component: component, [document]: this[document], loadPanel: loadPanelConfig, customizeCell: () => {
                        if(isFirstCall) {
                            const $loadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`);
                            assert.strictEqual($loadPanel.length, 1, 'loadPanel rendered');

                            loadPanel = $loadPanel.dxLoadPanel('instance');
                            assert.strictEqual(loadPanel.option('visible'), true, 'loadPanel should be shown on export');

                            for(const optionName in expectedOptions) {
                                assert.strictEqual(loadPanel.option(optionName), expectedOptions[optionName], `loadPanel.${optionName}`);
                            }
                            isFirstCall = false;
                        }
                    } }).then(() => {
                        const $loadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`);
                        assert.strictEqual($loadPanel.length, 0, 'loadPanel not exist after export');

                        done();
                    });
                });
            });

            QUnit.test('loadPanel: { enabled: true }, $targetElement.height() > $window.height()', function(assert) {
                const done = assert.async();
                const component = getComponent();

                let isFirstCall = true;
                let loadPanel;
                let $targetElement;
                let $loadPanelContainer;

                if(component.NAME === 'dxDataGrid') {
                    $targetElement = component.$element().find('.dx-datagrid-rowsview');
                    $targetElement.height(5000);
                    $loadPanelContainer = component.$element().find('.dx-gridbase-container');
                } else {
                    // pivot
                }

                exportFunc({ component: component, [document]: this[document], loadPanel: { enabled: true }, customizeCell: () => {
                    if(isFirstCall) {
                        const $loadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`);
                        assert.strictEqual($loadPanel.length, 1, 'loadPanel rendered');

                        loadPanel = $loadPanel.dxLoadPanel('instance');
                        assert.strictEqual(loadPanel.option('visible'), true, 'loadPanel should be shown on export');

                        const actualPosition = loadPanel.option('position')();

                        assert.deepEqual(actualPosition.of, $(getWindow()), 'loadPanel.position.of');
                        assert.strictEqual(actualPosition.collision, 'fit', 'loadPanel.position.collision');
                        assert.deepEqual(actualPosition.boundary, $targetElement, 'loadPanel.position.boundary');

                        assert.strictEqual(loadPanel.option('container').get(0), $loadPanelContainer.get(0), 'loadPanel.container');
                        isFirstCall = false;
                    }
                } }).then(() => {
                    const $loadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`);
                    assert.strictEqual($loadPanel.length, 0, 'loadPanel not exist after export');

                    done();
                });
            });

            QUnit.test('loadPanel: { enabled: true }, $targetElement.height() < $window.height()', function(assert) {
                const done = assert.async();
                const component = getComponent();

                let isFirstCall = true;
                let loadPanel;
                let $targetElement;
                let $loadPanelContainer;

                if(component.NAME === 'dxDataGrid') {
                    $targetElement = component.$element().find('.dx-datagrid-rowsview');
                    $targetElement.height(100);
                    $loadPanelContainer = component.$element().find('.dx-gridbase-container');
                } else {
                    // pivot
                }

                exportFunc({ component: component, [document]: this[document], loadPanel: { enabled: true }, customizeCell: () => {
                    if(isFirstCall) {
                        const $loadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`);
                        assert.strictEqual($loadPanel.length, 1, 'loadPanel rendered');

                        loadPanel = $loadPanel.dxLoadPanel('instance');
                        assert.strictEqual(loadPanel.option('visible'), true, 'loadPanel should be shown on export');

                        assert.deepEqual(loadPanel.option('position')(), { of: $targetElement }, 'loadPanel.position');
                        assert.strictEqual(loadPanel.option('container').get(0), $loadPanelContainer.get(0), 'loadPanel.container');
                        isFirstCall = false;
                    }
                } }).then(() => {
                    const $loadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`);
                    assert.strictEqual($loadPanel.length, 0, 'loadPanel not exist after export');

                    done();
                });
            });

            QUnit.test('loadPanel: { enabled: false }', function(assert) {
                assert.expect(2);
                const done = assert.async();
                const component = getComponent();

                let isFirstCall = true;

                exportFunc({ component: component, [document]: this[document], loadPanel: { enabled: false }, customizeCell: () => {
                    if(isFirstCall) {
                        const $loadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`);
                        assert.strictEqual($loadPanel.length, 0, 'loadPanel not exist');

                        isFirstCall = false;
                    }
                } }).then(() => {
                    const $loadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`);
                    assert.strictEqual($loadPanel.length, 0, 'loadPanel not exist after export');

                    done();
                });
            });

            QUnit.test('loadPanel: { enabled: true }, hasWindow(): false', function(assert) {
                assert.expect(2);
                const done = assert.async();
                const component = getComponent();

                let isFirstCall = true;
                setWindow({ }, false);

                try {
                    exportFunc({ component: component, [document]: this[document], loadPanel: { enabled: true }, customizeCell: () => {
                        if(isFirstCall) {
                            const $loadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`);
                            assert.strictEqual($loadPanel.length, 0, 'loadPanel not exist');

                            isFirstCall = false;
                        }
                    } }).then(() => {
                        const $loadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`);
                        assert.strictEqual($loadPanel.length, 0, 'loadPanel not exist after export');

                        done();
                    });
                } finally {
                    setWindow(window);
                }

            });

            [{ type: 'default', expected: 'エクスポート...' }, { type: 'custom', expected: '!CUSTOM TEXT!' }].forEach((localizationText) => {
                QUnit.test(`${localizationText.type} localization text, locale('ja')`, function(assert) {
                    assert.expect(4);
                    const done = assert.async();
                    const locale = localization.locale();

                    try {
                        if(localizationText.type === 'default') {
                            localization.loadMessages(ja);
                        } else {
                            messageLocalization.load({
                                'ja': {
                                    'dxDataGrid-exporting': '!CUSTOM TEXT!'
                                }
                            });
                        }

                        localization.locale('ja');

                        const component = getComponent();

                        let isFirstCall = true;
                        let loadPanel;

                        exportFunc({ component: component, [document]: this[document], customizeCell: () => {
                            if(isFirstCall) {
                                const $loadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`);
                                assert.strictEqual($loadPanel.length, 1, 'loadPanel exist');

                                loadPanel = $loadPanel.dxLoadPanel('instance');
                                assert.strictEqual(loadPanel.option('visible'), true, 'loadPanel.visible');
                                assert.strictEqual(loadPanel.option('message'), localizationText.expected, 'loadPanel.text');

                                isFirstCall = false;
                            }
                        } }).then(() => {
                            const $loadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`);
                            assert.strictEqual($loadPanel.length, 0, 'loadPanel not exist after export');

                            done();
                        });
                    } finally {
                        localization.locale(locale);
                    }
                });
            });
        });
    }
};

export { LoadPanelTests };
