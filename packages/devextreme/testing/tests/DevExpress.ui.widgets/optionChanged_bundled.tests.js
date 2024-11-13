
import $ from 'jquery';
import { Component } from 'core/component';
import devices from '__internal/core/m_devices';
import GoogleStaticProvider from '__internal/ui/map/m_provider.google_static';
import fx from 'common/core/animation/fx';
import executeAsyncMock from '../../helpers/executeAsyncMock.js';
import { DataSource } from 'common/data/data_source/data_source';

import '../../helpers/ignoreQuillTimers.js';
import 'bundles/modules/parts/widgets-web';

fx.off = true;
GoogleStaticProvider.remapConstant('/mapURL?');

QUnit.module('OptionChanged', {
    beforeEach: function() {
        // NOTE: workaround for inferno
        // component can not be rendered as body first-level child
        const $container = $('<div />').appendTo('#qunit-fixture');
        this.$element = $('<div />').appendTo($container);

        this._originalOptionChanged = Component.prototype._optionChanged;

        Component.prototype._optionChanged = function(args) {
            const name = args.name;

            if(this._getDeprecatedOptions()[name] ||
                name === 'rtlEnabled' ||
                name === 'onOptionChanged' ||
                name === 'onDisposing' ||
                name === 'onInitialized' ||
                name === 'defaultOptionsRules' ||
                name === 'useNativeScrolling' ||
                name === 'exportingAction' ||
                name === 'exportedAction' ||
                name === 'fileSavingAction' ||
                name === 'validationMessageOffset' ||
                name === 'templatesRenderAsynchronously' ||
                name === 'ignoreChildEvents' ||
                name === '_dataController' ||
                name === '_ignorePreventScrollEventsDeprecation' ||
                name === '_checkParentVisibility') {
                return;
            }
            // NOTE: workaround for inferno
            // Internal renovated component call _optionChanged before QUnitAssert initialized
            if(this.QUnitAssert) {
                this.QUnitAssert.ok(false, 'Option \'' + name + '\' is not processed after runtime change');
            }
        };

        executeAsyncMock.setup();
    },
    afterEach: function() {
        Component.prototype._optionChanged = this._originalOptionChanged;
        this.$element.parent().remove();
        executeAsyncMock.teardown();
    }
}, () => {
    if(!devices.real().generic) {
        return;
    }

    const excludedComponents = [
        'dxLayoutManager'
    ];

    const getDefaultOptions = function(componentName) {
        switch(componentName) {
            case 'dxValidator':
                return { adapter: {} };
            case 'dxMap':
                return { provider: 'googleStatic' };
            default:
                return {};
        }
    };

    $.each(DevExpress.ui, function(componentName, componentConstructor) {
        if($.inArray(componentName, excludedComponents) !== -1
            || componentConstructor.IS_RENOVATED_WIDGET) {
            return;
        }

        const widgetName = componentName.replace('dx', '').toLowerCase();
        if($.fn[componentName]) {
            componentConstructor.prototype._defaultOptionsRules = function() {
                return [];
            };

            QUnit.test(componentName, function(assert) {
                const $element = this.$element;
                const component = $element[componentName](getDefaultOptions(componentName))[componentName]('instance');
                const options = component.option();

                component.QUnitAssert = assert;

                const classes = $element.attr('class').split(' ');

                $.each(classes, function(_, className) {
                    className = className.replace('dx-', '');

                    if(className.indexOf(widgetName) === 0) {
                        assert.ok(true, ' class name was checked');
                    } else {
                        className = className.replace('-', '');

                        if(className.indexOf(widgetName) === 0) {
                            assert.ok(false, className + ' is failed');
                        }
                    }
                });

                $.each(options, function(option) {
                    const prevValue = options[option];
                    let newValue = prevValue;

                    // NOTE: some widgets doesn't support dataSource === null
                    if(option === 'dataSource') {
                    // NOTE: dxResponsiveBox supports only plain object in items
                        let item = componentName === 'dxResponsiveBox' ? { text: 1 } : 1;
                        item = componentName === 'dxScheduler' ? { text: 1, startDate: new Date(2015, 0, 1) } : item;

                        newValue = new DataSource([item]);
                        options[option] = newValue;
                    }

                    if(componentName === 'dxDateViewRoller' && option === 'selectedIndex') {
                        return;
                    }

                    const assertOkSpy = sinon.spy(assert, 'ok');
                    component.beginUpdate();
                    component._notifyOptionChanged(option, newValue, prevValue);
                    component.endUpdate();

                    if(assertOkSpy.notCalled) {
                        assert.ok(true, option);
                    }
                    assertOkSpy.restore();
                });
            });
        }
    });
});
