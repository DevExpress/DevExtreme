import Errors from '../widget/ui.errors';
import Diagram from 'devexpress-diagram';

export function getDiagram() {
    if(!Diagram) {
        throw Errors.Error('E1041', 'devexpress-diagram');
    }
    return Diagram;
}
