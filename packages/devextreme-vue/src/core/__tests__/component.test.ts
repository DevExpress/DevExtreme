import { PatchFlags } from '@vue/shared';
import { mount } from '@vue/test-utils';
import * as events from 'devextreme/events';
import config from 'devextreme/core/config';
import {
  App, createVNode, defineComponent, h, nextTick, renderSlot, ref,
} from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import { pullConfigComponents } from '../children-processing';
import { IWidgetComponent } from '../component';
import globalConfig from '../config';
import Configuration from '../configuration';
import { IConfigurable, IConfigurationComponent } from '../configuration-component';
import { IExtension } from '../extension-component';

import { getNodeOptions } from '../vue-helper';
import {
  prepareComponentConfig,
  prepareExtensionComponentConfig,
  prepareConfigurationComponentConfig,
} from '../index';

interface CustomApp extends App {
  test: string;
}

function createComponent(config) {
  prepareComponentConfig(config);

  return defineComponent(config);
}

function createConfigurationComponent(config) {
  prepareConfigurationComponentConfig(config);

  return defineComponent(config);
}

function createExtensionComponent(config) {
  prepareExtensionComponentConfig(config);

  return defineComponent(config);
}

const eventHandlers = {};
const Widget = {
  option: jest.fn(),
  resetOption: jest.fn(),
  dispose: jest.fn(),
  on: (event, handler) => {
    eventHandlers[event] = handler;
  },
  fire: (event, args) => {
    if (!eventHandlers[event]) {
      throw new Error(`no handler registered for '${event}'`);
    }
    eventHandlers[event](args);
  },
  beginUpdate: jest.fn(),
  endUpdate: jest.fn(),
};

const CustomPlugin = {
  install: (app) => {
    app.test = 'test data';
  },
};

function createWidget(_, options) {
  if (options.onInitializing) {
    options.onInitializing.call(Widget);
  }
  return Widget;
}
const WidgetClass = jest.fn(createWidget);

const TestComponent = createComponent({
  beforeCreate() {
    this.$_WidgetClass = WidgetClass;
    this.$_hasAsyncTemplate = true;
  },
  props: {
    prop1: Number,
    prop2: Array,
    sampleProp: String,
    templateName: String,
  },
  model: {
    prop: 'prop1',
    event: 'update:prop1',
  },
});

function skipIntegrationOptions(options: {
  integrationOptions?: object;
  onInitializing?: () => void;
  ref?: string;
  id?: string;
}): Record<string, any> {
  const result = { ...options };
  delete result.integrationOptions;
  delete result.onInitializing;
  delete result.ref;
  delete result.id;
  return result;
}

function buildTestConfigCtor(): any {
  return createConfigurationComponent({
    props: {
      prop1: Number,
      prop2: String,
      sampleProp: String,
    },
  });
}

jest.setTimeout(1000);
beforeEach(() => {
  jest.clearAllMocks();
});

