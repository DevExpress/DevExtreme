export const COMPONENTS = [
  {
    path: 'button',
    name: 'Button',
    loadComponent: () => import('@external/button/angular/button.component').then((m) => m.ButtonComponent),
  },
  {
    path: 'inputs-list-in-form',
    name: 'InputsListInForm', 
    loadComponent: () => import('@external/inputs-list-in-form/angular/inputs-list-in-form.component').then((m) => m.InputsListInFormComponent),
  },
];

export function findComponentByPath(path: string) {
  return COMPONENTS.find((component) => component.path === path) || null;
}
