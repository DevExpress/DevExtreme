define(function(require) {
    var $ = require('jquery'),
        Component = require('core/component'),
        devices = require('core/devices'),
        GoogleStaticProvider = require('ui/map/provider.google_static'),
        fx = require('animation/fx'),
        executeAsyncMock = require('../../helpers/executeAsyncMock.js'),
        DataSource = require('data/data_source/data_source').DataSource;

    require('bundles/modules/parts/widgets-all');

    if(!devices.real().generic) {
        return;
    }

    fx.off = true;
    GoogleStaticProvider.remapConstant('/mapURL?');

    QUnit.module('OptionChanged', {
        beforeEach: function() {
            this.$element = $('<div />').appendTo('body');

            this._originalOptionChanged = Component.prototype._optionChanged;

            Component.prototype._optionChanged = function(args) {
                var name = args.name;

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
            this.$element.remove();
            executeAsyncMock.teardown();
        }
    });

    var excludedComponents = [
        'dxLayoutManager'
    ];

    var getDefaultOptions = function(componentName) {
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
        if($.inArray(componentName, excludedComponents) !== -1) {
            return;
        }

        var widgetName = componentName.replace('dx', '').toLowerCase();

        if($.fn[componentName]) {
            componentConstructor.prototype._defaultOptionsRules = function() {
                return [];
            };

            QUnit.test(componentName, function(assert) {
                var done = assert.async();

                var $element = this.$element,
                    component = $element[componentName](getDefaultOptions(componentName))[componentName]('instance'),
                    options = component.option(),
                    optionCount = 0;

                component.QUnitAssert = assert;

                var classes = $element.attr('class').split(' ');

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
                    var prevValue = options[option],
                        newValue = prevValue;

                    // NOTE: some widgets doesn't support dataSource === null
                    if(option === 'dataSource') {
                        // NOTE: dxResponsiveBox supports only plain object in items
                        var item = componentName === 'dxResponsiveBox' ? { text: 1 } : 1;
                        item = componentName === 'dxScheduler' ? { text: 1, startDate: new Date(2015, 0, 1) } : item;

                        newValue = new DataSource([item]);
                        options[option] = newValue;
                    }

                    if(componentName === 'dxDateViewRoller' && option === 'selectedIndex') {
                        return;
                    }

                    component.beginUpdate();

                    component._notifyOptionChanged(option, newValue, prevValue);
                    component.endUpdate();

                    optionCount++;
                });

                assert.ok(true, optionCount + ' options was checked');

                // Since jQuery 2.2.0 have the following code
                // https://github.com/jquery/jquery/blob/2.2-stable/src/ajax/xhr.js#L133
                // QUnit recognize it as uncleared timeout, so this test are async now.
                setTimeout(function() {
                    done();
                });
            });
        }
    });
});
