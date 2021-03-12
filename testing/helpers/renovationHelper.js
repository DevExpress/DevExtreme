import registerComponent from 'core/component_registrator';
import { name as getName } from 'core/utils/public_component';

const WRAPPED_METHOD_NAMES = {
    ctor: true,
    option: true,
    focus: true,
    repaint: true,
    render: true,
    _createComponent: true,
};

function functionWrapper() {
    const that = this;
    const res = that.callBase.apply(that, arguments);
    return res;
}

const skipRenovationAsyncMethods = (widget) => {
    const wrappedMethods = Object.keys(WRAPPED_METHOD_NAMES).reduce((methods, methodName) => {
        methods[methodName] = functionWrapper;
        return methods;
    }, {});

    return widget.inherit(wrappedMethods);
};

export const setupRenovation = (widget) => {
    const widgetName = getName(widget);

    QUnit.moduleStart(() => {
        registerComponent(widgetName, skipRenovationAsyncMethods(widget));
    });

    QUnit.moduleDone(() => {
        registerComponent(widgetName, widget);
    });
};

export const createRenovationModuleConfig = (oldWidget, renovatedWidget, config = {}) => {
    const widgetName = getName(oldWidget);
    if(oldWidget.IS_RENOVATED_WIDGET !== undefined) {
        return {
            beforeEach: function() {
                const renovatedWidgetWrapper = renovatedWidget.inherit({
                    ctor: function() {
                        return this.callBase.apply(this, arguments);
                    },
                    option: function() {
                        return this.callBase.apply(this, arguments);
                    },
                    focus: function() {
                        return this.callBase.apply(this, arguments);
                    },
                    repaint: function() {
                        return this.callBase.apply(this, arguments);
                    },
                });
                renovatedWidgetWrapper.getInstance = renovatedWidget.getInstance;
                registerComponent(widgetName, renovatedWidgetWrapper);
                config.beforeEach && config.beforeEach.apply(this);
            },
            afterEach: function() {
                config.afterEach && config.afterEach.apply(this);
                registerComponent(widgetName, oldWidget);
            }
        };
    } else {
        registerComponent(widgetName, oldWidget);
        return config;
    }
};
