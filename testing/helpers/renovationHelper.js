import registerComponent from 'core/component_registrator';
import { name as getName } from 'core/utils/public_component';
import { act } from 'preact/test-utils';

export const createRenovationModuleConfig = (oldWidget, renovatedWidget, config = {}) => {
    const widgetName = getName(oldWidget);
    if(oldWidget.IS_RENOVATED_WIDGET !== undefined) {
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
                    },
                    repaint: function() {
                        let res;
                        act(() => {
                            res = this.callBase.apply(this, arguments);
                        });
                        return res;
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
        return config;
    }
};
