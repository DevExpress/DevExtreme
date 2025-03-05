import { mount } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';

import { IConfigurable } from '../configuration-component';

import DxTextBox from '../../text-box';

jest.setTimeout(1000);
beforeEach(() => {
  jest.clearAllMocks();
});

describe('two-way binding', () => {
  it('v-model works correctly', async () => {
    expect.assertions(1);
    const vm = defineComponent({
      template:
                `<dx-text-box id="component1" v-model="testValue"></dx-text-box>
                 <dx-text-box id="component2" v-model="testValue"></dx-text-box>
                `,
      components: {
        DxTextBox,
      },
      data() {
        return {
          testValue: 'value',
        };
      },
    });
    const wrapper = mount(vm);
    const component = wrapper.getComponent('#component2').vm as any as IConfigurable;
    component.$_config.updateValue = jest.fn();
    wrapper.getComponent('#component1').vm.$emit('update:modelValue', 'newValue');
    await nextTick(() => {
      expect(component.$_config.updateValue).toBeCalled();
    });
  });

  it('v-model with argument works correctly', async () => {
    expect.assertions(1);
    const vm = defineComponent({
      template:
                `<dx-text-box id="component1" v-model:value="testValue"></dx-text-box>
                 <dx-text-box id="component2" v-model:value="testValue"></dx-text-box>
                `,
      components: {
        DxTextBox,
      },
      props: {
        testValue: String,
      },
    });
    const wrapper = mount(vm);
    const component = wrapper.getComponent('#component2').vm as any as IConfigurable;
    component.$_config.updateValue = jest.fn();
    await wrapper.setProps({ testValue: 'test' });
    await nextTick(() => {
      expect(component.$_config.updateValue).toBeCalled();
    });
  });

  it('dxClass should be set when class attr ', async () => {
    expect.assertions(1);
    const vm = defineComponent({
      template:
                `<dx-text-box id="component" :class="customClass"></dx-text-box>
                `,
      components: {
        DxTextBox,
      },
      props: {
        customClass: {
          type: String,
          default: 'custom1',
        },
      },
    });
    const wrapper = mount(vm);
    const component = wrapper.getComponent('#component');
    await wrapper.setProps({ customClass: 'custom2' });
    await nextTick(() => {
      expect(component.element.classList.toString()).toBe('custom2 dx-show-invalid-badge dx-textbox dx-texteditor dx-editor-outlined dx-texteditor-empty dx-widget');
    });
  });

  it('dxClass should be set when class attr is undefined', async () => {
    expect.assertions(1);
    const vm = defineComponent({
      template:
                `<dx-text-box id="component" :class="{custom: customClass}"></dx-text-box>
                `,
      components: {
        DxTextBox,
      },
      props: {
        customClass: {
          type: String,
          default: true,
        },
      },
    });
    const wrapper = mount(vm);
    const component = wrapper.getComponent('#component');
    await wrapper.setProps({ customClass: false });
    await nextTick(() => {
      expect(component.element.classList.toString()).toBe('dx-show-invalid-badge dx-textbox dx-texteditor dx-editor-outlined dx-texteditor-empty dx-widget');
    });
  });
});
