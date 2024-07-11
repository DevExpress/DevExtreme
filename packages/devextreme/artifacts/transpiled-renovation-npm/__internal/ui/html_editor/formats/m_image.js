"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _type = require("../../../../core/utils/type");
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line import/no-mutable-exports
let ExtImage = {};
if (_devextremeQuill.default) {
  const Image = _devextremeQuill.default.import('formats/image');
  ExtImage = class ExtImage extends Image {
    static create(data) {
      const SRC = data && data.src || data;
      const node = super.create(SRC);
      if ((0, _type.isObject)(data)) {
        const setAttribute = (attr, value) => {
          data[attr] && node.setAttribute(attr, value);
        };
        // @ts-expect-error
        setAttribute('alt', data.alt);
        // @ts-expect-error
        setAttribute('width', data.width);
        // @ts-expect-error
        setAttribute('height', data.height);
      }
      return node;
    }
    static formats(domNode) {
      const formats = super.formats(domNode);
      formats.imageSrc = domNode.getAttribute('src');
      return formats;
    }
    formats() {
      const formats = super.formats();
      const floatValue = this.domNode.style.float;
      if (floatValue) {
        formats.float = floatValue;
      }
      return formats;
    }
    format(name, value) {
      if (name === 'float') {
        this.domNode.style[name] = value;
      } else {
        super.format(name, value);
      }
    }
    static value(domNode) {
      return {
        src: domNode.getAttribute('src'),
        width: domNode.getAttribute('width'),
        height: domNode.getAttribute('height'),
        alt: domNode.getAttribute('alt')
      };
    }
  };
  // @ts-expect-error
  ExtImage.blotName = 'extendedImage';
}
var _default = exports.default = ExtImage;