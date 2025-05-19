export const COMPONENTS = [
  {
    path: 'button',
    name: 'Button',
    component: import('@external/button/angular19/button.component').then((m) => m.ButtonComponent),
  },
];

export function findComponentByPath(path: string) {
  return COMPONENTS.find((component) => component.path === path) || null;
}
