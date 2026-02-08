const COMPONENTS = [
    {
      path: 'button',
      name: 'Button',
      component: () => import('@examples/button/vue3/index.vue')
    },
    {
      path: 'inputs-list-in-form',
      name: 'InputsListInForm',
      component: () => import('@examples/inputs-list-in-form/vue3/index.vue')
    },
    {
      path: 'select-box-nested-validator',
      name: 'SelectBoxNestedValidator',
      component: () => import('@examples/select-box-nested-validator/vue3/index.vue')
    },
    {
      path: 'text-box-dynamic-styles',
      name: 'TextBoxDynamicStyles',
      component: () => import('@examples/text-box-dynamic-styles/vue3/index.vue')
    }
  ];

export default COMPONENTS; 
