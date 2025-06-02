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
    }
  ];

export default COMPONENTS; 
