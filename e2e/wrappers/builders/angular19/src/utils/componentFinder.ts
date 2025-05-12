export const COMPONENTS = [
  {
    path: 'button',
    name: 'Button',
    loadComponent: () => import('@external/button/angular/button.component').then((m) => m.ButtonComponent),
  },
];

export function findComponentByPath(path: string) {
  return COMPONENTS.find((component) => component.path === path) || null;
}
