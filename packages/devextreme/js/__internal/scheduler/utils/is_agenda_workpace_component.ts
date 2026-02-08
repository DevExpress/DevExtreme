const workspaceAgendaComponentName = 'dxSchedulerAgenda';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isAgendaWorkspaceComponent(component): boolean {
  return component.NAME === workspaceAgendaComponentName;
}
