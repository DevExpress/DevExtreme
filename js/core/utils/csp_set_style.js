import $ from '../renderer';
import domAdapter from '../dom_adapter';

export const setStyle = function(element, styleString) {
    styleString.split(';').forEach((style) => {
        const parts = style.split(':').map(stylePart => stylePart.trim());
        if(parts.length === 2) {
            const [property, value] = parts;
            const $element = $(element);
            if(!($element && domAdapter.isNode(element.style))) {
                element.style[property] = value;
            } else {
                $element.css(property, value);
            }
        }
    });
};
