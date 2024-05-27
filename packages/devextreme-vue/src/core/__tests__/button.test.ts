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
});
