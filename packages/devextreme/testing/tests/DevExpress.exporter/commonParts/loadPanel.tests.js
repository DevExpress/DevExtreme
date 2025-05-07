import { setHeight } from 'core/utils/size';
import $ from 'core/renderer';
import localization from 'localization';
import ja from 'localization/messages/ja.json!';
import messageLocalization from 'common/core/localization/message';
import { getWindow, setWindow } from 'core/utils/window';

const LOAD_PANEL_CLASS = 'dx-loadpanel';
const EXPORT_LOAD_PANEL_CLASS = 'dx-export-loadpanel';

const LoadPanelTests = {
    runTests(moduleConfig, exportFunc, getComponent, componentOptions, documentPropertyName) {
        const hasBuildInLoadPanel = (componentName) => {
            if(componentName === 'dxDataGrid') {
                return componentOptions.loadPanel && componentOptions.loadPanel.enabled === true ? 1 : 0;
            }
            return (componentOptions.loadPanel === undefined && !('loadPanel' in componentOptions)) || (componentOptions.loadPanel && componentOptions.loadPanel.enabled !== false) && componentOptions.loadPanel !== true ? 1 : 0;
        };

        const componentLoadPanel = `component.loadPanel: ${('loadPanel' in componentOptions) ? JSON.stringify(componentOptions.loadPanel) : 'not declared'}`;
        QUnit.module(`LoadPanel: ${componentLoadPanel}`, moduleConfig, () => {
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
                    const initialComponentLoadPanelValue = component.option('loadPanel');

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

                    exportFunc({ component: component, [documentPropertyName]: this[documentPropertyName], loadPanel: loadPanelOptions, customizeCell: () => {
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
                        assert.strictEqual($builtInLoadPanel.length, hasBuildInLoadPanel(component.NAME) ? 1 : 0, 'builtin loadpanel exist');

                        assert.deepEqual(component.option('loadPanel'), initialComponentLoadPanelValue, 'component.loadPanel');

                        done();
                    });
                });
            });

            QUnit.test('loadPanel: { enabled: true }, $targetElement.height() > $window.height()', function(assert) {
                assert.expect(10);
                const done = assert.async();
                const component = getComponent(componentOptions);
                const initialComponentLoadPanelValue = component.option('loadPanel');

                let isFirstCall = true;
                let exportLoadPanel;
                let $targetElement;
                let $loadPanelContainer;

                if(component.NAME === 'dxDataGrid') {
                    $targetElement = component.$element().find('.dx-datagrid-rowsview');
                    $loadPanelContainer = component.$element().find('.dx-gridbase-container');
                } else {
                    $targetElement = component.$element().find('.dx-pivotgrid-area-data');
                    $loadPanelContainer = component.$element();
                }
                setHeight($targetElement, 5000);

                exportFunc({ component: component, [documentPropertyName]: this[documentPropertyName], loadPanel: { enabled: true }, customizeCell: () => {
                    if(isFirstCall) {
                        const $builtInLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`).not(`.${EXPORT_LOAD_PANEL_CLASS}`);
                        assert.strictEqual($builtInLoadPanel.length, 0, 'builtin loadpanel is turn off');

                        const $exportLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}.${EXPORT_LOAD_PANEL_CLASS}`);
                        assert.strictEqual($exportLoadPanel.length, 1, 'export loadpanel exist');

                        exportLoadPanel = $exportLoadPanel.dxLoadPanel('instance');
                        assert.strictEqual(exportLoadPanel.option('visible'), true, 'export loadpanel is visible');

                        const actualPosition = exportLoadPanel.option('position');

                        assert.deepEqual(actualPosition.of, $(getWindow()), 'loadPanel.position.of');
                        assert.strictEqual(actualPosition.collision, 'fit', 'loadPanel.position.collision');
                        assert.deepEqual(actualPosition.boundary.get(0), $targetElement.get(0), 'loadPanel.position.boundary');

                        assert.strictEqual(exportLoadPanel.option('container').get(0), $loadPanelContainer.get(0), 'loadPanel.container');
                        isFirstCall = false;
                    }
                } }).then(() => {
                    const $exportLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}.${EXPORT_LOAD_PANEL_CLASS}`);
                    assert.strictEqual($exportLoadPanel.length, 0, 'export loadpanel not exist');

                    const $builtInLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`);
                    assert.strictEqual($builtInLoadPanel.length, hasBuildInLoadPanel(component.NAME) ? 1 : 0, 'builtin loadpanel exist');
                    assert.deepEqual(component.option('loadPanel'), initialComponentLoadPanelValue, 'component.loadPanel');

                    done();
                });
            });

            QUnit.test('loadPanel: { enabled: true }, $targetElement.height() < $window.height()', function(assert) {
                assert.expect(8);
                const done = assert.async();
                const component = getComponent(componentOptions);
                const initialComponentLoadPanelValue = component.option('loadPanel');

                let isFirstCall = true;
                let exportLoadPanel;
                let $loadPanelContainer;
                let $targetElement;

                if(component.NAME === 'dxDataGrid') {
                    $targetElement = component.$element().find('.dx-datagrid-rowsview');
                    $loadPanelContainer = component.$element().find('.dx-gridbase-container');
                } else {
                    $targetElement = component.$element().find('.dx-pivotgrid-area-data');
                    $loadPanelContainer = component.$element();
                }
                setHeight($targetElement, 100);
                exportFunc({ component: component, [documentPropertyName]: this[documentPropertyName], loadPanel: { enabled: true }, customizeCell: () => {
                    if(isFirstCall) {
                        const $builtInLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`).not(`.${EXPORT_LOAD_PANEL_CLASS}`);
                        assert.strictEqual($builtInLoadPanel.length, 0, 'builtin loadpanel is turn off');

                        const $exportLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}.${EXPORT_LOAD_PANEL_CLASS}`);
                        assert.strictEqual($exportLoadPanel.length, 1, 'export loadpanel exist');

                        exportLoadPanel = $exportLoadPanel.dxLoadPanel('instance');
                        assert.strictEqual(exportLoadPanel.option('visible'), true, 'export loadpanel is visible');
                        assert.deepEqual($(exportLoadPanel.option('position').of).get(0), $targetElement.get(0), 'loadPanel.position');
                        assert.deepEqual(exportLoadPanel.option('container').get(0), $loadPanelContainer.get(0), 'loadPanel.container');
                        isFirstCall = false;
                    }
                } }).then(() => {
                    const $exportLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}.${EXPORT_LOAD_PANEL_CLASS}`);
                    assert.strictEqual($exportLoadPanel.length, 0, 'export loadpanel not exist');

                    const $builtInLoadPanel = component.$element().find(`.${LOAD_PANEL_CLASS}`);
                    assert.strictEqual($builtInLoadPanel.length, hasBuildInLoadPanel(component.NAME) ? 1 : 0, 'builtin loadpanel exist');
                    assert.deepEqual(component.option('loadPanel'), initialComponentLoadPanelValue, 'component.loadPanel');

                    done();
                });
            });

            QUnit.test('loadPanel: { enabled: false }', function(assert) {
                assert.expect(5);
                const done = assert.async();
                const component = getComponent(componentOptions);
                const initialComponentLoadPanelValue = component.option('loadPanel');

                let isFirstCall = true;

                exportFunc({ component: component, [documentPropertyName]: this[documentPropertyName], loadPanel: { enabled: false }, customizeCell: () => {
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
                    assert.strictEqual($builtInLoadPanel.length, hasBuildInLoadPanel(component.NAME) ? 1 : 0, 'builtin loadpanel exist');
                    assert.deepEqual(component.option('loadPanel'), initialComponentLoadPanelValue, 'component.loadPanel');

                    done();
                });
            });

            QUnit.test('loadPanel: { enabled: true }, hasWindow(): false', function(assert) {
                assert.expect(5);
                const done = assert.async();
                setWindow(undefined, false);
                const component = getComponent(componentOptions);
                const initialComponentLoadPanelValue = component.option('loadPanel');

                let isFirstCall = true;

                exportFunc({ component: component, [documentPropertyName]: this[documentPropertyName], loadPanel: { enabled: true }, customizeCell: () => {
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
                    assert.deepEqual(component.option('loadPanel'), initialComponentLoadPanelValue, 'component.loadPanel');

                    setWindow(window);
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
                        const initialComponentLoadPanelValue = component.option('loadPanel');

                        let isFirstCall = true;
                        let exportLoadPanel;

                        exportFunc({ component: component, [documentPropertyName]: this[documentPropertyName], customizeCell: () => {
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
                            assert.strictEqual($builtInLoadPanel.length, hasBuildInLoadPanel(component.NAME) ? 1 : 0, 'builtin loadpanel exist');
                            assert.deepEqual(component.option('loadPanel'), initialComponentLoadPanelValue, 'component.loadPanel');

                            done();
                        });
                    } finally {
                        localization.locale(locale);
                    }
                });
            });

            QUnit.test('loadPanel: { enabled: true }, use unical instance of exportLoadPanel for each exportDataGrid\'s function call', function(assert) {
                const clock = sinon.useFakeTimers();

                const $secondGrid = $('<div>');
                $('#qunit-fixture').css({ position: 'static' });
                $('#qunit-fixture').append($secondGrid);

                const loadingTimeout = 30;
                componentOptions.loadingTimeout = loadingTimeout;
                const component = getComponent(componentOptions);
                const secondComponent = $secondGrid[component.NAME](componentOptions)[component.NAME]('instance');

                const initialComponentLoadPanelValue = component.option('loadPanel');

                clock.tick(300);

                exportFunc({ component: component, [documentPropertyName]: this[documentPropertyName], loadPanel: { enabled: true } });
                exportFunc({ component: secondComponent, [documentPropertyName]: this[documentPropertyName], loadPanel: { enabled: true } });

                assert.strictEqual($(`.${LOAD_PANEL_CLASS}`).not(`.${EXPORT_LOAD_PANEL_CLASS}`).length, 0, 'builtin loadpanel is turn off');
                assert.strictEqual($(`.${LOAD_PANEL_CLASS}.${EXPORT_LOAD_PANEL_CLASS}`).length, 2, 'export loadpanel exist');

                clock.tick(300);

                assert.strictEqual($(`.${LOAD_PANEL_CLASS}`).not(`.${EXPORT_LOAD_PANEL_CLASS}`).length, hasBuildInLoadPanel(component.NAME) ? 2 : 0, 'builtin loadpanel is turn off');
                assert.deepEqual(component.option('loadPanel'), initialComponentLoadPanelValue, 'component.loadPanel');
                assert.deepEqual(secondComponent.option('loadPanel'), initialComponentLoadPanelValue, 'component.loadPanel');
                assert.strictEqual($(`.${LOAD_PANEL_CLASS}.${EXPORT_LOAD_PANEL_CLASS}`).length, 0, 'export loadpanel exist');

                $secondGrid.remove();
                clock.restore();
            });
        });
    }
};

export { LoadPanelTests };
