import typeUtils from "../../core/utils/type";

const XlsxTagUtils = {
    toXmlString: function(tagName, attributes, content) {
        var result = "<" + tagName,
            i,
            length = attributes.length,
            attr;

        for(i = 0; i < length; i++) {
            attr = attributes[i];
            if(typeUtils.isDefined(attr.value)) {
                result = result + " " + attr.name + "=\"" + attr.value + "\"";
            }
        }

        return typeUtils.isDefined(content) ? result + ">" + content + "</" + tagName + ">" : result + " />";
    }
};

export default XlsxTagUtils;
