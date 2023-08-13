import * as VueType from "vue";
import { DxComponent, IWidgetComponent } from "./component";
import { DxConfiguration, IConfigurable, IConfigurationComponent } from "./configuration-component";
import { DxExtensionComponent } from "./extension-component";

import * as events from "devextreme/events";

import { mount } from "@vue/test-utils";

const Vue = VueType.default || VueType;

const eventHandlers: { [index: string]: (e?: any) => void } = {};
const Widget = {
    option: jest.fn(),
    resetOption: jest.fn(),
    dispose: jest.fn(),
    on: (event: string, handler: (e: any) => void) => {
        eventHandlers[event] = handler;
    },
    fire: (event: string, args: any) => {
        if (!eventHandlers[event]) {
            throw new Error(`no handler registered for '${event}'`);
        }
        eventHandlers[event](args);
    },
    beginUpdate: jest.fn(),
    endUpdate: jest.fn(),
};

function createWidget(_, options) {
    if (options.onInitializing) {
        options.onInitializing.call(Widget);
    }
    return Widget;
}
const WidgetClass = jest.fn(createWidget);

const TestComponent = Vue.extend({
    extends: DxComponent(),
    beforeCreate() {
        (this as any as IWidgetComponent).$_WidgetClass = WidgetClass;
    },
    props: {
        prop1: Number,
        templateName: String
    },
    model: {
        prop: "prop1",
        event: "update:prop1"
    }
});

function skipIntegrationOptions(options: {
    integrationOptions?: object,
    onInitializing?: () => void
}): Record<string, any> {
    const result = {...options };
    delete result.integrationOptions;
    delete result.onInitializing;
    return result;
}

function buildTestConfigCtor(): VueType.VueConstructor {
    return Vue.extend({
        extends: DxConfiguration(),
        props: {
            prop1: Number,
            prop2: String
        }
    });
}

jest.setTimeout(1000);
beforeEach(() => {
    jest.clearAllMocks();
});

describe("component rendering", () => {

    it("correctly renders", () => {
        const vm = new TestComponent().$mount();
        expect(vm.$el.outerHTML).toBe("<div></div>");
    });

    it("calls widget creation", () => {
        new TestComponent().$mount();
        expect(WidgetClass).toHaveBeenCalledTimes(1);
        expect(Widget.beginUpdate).toHaveBeenCalledTimes(1);
        expect(Widget.endUpdate).toHaveBeenCalledTimes(1);
    });

    it("component has disabled inheritAttrs", () => {
        const component = new TestComponent();
        expect(component.$options.inheritAttrs).toBe(false);
    });

    it("passes id to element", () => {
        const vm = new Vue({
            template: "<test-component id='my-id'/>",
            components: {
                TestComponent
            }
        }).$mount();

        expect(vm.$el.id).toBe("my-id");
    });

    it("creates nested component", () => {
        new Vue({
            template: "<test-component><test-component/></test-component>",
            components: {
                TestComponent
            }
        }).$mount();

        expect(WidgetClass.mock.instances.length).toBe(2);
        expect(WidgetClass.mock.instances[1]).toEqual({});
    });
});

describe("options", () => {

    it("watch prop changing to undefined", (done) => {

        const wrapper = mount(TestComponent, {props: ["sampleProp"],
        propsData: {
            sampleProp: "default"
        }});

        (wrapper.vm as any).$_config.updateValue = jest.fn();
        wrapper.setProps({ sampleProp: undefined });

        Vue.nextTick(() => {
            expect((wrapper.vm as any as IConfigurable).$_config.updateValue).toBeCalled();
            done();
        });
    });

    it("pass props to option on mounting", () => {
        const vm = new TestComponent({
            propsData: {
                sampleProp: "default"
            }
        }).$mount();

        expect(WidgetClass.mock.calls[0][0]).toBe(vm.$el);

        expect(skipIntegrationOptions(WidgetClass.mock.calls[0][1])).toEqual({
            sampleProp: "default"
        });
    });

    it("pass the same template name as in props", () => {
        const vm = new Vue({
            template:
                `<test-component id="component" templateName="myTemplate">
                    <template #myTemplate>
                        content
                    </template>
                </test-component>`,
            components: {
                TestComponent
            }
        });

        vm.$mount();

        expect(WidgetClass.mock.calls[0][0]).toBe(vm.$el);

        expect(skipIntegrationOptions(WidgetClass.mock.calls[0][1])).toEqual({
            templateName: "myTemplate"
        });
    });

    it("pass template name as default", () => {
        const vm = new Vue({
            template:
                `<test-component id="component">
                    <template #templateName>
                        content
                    </template>
                </test-component>`,
            components: {
                TestComponent
            }
        });
        vm.$mount();
        expect(WidgetClass.mock.calls[0][0]).toBe(vm.$el);
        expect(skipIntegrationOptions(WidgetClass.mock.calls[0][1])).toEqual({
            templateName: "templateName"
        });
    });

    it("subscribes to optionChanged", () => {
        new TestComponent({
            props: ["sampleProp"]
        }).$mount();

        expect(eventHandlers).toHaveProperty("optionChanged");
    });

    it("watch prop changing", () => {
        const wrapper = mount(TestComponent, {props: ["sampleProp"],
        propsData: {
            sampleProp: "default"
        }});
        wrapper.setProps({ sampleProp: "new" });

        expect(Widget.option).toHaveBeenCalledTimes(1);
        expect(Widget.option).toHaveBeenCalledWith("sampleProp", "new");
    });

    it("watch array prop changing", (done) => {
        const arrayValue = [{ text: "text" }];
        new TestComponent({
            props: ["sampleProp"],
            propsData: {
                sampleProp: arrayValue
            }
        }).$mount();
        const valueChangedCallback = jest.fn();
        WidgetClass.mock.calls[0][1].integrationOptions.watchMethod(() => {
            return arrayValue[0].text;
        }, valueChangedCallback);

        expect(valueChangedCallback).toHaveBeenCalledTimes(1);
        expect(valueChangedCallback.mock.calls[0][0]).toBe("text");

        arrayValue[0].text = "changedText";
        Vue.nextTick(() => {
            expect(valueChangedCallback).toHaveBeenCalledTimes(2);
            expect(valueChangedCallback.mock.calls[1][0]).toBe("changedText");
            done();
        });
    });

    it("watch array prop changing with Date", (done) => {
        const date = new Date(2018, 11, 11);
        const arrayValue = [{ date }];
        new TestComponent({
            props: ["sampleProp"],
            propsData: {
                sampleProp: arrayValue
            }
        }).$mount();
        const valueChangedCallback = jest.fn();
        WidgetClass.mock.calls[0][1].integrationOptions.watchMethod(() => {
            return arrayValue[0].date;
        }, valueChangedCallback);

        expect(valueChangedCallback).toHaveBeenCalledTimes(1);
        expect(valueChangedCallback.mock.calls[0][0]).toBe(date);

        arrayValue[0].date = new Date(2018, 11, 11);
        Vue.nextTick(() => {
            expect(valueChangedCallback).toHaveBeenCalledTimes(1);
            expect(valueChangedCallback.mock.calls[0][0]).toBe(date);

            arrayValue[0].date = new Date(2018, 11, 12);
            Vue.nextTick(() => {
                expect(valueChangedCallback).toHaveBeenCalledTimes(2);
                expect(valueChangedCallback.mock.calls[1][0]).toEqual(new Date(2018, 11, 12));
                done();
            });
        });
    });

    it("watch array prop changing (deep)", (done) => {
        const arrayValue = [{
            data: {
                text: "text"
            }
        }];
        new TestComponent({
            props: ["sampleProp"],
            propsData: {
                sampleProp: arrayValue
            }
        }).$mount();
        const valueChangedCallback = jest.fn();
        WidgetClass.mock.calls[0][1].integrationOptions.watchMethod(() => {
            return arrayValue[0].data;
        }, valueChangedCallback, {
            deep: true
        });
        expect(valueChangedCallback).toHaveBeenCalledTimes(1);
        expect(valueChangedCallback.mock.calls[0][0]).toEqual({ text: "text" });

        arrayValue[0].data.text = "changedText";

        Vue.nextTick(() => {
            expect(valueChangedCallback).toHaveBeenCalledTimes(2);
            expect(valueChangedCallback.mock.calls[0][0]).toEqual({ text: "changedText" });
            done();
        });
    });

    it("watch array prop changing (skipImmediate)", (done) => {
        const arrayValue = [{
            text: "text"
        }];
        new TestComponent({
            props: ["sampleProp"],
            propsData: {
                sampleProp: arrayValue
            }
        }).$mount();
        const valueChangedCallback = jest.fn();
        WidgetClass.mock.calls[0][1].integrationOptions.watchMethod(() => {
            return arrayValue[0].text;
        }, valueChangedCallback, {
            skipImmediate: true
        });
        expect(valueChangedCallback).toHaveBeenCalledTimes(0);

        arrayValue[0].text = "changedText";

        Vue.nextTick(() => {
            expect(valueChangedCallback).toHaveBeenCalledTimes(1);
            expect(valueChangedCallback.mock.calls[0][0]).toEqual("changedText");
            done();
        });
    });
});

