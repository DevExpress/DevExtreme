import { getQuill } from '../quill_importer';
import { ensureDefined } from '../../../core/utils/common';
import { extend } from '../../../core/utils/extend';

const quill = getQuill();
const Embed = quill.import('blots/embed');

const VARIABLE_CLASS = 'dx-variable';

class Variable extends Embed {
    static create(data) {
        const node = super.create();
        let startEscapeChar;
        let endEscapeChar;
        const text = data.value;

        if(Array.isArray(data.escapeChar)) {
            startEscapeChar = ensureDefined(data.escapeChar[0], '');
            endEscapeChar = ensureDefined(data.escapeChar[1], '');
        } else {
            startEscapeChar = endEscapeChar = data.escapeChar;
        }

        node.innerText = startEscapeChar + text + endEscapeChar;
        node.dataset.varStartEscChar = startEscapeChar;
        node.dataset.varEndEscChar = endEscapeChar;
        node.dataset.varValue = data.value;

        return node;
    }

    static value(node) {
        return extend({}, {
            value: node.dataset.varValue,
            escapeChar: [
                node.dataset.varStartEscChar || '',
                node.dataset.varEndEscChar || ''
            ]
        });
    }
}

Variable.blotName = 'variable';
Variable.tagName = 'span';
Variable.className = VARIABLE_CLASS;

export default Variable;
