import Errors from '../widget/ui.errors';
import * as Diagram from 'devexpress-diagram';

function getDiagram() {
    if(!Diagram.DiagramCommand) {
        throw Errors.Error('E1041', 'devexpress-diagram');
    }

    return Diagram;
}

export { getDiagram };
