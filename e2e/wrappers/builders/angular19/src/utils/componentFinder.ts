export const COMPONENTS = [
  {
    path: 'button',
    name: 'Button',
    component: import('@external/button/angular19/button.component').then((m) => m.ButtonComponent),
  },
  {
    path: 'inputs-list-in-form',
    name: 'InputsListInForm',
    component: import('@external/inputs-list-in-form/angular19/inputs-list-in-form.component').then((m) => m.InputsListInFormComponent),
  },
];

export function findComponentByPath(path: string) {
  return COMPONENTS.find((component) => component.path === path) || null;
}
