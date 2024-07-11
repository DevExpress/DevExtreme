"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _type = require("../../../../core/utils/type");
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line import/no-mutable-exports
let ExtLink = {};
if (_devextremeQuill.default) {
  const Link = _devextremeQuill.default.import('formats/link');
  ExtLink = class ExtLink extends Link {
    static create(data) {
      const HREF = (data === null || data === void 0 ? void 0 : data.href) ?? data;
      const node = super.create(HREF);
      if ((0, _type.isObject)(data)) {
        // @ts-expect-error
        if (data.text) {
          // @ts-expect-error
          node.innerText = data.text;
        }
        // @ts-expect-error
        if (!data.target) {
          node.removeAttribute('target');
        }
      }
      return node;
    }
    static formats(domNode) {
      return {
        href: domNode.getAttribute('href'),
        target: domNode.getAttribute('target')
      };
    }
    formats() {
      const formats = super.formats();
      const {
        href,
        target
      } = ExtLink.formats(this.domNode);
      formats.link = href;
      formats.target = target;
      return formats;
    }
    format(name, value) {
      if (name === 'link' && (0, _type.isObject)(value)) {
        // @ts-expect-error
        if (value.text) {
          // @ts-expect-error
          this.domNode.innerText = value.text;
        }
        // @ts-expect-error
        if (value.target) {
          this.domNode.setAttribute('target', '_blank');
        } else {
          this.domNode.removeAttribute('target');
        }
        // @ts-expect-error
        this.domNode.setAttribute('href', value.href);
      } else {
        super.format(name, value);
      }
    }
    static value(domNode) {
      return {
        href: domNode.getAttribute('href'),
        text: domNode.innerText,
        target: !!domNode.getAttribute('target')
      };
    }
  };
}
var _default = exports.default = ExtLink;