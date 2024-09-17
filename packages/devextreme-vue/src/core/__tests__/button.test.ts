import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import DxButton from '../../button';

jest.setTimeout(1000);
beforeEach(() => {
  jest.clearAllMocks();
});

describe('template rendering', () => {
  it('should render a template with child router-view', async () => {
    const appView = defineComponent({
      template:
                `<dx-button id="component">
                    <template #content>
                        <router-view name="test"></router-view>
                    </template>
                </dx-button>`,
      components: {
        DxButton,
      },
    });
    const rootView = defineComponent({
      template: `
                <router-view></router-view>
            `,
    });

    const testView = defineComponent({
      template: `
                <div class="test">text</div>
            `,
    });

    const router = createRouter({
      routes: [
        {
          name: 'rootview',
          path: '/',
          component: appView,
          redirect: '/test',
          children: [
            {
              name: 'testview',
              path: '/test',
              components: { test: testView },
            },
          ],
        },
        {
          path: '/:pathMatch(.*)*',
          redirect: '/',
        },
      ],
      history: createWebHistory(),
    });
    await router.push('/');
    await router.isReady();
    const wrapper = mount(rootView, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.vm.$el.getElementsByClassName('test')).toHaveLength(1);
  });

  fit('should unmount template with two childs in root without exception', async () => {
    const appView = defineComponent({
      props: {
        templateName: {
          type: String,
          value: 'tpl1'
        }
      },
      template:
          `<dx-button id="component" :template="templateName">
                    <template #tpl1>
                      <div>1</div>
                      <div>2</div>
                    </template>
                    <template #tpl2>
                      <div>3</div>
                      <div>4</div>
                    </template>
          </dx-button>`,
      components: {
        DxButton,
      },
    });


    const wrapper = mount(appView, {props: {templateName: 'tpl1'}});

    expect(() => wrapper.setProps({templateName: 'tpl2'})).not.toThrow();
  })
});
