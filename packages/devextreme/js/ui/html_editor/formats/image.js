import Quill from 'devextreme-quill';
import { isObject } from '../../../core/utils/type';

let ExtImage = {};

if(Quill) {
    const Image = Quill.import('formats/image');

    ExtImage = class ExtImage extends Image {
        static create(data) {
            const SRC = data && data.src || data;
            const node = super.create(SRC);

            if(isObject(data)) {
                const setAttribute = (attr, value) => {
                    data[attr] && node.setAttribute(attr, value);
                };

                setAttribute('alt', data.alt);
                setAttribute('width', data.width);
                setAttribute('height', data.height);
            }

            return node;
        }

        static formats(domNode) {
            const formats = super.formats(domNode);

            formats['imageSrc'] = domNode.getAttribute('src');

            return formats;
        }

        formats() {
            const formats = super.formats();
            const floatValue = this.domNode.style['float'];

            if(floatValue) {
                formats['float'] = floatValue;
            }

            return formats;
        }

        format(name, value) {
            if(name === 'float') {
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

    ExtImage.blotName = 'extendedImage';
}

export default ExtImage;
