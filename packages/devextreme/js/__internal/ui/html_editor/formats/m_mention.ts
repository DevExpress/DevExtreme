import $ from '@js/core/renderer';
import type { TemplateBase } from '@ts/core/templates/template_base';
import Quill from 'devextreme-quill';

import type {
  EmbedBlotConstructor,
  MentionData,
  MentionTemplateKey,
  QuillDependent,
} from '../types';
import type { ScrollInstance } from '../types/quill';
import TemplatesStorage from '../utils/m_templates_storage';

/** The `mention` blot class */
interface MentionBlotConstructor extends EmbedBlotConstructor<MentionData> {
  create: (data: MentionData) => HTMLElement;
  value: (node: HTMLElement) => MentionData;
  addTemplate: (data: MentionTemplateKey, template: TemplateBase) => void;
  removeTemplate: (data: MentionTemplateKey) => void;
  _templatesStorage: TemplatesStorage;
}

// eslint-disable-next-line import/no-mutable-exports
let MentionFormat: QuillDependent<MentionBlotConstructor> = {};

if (Quill) {
  const Embed: EmbedBlotConstructor<MentionData> = Quill.import('blots/embed');
  const MENTION_CLASS = 'dx-mention';

  MentionFormat = class Mention extends Embed {
    declare static _templatesStorage: TemplatesStorage;

    constructor(scroll: ScrollInstance, node: HTMLElement) {
      super(scroll, node);
      this.renderContent(this.contentNode, Mention.value(node));
    }

    static create(data: MentionData): HTMLElement {
      const node = super.create();

      node.setAttribute('spellcheck', 'false');
      node.dataset.marker = data.marker;
      node.dataset.mentionValue = data.value;
      node.dataset.id = data.id;

      return node;
    }

    static value(node: HTMLElement): MentionData {
      return {
        marker: node.dataset.marker,
        id: node.dataset.id,
        value: node.dataset.mentionValue,
      };
    }

    renderContent(node: HTMLElement, data: MentionData): void {
      const template = Mention._templatesStorage.get({
        editorKey: data.keyInTemplateStorage,
        marker: data.marker,
      });

      if (template) {
        template.render({
          model: data,
          container: node,
        });
      } else {
        this.baseContentRender(node, data);
      }
    }

    baseContentRender(node: HTMLElement, data: MentionData): void {
      // @ts-expect-error text() rejects undefined; a raw dx-mention node may lack data-marker
      const $marker = $('<span>').text(data.marker);

      $(node)
        .append($marker)
        // @ts-expect-error append() rejects undefined; a raw dx-mention node may lack the value
        .append(data.value);
    }

    static addTemplate(data: MentionTemplateKey, template: TemplateBase): void {
      this._templatesStorage.set(data, template);
    }

    static removeTemplate(data: MentionTemplateKey): void {
      this._templatesStorage.delete(data);
    }
  };
  MentionFormat.blotName = 'mention';
  MentionFormat.tagName = 'span';
  MentionFormat.className = MENTION_CLASS;
  MentionFormat._templatesStorage = new TemplatesStorage();
}

export default MentionFormat;
