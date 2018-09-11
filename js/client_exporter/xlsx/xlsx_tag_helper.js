import typeUtils from '../../core/utils/type';

const xlsxTagHelper = {
    toXml: function(tagName, attributes, content) {
        var result = ['<', tagName];

        for(const attributeName in attributes) {
            const attributeValue = attributes[attributeName];
            if(typeUtils.isDefined(attributeValue)) {
                result.push(' ', attributeName, '="', attributeValue, '"');
            }
        }

        if(typeUtils.isDefined(content) && content !== "") {
            result.push('>', content, '</', tagName, '>');
        } else {
            result.push(' />');
        }

        return result.join('');
    }
};

export default xlsxTagHelper;
