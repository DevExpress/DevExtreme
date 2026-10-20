import { ensureDefined } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import Quill from 'devextreme-quill';

import type { EmbedBlotConstructor, QuillDependent, VariableData } from '../types';

/** The `variable` blot class */
interface VariableBlotConstructor extends EmbedBlotConstructor<VariableData> {
  create: (data: VariableData) => HTMLElement;
  value: (node: HTMLElement) => VariableData;
}

// eslint-disable-next-line import/no-mutable-exports
let VariableFormat: QuillDependent<VariableBlotConstructor> = {};

if (Quill) {
  const Embed: EmbedBlotConstructor<VariableData> = Quill.import('blots/embed');

  const VARIABLE_CLASS = 'dx-variable';

  VariableFormat = class Variable extends Embed {
    static create(data: VariableData): HTMLElement {
      const node = super.create();
      // eslint-disable-next-line @typescript-eslint/init-declarations -- set in the if/else below
      let startEscapeChar: string;
      // eslint-disable-next-line @typescript-eslint/init-declarations -- set in the if/else below
      let endEscapeChar: string;
      const text = data.value;

      if (Array.isArray(data.escapeChar)) {
        startEscapeChar = ensureDefined(data.escapeChar[0], '');
        endEscapeChar = ensureDefined(data.escapeChar[1], '');
      } else {
        endEscapeChar = data.escapeChar;
        startEscapeChar = endEscapeChar;
      }

      node.innerText = startEscapeChar + text + endEscapeChar;
      node.dataset.varStartEscChar = startEscapeChar;
      node.dataset.varEndEscChar = endEscapeChar;
      node.dataset.varValue = data.value;

      return node;
    }

    static value(node: HTMLElement): VariableData {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- extend() is untyped
      return extend({}, {
        value: node.dataset.varValue,
        escapeChar: [
          node.dataset.varStartEscChar ?? '',
          node.dataset.varEndEscChar ?? '',
        ],
      });
    }
  };
  VariableFormat.blotName = 'variable';
  VariableFormat.tagName = 'span';
  VariableFormat.className = VARIABLE_CLASS;
}

export default VariableFormat;
