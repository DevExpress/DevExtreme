define(function(require) {
    const $ = require('jquery');
    const Component = require('core/component');
    const devices = require('core/devices');
    const GoogleStaticProvider = require('ui/map/provider.google_static');
    const fx = require('animation/fx');
    const executeAsyncMock = require('../../helpers/executeAsyncMock.js');
    const DataSource = require('data/data_source/data_source').DataSource;

    require('../../helpers/ignoreQuillTimers.js');
    require('bundles/modules/parts/widgets-all');

    if(!devices.real().generic) {
        return;
    }

    fx.off = true;
    GoogleStaticProvider.remapConstant('/mapURL?');

    QUnit.module('OptionChanged', {
        beforeEach: function() {
            // NOTE: workaround for inferno
            // component can not be rendered as body first-level child
            const $container = $('<div />').appendTo('body');
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
                    name === '_checkParentVisibility') {
                    return;
                }
                this.QUnitAssert.ok(false, 'Option \'' + name + '\' is not processed after runtime change');
            };

            executeAsyncMock.setup();
        },
        afterEach: function() {
            Component.prototype._optionChanged = this._originalOptionChanged;
            this.$element.parent().remove();
            executeAsyncMock.teardown();
        }
    }, function() {
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
    }.bind(this));
});

