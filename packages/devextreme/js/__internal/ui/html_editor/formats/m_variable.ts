import { ensureDefined } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import Quill from 'devextreme-quill';

// eslint-disable-next-line import/no-mutable-exports
let Variable = {};

if (Quill) {
  const Embed = Quill.import('blots/embed');

  const VARIABLE_CLASS = 'dx-variable';

  Variable = class Variable extends Embed {
    static create(data) {
      const node = super.create();
      let startEscapeChar;
      let endEscapeChar;
      const text = data.value;

      if (Array.isArray(data.escapeChar)) {
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
          node.dataset.varEndEscChar || '',
        ],
      });
    }
  };
  // @ts-expect-error
  Variable.blotName = 'variable';
  // @ts-expect-error
  Variable.tagName = 'span';
  // @ts-expect-error
  Variable.className = VARIABLE_CLASS;
}

export default Variable;
