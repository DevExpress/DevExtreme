import $ from 'core/renderer';
import localization from 'localization';
import ja from 'localization/messages/ja.json!';
import messageLocalization from 'localization/message';
import windowUtils from 'core/utils/window';

const LOAD_PANEL_CLASS = 'dx-loadpanel';
const EXPORT_LOAD_PANEL_CLASS = 'dx-export-loadpanel';

const LoadPanelTests = {
    runTests(moduleConfig, exportFunc, getComponent, componentOptions, document) {
        const componentLoadPanelEnabledOption = componentOptions.loadPanel.enabled === true;

        QUnit.module(`LoadPanel: component.loadPanel.enabled: ${componentOptions.loadPanel.enabled}`, moduleConfig, () => {
            [
                undefined,
                { enabled: true },
                { enabled: true, text: 'Export to .Extention...' },
                {
                    animation: {
                        easing: 'linear',
                        duration: 500
                    },
                    height: 50,
                    width: 100,
                    showIndicator: false,
                    showPane: false,
                }
            ].forEach((loadPanelOptions) => {
                QUnit.test(`loadPanel: ${JSON.stringify(loadPanelOptions)}`, function(assert) {
                    assert.expect(14);
                    const done = assert.async();
                    const component = getComponent(componentOptions);
                    const initialComponentLoadPanelEnabledValue = component.option('loadPanel').enabled;

                    let initialOptions = loadPanelOptions;
                    if(!initialOptions) {
                        initialOptions = {};
                    }

                    const {
                        animation = null,
                        enabled = true,
                        height = 90,
                        indicatorSrc = '',
                        showIndicator = true,
                        showPane = true,
                        text = 'Exporting...',
                        width = 200,
                    } = initialOptions;

                    const expectedOptions = { message: text, animation, enabled, height, indicatorSrc, showIndicator, showPane, width };

                    let isFirstCall = true;
                    let exportLoadPanel;

                    exportFunc({ component: component, [document]: this[document], loadPanel: loadPanelOptions, customizeCell: () => {
                        if(isFirstCall) {
                            const $builtInLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`).not(`.${EXPORT_LOAD_PANEL_CLASS}`);
                            assert.strictEqual($builtInLoadPanel.length, 0, 'builtin loadpanel is turn off');

                            const $exportLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}.${EXPORT_LOAD_PANEL_CLASS}`);
                            assert.strictEqual($exportLoadPanel.length, 1, 'export loadpanel exist');

                            exportLoadPanel = $exportLoadPanel.dxLoadPanel('instance');
                            assert.strictEqual(exportLoadPanel.option('visible'), true, 'export loadpanel is visible');

                            for(const optionName in expectedOptions) {
                                assert.strictEqual(exportLoadPanel.option(optionName), expectedOptions[optionName], `loadPanel.${optionName}`);
                            }
                            isFirstCall = false;
                        }
                    } }).then(() => {
                        const $exportLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}.${EXPORT_LOAD_PANEL_CLASS}`);
                        assert.strictEqual($exportLoadPanel.length, 0, 'export loadpanel not exist');

                        const $builtInLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`);
                        assert.strictEqual($builtInLoadPanel.length, componentLoadPanelEnabledOption ? 1 : 0, 'builtin loadpanel exist');

                        assert.strictEqual(component.option('loadPanel').enabled, initialComponentLoadPanelEnabledValue, 'component.loadPanel.enabled');

                        done();
                    });
                });
            });

            QUnit.test('loadPanel: { enabled: true }, $targetElement.height() > $window.height()', function(assert) {
                assert.expect(10);
                const done = assert.async();
                const component = getComponent(componentOptions);
                const initialComponentLoadPanelEnabledValue = component.option('loadPanel').enabled;

                let isFirstCall = true;
                let exportLoadPanel;
                let $targetElement;

                exportFunc({ component: component, [document]: this[document], loadPanel: { enabled: true }, customizeCell: () => {
                    if(isFirstCall) {
                        const $builtInLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`).not(`.${EXPORT_LOAD_PANEL_CLASS}`);
                        assert.strictEqual($builtInLoadPanel.length, 0, 'builtin loadpanel is turn off');

                        const $exportLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}.${EXPORT_LOAD_PANEL_CLASS}`);
                        assert.strictEqual($exportLoadPanel.length, 1, 'export loadpanel exist');

                        exportLoadPanel = $exportLoadPanel.dxLoadPanel('instance');
                        assert.strictEqual(exportLoadPanel.option('visible'), true, 'export loadpanel is visible');

                        let $loadPanelContainer;

                        if(component.NAME === 'dxDataGrid') {
                            $targetElement = component.$element().find('.dx-datagrid-rowsview');
                            $targetElement.height(5000);
                            $loadPanelContainer = component.$element().find('.dx-gridbase-container');
                        } else {
                            $targetElement = component.$element().find('.dx-pivotgrid-area-data');
                            $targetElement.height(5000);

                            $loadPanelContainer = component.$element();
                        }
                        const actualPosition = exportLoadPanel.option('position')();

                        assert.deepEqual(actualPosition.of, $(windowUtils.getWindow()), 'loadPanel.position.of');
                        assert.strictEqual(actualPosition.collision, 'fit', 'loadPanel.position.collision');
                        assert.deepEqual(actualPosition.boundary.get(0), $targetElement.get(0), 'loadPanel.position.boundary');

                        assert.strictEqual(exportLoadPanel.option('container').get(0), $loadPanelContainer.get(0), 'loadPanel.container');
                        isFirstCall = false;
                    }
                } }).then(() => {
                    const $exportLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}.${EXPORT_LOAD_PANEL_CLASS}`);
                    assert.strictEqual($exportLoadPanel.length, 0, 'export loadpanel not exist');

                    const $builtInLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`);
                    assert.strictEqual($builtInLoadPanel.length, componentLoadPanelEnabledOption ? 1 : 0, 'builtin loadpanel exist');
                    assert.strictEqual(component.option('loadPanel').enabled, initialComponentLoadPanelEnabledValue, 'component.loadPanel.enabled');

                    done();
                });
            });

            QUnit.test('loadPanel: { enabled: true }, $targetElement.height() < $window.height()', function(assert) {
                assert.expect(8);
                const done = assert.async();
                const component = getComponent(componentOptions);
                const initialComponentLoadPanelEnabledValue = component.option('loadPanel').enabled;

                let isFirstCall = true;
                let exportLoadPanel;


                exportFunc({ component: component, [document]: this[document], loadPanel: { enabled: true }, customizeCell: () => {
                    if(isFirstCall) {
                        const $builtInLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`).not(`.${EXPORT_LOAD_PANEL_CLASS}`);
                        assert.strictEqual($builtInLoadPanel.length, 0, 'builtin loadpanel is turn off');

                        const $exportLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}.${EXPORT_LOAD_PANEL_CLASS}`);
                        assert.strictEqual($exportLoadPanel.length, 1, 'export loadpanel exist');

                        exportLoadPanel = $exportLoadPanel.dxLoadPanel('instance');
                        assert.strictEqual(exportLoadPanel.option('visible'), true, 'export loadpanel is visible');

                        let $loadPanelContainer;
                        let $targetElement;

                        if(component.NAME === 'dxDataGrid') {
                            $targetElement = component.$element().find('.dx-datagrid-rowsview');
                            $targetElement.height(100);
                            $loadPanelContainer = component.$element().find('.dx-gridbase-container');
                        } else {
                            $targetElement = component.$element().find('.dx-pivotgrid-area-data');
                            $targetElement.height(100);
                            $loadPanelContainer = component.$element();
                        }

                        assert.deepEqual($(exportLoadPanel.option('position')().of).get(0), $targetElement.get(0), 'loadPanel.position');
                        assert.deepEqual(exportLoadPanel.option('container').get(0), $loadPanelContainer.get(0), 'loadPanel.container');
                        isFirstCall = false;
                    }
                } }).then(() => {
                    const $exportLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}.${EXPORT_LOAD_PANEL_CLASS}`);
                    assert.strictEqual($exportLoadPanel.length, 0, 'export loadpanel not exist');

                    const $builtInLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`);
                    assert.strictEqual($builtInLoadPanel.length, componentLoadPanelEnabledOption ? 1 : 0, 'builtin loadpanel exist');
                    assert.strictEqual(component.option('loadPanel').enabled, initialComponentLoadPanelEnabledValue, 'component.loadPanel.enabled');

                    done();
                });
            });

            QUnit.test('loadPanel: { enabled: false }', function(assert) {
                assert.expect(5);
                const done = assert.async();
                const component = getComponent(componentOptions);
                const initialComponentLoadPanelEnabledValue = component.option('loadPanel').enabled;

                let isFirstCall = true;

                exportFunc({ component: component, [document]: this[document], loadPanel: { enabled: false }, customizeCell: () => {
                    if(isFirstCall) {
                        const $builtInLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`).not(`.${EXPORT_LOAD_PANEL_CLASS}`);
                        assert.strictEqual($builtInLoadPanel.length, 0, 'builtin loadpanel is turn off');

                        const $exportLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}.${EXPORT_LOAD_PANEL_CLASS}`);
                        assert.strictEqual($exportLoadPanel.length, 0, 'export loadpanel not exist');

                        isFirstCall = false;
                    }
                } }).then(() => {
                    const $exportLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}.${EXPORT_LOAD_PANEL_CLASS}`);
                    assert.strictEqual($exportLoadPanel.length, 0, 'export loadpanel not exist');

                    const $builtInLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`);
                    assert.strictEqual($builtInLoadPanel.length, componentLoadPanelEnabledOption ? 1 : 0, 'builtin loadpanel exist');
                    assert.strictEqual(component.option('loadPanel').enabled, initialComponentLoadPanelEnabledValue, 'component.loadPanel.enabled');

                    done();
                });
            });

            QUnit.test('loadPanel: { enabled: true }, hasWindow(): false', function(assert) {
                assert.expect(5);
                const done = assert.async();

                const originalGetWindow = windowUtils.getWindow;
                const originalHasWindow = windowUtils.hasWindow;
                windowUtils.getWindow = function() {
                    const fakeWindow = {};
                    fakeWindow.window = fakeWindow;

                    return fakeWindow;
                };
                windowUtils.hasWindow = () => false;

                const component = getComponent(componentOptions);
                const initialComponentLoadPanelEnabledValue = component.option('loadPanel').enabled;

                let isFirstCall = true;

                exportFunc({ component: component, [document]: this[document], loadPanel: { enabled: true }, customizeCell: () => {
                    if(isFirstCall) {
                        const $builtInLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`).not(`.${EXPORT_LOAD_PANEL_CLASS}`);
                        assert.strictEqual($builtInLoadPanel.length, 0, 'builtin loadpanel is turn off');

                        const $exportLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}.${EXPORT_LOAD_PANEL_CLASS}`);
                        assert.strictEqual($exportLoadPanel.length, 0, 'export loadpanel not exist');

                        isFirstCall = false;
                    }
                } }).then(() => {
                    const $exportLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}.${EXPORT_LOAD_PANEL_CLASS}`);
                    assert.strictEqual($exportLoadPanel.length, 0, 'export loadpanel not exist');

                    const $builtInLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`);
                    assert.strictEqual($builtInLoadPanel.length, 0, 'builtin loadpanel exist');
                    assert.strictEqual(component.option('loadPanel').enabled, initialComponentLoadPanelEnabledValue, 'component.loadPanel.enabled');

                    windowUtils.getWindow = originalGetWindow;
                    windowUtils.hasWindow = originalHasWindow;
                    done();
                });
            });


            [{ type: 'default', expected: 'エクスポート...' }, { type: 'custom', expected: '!CUSTOM TEXT!' }].forEach((localizationText) => {
                QUnit.test(`${localizationText.type} localization text, locale('ja')`, function(assert) {
                    assert.expect(7);
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

                        const component = getComponent(componentOptions);
                        const initialComponentLoadPanelEnabledValue = component.option('loadPanel').enabled;

                        let isFirstCall = true;
                        let exportLoadPanel;

                        exportFunc({ component: component, [document]: this[document], customizeCell: () => {
                            if(isFirstCall) {
                                const $builtInLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`).not(`.${EXPORT_LOAD_PANEL_CLASS}`);
                                assert.strictEqual($builtInLoadPanel.length, 0, 'builtin loadpanel is turn off');

                                const $exportLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}.${EXPORT_LOAD_PANEL_CLASS}`);
                                assert.strictEqual($exportLoadPanel.length, 1, 'export loadpanel exist');

                                exportLoadPanel = $exportLoadPanel.dxLoadPanel('instance');
                                assert.strictEqual(exportLoadPanel.option('visible'), true, 'export loadpanel is visible');

                                assert.strictEqual(exportLoadPanel.option('message'), localizationText.expected, 'loadPanel.text');

                                isFirstCall = false;
                            }
                        } }).then(() => {
                            const $exportLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}.${EXPORT_LOAD_PANEL_CLASS}`);
                            assert.strictEqual($exportLoadPanel.length, 0, 'export loadpanel not exist');

                            const $builtInLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`);
                            assert.strictEqual($builtInLoadPanel.length, componentLoadPanelEnabledOption ? 1 : 0, 'builtin loadpanel exist');
                            assert.strictEqual(component.option('loadPanel').enabled, initialComponentLoadPanelEnabledValue, 'component.loadPanel.enabled');

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
