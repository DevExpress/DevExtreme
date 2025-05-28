import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';

import DxSelectBox from '../../select-box';
import DxTextBox from '../../text-box';
import DxDropDownBox from '../../drop-down-box';

jest.setTimeout(1000);
beforeEach(() => {
  jest.clearAllMocks();
});

describe('template rendering', () => {
  it('field template rendered', () => {
    const vm = defineComponent({
      template:
                `<dx-select-box :data-source="dataSource" field-template="field" id="component">
                    <template #field="">
                        <dx-text-box value="text" />
                    </template>
                </dx-select-box >`,
      data() {
        return {
          dataSource: [{ ID: 1 }],
        };
      },
      components: {
        DxSelectBox,
        DxTextBox,
      },
    });
    const wrapper = mount(vm);
    expect(wrapper.getComponent('#component').vm.$el.children).toHaveLength(1);
  });

  it.only('T1291367', async () => {
    const component = defineComponent({
      template:
                '<dx-drop-down-box id="component" class="dropdown" v-model:opened="isOpened1" />',
      setup() {
        const isOpened1 = ref(false);

        return {
          isOpened1,
        };
      },
      components: {
        DxDropDownBox,
      },
    });

    const wrapper = mount(component);

    const componentContainer = wrapper.find('#component');

    expect(componentContainer.element.className.split(' ')).toContain('dropdown');

    await componentContainer.find('input').trigger('click');

    expect(componentContainer.element.className.split(' ')).toContain('dropdown');
  });
});
