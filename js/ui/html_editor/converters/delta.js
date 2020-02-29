import ConverterController from '../converterController';
import { getQuill } from '../quill_importer';
import { isFunction } from '../../../core/utils/type';

const ESCAPING_MAP = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
};

const LIST_BLOT_NAME = 'list';
const LIST_ITEM_BLOT_NAME = 'list-item';

class DeltaConverter {

    constructor() {
        this.TextBlot = getQuill().import('blots/text');
        this.BreakBlot = getQuill().import('blots/break');
    }

    setQuillInstance(quillInstance) {
        this.quillInstance = quillInstance;
    }

    toHtml() {
        if(!this.quillInstance) {
            return;
        }

        return this._isQuillEmpty() ?
            '' :
            this._convertHTML(this.quillInstance.scroll, 0, this.quillInstance.getLength(), true);
    }

    _isQuillEmpty() {
        const delta = this.quillInstance.getContents();

        return delta.length() === 1 && this._isDeltaEmpty(delta);
    }

    _isDeltaEmpty(delta) {
        return delta.reduce((__, { insert }) => insert.indexOf('\n') !== -1);
    }

    _convertHTML(blot, index, length, isRoot = false) {
        if(isFunction(blot.html)) {
            return blot.html(index, length);
        }

        if(blot instanceof this.TextBlot) {
            return this._escapeText(blot.value().slice(index, index + length));
        }

        if(blot.children) {
            if(blot.statics.blotName === LIST_BLOT_NAME) {
                return this._convertList(blot, index, length);
            }

            const parts = [];
            blot.children.forEachAt(index, length, (child, offset, childLength) => {
                parts.push(this._convertHTML(child, offset, childLength));
            });

            this._handleBreakLine(blot.children, parts);

            if(isRoot || blot.statics.blotName === LIST_ITEM_BLOT_NAME) {
                return parts.join('');
            }

            const { outerHTML, innerHTML } = blot.domNode;
            const [start, end] = outerHTML.split(`>${innerHTML}<`);

            return `${start}>${parts.join('')}<${end}`;
        }

        return blot.domNode.outerHTML;
    }

    _handleBreakLine(linkedList, parts) {
        if(linkedList.length === 1 && linkedList.head instanceof this.BreakBlot) {
            parts.push('<br>');
        }
    }

    _convertList(blot, index, length) {
        const items = [];
        const parentFormats = blot.formats();

        blot.children.forEachAt(index, length, (child, offset, childLength) => {
            const childFormats = child.formats();

            items.push({
                child,
                offset,
                length: childLength,
                indent: childFormats.indent || 0,
                type: parentFormats.list
            });
        });

        return this._getListMarkup(items, -1, []);
    }

    _getListMarkup(items, lastIndent, listTypes) {
        if(items.length === 0) {
            const endTag = this._getListType(listTypes.pop());

            if(lastIndent <= 0) {
                return `</li></${endTag}>`;
            }
            return this._processListMarkup([[], lastIndent - 1, listTypes], endTag);
        }

        const [{ child, offset, length, indent, type }, ...rest] = items;
        const tag = this._getListType(type);
        const childItemArgs = [child, offset, length];
        const restItemsArgs = [rest, indent, listTypes];

        if(indent > lastIndent) {
            listTypes.push(type);
            const multiLevelTags = this._correctListMultiIndent(listTypes, type, tag, indent - lastIndent - 1);

            return multiLevelTags + this._processIndentListMarkup(childItemArgs, restItemsArgs, tag);
        }

        if(indent === lastIndent) {
            return this._processIndentListMarkup(childItemArgs, restItemsArgs);
        }

        const endTag = this._getListType(listTypes.pop());
        return this._processListMarkup([items, lastIndent - 1, listTypes], endTag);
    }

    _correctListMultiIndent(listTypes, type, tag, indent) {
        let markup = '';

        while(indent) {
            markup += `<${tag}>`;
            listTypes.push(type);
            indent--;
        }

        return markup;
    }

    _processListMarkup(childItemArgs, tag) {
        return `</li></${tag}>${this._getListMarkup(...childItemArgs)}`;
    }

    _processIndentListMarkup(childItemArgs, restItemsArgs, tag = '/li') {
        const itemAttrs = this._getListItemAttributes(childItemArgs[0]);
        return `<${tag}><li${itemAttrs}>${this._convertHTML(...childItemArgs)}${this._getListMarkup(...restItemsArgs)}`;
    }

    _getListItemAttributes({ domNode }) {
        if(!domNode.hasAttributes()) {
            return '';
        }

        const { attributes } = domNode;
        let attributesString = ' ';

        for(let i = 0; i < attributes.length; i++) {
            let { name, value } = attributes[i];

            if(name === 'class') {
                value = this._removeIndentClass(value);
            }

            if(value.length) {
                attributesString += `${name}="${value}"`;
            }
        }

        return attributesString.length > 1 ? attributesString : '';
    }

    _getListType(type) {
        return type === 'ordered' ? 'ol' : 'ul';
    }

    _removeIndentClass(classString) {
        return classString.replace(/ql-indent-\d/g, '').trim();
    }

    _escapeText(text) {
        return text.replace(/[&<>"']/g, char => {
            return ESCAPING_MAP[char];
        });
    }
}

ConverterController.addConverter('delta', DeltaConverter);

export default DeltaConverter;
