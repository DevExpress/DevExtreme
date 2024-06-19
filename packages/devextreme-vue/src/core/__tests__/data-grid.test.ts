import { mount } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';

import { DxColumn, DxDataGrid } from '../../data-grid';

jest.setTimeout(1000);
beforeEach(() => {
  jest.clearAllMocks();
});

describe('data grid', () => {
  it('vmodel should work correctly for nested components', async () => {
    expect.assertions(2);
    const vm = defineComponent({
      template:
                `<DxDataGrid
                id="grid"
                ref="data-grid"
                :form-data="data"
              >
                <DxColumn
                  v-model:visible="visible1"
                  data-field="prop"
                />
                <DxColumn
                  v-model:visible="visible2"
                  data-field="prop2"
                />
              </DxDataGrid>`,
      components: {
        DxDataGrid,
        DxColumn,
      },
      data() {
        return {
          visible1: true,
          visible2: true,
        };
      },
      props: {
        data: {
          type: Object,
          default: [
            { prop: 'test1', prop2: 'test1' },
            { prop: 'test2', prop2: 'test2' },
          ],
        },
      },
    });

    const wrapper = mount(vm);
    const instance = (wrapper.getComponent('#grid').vm as any).$_instance;
    instance.option('columns[0].visible', false);

    await nextTick(() => {
      instance.option('columns[1].visible', false);
    });

    await nextTick(() => {
      expect(wrapper.vm.visible1).toBe(false);
      expect(wrapper.vm.visible2).toBe(false);
    });
  });
});
