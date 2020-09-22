import $ from 'jquery';
import registerComponent from 'core/component_registrator';
import { name as getName } from 'core/utils/public_component';
import { act } from 'preact/test-utils';

const TICK_TIME = 1000;
let clock = null;

const skipWidgetAsyncFunctions = (widget) => {
    return widget.inherit({
        ctor: function() {
            const res = this.callBase.apply(this, arguments);
            clock.tick(TICK_TIME);
            return res;
        },
        option: function() {
            const res = this.callBase.apply(this, arguments);
            clock.tick(TICK_TIME);
            return res;
        },
        focus: function() {
            const res = this.callBase.apply(this, arguments);
            clock.tick(TICK_TIME);
            return res;
        },
        repaint: function() {
            const res = this.callBase.apply(this, arguments);
            clock.tick(TICK_TIME);
            return res;
        },
    });
};

export const createRenovationHook = (oldWidget, hooks) => {
    const widgetName = getName(oldWidget);
    hooks.beforeEach(function() {
        clock = sinon.useFakeTimers();
        this.triggerOld = $.prototype.trigger;
        const that = this;

        $.prototype.trigger = function(args) {
            that.triggerOld.call(this, args);
            clock.tick(TICK_TIME);
        };

        registerComponent(widgetName, skipWidgetAsyncFunctions(oldWidget));
    });
    hooks.afterEach(function() {
        $.prototype.trigger = this.triggerOld;
        registerComponent(widgetName, oldWidget);
        clock.restore();
    });
};

export const createRenovationConfig = (oldWidget, config) => {
    const widgetName = getName(oldWidget);
    return {
        beforeEach: function() {
            clock = sinon.useFakeTimers();
            this.triggerOld = $.prototype.trigger;
            const that = this;

            $.prototype.trigger = function(args) {
                that.triggerOld.call(this, args);
                clock.tick(TICK_TIME);
            };

            registerComponent(widgetName, skipWidgetAsyncFunctions(oldWidget));
            config.beforeEach && config.beforeEach.apply(this);
        },
        afterEach: function() {
            $.prototype.trigger = this.triggerOld;
            registerComponent(widgetName, oldWidget);
            clock.restore();
            config.afterEach && config.afterEach.apply(this);
        },
    };
};

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
        registerComponent(widgetName, oldWidget);
        return config;
    }
};
