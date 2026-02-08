import { createRouter, createWebHistory } from 'vue-router';
import COMPONENTS from '../utils/componentFinder';

const routes = [
  ...COMPONENTS.map(component => ({
    path: `/examples/${component.path}`,
    name: `Example ${component.name}`,
    component: () => import('../pages/ComponentView.vue'),
    props: { componentInfo: component }
  }))
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router; 