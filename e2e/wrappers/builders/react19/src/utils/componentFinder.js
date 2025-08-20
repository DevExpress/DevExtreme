const COMPONENTS = [
  {
    path: 'button',
    name: 'Button',
    component: () => import('@examples/button/react19/index.jsx')
  },
  {
    path: 'inputs-list-in-form',
    name: 'InputsListInForm',
    component: () => import('@examples/inputs-list-in-form/react19/index.jsx')
  },
  {
    path: 'text-box-dynamic-styles',
    name: 'TextBoxDynamicStyles',
    component: () => import('@examples/text-box-dynamic-styles/react19/index.jsx')
  },
];

export function getAllComponents() {
  return COMPONENTS;
}

export function findComponentByPath(path) {
  return COMPONENTS.find(component => component.path === path) || null;
}
