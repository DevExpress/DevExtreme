const COMPONENTS = [
  {
    path: 'button',
    name: 'Button',
    component: () => import('@examples/button/react19/index.jsx')
  }
];

export function getAllComponents() {
  return COMPONENTS;
}

export function findComponentByPath(path) {
  return COMPONENTS.find(component => component.path === path) || null;
}
