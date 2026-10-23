import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';

import DxSelectBox from '../../select-box';
import DxTextBox from '../../text-box';

jest.setTimeout(1000);
beforeEach(() => {
  jest.clearAllMocks();
});

describe('template rendering', () => {
  it('field addons template rendered', () => {
    const vm = defineComponent({
      template:
                `<dx-select-box :data-source="dataSource" :field-addons="{ beforeTemplate: 'field' }" id="component">
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
    expect(wrapper.findAll('.dx-dropdowneditor-field-before-template-wrapper .dx-textbox')).toHaveLength(1);
  });
});
