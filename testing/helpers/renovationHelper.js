import registerComponent from 'core/component_registrator';
import { name as getName } from 'core/utils/public_component';
import { act } from 'preact/test-utils';
import Button from 'ui/button';
import rButton from 'renovation/ui/button.j';

export const isRenovation = () => rButton === Button;

export const createModuleConfig = (oldWidget, renovatedWidget, config = {}) => {
    const widgetName = getName(oldWidget);
    if(isRenovation()) {
        return {
            beforeEach: function() {
                const renovatedWidgetWrapper = renovatedWidget.inherit({
                    ctor: function() {
                        let res;
                        act(() => {
                            res = this.callBase.apply(this, arguments);
                        });
                        return res;
                    },
                    option: function() {
                        let res;
                        act(() => {
                            res = this.callBase.apply(this, arguments);
                        });
                        return res;
                    },
                    focus: function() {
                        let res;
                        act(() => {
                            res = this.callBase.apply(this, arguments);
                        });
                        return res;
                    }
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
        return config;
    }
};

export const getQUnitModuleForTestingRenovationWidget = (oldWidget, newWidget) => (name, config, tests) => {
    const realConfig = tests ? config : {};
    const realTests = tests || config;
    QUnit.module(name, config, () => realTests(false));
    const newConfig = createModuleConfig(oldWidget, newWidget, realConfig);
    QUnit.module(`Renovated ${name}`, newConfig, () => realTests(true));
};
