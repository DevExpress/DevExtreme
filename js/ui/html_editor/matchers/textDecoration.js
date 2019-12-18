import { extend } from '../../../core/utils/extend';
import { isObject } from '../../../core/utils/type';

function getMatcher(quill) {
    const Delta = quill.import('delta');
    const applyFormat = function(delta, format, value) {
        if(isObject(format)) {
            return Object.keys(format).reduce((newDelta, key) => {
                return applyFormat(newDelta, key, format[key]);
            }, delta);
        }

        return delta.reduce((newDelta, op) => {
            const { attributes, insert } = op;

            if(attributes && attributes[format]) {
                return newDelta.push(op);
            }

            return newDelta.insert(
                insert,
                extend({}, { [format]: value }, attributes)
            );
        }, new Delta());
    };

    return (node, delta) => {
        const formats = {};
        const { textDecoration } = node.style || {};
        const isLineThrough = textDecoration && textDecoration.indexOf('line-through') !== -1;
        const isUnderline = textDecoration && textDecoration.indexOf('underline') !== -1;

        if(isLineThrough) {
            formats.strike = true;
        }

        if(isUnderline) {
            formats.underline = true;
        }

        if(isLineThrough || isUnderline) {
            delta = applyFormat(delta, formats);
        }

        return delta;
    };
}

export default getMatcher;
