import registerComponent from 'core/component_registrator';
import { name as getName } from 'core/utils/public_component';
import { act } from 'preact/test-utils';

export const isRenovationWidget = (oldWidget) => {
    if(oldWidget.prototype._renderPreact !== undefined) {
        return true;
    }
    return false;
};

export const createModuleConfig = (oldWidget, renovatedWidget, config = {}) => {
    const widgetName = getName(oldWidget);
    if(isRenovationWidget(oldWidget)) {
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
