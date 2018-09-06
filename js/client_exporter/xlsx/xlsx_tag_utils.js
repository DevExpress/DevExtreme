import typeUtils from '../../core/utils/type';

const XlsxTagUtils = {
    toXml: function(tagName, attributes, content) {
        var result = ['<', tagName];

        for(let i = 0; i < attributes.length; i++) {
            const attr = attributes[i];
            if(typeUtils.isDefined(attr.value)) {
                result.push(' ', attr.name, '="', attr.value, '"');
            }
        }

        if(typeUtils.isDefined(content)) {
            result.push('>', content, '</', tagName, '>');
        } else {
            result.push(' />');
        }

        return result.join('');
    }
};

export default XlsxTagUtils;