describe("configuration", () => {

    const Nested = buildTestConfigCtor();
    (Nested as any as IConfigurationComponent).$_optionName = "nestedOption";

    it("creates configuration", () => {
        const vm = new TestComponent();

        expect((vm as unknown as IConfigurable).$_config).not.toBeNull();
    });

    it("passes configuration initialValues to widget ctor", () => {
        const initialValues = {
            a: {},
            b: {
                c: {
                    d: {}
                }
            }
        };

        const vm = new TestComponent();
        (vm as unknown as IConfigurable).$_config = {
            getNestedOptionValues: jest.fn(() => initialValues),
            getOptionsToWatch: jest.fn()
        } as any;

        vm.$mount();

        expect(WidgetClass).toHaveBeenCalledTimes(1);
        expect(WidgetClass.mock.calls[0][1].a).toBe(initialValues.a);
        expect(WidgetClass.mock.calls[0][1].b).toBe(initialValues.b);
        expect(WidgetClass.mock.calls[0][1].b.c).toBe(initialValues.b.c);
        expect(WidgetClass.mock.calls[0][1].b.c.d).toBe(initialValues.b.c.d);
    });

    it("updates pendingOptions from a widget component configuration updateFunc", () => {
        const vm = new TestComponent();
        vm.$mount();

        const pendingOptions = (vm as unknown as IWidgetComponent).$_pendingOptions;

        const name = "abc";
        const value = {};

        (vm as unknown as IConfigurable).$_config.updateFunc(name, value);
        expect(pendingOptions[name]).toEqual(value);
    });

    it("initializes nested config", () => {
        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested :prop1="123" />` +
                `</test-component>`,
            components: {
                TestComponent,
                Nested
            }
        }).$mount();

        const config = (vm.$children[0] as any as IConfigurable).$_config;
        expect(config.nested).toHaveLength(1);
        expect(config.nested[0].name).toBe("nestedOption");
        expect(config.nested[0].options).toEqual(["prop1", "prop2"]);
        expect(config.nested[0].initialValues).toEqual({ prop1: 123 });
        expect(config.nested[0].isCollectionItem).toBeFalsy();
    });

    it("initializes nested config (collectionItem)", () => {
        const NestedCollectionItem = buildTestConfigCtor();
        (NestedCollectionItem as any as IConfigurationComponent).$_optionName = "nestedOption";
        (NestedCollectionItem as any as IConfigurationComponent).$_isCollectionItem = true;

        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested-collection-item :prop1="123" />` +
                `</test-component>`,
            components: {
                TestComponent,
                NestedCollectionItem
            }
        }).$mount();

        const config = (vm.$children[0] as any as IConfigurable).$_config;
        expect(config.nested).toHaveLength(1);
        expect(config.nested[0].name).toBe("nestedOption");
        expect(config.nested[0].options).toEqual(["prop1", "prop2"]);
        expect(config.nested[0].initialValues).toEqual({ prop1: 123 });
        expect(config.nested[0].isCollectionItem).toBeTruthy();
        expect(config.nested[0].collectionItemIndex).toBe(0);
    });

    it("initializes nested config (several collectionItems)", () => {
        const NestedCollectionItem = buildTestConfigCtor();
        (NestedCollectionItem as any as IConfigurationComponent).$_optionName = "nestedOption";
        (NestedCollectionItem as any as IConfigurationComponent).$_isCollectionItem = true;

        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested-collection-item :prop1="123" />` +
                `  <nested-collection-item :prop1="456" prop2="abc" />` +
                `  <nested-collection-item prop2="def" />` +
                `</test-component>`,
            components: {
                TestComponent,
                NestedCollectionItem
            }
        }).$mount();

        const config = (vm.$children[0] as any as IConfigurable).$_config;
        expect(config.nested).toHaveLength(3);

        expect(config.nested[0].name).toBe("nestedOption");
        expect(config.nested[0].options).toEqual(["prop1", "prop2"]);
        expect(config.nested[0].initialValues).toEqual({ prop1: 123 });
        expect(config.nested[0].isCollectionItem).toBeTruthy();
        expect(config.nested[0].collectionItemIndex).toBe(0);

        expect(config.nested[1].name).toBe("nestedOption");
        expect(config.nested[1].options).toEqual(["prop1", "prop2"]);
        expect(config.nested[1].initialValues).toEqual({ prop1: 456, prop2: "abc" });
        expect(config.nested[1].isCollectionItem).toBeTruthy();
        expect(config.nested[1].collectionItemIndex).toBe(1);

        expect(config.nested[2].name).toBe("nestedOption");
        expect(config.nested[2].options).toEqual(["prop1", "prop2"]);
        expect(config.nested[2].initialValues).toEqual({ prop2: "def" });
        expect(config.nested[2].isCollectionItem).toBeTruthy();
        expect(config.nested[2].collectionItemIndex).toBe(2);
    });

    it("initializes nested config predefined prop", () => {
        const predefinedValue = {};
        const NestedWithPredefined = buildTestConfigCtor();
        (NestedWithPredefined as any as IConfigurationComponent).$_optionName = "nestedOption";
        (NestedWithPredefined as any as IConfigurationComponent).$_predefinedProps = {
            predefinedProp: predefinedValue
        };

        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested-with-predefined />` +
                `</test-component>`,
            components: {
                TestComponent,
                NestedWithPredefined
            }
        }).$mount();

        const config = (vm.$children[0] as any as IConfigurable).$_config;
        const initialValues = config.getNestedOptionValues();
        expect(initialValues).toHaveProperty("nestedOption");
        expect(initialValues!.nestedOption).toHaveProperty("predefinedProp");
        expect(initialValues!.nestedOption!.predefinedProp).toBe(predefinedValue);
    });

    it("initializes sub-nested config", () => {
        const SubNested = buildTestConfigCtor();
        (SubNested as any as IConfigurationComponent).$_optionName = "subNestedOption";

        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested :prop1="123">` +
                `    <sub-nested prop2="abc"/>` +
                `  </nested>` +
                `</test-component>`,
            components: {
                TestComponent,
                Nested,
                SubNested
            }
        }).$mount();

        const config = (vm.$children[0] as any as IConfigurable).$_config;
        expect(config.nested).toHaveLength(1);

        const nestedConfig = config.nested[0];
        expect(nestedConfig.nested).toHaveLength(1);

        expect(nestedConfig.nested[0].name).toBe("subNestedOption");
        expect(nestedConfig.nested[0].options).toEqual(["prop1", "prop2"]);
        expect(nestedConfig.nested[0].initialValues).toEqual({ prop2: "abc" });
        expect(nestedConfig.nested[0].isCollectionItem).toBeFalsy();
    });

    it("initializes sub-nested config (collectionItem)", () => {
        const NestedCollectionItem = buildTestConfigCtor();
        (NestedCollectionItem as any as IConfigurationComponent).$_optionName = "subNestedOption";
        (NestedCollectionItem as any as IConfigurationComponent).$_isCollectionItem = true;

        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested>` +
                `    <nested-collection-item :prop1="123"/>` +
                `  </nested>` +
                `</test-component>`,
            components: {
                TestComponent,
                Nested,
                NestedCollectionItem
            }
        }).$mount();

        const config = (vm.$children[0] as any as IConfigurable).$_config;
        expect(config.nested).toHaveLength(1);

        const nestedConfig = config.nested[0];
        expect(nestedConfig.nested).toHaveLength(1);

        expect(nestedConfig.nested[0].name).toBe("subNestedOption");
        expect(nestedConfig.nested[0].options).toEqual(["prop1", "prop2"]);
        expect(nestedConfig.nested[0].initialValues).toEqual({ prop1: 123 });
        expect(nestedConfig.nested[0].isCollectionItem).toBeTruthy();
        expect(nestedConfig.nested[0].collectionItemIndex).toBe(0);
    });

    it("initializes sub-nested config (multiple collectionItems)", () => {
        const NestedCollectionItem = buildTestConfigCtor();
        (NestedCollectionItem as any as IConfigurationComponent).$_optionName = "subNestedOption";
        (NestedCollectionItem as any as IConfigurationComponent).$_isCollectionItem = true;

        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested>` +
                `    <nested-collection-item :prop1="123" />` +
                `    <nested-collection-item :prop1="456" prop2="abc" />` +
                `    <nested-collection-item prop2="def" />` +
                `  </nested>` +
                `</test-component>`,
            components: {
                TestComponent,
                Nested,
                NestedCollectionItem
            }
        }).$mount();

        const config = (vm.$children[0] as any as IConfigurable).$_config;
        expect(config.nested).toHaveLength(1);

        const nestedConfig = config.nested[0];
        expect(nestedConfig.nested).toHaveLength(3);

        expect(nestedConfig.nested[0].name).toBe("subNestedOption");
        expect(nestedConfig.nested[0].options).toEqual(["prop1", "prop2"]);
        expect(nestedConfig.nested[0].initialValues).toEqual({ prop1: 123 });
        expect(nestedConfig.nested[0].isCollectionItem).toBeTruthy();
        expect(nestedConfig.nested[0].collectionItemIndex).toBe(0);

        expect(nestedConfig.nested[1].name).toBe("subNestedOption");
        expect(nestedConfig.nested[1].options).toEqual(["prop1", "prop2"]);
        expect(nestedConfig.nested[1].initialValues).toEqual({ prop1: 456, prop2: "abc" });
        expect(nestedConfig.nested[1].isCollectionItem).toBeTruthy();
        expect(nestedConfig.nested[1].collectionItemIndex).toBe(1);

        expect(nestedConfig.nested[2].name).toBe("subNestedOption");
        expect(nestedConfig.nested[2].options).toEqual(["prop1", "prop2"]);
        expect(nestedConfig.nested[2].initialValues).toEqual({ prop2: "def" });
        expect(nestedConfig.nested[2].isCollectionItem).toBeTruthy();
        expect(nestedConfig.nested[2].collectionItemIndex).toBe(2);
    });

    describe("expectedChildren", () => {

        it("initialized for widget component", () => {
            const expected = {};

            const WidgetComponent = Vue.extend({
                extends: DxComponent(),
                beforeCreate() {
                    (this as any as IWidgetComponent).$_WidgetClass = WidgetClass;
                    (this as any as IWidgetComponent).$_expectedChildren = expected;
                }
            });

            const vm = new WidgetComponent();

            expect((vm as unknown as IWidgetComponent).$_config.expectedChildren).toBe(expected);
        });

        it("initialized for config component", () => {
            const expected = {};

            const ConfigComponent = buildTestConfigCtor();
            (ConfigComponent as any as IConfigurationComponent).$_optionName = "nestedOption";
            (ConfigComponent as any as IConfigurationComponent).$_expectedChildren = expected;

            const vm = new Vue({
                template:
                    `<test-component>` +
                    `  <config-component />` +
                    `</test-component>`,
                components: {
                    TestComponent,
                    ConfigComponent
                }
            }).$mount();

            const widgetConfig = (vm.$children[0] as any as IConfigurable).$_config;
            expect(widgetConfig.nested[0].expectedChildren).toBe(expected);
        });
    });

});

describe("nested option", () => {

    const Nested = buildTestConfigCtor();
    (Nested as any as IConfigurationComponent).$_optionName = "nestedOption";

    it("pulls initital values", () => {
        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested :prop1="123" />` +
                `</test-component>`,
            components: {
                TestComponent,
                Nested
            }
        }).$mount();

        expect(WidgetClass.mock.calls[0][0]).toBe(vm.$children[0].$el);

        expect(skipIntegrationOptions(WidgetClass.mock.calls[0][1])).toEqual({
            nestedOption: {
                prop1: 123
            }
        });
    });

    it("pulls initital values (collectionItem)", () => {
        const NestedCollectionItem = buildTestConfigCtor();
        (NestedCollectionItem as any as IConfigurationComponent).$_optionName = "nestedOption";
        (NestedCollectionItem as any as IConfigurationComponent).$_isCollectionItem = true;

        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested-collection-item :prop1="123" />` +
                `</test-component>`,
            components: {
                TestComponent,
                NestedCollectionItem
            }
        }).$mount();

        expect(WidgetClass.mock.calls[0][0]).toBe(vm.$children[0].$el);

        expect(skipIntegrationOptions(WidgetClass.mock.calls[0][1])).toEqual({
            nestedOption: [{
                prop1: 123
            }]
        });
    });

    it("pulls initital values (subnested)", () => {
        const SubNested = buildTestConfigCtor();
        (SubNested as any as IConfigurationComponent).$_optionName = "subNestedOption";

        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested :prop1="123">` +
                `    <sub-nested prop2="abc"/>` +
                `  </nested>` +
                `</test-component>`,
            components: {
                TestComponent,
                Nested,
                SubNested
            }
        }).$mount();

        expect(WidgetClass.mock.calls[0][0]).toBe(vm.$children[0].$el);

        expect(skipIntegrationOptions(WidgetClass.mock.calls[0][1])).toEqual({
            nestedOption: {
                prop1: 123,
                subNestedOption: {
                    prop2: "abc"
                }
            }
        });
    });

    it("pulls initital values (subnested collectionItem)", () => {
        const NestedCollectionItem = buildTestConfigCtor();
        (NestedCollectionItem as any as IConfigurationComponent).$_optionName = "subNestedOption";
        (NestedCollectionItem as any as IConfigurationComponent).$_isCollectionItem = true;

        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested :prop1="123">` +
                `    <nested-collection-item prop2="abc"/>` +
                `  </nested>` +
                `</test-component>`,
            components: {
                TestComponent,
                Nested,
                NestedCollectionItem
            }
        }).$mount();

        expect(WidgetClass.mock.calls[0][0]).toBe(vm.$children[0].$el);

        expect(skipIntegrationOptions(WidgetClass.mock.calls[0][1])).toEqual({
            nestedOption: {
                prop1: 123,
                subNestedOption: [{
                    prop2: "abc"
                }]
            }
        });
    });

    it("watches option changes", (done) => {
        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested :prop1="value" />` +
                `</test-component>`,
            components: {
                TestComponent,
                Nested
            },
            props: ["value"],
            propsData: {
                value: 123
            }
        }).$mount();

        vm.$props.value = 456;

        Vue.nextTick(() => {
            expect(Widget.option).toHaveBeenCalledTimes(1);
            expect(Widget.option).toHaveBeenCalledWith("nestedOption.prop1", 456);
            done();
        });
    });

    it("should initialize watchers once", (done) => {
        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested :prop1="value" />` +
                `</test-component>`,
            components: {
                TestComponent,
                Nested
            },
            props: ["value"],
            propsData: {
                value: 123
            }
        }).$mount();

        const nestedConfig = (vm.$children[0] as any ).$children[0].$vnode;
        const expected = nestedConfig.componentInstance._watcher.id;

        vm.$props.value = 456;

        Vue.nextTick(() => {
            expect(nestedConfig.componentInstance._watcher.id).toEqual(expected);
            done();
        });
    });

    it("should reinit binding and optionChanged functions for nested components after changes", (done) => {
        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested :prop1="value" />` +
                `</test-component>`,
            components: {
                TestComponent,
                Nested
            },
            data() {
                return {
                    value: 123
                };
            }
        }).$mount();

        vm.$data.value = 456;

        Vue.nextTick(() => {
            const nestedConfig = (vm.$children[0] as any ).$children[0].$vnode.componentOptions.$_config;
            expect(nestedConfig._emitOptionChanged).toBeDefined();
            expect(nestedConfig._options).toBeDefined();
            expect(Widget.option).toHaveBeenCalledWith("nestedOption.prop1", 456);
            done();
        });
    });

    it("component shouldn't emit update for the same value (v-model)", (done) => {
        const vm = new Vue({
            template:
                `<test-component v-model="value">` +
                `</test-component>`,
            components: {
                TestComponent
            },
            props: ["value"],
            propsData: {
                value: 123
            }
        }).$mount();

        const $emitSpy = jest.spyOn(vm.$children[0], "$emit");

        Widget.fire("optionChanged", { name: "prop1", fullName: "prop1", value: 456, previousValue: 123 });

        Vue.nextTick(() => {
            Widget.fire("optionChanged", { name: "prop1", fullName: "prop1", value: 456, previousValue: 123 });

            expect(vm.$props.value).toBe(456);
            expect($emitSpy).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it("component shouldn't set option if option already set (v-model)", (done) => {
        new Vue({
            template:
                `<test-component v-model="value">` +
                `</test-component>`,
            components: {
                TestComponent
            },
            props: ["value"],
            propsData: {
                value: 123
            }
        }).$mount();

        Widget.fire("optionChanged", { name: "prop1", fullName: "prop1", value: 456, previousValue: 123 });

        Vue.nextTick(() => {
            expect(Widget.option).toHaveBeenCalledTimes(0);
            done();
        });
    });

    it("add nested component by condition", (done) => {
        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested v-if="showNest" :prop1="123" />` +
                `</test-component>`,
            components: {
                TestComponent,
                Nested
            },
            data: {
                showNest: false
            }
        }).$mount();

        vm.$data.showNest = true;

        Vue.nextTick(() => {
            expect(Widget.option).toHaveBeenCalledWith("nestedOption", { prop1: 123 });
            done();
        });
    });

    it("remove nested component by condition", (done) => {
        const NestedCollectionItem = buildTestConfigCtor();
        (NestedCollectionItem as any as IConfigurationComponent).$_optionName = "nestedOption";
        (NestedCollectionItem as any as IConfigurationComponent).$_isCollectionItem = true;
        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested-collection-item v-if="showNest" :prop1="123" />` +
                `  <nested-collection-item :prop1="321" />` +
                `</test-component>`,
            components: {
                TestComponent,
                NestedCollectionItem
            },
            data: {
                showNest: true
            }
        }).$mount();

        vm.$data.showNest = false;

        Vue.nextTick(() => {
            expect(Widget.option).toHaveBeenCalledWith("nestedOption", [{ prop1: 321 }]);
            done();
        });
    });

    it("should update only part of collection components", (done) => {
        const NestedCollectionItem = buildTestConfigCtor();
        (NestedCollectionItem as any as IConfigurationComponent).$_optionName = "nestedOption";
        (NestedCollectionItem as any as IConfigurationComponent).$_isCollectionItem = true;
        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested-collection-item>` +
                `     <nested-collection-item>` +
                `       <nested-collection-item v-if="showNest" :prop1="123">` +
                `       </nested-collection-item>` +
                `       <nested-collection-item :prop1="321">` +
                `       </nested-collection-item>` +
                `     </nested-collection-item>` +
                `  </nested-collection-item>` +
                `</test-component>`,
            components: {
                TestComponent,
                NestedCollectionItem
            },
            data: {
                showNest: true
            }
        }).$mount();

        vm.$data.showNest = false;

        Vue.nextTick(() => {
            expect(Widget.option)
                .toHaveBeenCalledWith("nestedOption[0].nestedOption[0].nestedOption", [{ prop1: 321 }]);
            done();
        });
    });

    it("should update only part of collection components (remove all subnested)", (done) => {
        const NestedCollectionItem = buildTestConfigCtor();
        (NestedCollectionItem as any as IConfigurationComponent).$_optionName = "nestedOption";
        (NestedCollectionItem as any as IConfigurationComponent).$_isCollectionItem = true;
        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested-collection-item>` +
                `     <nested-collection-item>` +
                `       <nested-collection-item v-if="showNest" :prop1="123">` +
                `       </nested-collection-item>` +
                `       <nested-collection-item v-if="showNest" :prop1="321">` +
                `       </nested-collection-item>` +
                `     </nested-collection-item>` +
                `  </nested-collection-item>` +
                `</test-component>`,
            components: {
                TestComponent,
                NestedCollectionItem
            },
            data: {
                showNest: true
            }
        }).$mount();

        vm.$data.showNest = false;

        Vue.nextTick(() => {
            expect(Widget.option).toHaveBeenCalledWith("nestedOption[0].nestedOption[0].nestedOption", undefined);
            done();
        });
    });

    it("replace and add new property", (done) => {
        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested v-if="showNest" :prop1="123" />` +
                `  <nested v-if="!showNest" :prop1="123" prop2="text" />` +
                `</test-component>`,
            components: {
                TestComponent,
                Nested
            },
            data: {
                showNest: true
            }
        }).$mount();

        vm.$data.showNest = false;

        Vue.nextTick(() => {
            expect(Widget.option).toHaveBeenCalledWith("nestedOption.prop2", "text");
            done();
        });
    });

    it("replace and update property", (done) => {
        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested v-if="showNest" :prop1="123" />` +
                `  <nested v-if="!showNest" :prop1="321" />` +
                `</test-component>`,
            components: {
                TestComponent,
                Nested
            },
            data: {
                showNest: true
            }
        }).$mount();

        vm.$data.showNest = false;

        Vue.nextTick(() => {
            expect(Widget.option).toHaveBeenCalledWith("nestedOption.prop1", 321);
            done();
        });
    });

    it("reset nested component", (done) => {
        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested v-if="showNest" :prop1="123" />` +
                `</test-component>`,
            components: {
                TestComponent,
                Nested
            },
            data: {
                showNest: true
            }
        }).$mount();

        vm.$data.showNest = false;

        Vue.nextTick(() => {
            expect(Widget.resetOption).toHaveBeenCalledWith("nestedOption");
            done();
        });
    });

    it("watches option changes (collectionItem)", (done) => {
        const NestedCollectionItem = buildTestConfigCtor();
        (NestedCollectionItem as any as IConfigurationComponent).$_optionName = "nestedOption";
        (NestedCollectionItem as any as IConfigurationComponent).$_isCollectionItem = true;

        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested-collection-item :prop1="value" />` +
                `</test-component>`,
            components: {
                TestComponent,
                NestedCollectionItem
            },
            props: ["value"],
            propsData: {
                value: 123
            }
        }).$mount();

        vm.$props.value = 456;

        Vue.nextTick(() => {
            expect(Widget.option).toHaveBeenCalledTimes(1);
            expect(Widget.option).toHaveBeenCalledWith("nestedOption[0].prop1", 456);
            done();
        });
    });

    it("watches option changes (subnested)", (done) => {
        const SubNested = buildTestConfigCtor();
        (SubNested as any as IConfigurationComponent).$_optionName = "subNestedOption";

        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested>` +
                `    <sub-nested :prop1="value"/>` +
                `  </nested>` +
                `</test-component>`,
            components: {
                TestComponent,
                Nested,
                SubNested
            },
            props: ["value"],
            propsData: {
                value: 123
            }
        }).$mount();

        vm.$props.value = 456;

        Vue.nextTick(() => {
            expect(Widget.option).toHaveBeenCalledTimes(1);
            expect(Widget.option).toHaveBeenCalledWith("nestedOption.subNestedOption.prop1", 456);
            done();
        });
    });

    it("watches option changes (subnested collectionItem)", (done) => {
        const SubNestedCollectionItem = buildTestConfigCtor();
        (SubNestedCollectionItem as any as IConfigurationComponent).$_optionName = "subNestedOption";
        (SubNestedCollectionItem as any as IConfigurationComponent).$_isCollectionItem = true;

        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested>` +
                `    <sub-nested-collection-item :prop1="value"/>` +
                `  </nested>` +
                `</test-component>`,
            components: {
                TestComponent,
                Nested,
                SubNestedCollectionItem
            },
            props: ["value"],
            propsData: {
                value: 123
            }
        }).$mount();

        vm.$props.value = 456;

        Vue.nextTick(() => {
            expect(Widget.option).toHaveBeenCalledTimes(1);
            expect(Widget.option).toHaveBeenCalledWith("nestedOption.subNestedOption[0].prop1", 456);
            done();
        });
    });

    it.skip("is not duplicated on rerender", (cb) => {
        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested :prop1="123" />` +
                `</test-component>`,
            components: {
                TestComponent,
                Nested
            }
        }).$mount();
        const config = (vm.$children[0] as any as IConfigurable).$_config;

        vm.$forceUpdate();

        Vue.nextTick(() => {
            try {
                expect(config.nested).toHaveLength(1);
            } catch (e) {
                cb.fail(e);
            }
            cb();
        });
    });

    it("removes obstructive nodes before widget creation (T711311)", () => {
        const SubNestedCollectionItem = buildTestConfigCtor();
        (SubNestedCollectionItem as any as IConfigurationComponent).$_optionName = "subNestedOption";
        (SubNestedCollectionItem as any as IConfigurationComponent).$_isCollectionItem = true;

        let innerHtml;
        WidgetClass.mockImplementationOnce((element: HTMLElement, options: any) => {
            innerHtml = element.innerHTML;
            return createWidget(element, options);
        });

        new Vue({
            template:
                `<test-component>` +
                `  <nested>` +
                `    <sub-nested-collection-item/>` +
                `  </nested>` +
                `</test-component>`,
            components: {
                TestComponent,
                Nested,
                SubNestedCollectionItem
            },
        }).$mount();

        expect(innerHtml).toBe("");
    });

    it("restore nodes after widget creation (T800987)", () => {
        const vm = new Vue({
            template:
                `<test-component>` +
                `  <nested/>` +
                `  <nested/>` +
                `</test-component>`,
            components: {
                TestComponent,
                Nested
            }
        }).$mount();

        expect(vm.$el.childNodes.length).toBe(3);
    });
});

function renderTemplate(name: string, model?: object, container?: any, index?: number): Element {
    model = model || {};
    container = container || document.createElement("div");
    const render = WidgetClass.mock.calls[0][1].integrationOptions.templates[name].render;
    return render({
        container,
        model,
        index
    });
}

describe("template", () => {

    const DX_TEMPLATE_WRAPPER = "dx-template-wrapper";
    const componentWithTemplate = Vue.extend({
        template: `<test-component :prop1='prop1Value'>
                     <template #test v-if='renderTemplate'>content</template>
                   </test-component>`,
        components: {
            TestComponent
        },
        props: ["renderTemplate", "prop1Value"]
    });

    function renderItemTemplate(model?: object, container?: any, index?: number): Element {
        return renderTemplate("item", model, container, index);
    }

    it("passes integrationOptions to widget", () => {
        new Vue({
            template: `<test-component>
                         <div slot='item' slot-scope='data'>1</div>
                         <div slot='content' slot-scope='_'>1</div>
                         <div>1</div>
                       </test-component>`,
            components: {
                TestComponent
            }
        }).$mount();
        const integrationOptions = WidgetClass.mock.calls[0][1].integrationOptions;

        expect(integrationOptions).toBeDefined();
        expect(integrationOptions.templates).toBeDefined();

        expect(integrationOptions.templates.item).toBeDefined();
        expect(typeof integrationOptions.templates.item.render).toBe("function");

        expect(integrationOptions.templates.content).toBeDefined();
        expect(typeof integrationOptions.templates.content.render).toBe("function");

        expect(integrationOptions.templates.default).toBeUndefined();
    });

    it("passes 'integrationOptions.templates' on update", () => {
        const wrapper = mount(componentWithTemplate, {
            propsData: {
                renderTemplate: false,
                prop1Value: 1
            }
        });

        wrapper.setProps({
            renderTemplate: true
        });

        expect(Widget.option.mock.calls[0][0]).toEqual("integrationOptions.templates");
        expect(Widget.option.mock.calls[0][1].test.render).toBeInstanceOf(Function);
    });

    it("passes 'integrationOptions.templates' on update before other options", () => {
        const wrapper = mount(componentWithTemplate, {
            propsData: {
                renderTemplate: false,
                prop1Value: 1
            }
        });

        wrapper.setProps({
            renderTemplate: true,
            prop1Value: 2
        });

        expect(Widget.option.mock.calls[0][0]).toEqual("integrationOptions.templates");
        expect(Widget.option.mock.calls[1]).toEqual([ "test", "test" ]);
        expect(Widget.option.mock.calls[2]).toEqual([ "prop1", 2 ]);
    });

    it("does not unnecessarily pass 'integrationOptions.templates'", () => {
        const wrapper = mount(componentWithTemplate, {
            propsData: {
                renderTemplate: true,
                prop1Value: 1
            }
        });

        wrapper.setProps({
            prop1Value: 2
        });

        wrapper.setProps({
            prop1Value: 3
        });

        expect(
            Widget.option.mock.calls.find((call) => call[0] === "integrationOptions.templates")
        ).toBeUndefined();
    });

    it("renders", () => {
        new Vue({
            template: `<test-component>
                            <div slot='item' slot-scope='_'>Template</div>
                        </test-component>`,
            components: {
                TestComponent
            }
        }).$mount();
        const renderedTemplate = renderItemTemplate();

        expect(renderedTemplate.nodeName).toBe("DIV");
        expect(renderedTemplate.className).toBe(DX_TEMPLATE_WRAPPER);
        expect(renderedTemplate.innerHTML).toBe("Template");
    });

    it("renders scoped slot", () => {
        new Vue({
            template: `<test-component>
                            <div slot='item' slot-scope='{ data: { text }, index }'>
                                Template {{text}} and index {{index}}
                            </div>
                        </test-component>`,
            components: {
                TestComponent
            }
        }).$mount();
        const renderedTemplate = renderItemTemplate({ text: "with data" }, undefined, 5);
        expect(renderedTemplate.innerHTML).toContain("Template with data and index 5");
    });

    it("adds templates as children", () => {
        const vm = new Vue({
            template: `<test-component ref="component">
                            <div slot='item' slot-scope='props'>Template</div>
                        </test-component>`,
            components: {
                TestComponent
            }
        }).$mount();
        renderItemTemplate({});

        const component: any = vm.$refs.component;
        expect(component.$children.length).toBe(1);
    });

    it("updates templates on component updating (check via functional component inside)", () => {
        expect.assertions(2);
        const FunctionalComponent = Vue.extend({
            functional: true,
            render(h) {
                expect(true).toBeTruthy();
                return h("div");
            }
        });
        const vm = new Vue({
            template: `<test-component ref="component">
                            <div slot='item' slot-scope='props'><functional-component/></div>
                        </test-component>`,
            components: {
                TestComponent,
                FunctionalComponent
            }
        }).$mount();
        renderItemTemplate({});

        const component: any = vm.$refs.component;
        component.$forceUpdate();
    });

    it("unwraps container", () => {
        new Vue({
            template: `<test-component>
                            <div slot='item' slot-scope='{ data }'>Template {{data.text}}</div>
                        </test-component>`,
            components: {
                TestComponent
            }
        }).$mount();
        const renderedTemplate = renderItemTemplate(
            { text: "with data" },
            { get: () => document.createElement("div") }
        );

        expect(renderedTemplate.nodeName).toBe("DIV");
        expect(renderedTemplate.innerHTML).toBe("Template with data");
    });

    it("preserves classes", () => {
        new Vue({
            template: `<test-component>
                            <div slot='item' slot-scope='props' class='custom-class'></div>
                        </test-component>`,
            components: {
                TestComponent
            }
        }).$mount();
        const renderedTemplate = renderItemTemplate({});

        expect(renderedTemplate.className).toBe(`custom-class ${DX_TEMPLATE_WRAPPER}`);
    });

    it("preserves custom-attrs", () => {
        new Vue({
            template: `<test-component>
                            <div slot='item' slot-scope='props' custom-attr=123 ></div>
                        </test-component>`,
            components: {
                TestComponent
            }
        }).$mount();
        const renderedTemplate = renderItemTemplate({});

        expect(renderedTemplate.attributes).toHaveProperty("custom-attr");
        expect(renderedTemplate.attributes["custom-attr"].value).toBe("123");
    });

    it("doesn't throw on dxremove", () => {
        new Vue({
            template: `<test-component>
                            <div slot='item' slot-scope='props'>Template {{props.text}}</div>
                        </test-component>`,
            components: {
                TestComponent
            }
        }).$mount();

        const renderedTemplate = renderItemTemplate({ text: "with data" });

        expect(() => events.triggerHandler(renderedTemplate, "dxremove")).not.toThrow();
    });

    it("unmounts template with root element node", () => {
        const vm = new Vue({
            template: `<test-component>
                            <div slot='item' slot-scope='props'>Template {{props.text}}</div>
                        </test-component>`,
            components: {
                TestComponent
            }
        }).$mount();

        const container = document.createElement("div");
        renderItemTemplate({ text: "with data" }, container);
        events.triggerHandler(container.children[0], "dxremove");

        expect(vm.$children[0].$children.length).toEqual(0);
    });

    it("unmounts template with root text node", () => {
        const vm = new Vue({
            template: `<test-component>
                            <template #item="{data}">Template {{data.text}}</template>
                        </test-component>`,
            components: {
                TestComponent
            }
        }).$mount();

        const container = document.createElement("div");
        renderItemTemplate({ text: "with data" }, container);
        events.triggerHandler(container.children[0], "dxremove");

        expect(vm.$children[0].$children.length).toEqual(0);
    });

    it("destroyed component should remove subscriptions", (done) => {
        const vm = new Vue({
            template: `<test-component :prop1="value">
                            <template #item="{data}">Template {{data.text}}</template>
                        </test-component>`,
            components: {
                TestComponent
            },
            props: ["value"],
            propsData: {
                value: 123
            }
        }).$mount();

        const container = document.createElement("div");
        renderItemTemplate({ text: "with data" }, container);
        events.triggerHandler(container.children[0], "dxremove");
        renderItemTemplate({ text: "with data" }, container);

        const subscriptions = (vm.$children[0] as any).eventBus._events;

        for (const subscription of subscriptions) {
            expect(subscription.length).toBe(1);
        }

        done();
    });

    describe("with DOM", () => {
        let fixture;

        beforeEach(() => {
            fixture = document.createElement("div");
            document.body.appendChild(fixture);
        });

        afterEach(() => {
            fixture.remove();
        });

        it("template content should be rendered in DOM", () => {
            let mountedInDom;
            const ChildComponent = Vue.extend({
                template: "<div></div>",
                mounted() {
                    mountedInDom = document.body.contains(this.$el);
                }
            });
            const instance = new Vue({
                el: fixture,
                template: `<test-component ref="component">
                                <div class="template-container"></div>
                                <template #tmpl>
                                    <child-component/>
                                </template>
                            </test-component>`,
                components: {
                    TestComponent,
                    ChildComponent
                }
            }).$mount();

            renderTemplate("tmpl", {}, instance.$el.querySelector(".template-container"));

            expect(mountedInDom).toBeTruthy();
        });
    });
});

describe("static items", () => {
    it("passes integrationOptions to widget", () => {
        const NestedItem = Vue.extend({
            extends: DxConfiguration(),
            props: {
                prop1: Number,
                template: String
            }
        });
        (NestedItem as any as IConfigurationComponent).$_optionName = "items";
        (NestedItem as any as IConfigurationComponent).$_isCollectionItem = true;

        new Vue({
            template: `<test-component>
                         <nested-item>
                            <div slot-scope="_">1</div>
                         </nested-item>
                       </test-component>`,
            components: {
                TestComponent,
                NestedItem
            }
        }).$mount();
        const integrationOptions = WidgetClass.mock.calls[0][1].integrationOptions;

        expect(integrationOptions).toBeDefined();
        expect(integrationOptions.templates).toBeDefined();

        expect(integrationOptions.templates["items[0].template"]).toBeDefined();
        expect(typeof integrationOptions.templates["items[0].template"].render).toBe("function");
    });

    it("passes configuration component updates before templates", (done) => {
        const NestedItem = Vue.extend({
            extends: DxConfiguration(),
            props: {
                template: String
            }
        });
        (NestedItem as any as IConfigurationComponent).$_optionName = "items";
        (NestedItem as any as IConfigurationComponent).$_isCollectionItem = true;

        const vm = new Vue({
            template: `<test-component :prop1='prop1Value'>
                        <nested-item v-if="renderTemplate">
                            <template #default>
                                <div>1</div>
                            </template>
                        </nested-item>
                    </test-component>`,
            components: {
                TestComponent,
                NestedItem
            },
            data: {
                renderTemplate: false,
                prop1Value: 1
            }
        }).$mount();

        vm.$data.renderTemplate = true;
        vm.$data.prop1Value = 2;

        Vue.nextTick(() => {
            expect(Widget.option.mock.calls[0][0]).toEqual("items");
            expect(Widget.option.mock.calls[1][0]).toEqual("integrationOptions.templates");
            expect(Widget.option.mock.calls[2][0]).toEqual("items[0].template");
            expect(Widget.option.mock.calls[3][0]).toEqual("prop1");
            done();
        });
    });

    it("doesn't pass integrationOptions to widget if template prop is absent", () => {
        const NestedItem = Vue.extend({
            extends: DxConfiguration(),
            props: {
                prop1: Number
            }
        });
        (NestedItem as any as IConfigurationComponent).$_optionName = "items";
        (NestedItem as any as IConfigurationComponent).$_isCollectionItem = true;

        new Vue({
            template: `<test-component>
                         <nested-item>
                            <div slot-scope="_">1</div>
                         </nested-item>
                       </test-component>`,
            components: {
                TestComponent,
                NestedItem
            }
        }).$mount();
        const integrationOptions = WidgetClass.mock.calls[0][1].integrationOptions;

        expect(integrationOptions).toBeDefined();
        expect(integrationOptions.templates).toBeUndefined();
    });

    it("renders", () => {
        const NestedItem = Vue.extend({
            extends: DxConfiguration(),
            props: {
                prop1: Number,
                template: String
            }
        });
        (NestedItem as any as IConfigurationComponent).$_optionName = "items";
        (NestedItem as any as IConfigurationComponent).$_isCollectionItem = true;

        new Vue({
            template: `<test-component>
                         <nested-item>
                            <div slot-scope="_">1</div>
                         </nested-item>
                       </test-component>`,
            components: {
                TestComponent,
                NestedItem
            }
        }).$mount();

        const renderedTemplate = renderTemplate("items[0].template");

        expect(renderedTemplate.innerHTML).toBe("1");
    });

    it("renders template containing text only (vue 3)", () => {
        const NestedItem = Vue.extend({
            extends: DxConfiguration(),
            props: {
                prop1: Number,
                template: String
            }
        });
        (NestedItem as any as IConfigurationComponent).$_optionName = "item";

        new Vue({
            template: `<test-component>
                         <nested-item>
                            <template #default>abc</template>
                         </nested-item>
                       </test-component>`,
            components: {
                TestComponent,
                NestedItem
            }
        }).$mount();

        const renderedTemplate = renderTemplate("item.template");

        expect(renderedTemplate.textContent).toBe("abc");
    });

    it("renders template with several root elements (vue 3)", () => {
        const NestedItem = Vue.extend({
            extends: DxConfiguration(),
            props: {
                prop1: Number,
                template: String
            }
        });
        (NestedItem as any as IConfigurationComponent).$_optionName = "item";

        expect( () =>
            new Vue({
                template: `<test-component>
                            <nested-item>
                            <template #default>a<p>b</p>c</template>
                            </nested-item>
                        </test-component>`,
                components: {
                    TestComponent,
                    NestedItem
                }
            }).$mount()
        );
    });

    it("renders template with single root element (vue 3)", () => {
        const NestedItem = Vue.extend({
            extends: DxConfiguration(),
            props: {
                prop1: Number,
                template: String
            }
        });
        (NestedItem as any as IConfigurationComponent).$_optionName = "item";

        new Vue({
            template: `<test-component>
                         <nested-item>
                            <template #default><p>abc</p></template>
                         </nested-item>
                       </test-component>`,
            components: {
                TestComponent,
                NestedItem
            }
        }).$mount();

        const renderedTemplate = renderTemplate("item.template");

        expect(renderedTemplate.innerHTML).toBe("abc");
    });

    it("keeps template root element class and id (vue 3)", () => {
        const NestedItem = Vue.extend({
            extends: DxConfiguration(),
            props: {
                prop1: Number,
                template: String
            }
        });
        (NestedItem as any as IConfigurationComponent).$_optionName = "item";

        new Vue({
            template: `<test-component>
                         <nested-item>
                            <template #default><p id='preserved-id' class='preserved-class'>abc</p></template>
                         </nested-item>
                       </test-component>`,
            components: {
                TestComponent,
                NestedItem
            }
        }).$mount();

        const renderedTemplate = renderTemplate("item.template");

        expect(renderedTemplate.outerHTML)
            .toBe(`<p id="preserved-id" class="preserved-class dx-template-wrapper">abc</p>`);
    });

    it("render nested template", () => {
        const NestedItem = Vue.extend({
            extends: DxConfiguration(),
            props: {
                prop1: Number,
                template: String
            }
        });
        (NestedItem as any as IConfigurationComponent).$_optionName = "items";
        (NestedItem as any as IConfigurationComponent).$_isCollectionItem = true;

        new Vue({
            template: `<test-component>
                         <nested-item>
                            <div slot-scope="_">1</div>
                            <nested-item>
                                <div slot-scope="_">2</div>
                            </nested-item>
                         </nested-item>
                       </test-component>`,
            components: {
                TestComponent,
                NestedItem
            }
        }).$mount();

        const renderedTemplate = renderTemplate("items[0].template");
        const renderedNestedTemplate = renderTemplate("items[0].items[0].template");

        expect(renderedTemplate.innerHTML).toBe("1");
        expect(renderedNestedTemplate.innerHTML).toBe("2");
    });

    it("doesn't pass integrationOptions to widget if nested item has sub nested item", () => {
        const NestedItem = Vue.extend({
            extends: DxConfiguration(),
            props: {
                prop1: Number,
                template: String
            }
        });
        (NestedItem as any as IConfigurationComponent).$_optionName = "items";
        (NestedItem as any as IConfigurationComponent).$_isCollectionItem = true;

        const SubNested = buildTestConfigCtor();
        (SubNested as any as IConfigurationComponent).$_optionName = "subNestedOption";

        new Vue({
            template: `<test-component>
                         <nested-item>
                            <sub-nested prop2="abc"/>
                         </nested-item>
                       </test-component>`,
            components: {
                TestComponent,
                SubNested,
                NestedItem
            }
        }).$mount();

        expect(WidgetClass.mock.calls[0][1].integrationOptions.templates).toBeUndefined();
    });
});

describe("events emitting", () => {

    it("forwards DevExtreme events in camelCase", () => {
        const expectedArgs = {};
        const parent = new Vue({
            template: "<TestComponent v-on:testEventName=''></TestComponent>",
            components: { TestComponent }
        }).$mount();
        const $emitSpy = jest.spyOn(parent.$children[0], "$emit");

        Widget.fire("testEventName", expectedArgs);

        expect($emitSpy).toHaveBeenCalledTimes(1);
        expect($emitSpy.mock.calls[0][0]).toBe("testEventName");
        expect($emitSpy.mock.calls[0][1]).toBe(expectedArgs);
    });

    it("forwards DevExtreme events in kebab-case", () => {
        const expectedArgs = {};
        const parent = new Vue({
            template: "<TestComponent v-on:test-event-name=''></TestComponent>",
            components: { TestComponent }
        }).$mount();
        const $emitSpy = jest.spyOn(parent.$children[0], "$emit");

        Widget.fire("testEventName", expectedArgs);

        expect($emitSpy).toHaveBeenCalledTimes(1);
        expect($emitSpy.mock.calls[0][0]).toBe("test-event-name");
        expect($emitSpy.mock.calls[0][1]).toBe(expectedArgs);
    });
});

describe("extension component", () => {
    const ExtensionWidgetClass = jest.fn(createWidget);
    const TestExtensionComponent = Vue.extend({
        extends: DxExtensionComponent(),
        beforeCreate() {
            (this as any as IWidgetComponent).$_WidgetClass = ExtensionWidgetClass;
        }
    });

    it("renders once if mounted manually and targets self element", () => {
        const component = new TestExtensionComponent().$mount();

        const expectedElement = component.$el;
        const actualElement = ExtensionWidgetClass.mock.calls[0][0];

        expect(ExtensionWidgetClass).toHaveBeenCalledTimes(1);
        expect(actualElement).toBe(expectedElement);
    });

    it("renders once without parent element and targets self element", () => {
        const vue = new Vue({
            template: `<test-extension-component/>`,
            components: {
                TestExtensionComponent
            }
        }).$mount();

        const expectedElement = vue.$el;
        const actualElement = ExtensionWidgetClass.mock.calls[0][0];

        expect(ExtensionWidgetClass).toHaveBeenCalledTimes(1);
        expect(actualElement).toBe(expectedElement);
    });

    it("renders once inside component and targets parent element", () => {
        new Vue({
            template: `<test-component>
                            <test-extension-component/>
                        </test-component>`,
            components: {
                TestComponent,
                TestExtensionComponent
            }
        }).$mount();

        const expectedElement = WidgetClass.mock.calls[0][0];
        const actualElement = ExtensionWidgetClass.mock.calls[0][0];

        expect(ExtensionWidgetClass).toHaveBeenCalledTimes(1);
        expect(actualElement).toBe(expectedElement);
    });

    it("should remove extension component from dom", () => {
        let childCount;
        WidgetClass.mockImplementationOnce((element: HTMLElement, options: any) => {
            childCount = element.childElementCount;
            return createWidget(element, options);
        });

        new Vue({
            template: `<test-component>
                            <test-extension-component/>
                        </test-component>`,
            components: {
                TestComponent,
                TestExtensionComponent
            }
        }).$mount();
        expect(childCount).toBe(0);
    });

    it("destroys correctly", () => {
        const component = new TestExtensionComponent().$mount();

        expect(component.$destroy.bind(component)).not.toThrow();
    });
});

describe("disposing", () => {

    it("call dispose", () => {
        const component = new TestComponent().$mount();

        component.$destroy();

        expect(Widget.dispose).toBeCalled();
    });

    it("fires dxremove", () => {
        const handleDxRemove = jest.fn();
        const component = new TestComponent().$mount();

        events.on(component.$el, "dxremove", handleDxRemove);
        component.$destroy();

        expect(handleDxRemove).toHaveBeenCalledTimes(1);
    });

    it("destroys correctly", () => {
        const component = new TestComponent();

        expect(component.$destroy.bind(component)).not.toThrow();
    });
});
