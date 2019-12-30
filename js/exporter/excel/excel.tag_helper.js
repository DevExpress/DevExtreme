import { isDefined } from '../../core/utils/type';

const tagHelper = {
    toXml: function(tagName, attributes, content) {
        const result = ['<', tagName];

        for(const attributeName in attributes) {
            const attributeValue = attributes[attributeName];
            if(isDefined(attributeValue)) {
                result.push(' ', attributeName, '="', attributeValue, '"');
            }
        }

        if(isDefined(content) && content !== '') {
            result.push('>', content, '</', tagName, '>');
        } else {
            result.push(' />');
        }

        return result.join('');
    }
};

export default tagHelper;
