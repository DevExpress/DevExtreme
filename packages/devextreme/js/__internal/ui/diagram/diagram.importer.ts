import errors from '@js/ui/widget/ui.errors';
import DiagramDefault, * as Diagram from 'devexpress-diagram';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDiagram(): any {
  if (!DiagramDefault) {
    throw errors.Error('E1041', 'devexpress-diagram');
  }
  return Diagram;
}
