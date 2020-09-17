import Errors from '../widget/ui.errors';
import DiagramDefault, * as Diagram from 'devexpress-diagram';

export function getDiagram() {
    if(!DiagramDefault) {
        throw Errors.Error('E1041', 'devexpress-diagram');
    }
    return Diagram;
}