describe('component rendering', () => {
  it('correctly renders', () => {
    const wrapper = mount(TestComponent);
    expect(wrapper.html()).toBe('<div></div>');
  });

  it('calls widget creation', () => {
    mount(TestComponent);
    expect(WidgetClass).toHaveBeenCalledTimes(1);
    expect(Widget.beginUpdate).toHaveBeenCalledTimes(1);
    expect(Widget.endUpdate).toHaveBeenCalledTimes(1);
  });

  it('passes id to element', () => {
    const vm = defineComponent({
      template: '<test-component id=\'my-id\'/>',
      components: {
        TestComponent,
      },
    });
    const wrapper = mount(vm);
    expect(wrapper.element.id).toBe('my-id');
  });

  it('passes class to element', () => {
    const vm = defineComponent({
      template: '<test-component class=\'my-class my-class2\'/>',
      components: {
        TestComponent,
      },
    });
    const wrapper = mount(vm);
    expect(wrapper.element.className).toBe('my-class my-class2');
  });

  describe('correctly forwards classes', () => {
    it('forwards correct attrs in the render method', async () => {
      const component = defineComponent({
        template:
                  `
                    <test-component id="component" class="custom-class" :class="{'dx-chat-disabled': isDisabled}"></test-component>
                    <button @click="toggleDisabledState($event)">Click me</button>
                  `,
        components: { TestComponent },
        setup() {
          const isDisabled = ref(false);

          function toggleDisabledState() {
            isDisabled.value = !isDisabled.value;
          }

          return { isDisabled, toggleDisabledState };
        },
      });

      const wrapper = mount(component);

      const componentContainer = wrapper.find('#component');

      await wrapper.find('button').trigger('click');

      expect(componentContainer.element.className).toBe('custom-class dx-chat-disabled');

      const attrsPassedToVNodeInRenderMethod = wrapper.vm.$.subTree?.children?.[0]?.component?.subTree?.props?.class;

      const expectedClasses = 'custom-class dx-chat-disabled';

      expect(attrsPassedToVNodeInRenderMethod).toBe(expectedClasses);
      expect(componentContainer.element.className).toBe(expectedClasses);
    });

    it('forwards correct classes when a dynamic and static attrs were defined', async () => {
      const component = defineComponent({
        template:
                  `
                    <test-component id="component" class="custom-class" :class="{'dx-chat-disabled': isDisabled}"></test-component>
                    <button @click="toggleDisabledState($event)">Click me</button>
                  `,
        components: { TestComponent },
        setup() {
          const isDisabled = ref(false);

          function toggleDisabledState() {
            isDisabled.value = !isDisabled.value;
          }

          return { isDisabled, toggleDisabledState };
        },
      });

      const wrapper = mount(component);

      const componentContainer = wrapper.find('#component');

      componentContainer.element.classList.add('should-be-removed-class', 'dx-chat', 'dx-hover');

      await wrapper.find('button').trigger('click');

      expect(componentContainer.element.className).toBe('custom-class dx-chat dx-hover dx-chat-disabled');

      await wrapper.find('button').trigger('click');

      expect(componentContainer.element.className).toBe('custom-class dx-chat dx-hover');
    });

    it('forwards correct classes when only a dynamic attr was defined', async () => {
      const component = defineComponent({
        template:
                  `
                    <test-component id="component" :class="{'dx-chat-disabled': isDisabled}"></test-component>
                    <button @click="toggleDisabledState($event)">Click me</button>
                  `,
        components: { TestComponent },
        setup() {
          const isDisabled = ref(false);

          function toggleDisabledState() {
            isDisabled.value = !isDisabled.value;
          }

          return { isDisabled, toggleDisabledState };
        },
      });

      const wrapper = mount(component);

      const componentContainer = wrapper.find('#component');

      componentContainer.element.classList.add('should-be-removed-class', 'dx-chat', 'dx-hover');

      await wrapper.find('button').trigger('click');

      expect(componentContainer.element.className).toBe('dx-chat dx-hover dx-chat-disabled');

      await wrapper.find('button').trigger('click');

      expect(componentContainer.element.className).toBe('dx-chat dx-hover');
    });
  });

  it('passes styles to element', () => {
    const vm = defineComponent({
      template: '<test-component style=\'height: 10px; width: 20px;\'/>',
      components: {
        TestComponent,
      },
    });
    const wrapper = mount(vm);
    expect(wrapper.element.outerHTML).toBe('<div style="height: 10px; width: 20px;"></div>');
  });

  it('creates nested component', () => {
    mount(defineComponent({
      template: '<test-component><test-component/></test-component>',
      components: {
        TestComponent,
      },
    }));

    expect(WidgetClass.mock.instances.length).toBe(2);
    expect(WidgetClass.mock.instances[1]).toEqual({});
  });

  it('correctly sets the buy now link', () => {
    expect(config().buyNowLink).toBe('https://go.devexpress.com/Licensing_Installer_Watermark_DevExtremeVue.aspx');
  });

  it('correctly sets the help link', () => {
    expect(config().licensingDocLink).toBe('https://go.devexpress.com/Licensing_Documentation_DevExtremeVue.aspx');
  });

  describe('options', () => {
    it('watch prop changing to undefined', (done) => {
      const wrapper = mount(TestComponent, {
        props: {
          sampleProp: 'test',
        },
      });

      (wrapper.vm as any).$_config.updateValue = jest.fn();
      wrapper.setProps({ sampleProp: undefined });

      nextTick(() => {
        expect((wrapper.vm as any as IConfigurable).$_config.updateValue).toBeCalled();
        done();
      });
    });

    it('pass the same template name as in props', () => {
      const vm = defineComponent({
        template:
                    `<test-component id="component" templateName="myTemplate">
                        <template #myTemplate>
                            content
                        </template>
                    </test-component>`,
        components: {
          TestComponent,
        },
      });

      const wrapper = mount(vm);
      const component = wrapper.getComponent('#component');

      expect(WidgetClass.mock.calls[0][0]).toBe(component.vm.$el);

      expect(skipIntegrationOptions(WidgetClass.mock.calls[0][1])).toEqual({
        templateName: 'myTemplate',
        templatesRenderAsynchronously: true,
      });
    });

    it('pass template name as default', () => {
      const vm = defineComponent({
        template:
                    `<test-component id="component">
                        <template #templateName>
                            content
                        </template>
                    </test-component>`,
        components: {
          TestComponent,
        },
      });

      const wrapper = mount(vm);
      const component = wrapper.getComponent('#component');

      expect(WidgetClass.mock.calls[0][0]).toBe(component.vm.$el);

      expect(skipIntegrationOptions(WidgetClass.mock.calls[0][1])).toEqual({
        templateName: 'templateName',
        templatesRenderAsynchronously: true,
      });
    });

    it('pass props to option on mounting', () => {
      const wrapper = mount(TestComponent, {
        props: {
          sampleProp: 'default',
        },
      });

      expect(WidgetClass.mock.calls[0][0]).toBe(wrapper.element);

      expect(skipIntegrationOptions(WidgetClass.mock.calls[0][1])).toEqual({
        sampleProp: 'default',
        templatesRenderAsynchronously: true,
      });
    });

    it('subscribes to optionChanged', () => {
      mount(TestComponent, {
        props: {
          sampleProp: 'default',
        },
      });

      expect(eventHandlers).toHaveProperty('optionChanged');
    });

    it('watch prop changing', async () => {
      const wrapper = mount(TestComponent, {
        props: {
          sampleProp: 'default',
        },
      });
      await wrapper.setProps({ sampleProp: 'new' });

      expect(Widget.option).toHaveBeenCalledTimes(1);
      expect(Widget.option).toHaveBeenCalledWith('sampleProp', 'new');
    });

    it('component shouldn\'t update array value(by default)', async () => {
      expect.assertions(1);
      const component = defineComponent({
        template: `
                    <button @click="testData.push(2)">Click me</button>
                    <test-component :prop2="testData"></test-component>
                `,
        components: {
          TestComponent,
        },
        data() {
          return {
            testData: [1],
          };
        },
      });
      const wrapper = mount(component);

      await wrapper.find('button').trigger('click');

      await nextTick(() => {
        expect(Widget.option).toHaveBeenCalledTimes(0);
      });
    });

    it('component updates array value if the deepWatch flag equal true', async () => {
      expect.assertions(2);
      globalConfig({ deepWatch: true });
      const component = defineComponent({
        template: `
                    <button @click="testData.push(2)">Click me</button>
                    <test-component :prop2="testData"></test-component>
                `,
        components: {
          TestComponent,
        },
        data() {
          return {
            testData: [1],
          };
        },
      });
      const wrapper = mount(component);

      await wrapper.find('button').trigger('click');

      await nextTick(() => {
        expect(Widget.option).toHaveBeenCalledTimes(1);
        expect(Widget.option).toHaveBeenCalledWith('prop2', [1, 2]);
        globalConfig({ deepWatch: false });
      });
    });
  });

  describe('configuration', () => {
    const Nested = buildTestConfigCtor();
    (Nested as IConfigurationComponent).$_optionName = 'nestedOption';

    it('creates configuration', () => {
      const wrapper = mount(TestComponent);

      expect((wrapper.vm as any as IConfigurable).$_config).not.toBeNull();
    });

    it('updates pendingOptions from a widget component configuration updateFunc', () => {
      const wrapper = mount(TestComponent);

      const pendingOptions = (wrapper.vm as unknown as IWidgetComponent).$_pendingOptions;

      const name = 'abc';
      const value = {};

      (wrapper.vm as any as IConfigurable).$_config.updateFunc(name, value);
      expect(pendingOptions[name]).toEqual(value);
    });

    it('initializes nested config', () => {
      const vm = defineComponent({
        template:
                    '<test-component id="component">'
                    + '  <nested :prop1="123" />'
                    + '</test-component>',
        components: {
          TestComponent,
          Nested,
        },
      });

      const wrapper = mount(vm);

      const config = (wrapper.getComponent('#component').vm as any as IConfigurable).$_config;
      expect(config.nested).toHaveLength(1);
      expect(config.nested[0].name).toBe('nestedOption');
      expect(config.nested[0].options).toEqual(['prop1', 'prop2', 'sampleProp']);
      expect(config.nested[0].initialValues).toEqual({ prop1: 123 });
      expect(config.nested[0].isCollectionItem).toBeFalsy();
    });

    it('initializes nested config (collectionItem)', () => {
      const NestedCollectionItem = buildTestConfigCtor();
      (NestedCollectionItem as IConfigurationComponent).$_optionName = 'nestedOption';
      (NestedCollectionItem as IConfigurationComponent).$_isCollectionItem = true;

      const vm = defineComponent({
        template:
                    '<test-component id="component">'
                    + '  <nested-collection-item :prop1="123" />'
                    + '</test-component>',
        components: {
          TestComponent,
          NestedCollectionItem,
        },
      });

      const wrapper = mount(vm);

      const config = (wrapper.getComponent('#component').vm as any as IConfigurable).$_config;
      expect(config.nested).toHaveLength(1);
      expect(config.nested[0].name).toBe('nestedOption');
      expect(config.nested[0].options).toEqual(['prop1', 'prop2', 'sampleProp']);
      expect(config.nested[0].initialValues).toEqual({ prop1: 123 });
      expect(config.nested[0].isCollectionItem).toBeTruthy();
      expect(config.nested[0].collectionItemIndex).toBe(0);
    });

    it('initializes nested config (several collectionItems)', () => {
      const NestedCollectionItem = buildTestConfigCtor();
      (NestedCollectionItem as IConfigurationComponent).$_optionName = 'nestedOption';
      (NestedCollectionItem as IConfigurationComponent).$_isCollectionItem = true;

      const vm = defineComponent({
        template:
                    '<test-component id="component">'
                    + '  <nested-collection-item :prop1="123" />'
                    + '  <nested-collection-item :prop1="456" prop2="abc" sample-prop="test" />'
                    + '  <nested-collection-item prop2="def" />'
                    + '</test-component>',
        components: {
          TestComponent,
          NestedCollectionItem,
        },
      });

      const wrapper = mount(vm);

      const config = (wrapper.getComponent('#component').vm as any as IConfigurable).$_config;
      expect(config.nested).toHaveLength(3);

      expect(config.nested[0].name).toBe('nestedOption');
      expect(config.nested[0].options).toEqual(['prop1', 'prop2', 'sampleProp']);
      expect(config.nested[0].initialValues).toEqual({ prop1: 123 });
      expect(config.nested[0].isCollectionItem).toBeTruthy();
      expect(config.nested[0].collectionItemIndex).toBe(0);

      expect(config.nested[1].name).toBe('nestedOption');
      expect(config.nested[1].options).toEqual(['prop1', 'prop2', 'sampleProp']);
      expect(config.nested[1].initialValues).toEqual({ prop1: 456, prop2: 'abc', sampleProp: 'test' });
      expect(config.nested[1].isCollectionItem).toBeTruthy();
      expect(config.nested[1].collectionItemIndex).toBe(1);

      expect(config.nested[2].name).toBe('nestedOption');
      expect(config.nested[2].options).toEqual(['prop1', 'prop2', 'sampleProp']);
      expect(config.nested[2].initialValues).toEqual({ prop2: 'def' });
      expect(config.nested[2].isCollectionItem).toBeTruthy();
      expect(config.nested[2].collectionItemIndex).toBe(2);
    });

    it('initializes nested config (using v-for)', () => {
      const NestedCollectionItem = buildTestConfigCtor();
      (NestedCollectionItem as IConfigurationComponent).$_optionName = 'nestedOption';
      (NestedCollectionItem as IConfigurationComponent).$_isCollectionItem = true;

      const vm = defineComponent({
        template:
                    '<test-component id="component">'
                    + '  <nested-collection-item v-for="(item, index) in items" :key="index" :prop1="item.value" />'
                    + '</test-component>',
        data() {
          return {
            items: [{ value: 123 }, { value: 321 }, { value: 432 }],
          };
        },
        components: {
          TestComponent,
          NestedCollectionItem,
        },
      });

      const wrapper = mount(vm);

      const config = (wrapper.getComponent('#component').vm as any as IConfigurable).$_config;
      expect(config.nested).toHaveLength(3);

      expect(config.nested[0].name).toBe('nestedOption');
      expect(config.nested[0].options).toEqual(['prop1', 'prop2', 'sampleProp']);
      expect(config.nested[0].initialValues).toEqual({ key: 0, prop1: 123 });
      expect(config.nested[0].isCollectionItem).toBeTruthy();
      expect(config.nested[0].collectionItemIndex).toBe(0);

      expect(config.nested[1].name).toBe('nestedOption');
      expect(config.nested[1].options).toEqual(['prop1', 'prop2', 'sampleProp']);
      expect(config.nested[1].initialValues).toEqual({ key: 1, prop1: 321 });
      expect(config.nested[1].isCollectionItem).toBeTruthy();
      expect(config.nested[1].collectionItemIndex).toBe(1);

      expect(config.nested[2].name).toBe('nestedOption');
      expect(config.nested[2].options).toEqual(['prop1', 'prop2', 'sampleProp']);
      expect(config.nested[2].initialValues).toEqual({ key: 2, prop1: 432 });
      expect(config.nested[2].isCollectionItem).toBeTruthy();
      expect(config.nested[2].collectionItemIndex).toBe(2);
    });

    it('shouldn\'t add fragment as children (v-for)', () => {
      const NestedCollectionItem = buildTestConfigCtor();
      (NestedCollectionItem as IConfigurationComponent).$_optionName = 'nestedOption';
      (NestedCollectionItem as IConfigurationComponent).$_isCollectionItem = true;

      const vm = defineComponent({
        template:
                    '<test-component id="component">'
                    + '  <nested-collection-item v-for="(item, index) in items" :key="index" :prop1="item.value" />'
                    + '</test-component>',
        data() {
          return {
            items: [{ value: 123 }, { value: 321 }, { value: 432 }],
          };
        },
        components: {
          TestComponent,
          NestedCollectionItem,
        },
      });

      const wrapper = mount(vm);

      const component = wrapper.getComponent('#component').vm;
      expect(component.$.subTree.children).toHaveLength(3);
    });

    it('should find nested options if they wrapped to some kind of fragment elements', () => {
      const NestedCollectionItem: IConfigurationComponent = buildTestConfigCtor();
      NestedCollectionItem.$_optionName = 'nestedOption';
      NestedCollectionItem.$_isCollectionItem = true;

      const vm = defineComponent({
        template:
                    `<test-component id="component">
                        <template v-if="hasNested">
                            <template v-for="(item, index) in items">
                                <nested-collection-item :prop1="item.value" />
                            </template>
                        </template>
                    </test-component>`,
        data() {
          return {
            hasNested: true,
            items: [{ value: 123 }, { value: 321 }, { value: 432 }],
          };
        },
        components: {
          TestComponent,
          NestedCollectionItem,
        },
      });

      const wrapper = mount(vm);

      const component = wrapper.getComponent('#component').vm;
      expect(component.$.subTree.children).toHaveLength(3);
    });

    it('initializes nested config predefined prop', () => {
      const predefinedValue = {};
      const NestedWithPredefined = buildTestConfigCtor();
      (NestedWithPredefined as IConfigurationComponent).$_optionName = 'nestedOption';
      (NestedWithPredefined as IConfigurationComponent).$_predefinedProps = {
        predefinedProp: predefinedValue,
      };

      const vm = defineComponent({
        template:
                    '<test-component id="component">'
                    + '  <nested-with-predefined />'
                    + '</test-component>',
        components: {
          TestComponent,
          NestedWithPredefined,
        },
      });

      const wrapper = mount(vm);

      const config = (wrapper.getComponent('#component').vm as any as IConfigurable).$_config;
      const initialValues = config.getNestedOptionValues();
      expect(initialValues).toHaveProperty('nestedOption');
      expect(initialValues!.nestedOption).toHaveProperty('predefinedProp');
      expect(initialValues!.nestedOption!.predefinedProp).toBe(predefinedValue);
    });

    it('initializes sub-nested config', () => {
      const SubNested = buildTestConfigCtor();
      (SubNested as IConfigurationComponent).$_optionName = 'subNestedOption';

      const vm = defineComponent({
        template:
                    '<test-component id="component">'
                    + '  <nested :prop1="123">'
                    + '    <sub-nested prop2="abc"/>'
                    + '  </nested>'
                    + '</test-component>',
        components: {
          TestComponent,
          Nested,
          SubNested,
        },
      });

      const wrapper = mount(vm);

      const config = (wrapper.getComponent('#component').vm as any as IConfigurable).$_config;
      expect(config.nested).toHaveLength(1);

      const nestedConfig = config.nested[0];
      expect(nestedConfig.nested).toHaveLength(1);

      expect(nestedConfig.nested[0].name).toBe('subNestedOption');
      expect(nestedConfig.nested[0].options).toEqual(['prop1', 'prop2', 'sampleProp']);
      expect(nestedConfig.nested[0].initialValues).toEqual({ prop2: 'abc' });
      expect(nestedConfig.nested[0].isCollectionItem).toBeFalsy();
    });

    it('initializes sub-nested config (collectionItem)', () => {
      const SubNested = buildTestConfigCtor();
      (SubNested as IConfigurationComponent).$_optionName = 'subNestedOption';
      (SubNested as IConfigurationComponent).$_isCollectionItem = true;

      const vm = defineComponent({
        template:
                    '<test-component id="component">'
                    + '  <nested :prop1="123">'
                    + '    <sub-nested prop2="abc"/>'
                    + '  </nested>'
                    + '</test-component>',
        components: {
          TestComponent,
          Nested,
          SubNested,
        },
      });

      const wrapper = mount(vm);

      const config = (wrapper.getComponent('#component').vm as any as IConfigurable).$_config;
      expect(config.nested).toHaveLength(1);

      const nestedConfig = config.nested[0];
      expect(nestedConfig.nested).toHaveLength(1);

      expect(nestedConfig.nested[0].name).toBe('subNestedOption');
      expect(nestedConfig.nested[0].options).toEqual(['prop1', 'prop2', 'sampleProp']);
      expect(nestedConfig.nested[0].initialValues).toEqual({ prop2: 'abc' });
      expect(nestedConfig.nested[0].isCollectionItem).toBeTruthy();
      expect(nestedConfig.nested[0].collectionItemIndex).toBe(0);
    });

    it('initializes sub-nested config (multiple collectionItems)', () => {
      const NestedCollectionItem = buildTestConfigCtor();
      (NestedCollectionItem as IConfigurationComponent).$_optionName = 'subNestedOption';
      (NestedCollectionItem as IConfigurationComponent).$_isCollectionItem = true;

      const vm = defineComponent({
        template:
                    '<test-component id="component">'
                    + '  <nested>'
                    + '    <nested-collection-item :prop1="123" />'
                    + '    <nested-collection-item :prop1="456" prop2="abc" />'
                    + '    <nested-collection-item prop2="def" />'
                    + '  </nested>'
                    + '</test-component>',
        components: {
          TestComponent,
          Nested,
          NestedCollectionItem,
        },
      });

      const wrapper = mount(vm);

      const config = (wrapper.getComponent('#component').vm as any as IConfigurable).$_config;
      expect(config.nested).toHaveLength(1);

      const nestedConfig = config.nested[0];
      expect(nestedConfig.nested).toHaveLength(3);

      expect(nestedConfig.nested[0].name).toBe('subNestedOption');
      expect(nestedConfig.nested[0].options).toEqual(['prop1', 'prop2', 'sampleProp']);
      expect(nestedConfig.nested[0].initialValues).toEqual({ prop1: 123 });
      expect(nestedConfig.nested[0].isCollectionItem).toBeTruthy();
      expect(nestedConfig.nested[0].collectionItemIndex).toBe(0);

      expect(nestedConfig.nested[1].name).toBe('subNestedOption');
      expect(nestedConfig.nested[1].options).toEqual(['prop1', 'prop2', 'sampleProp']);
      expect(nestedConfig.nested[1].initialValues).toEqual({ prop1: 456, prop2: 'abc' });
      expect(nestedConfig.nested[1].isCollectionItem).toBeTruthy();
      expect(nestedConfig.nested[1].collectionItemIndex).toBe(1);

      expect(nestedConfig.nested[2].name).toBe('subNestedOption');
      expect(nestedConfig.nested[2].options).toEqual(['prop1', 'prop2', 'sampleProp']);
      expect(nestedConfig.nested[2].initialValues).toEqual({ prop2: 'def' });
      expect(nestedConfig.nested[2].isCollectionItem).toBeTruthy();
      expect(nestedConfig.nested[2].collectionItemIndex).toBe(2);
    });

    describe('expectedChildren', () => {
      it('initialized for widget component', () => {
        const expected = {};

        const WidgetComponent = createComponent({
          beforeCreate() {
            (this as unknown as IWidgetComponent).$_WidgetClass = WidgetClass;
            (this as unknown as IWidgetComponent).$_expectedChildren = expected;
          },
        });

        const wrapper = mount(WidgetComponent);

        expect((wrapper.vm as unknown as IWidgetComponent).$_config.expectedChildren).toBe(expected);
      });

      it('initialized for config component', () => {
        const expected = {};
        const ConfigComponent = buildTestConfigCtor();
        (ConfigComponent as IConfigurationComponent).$_optionName = 'nestedOption';
        (ConfigComponent as IConfigurationComponent).$_expectedChildren = expected;

        const vm = defineComponent({
          template:
                        '<test-component id="component">'
                        + '  <config-component />'
                        + '</test-component>',
          components: {
            TestComponent,
            ConfigComponent,
          },
        });

        const wrapper = mount(vm);

        const widgetConfig = (wrapper.getComponent('#component').vm as any as IConfigurable).$_config;
        expect(widgetConfig.nested[0].expectedChildren).toBe(expected);
      });
    });
  });

  describe('nested option', () => {
    const Nested = buildTestConfigCtor();
    (Nested as IConfigurationComponent).$_optionName = 'nestedOption';

    it('pulls initital values', () => {
      const vm = defineComponent({
        template:
                    '<test-component id="component">'
                    + '  <nested :prop1="123" />'
                    + '</test-component>',
        components: {
          TestComponent,
          Nested,
        },
      });

      const wrapper = mount(vm);
      const component = wrapper.getComponent('#component');

      expect(WidgetClass.mock.calls[0][0]).toBe(component.vm.$el);

      expect(skipIntegrationOptions(WidgetClass.mock.calls[0][1])).toEqual({
        nestedOption: {
          prop1: 123,
        },
        templatesRenderAsynchronously: true,
      });
    });

    it('watches option changes', (done) => {
      const vm = defineComponent({
        template:
                    '<test-component>'
                    + '  <nested :prop1="value" />'
                    + '</test-component>',
        components: {
          TestComponent,
          Nested,
        },
        props: ['value'],
      });

      const wrapper = mount(vm, {
        props: {
          value: 123,
        },
      });

      wrapper.setProps({ value: 456 });

      nextTick(() => {
        expect(Widget.option).toHaveBeenCalledTimes(1);
        expect(Widget.option).toHaveBeenCalledWith('nestedOption.prop1', 456);
        done();
      });
    });

    it('add nested component by condition', (done) => {
      const vm = defineComponent({
        template:
                    '<test-component>'
                    + '  <nested v-if="showNest" :prop1="123" />'
                    + '</test-component>',
        components: {
          TestComponent,
          Nested,
        },
        props: {
          showNest: {
            type: Boolean,
            value: false,
          },
        },
      });

      const wrapper = mount(vm);

      wrapper.setProps({ showNest: true });

      nextTick(() => {
        expect(Widget.option).toHaveBeenCalledWith('nestedOption', { key: 0, prop1: 123 });
        done();
      });
    });

    it('remove nested component by condition', (done) => {
      const NestedCollectionItem = buildTestConfigCtor();
      (NestedCollectionItem as IConfigurationComponent).$_optionName = 'nestedOption';
      (NestedCollectionItem as IConfigurationComponent).$_isCollectionItem = true;
      const vm = defineComponent({
        template:
                    '<test-component>'
                    + '  <nested-collection-item v-if="show" :prop1="123" />'
                    + '  <nested-collection-item :prop1="321" />'
                    + '</test-component>',
        components: {
          TestComponent,
          NestedCollectionItem,
        },
        props: {
          show: {
            type: Boolean,
            default: true,
          },
        },
      });

      const wrapper = mount(vm);

      wrapper.setProps({ show: false });

      nextTick(() => {
        expect(Widget.option).toHaveBeenCalledWith('nestedOption', [{ prop1: 321 }]);
        done();
      });
    });

    it('should update only part of collection components', (done) => {
      const NestedCollectionItem = buildTestConfigCtor();
      (NestedCollectionItem as IConfigurationComponent).$_optionName = 'nestedOption';
      (NestedCollectionItem as IConfigurationComponent).$_isCollectionItem = true;
      const vm = defineComponent({
        template:
                    '<test-component>'
                    + '  <nested-collection-item>'
                    + '     <nested-collection-item>'
                    + '       <nested-collection-item v-if="show" :prop1="123">'
                    + '       </nested-collection-item>'
                    + '       <nested-collection-item :prop1="321">'
                    + '       </nested-collection-item>'
                    + '     </nested-collection-item>'
                    + '  </nested-collection-item>'
                    + '</test-component>',
        components: {
          TestComponent,
          NestedCollectionItem,
        },
        props: {
          show: {
            type: Boolean,
            default: true,
          },
        },
      });

      const wrapper = mount(vm);

      wrapper.setProps({ show: false });

      nextTick(() => {
        expect(Widget.option)
          .toHaveBeenCalledWith('nestedOption[0].nestedOption[0].nestedOption', [{ prop1: 321 }]);
        done();
      });
    });

    it('should update only part of collection components (remove all subnested)', (done) => {
      const NestedCollectionItem = buildTestConfigCtor();
      (NestedCollectionItem as IConfigurationComponent).$_optionName = 'nestedOption';
      (NestedCollectionItem as IConfigurationComponent).$_isCollectionItem = true;
      const vm = defineComponent({
        template:
                    '<test-component>'
                    + '  <nested-collection-item>'
                    + '     <nested-collection-item>'
                    + '       <nested-collection-item v-if="show" :prop1="123">'
                    + '       </nested-collection-item>'
                    + '       <nested-collection-item v-if="show" :prop1="321">'
                    + '       </nested-collection-item>'
                    + '     </nested-collection-item>'
                    + '  </nested-collection-item>'
                    + '</test-component>',
        components: {
          TestComponent,
          NestedCollectionItem,
        },
        props: {
          show: {
            type: Boolean,
            default: true,
          },
        },
      });

      const wrapper = mount(vm);

      wrapper.setProps({ show: false });

      nextTick(() => {
        expect(Widget.option).toHaveBeenCalledWith('nestedOption[0].nestedOption[0].nestedOption', undefined);
        done();
      });
    });

    it('reset nested component', (done) => {
      const vm = defineComponent({
        template:
                    '<test-component>'
                    + '  <nested v-if="show" :prop1="123" />'
                    + '</test-component>',
        components: {
          TestComponent,
          Nested,
        },
        props: {
          show: {
            type: Boolean,
            default: true,
          },
        },
      });

      const wrapper = mount(vm);

      wrapper.setProps({ show: false });

      nextTick(() => {
        expect(Widget.resetOption).toHaveBeenCalledWith('nestedOption');
        done();
      });
    });
  });

  function renderTemplate(name: string, model?: object, container?: any, index?: number): Element {
    model = model || {};
    container = container || document.createElement('div');
    const { render } = WidgetClass.mock.calls[0][1].integrationOptions.templates[name];
    return render({
      container,
      model,
      index,
    });
  }

  describe('template', () => {
    const DX_TEMPLATE_WRAPPER = 'dx-template-wrapper';
    const componentWithTemplate = defineComponent({
      template: `<test-component :prop1='prop1Value'>
                         <template #test v-if='renderTemplate'>content</template>
                       </test-component>`,
      components: {
        TestComponent,
      },
      props: {
        renderTemplate: {
          type: Boolean,
          value: false,
        },
        prop1Value: {
          type: Number,
          value: 1,
        },
      },
    });

    function renderItemTemplate(model?: object, container?: any, index?: number): Element {
      return renderTemplate('item', model, container, index);
    }

    it('passes integrationOptions to widget', () => {
      const vm = defineComponent({
        template: `<test-component>
                             <template #item>
                               <div>1</div>
                             </template>
                             <template #content>
                               <div>1</div>
                             </template>
                             <div>1</div>
                           </test-component>`,
        components: {
          TestComponent,
        },
      });

      mount(vm);
      const { integrationOptions } = WidgetClass.mock.calls[0][1];

      expect(integrationOptions).toBeDefined();
      expect(integrationOptions.templates).toBeDefined();

      expect(integrationOptions.templates.item).toBeDefined();
      expect(typeof integrationOptions.templates.item.render).toBe('function');

      expect(integrationOptions.templates.content).toBeDefined();
      expect(typeof integrationOptions.templates.content.render).toBe('function');

      expect(integrationOptions.templates.default).toBeUndefined();
    });

    it('pass correct template name', () => {
      const vm = defineComponent({
        template: `<test-component templateName="myTemplate">
                             <template #item>
                               <div>1</div>
                             </template>
                             <template #content>
                               <div>1</div>
                             </template>
                             <div>1</div>
                           </test-component>`,
        components: {
          TestComponent,
        },
      });

      mount(vm);
      const { integrationOptions } = WidgetClass.mock.calls[0][1];

      expect(integrationOptions).toBeDefined();
      expect(integrationOptions.templates).toBeDefined();

      expect(integrationOptions.templates.item).toBeDefined();
      expect(typeof integrationOptions.templates.item.render).toBe('function');

      expect(integrationOptions.templates.content).toBeDefined();
      expect(typeof integrationOptions.templates.content.render).toBe('function');

      expect(integrationOptions.templates.default).toBeUndefined();
    });

    it('passes \'integrationOptions.templates\' on update', () => {
      const wrapper = mount(componentWithTemplate);

      wrapper.setProps({
        renderTemplate: true,
      });

      nextTick(() => {
        expect(Widget.option.mock.calls[0][0]).toEqual('integrationOptions.templates');
        expect(Widget.option.mock.calls[0][1].test.render).toBeInstanceOf(Function);
      });
    });

    it('passes \'integrationOptions.templates\' on update before other options', () => {
      const wrapper = mount(componentWithTemplate);

      wrapper.setProps({
        renderTemplate: true,
        prop1Value: 2,
      });

      nextTick(() => {
        expect(Widget.option.mock.calls[0][0]).toEqual('integrationOptions.templates');
        expect(Widget.option.mock.calls[1]).toEqual(['test', 'test']);
        expect(Widget.option.mock.calls[2]).toEqual(['prop1', 2]);
      });
    });

    describe('with DOM', () => {
      let fixture;

      beforeEach(() => {
        fixture = document.createElement('div');
        fixture.id = 'fixture';
        document.body.appendChild(fixture);
      });

      afterEach(() => {
        fixture.remove();
      });

      it('template content should be rendered in DOM', () => {
        let mountedInDom;
        const ChildComponent = defineComponent({
          template: '<div>Test</div>',
          mounted() {
            mountedInDom = document.body.contains(this.$el);
          },
        });
        const instance = defineComponent({
          template: `<test-component id="component">
                                    <div class="template-container"></div>
                                    <template #tmpl>
                                        <child-component/>
                                    </template>
                                </test-component>`,
          components: {
            TestComponent,
            ChildComponent,
          },
        });

        const wrapper = mount(instance, { attachTo: document.getElementById('fixture') } as any);

        renderTemplate(
          'tmpl',
          {},
          wrapper.getComponent('#component').vm.$el.querySelector('.template-container'),
        );

        expect(mountedInDom).toBeTruthy();
      });
    });

    it('does not unnecessarily pass \'integrationOptions.templates\'', () => {
      const wrapper = mount(componentWithTemplate, {
        props: {
          renderTemplate: true,
          prop1Value: 1,
        },
      });

      wrapper.setProps({
        prop1Value: 2,
      });

      wrapper.setProps({
        prop1Value: 3,
      });

      expect(
        Widget.option.mock.calls.find((call) => call[0] === 'integrationOptions.templates'),
      ).toBeUndefined();
    });

    it('renders', () => {
      const vm = defineComponent({
        template: `<test-component>
                                <template #item>
                                    <div>Template</div>
                                </template>
                            </test-component>`,
        components: {
          TestComponent,
        },
      });
      mount(vm);
      const renderedTemplate = renderItemTemplate();

      expect(renderedTemplate.nodeName).toBe('DIV');
      expect(renderedTemplate.className).toBe(DX_TEMPLATE_WRAPPER);
      expect(renderedTemplate.innerHTML).toBe('Template');
    });

    it('renders template with several children', () => {
      const vm = defineComponent({
        template: `<test-component>
                                <template #item>
                                    <div>child1</div>
                                    <div>child2</div>
                                </template>
                            </test-component>`,
        components: {
          TestComponent,
        },
      });
      mount(vm);
      const container = document.createElement('div');
      renderItemTemplate({}, container);

      expect(container.innerHTML).toBe(
        '<span style="display: none;"></span><div>child1</div><div>child2</div>',
      );
    });

    it('unmounts template with root element node', () => {
      const vm = defineComponent({
        template: `<test-component>
                        <template #item>
                            <div>child1</div>
                        </template>
                    </test-component>`,
        components: {
          TestComponent,
        },
      });

      mount(vm);

      const container = document.createElement('div');
      renderItemTemplate({}, container);
      events.triggerHandler(container.children[0], 'dxremove');

      expect(container.children.length).toEqual(0);
    });

    it('unmounts template with text content', () => {
      const vm = defineComponent({
        template: `<test-component>
                        <template #item>
                            Template_text_content
                        </template>
                    </test-component>`,
        components: {
          TestComponent,
        },
      });

      mount(vm);

      const container = document.createElement('div');
      renderItemTemplate({}, container);
      events.triggerHandler(container.children[0], 'dxremove');

      expect(container.children.length).toEqual(0);
    });

    it('template should have globalProperties of parent', () => {
      let templateGlobalProperties;
      const CustomComponent = defineComponent({
        template: '<div></div>',
        mounted() {
          templateGlobalProperties = this.$.appContext.config.globalProperties;
        },
      });
      const vm = defineComponent({
        template: `<test-component id="component">
                                <template #item>
                                    <CustomComponent></CustomComponent>
                                </template>
                            </test-component>`,
        components: {
          TestComponent,
          CustomComponent,
        },
      });
      const config = {
        globalProperties: { name: 'test' },
      };
      // @ts-expect-error
      mount(vm, { global: { config } });
      renderItemTemplate();
      expect(templateGlobalProperties).toEqual(config.globalProperties);
    });

    it('template should have custom plugins data', () => {
      let testData;
      const CustomComponent = defineComponent({
        template: '<div></div>',
        mounted() {
          testData = (this.$.appContext.app as CustomApp).test;
        },
      });
      const vm = defineComponent({
        template: `<test-component id="component">
                                <template #item>
                                    <CustomComponent></CustomComponent>
                                </template>
                            </test-component>`,
        components: {
          TestComponent,
          CustomComponent,
        },
      });

      mount(vm, {
        global: {
          plugins: [CustomPlugin],
        },
      });
      renderItemTemplate();
      expect(testData).toEqual('test data');
    });

    it('template should have router provides of parent', () => {
      const router = createRouter({
        history: createWebHistory(),
        routes: [],
      });
      let templateProvides;
      const CustomComponent = defineComponent({
        template: '<div></div>',
        mounted() {
          templateProvides = this.$.appContext.provides;
        },
      });
      const vm = defineComponent({
        template: `<test-component id="component">
                                <template #item>
                                    <CustomComponent></CustomComponent>
                                </template>
                            </test-component>`,
        components: {
          TestComponent,
          CustomComponent,
        },
      });
      mount(vm, {
        global: {
          plugins: [router],
        },
      });
      renderItemTemplate();
      expect(Object.getOwnPropertySymbols(templateProvides)).toHaveLength(3);
    });

    it('renders scoped slot', () => {
      const vm = defineComponent({
        template: `<test-component>
                                <template #item="{ data: { text }, index }">
                                    Template {{text}} and index {{index}}
                                </template>
                            </test-component>`,
        components: {
          TestComponent,
        },
      });
      mount(vm);
      const renderedTemplate = renderItemTemplate({ text: 'with data' }, undefined, 5);
      expect(renderedTemplate.textContent).toContain('Template with data and index 5');
    });

    it('unwraps container', () => {
      const vm = defineComponent({
        template: `<test-component>
                                <template #item="{ data }">
                                    <div>Template {{data.text}}</div>
                                </template>
                            </test-component>`,
        components: {
          TestComponent,
        },
      });
      mount(vm);
      const renderedTemplate = renderItemTemplate(
        { text: 'with data' },
        { get: () => document.createElement('div') },
      );

      expect(renderedTemplate.nodeName).toBe('DIV');
      expect(renderedTemplate.innerHTML).toBe('Template with data');
    });

    it('preserves classes', () => {
      const vm = defineComponent({
        template: `<test-component>
                                <template #item="{ data }">
                                    <div class='should-be-removed-class'></div>
                                </template>
                            </test-component>`,
        components: {
          TestComponent,
        },
      });

      mount(vm);
      const renderedTemplate = renderItemTemplate({});

      expect(renderedTemplate.className).toBe(`should-be-removed-class ${DX_TEMPLATE_WRAPPER}`);
    });

    it('preserves custom-attrs', () => {
      const vm = defineComponent({
        template: `<test-component>
                                <template #item="{ data: { text } }">
                                    <div custom-attr=123>Template {{text}}</div>
                                </template>
                            </test-component>`,
        components: {
          TestComponent,
        },
      });
      mount(vm);
      const renderedTemplate = renderItemTemplate({});

      expect(renderedTemplate.attributes).toHaveProperty('custom-attr');
      expect(renderedTemplate.attributes['custom-attr'].value).toBe('123');
    });

    it('doesn\'t throw on dxremove', () => {
      const vm = defineComponent({
        template: `<test-component>
                                <template #item="{ data: { text } }">
                                    Template {{text}}
                                </template>
                            </test-component>`,
        components: {
          TestComponent,
        },
      });

      mount(vm);

      const renderedTemplate = renderItemTemplate({ text: 'with data' });

      expect(() => events.triggerHandler(renderedTemplate, 'dxremove')).not.toThrow();
    });

    it('destroyed component should remove subscriptions', (done) => {
      const vm = defineComponent({
        template: `<test-component id="component" :prop1="value">
                                <template #item="{data}">Template {{data.text}}</template>
                            </test-component>`,
        components: {
          TestComponent,
        },
        props: ['value'],
      });

      const wrapper = mount(vm, {
        props: {
          value: 123,
        },
      });

      const container = document.createElement('div');
      renderItemTemplate({ text: 'with data' }, container);
      events.triggerHandler(container.children[0], 'dxremove');
      renderItemTemplate({ text: 'with data' }, container);

      const subscriptions = (wrapper.getComponent('#component').vm as any).eventBus._list;
      expect(subscriptions.length).toBe(1);

      done();
    });

    describe('static items', () => {
      it('passes integrationOptions to widget', () => {
        const NestedItem = createConfigurationComponent({
          props: {
            prop1: Number,
            template: String,
          },
        });
        (NestedItem as unknown as IConfigurationComponent).$_optionName = 'items';
        (NestedItem as unknown as IConfigurationComponent).$_isCollectionItem = true;

        const vm = defineComponent({
          template: `<test-component>
                                <nested-item>
                                    <template #default>
                                        <div>1</div>
                                    </template>
                                </nested-item>
                            </test-component>`,
          components: {
            TestComponent,
            NestedItem,
          },
        });

        mount(vm);

        const { integrationOptions } = WidgetClass.mock.calls[0][1];

        expect(integrationOptions).toBeDefined();
        expect(integrationOptions.templates).toBeDefined();

        expect(integrationOptions.templates['items[0].template']).toBeDefined();
        expect(typeof integrationOptions.templates['items[0].template'].render).toBe('function');
      });

      it('passes configuration component updates before templates', () => {
        const NestedItem = createConfigurationComponent({
          props: {
            template: String,
          },
        });
        (NestedItem as unknown as IConfigurationComponent).$_optionName = 'items';
        (NestedItem as unknown as IConfigurationComponent).$_isCollectionItem = true;

        const component = defineComponent({
          template: `<test-component :prop1='prop1Value'>
                                <nested-item v-if="renderTemplate">
                                    <template #default>
                                        <div>1</div>
                                    </template>
                                </nested-item>
                            </test-component>`,
          components: {
            TestComponent,
            NestedItem,
          },
          props: {
            renderTemplate: {
              type: Boolean,
              value: false,
            },
            prop1Value: {
              type: Number,
              value: 1,
            },
          },
        });

        const wrapper = mount(component);

        wrapper.setProps({
          renderTemplate: true,
          prop1Value: 2,
        });

        nextTick(() => {
          expect(Widget.option.mock.calls[0][0]).toEqual('items');
          expect(Widget.option.mock.calls[1][0]).toEqual('integrationOptions.templates');
          expect(Widget.option.mock.calls[2][0]).toEqual('items[0].template');
          expect(Widget.option.mock.calls[3][0]).toEqual('prop1');
        });
      });

      it('passes node of nested component as template', () => {
        const NestedItem = createConfigurationComponent({
          props: {
            prop1: Number,
            template: String,
          },
        });
        (NestedItem as unknown as IConfigurationComponent).$_optionName = 'items';
        (NestedItem as unknown as IConfigurationComponent).$_isCollectionItem = true;

        const vm = defineComponent({
          template: `<test-component>
                                <nested-item>
                                    <div>1</div>
                                </nested-item>
                            </test-component>`,
          components: {
            TestComponent,
            NestedItem,
          },
        });

        mount(vm);

        const { integrationOptions } = WidgetClass.mock.calls[0][1];
        expect(integrationOptions.templates['items[0].template']).toBeDefined();
        expect(typeof integrationOptions.templates['items[0].template'].render).toBe('function');
      });

      it('passes node of nested component as template (exclude nested component)', () => {
        const NestedItem = createConfigurationComponent({
          props: {
            prop1: Number,
            template: String,
          },
        });
        (NestedItem as unknown as IConfigurationComponent).$_optionName = 'items';
        (NestedItem as unknown as IConfigurationComponent).$_isCollectionItem = true;

        const vm = defineComponent({
          template: `<test-component>
                                <nested-item>
                                    <nested-item></nested-item>
                                    <div>1</div>
                                </nested-item>
                            </test-component>`,
          components: {
            TestComponent,
            NestedItem,
          },
        });

        mount(vm);

        const { integrationOptions } = WidgetClass.mock.calls[0][1];
        expect(integrationOptions.templates['items[0].template']).toBeDefined();
        expect(typeof integrationOptions.templates['items[0].template'].render).toBe('function');
      });

      it('passes node of nested component as template (tree of components)', () => {
        const NestedItem = createConfigurationComponent({
          props: {
            prop1: Number,
            template: String,
          },
        });
        (NestedItem as unknown as IConfigurationComponent).$_optionName = 'items';
        (NestedItem as unknown as IConfigurationComponent).$_isCollectionItem = true;

        const vm = defineComponent({
          template: `<test-component>
                                <nested-item>
                                    <nested-item>
                                        <div>1</div>
                                    </nested-item>
                                    <div>1</div>
                                </nested-item>
                            </test-component>`,
          components: {
            TestComponent,
            NestedItem,
          },
        });

        mount(vm);

        const { integrationOptions } = WidgetClass.mock.calls[0][1];
        expect(integrationOptions.templates['items[0].template']).toBeDefined();
        expect(typeof integrationOptions.templates['items[0].template'].render).toBe('function');
        expect(integrationOptions.templates['items[0].items[0].template']).toBeDefined();
        expect(typeof integrationOptions.templates['items[0].items[0].template'].render).toBe('function');
      });

      it('doesn\'t pass integrationOptions to widget if template prop is absent', () => {
        const NestedItem = createConfigurationComponent({
          props: {
            prop1: Number,
          },
        });
        (NestedItem as unknown as IConfigurationComponent).$_optionName = 'items';
        (NestedItem as unknown as IConfigurationComponent).$_isCollectionItem = true;

        const vm = defineComponent({
          template: `<test-component>
                                <nested-item>
                                    <div>1</div>
                                </nested-item>
                            </test-component>`,
          components: {
            TestComponent,
            NestedItem,
          },
        });

        mount(vm);

        const { integrationOptions } = WidgetClass.mock.calls[0][1];

        expect(integrationOptions).toBeDefined();
        expect(integrationOptions.templates).toBeUndefined();
      });

      it('renders template containing text only (vue 3)', () => {
        const NestedItem = createConfigurationComponent({
          props: {
            prop1: Number,
            template: String,
          },
        });
        (NestedItem as unknown as IConfigurationComponent).$_optionName = 'item';

        const wrapper = defineComponent({
          template: `<test-component>
                                <nested-item>
                                    <template #default>abc</template>
                                </nested-item>
                            </test-component>`,
          components: {
            TestComponent,
            NestedItem,
          },
        });

        mount(wrapper);

        const renderedTemplate = renderTemplate('item.template');

        expect(renderedTemplate.textContent).toBe('abc');
      });

      it('doesn\'t pass template to integrationOptions if nested item has hidden sub nested item', () => {
        const NestedItem = createConfigurationComponent({
          props: {
            prop1: Number,
            template: String,
          },
        });
        (NestedItem as unknown as IConfigurationComponent).$_optionName = 'items';
        (NestedItem as unknown as IConfigurationComponent).$_isCollectionItem = true;

        const SubNested = buildTestConfigCtor();
        (SubNested as IConfigurationComponent).$_optionName = 'subNestedOption';

        const vm = defineComponent({
          template: `<test-component>
                                <nested-item>
                                    <sub-nested v-if="showNest" prop2="abc"/>
                                </nested-item>
                            </test-component>`,
          components: {
            TestComponent,
            SubNested,
            NestedItem,
          },
        });

        mount(vm);

        expect(WidgetClass.mock.calls[0][1].integrationOptions.templates).toBeUndefined();
      });

      it('doesn\'t pass template to integrationOptions if nested item has comment', () => {
        const NestedItem = createConfigurationComponent({
          props: {
            prop1: Number,
            template: String,
          },
        });
        (NestedItem as unknown as IConfigurationComponent).$_optionName = 'items';
        (NestedItem as unknown as IConfigurationComponent).$_isCollectionItem = true;

        const SubNested = buildTestConfigCtor();
        (SubNested as IConfigurationComponent).$_optionName = 'subNestedOption';

        const vm = defineComponent({
          template: `<test-component>
                                <nested-item>
                                    <!-- <div>test</div> -->
                                </nested-item>
                            </test-component>`,
          components: {
            TestComponent,
            NestedItem,
          },
        });

        mount(vm);

        expect(WidgetClass.mock.calls[0][1].integrationOptions.templates).toBeUndefined();
      });

      it('doesn\'t pass integrationOptions to widget if nested item has sub nested item', () => {
        const NestedItem = createConfigurationComponent({
          props: {
            prop1: Number,
            template: String,
          },
        });
        (NestedItem as unknown as IConfigurationComponent).$_optionName = 'items';
        (NestedItem as unknown as IConfigurationComponent).$_isCollectionItem = true;

        const SubNested = buildTestConfigCtor();
        (SubNested as IConfigurationComponent).$_optionName = 'subNestedOption';

        const vm = defineComponent({
          template: `<test-component>
                                <nested-item>
                                    <sub-nested prop2="abc"/>
                                </nested-item>
                            </test-component>`,
          components: {
            TestComponent,
            SubNested,
            NestedItem,
          },
        });

        mount(vm);

        expect(WidgetClass.mock.calls[0][1].integrationOptions.templates).toBeUndefined();
      });
    });
  });
  describe('extension component', () => {
    const ExtensionWidgetClass = jest.fn(createWidget);
    const TestExtensionComponent = createExtensionComponent({
      beforeCreate() {
        (this as unknown as IWidgetComponent).$_WidgetClass = ExtensionWidgetClass;
      },
      props: {
        prop: Array,
      },
    });

    it('renders once if mounted manually and targets self element', () => {
      const component = mount(TestExtensionComponent);

      const expectedElement = component.vm.$el;
      const actualElement = ExtensionWidgetClass.mock.calls[0][0];

      expect(ExtensionWidgetClass).toHaveBeenCalledTimes(1);
      expect(actualElement).toBe(expectedElement);
    });

    it('renders once without parent element and targets self element', () => {
      const vm = defineComponent({
        template: '<test-extension-component id="component" />',
        components: {
          TestExtensionComponent,
        },
      });

      const wrapper = mount(vm);

      const expectedElement = wrapper.getComponent('#component').vm.$el;
      const actualElement = ExtensionWidgetClass.mock.calls[0][0];

      expect(ExtensionWidgetClass).toHaveBeenCalledTimes(1);
      expect(actualElement).toBe(expectedElement);
    });

    it('renders once inside component and targets parent element', () => {
      const vm = defineComponent({
        template: `<test-component id="component">
                                <test-extension-component/>
                            </test-component>`,
        components: {
          TestComponent,
          TestExtensionComponent,
        },
      });

      mount(vm);

      const expectedElement = WidgetClass.mock.calls[0][0];
      const actualElement = ExtensionWidgetClass.mock.calls[0][0];

      expect(ExtensionWidgetClass).toHaveBeenCalledTimes(1);
      expect(actualElement).toBe(expectedElement);
    });

    it('should set extension flag when component mounted', () => {
      const getExtansionFlag = (componentInstance) => (getNodeOptions(componentInstance) as any as IExtension).$_isExtension;
      TestExtensionComponent.created = function () {
        expect(getExtansionFlag(this)).toBeFalsy();
      };
      TestExtensionComponent.mounted = function () {
        expect(getExtansionFlag(this)).toBeTruthy();
      };
      const vm = defineComponent({
        template: `<test-component id="component">
                                <test-extension-component/>
                            </test-component>`,
        components: {
          TestComponent,
          TestExtensionComponent,
        },
      });

      mount(vm);
    });

    it('should create two different components', () => {
      const vm = defineComponent({
        template: `<test-component>
                                <test-extension-component id="component1" :prop="[{ type: 'required' }]" />
                            </test-component>
                            <test-component>
                                <test-extension-component id="component2" :prop="[{ type: 'email' }]" />
                            </test-component>`,
        components: {
          TestComponent,
          TestExtensionComponent,
        },
      });

      const wrapper = mount(vm);
      const component1 = wrapper.getComponent('#component1');
      const component2 = wrapper.getComponent('#component2');

      expect((component1.vm as any).$_config._initialValues.prop[0]).toEqual({ type: 'required' });
      expect((component2.vm as any).$_config._initialValues.prop[0]).toEqual({ type: 'email' });
    });

    it('should remove extension component from dom', () => {
      let childCount;
      WidgetClass.mockImplementationOnce((element: HTMLElement, options: any) => {
        childCount = element.childElementCount;
        return createWidget(element, options);
      });

      mount(defineComponent({
        template: `<test-component>
                                <test-extension-component/>
                            </test-component>`,
        components: {
          TestComponent,
          TestExtensionComponent,
        },
      }));

      expect(childCount).toBe(0);
    });

    it('destroys correctly', () => {
      const component = mount(TestExtensionComponent);

      expect(component.unmount.bind(component)).not.toThrow();
    });
  });
});

describe('disposing', () => {
  it('call dispose', () => {
    const component = mount(TestComponent);

    component.unmount();

    expect(Widget.dispose).toBeCalled();
  });

  it('fires dxremove', () => {
    const handleDxRemove = jest.fn();
    const component = mount(TestComponent);

    events.on(component.vm.$el, 'dxremove', handleDxRemove);
    component.unmount();

    expect(handleDxRemove).toHaveBeenCalledTimes(1);
  });

  it('destroys correctly', () => {
    const component = mount(TestComponent);

    expect(component.unmount.bind(component)).not.toThrow();
  });
});

describe('children processing', () => {
  it.skip('should process children if they are wrapped to a bail container', () => {
    const Nested = buildTestConfigCtor();
    const config = new Configuration(
      () => undefined,
      null,
      {},
    );
    (Nested as IConfigurationComponent).$_optionName = 'nestedOption';
    const nestedVNode = createVNode(Nested);
    const vnode = renderSlot(
      { default: () => [nestedVNode] },
      'default',
      undefined,
      () => [h('comment')],
    );
    expect(vnode.patchFlag).toBe(PatchFlags.BAIL);
    pullConfigComponents([vnode], [], config);
    expect(nestedVNode).toHaveProperty('$_config');
  });
});
