import typeUtils from "../../core/utils/type";

class XlsxTagUtils {
    static toXmlString(tagName, attributes, content) {
        var result = "<" + tagName,
            i,
            length = attributes.length,
            attr;

        for(i = 0; i < length; i++) {
            attr = attributes[i];
            if(typeUtils.isDefined(attr.value)) { // pass 'empty string' as value to get 'v=""', pass 'undefined/null' to exclude
                result = result + " " + attr.name + "=\"" + attr.value + "\"";
            }
        }

        return typeUtils.isDefined(content) ? result + ">" + content + "</" + tagName + ">" : result + " />"; // pass 'empty string' as content to get '<v></v>', pass 'undefined/null' to to get '<v />'
    }

    static toXmlStringArray(/* the 'toXmlString' method is expected in each item */ items) {
        const xmlStringsArray = [];
        items.forEach(function(item) {
            const xmlString = item.toXmlString();
            if(xmlString) {
                xmlStringsArray.push(xmlString);
            }
        });
        return xmlStringsArray;
    }
}

module.exports = XlsxTagUtils;
