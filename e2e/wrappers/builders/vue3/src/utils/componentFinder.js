const componentModules = import.meta.glob('../../../examples/**/vue3/index.vue');

const COMPONENTS = [
    {
      path: 'button',
      name: 'Button',
      component: () => import('@examples/button/vue/index.vue')
    }
  ];

console.log('Component Modules:', componentModules);
export default COMPONENTS; 